// @ts-nocheck
// #ifdef UNI-APP-X && APP
// export * from './uvue.uts'
export { getRect, getAllRect } from './uvue.uts'
// #endif


// #ifndef UNI-APP-X && APP
// export * from './vue.ts'
export { getRect, getAllRect } from './vue.ts'
// #endif



/**
 * 获取视口滚动条位置信息
 */
export function getViewportScrollInfo() : Promise<any> {
	return new Promise(resolve => {
		uni.createSelectorQuery()
			.selectViewport()
			.scrollOffset((res) => {
				resolve(res);
			}).exec();
	})
}

/**
```
                      page
                     ╱
    ╭───────────────╮    viewport
  ╭─│─ ─ ─ ─ ─ ─ ─ ─│─╮ ╱
  │ │ ╭───────────╮ │ │
  │ │ │  element  │ │ │
  │ │ ╰───────────╯ │ │
  ╰─│─ ─ ─ ─ ─ ─ ─ ─│─╯
    │               │
    │               │
    ╰───────────────╯
```

# 参数
- viewportHeight: viewport 高度
- viewportScrollTop: viewport 垂直滚动值
- elementHeight: element 高度
- elementOffsetTop: element 距离页面顶部距离

# 选项
- position: element 在视窗中的位置(start, center, end, nearest)
- startOffset: element 距离视窗顶部的偏移量
- endOffset: element 距离视窗底部的偏移量

# 结果值
- viewportScrollTop: viewport 新的垂直滚动值

*/

export type ScrollIntoViewOptions = {
	/** 元素顶部需要保留的缓冲距离（默认 0） */
	startOffset ?: number;
	/** 元素底部需要保留的缓冲距离（默认 0） */
	endOffset ?: number;
	/** 滚动对齐方式：start/center/end/nearest（默认 nearest） */
	position ?: 'start' | 'center' | 'end' | 'nearest';
}

/**
 * 计算元素需要滚动到可视区域的目标滚动位置
 * @param viewportHeight 视口高度（像素）
 * @param viewportScrollTop 当前滚动位置（像素）
 * @param elementHeight 元素高度（像素）
 * @param elementOffsetTop 元素相对于父容器顶部的偏移量（像素）
 * @param options 配置选项
 * @returns 计算后的目标滚动位置（像素）
 *
 * @example
 * // 示例：将元素滚动到视口顶部对齐
 * const scrollTop = getScrollIntoViewValue(
 *   500,  // 视口高度
 *   200,  // 当前滚动位置
 *   100,  // 元素高度
 *   300,  // 元素偏移量
 *   { position: 'start' }
 * );
 */
export function getScrollIntoViewValue(
	viewportHeight : number,
	viewportScrollTop : number,
	elementHeight : number,
	elementOffsetTop : number,
	options : ScrollIntoViewOptions = {}
) : number {
	let { startOffset = 0, endOffset = 0, position = 'nearest'} = options;

	// 计算元素相对于视口的上下偏移量
	const elementToViewportTopOffset = elementOffsetTop - viewportScrollTop - startOffset;
	const elementToViewportBottomOffset =
		elementOffsetTop +
		elementHeight -
		viewportScrollTop -
		viewportHeight +
		endOffset;

	// 处理 nearest 模式，自动选择最近边缘
	if (position == 'nearest') {
		if (elementToViewportTopOffset >= 0 && elementToViewportBottomOffset <= 0) {
			return viewportScrollTop;
		}
		position =
			Math.abs(elementToViewportTopOffset) > Math.abs(elementToViewportBottomOffset)
				? 'end'
				: 'start';
	}

	// 根据不同的对齐位置计算目标滚动位置
	let nextScrollTop = 0;
	switch (position) {
		case 'start':
			// 顶部对齐：元素顶部对齐视口顶部（考虑顶部缓冲）
			nextScrollTop = elementOffsetTop - startOffset;
			break;
		case 'center':
			// 居中对齐：元素中心对齐视口中心（考虑上下缓冲）
			nextScrollTop =
				elementOffsetTop -
				(viewportHeight - elementHeight - endOffset - startOffset) / 2 +
				startOffset;
			break;
		case 'end':
			// 底部对齐：元素底部对齐视口底部（考虑底部缓冲）
			nextScrollTop =
				elementOffsetTop + elementHeight - viewportHeight + endOffset;
			break;
	}

	return nextScrollTop;
}