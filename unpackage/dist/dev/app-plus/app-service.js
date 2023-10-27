if (typeof Promise !== "undefined" && !Promise.prototype.finally) {
  Promise.prototype.finally = function(callback) {
    const promise = this.constructor;
    return this.then(
      (value) => promise.resolve(callback()).then(() => value),
      (reason) => promise.resolve(callback()).then(() => {
        throw reason;
      })
    );
  };
}
;
if (typeof uni !== "undefined" && uni && uni.requireGlobal) {
  const global = uni.requireGlobal();
  ArrayBuffer = global.ArrayBuffer;
  Int8Array = global.Int8Array;
  Uint8Array = global.Uint8Array;
  Uint8ClampedArray = global.Uint8ClampedArray;
  Int16Array = global.Int16Array;
  Uint16Array = global.Uint16Array;
  Int32Array = global.Int32Array;
  Uint32Array = global.Uint32Array;
  Float32Array = global.Float32Array;
  Float64Array = global.Float64Array;
  BigInt64Array = global.BigInt64Array;
  BigUint64Array = global.BigUint64Array;
}
;
if (uni.restoreGlobal) {
  uni.restoreGlobal(Vue, weex, plus, setTimeout, clearTimeout, setInterval, clearInterval);
}
(function(vue) {
  "use strict";
  function formatAppLog(type, filename, ...args) {
    if (uni.__log__) {
      uni.__log__(type, filename, ...args);
    } else {
      console[type].apply(console, [...args, filename]);
    }
  }
  function sendByte(deviceId, serviceId, characteristicId, byteValue) {
    return new Promise((resolve, reject) => {
      let buffer = new Uint8Array([byteValue]).buffer;
      const maxRetries = 3;
      function attemptSend(retriesLeft) {
        uni.writeBLECharacteristicValue({
          deviceId,
          serviceId,
          characteristicId,
          value: buffer,
          success: function(res) {
            formatAppLog("log", "at services/BLE.js:13", "Sent: ", res);
            resolve(res);
          },
          fail: function(err) {
            if (retriesLeft > 0) {
              formatAppLog("warn", "at services/BLE.js:18", "Send failed, retrying...", err);
              attemptSend(retriesLeft - 1);
            } else {
              formatAppLog("error", "at services/BLE.js:21", "Fail to send after retries!", err);
              reject(err);
            }
          }
        });
      }
      attemptSend(maxRetries);
    });
  }
  sendByte(globalThis.deviceId, globalThis.serviceId, globalThis.characteristicId, 1).then(() => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve();
      }, 100);
    });
  }).then(() => sendByte(globalThis.deviceId, globalThis.serviceId, globalThis.characteristicId, 0)).catch((err) => formatAppLog("error", "at services/BLE.js:42", "Error sending bytes:", err));
  const _export_sfc = (sfc, props) => {
    const target = sfc.__vccOpts || sfc;
    for (const [key, val] of props) {
      target[key] = val;
    }
    return target;
  };
  const _sfc_main$3 = {
    data() {
      return {
        title: "Panel",
        isConnected: false,
        // 是否已连接蓝牙
        isStarted: false,
        // 是否已启动小车
        // 默认的设备信息
        deviceId: "60:E8:5B:6C:5C:8A",
        serviceId: "0000FFE0-0000-1000-8000-00805F9B34FB",
        characteristicId: "0000FFE1-0000-1000-8000-00805F9B34FB"
      };
    },
    onShow() {
      formatAppLog("log", "at pages/index/index.vue:39", "State:", this.isConnected);
      formatAppLog("log", "at pages/index/index.vue:40", "DeviceId:", this.deviceId);
    },
    onLoad() {
      uni.onBLECharacteristicValueChange((res) => {
        let uint8Array = new Uint8Array(res.value);
        formatAppLog("log", "at pages/index/index.vue:45", "Received data:", uint8Array);
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
          serviceId,
          characteristicId,
          state: true,
          success: (res) => {
            formatAppLog("log", "at pages/index/index.vue:66", "Notification enabled for", characteristicId, ":", res);
          }
        });
      },
      test() {
        let buffer = new ArrayBuffer("hello world".length);
        let dataView = new DataView(buffer);
        for (let i = 0; i < "hello world".length; i++) {
          dataView.setUint8(i, "hello world".charCodeAt(i));
        }
        uni.writeBLECharacteristicValue({
          deviceId: this.deviceId,
          serviceId: "0000FFE0-0000-1000-8000-00805F9B34FB",
          characteristicId: "0000FFE1-0000-1000-8000-00805F9B34FB",
          //serviceId: '0000FFF0-0000-1000-8000-00805F9B34FB',
          //characteristicId: '0000FFF5-0000-1000-8000-00805F9B34FB',
          value: buffer,
          success: function(res) {
            formatAppLog("log", "at pages/index/index.vue:135", "Data sent successfully:", res);
          },
          fail: function(err) {
            formatAppLog("error", "at pages/index/index.vue:138", "Failed to send data:", err);
          }
        });
        this.enableBluetoothListener(
          "0000FFE0-0000-1000-8000-00805F9B34FB",
          "0000FFE1-0000-1000-8000-00805F9B34FB"
        );
      },
      /* 启动：发送01 */
      CarStart() {
        sendByte(this.deviceId, this.serviceId, this.characteristicId, 1);
        sendByte(this.deviceId, this.serviceId, this.characteristicId, 0);
      },
      /* 停止：发送02 */
      CarStop() {
        sendByte(this.deviceId, this.serviceId, this.characteristicId, 2);
        sendByte(this.deviceId, this.serviceId, this.characteristicId, 0);
      }
    }
  };
  function _sfc_render$2(_ctx, _cache, $props, $setup, $data, $options) {
    return vue.openBlock(), vue.createElementBlock("view", { class: "content" }, [
      vue.createElementVNode("view", null, [
        vue.createElementVNode(
          "button",
          {
            onClick: _cache[0] || (_cache[0] = (...args) => $options.gotoBluetooth && $options.gotoBluetooth(...args))
          },
          vue.toDisplayString($data.isConnected ? "蓝牙已链接" : "蓝牙未链接"),
          1
          /* TEXT */
        )
      ]),
      $data.isConnected ? (vue.openBlock(), vue.createElementBlock("view", { key: 0 }, [
        vue.createElementVNode("button", {
          onClick: _cache[1] || (_cache[1] = (...args) => $options.test && $options.test(...args))
        }, "测试通信"),
        vue.createElementVNode("button", {
          onClick: _cache[2] || (_cache[2] = (...args) => $options.CarStart && $options.CarStart(...args)),
          class: "button-important"
        }, "启动"),
        vue.createElementVNode("button", {
          onClick: _cache[3] || (_cache[3] = (...args) => $options.CarStop && $options.CarStop(...args))
        }, "停止")
      ])) : vue.createCommentVNode("v-if", true),
      $data.isConnected ? (vue.openBlock(), vue.createElementBlock("view", { key: 1 }, [
        vue.createElementVNode("button", {
          onClick: _cache[4] || (_cache[4] = (...args) => $options.gotoSetting && $options.gotoSetting(...args))
        }, "设置参数")
      ])) : vue.createCommentVNode("v-if", true)
    ]);
  }
  const PagesIndexIndex = /* @__PURE__ */ _export_sfc(_sfc_main$3, [["render", _sfc_render$2], ["__file", "D:/CodeBase/Panel/pages/index/index.vue"]]);
  const _sfc_main$2 = {
    data() {
      return {
        devices: []
      };
    },
    onLoad() {
      uni.openBluetoothAdapter({
        success: (res) => {
          uni.startBluetoothDevicesDiscovery({
            success: (res2) => {
              this.addBluetoothDeviceListener();
            },
            fail: (err) => {
              formatAppLog("error", "at pages/bluetooth/bluetooth.vue:44", "Failed to Find Bluetooth", err);
              uni.showToast({
                title: "蓝牙启动失败！",
                icon: "fail",
                duration: 2e3
              });
            }
          });
        },
        fail: (err) => {
          formatAppLog("error", "at pages/bluetooth/bluetooth.vue:54", "Failed to open Bluetooth", err);
          uni.showToast({
            title: "蓝牙启动失败！",
            icon: "fail",
            duration: 2e3
          });
        }
      });
    },
    methods: {
      // 添加蓝牙监听器
      addBluetoothDeviceListener() {
        uni.getBluetoothAdapterState({
          success: (res) => {
          },
          fail: (err) => {
            formatAppLog("error", "at pages/bluetooth/bluetooth.vue:71", "Bluetooth Adapter FAILED", err);
          }
        });
        uni.onBluetoothDeviceFound((res) => {
          this.devices = [...this.devices, ...res.devices];
        });
      },
      // 选中设备
      selectDevice(device) {
        const pages = getCurrentPages();
        const homePage = pages[0];
        uni.createBLEConnection({
          deviceId: device.deviceId,
          success: (res) => {
            homePage.isConnected = true;
            formatAppLog("log", "at pages/bluetooth/bluetooth.vue:92", "Connect OK!");
            uni.showToast({
              title: "蓝牙连接成功！",
              icon: "success",
              duration: 2e3
            });
            setTimeout(function() {
              uni.navigateBack();
            }, 500);
          },
          fail: (err) => {
            uni.showToast({
              title: "蓝牙连接失败！",
              icon: "fail",
              duration: 2e3
            });
          }
        });
      },
      // 选择默认设备
      selectDevice_Default() {
        const pages = getCurrentPages();
        const homePage = pages[0];
        uni.createBLEConnection({
          deviceId: pages[0].deviceId,
          success: (res) => {
            homePage.isConnected = true;
            formatAppLog("log", "at pages/bluetooth/bluetooth.vue:122", "Connect OK!");
            uni.showToast({
              title: "蓝牙连接成功！",
              icon: "success",
              duration: 2e3
            });
            setTimeout(function() {
              uni.navigateBack();
            }, 500);
          },
          fail: (err) => {
            uni.showToast({
              title: "蓝牙连接失败！",
              icon: "fail",
              duration: 2e3
            });
          }
        });
      }
    }
  };
  function _sfc_render$1(_ctx, _cache, $props, $setup, $data, $options) {
    return vue.openBlock(), vue.createElementBlock("view", { class: "container" }, [
      vue.createElementVNode("text", null, " 搜索设备中... "),
      vue.createElementVNode("view", null, [
        vue.createElementVNode("button", {
          onClick: _cache[0] || (_cache[0] = ($event) => $options.selectDevice_Default()),
          class: "button-important"
        }, " 链接默认设备 ")
      ]),
      (vue.openBlock(true), vue.createElementBlock(
        vue.Fragment,
        null,
        vue.renderList($data.devices, (device) => {
          return vue.openBlock(), vue.createElementBlock("view", {
            key: device.deviceId,
            onClick: ($event) => $options.selectDevice(device),
            class: "device-box"
          }, [
            vue.createElementVNode("view", null, [
              vue.createElementVNode(
                "text",
                null,
                "设备名称： " + vue.toDisplayString(device.name),
                1
                /* TEXT */
              )
            ]),
            vue.createElementVNode("view", null, [
              vue.createElementVNode(
                "text",
                null,
                "设备ID： " + vue.toDisplayString(device.deviceId),
                1
                /* TEXT */
              )
            ])
          ], 8, ["onClick"]);
        }),
        128
        /* KEYED_FRAGMENT */
      ))
    ]);
  }
  const PagesBluetoothBluetooth = /* @__PURE__ */ _export_sfc(_sfc_main$2, [["render", _sfc_render$1], ["__file", "D:/CodeBase/Panel/pages/bluetooth/bluetooth.vue"]]);
  const _sfc_main$1 = {
    data() {
      return {
        groups: [
          {
            groupName: "左轮PID",
            params: [
              { id: "Kp", label: "Kp", type: "number", value: 0 },
              { id: "Ki", label: "Ki", type: "number", value: 0 },
              { id: "Kd", label: "Kd", type: "number", value: 0 }
            ]
          },
          {
            groupName: "右轮PID",
            params: [
              { id: "Kp", label: "Kp", type: "number", value: 0 },
              { id: "Ki", label: "Ki", type: "number", value: 0 },
              { id: "Kd", label: "Kd", type: "number", value: 0 }
            ]
          },
          {
            groupName: "速度参数",
            params: [
              { id: "v_straight", label: "直道速度", type: "number", value: 0 },
              { id: "v_turning", label: "弯道速度", type: "number", value: 0 }
            ]
          }
        ]
      };
    },
    methods: {}
  };
  function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
    return vue.openBlock(), vue.createElementBlock("view", { class: "content" }, [
      vue.createElementVNode("view", { class: "title" }, "参数设置"),
      (vue.openBlock(true), vue.createElementBlock(
        vue.Fragment,
        null,
        vue.renderList($data.groups, (group) => {
          return vue.openBlock(), vue.createElementBlock("view", {
            key: group.groupName,
            class: "group-container"
          }, [
            vue.createElementVNode(
              "view",
              { class: "group-title" },
              vue.toDisplayString(group.groupName),
              1
              /* TEXT */
            ),
            (vue.openBlock(true), vue.createElementBlock(
              vue.Fragment,
              null,
              vue.renderList(group.params, (param) => {
                return vue.openBlock(), vue.createElementBlock("view", {
                  key: param.id,
                  class: "input-group"
                }, [
                  vue.createElementVNode(
                    "text",
                    { class: "label" },
                    vue.toDisplayString(param.label),
                    1
                    /* TEXT */
                  ),
                  vue.withDirectives(vue.createElementVNode("input", {
                    type: param.type,
                    "onUpdate:modelValue": ($event) => param.value = $event,
                    placeholder: "请输入" + param.label,
                    class: "input",
                    step: param.step || 0.01
                  }, null, 8, ["type", "onUpdate:modelValue", "placeholder", "step"]), [
                    [
                      vue.vModelDynamic,
                      param.value,
                      void 0,
                      { number: true }
                    ]
                  ])
                ]);
              }),
              128
              /* KEYED_FRAGMENT */
            ))
          ]);
        }),
        128
        /* KEYED_FRAGMENT */
      )),
      vue.createElementVNode("button", {
        onClick: _cache[0] || (_cache[0] = (...args) => _ctx.submitParameters && _ctx.submitParameters(...args)),
        class: "submit-btn"
      }, "提交")
    ]);
  }
  const PagesSettingSetting = /* @__PURE__ */ _export_sfc(_sfc_main$1, [["render", _sfc_render], ["__file", "D:/CodeBase/Panel/pages/setting/setting.vue"]]);
  __definePage("pages/index/index", PagesIndexIndex);
  __definePage("pages/bluetooth/bluetooth", PagesBluetoothBluetooth);
  __definePage("pages/setting/setting", PagesSettingSetting);
  const _sfc_main = {
    onLaunch: function() {
      formatAppLog("log", "at App.vue:4", "App Launch");
    },
    onShow: function() {
      formatAppLog("log", "at App.vue:7", "App Show");
    },
    onHide: function() {
      formatAppLog("log", "at App.vue:10", "App Hide");
    }
  };
  const App = /* @__PURE__ */ _export_sfc(_sfc_main, [["__file", "D:/CodeBase/Panel/App.vue"]]);
  function createApp() {
    const app = vue.createVueApp(App);
    return {
      app
    };
  }
  const { app: __app__, Vuex: __Vuex__, Pinia: __Pinia__ } = createApp();
  uni.Vuex = __Vuex__;
  uni.Pinia = __Pinia__;
  __app__.provide("__globalStyles", __uniConfig.styles);
  __app__._component.mpType = "app";
  __app__._component.render = () => {
  };
  __app__.mount("#app");
})(Vue);
