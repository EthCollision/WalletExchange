
// @ts-nocheck
// #ifndef UNI-APP-X && APP
import type { ComponentInternalInstance } from '@/uni_modules/lime-shared/vue'
import { getRect } from '@/uni_modules/lime-shared/getRect'
import { canIUseCanvas2d } from '@/uni_modules/lime-shared/canIUseCanvas2d'
export const isCanvas2d = canIUseCanvas2d()
// #endif


export function createCanvas(canvasId : string, component : ComponentInternalInstance) {
	// #ifdef UNI-APP-X
	uni.createCanvasContextAsync({
		canvasId,
		component,
		success(context : CanvasContext) {

		},
		fail(error : UniError) {

		}
	})
	// #endif
	// #ifndef UNI-APP-X
	const isCanvas2d = canIUseCanvas2d()
	getRect('#' + canvasId, context, isCanvas2d).then(res => {
		if (res.node) {
			res.node.width = res.width
			res.node.height = res.height
			return res.node
		} else {
			const ctx = uni.createCanvasContext(canvasId, context)
			if (!ctx._drawImage) {
				ctx._drawImage = ctx.drawImage
				ctx.drawImage = function (...args) {
					const { path } = args.shift()
					ctx._drawImage(path, ...args)
				}
			}
			if (!ctx.getImageData) {
				ctx.getImageData = function () {
					return new Promise((resolve, reject) => {
						uni.canvasGetImageData({
							canvasId,
							x: parseInt(arguments[0]),
							y: parseInt(arguments[1]),
							width: parseInt(arguments[2]),
							height: parseInt(arguments[3]),
							success(res) {
								resolve(res)
							},
							fail(err) {
								reject(err)
							}
						}, context)
					})

				}
				return {
					getContext(type: string) {
						if(type == '2d') {
							return ctx
						}
					},
					width: res.width,
					height: res.height,
					createImage
				}
			}
		}
	})
	// #endif
}