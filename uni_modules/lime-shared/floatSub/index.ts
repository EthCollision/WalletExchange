import { isNumber } from '../isNumber';
/**
 * 减法函数，用于处理浮点数减法并保持精度。
 * @param {number} num1 - 被减数。
 * @param {number} num2 - 减数。
 * @returns {number} 减法运算的结果，保留正确的精度。
 */
export function floatSub(num1 : number, num2 : number) : number {
	if (!(isNumber(num1) || isNumber(num2))) {
		console.warn('Please pass in the number type');
		return NaN;
	}
	let r1:number, r2:number, m:number, n:number;
	try {
		r1 = num1.toString().split('.')[1].length;
	} catch (error) {
		r1 = 0;
	}
	try {
		r2 = num2.toString().split('.')[1].length;
	} catch (error) {
		r2 = 0;
	}
	m = Math.pow(10, Math.max(r1, r2));
	n = r1 >= r2 ? r1 : r2;
	// #ifndef APP-ANDROID
	return Number(((num1 * m - num2 * m) / m).toFixed(n));
	// #endif
	// #ifdef APP-ANDROID
	return parseFloat(((num1 * m - num2 * m) / m).toFixed(n));
	// #endif
}