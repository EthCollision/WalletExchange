// @ts-nocheck
/**
 * 检测输入值是否为正则表达式对象
 * @param obj - 需要检测的任意类型值
 * @returns 如果检测值是正则表达式返回 true，否则返回 false
 * 
 * @example
 * // 基础检测
 * isRegExp(/abc/);                // true
 * isRegExp(new RegExp('abc'));    // true
 * 
 * @example
 * // 非正则表达式检测
 * isRegExp('hello');              // false
 * isRegExp({});                   // false
 * isRegExp(null);                 // false
 * 
 * @description
 * 1. 通过 Object.prototype.toString 的可靠类型检测
 * 2. 支持跨执行环境的可靠检测：
 *    - 浏览器多 iframe 环境
 *    - Node.js 的 vm 模块
 * 3. 比 instanceof 检测更可靠
 * 4. 支持 ES3+ 全环境兼容
 */
export function isRegExp(obj : any) : boolean {
	// #ifndef APP-ANDROID
	return Object.prototype.toString.call(obj) === '[object RegExp]';
	// #endif
	// #ifdef APP-ANDROID
	return obj instanceof RegExp//Object.prototype.toString.call(obj) === '[object RegExp]';
	// #endif
}