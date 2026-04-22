// @ts-nocheck
/**
 * 随机化数组中元素的顺序，使用 Fisher-Yates 算法
 * @description 函数接受一个数组作为参数，返回一个新的数组，其中包含原数组随机化顺序后的元素。
 * @param arr 要随机化的数组
 * @returns 一个新的数组，其中包含原数组随机化顺序后的元素。
 */
export function shuffle<T>(arr : T[]) : T[] {
	for (let i = arr.length - 1; i > 0; i--) {
		const j = Math.floor(Math.random() * (i + 1))
		const temp = arr[i]
		arr[i] = arr[j]
		arr[j] = temp
	}
	return arr
}