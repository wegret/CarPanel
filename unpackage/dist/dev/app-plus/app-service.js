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
  const maxRetries = 3;
  let isConnected = false;
  let PanelService = {
    deviceId: "60:E8:5B:6C:5C:8A",
    serviceId: "0000FFE0-0000-1000-8000-00805F9B34FB",
    characteristicId: "0000FFE1-0000-1000-8000-00805F9B34FB"
  };
  function connectService() {
    uni.createBLEConnection({
      deviceId: PanelService.deviceId,
      success: (res) => {
        isConnected = true;
        formatAppLog("log", "at services/BLE.js:25", "Connect OK!");
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
        isConnected = false;
        uni.showToast({
          title: "蓝牙连接失败！",
          icon: "fail",
          duration: 2e3
        });
      }
    });
  }
  function enableBluetoothListener() {
    uni.notifyBLECharacteristicValueChange({
      deviceId: PanelService.deviceId,
      serviceId: PanelService.serviceId,
      characteristicId: PanelService.characteristicId,
      state: true,
      success: (res) => {
        formatAppLog("log", "at services/BLE.js:55", "Notification enabled for", PanelService.characteristicId, ":", res);
        uni.showToast({
          title: "蓝牙接收启动！",
          icon: "success",
          duration: 2e3
        });
      },
      fail: (err) => {
        uni.showToast({
          title: "启动失败！",
          icon: "fail",
          duration: 2e3
        });
      }
    });
  }
  function sendByte(byteValue) {
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
              formatAppLog("error", "at services/BLE.js:90", "Fail to send after retries!", err);
              reject(err);
            }
          }
        });
      }
      attemptSend(maxRetries);
    });
  }
  function sendUTFString(str) {
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
        formatAppLog("log", "at services/BLE.js:115", "Data sent successfully:", res);
        uni.showToast({
          title: "发送成功！",
          icon: "success",
          duration: 2e3
        });
      },
      fail: function(err) {
        formatAppLog("error", "at services/BLE.js:123", "Failed to send data:", err);
        uni.showToast({
          title: "发送失败！",
          icon: "success",
          duration: 2e3
        });
      }
    });
  }
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
        IndexIsConnected: false,
        // 收到的信息队列
        byteQueue: []
      };
    },
    onShow() {
      this.IndexIsConnected = isConnected;
      formatAppLog("log", "at pages/index/index.vue:50", "Connection State:", this.IndexIsConnected);
      if (this.IndexIsConnected)
        formatAppLog("log", "at pages/index/index.vue:52", "DeviceId:", PanelService.deviceId);
    },
    onLoad() {
      uni.onBLECharacteristicValueChange((res) => {
        formatAppLog("log", "at pages/index/index.vue:56", "Receive!");
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
        sendUTFString("Hello world!");
      },
      /* 启动：发送01 */
      CarStart() {
        sendByte(1);
        sendByte(0);
      },
      /* 停止：发送02 */
      CarStop() {
        sendByte(2);
        sendByte(0);
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
      handleMessage() {
        formatAppLog("log", "at pages/index/index.vue:107", "Line", this.byteQueue);
        this.byteQueue = [];
      }
    }
  };
  function _sfc_render$2(_ctx, _cache, $props, $setup, $data, $options) {
    return vue.openBlock(), vue.createElementBlock("view", { class: "content" }, [
      vue.createElementVNode("view", null, [
        $data.IndexIsConnected ? (vue.openBlock(), vue.createElementBlock("button", {
          key: 0,
          class: "button btn-connected"
        }, "蓝牙已链接")) : (vue.openBlock(), vue.createElementBlock("button", {
          key: 1,
          class: "button btn-unconnected",
          onClick: _cache[0] || (_cache[0] = (...args) => $options.gotoBluetooth && $options.gotoBluetooth(...args))
        }, "蓝牙未链接"))
      ]),
      $data.IndexIsConnected ? (vue.openBlock(), vue.createElementBlock("view", { key: 0 }, [
        vue.createElementVNode("button", {
          onClick: _cache[1] || (_cache[1] = (...args) => $options.test && $options.test(...args))
        }, "测试通信"),
        vue.createElementVNode("button", {
          onClick: _cache[2] || (_cache[2] = (...args) => $options.ListenerStart && $options.ListenerStart(...args))
        }, "开启接收")
      ])) : vue.createCommentVNode("v-if", true),
      $data.IndexIsConnected ? (vue.openBlock(), vue.createElementBlock("view", { key: 1 }, [
        vue.createElementVNode("button", {
          onClick: _cache[3] || (_cache[3] = (...args) => $options.CarStart && $options.CarStart(...args)),
          class: "button btn-important"
        }, "启动"),
        vue.createElementVNode("button", {
          onClick: _cache[4] || (_cache[4] = (...args) => $options.CarStop && $options.CarStop(...args))
        }, "停止")
      ])) : vue.createCommentVNode("v-if", true),
      vue.createElementVNode("view", null, [
        vue.createElementVNode("button", {
          onClick: _cache[5] || (_cache[5] = (...args) => $options.gotoSetting && $options.gotoSetting(...args))
        }, "设置参数")
      ])
    ]);
  }
  const PagesIndexIndex = /* @__PURE__ */ _export_sfc(_sfc_main$3, [["render", _sfc_render$2], ["__file", "D:/CodeBase/Panel/pages/index/index.vue"]]);
  const _sfc_main$2 = {
    data() {
      return {
        devices: []
        // 搜索到的设备列表
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
              formatAppLog("error", "at pages/bluetooth/bluetooth.vue:50", "Failed to Find Bluetooth", err);
              uni.showToast({
                title: "蓝牙启动失败！",
                icon: "fail",
                duration: 2e3
              });
            }
          });
        },
        fail: (err) => {
          formatAppLog("error", "at pages/bluetooth/bluetooth.vue:60", "Failed to open Bluetooth", err);
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
            formatAppLog("error", "at pages/bluetooth/bluetooth.vue:75", "Bluetooth Adapter FAILED", err);
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
            onClick: ($event) => _ctx.selectDevice(device),
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
        // 默认的设备信息
        deviceId: "60:E8:5B:6C:5C:8A",
        serviceId: "0000FFE0-0000-1000-8000-00805F9B34FB",
        characteristicId: "0000FFE1-0000-1000-8000-00805F9B34FB",
        groups: [
          {
            groupName: "电机PID",
            params: [
              { id: "Kp", label: "Kp", type: "number", value: 0, num: 1, codetype: 1 },
              { id: "Ki", label: "Ki", type: "number", value: 0, num: 2, codetype: 1 },
              { id: "Kd", label: "Kd", type: "number", value: 0, num: 3, codetype: 1 }
            ]
          },
          {
            groupName: "速度参数",
            params: [
              { id: "v_straight", label: "目标速度", type: "number", value: 0, num: 4, codetype: 0 },
              { id: "v_turning", label: "弯道速度", type: "number", value: 0, num: 5, codetype: 0 }
            ]
          }
        ]
      };
    },
    onLoad() {
    },
    methods: {
      checkNumberType(num) {
        if (Number.isInteger(num)) {
          return 1;
        } else {
          return 0;
        }
      },
      submitSingleParameter(paramNum, value, codetype) {
        sendByte(this.deviceId, this.serviceId, this.characteristicId);
        if (codetype == 0) {
          formatAppLog("log", "at pages/setting/setting.vue:72", "整数");
          setTimeout(() => {
            sendByte(this.deviceId, this.serviceId, this.characteristicId);
            setTimeout(() => {
              sendByte(this.deviceId, this.serviceId, this.characteristicId);
              setTimeout(() => {
                sendByte(this.deviceId, this.serviceId, this.characteristicId);
                setTimeout(() => {
                  sendByte(this.deviceId, this.serviceId, this.characteristicId);
                }, 10);
              }, 10);
            }, 10);
          }, 10);
        } else {
          formatAppLog("log", "at pages/setting/setting.vue:87", "浮点数");
          setTimeout(() => {
            sendByte(this.deviceId, this.serviceId, this.characteristicId);
            setTimeout(() => {
              sendByte(this.deviceId, this.serviceId, this.characteristicId);
              setTimeout(() => {
                sendByte(this.deviceId, this.serviceId, this.characteristicId);
                setTimeout(() => {
                  sendByte(this.deviceId, this.serviceId, this.characteristicId);
                }, 10);
              }, 10);
            }, 10);
          }, 10);
        }
      }
    }
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
                  ]),
                  vue.createElementVNode("button", {
                    onClick: ($event) => $options.submitSingleParameter(param.num, param.value, param.codetype),
                    class: "single-submit-btn"
                  }, "提交", 8, ["onClick"])
                ]);
              }),
              128
              /* KEYED_FRAGMENT */
            ))
          ]);
        }),
        128
        /* KEYED_FRAGMENT */
      ))
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
