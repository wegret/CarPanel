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

	import {
		setService,
		connectService,
		PanelService, // 设备信息
		isConnected, // 是否已连接蓝牙
		isStarted, // 是否已启动小车
	} from '../../services/BLE.js'

	export default {
		data() {
			return {
				devices: [] // 搜索到的设备列表
			}
		},
		onLoad() {

			// 初始化蓝牙适配器
			uni.openBluetoothAdapter({
				success: (res) => {
					// 搜索附近蓝牙设备
					uni.startBluetoothDevicesDiscovery({
						success: (res) => {
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
					success: (res) => {},
					fail: (err) => {
						console.error('Bluetooth Adapter FAILED', err);
					}
				});
				uni.onBluetoothDeviceFound((res) => {
					this.devices = [...this.devices, ...res.devices];
				});
			},

			// 选择默认设备
			selectDevice_Default() {
				connectService();
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