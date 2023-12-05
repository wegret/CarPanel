<template>
	<view class="content">
		<view class="title">参数设置</view>

		<keep-alive>
			<view v-for="group in groups" :key="group.groupName" class="group-container">
				<view class="group-title">{{ group.groupName }}</view>

				<view v-for="param in group.params" :key="param.id" class="input-group">
					<text class="label">{{param.label}}</text>
					<input :type="param.type" v-model.number="param.value" :placeholder="'请输入' + param.label"
						class="input" :step="param.step || 0.01" />
					<button @click="submitSingleParameter(param.num, param.value, param.codetype)"
						class="button btn-submit">提交</button>
				</view>
			</view>
		</keep-alive>

	</view>
</template>

<script>
	import {
		sendByte, // 发送一个hex字节
		PanelService, // 设备信息
		enableBluetoothListener // 开启蓝牙接受
	} from '../../services/BLE.js'
	export default {
		data() {
			return {

				groups: [{
						groupName: "电机PID",
						params: [{
								id: 'Kp',
								label: 'Kp',
								type: 'number',
								value: 3.7,
								num: 1,
								codetype: 1
							},
							{
								id: 'Ki',
								label: 'Ki',
								type: 'number',
								value: 0.05,
								num: 2,
								codetype: 1
							},
							{
								id: 'Kd',
								label: 'Kd',
								type: 'number',
								value: 0,
								num: 3,
								codetype: 1
							},
							{
								id: 'Kp_t',
								label: 'Kp_turn',
								type: 'number',
								value: 3.7,
								num: 12,
								codetype: 1
							},
							{
								id: 'Ki_t',
								label: 'Ki_turn',
								type: 'number',
								value: 0.05,
								num: 13,
								codetype: 1
							},
							{
								id: 'Kd_t',
								label: 'Kd_turn',
								type: 'number',
								value: 0,
								num: 14,
								codetype: 1
							},
						]
					},
					{
						groupName: "速度参数",
						params: [{
								id: 'v_straight',
								label: '左轮速度',
								type: 'number',
								value: 750,
								num: 4,
								codetype: 0
							},
							{
								id: 'v_turning',
								label: '右轮速度',
								type: 'number',
								value: 750,
								num: 5,
								codetype: 0
							},
							{
								id: 'v_turning_low',
								label: '弯道低速',
								type: 'number',
								value: 400,
								num: 10,
								codetype: 0
							},
							{
								id: 'v_turning_high',
								label: '弯道高速',
								type: 'number',
								value: 1000,
								num: 11,
								codetype: 0
							}
						]
					},
					{
						groupName: "舵机PID",
						params: [{
								id: 'Kp_d',
								label: 'Kp_d',
								type: 'number',
								value: 1.6,
								num: 6,
								codetype: 1
							},
							{
								id: 'Ki_d',
								label: 'Ki_d',
								type: 'number',
								value: 0,
								num: 7,
								codetype: 1
							},
							{
								id: 'Kd_d',
								label: 'Kd_d',
								type: 'number',
								value: 5,
								num: 8,
								codetype: 1
							}
						]
					},
					{
						groupName: "视觉参数",
						params: [{
							id: 'MID_START',
							label: '中点预计点',
							type: 'number',
							value: 70,
							num: 9,
							codetype: 0
						}]
					},
				]
			}
		},
		onLoad() {},
		methods: {
			checkNumberType(num) {
				if (Number.isInteger(num)) {
					return 1;
				} else {
					return 0;
				}
			},

			async sendByteAsync(byte) {
				await new Promise(resolve => {
					sendByte(byte);
					setTimeout(resolve, 10);
				});
			},

			async submitSingleParameter(paramNum, value, codetype) { // 参数编号，参数值，数据类型（0：整数 1：浮点数）
				await this.sendByteAsync(0x03);
				if (codetype == 0) {
					console.log("整数");
					await this.sendByteAsync(paramNum);
					await this.sendByteAsync((value / 254) + 1);
					await this.sendByteAsync((value % 254) + 1);
					await this.sendByteAsync(0x00);
				} else {
					console.log("浮点数");
					let result = Math.round(value * 100);
					await this.sendByteAsync(paramNum);
					await this.sendByteAsync((result / 254) + 1);
					await this.sendByteAsync((result % 254) + 1);
					await this.sendByteAsync(0x00);
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
		border-left: 1px solid #0039b3;
		padding: 3px;
	}

	/* 输入组样式 */
	.input-group {
		display: flex;
		/* 使用 Flexbox */
		justify-content: space-between;
		/* 左对齐标签，右对齐输入框 */
		align-items: center;
		/* 垂直居中对齐内容 */
		margin-bottom: 10px;
		/* 添加一些底部外边距 */
	}

	/* 参数标签样式 */
	.label {
		flex: 2;
		/* 占用可用空间的 1/3 */
		margin-right: 10px;
		/* 添加一些右侧外边距 */
	}

	/* 输入框样式 */
	.input {
		flex: 3;
		/* 占用可用空间的 2/3 */
		height: 40px;
		padding: 5px;
		border: 1px solid #ccc;
		border-radius: 5px;
	}

	.single-submit-btn {
		height: 32px;
		background-color: #05bdff;
		color: white;
		border: none;
		border-radius: 5px;
		cursor: pointer;
	}
</style>