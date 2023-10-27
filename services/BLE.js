export function sendByte(deviceId, serviceId, characteristicId, byteValue) {
    return new Promise((resolve, reject) => {
        let buffer = new Uint8Array([byteValue]).buffer;
        const maxRetries = 3;

        function attemptSend(retriesLeft) {
            uni.writeBLECharacteristicValue({
                deviceId: deviceId,
                serviceId: serviceId,
                characteristicId: characteristicId,
                value: buffer,
                success: function(res) {
                    console.log('Sent: ', res);
                    resolve(res);
                },
                fail: function(err) {
                    if (retriesLeft > 0) {
                        console.warn('Send failed, retrying...', err);
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

// 使用Promise链来发送两个字节，并在两次发送之间增加延迟
sendByte(this.deviceId, this.serviceId, this.characteristicId, 0x01)
    .then(() => {
        return new Promise((resolve) => {
            setTimeout(() => {
                resolve();
            }, 100);  // 100ms延迟
        });
    })
    .then(() => sendByte(this.deviceId, this.serviceId, this.characteristicId, 0x00))
    .catch(err => console.error('Error sending bytes:', err));