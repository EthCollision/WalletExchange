// @ts-nocheck
export type ImageSettings = {
	width: number
	height: number
	x?: number
	y?: number
	excavate: boolean
}
export type QRCodePropsTypes = {
	value?: string
	size?: number
	fgColor?: string
	level?: string
	marginSize: number
	includeMargin: boolean
	imageSettings?: ImageSettings
}

export type QRCodeCallback = (cells : boolean[][]) => void

export type Excavation = {
	x: number
	y: number
	h: number
	w: number
}





/**
 * 成功回调函数定义
 */
export type TakeSnapshotSuccessCallback = (res: TakeSnapshotSuccess) => void
/**
 * 失败回调函数定义
 */
export type TakeSnapshotFailCallback = (res: TakeSnapshotFail) => void
/**
 * 完成回调函数定义
 */
export type TakeSnapshotCompleteCallback = (res: any) => void


export type LQrcodeFailCallback = TakeSnapshotFailCallback
export type LQrcodeCompleteCallback = TakeSnapshotCompleteCallback
export type LQrcodeSuccessCallback  = TakeSnapshotSuccessCallback