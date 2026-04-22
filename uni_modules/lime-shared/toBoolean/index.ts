// @ts-nocheck
import { isNumber } from '../isNumber'
import { isString } from '../isString'
// 函数重载，定义多个函数签名
// function toBoolean(value : any) : boolean;
// function toBoolean(value : string) : boolean;
// function toBoolean(value : number) : boolean;
// function toBoolean(value : boolean) : boolean;

// #ifdef UNI-APP-X && APP
function toBoolean(value : any | null) : boolean {
	// 根据输入值的类型，返回相应的布尔值
	// if (isNumber(value)) {
	// 	return (value as number) != 0;
	// }
	// if (isString(value)) {
	// 	return `${value}`.length > 0;
	// }
	// if (typeof value == 'boolean') {
	// 	return value as boolean;
	// }
	// #ifdef APP-IOS || APP-HARMONY
	return value != null && value != undefined
	// #endif
	// #ifdef APP-ANDROID
	return value != null
	// #endif
}
// #endif


// #ifndef UNI-APP-X && APP
function toBoolean(value : any | null) : value is NonNullable<typeof value> {
	return !!value//value !== null && value !== undefined;
}
// #endif

export {
	toBoolean
}