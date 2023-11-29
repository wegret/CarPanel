<template>
	<view class="content">
		<canvas class="WaveCanvas-container" canvas-id="Waveform-canvas" style="width:100%;height:200px;"></canvas>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				waveInterval: 50,
				formWidth: '',
				formHeight: '',
				waveData: []
			}
		},
		onReady() {
			
			const animationCtx = uni.createCanvasContext('Waveform-canvas', this);
			let angle = 0;

			setInterval(() => {
				animationCtx.clearRect(0, 0, 200, 200);
				animationCtx.beginPath();
				animationCtx.arc(100, 100, 50, 0, 2 * Math.PI);
				animationCtx.setFillStyle("#66ccff");
				animationCtx.fill();
				animationCtx.closePath();

				animationCtx.beginPath();
				animationCtx.arc(100, 100, 50, 0, angle);
				animationCtx.setStrokeStyle("#ffcc00");
				animationCtx.setLineWidth(5);
				animationCtx.stroke();
				animationCtx.closePath();

				animationCtx.draw();

				angle += 0.1;
				if (angle >= 2 * Math.PI) {
					angle = 0;
				}
			}, this.waveInterval);
		//	const ctx = uni.createCanvasContext('Waveform-canvas', this);
		}
	}
</script>

<style>
	.WaveCanvas-container {
		display: flex;
		flex-direction: column;
		justify-content: center;
		border: 1px solid #999999;
		border-radius: 8px;
	}
</style>