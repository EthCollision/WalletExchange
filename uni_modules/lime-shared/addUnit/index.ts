// @ts-nocheck
import {isNumeric} from '../isNumeric'
import {isDef} from '../isDef'
/**
 * 给一个值添加单位（像素 px）
 * @param value 要添加单位的值，可以是字符串或数字
 * @returns 添加了单位的值，如果值为 null 则返回 null
 */

// #ifndef UNI-APP-X && APP
export function addUnit(value?: string | number): string | null {
  if (!isDef(value)) {
    return null;
  }
  value = String(value); // 将值转换为字符串
  // 如果值是数字，则在后面添加单位 "px"，否则保持原始值
  return isNumeric(value) ? `${value}px` : value;
}
// #endif


// #ifdef UNI-APP-X && APP
function addUnit(value: string): string
function addUnit(value: number): string
function addUnit(value: any|null): string|null  {
  if (!isDef(value)) {
    return null;
  }
  value = `${value}` //value.toString(); // 将值转换为字符串

  // 如果值是数字，则在后面添加单位 "px"，否则保持原始值
  return isNumeric(value) ? `${value}px` : value;
}
export {addUnit}
// #endif


// console.log(addUnit(100)); // 输出: "100px"
// console.log(addUnit("200")); // 输出: "200px"
// console.log(addUnit("300px")); // 输出: "300px"（已经包含单位）
// console.log(addUnit()); // 输出: undefined（值为 undefined）
// console.log(addUnit(null)); // 输出: undefined（值为 null）