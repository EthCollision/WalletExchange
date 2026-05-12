// @ts-nocheck
import { isString } from "../isString";
import { isNumber } from "../isNumber";
/**
 * 将金额转换为中文大写形式
 * @param {number | string} amount - 需要转换的金额，可以是数字或字符串
 * @returns {string} 转换后的中文大写金额
 */
export function capitalizedAmount(amount : number) : string
export function capitalizedAmount(amount : string) : string
export function capitalizedAmount(amount : any | null) : string {
	try {
		let _amountStr :string;
		let _amountNum :number = 0;
		// 如果输入是字符串，先将其转换为数字，并去除逗号
		if (typeof amount == 'string') {
			 _amountNum = parseFloat((amount as string).replace(/,/g, ''));
		}
		if(isNumber(amount)) {
			_amountNum = amount as number
		}
		// 判断输入是否为有效的金额  || isNaN(amount)
		if (amount == null) throw new Error('不是有效的金额！');

		let result = '';

		// 处理负数情况
		if (_amountNum < 0) {
			result = '欠';
			_amountNum = Math.abs(_amountNum);
		}

		// 金额不能超过千亿以上
		if (_amountNum >= 10e11) throw new Error('计算金额过大！');

		// 保留两位小数并转换为字符串
		_amountStr = _amountNum.toFixed(2);

		// 定义数字、单位和小数单位的映射
		const digits = ['零', '壹', '贰', '叁', '肆', '伍', '陆', '柒', '捌', '玖'];
		const units = ['', '拾', '佰', '仟'];
		const bigUnits = ['', '万', '亿'];
		const decimalUnits = ['角', '分'];

		// 分离整数部分和小数部分
		const amountArray = _amountStr.split('.');
		let integerPart = amountArray[0]; // string| number[]
		const decimalPart = amountArray[1];

		// 处理整数部分
		if (integerPart != '0') {
			let _integerPart = integerPart.split('').map((item):number => parseInt(item));

			// 将整数部分按四位一级进行分组
			const levels = _integerPart.reverse().reduce((prev:string[][], item, index):string[][] => {
				// const level = prev?.[0]?.length < 4 ? prev[0] : [];
				const level = prev.length > 0 && prev[0].length < 4 ? prev[0]: []

				const value = item == 0 ? digits[item] : digits[item] + units[index % 4];

				level.unshift(value);

				if (level.length == 1) {
					prev.unshift(level);
				} else {
					prev[0] = level;
				}

				return prev;
			}, [] as string[][]);
			// 将分组后的整数部分转换为中文大写形式
			result += levels.reduce((prev, item, index):string => {
				let _level = bigUnits[levels.length - index - 1];
				let _item = item.join('').replace(/(零)\1+/g, '$1');

				if (_item == '零') {
					_level = '';
					_item = '';
				} else if (_item.endsWith('零')) {
					_item = _item.slice(0, _item.length - 1);
				}

				return prev + _item + _level;
			}, '');
		} else {
			result += '零';
		}

		// 添加元
		result += '元';

		// 处理小数部分
		if (decimalPart != '00') {
			if (result == '零元') result = '';

			for (let i = 0; i < decimalPart.length; i++) {
				const digit = parseInt(decimalPart.charAt(i));

				if (digit != 0) {
					result += digits[digit] + decimalUnits[i];
				}
			}
		} else {
			result += '整';
		}

		return result;
	} catch (error : Error) {
		return error.message;
	}
};