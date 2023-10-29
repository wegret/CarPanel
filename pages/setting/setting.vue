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
				<button @click="submitSingleParameter(param.num, param.value, param.codetype)" class="single-submit-btn">提交</button>
			</view> 
		</view>
		
	</view>
</template>

<script>
	import { sendByte } from '../../services/BLE.js';
	export default {
		data() {
			return {
				// 默认的设备信息
				deviceId: '60:E8:5B:6C:5C:8A',
				serviceId: '0000FFE0-0000-1000-8000-00805F9B34FB',
				characteristicId: '0000FFE1-0000-1000-8000-00805F9B34FB',
				
				groups: [
					{
						groupName: "电机PID",
						params: [
							{id: 'Kp',label: 'Kp',type: 'number',value: 0,num:1,codetype:1},
							{id: 'Ki',label: 'Ki',type: 'number',value: 0,num:2,codetype:1},
							{id: 'Kd',label: 'Kd',type: 'number',value: 0,num:3,codetype:1}
						]
					},
					{
						groupName: "速度参数",
						params: [
							{id: 'v_straight',label: '目标速度',type: 'number',value: 0,num:4,codetype:0},
							{id: 'v_turning',label: '弯道速度',type: 'number',value: 0,num:5,codetype:0}
						]
					}
				]
			}
		},
		onLoad() {
			/*
			const pages = getCurrentPages();
			const homePage = pages[0]; // 获取首页
			this.deviceId=pages[0].deviceId;
			this.characteristicId=pages[0].characteristicId;*/
		},
		methods: {
			checkNumberType(num) {
			    if (Number.isInteger(num)) {
			        return 1;
			    } else {
			        return 0;
			    }
			},
			submitSingleParameter(paramNum, value, codetype) {
				// 这里处理单个参数的提交逻辑
				sendByte(this.deviceId, this.serviceId, this.characteristicId, 0x03);
				if (codetype==0){
					console.log("整数");
					setTimeout(() => {
						sendByte(this.deviceId, this.serviceId, this.characteristicId, paramNum);
							setTimeout(() => {
								sendByte(this.deviceId, this.serviceId, this.characteristicId, (value/254)+1);
								setTimeout(() => {
									sendByte(this.deviceId, this.serviceId, this.characteristicId, (value%254)+1);
									setTimeout(() => {
										sendByte(this.deviceId, this.serviceId, this.characteristicId, 0x00);
									}, 10);
								}, 10);
							}, 10); 
					}, 10); 
				}
				else{
					console.log("浮点数");
					let result = Math.round(value * 100);
					setTimeout(() => {
						sendByte(this.deviceId, this.serviceId, this.characteristicId, paramNum);
							setTimeout(() => {
								sendByte(this.deviceId, this.serviceId, this.characteristicId, (result/254)+1);
								setTimeout(() => {
									sendByte(this.deviceId, this.serviceId, this.characteristicId, (result%254)+1);
									setTimeout(() => {
										sendByte(this.deviceId, this.serviceId, this.characteristicId, 0x00);
									}, 10);
								}, 10);
							}, 10); 
					}, 10); 
				}
			}
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
	.single-submit-btn {
	    margin-left: 10px;
	    padding: 5px 10px;
	    background-color: #05bdff;
	    color: white;
	    border: none;
	    border-radius: 5px;
	    cursor: pointer;
	}

</style>