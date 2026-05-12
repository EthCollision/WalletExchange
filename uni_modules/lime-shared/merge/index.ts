// @ts-nocheck
/**
 * 深度合并两个对象，用默认值填充目标对象中未定义的属性
 * 
 * @template T - 合并对象的泛型类型
 * @param {T} obj - 目标对象（将被修改）
 * @param {T} defaults - 包含默认值的对象
 * @returns {T} 合并后的对象（即修改后的obj参数）
 */

export function merge<T>(obj : T, defaults : T) : T {
	// #ifdef APP-ANDROID
	try {
		if(obj instanceof UTSJSONObject && defaults instanceof UTSJSONObject) {
			return UTSJSONObject.assign<T>(obj, defaults)!// as T
		}
		const obj1 = { ...toRaw(obj) }
		const obj2 = { ...toRaw(defaults) }
		return UTSJSONObject.assign<T>(obj1, obj2)!
	} catch (error) {
		return defaults
	}
	// #endif

	// #ifndef APP-ANDROID
	for (const key in defaults) {
		if (obj[key] === undefined || obj[key] === null) {
			obj[key] = defaults[key];
		}
	}
	return obj;
	// #endif
}