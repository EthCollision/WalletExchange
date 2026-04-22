// @ts-nocheck

/**
 * 验证电子邮件地址格式
 * @param email - 要验证的字符串
 * @returns 是否通过验证
 */
export function isEmail(email : string) : boolean {
	const emailRegex = /\S+@\S+\.\S+/;
	return emailRegex.test(email);
}