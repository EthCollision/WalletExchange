/**
 * getSystemInfoSync的优化版本（在微信小程序不会提示API已过期的警告）
 */

function getSystemInfoSync() {
	// #ifdef MP-WEIXIN
	return getCompatibleSystemInfo();
	// #endif
	// #ifndef MP-WEIXIN
	return uni.getSystemInfoSync();
	// #endif
}

export default getSystemInfoSync;

// #ifdef MP-WEIXIN
function getCompatibleSystemInfo() {
	if (wx.canIUse('getDeviceInfo') && wx.canIUse('getWindowInfo') && wx.canIUse('getAppBaseInfo') && wx.canIUse('getSystemSetting')) {
		const deviceInfo = uni.getDeviceInfo();
		const windowInfo = uni.getWindowInfo();
		const appBaseInfo = uni.getAppBaseInfo();
		const systemSetting = uni.getSystemSetting();
		// const appAuthorizeSetting = wx.getAppAuthorizeSetting(); // 这个API效率低，不放在这里了
		// 最终会少 batteryLevel 属性和 appAuthorizeSetting 属性
		return {
			devicePixelRatio: windowInfo.pixelRatio,
			hostFontSizeSetting: appBaseInfo.fontSizeSetting,
			batteryLevel: 100, // 设置一个假的固定值进去，防止出错（如果再调用电量API这效率会比较低）
			...deviceInfo,
			...windowInfo,
			...appBaseInfo,
			...systemSetting,
			// ...appAuthorizeSetting,
		};
	} else {
		return uni.getSystemInfoSync();
	}
}
// #endif