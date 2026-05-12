// @ts-nocheck
/**
 * 域名验证配置选项
 */
export type IsValidDomainOptions = {
	/**
	 * 是否要求必须包含顶级域名(TLD)
	 * @default true
	 * @example 
	 * true -> "example.com" 有效
	 * false -> "localhost" 有效
	 */
	requireTld : boolean;

	/**
	 * 是否允许域名部分包含下划线(_)
	 * @default false
	 * @example
	 * true -> "my_site.com" 有效
	 * false -> "my_site.com" 无效
	 */
	allowUnderscore : boolean;

	/**
	 * 是否允许域名以点号(.)结尾
	 * @default false
	 * @example
	 * true -> "example.com." 有效
	 * false -> "example.com." 无效
	 */
	allowTrailingDot : boolean;
}


/**
 * 验证字符串是否为合法域名
 * @param str 要验证的字符串
 * @param options 配置选项，默认 {
 *   requireTld: true,      // 需要顶级域名
 *   allowUnderscore: false,// 允许下划线
 *   allowTrailingDot: false// 允许结尾点号
 * }
 * @returns 验证结果
 * 
 * 示例：
 * isValidDomain("example.com") // true
 * isValidDomain("my_site.com", { allowUnderscore: true }) // true
 */
export function isValidDomain(
	str : string,
	options : IsValidDomainOptions = {
		requireTld: true,
		allowUnderscore: false,
		allowTrailingDot: false
	}
) : boolean {
	// 预处理字符串
	let domain = str;

	// 处理结尾点号
	if (options.allowTrailingDot && domain.endsWith('.')) {
		domain = domain.slice(0, -1);
	}

	// 分割域名部分
	const parts = domain.split('.');
	if (parts.length == 1 && options.requireTld) return false;

	// 验证顶级域名
	const tld = parts[parts.length - 1];
	if (options.requireTld) {
		if (!/^[a-z\u00A1-\uFFFF]{2,}$/i.test(tld) || /\s/.test(tld)) {
			return false;
		}
	}

	// 验证每个部分
	const domainRegex = options.allowUnderscore
		? /^[a-z0-9\u00A1-\uFFFF](?:[a-z0-9-\u00A1-\uFFFF_]*[a-z0-9\u00A1-\uFFFF])?$/i
		: /^[a-z0-9\u00A1-\uFFFF](?:[a-z0-9-\u00A1-\uFFFF]*[a-z0-9\u00A1-\uFFFF])?$/i;

	return parts.every(part => {
		// 长度校验
		if (part.length > 63) return false;
		// 格式校验
		if (!domainRegex.test(part)) return false;
		// 禁止开头/结尾连字符
		return !(part.startsWith('-') || part.endsWith('-'));
	});
}