// @ts-nocheck
import {isDef} from '../isDef'
import {isString} from '../isString'
import {isNumber} from '../isNumber'
/**
 * 判断一个值是否为空。
 *
 * 对于字符串，去除首尾空格后判断长度是否为0。
 * 对于数组，判断长度是否为0。
 * 对于对象，判断键的数量是否为0。
 * 对于null或undefined，直接返回true。
 * 其他类型（如数字、布尔值等）默认不为空。
 *
 * @param {any} value - 要检查的值。
 * @returns {boolean} 如果值为空，返回true，否则返回false。
 */


// #ifdef UNI-APP-X && APP
export function isEmpty(value : any | null) : boolean {
	// 为null
	if(!isDef(value)){
		return true
	}
	// 为空字符
	if(isString(value)){
		return value.toString().trim().length == 0
	}
	// 为数值
	if(isNumber(value)){
		return false
	}
	if(typeof value == 'object'){
		// 数组
		if(Array.isArray(value)){
			return (value as Array<unknown>).length == 0
		}
		// Map
		if(value instanceof Map<unknown, unknown>) {
			return value.size == 0
		}
		// Set
		if(value instanceof Set<unknown>) {
			return value.size == 0
		}
		if(value instanceof UTSJSONObject) {
			return value.toMap().size == 0
		}
		return JSON.stringify(value) == '{}'
	}
	return false
}
// #endif


// #ifndef UNI-APP-X && APP
export function isEmpty(value: any): boolean {
    // 检查是否为null或undefined
    if (value == null || value == undefined || value == '') {
        return true;
    }

    // 检查字符串是否为空
    if (typeof value === 'string') {
        return value.trim().length === 0;
    }

    // 检查数组是否为空
    if (Array.isArray(value)) {
        return value.length === 0;
    }

    // 检查对象是否为空
    if (typeof value === 'object') {
        return Object.keys(value).length === 0;
    }

    // 其他类型（如数字、布尔值等）不为空
    return false;
}
// #endif