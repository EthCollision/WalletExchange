<template>
	<view class="l-qrcode" :style="[styles]">
		<!-- #ifndef APP-NVUE -->
		<canvas :style="styles" v-if="use2d" type="2d" :canvas-id="canvasId" :id="canvasId"></canvas>
		<canvas :style="styles" v-else :canvas-id="canvasId" :id="canvasId"></canvas>
		<!-- #endif  -->
		<!-- #ifdef APP-NVUE  -->
		<web-view 
		ref="qrcodeRef"
		@pagefinish="onFinished" 
		@error="onError" 
		@onPostMessage="onMessage"
		:style="styles" src="/uni_modules/lime-qrcode/hybrid/html/index.html?v=1"></web-view>
		<!-- #endif  -->
		<!-- <view class="l-qrcode-mask" v-if="['loading', 'expired'].includes(props.status)">
			<l-loading v-if="props.status == 'loading'"></l-loading>
			<view class="l-qrcode-expired" v-if="props.status == 'expired'">
				<slot></slot>
			</view>
		</view> -->
	</view>
</template>
<script lang="ts">
	// @ts-nocheck
	/**
	 * QRCode 二维码组件
	 * @description 用于生成二维码图形，支持自定义图标和样式配置
	 * <br>插件类型：LQrcodeComponentPublicInstance 
	 * @tutorial https://ext.dcloud.net.cn/plugin?name=lime-qrcode
	 * 
	 * @property {string} value 二维码内容（支持文本/URL等）
	 * @property {string} icon 中心图标路径（支持本地/网络路径）
	 * @property {number | string} size 二维码尺寸
	 * @property {number | string} iconSize 中心图标尺寸
	 * @property {number} marginSize 二维码外边距（默认：0）
	 * @property {string} color 二维码颜色（默认：#000000）
	 * @property {string} bgColor 背景颜色（默认：#ffffff）
	 * @property {boolean} bordered 显示边框（默认：false）
	 * @property {'L' | 'M' | 'Q' | 'H'} errorLevel 容错等级（默认：'H'）
	 * @value L 可恢复7%的数据
	 * @value M 可恢复15%的数据  
	 * @value Q 可恢复25%的数据
	 * @value H 可恢复30%的数据
	 * @property {boolean} useCanvasToTempFilePath 使用canvas生成临时路径（H5端可能需要）
	 * @property {boolean} use2d 启用2D上下文渲染（性能优化，默认：false）
	 */
	import { computed, defineComponent, getCurrentInstance, watch, onUnmounted, onMounted } from '@/uni_modules/lime-shared/vue';
	import QRCodeProps from './props'
	// #ifndef APP-NVUE
	import { getCanvas, isCanvas2d } from './useCanvas'
	import { QRCodeCanvas } from './qrcode.js';
	// #endif
	import { addUnit } from '@/uni_modules/lime-shared/addUnit'
	import { createImage } from '@/uni_modules/lime-shared/createImage'
	import { unitConvert } from '@/uni_modules/lime-shared/unitConvert'
	import { isBase64 } from '@/uni_modules/lime-shared/isBase64'
	import { pathToBase64 } from '@/uni_modules/lime-shared/pathToBase64'
	import { debounce } from '@/uni_modules/lime-shared/debounce'
	const name = 'l-qrcode'
	export default defineComponent({
		name,
		props: QRCodeProps,
		emits: ['success'],
		setup(props, {emit}) {
			const context = getCurrentInstance();
			const canvasId = `l-qrcode${context.uid}` 
			const styles = computed(() => `width: ${addUnit(props.size)}; height: ${addUnit(props.size)};`)
			let qrcode = null
			let canvas = null
			const qrCodeProps = computed(() => {
				const { value, icon, size, color, bgColor, bordered, iconSize, errorLevel, marginSize } = props
				const imageSettings = {
					src: icon,
					x: undefined,
					y: undefined,
					height: unitConvert(iconSize),
					width: unitConvert(iconSize),
					excavate: true,
				}
				return {
					value,
					size: unitConvert(size),
					level: errorLevel,
					bgColor,
					fgColor: color,
					imageSettings: icon ? imageSettings : undefined,
					includeMargin: bordered,
					marginSize: marginSize ?? 0
				}

			})
			
			// #ifdef APP-NVUE
			const stacks = new Map()
			// #endif
			const canvasToTempFilePath = debounce((args: UniNamespace.CanvasToTempFilePathRes) => {
				if(!canvas) return
				// #ifndef APP-NVUE
				const copyArgs = Object.assign({
					canvasId,
					canvas: null
				}, args)
				
				if (isCanvas2d && props.use2d) {
					// copyArgs.canvas = canvas
					const tempFilePath = canvas.toDataURL();
					copyArgs.success({
						tempFilePath
					})
					return
				}
				if ('toTempFilePath' in canvas) {
					canvas.toTempFilePath(copyArgs)
				} else {
					uni.canvasToTempFilePath(copyArgs, context);
				}
				// #endif
				// #ifdef APP-NVUE
				if(!stacks.size) {
					const flie = 'file-' + Math.random();
					const stack = {args, time: +new Date()}
					stacks.set(`${flie}`, stack)
					canvas.toDataURL(flie)
					setTimeout(() => {
						const stack = stacks.get(flie)
						if(stack && 'fail' in stack.args) {
							stack.args.fail({
								error: '超时'
							})
							stacks.delete(flie)
						}
					},5000)
				} 
				// #endif
			})
			const useCanvasToTempFilePath = () => {
				if(props.useCanvasToTempFilePath) {
					canvasToTempFilePath({
						success(res: UniNamespace.CanvasToTempFilePathRes) {
							emit('success', res.tempFilePath)
						}
					})
				}
			}
			// #ifdef APP-NVUE
			const onFinished = () => {
				const { pixelRatio } = uni.getSystemInfoSync()
				canvas = {
					toDataURL(flie: string) {
						const ref: any = context.refs['qrcodeRef'];
						if(ref) {
							ref?.evalJS(`toDataURL('${flie}')`)
						}
					}
				};
				qrcode = {
					async render(props: any) {
						const ref: any = context.refs['qrcodeRef'];
						const { src } = props.imageSettings || { };
						if(!ref) return
						if(src && !isBase64(src) && !/^http/.test(src) && /^\/static/.test(src)) {
							props.imageSettings.src = await pathToBase64(src)
						}
						const _props = JSON.stringify(Object.assign({}, props, {pixelRatio}));
						ref?.evalJS(`render(${_props})`);
					}
				}
				qrcode.render(qrCodeProps.value)
				useCanvasToTempFilePath()
			}
			const onError = () => {
				console.warn('lime-qrcode 加载失败')
			}
			const onMessage = (e: any) => {
				const {detail:{data: [res]}} = e
				if(res.event == 'toDataURL') {
					const {file, image, msg} = res.data;
					const stack = stacks.get(file)
					if(stack && image && 'success' in stack.args) {
						stack.args.success({tempFilePath: image})
						stacks.delete(file)
					} else if(stack && 'fails' in stack.args) {
						stack.args.fail({error: msg})
						stacks.delete(file)
					}
				} 
			}
			// #endif
			const propsWatch = watch(props, () => {
				if (qrcode) {
					qrcode.render(qrCodeProps.value)
					useCanvasToTempFilePath()
				}
			})
			onMounted(() => {
				// #ifndef APP-NVUE
				getCanvas(canvasId, { context }).then(res => {
					canvas = res;
					qrcode = new QRCodeCanvas(res, {
						path2D: false,
						pixelRatio: isCanvas2d && props.use2d ? uni.getSystemInfoSync().pixelRatio : 1,
						createImage
					})
					qrcode.render(qrCodeProps.value)
					useCanvasToTempFilePath()
				})
				// #endif
			})
			onUnmounted(() => {
				propsWatch && propsWatch()
			})
			return {
				canvasId,
				styles,
				props,
				canvasToTempFilePath,
				
				// #ifdef APP-NVUE
				onFinished,
				onError,
				onMessage
				// #endif
			}
		}
	})
</script>
<style lang="scss">
	.l-qrcode {
		position: relative;

		&-mask {
			position: absolute;
			inset: 0;
			// inset-block-start: 0;
			// inset-inline-start: 0;
			z-index: 10;
			display: flex;
			flex-direction: column;
			justify-content: center;
			align-items: center;
			// width: 100%;
			// height: 100%;
			color: rgba(0, 0, 0, 0.88);
			line-height: 1.5714285714285714;
			background: rgba(255, 255, 255, 0.96);
			text-align: center;
		}
	}
</style>