/**
 * 检查一个值是否为严格的布尔值（仅限 `true` 或 `false`）
 * 
 * @example
 * isBoolean(true);   // true
 * isBoolean(false);  // true
 * isBoolean(0);      // false
 * isBoolean(null);   // false
 * 
 * @param {unknown} value - 要检查的值
 * @returns {value is boolean} 如果值是 `true` 或 `false` 则返回 `true`，否则返回 `false`
 * 
 * @description
 * 此函数使用严格相等（`===`）检查，避免隐式类型转换。
 * 注意：不适用于 `Boolean` 包装对象（如 `new Boolean(true)`）。
 */
export function isBoolean(value: any|null): boolean {
	// #ifdef APP-ANDROID
	return value == true || value == false
	// #endif
	// #ifndef APP-ANDROID
	return value === true || value === false
	// #endif
}