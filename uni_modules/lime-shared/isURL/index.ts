// @ts-nocheck
import { isValidDomain, type IsValidDomainOptions } from '../isValidDomain';
import { isIP } from '../isIP';
import { isRegExp } from '../isRegExp';
// import {merge} from '../merge';

/** URL 验证配置选项 */
export type IsURLOptions = {
	/** 允许的协议列表（默认 ['http', 'https', 'ftp']） */
	protocols ?: string[];
	/** 需要顶级域名（默认 true） */
	requireTld ?: boolean;
	/** 需要协议头（默认 false） */
	requireProtocol ?: boolean;
	/** 需要主机地址（默认 true） */
	requireHost ?: boolean;
	/** 需要端口号（默认 false） */
	requirePort ?: boolean;
	/** 需要有效协议（默认 true） */
	requireValidProtocol ?: boolean;
	/** 允许下划线（默认 false） */
	allowUnderscores ?: boolean;
	/** 允许结尾点号（默认 false） */
	allowTrailingDot ?: boolean;
	/** 允许协议相对地址（默认 false） */
	allowProtocolRelativeUrls ?: boolean;
	/** 允许片段标识（默认 true） */
	allowFragments ?: boolean;
	/** 允许查询参数（默认 true） */
	allowQueryComponents ?: boolean;
	/** 禁用认证信息（默认 false） */
	disallowAuth ?: boolean;
	/** 验证长度（默认 true） */
	validateLength ?: boolean;
	/** 最大允许长度（默认 2084） */
	maxAllowedLength ?: number;
	/** 白名单主机列表 */
	hostWhitelist ?: Array<string | RegExp>;
	/** 黑名单主机列表 */
	hostBlacklist ?: Array<string | RegExp>;
}

export function checkHost(host : string, matches : any[]) : boolean {
	for (let i = 0; i < matches.length; i++) {
		let match = matches[i];
		if (host == match || (isRegExp(match) && (match as RegExp).test(host))) {
			return true;
		}
	}
	return false;
}

// 辅助函数
function isValidPort(port : number | null) : boolean {
	return port != null && !isNaN(port) && port > 0 && port <= 65535;
}

function validateHost(host : string, options : IsURLOptions | null, isIPv6 : boolean) : boolean {
	if (isIPv6) return isIP(host, 6);
	return isIP(host) || isValidDomain(host, {
		requireTld: options?.requireTld ?? true,
		allowUnderscore: options?.allowUnderscores ?? true,
		allowTrailingDot: options?.allowTrailingDot ?? false
	} as IsValidDomainOptions);
}




/** 匹配 IPv6 地址的正则表达式 */
const WRAPPED_IPV6_REGEX = /^\[([^\]]+)\](?::([0-9]+))?$/;

/**
 * 验证字符串是否为有效的 URL
 * @param url - 需要验证的字符串
 * @param options - 配置选项
 * @returns 是否为有效 URL
 *
 * @example
 * ```typescript
 * isURL('https://example.com'); // true
 * isURL('user:pass@example.com', { disallowAuth: true }); // false
 * ```
 */
export function isURL(url : string | null, options : IsURLOptions | null = null) : boolean {
	// assertString(url);

	// 1. 基础格式校验
	if (url == null || url == '' || url.length == 0 || /[\s<>]/.test(url) || url.startsWith('mailto:')) {
		return false;
	}
	// 合并配置选项
	let protocols = options?.protocols ?? ['http', 'https', 'ftp']
	// let requireTld = options?.requireTld ?? true
	let requireProtocol = options?.requireProtocol ?? false
	let requireHost = options?.requireHost ?? true
	let requirePort = options?.requirePort ?? false
	let requireValidProtocol = options?.requireValidProtocol ?? true
	// let allowUnderscores = options?.allowUnderscores ?? false
	// let allowTrailingDot = options?.allowTrailingDot ?? false
	let allowProtocolRelativeUrls = options?.allowProtocolRelativeUrls ?? false
	let allowFragments = options?.allowFragments ?? true
	let allowQueryComponents = options?.allowQueryComponents ?? true
	let validateLength = options?.validateLength ?? true
	let maxAllowedLength = options?.maxAllowedLength ?? 2084
	let hostWhitelist = options?.hostWhitelist
	let hostBlacklist = options?.hostBlacklist
	let disallowAuth = options?.disallowAuth ?? false


	// 2. 长度校验
	if (validateLength && url!.length > maxAllowedLength) {
		return false;
	}
	// 3. 片段和查询参数校验
	if (!allowFragments && url.includes('#')) return false;
	if (!allowQueryComponents && (url.includes('?') || url.includes('&'))) return false;

	// 处理 URL 组成部分
	const [urlWithoutFragment] = url.split('#');
	const [baseUrl] = urlWithoutFragment.split('?');
	// 4. 协议处理
	const protocolParts = baseUrl.split('://');
	let protocol:string;
	let remainingUrl = baseUrl;

	if (protocolParts.length > 1) {
		protocol = protocolParts.shift()!.toLowerCase();
		if (requireValidProtocol && !protocols!.includes(protocol)) {
			return false;
		}
		remainingUrl = protocolParts.join('://');
	} else if (requireProtocol) {
		return false;
	} else if (baseUrl.startsWith('//')) {
		if (!allowProtocolRelativeUrls) return false;
		remainingUrl = baseUrl.slice(2);
	}

	if (remainingUrl == '') return false;
	
	// 5. 处理主机部分
	const [hostPart] = remainingUrl.split('/', 1);
	const authParts = hostPart.split('@');
	
	// 认证信息校验
	if (authParts.length > 1) {
		if (disallowAuth || authParts[0] == '') return false;
		const auth = authParts.shift()!;
		if (auth.split(':').length > 2) return false;
		const [user, password] = auth.split(':');
		if (user == '' && password == '') return false;
	}

	const hostname = authParts.join('@');

	// 6. 解析主机和端口
	type HostInfo = {
		host ?: string;
		ipv6 ?: string;
		port ?: number;
	};

	const hostInfo : HostInfo = {};
	const ipv6Match = hostname.match(WRAPPED_IPV6_REGEX);
	if (ipv6Match != null) {
		hostInfo.ipv6 = ipv6Match.length > 1 ? ipv6Match[1] : null;
		const portStr = ipv6Match.length > 2 ? ipv6Match[2] : null;
		if (portStr != null) {
			hostInfo.port = parseInt(portStr);
			if (!isValidPort(hostInfo.port)) return false;
		}
	} else {
		const [host, ...portParts] = hostname.split(':');
		hostInfo.host = host;
		if (portParts.length > 0) {
			const portStr = portParts.join(':');
			hostInfo.port = parseInt(portStr);
			if (!isValidPort(hostInfo.port)) return false;
		}
	}

	// 7. 端口校验
	if (requirePort && hostInfo.port == null) return false;
	// 8. 主机验证逻辑
	const finalHost = hostInfo.host ?? hostInfo.ipv6;
	if (finalHost == null) return requireHost ? false : true;
	// 白名单/黑名单检查
	if (hostWhitelist != null && !checkHost(finalHost!, hostWhitelist!)) return false;
	if (hostBlacklist != null && checkHost(finalHost!, hostBlacklist!)) return false;
	
	// 9. 综合校验
	return validateHost(
		finalHost,
		options,
		!(hostInfo.ipv6 == null || hostInfo.ipv6 == '')
	);
}