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
	body, button, input, textarea {
	    font-family: 'Noto-regular', sans-serif;  
	}
	/* 按钮样式 */
	button {
		margin-top: 20rpx;
		padding: 10rpx 20rpx;
	}
	
	.button-important {
		margin-bottom: 10px;
		border-radius: 10rpx;
		background-color: #007AFF;
		color: #fff;
	}
	
	.content {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		padding: 20px;
	}
	
	.text-area {
		display: flex;
		justify-content: center;
	}
	
	.title {
		font-size: 36rpx;
		color: #8f8f94;
	}
</style>
