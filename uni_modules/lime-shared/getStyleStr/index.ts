// @ts-nocheck
// #ifndef UNI-APP-X && APP
interface CSSProperties {
	[key : string] : string | number | null
}
// #endif

// #ifdef VUE3
// #ifdef UNI-APP-X && APP
type CSSProperties = UTSJSONObject
// #endif
// #endif
/**
 * 将字符串转换为带有连字符分隔的小写形式
 * @param key - 要转换的字符串
 * @returns 转换后的字符串
 */
export function toLowercaseSeparator(key : string):string {
	return key.replace(/([A-Z])/g, '-$1').toLowerCase();
}

/**
 * 获取样式对象对应的样式字符串
 * @param style - CSS样式对象
 * @returns 由非空有效样式属性键值对组成的字符串
 */
export function getStyleStr(style : CSSProperties) : string {
	
	// #ifdef UNI-APP-X && APP
	let styleStr = '';
	style.toMap().forEach((value, key) => {
		if(value !== null && value != '') {
			styleStr += `${toLowercaseSeparator(key as string)}: ${value};`
		}
	})
	return styleStr
	// #endif
	// #ifndef UNI-APP-X && APP
	return Object.keys(style)
		.filter(
			(key) => 
				style[key] !== undefined && 
				style[key] !== null && 
				style[key] !== '')
		.map((key : string) => `${toLowercaseSeparator(key)}: ${style[key]};`)
		.join(' ');
	// #endif
}

// 示例
// const style = { color: 'red', fontSize: '16px', backgroundColor: '', border: null };
// const styleStr = getStyleStr(style);
// console.log(styleStr);
// 输出: "color: red; font-size: 16px;"