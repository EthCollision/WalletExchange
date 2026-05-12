// @ts-nocheck
// 是否支持被动事件监听
export const supportsPassive = true;

// #ifdef  uniVersion < 4.25
// 请求动画帧
export function raf(fn: TimerCallback): number {
   return setTimeout(fn, 1000 / 60); 
}

// 取消动画帧
export function cancelRaf(id: number) {
  clearTimeout(id);
}


// 双倍动画帧
export function doubleRaf(fn: TimerCallback): void {
  raf(():number => raf(fn)); // 在下一帧回调中再次请求动画帧，实现双倍动画帧效果
}
// #endif


// #ifdef  uniVersion >= 4.25
// 请求动画帧
export function raf(fn: UniAnimationFrameCallback): number
export function raf(fn: UniAnimationFrameCallbackWithNoArgument): number
export function raf(fn: any): number {
	if(typeof fn == 'UniAnimationFrameCallback') {
		return requestAnimationFrame(fn as UniAnimationFrameCallback); 
	} else {
		return requestAnimationFrame(fn as UniAnimationFrameCallbackWithNoArgument); 
	}
}

// 取消动画帧
export function cancelRaf(id: number) {
  cancelAnimationFrame(id);
}

// 双倍动画帧
export function doubleRaf(fn: UniAnimationFrameCallback): void 
export function doubleRaf(fn: UniAnimationFrameCallbackWithNoArgument): void 
export function doubleRaf(fn: any): void {
  raf(():number => raf(fn)); // 在下一帧回调中再次请求动画帧，实现双倍动画帧效果
}
// #endif

