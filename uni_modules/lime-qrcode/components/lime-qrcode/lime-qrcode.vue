<template>
	<view class="demo-block">
		<text class="demo-block__title-text ultra">QRCode 二维码</text>
		<text class="demo-block__desc-text">生成二维码</text>
		<view class="demo-block__body">
			
			<view class="demo-block">
				<text class="demo-block__title-text">基础</text>
				<view class="demo-block__body">
					<view style="display: flex; gap: 10px">
					<image v-if="image" :src="image" style="width: 300rpx;" mode="widthFix"></image>
					<l-qrcode :use2d="false" ref="qrcodeRef" value="https://limeui.qcoon.cn" size="300rpx" icon="https://img10.360buyimg.com/img/jfs/t1/182127/16/37474/11761/64659c31F0cd84976/21f25b952f03a49a.jpg" iconSize="70rpx"></l-qrcode>
					<!-- <l-qrcode useCanvasToTempFilePath @success="success" value="https://limeui.qcoon.cn" size="300rpx" icon="https://img10.360buyimg.com/img/jfs/t1/182127/16/37474/11761/64659c31F0cd84976/21f25b952f03a49a.jpg" iconSize="70rpx"></l-qrcode> -->
				</view>
				<button @click="onClick">生成图片</button>				
			</view>
			</view>
	
			<view class="demo-block">
				<text class="demo-block__title-text">颜色</text>
				<view class="demo-block__body">
					<view style="display: flex; gap: 10px">
						<l-qrcode value="https://limeui.qcoon.cn" size="300rpx" color="rgb(82,196,26)"></l-qrcode>
						<l-qrcode value="https://limeui.qcoon.cn" size="300rpx" color="rgb(22,119,255)" bgColor="rgb(245,245,245)"></l-qrcode>
					</view>	
				</view>
			</view>
			<view class="demo-block">
				<text class="demo-block__title-text">纠错比例</text>
				<view class="demo-block__body">
					<l-qrcode value="img10.360buyimg.com/img/jfs/t1/182127/16/37474/11761/64659c31F0cd84976/21f25b952f03a49a.jpg" size="300rpx" :errorLevel="levels[index]"></l-qrcode>
					<button @click="onToggle">切换纠错等级：{{levels[index]}}</button>
				</view>
			</view>
			<view class="demo-block">
				<text class="demo-block__title-text">动态</text>
				<view class="demo-block__body">
					<l-qrcode :value="text" size="300rpx" :marginSize="1" bgColor="white"></l-qrcode>
					<button @click="update">更新</button>
				</view>
			</view>
		</view>
	</view>
</template>
<script>
	import {ref, defineComponent} from '@/uni_modules/lime-shared/vue'
	export default defineComponent({
		setup() {
			const qrcodeRef = ref(null)
			const image = ref(null)
			const text = ref('qcoon.com.cn')
			const levels = ['L', 'M', 'Q', 'H']
			let index = ref(0)
			const onToggle = () => {
				index.value++
				index.value = index.value % levels.length
			}
			const onClick = () => {
				if(qrcodeRef.value) {
					qrcodeRef.value.canvasToTempFilePath({
						success(res) {
							image.value = res.tempFilePath
							console.log('success:::', res)
						},
						fail(err) {
							console.log('err:::', err)
						}
					})
				}
			}
			const success = (res) => {
				console.log('res', res)
			}
			
			const update = () =>{
				text.value =  `qcoon.cn?v=${Math.random()}`
			}
			
			return {
				levels,
				index,
				image,
				text,
				qrcodeRef,
				onClick,
				update,
				success,
				onToggle,
			}
		}
	})
</script>
<style lang="scss">
	
	.demo-block {
		margin: 32px 10px 0;
		overflow: visible;
		&.card{
			background-color: white;
			padding: 30rpx;
			margin-bottom: 20rpx;
		}
		&__title {
			margin: 0;
			margin-top: 8px;
			&-text {
				color: rgba(0, 0, 0, 0.6);
				font-weight: 400;
				font-size: 14px;
				line-height: 16px;
				display: flex;
				&.large {
					color: rgba(0, 0, 0, 0.9);
					font-size: 18px;
					font-weight: 700;
					line-height: 26px;
				}
				&.ultra {
					color: rgba(0, 0, 0, 0.9);
					font-size: 24px;
					font-weight: 700;
					line-height: 32px;
				}
			}
		}
		&__desc-text {
			color: rgba(0, 0, 0, 0.6);
			margin: 8px 16px 0 0;
			font-size: 14px;
			line-height: 22px;
		}
		&__body {
			margin: 16px 0;
			overflow: visible;
			.demo-block {
				// margin-top: 0px;
				margin: 0;
			}
		}
	}
</style>