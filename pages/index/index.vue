<template>
	<view class="content">

		<view>
			<button @click="gotoBluetooth">{{ isConnected ? '蓝牙已链接' : '蓝牙未链接' }}</button>
		</view>


		<view v-if="isConnected">
			<button @click="test">测试通信</button>

			<button @click="CarStart" class="button-important">启动</button>
			<button @click="CarStop">停止</button>
		</view>
		<view v-if="isConnected">
			<button @click="gotoSetting">设置参数</button>
		</view>

	</view>
</template>

<script>
	import { sendByte } from '../../services/BLE.js';
	
	export default {
		data() {
			return {
				title: 'Panel',
				isConnected: false, // 是否已连接蓝牙
				isStarted: false, // 是否已启动小车

				// 默认的设备信息
				deviceId: '60:E8:5B:6C:5C:8A',
				serviceId: '0000FFE0-0000-1000-8000-00805F9B34FB',
				characteristicId: '0000FFE1-0000-1000-8000-00805F9B34FB'
			}
		},
		onShow() {
			console.log('State:', this.isConnected);
			console.log('DeviceId:', this.deviceId);
		},
		onLoad() {
			uni.onBLECharacteristicValueChange((res) => {
				let uint8Array = new Uint8Array(res.value);
				console.log('Received data:', uint8Array);
			});
		},
		methods: {
			gotoBluetooth() {
				uni.navigateTo({
					url: "/pages/bluetooth/bluetooth"
				});
			},
			gotoSetting() {
				uni.navigateTo({
					url: "/pages/setting/setting"
				});
			},
			enableBluetoothListener(serviceId, characteristicId) {
				uni.notifyBLECharacteristicValueChange({
					deviceId: this.deviceId,
					serviceId: serviceId,
					characteristicId: characteristicId,
					state: true,
					success: (res) => {
						console.log('Notification enabled for', characteristicId, ':', res);
					}
				});
			},
			test() {
				/*
				uni.getBLEDeviceServices({
					deviceId: this.deviceId,
					success: (res) => {
						console.log('All services for device', this.deviceId, ':', res.services);

						// 对于每个服务，获取其所有特征
						res.services.forEach(service => {
							uni.getBLEDeviceCharacteristics({
								deviceId: this.deviceId,
								serviceId: service.uuid,
								success: (charRes) => {
									console.log('Characteristics for service', service.uuid, ':', charRes.characteristics);

									// 如果你想打印每个特征的UUID
									charRes.characteristics.forEach(characteristic => {
										console.log('Characteristic UUID:', characteristic.uuid);
									});
								},
								fail: (err) => {
									console.error('Failed to get characteristics for service', service.uuid, ':', err);
								}
							});
						});
					},
					fail: (err) => {
						console.error('Failed to get services:', err);
					}
				});
				*/

				let buffer = new ArrayBuffer('hello world'.length);
				let dataView = new DataView(buffer);
				for (let i = 0; i < 'hello world'.length; i++) {
					dataView.setUint8(i, 'hello world'.charCodeAt(i));
				}


				/*
								uni.writeBLECharacteristicValue({
									deviceId: this.deviceId,
									serviceId: '0000FFF0-0000-1000-8000-00805F9B34FB',
									characteristicId: '0000FFF1-0000-1000-8000-00805F9B34FB',
									//serviceId: '0000FFF0-0000-1000-8000-00805F9B34FB',
									//characteristicId: '0000FFF5-0000-1000-8000-00805F9B34FB',
									value: buffer,
									success: function(res) {
										console.log('Data sent successfully:', res);
									},
									fail: function(err) {
										console.error('Failed to send data:', err);
									}
								});

								this.enableBluetoothListener('0000FFE0-0000-1000-8000-00805F9B34FB', '0000FFE1-0000-1000-8000-00805F9B34FB');
							`	*/
				uni.writeBLECharacteristicValue({
					deviceId: this.deviceId,
					serviceId: '0000FFE0-0000-1000-8000-00805F9B34FB',
					characteristicId: '0000FFE1-0000-1000-8000-00805F9B34FB',
					//serviceId: '0000FFF0-0000-1000-8000-00805F9B34FB',
					//characteristicId: '0000FFF5-0000-1000-8000-00805F9B34FB',
					value: buffer,
					success: function(res) {
						console.log('Data sent successfully:', res);
					},
					fail: function(err) {
						console.error('Failed to send data:', err);
					}
				});

				this.enableBluetoothListener('0000FFE0-0000-1000-8000-00805F9B34FB',
					'0000FFE1-0000-1000-8000-00805F9B34FB');

			},

			/* 启动：发送01 */
			CarStart() {
				sendByte(this.deviceId, this.serviceId, this.characteristicId, 0x01);
				sendByte(this.deviceId, this.serviceId, this.characteristicId, 0x00);
			},
			/* 停止：发送02 */
			CarStop() {
				sendByte(this.deviceId, this.serviceId, this.characteristicId, 0x02);
				sendByte(this.deviceId, this.serviceId, this.characteristicId, 0x00);
			}

		}
	}
</script>

<style>

</style>