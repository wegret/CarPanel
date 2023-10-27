<template>
	<view class="container">
		<text>
			搜索设备中...
		</text>
		
		<view>
			<button @click="selectDevice_Default()" class="button-important">
				链接默认设备
			</button>
		</view>
		
		<view v-for="device in devices" :key="device.deviceId" @click="selectDevice(device)" class="device-box">
			<view><text>设备名称： {{device.name}}</text></view>
			<view><text>设备ID： {{device.deviceId}}</text></view>
		</view>



	</view>
</template>

<script>
	export default {
		data() {
			return {
				devices: []
			}
		},
		onLoad() {
			
		//	console.log('Start to open Bluetooth');
			// 初始化蓝牙适配器
			uni.openBluetoothAdapter({
				success: (res) => {
				//	console.log('Bluetooth Adapter Opened Successfully');
					// 搜索附近蓝牙设备
					uni.startBluetoothDevicesDiscovery({
						success: (res) => {
					//		console.log('Discovering...');
							this.addBluetoothDeviceListener();
						},
						fail: (err) => {
							console.error('Failed to Find Bluetooth', err);
							uni.showToast({
							    title: '蓝牙启动失败！',
							    icon: 'fail',
							    duration: 2000
							});
						}
					});
				},
				fail: (err) => {
					console.error('Failed to open Bluetooth', err);
					uni.showToast({
					    title: '蓝牙启动失败！',
					    icon: 'fail',
					    duration: 2000
					});
				}
			});
		},
		methods: {
			// 添加蓝牙监听器
			addBluetoothDeviceListener() {
				uni.getBluetoothAdapterState({
				    success: (res) => {
				//        console.log('Bluetooth Adapter State:', res);
				    },
					fail: (err) => {
						console.error('Bluetooth Adapter FAILED', err);
					}	
				});
				
			//	console.log('Discovering...');
				uni.onBluetoothDeviceFound((res) => {
				//	console.log('Found:', res.devices);
					this.devices = [...this.devices, ...res.devices];
				});
			},

			// 选中设备
			selectDevice(device) {
				// 获取页面栈
				const pages = getCurrentPages();
				const homePage = pages[0]; // 获取首页

				uni.createBLEConnection({
					deviceId: device.deviceId,
					success: (res) => {
						homePage.isConnected = true;
						console.log('Connect OK!');
						uni.showToast({
						    title: '蓝牙连接成功！',
						    icon: 'success',
						    duration: 2000
						});
						setTimeout(function() {
							uni.navigateBack();
						}, 500);
					},
					fail: (err) => {
						uni.showToast({
						    title: '蓝牙连接失败！',
						    icon: 'fail',
						    duration: 2000
						});
					}
				});
			},

			// 选择默认设备
			selectDevice_Default() {
				// 获取页面栈
				const pages = getCurrentPages();
				const homePage = pages[0]; // 获取首页
				
				uni.createBLEConnection({
					deviceId: pages[0].deviceId,
					success: (res) => {
						homePage.isConnected = true;
						console.log('Connect OK!');
						uni.showToast({
						    title: '蓝牙连接成功！',
						    icon: 'success',
						    duration: 2000
						});
						setTimeout(function() {
							uni.navigateBack();
						}, 500);
					},
					fail: (err) => {
						uni.showToast({
						    title: '蓝牙连接失败！',
						    icon: 'fail',
						    duration: 2000
						});
					}
				});
			}
		}
	}
</script>

<style>
	.container {
		padding: 20px;
	}

	.device-box {
		padding: 10px;
		margin-bottom: 10px;
		border: 1px solid #ccc;
		/* 边框 */
		border-radius: 5px;
		/* 圆角 */
		background-color: #f5f5f5;
		/* 背景色 */
	}
</style>