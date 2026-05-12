// @ts-nocheck

/**
 * 判断一个字符串是否为Base64编码。
 * Base64编码的字符串只包含A-Z、a-z、0-9、+、/ 和 = 这些字符。
 * @param {string} str - 要检查的字符串。
 * @returns {boolean} 如果字符串是Base64编码，返回true，否则返回false。
 */
export function isBase64(str: string): boolean {
    const base64Regex = /^(?:[A-Za-z0-9+/]{4})*(?:[A-Za-z0-9+/]{2}==|[A-Za-z0-9+/]{3}=)?$/;
    return base64Regex.test(str);
}

/**
 * 判断一个字符串是否为Base64编码的data URI。
 * Base64编码的data URI通常以"data:"开头，后面跟着MIME类型和编码信息，然后是Base64编码的数据。
 * @param {string} str - 要检查的字符串。
 * @returns {boolean} 如果字符串是Base64编码的data URI，返回true，否则返回false。
 */
export function isDataURI(str: string): boolean {
    const dataUriRegex = /^data:([a-zA-Z]+\/[a-zA-Z0-9-+.]+)(;base64)?,([a-zA-Z0-9+/]+={0,2})$/;
    return dataUriRegex.test(str);
}