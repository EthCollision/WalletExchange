import { floatMul } from '../floatMul';
import { isNumber } from '../isNumber';

/**
 * 除法函数，用于处理浮点数除法并保持精度。
 * @param {number} num1 - 被除数。
 * @param {number} num2 - 除数。
 * @returns {number} 除法运算的结果，保留正确的精度。
 */
export function floatDiv(num1:number, num2:number):number {
  // 如果传入的不是数字类型，则打印警告并返回NaN
  if (!isNumber(num1) || !isNumber(num2)) {
    console.warn('请传入数字类型');
    return NaN;
  }

  let m1 = 0, // 被除数小数点后的位数
    m2 = 0, // 除数小数点后的位数
    s1 = num1.toString(), // 将被除数转换为字符串
    s2 = num2.toString(); // 将除数转换为字符串

  // 计算被除数小数点后的位数
  try {
    m1 += s1.split('.')[1].length;
  } catch (error) {}

  // 计算除数小数点后的位数
  try {
    m2 += s2.split('.')[1].length;
  } catch (error) {}

  // 进行除法运算并处理小数点后的位数，使用之前定义的乘法函数保持精度
  // #ifdef APP-ANDROID
  return floatMul(
    parseFloat(s1.replace('.', '')) / parseFloat(s2.replace('.', '')),
    Math.pow(10, m2 - m1),
  );
  // #endif
  // #ifndef APP-ANDROID
  return floatMul(
    Number(s1.replace('.', '')) / Number(s2.replace('.', '')),
    Math.pow(10, m2 - m1),
  );
  // #endif
}
