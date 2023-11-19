const maxRetries = 3;

export function sendByte(deviceId, serviceId, characteristicId, byteValue) {
    return new Promise((resolve, reject) => {
        let buffer = new Uint8Array([byteValue]).buffer;

        function attemptSend(retriesLeft) {
            uni.writeBLECharacteristicValue({
                deviceId: deviceId,
                serviceId: serviceId,
                characteristicId: characteristicId,
                value: buffer,
                success: function(res) {
                    console.log(`Sent: ${String(typeof res)}`);
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
