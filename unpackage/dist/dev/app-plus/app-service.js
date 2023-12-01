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
        formatAppLog("log", "at services/BLE.js:27", "Connect OK!");
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
        formatAppLog("log", "at services/BLE.js:57", "Notification enabled for", PanelService.characteristicId, ":", res);
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
              formatAppLog("error", "at services/BLE.js:92", "Fail to send after retries!", err);
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
        formatAppLog("log", "at services/BLE.js:117", "Data sent successfully:", res);
        uni.showToast({
          title: "发送成功！",
          icon: "success",
          duration: 2e3
        });
      },
      fail: function(err) {
        formatAppLog("error", "at services/BLE.js:125", "Failed to send data:", err);
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
  const _sfc_main$6 = {
    name: "OutputStream",
    props: {
      inputString: {
        type: Object,
        default: () => ({})
      }
    },
    data() {
      return {
        LineText: [],
        scrollIntoViewId: "",
        showTimestamp: false,
        checkboxes: [
          {
            value: "Stamp",
            name: "时间戳",
            checked: false
          }
        ]
      };
    },
    watch: {
      inputString: {
        immediate: true,
        deep: true,
        handler(newVal) {
          if (newVal && newVal.value) {
            const timestamp = (/* @__PURE__ */ new Date()).toLocaleTimeString();
            this.LineText.push({
              text: newVal.value,
              timestamp
            });
            this.scrollIntoViewId = "line" + (this.LineText.length - 1);
          }
        }
      }
    },
    methods: {
      toggleTimestamp() {
        this.showTimestamp = !this.showTimestamp;
      },
      checkboxChange: function(e) {
        var values = e.detail.value;
        this.checkboxes.forEach((checkbox) => {
          checkbox.checked = values.includes(checkbox.value);
        });
        this.showTimestamp = this.checkboxes[0].checked;
      }
    }
  };
  function _sfc_render$5(_ctx, _cache, $props, $setup, $data, $options) {
    return vue.openBlock(), vue.createElementBlock(
      vue.Fragment,
      null,
      [
        vue.createElementVNode(
          "checkbox-group",
          {
            onChange: _cache[0] || (_cache[0] = (...args) => $options.checkboxChange && $options.checkboxChange(...args))
          },
          [
            (vue.openBlock(true), vue.createElementBlock(
              vue.Fragment,
              null,
              vue.renderList($data.checkboxes, (checkbox) => {
                return vue.openBlock(), vue.createElementBlock("label", {
                  class: "switch",
                  key: checkbox.value
                }, [
                  vue.createElementVNode("checkbox", {
                    class: "toggle",
                    value: checkbox.value,
                    checked: checkbox.checked
                  }, null, 8, ["value", "checked"]),
                  vue.createElementVNode(
                    "span",
                    {
                      class: vue.normalizeClass(["slider", { "slider-checked": checkbox.checked }])
                    },
                    null,
                    2
                    /* CLASS */
                  ),
                  vue.createElementVNode("text", null, "时间戳")
                ]);
              }),
              128
              /* KEYED_FRAGMENT */
            ))
          ],
          32
          /* HYDRATE_EVENTS */
        ),
        vue.createElementVNode("view", { class: "container" }, [
          vue.createElementVNode("scroll-view", {
            "scroll-y": "",
            style: { "height": "100px" },
            "scroll-into-view": $data.scrollIntoViewId
          }, [
            (vue.openBlock(true), vue.createElementBlock(
              vue.Fragment,
              null,
              vue.renderList($data.LineText, (line, index) => {
                return vue.openBlock(), vue.createElementBlock("view", {
                  key: index,
                  id: "line" + index
                }, [
                  $data.showTimestamp ? (vue.openBlock(), vue.createElementBlock(
                    "span",
                    {
                      key: 0,
                      class: "timeStamp"
                    },
                    "(" + vue.toDisplayString(line.timestamp) + ")",
                    1
                    /* TEXT */
                  )) : vue.createCommentVNode("v-if", true),
                  vue.createTextVNode(
                    " " + vue.toDisplayString(line.text),
                    1
                    /* TEXT */
                  )
                ], 8, ["id"]);
              }),
              128
              /* KEYED_FRAGMENT */
            ))
          ], 8, ["scroll-into-view"])
        ])
      ],
      64
      /* STABLE_FRAGMENT */
    );
  }
  const OutputStream = /* @__PURE__ */ _export_sfc(_sfc_main$6, [["render", _sfc_render$5], ["__scopeId", "data-v-bd20f49f"], ["__file", "D:/CodeBase/Panel/components/OutputStream.vue"]]);
  const _sfc_main$5 = {
    components: {
      OutputStream
    },
    data() {
      return {
        title: "Panel",
        IndexIsConnected: false,
        // 收到的信息队列
        byteQueue: [],
        streamText: {
          value: ""
        },
        states: [{
          id: "Angle",
          label: "Angle",
          type: "number",
          value: 0,
          num: 1,
          codetype: 1
        }]
      };
    },
    onShow() {
      this.IndexIsConnected = isConnected;
      formatAppLog("log", "at pages/index/index.vue:76", "Connection State:", this.IndexIsConnected);
      if (this.IndexIsConnected)
        formatAppLog("log", "at pages/index/index.vue:78", "DeviceId:", PanelService.deviceId);
      uni.onBLEConnectionStateChange((res) => {
        if (!res.connected) {
          formatAppLog("log", "at pages/index/index.vue:82", "连接已断开");
          this.IndexIsConnected = false;
          uni.showToast({
            title: "蓝牙已断开！",
            icon: "fail",
            duration: 2e3
          });
        }
      });
    },
    onLoad() {
      uni.onBLECharacteristicValueChange((res) => {
        formatAppLog("log", "at pages/index/index.vue:95", "Receive!");
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
      /* 跳转：调试模式 */
      gotoDebugger() {
        uni.navigateTo({
          url: "/pages/debugger/debugger"
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
      getHex_value_2(a, b) {
        return (a - 1) * 254 + (b - 1);
      },
      // 处理当前命令行
      handleMessage() {
        formatAppLog("log", "at pages/index/index.vue:155", "Line", this.byteQueue);
        this.streamText = {
          key: Date.now(),
          value: this.byteQueue.join(",") + ";"
        };
        if (this.byteQueue[0] == "0x02") {
          let num = this.byteQueue[1];
          let value = this.getHex_value_2(this.byteQueue[2], this.byteQueue[3]);
          let stateToUpdate = this.states.find((state) => state.num === num);
          if (stateToUpdate) {
            stateToUpdate.value = value;
          }
        }
        this.byteQueue = [];
      }
    }
  };
  function _sfc_render$4(_ctx, _cache, $props, $setup, $data, $options) {
    const _component_OutputStream = vue.resolveComponent("OutputStream");
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
      ]),
      vue.createElementVNode("view", null, [
        vue.createElementVNode("button", {
          onClick: _cache[6] || (_cache[6] = (...args) => $options.gotoDebugger && $options.gotoDebugger(...args))
        }, "调试模式")
      ]),
      vue.createVNode(_component_OutputStream, { inputString: $data.streamText }, null, 8, ["inputString"]),
      $data.IndexIsConnected ? (vue.openBlock(true), vue.createElementBlock(
        vue.Fragment,
        { key: 2 },
        vue.renderList($data.states, (state) => {
          return vue.openBlock(), vue.createElementBlock("view", { class: "state-container" }, [
            vue.createElementVNode(
              "text",
              { class: "state-text-title" },
              vue.toDisplayString(state.label),
              1
              /* TEXT */
            ),
            vue.createElementVNode(
              "text",
              { class: "state-text-detail" },
              vue.toDisplayString(state.value),
              1
              /* TEXT */
            )
          ]);
        }),
        256
        /* UNKEYED_FRAGMENT */
      )) : vue.createCommentVNode("v-if", true)
    ]);
  }
  const PagesIndexIndex = /* @__PURE__ */ _export_sfc(_sfc_main$5, [["render", _sfc_render$4], ["__file", "D:/CodeBase/Panel/pages/index/index.vue"]]);
  const _sfc_main$4 = {
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
  function _sfc_render$3(_ctx, _cache, $props, $setup, $data, $options) {
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
  const PagesBluetoothBluetooth = /* @__PURE__ */ _export_sfc(_sfc_main$4, [["render", _sfc_render$3], ["__file", "D:/CodeBase/Panel/pages/bluetooth/bluetooth.vue"]]);
  const _sfc_main$3 = {
    data() {
      return {
        groups: [
          {
            groupName: "电机PID",
            params: [
              {
                id: "Kp",
                label: "Kp",
                type: "number",
                value: 0,
                num: 1,
                codetype: 1
              },
              {
                id: "Ki",
                label: "Ki",
                type: "number",
                value: 0,
                num: 2,
                codetype: 1
              },
              {
                id: "Kd",
                label: "Kd",
                type: "number",
                value: 0,
                num: 3,
                codetype: 1
              }
            ]
          },
          {
            groupName: "速度参数",
            params: [
              {
                id: "v_straight",
                label: "目标速度",
                type: "number",
                value: 0,
                num: 4,
                codetype: 0
              },
              {
                id: "v_turning",
                label: "弯道速度",
                type: "number",
                value: 0,
                num: 5,
                codetype: 0
              }
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
      async sendByteAsync(byte) {
        await new Promise((resolve) => {
          sendByte(byte);
          setTimeout(resolve, 10);
        });
      },
      async submitSingleParameter(paramNum, value, codetype) {
        await this.sendByteAsync(3);
        if (codetype == 0) {
          formatAppLog("log", "at pages/setting/setting.vue:101", "整数");
          await this.sendByteAsync(paramNum);
          await this.sendByteAsync(value / 254 + 1);
          await this.sendByteAsync(value % 254 + 1);
          await this.sendByteAsync(0);
        } else {
          formatAppLog("log", "at pages/setting/setting.vue:107", "浮点数");
          let result = Math.round(value * 100);
          await this.sendByteAsync(paramNum);
          await this.sendByteAsync(result / 254 + 1);
          await this.sendByteAsync(result % 254 + 1);
          await this.sendByteAsync(0);
        }
      }
    }
  };
  function _sfc_render$2(_ctx, _cache, $props, $setup, $data, $options) {
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
                    class: "button btn-submit"
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
  const PagesSettingSetting = /* @__PURE__ */ _export_sfc(_sfc_main$3, [["render", _sfc_render$2], ["__file", "D:/CodeBase/Panel/pages/setting/setting.vue"]]);
  const _sfc_main$2 = {
    data() {
      return {
        moduleBoxes: [
          {
            value: "Normal",
            name: "普通模式",
            checked: true,
            code: 1
          },
          {
            value: "Camera",
            name: "图传模式",
            checked: false,
            code: 2
          }
        ],
        selectedModuleValue: "Normal",
        // 初始选中的值
        checkboxes_Normal: [
          {
            value: "NOR_DIFFSPEED_VIS",
            name: "是否开启差速",
            code: 1,
            checked: true
          },
          {
            value: "NOR_STATE_MONITOR",
            name: "是否开启状态监视",
            code: 2,
            checked: true
          }
        ],
        checkboxes_Camera: [
          {
            value: "CAM_PC_VIS",
            name: "是否传图给上位机",
            code: 1,
            checked: true
          },
          {
            value: "CAM_TFT_VIS",
            name: "是否传图给TFT屏幕",
            code: 2,
            checked: false
          },
          {
            value: "CAM_SERVO_ON",
            name: "是否开启舵机测试方向",
            code: 3,
            checked: false
          }
        ]
      };
    },
    methods: {
      onRadioChange: function(e) {
        var values = e.detail.value;
        for (const box of this.moduleBoxes) {
          box.checked = values.includes(box.value);
          if (box.checked) {
            this.selectedModuleValue = box.value;
            this.chooseModule(box);
          }
        }
        formatAppLog("log", "at pages/debugger/debugger.vue:101", this.selectedModuleValue);
      },
      async sendByteAsync(byte) {
        await new Promise((resolve) => {
          sendByte(byte);
          setTimeout(resolve, 10);
        });
      },
      async chooseModule(box) {
        await this.sendByteAsync(4);
        await this.sendByteAsync(box.code);
        await this.sendByteAsync(0);
      },
      async chooseDetail(detail, state) {
        await this.sendByteAsync(5);
        await this.sendByteAsync(detail);
        await this.sendByteAsync(state + 1);
        await this.sendByteAsync(0);
      },
      checkboxChange_Camera: function(e) {
        var values = e.detail.value;
        this.checkboxes_Camera.forEach((checkbox) => {
          if (checkbox.checked != values.includes(checkbox.value)) {
            checkbox.checked = values.includes(checkbox.value);
            this.chooseDetail(checkbox.code, checkbox.checked);
          }
        });
      },
      checkboxChange_Normal: function(e) {
        var values = e.detail.value;
        this.checkboxes_Normal.forEach((checkbox) => {
          if (checkbox.checked != values.includes(checkbox.value)) {
            checkbox.checked = values.includes(checkbox.value);
            this.chooseDetail(checkbox.code, checkbox.checked);
          }
        });
      }
    }
  };
  function _sfc_render$1(_ctx, _cache, $props, $setup, $data, $options) {
    return vue.openBlock(), vue.createElementBlock("view", { class: "content" }, [
      vue.createElementVNode(
        "radio-group",
        {
          onChange: _cache[0] || (_cache[0] = (...args) => $options.onRadioChange && $options.onRadioChange(...args)),
          class: "radio-inputs"
        },
        [
          (vue.openBlock(true), vue.createElementBlock(
            vue.Fragment,
            null,
            vue.renderList($data.moduleBoxes, (item, index) => {
              return vue.openBlock(), vue.createElementBlock("view", {
                class: "radio-tile",
                key: index
              }, [
                vue.createElementVNode("radio", {
                  class: "radio-input",
                  value: item.value,
                  checked: item.checked
                }, vue.toDisplayString(item.name), 9, ["value", "checked"])
              ]);
            }),
            128
            /* KEYED_FRAGMENT */
          ))
        ],
        32
        /* HYDRATE_EVENTS */
      ),
      $data.selectedModuleValue == "Normal" ? (vue.openBlock(), vue.createElementBlock("view", {
        key: 0,
        class: "module-container"
      }, [
        vue.createElementVNode("text", { class: "text-log" }, "已开启普通模式！"),
        vue.createElementVNode(
          "checkbox-group",
          {
            onChange: _cache[1] || (_cache[1] = (...args) => $options.checkboxChange_Normal && $options.checkboxChange_Normal(...args))
          },
          [
            (vue.openBlock(true), vue.createElementBlock(
              vue.Fragment,
              null,
              vue.renderList($data.checkboxes_Normal, (checkbox) => {
                return vue.openBlock(), vue.createElementBlock("label", {
                  key: checkbox.value
                }, [
                  vue.createElementVNode("checkbox", {
                    value: checkbox.value,
                    checked: checkbox.checked
                  }, vue.toDisplayString(checkbox.name), 9, ["value", "checked"])
                ]);
              }),
              128
              /* KEYED_FRAGMENT */
            ))
          ],
          32
          /* HYDRATE_EVENTS */
        )
      ])) : vue.createCommentVNode("v-if", true),
      $data.selectedModuleValue == "Camera" ? (vue.openBlock(), vue.createElementBlock("view", {
        key: 1,
        class: "module-container"
      }, [
        vue.createElementVNode("text", { class: "text-log" }, "已开启图传模式！"),
        vue.createElementVNode(
          "checkbox-group",
          {
            onChange: _cache[2] || (_cache[2] = (...args) => $options.checkboxChange_Camera && $options.checkboxChange_Camera(...args))
          },
          [
            (vue.openBlock(true), vue.createElementBlock(
              vue.Fragment,
              null,
              vue.renderList($data.checkboxes_Camera, (checkbox) => {
                return vue.openBlock(), vue.createElementBlock("label", {
                  key: checkbox.value
                }, [
                  vue.createElementVNode("checkbox", {
                    value: checkbox.value,
                    checked: checkbox.checked
                  }, vue.toDisplayString(checkbox.name), 9, ["value", "checked"])
                ]);
              }),
              128
              /* KEYED_FRAGMENT */
            ))
          ],
          32
          /* HYDRATE_EVENTS */
        )
      ])) : vue.createCommentVNode("v-if", true)
    ]);
  }
  const PagesDebuggerDebugger = /* @__PURE__ */ _export_sfc(_sfc_main$2, [["render", _sfc_render$1], ["__file", "D:/CodeBase/Panel/pages/debugger/debugger.vue"]]);
  const _sfc_main$1 = {
    data() {
      return {
        waveInterval: 50,
        formWidth: "",
        formHeight: "",
        waveData: []
      };
    },
    onReady() {
      const animationCtx = uni.createCanvasContext("Waveform-canvas", this);
      let angle = 0;
      setInterval(() => {
        animationCtx.clearRect(0, 0, 200, 200);
        animationCtx.beginPath();
        animationCtx.arc(100, 100, 50, 0, 2 * Math.PI);
        animationCtx.setFillStyle("#66ccff");
        animationCtx.fill();
        animationCtx.closePath();
        animationCtx.beginPath();
        animationCtx.arc(100, 100, 50, 0, angle);
        animationCtx.setStrokeStyle("#ffcc00");
        animationCtx.setLineWidth(5);
        animationCtx.stroke();
        animationCtx.closePath();
        animationCtx.draw();
        angle += 0.1;
        if (angle >= 2 * Math.PI) {
          angle = 0;
        }
      }, this.waveInterval);
    }
  };
  function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
    return vue.openBlock(), vue.createElementBlock("view", { class: "content" }, [
      vue.createElementVNode("canvas", {
        class: "WaveCanvas-container",
        "canvas-id": "Waveform-canvas",
        style: { "width": "100%", "height": "200px" }
      })
    ]);
  }
  const PagesScreenScreen = /* @__PURE__ */ _export_sfc(_sfc_main$1, [["render", _sfc_render], ["__file", "D:/CodeBase/Panel/pages/screen/screen.vue"]]);
  __definePage("pages/index/index", PagesIndexIndex);
  __definePage("pages/bluetooth/bluetooth", PagesBluetoothBluetooth);
  __definePage("pages/setting/setting", PagesSettingSetting);
  __definePage("pages/debugger/debugger", PagesDebuggerDebugger);
  __definePage("pages/screen/screen", PagesScreenScreen);
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
