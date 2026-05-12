// @ts-nocheck

// #ifndef APP-ANDROID || APP-HARMONY || APP-IOS
type UTSJSONObject = {
	version : string | number | null;
};
// #endif
// #ifdef APP-ANDROID || APP-HARMONY || APP-IOS
// type Options = UTSJSONObject
// #endif

const IPv4SegmentFormat = '(?:[0-9]|[1-9][0-9]|1[0-9][0-9]|2[0-4][0-9]|25[0-5])';
const IPv4AddressFormat = `(${IPv4SegmentFormat}\\.){3}${IPv4SegmentFormat}`;
const IPv4AddressRegExp = new RegExp(`^${IPv4AddressFormat}$`);

const IPv6SegmentFormat = '(?:[0-9a-fA-F]{1,4})';
const IPv6AddressRegExp = new RegExp(
	'^(' +
	`(?:${IPv6SegmentFormat}:){7}(?:${IPv6SegmentFormat}|:)|` +
	`(?:${IPv6SegmentFormat}:){6}(?:${IPv4AddressFormat}|:${IPv6SegmentFormat}|:)|` +
	`(?:${IPv6SegmentFormat}:){5}(?::${IPv4AddressFormat}|(:${IPv6SegmentFormat}){1,2}|:)|` +
	`(?:${IPv6SegmentFormat}:){4}(?:(:${IPv6SegmentFormat}){0,1}:${IPv4AddressFormat}|(:${IPv6SegmentFormat}){1,3}|:)|` +
	`(?:${IPv6SegmentFormat}:){3}(?:(:${IPv6SegmentFormat}){0,2}:${IPv4AddressFormat}|(:${IPv6SegmentFormat}){1,4}|:)|` +
	`(?:${IPv6SegmentFormat}:){2}(?:(:${IPv6SegmentFormat}){0,3}:${IPv4AddressFormat}|(:${IPv6SegmentFormat}){1,5}|:)|` +
	`(?:${IPv6SegmentFormat}:){1}(?:(:${IPv6SegmentFormat}){0,4}:${IPv4AddressFormat}|(:${IPv6SegmentFormat}){1,6}|:)|` +
	`(?::((?::${IPv6SegmentFormat}){0,5}:${IPv4AddressFormat}|(?::${IPv6SegmentFormat}){1,7}|:))` +
	')(%[0-9a-zA-Z.]{1,})?$'
);


/**
 * 验证IP地址格式
 * @param {string} ipAddress - 要验证的IP地址
 * @param {Options|string|number} options - 配置选项或版本号
 * @returns {boolean} 是否匹配有效的IP地址格式
 */
export function isIP(ipAddress : string | null, options : UTSJSONObject | string | number | null = null) : boolean {
	// assertString(ipAddress);
	if(ipAddress == null) return false
	let version : string | number | null;

	if (typeof options == 'object') {
		version = (options as UTSJSONObject|null)?.['version'];
	} else {
		version = options;
	}

	const versionStr = version != null ? `${version}` : '';

	if (versionStr == '') {
		return isIP(ipAddress, 4) || isIP(ipAddress, 6);
	}

	if (versionStr == '4') {
		return IPv4AddressRegExp.test(ipAddress.trim());
	}

	if (versionStr == '6') {
		return IPv6AddressRegExp.test(ipAddress.trim());
	}

	return false;
}

