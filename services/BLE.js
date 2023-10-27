export function sendByte(deviceId, serviceId, characteristicId, byteValue) {
    let buffer = new Uint8Array([byteValue]).buffer;

    uni.writeBLECharacteristicValue({
        deviceId: deviceId,
        serviceId: serviceId,
        characteristicId: characteristicId,
        value: buffer,
        success: function(res) {
            console.log('Sent: ', res);
        },
        fail: function(err) {
            console.error('Fail to send!', err);
        }
    });
}