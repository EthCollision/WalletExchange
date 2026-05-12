// @ts-nocheck
type Callback = () => void//Function
// 是否支持被动事件监听
export const supportsPassive = true;

// 请求动画帧
export function raf(fn : Callback) : number {
	// #ifndef WEB
	return setTimeout(fn, 1000 / 60); // 请求动画帧
	// #endif
	// #ifdef WEB
	return requestAnimationFrame(fn); // 请求动画帧
	// #endif
}

// 取消动画帧
export function cancelRaf(id : number) {
	// 如果是在浏览器环境下，使用 cancelAnimationFrame 方法
	// #ifdef WEB
	cancelAnimationFrame(id); // 取消动画帧
	// #endif
	// #ifndef WEB
	clearTimeout(id); // 取消动画帧
	// #endif
}

// 双倍动画帧
export function doubleRaf(fn : Callback) : void {
	raf(() => {
		raf(fn)
	}); // 在下一帧回调中再次请求动画帧，实现双倍动画帧效果
}