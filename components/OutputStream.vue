<template>
	<checkbox-group @change="checkboxChange">
		<label class="switch" v-for="checkbox in checkboxes" :key="checkbox.value">
			<checkbox class="toggle" :value="checkbox.value" :checked="checkbox.checked" />
			<span class="slider" :class="{ 'slider-checked': checkbox.checked }"></span>
			<text>时间戳</text>
		</label>
	</checkbox-group>
	<view class="container">
		<scroll-view scroll-y style="height: 100px;" :scroll-into-view="scrollIntoViewId">
			<view v-for="(line, index) in LineText" :key="index" :id="'line' + index">
				<span v-if="showTimestamp" class="timeStamp">({{ line.timestamp }})</span> {{ line.text }}
			</view>
		</scroll-view>
	</view>
</template>

<script>
	export default {
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
				scrollIntoViewId: '',
				showTimestamp: false,
				checkboxes: [{
						value: 'Stamp',
						name: '时间戳',
						checked: false
					}
					
				],
			};
		},
		watch: {
			inputString: {
				immediate: true,
				deep: true,
				handler(newVal) {
					if (newVal && newVal.value) {
						const timestamp = new Date().toLocaleTimeString(); // 生成时间戳
						this.LineText.push({
							text: newVal.value,
							timestamp: timestamp
						});
						this.scrollIntoViewId = 'line' + (this.LineText.length - 1);
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
				this.checkboxes.forEach(checkbox => {
					checkbox.checked = values.includes(checkbox.value);
				});
				this.showTimestamp = this.checkboxes[0].checked;
			}
		}
	}
</script>

<style>
	@font-face {
		font-family: 'Consola';
		src: url('@/static/font/consola.ttf');
	}

	.container {
		width: 100%;
		height: 100px;
		border: 1px solid #d0d0d0;
		display: flex;
		padding: 3px;
		/* justify-content: center;
		align-items: center;*/
		background-color: #ffffff;
		margin: 10px auto;
		border-radius: 10px;
		font-family: 'Consola', sans-serif;
	}

	.stream-text {
		color: black;
		/* 文本颜色 */
		font-size: 30px;
		/* 文本大小 */
		font-weight: bold;
		/* 文本加粗 */
	}

	.timeStamp {
		color: #0101f0;

	}

	.checkbox-con {
		margin: 10px;
		display: flex;
		align-items: center;
		color: white;
	}

	.checkbox-con input[type="checkbox"] {
		appearance: none;
		width: 48px;
		height: 27px;
		border: 2px solid #ff0000;
		border-radius: 20px;
		background: #f1e1e1;
		position: relative;
		box-sizing: border-box;
	}

	.checkbox-con input[type="checkbox"]::before {
		content: "";
		width: 14px;
		height: 14px;
		background: rgba(234, 7, 7, 0.5);
		border: 2px solid #ea0707;
		border-radius: 50%;
		position: absolute;
		top: 0;
		left: 0;
		transform: translate(13%, 15%);
		transition: all 0.3s ease-in-out;
	}



	.checkbox-con input[type="checkbox"]::after {
		content: url("data:image/svg+xml,%3Csvg xmlns='://www.w3.org/2000/svg' width='23' height='23' viewBox='0 0 23 23' fill='none'%3E%3Cpath fill-rule='evenodd' clip-rule='evenodd' d='M6.55021 5.84315L17.1568 16.4498L16.4497 17.1569L5.84311 6.55026L6.55021 5.84315Z' fill='%23EA0707' fill-opacity='0.89'/%3E%3Cpath fill-rule='evenodd' clip-rule='evenodd' d='M17.1567 6.55021L6.55012 17.1568L5.84302 16.4497L16.4496 5.84311L17.1567 6.55021Z' fill='%23EA0707' fill-opacity='0.89'/%3E%3C/svg%3E");
		position: absolute;
		top: 0;
		left: 20px;
	}

	.checkbox-con input[type="checkbox"]:checked {
		border: 2px solid #02c202;
		background: #e2f1e1;
	}

	.checkbox-con input[type="checkbox"]:checked::before {
		background: rgba(2, 194, 2, 0.5);
		border: 2px solid #02c202;
		transform: translate(133%, 13%);
		transition: all 0.3s ease-in-out;
	}

	.checkbox-con input[type="checkbox"]:checked::after {
		content: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='15' height='13' viewBox='0 0 15 13' fill='none'%3E%3Cpath fill-rule='evenodd' clip-rule='evenodd' d='M14.8185 0.114533C15.0314 0.290403 15.0614 0.605559 14.8855 0.818454L5.00187 12.5L0.113036 6.81663C-0.0618274 6.60291 -0.0303263 6.2879 0.183396 6.11304C0.397119 5.93817 0.71213 5.96967 0.886994 6.18339L5.00187 11L14.1145 0.181573C14.2904 -0.0313222 14.6056 -0.0613371 14.8185 0.114533Z' fill='%2302C202' fill-opacity='0.9'/%3E%3C/svg%3E");
		position: absolute;
		top: 5px;
		left: 5px;
	}

	.checkbox-con label {
		margin-left: 10px;
		cursor: pointer;
		user-select: none;
	}
</style>