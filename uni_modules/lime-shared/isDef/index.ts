// @ts-nocheck
/**
 * 检查一个值是否已定义（不为 undefined）且不为 null
 * @param value 要检查的值
 * @returns 如果值已定义且不为 null，则返回 true；否则返回 false
 */
// #ifndef UNI-APP-X
export function isDef(value: unknown): boolean {
  return value !== undefined && value !== null;
}
// #endif


// #ifdef UNI-APP-X
export function isDef(value : any|null) : boolean {
	// #ifdef UNI-APP-X && APP
	return value != null;
	// #endif
	// #ifndef UNI-APP-X && APP
	return value != null && value != undefined;
	// #endif
}
// #endif