// @ts-nocheck
export function getPlatform():Uni {
	// #ifdef MP-WEIXIN
	return wx
	// #endif
	// #ifdef MP-BAIDU
	return swan
	// #endif
	// #ifdef MP-ALIPAY
	return my
	// #endif
	// #ifdef MP-JD
	return jd
	// #endif
	// #ifdef MP-QQ
	return qq
	// #endif
	// #ifdef MP-360
	return qh
	// #endif
	// #ifdef MP-KUAISHOU
	return ks
	// #endif
	// #ifdef MP-LARK||MP-TOUTIAO
	return tt
	// #endif
	// #ifdef MP-DINGTALK
	return dd
	// #endif
	// #ifdef QUICKAPP-WEBVIEW || QUICKAPP-WEBVIEW-UNION || QUICKAPP-WEBVIEW-HUAWEI
	return qa
	// #endif
	return uni
}