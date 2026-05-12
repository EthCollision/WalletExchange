
// @ts-nocheck
import type { ComponentInternalInstance } from '@/uni_modules/lime-shared/vue'
import { getRect } from '@/uni_modules/lime-shared/getRect'
import { canIUseCanvas2d } from '@/uni_modules/lime-shared/canIUseCanvas2d'
export const isCanvas2d = canIUseCanvas2d()

export async function getCanvas(canvasId: string, options: {context: ComponentInternalInstance}) {
	let { context } = options
	// #ifdef MP || VUE2
	if (context.proxy) context = context.proxy
	// #endif
	return getRect('#' + canvasId, context, isCanvas2d).then(res => {
		if(res.node){
			return res.node
		} else {
			const ctx = uni.createCanvasContext(canvasId, context)
			return {
				getContext(type: string) {
					if(type == '2d') {
						return ctx
					}
				},
				width: res.width,
				height: res.height,
			}
			// #ifdef H5
			// canvas.value = context.proxy.$el.querySelector('#'+ canvasId)
			// #endif
		}
	})
}

// #ifndef H5 || APP-NVUE
class Image {
	currentSrc: string | null = null
	naturalHeight: number = 0
	naturalWidth: number = 0
	width: number = 0
	height: number = 0
	tagName: string = 'IMG'
	path: any = ''
	crossOrigin: any = ''
	referrerPolicy: any = ''
	onload: () => void
	onerror: () => void
	constructor() {}
	set src(src) {
		this.currentSrc = src
		uni.getImageInfo({
			src,
			success: (res) => {
				this.path = res.path
				this.naturalWidth = this.width = res.width
				this.naturalHeight = this.height = res.height
				this.onload()
			},
			fail: () => {
				this.onerror()
			}
		})
	}
	get src() {
		return this.currentSrc
	}
}
// #endif

export function createImage(canvas: WechatMiniprogram.Canvas) {
	if(canvas && canvas.createImage) {
		return canvas.createImage()
	} else if(typeof window != 'undefined' && window.Image) {
		return new window.Image()
	}
	// #ifndef H5 || APP-NVUE
	return new Image()
	// #endif
}