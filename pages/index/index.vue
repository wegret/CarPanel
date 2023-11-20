<template>
	<view class="content">

		<view>
			<button v-if="IndexIsConnected" class="button btn-connected">蓝牙已链接</button>
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

		<OutputStream :inputString="streamText"></OutputStream>

	</view>
</template>

<script>
	import {
		setService,
		connectService,
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
				streamText: ''
			}
		},
		onShow() {
			this.IndexIsConnected = isConnected;
			console.log('Connection State:', this.IndexIsConnected);
			if (this.IndexIsConnected)
				console.log('DeviceId:', PanelService.deviceId);
		},
		onLoad() {
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
			/* 跳转：设置页面 */
			gotoSetting() {
				uni.navigateTo({
					url: "/pages/setting/setting"
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

			// 处理当前命令行
			handleMessage() {
				console.log("Line", this.byteQueue);
				const now = Date.now(); // 获取当前的时间戳
				this.streamText = this.byteQueue.join(',') + ';'; // 添加时间戳
				this.byteQueue = [];

			}

		}
	}
</script>

<style>
</style>