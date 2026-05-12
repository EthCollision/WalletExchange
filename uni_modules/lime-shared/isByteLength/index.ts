// @ts-nocheck
// import assertString from './util/assertString';

/**
 * 字节长度验证配置选项
 */
export type IsByteLengthOptions = {
	/** 允许的最小字节长度 */
	min ?: number;
	/** 允许的最大字节长度 */
	max ?: number;
}

/**
 * 检查字符串字节长度是否在指定范围内
 * @function
 * @overload 使用配置对象
 * @param str - 要检查的字符串
 * @param options - 配置选项对象
 * @returns 是否满足字节长度要求
 *
 * @overload 使用独立参数
 * @param str - 要检查的字符串
 * @param min - 最小字节长度
 * @param max - 最大字节长度（可选）
 * @returns 是否满足字节长度要求
 *
 * @example
 * // 使用配置对象
 * isByteLength('🇨🇳', { min: 4, max: 8 }); // true（unicode 国旗符号占 8 字节）
 *
 * @example
 * // 旧式参数调用
 * isByteLength('hello', 3, 7); // true（实际字节长度 5）
 *
 * @description
 * 1. 使用 URL 编码计算字节长度（更准确处理多字节字符）
 * 2. 同时支持两种参数格式：
 *    - 配置对象格式 { min, max }
 *    - 独立参数格式 (min, max)
 * 3. 不传 max 参数时只验证最小长度
 * 4. 严格空值处理，允许设置 0 值
 */
export function isByteLength(str : string, optionsOrMin ?: IsByteLengthOptions) : boolean;
export function isByteLength(str : string, optionsOrMin ?: number) : boolean;
export function isByteLength(str : string, optionsOrMin : number, maxParam : number | null) : boolean;
export function isByteLength(
	str : string,
	optionsOrMin ?: IsByteLengthOptions | number,
	maxParam : number | null = null
) : boolean {
	// assertString(str);

	/** 最终计算的最小长度 */
	let min: number;

	/** 最终计算的最大长度 */
	let max : number | null;

	// 参数逻辑处理
	if (optionsOrMin != null && typeof optionsOrMin == 'object') {
		// 使用对象配置的情况
		const options = optionsOrMin as IsByteLengthOptions;
		min = Math.max(options.min ?? 0, 0);  // 确保最小值为正整数
		max = options.max;
	} else {
		// 使用独立参数的情况
		min = Math.max(
			typeof optionsOrMin == 'number' ? optionsOrMin : 0,
			0
		);
		max = maxParam;
	}

	// URL 编码后的字节长度计算
	const encoded = encodeURI(str);
	const len = (encoded?.split(/%..|./).length ?? 0) - 1;

	// 执行验证逻辑
	// #ifndef APP-ANDROID
	return len >= min && (typeof max == 'undefined' || len <= (max ?? 0));
	// #endif
	// #ifdef APP-ANDROID
	return len >= min && (max == null || len <= max);
	// #endif
}