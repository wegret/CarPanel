const maxRetries = 3;

export let isConnected = false;
export let isStarted = false;

export let PanelService = {
	deviceId: '60:E8:5B:6C:5C:8A',
	serviceId: '0000FFE0-0000-1000-8000-00805F9B34FB',
	characteristicId: '0000FFE1-0000-1000-8000-00805F9B34FB',
};



/* 设置设备为... */
export function setService(deviceId, serviceId, characteristicId) {
	PanelService.deviceId = deviceId;
	PanelService.serviceId = serviceId;
	PanelService.characteristicId = characteristicId;
}

/* 连接到当前设备 */
export function connectService() {
	uni.createBLEConnection({
		deviceId: PanelService.deviceId,
		success: (res) => {
			isConnected = true;
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
			isConnected = false;
			uni.showToast({
				title: '蓝牙连接失败！',
				icon: 'fail',
				duration: 2000
			});
		}
	});
}


/* 开启蓝牙接收 */
export function enableBluetoothListener() {
	uni.notifyBLECharacteristicValueChange({
		deviceId: PanelService.deviceId,
		serviceId: PanelService.serviceId,
		characteristicId: PanelService.characteristicId,
		state: true,
		success: (res) => {
			console.log('Notification enabled for', PanelService.characteristicId, ':', res);
			uni.showToast({
				title: '蓝牙接收启动！',
				icon: 'success',
				duration: 2000
			});
		},
		fail: (err) => {
			uni.showToast({
				title: '启动失败！',
				icon: 'fail',
				duration: 2000
			});
		}
	});
}

/* 发送一个Hex字节 */
export function sendByte(byteValue) {
	return new Promise((resolve, reject) => {
		let buffer = new Uint8Array([byteValue]).buffer;

		function attemptSend(retriesLeft) {
			uni.writeBLECharacteristicValue({
				deviceId: PanelService.deviceId,
				serviceId: PanelService.serviceId,
				characteristicId: PanelService.characteristicId,
				value: buffer,
				success: function(res) {
					resolve(res);
				},
				fail: function(err) {
					if (retriesLeft > 0) {
						attemptSend(retriesLeft - 1);
					} else {
						console.error('Fail to send after retries!', err);
						reject(err);
					}
				}
			});
		}

		attemptSend(maxRetries);
	});
}

/* 发送一个UTF字符串 */
export function sendUTFString(str) {
	let buffer = new ArrayBuffer(str.length);
	let dataView = new DataView(buffer);
	for (let i = 0; i < str.length; i++) {
		dataView.setUint8(i, str.charCodeAt(i));
	}

	uni.writeBLECharacteristicValue({
		deviceId: PanelService.deviceId,
		serviceId: PanelService.serviceId,
		characteristicId: PanelService.characteristicId,
		value: buffer,
		success: function(res) {
			console.log('Data sent successfully:', res);
			uni.showToast({
				title: '发送成功！',
				icon: 'success',
				duration: 2000
			});
		},
		fail: function(err) {
			console.error('Failed to send data:', err);
			uni.showToast({
				title: '发送失败！',
				icon: 'success',
				duration: 2000
			});
		}
	});
}