<template>
	<view class="content">

		<view>
			<button v-if="IndexIsConnected" class="button btn-connected" @click="disconnectBluetooth">蓝牙已链接</button>
			<button v-else class="button btn-unconnected" @click="gotoBluetooth">蓝牙未链接</button>
		</view>

		<view v-if="IndexIsConnected">
			<button @click="test">测试通信</button>
			<button @click="ListenerStart">开启接收</button>

		</view>
		<view v-if="IndexIsConnected">
			<button @click="CarStart" class="button btn-important">启动</button>
			<button @click="CarStop">停止</button>
		</view>
		<view>
			<button @click="gotoSetting">设置参数</button>
		</view>

		<view>
			<button @click="gotoDebugger">调试模式</button>
		</view>

		<OutputStream :inputString="streamText"></OutputStream>

		<view v-if="IndexIsConnected" v-for="state in states" class="state-container">
			<text class="state-text-title">{{state.label}}</text>
			<text class="state-text-detail">{{state.value}}</text>
		</view>

	</view>
</template>

<script>
	import {
		setService,
		connectService,
		disconnectService,
		sendByte, // 发送一个hex字节
		sendUTFString, // 发送utf字符串
		PanelService, // 设备信息
		isConnected, // 是否已连接蓝牙
		isStarted, // 是否已启动小车
		enableBluetoothListener // 开启蓝牙接受
	} from '../../services/BLE.js'

	import OutputStream from "../../components/OutputStream.vue";

	export default {
		components: {
			OutputStream
		},
		data() {
			return {
				title: 'Panel',
				IndexIsConnected: false,

				// 收到的信息队列
				byteQueue: [],
				streamText: {
					value: ''
				},
				states: [{
					id: 'Angle',
					label: 'Angle',
					type: 'number',
					value: 0,
					num: 1,
					codetype: 1
				}, ]
			}
		},
		onShow() {
			this.IndexIsConnected = isConnected;
			console.log('Connection State:', this.IndexIsConnected);
			if (this.IndexIsConnected)
				console.log('DeviceId:', PanelService.deviceId);

			uni.onBLEConnectionStateChange((res) => {
				if (!res.connected) {
					console.log('连接已断开');
					this.IndexIsConnected = false;
					uni.showToast({
						title: '蓝牙已断开！',
						icon: 'fail',
						duration: 2000
					});
				}
			});
		},
		onLoad() {
			/* 监听信息 */
			uni.onBLECharacteristicValueChange((res) => {
				console.log('Receive!');
				this.extractBytesFromBuffer(res.value);
			});
		},
		methods: {
			/* 跳转：蓝牙页面 */
			gotoBluetooth() {
				uni.navigateTo({
					url: "/pages/bluetooth/bluetooth"
				});
			},
			disconnectBluetooth() {
				this.IndexIsConnected = disconnectService();
			},
			/* 跳转：设置页面 */
			gotoSetting() {
				uni.navigateTo({
					url: "/pages/setting/setting"
				});
			},
			/* 跳转：调试模式 */
			gotoDebugger() {
				uni.navigateTo({
					url: "/pages/debugger/debugger"
				});
			},

			/* 开启通信 */
			ListenerStart() {
				enableBluetoothListener();
			},
			test() {
				sendUTFString('Hello world!');
			},

			/* 启动：发送01 */
			CarStart() {
				sendByte(0x01);
				sendByte(0x00);
			},
			/* 停止：发送02 */
			CarStop() {
				sendByte(0x02);
				sendByte(0x00);
			},

			// 从ArrayBuffer中提取每个字节的值
			extractBytesFromBuffer(buffer) {
				const byteArray = new Uint8Array(buffer);
				for (let i = 0; i < byteArray.length; i++) {
					if (byteArray[i] != 0)
						this.byteQueue.push(byteArray[i]);
					else
						this.handleMessage();
				}
			},
			getHex_value_2(a, b) {
				return ((a - 1) * 254) + (b - 1);
			},


			// 处理当前命令行
			handleMessage() {
				console.log("Line", this.byteQueue);
				this.streamText = {
					key: Date.now(),
					value: this.byteQueue.join(',') + ';'
				};
				if (this.byteQueue[0] == '0x02') { // 状态
					let num = this.byteQueue[1];
					let value = this.getHex_value_2(this.byteQueue[2], this.byteQueue[3]);

					// 在states中找到对应的num的state，更新value
					let stateToUpdate = this.states.find(state => state.num === num);
					if (stateToUpdate) {
						stateToUpdate.value = value;
					}
				}
				this.byteQueue = [];

			}

		}
	}
</script>

<style>
	.state-container {
		display: flex;
		flex-direction: row;
		border-radius: 8px;
		border: 1px solid #0055ff;
	}

	.state-text-title {
		flex: 1;
		/* 占据 25% 的宽度 */
		max-width: 25%;
		border-radius: 4px;
		padding: 5px;
		background-color: #0055ff;
		color: aliceblue;
	}

	.state-text-detail {
		flex: 3;
		/* 占据 75% 的宽度 */
		max-width: 75%;
		padding: 5px;
		padding-left: 10px;
	}
</style>