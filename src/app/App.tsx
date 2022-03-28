import React, { useState, useEffect } from 'react';
import * as tf from '@tensorflow/tfjs';
import '@tensorflow/tfjs-backend-webgl';
const blazeface = require('@tensorflow-models/blazeface');

const App: React.FC = (props) => {
	const [video, setVideo] = useState<HTMLVideoElement | any>(null);
	let model: any;

	useEffect(() => {
		const _video: HTMLVideoElement | any = document.getElementById('face-video');
		const _canvas: HTMLCanvasElement | any = document.getElementById('face-canvas');

		(async () => {
			await navigator.mediaDevices
				.getUserMedia({
					video: { width: 600, height: 400 },
					audio: false,
				})
				.then((stream) => {
					_video.srcObject = stream;
					_video.addEventListener('loadeddata', async () => {
						model = await blazeface.load();
						setInterval(() => {
							detectFaces(_video, _canvas);
						}, 100);
					});

					setVideo(_video);
				});
		})();
	}, []);

	const detectFaces = async (i_video: HTMLVideoElement, i_canvas: HTMLCanvasElement) => {
		const prediction = await model.estimateFaces(i_video, false);
		const _ctx: any = i_canvas.getContext('2d');

		_ctx.drawImage(i_video, 0, 0, 600, 400);

		prediction.forEach((pred: any) => {
			_ctx.beginPath();
			_ctx.lineWidth = '4';
			_ctx.strokeStyle = 'red';
			_ctx.rect(pred.topLeft[0], pred.topLeft[1], pred.bottomRight[0] - pred.topLeft[0], pred.bottomRight[1] - pred.topLeft[1]);
			_ctx.stroke();

			_ctx.fillStyle = 'red';
			pred.landmarks.forEach((landmark: any) => {
				_ctx.fillRect(landmark[0], landmark[1], 5, 5);
			});
		});
	};

	return (
		<div>
			<h1>Face detection</h1>
			<video id='face-video' autoPlay={true} style={{ display: 'none' }}></video>
			<canvas id='face-canvas' width='600px' height='400px'></canvas>
		</div>
	);
};

export default App;
