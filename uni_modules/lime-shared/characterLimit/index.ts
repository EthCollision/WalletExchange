// @ts-nocheck
/**
 * 计算字符串字符的长度并可以截取字符串。
 * @param char 传入字符串（maxcharacter条件下，一个汉字表示两个字符）
 * @param max 规定最大字符串长度
 * @returns 当没有传入maxCharacter/maxLength 时返回字符串字符长度，当传入maxCharacter/maxLength时返回截取之后的字符串和长度。
 */
export type CharacterLengthResult = {
	length : number;
	characters : string;
}
// #ifdef APP-ANDROID
type ChartType = any
// #endif
// #ifndef APP-ANDROID
type ChartType = string | number
// #endif

export function characterLimit(type : string, char : ChartType, max : number) : CharacterLengthResult {
	const str = `${char}`;

	if (str.length == 0) {
		return {
			length: 0,
			characters: '',
		} as CharacterLengthResult
	}

	if (type == 'maxcharacter') {
		let len = 0;
		for (let i = 0; i < str.length; i += 1) {
			let currentStringLength : number// = 0;
			const code = str.charCodeAt(i)!
			if (code > 127 || code == 94) {
				currentStringLength = 2;
			} else {
				currentStringLength = 1;
			}
			if (len + currentStringLength > max) {
				return {
					length: len,
					characters: str.slice(0, i),
				} as CharacterLengthResult
			}
			len += currentStringLength;
		}
		return {
			length: len,
			characters: str,
		} as CharacterLengthResult
	} else if (type == 'maxlength') {
		const length = str.length > max ? max : str.length;
		return {
			length: length,
			characters: str.slice(0, length),
		} as CharacterLengthResult
	}

	return {
		length: str.length,
		characters: str,
	} as CharacterLengthResult
};