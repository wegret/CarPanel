<script>
	export default {
		onLaunch: function() {
			console.log('App Launch')
		},
		onShow: function() {
			console.log('App Show')
		},
		onHide: function() {
			console.log('App Hide')
		}
	}
</script>

<style>
	/*每个页面公共css */
	/* 字体 */
	@font-face {
		font-family: 'Noto-regular';
		src: url('@/static/font/NotoSerifSC-Regular.otf');
	}

	/* 设置全局字体 */
	body,
	button,
	input,
	textarea {
		font-family: 'Noto-regular', sans-serif;
	}

	/* 最外围内容 */
	.content {
		display: flex;
		flex-direction: column;
		justify-content: center;
		padding: 20px;
		margin: 20px;
	}

	/* 按钮样式 */
	button {
		margin: 20rpx;
		padding: 10rpx 20rpx;
		border-radius: 10rpx;
	}

	button.btn-connected {
		background-color: #00aa00;
		color: aliceblue;
	}

	button.btn-unconnected {
		background-color: #999999;
		color: aliceblue;
	}

	button.btn-important {
		background-color: #292599;
		color: aliceblue;
	}

	.title {
		font-size: 36rpx;
		color: #8f8f94;
	}
</style>