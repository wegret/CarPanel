<template>
	<view class="content">

		<!-- 散点图 -->
		<div id="chartSdtV" style="width: 96vw; height: 96vw; margin-top: 20px; margin-left: 0vw;">

		</div>

	</view>
</template>

<script>
	import echarts from '../../static/h5/echarts.min.js'

	
	export default {
		data() {
			return {

			}
		},
		mounted() {
		
		   //  模拟散点图数据
		   let dataDict = {"otherComs":[["0.166","0.948"],["0.366","0.248"],["0.766","0.248"],["0.566","0.248"],["0.166","0.248"],["0.6686","0.8948"],["0.5686","0.848"],["0.686","0.448"],["0.386","0.4448"],["0.8686","0.8448"],["0.9686","0.3448"],["0.7686","0.48"],["0.786","0.268"],["0.36","0.753"],["0.756","0.8434"]],"localComs":[["0.3386","0.8648"]]};
		  
		   let curSeries =  [
			{
				name: "其他同事",
				type: 'scatter',
				symbolSize: 4,
				data: dataDict.otherComs
			},
			{
					name: "我的位置",
					type: 'scatter',
					symbolSize: 6,
					data: dataDict.localComs
			}
		]
		var option = {
			// 设置间距
			 grid: {
			    left: '0%',
			    right: '12%',
			    bottom: '7%',
			    containLabel: true
			  },
			tooltip: {
				trigger: 'axis',
				axisPointer: {
					// Use axis to trigger tooltip
					type: 'none' // 'shadow' as default; can also be 'line' or 'shadow'
				},
				textStyle: {
					fontSize: 10,
			
				},
				padding: [8, 8],
				position: [6,6],
				show: true,
			
			},
			
			xAxis: {
				name: '业绩',
				splitLine: {
					show: false
				},
				min:0,
				max:1,
				
			},
			yAxis: {
				name: '成长',
				splitLine: {
					show: false
				},
				min:0,
				max:1
			},
			legend: {
				// 
				data: ['我的位置', '其他同事']
			},
			series: curSeries
		};
		//  专利含金量图
		var dom = document.getElementById("chartSdtV");
		var myChart = echarts.init(dom);
		
		if (option && typeof option === 'object') {
			myChart.setOption(option);
		}
		
		},

		methods: {

		}
	}
</script>

<style>
	.content {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
	}

	
</style>