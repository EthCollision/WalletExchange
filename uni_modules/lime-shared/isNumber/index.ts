// @ts-nocheck
/**
 * 检查一个值是否为数字类型
 * @param value 要检查的值，可以是 number 类型或 string 类型的数字
 * @returns 如果值是数字类型且不是 NaN，则返回 true；否则返回 false
 */

// #ifndef UNI-APP-X
export function isNumber(value: number | string | null): boolean {
  return typeof value === 'number' && !isNaN(value);
}
// #endif

// #ifdef UNI-APP-X
export function isNumber(value: any|null): boolean {
	// #ifdef APP-ANDROID
	return ['Byte', 'UByte','Short','UShort','Int','UInt','Long','ULong','Float','Double','number'].includes(typeof value)
	// #endif
	// #ifdef APP-IOS
	return ['Int8', 'UInt8','Int16','UInt16','Int32','UInt32','Int64','UInt64','Int','UInt','Float','Float16','Float32','Float64','Double', 'number'].includes(typeof value)
	// #endif
	// #ifndef APP-ANDROID || APP-IOS
	return typeof value === 'number' && !isNaN(value);
	// #endif
}
// #endif