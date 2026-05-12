// @ts-nocheck

/**
 * 检查一个值是否为数字类型或表示数字的字符串
 * @param value 要检查的值，可以是 string 类型或 number 类型
 * @returns 如果值是数字类型或表示数字的字符串，则返回 true；否则返回 false
 */

// #ifndef UNI-APP-X && APP
export function isNumeric(value: string | number | undefined | null): boolean {
  return /^(-)?\d+(\.\d+)?$/.test(value);
}
// #endif


// #ifdef UNI-APP-X && APP
import {isNumber} from '../isNumber';
import {isString} from '../isString';
export function isNumeric(value : any|null) : boolean {
	if(value == null) {
		return false
	}
	if(isNumber(value)) {
		return true
	} else if(isString(value)) {
		// const regex = "-?\\d+(\\.\\d+)?".toRegex()
		const regex = new RegExp("^(-)?\\d+(\\.\\d+)?$")
		return  regex.test(value as string) //regex.matches(value as string) 
	}
	return false
	// return /^(-)?\d+(\.\d+)?$/.test(value);
}
// #endif
