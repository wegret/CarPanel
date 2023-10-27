<template>
	<view class="content">
		<view class="title">参数设置</view>

		<view v-for="group in groups" :key="group.groupName" class="group-container">
			<view class="group-title">{{ group.groupName }}</view>
			
			<view v-for="param in group.params" :key="param.id" class="input-group">
				<text class="label">{{param.label}}</text>
				<input 
				  :type="param.type" 
				  v-model.number="param.value"
				  :placeholder="'请输入' + param.label"
				  class="input"
				  :step="param.step || 0.01"
				/>
			</view> 
		</view>
		
		<button @click="submitParameters" class="submit-btn">提交</button>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				groups: [
					{
						groupName: "左轮PID",
						params: [
							{id: 'Kp',label: 'Kp',type: 'number',value: 0},
							{id: 'Ki',label: 'Ki',type: 'number',value: 0},
							{id: 'Kd',label: 'Kd',type: 'number',value: 0}
						]
					},
					{
						groupName: "右轮PID",
						params: [
							{id: 'Kp',label: 'Kp',type: 'number',value: 0},
							{id: 'Ki',label: 'Ki',type: 'number',value: 0},
							{id: 'Kd',label: 'Kd',type: 'number',value: 0}
						]
					},
					{
						groupName: "速度参数",
						params: [
							{id: 'v_straight',label: '直道速度',type: 'number',value: 0},
							{id: 'v_turning',label: '弯道速度',type: 'number',value: 0}
						]
					}
				]
			}
		},
		methods: {

		}
	}
</script>

<style>
	/* 分组容器样式 */
	.group-container {
	  margin-bottom: 20px;
	}

	/* 分组标题样式 */
	.group-title {
	  font-size: 20px;
	  margin-bottom: 10px;
	}
	/* 输入组样式 */
	.input-group {
	    display: flex;           /* 使用 Flexbox */
	    justify-content: space-between; /* 左对齐标签，右对齐输入框 */
	    align-items: center;     /* 垂直居中对齐内容 */
	    margin-bottom: 10px;     /* 添加一些底部外边距 */
	}
	
	/* 参数标签样式 */
	.label {
	    flex: 1;                 /* 占用可用空间的 1/3 */
	    margin-right: 10px;      /* 添加一些右侧外边距 */
	}
	
	/* 输入框样式 */
	.input {
	    flex: 2;                 /* 占用可用空间的 2/3 */
	    padding: 10px;
	    border: 1px solid #ccc;
	    border-radius: 5px;
	}


</style>