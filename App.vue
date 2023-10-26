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
</style>
