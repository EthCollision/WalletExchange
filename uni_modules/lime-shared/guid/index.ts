/**
 * 生成指定长度的伪随机字符串，通常用作唯一标识符（非标准GUID）
 * 
 * 此函数使用Math.random()生成基于36进制（数字+小写字母）的随机字符串。当长度超过11位时，
 * 会通过递归拼接多个随机段实现。注意：该方法生成的并非标准GUID/UUID，不适合高安全性场景。
 * 
 * @param {number} [len=32] - 要生成的字符串长度，默认32位
 * @returns {string} 生成的伪随机字符串，包含0-9和a-z字符
 * 
 * @example
 * guid();    // 返回32位字符串，例如"3zyf6a5f3kb4ayy9jq9v1a70z0qdm0bk"
 * guid(5);   // 返回5位字符串，例如"kf3a9"
 * guid(20);  // 返回20位字符串，由两段随机字符串拼接而成
 * 
 * @note
 * 1. 由于使用Math.random()，随机性存在安全缺陷，不适用于密码学用途
 * 2. 当长度>11时采用递归拼接，可能略微影响性能（在极端大长度情况下）
 * 3. 字符串补全时使用'0'填充，可能略微降低末尾字符的随机性
 */
export function guid(len:number = 32):string {
	// crypto.randomUUID();
	return len <= 11 
		? Math.random()
			.toString(36)
			.substring(2, 2 + len)
			.padEnd(len, '0')
		: guid(11) + guid(len - 11);
}