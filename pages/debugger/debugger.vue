<template>
	<view class="content">
		<radio-group @change="onRadioChange" class="radio-inputs">
			<view v-for="(item, index) in moduleBoxes" class="radio-tile" :key="index">
				<radio class="radio-input" :value="item.value" :checked="item.checked">{{ item.name }}</radio>
			</view>
		</radio-group>
		<view v-if="selectedModuleValue=='Normal'" class="module-container">
			<text class="text-log">已开启普通模式！</text>
			<checkbox-group @change="checkboxChange_Normal">
				<label v-for="checkbox in checkboxes_Normal" :key="checkbox.value">
					<checkbox :value="checkbox.value" :checked="checkbox.checked">
						{{checkbox.name}}
					</checkbox>
				</label>
			</checkbox-group>
		</view>

		<view v-if="selectedModuleValue=='Camera'" class="module-container">
			<text class="text-log">已开启图传模式！</text>
			<checkbox-group @change="checkboxChange_Camera">
				<label v-for="checkbox in checkboxes_Camera" :key="checkbox.value">
					<checkbox :value="checkbox.value" :checked="checkbox.checked">
						{{checkbox.name}}
					</checkbox>
				</label>
			</checkbox-group>
		</view>
	</view>
</template>

<script>
	import {
		sendByte
	} from '../../services/BLE';
	export default {
		data() {
			return {
				moduleBoxes: [{
						value: 'Normal',
						name: '普通模式',
						checked: true,
						code: 1
					},
					{
						value: 'Camera',
						name: '图传模式',
						checked: false,
						code: 2
					}
				],
				selectedModuleValue: 'Normal', // 初始选中的值

				checkboxes_Normal: [{
						value: 'NOR_DIFFSPEED_VIS',
						name: '是否开启差速',
						code: 1,
						checked: true
					},
					{
						value: 'NOR_STATE_MONITOR',
						name: '是否开启状态监视',
						code: 2,
						checked: true
					}

				],

				checkboxes_Camera: [{
						value: 'CAM_PC_VIS',
						name: '是否传图给上位机',
						code: 1,
						checked: true
					},
					{
						value: 'CAM_TFT_VIS',
						name: '是否传图给TFT屏幕',
						code: 2,
						checked: false
					},
					{
						value: 'CAM_SERVO_ON',
						name: '是否开启舵机测试方向',
						code: 3,
						checked: false
					}

				],
			}
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
				console.log(this.selectedModuleValue);
			},
			async sendByteAsync(byte) {
				await new Promise(resolve => {
					sendByte(byte);
					setTimeout(resolve, 10);
				});
			},
			async chooseModule(box) {
				await this.sendByteAsync(0x04);
				await this.sendByteAsync(box.code);
				await this.sendByteAsync(0x00);
			},
			async chooseDetail(detail, state) {
				await this.sendByteAsync(0x05);
				await this.sendByteAsync(detail);
				await this.sendByteAsync(state + 1);
				await this.sendByteAsync(0x00);
			},
			checkboxChange_Camera: function(e) {
				var values = e.detail.value;
				this.checkboxes_Camera.forEach(checkbox => {
					if (checkbox.checked != values.includes(checkbox.value)) {
						checkbox.checked = values.includes(checkbox.value);
						this.chooseDetail(checkbox.code, checkbox.checked);
					}
				});
			},

			checkboxChange_Normal: function(e) {
				var values = e.detail.value;
				this.checkboxes_Normal.forEach(checkbox => {
					if (checkbox.checked != values.includes(checkbox.value)) {
						checkbox.checked = values.includes(checkbox.value);
						this.chooseDetail(checkbox.code, checkbox.checked);
					}
				});
			}
		}
	}
</script>

<style>
	.radio-inputs {
		display: flex;
		flex-direction: column;
		align-items: center;
		padding: 20px;
		background-color: var(--back-color);
		/* 应用主题背景色 */
		color: var(--text-color);
		/* 应用主题文本色 */
		border-radius: 8px;
		border: 1px solid #00aaff;
		padding: 10px;
	}

	.radio-tile {
		display: flex;
		align-items: center;
		margin: 10px 0;
		cursor: pointer;

	}

	.radio-input {
		background-color: transparent;
		border-radius: 50%;
	}

	.module-container {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		padding: 20px;
		background-color: var(--back-color);
		/* 应用主题背景色 */
		color: var(--text-color);
		/* 应用主题文本色 */
		border-radius: 8px;
	}

	.text-log {
		padding: 20px;
	}

	label {
		display: flex;
		flex-direction: column;
		align-items: left;
		margin-bottom: 10px;
		/* 可以调整间距 */
	}
</style>