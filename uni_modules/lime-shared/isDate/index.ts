// @ts-nocheck

/**
 * 日期验证配置选项
 */
export type IsDateOptions = {
	/** 日期格式字符串，默认 'YYYY/MM/DD' */
	format ?: string;
	/** 允许的分隔符数组，默认 ['/', '-'] */
	delimiters ?: string[];
	/** 是否严格匹配格式，默认 false */
	strictMode ?: boolean;
}

/**
 * 验证日期格式字符串是否合法
 * @param format - 需要验证的格式字符串
 * @returns 是否合法格式
 */
function isValidFormat(format : string) : boolean {
	return /(^(y{4}|y{2})[年./-](m{1,2})[月./-](d{1,2}(日)?)$)|(^(m{1,2})[./-](d{1,2})[./-]((y{4}|y{2})$))|(^(d{1,2})[./-](m{1,2})[./-]((y{4}|y{2})$))/i.test(format);
}

/**
 * 将日期部分和格式部分组合成键值对数组
 * @param date - 分割后的日期部分数组
 * @param format - 分割后的格式部分数组
 * @returns 组合后的二维数组
 */
function zip(date : string[], format : string[]) : string[][] {
	const zippedArr : string[][] = [];
	const len = Math.max(date.length, format.length);

	for (let i = 0; i < len; i++) {
		const key = i < date.length ? date[i] : ''
		const value = i < format.length ? format[i] : ''

		zippedArr.push([key, value])
	}

	return zippedArr;
}


/** 验证日期对象 */
function validateDateObject(date : Date, strictMode : boolean) : boolean {
	// #ifndef APP-ANDROID
	return !strictMode && Object.prototype.toString.call(date) === '[object Date]' && !isNaN(date.getTime());
	// #endif
	// #ifdef APP-ANDROID
	return !strictMode && !isNaN(date.getTime())
	// #endif
}


function escapeRegExp(str: string): string {
	return str//.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function enhancedSplit(
	str: string,
	delimiters: string[]
): string[] {
	// 构建动态分隔符正则表达式
	const escapedDelimiters = delimiters.map(d => escapeRegExp(d));
	const pattern = new RegExp(
		`[${escapedDelimiters.join('')}]+`, // 匹配任意允许的分隔符
		'g'
	);
	
	return str.split(pattern).filter(p => p != '');
}

/**
 * 验证输入是否为有效日期
 * @param input - 输入值，可以是字符串或 Date 对象
 * @param options - 配置选项，可以是字符串（简写格式）或配置对象
 * @returns 是否为有效日期
 * 
 * @example
 * isDate('2023/12/31'); // true
 * isDate(new Date()); // true
 * isDate('02-29-2023', { strictMode: true }); // false（2023年不是闰年）
 */
export function isDate(input : Date, options ?: IsDateOptions) : boolean;
export function isDate(input : string, options ?: string | IsDateOptions) : boolean;
export function isDate(input : string | Date, options : string | IsDateOptions | null = null) : boolean {
	// 处理参数重载：允许第二个参数直接传格式字符串
	// Date对象验证


	let format = 'YYYY/MM/DD'
	let delimiters = ['/', '-']
	let strictMode = false


	if (options != null) {
		if (typeof options == 'string') {
			format = options as string
		} else {
			format = (options as IsDateOptions).format ?? format
			delimiters = (options as IsDateOptions).delimiters ?? delimiters
			strictMode = (options as IsDateOptions).strictMode ?? strictMode
		}
	}
	if (input instanceof Date) {
		return validateDateObject(input, strictMode);
	}


	// 字符串类型验证
	if (!isValidFormat(format)) return false;
	// 严格模式长度检查
	if (strictMode && input.length != format.length) {
		return false;
	}
	// 获取格式中的分隔符
	const formatDelimiter = delimiters.find((d) : boolean => format.indexOf(d) != -1);
	// 获取实际使用的分隔符
	const dateDelimiter = strictMode
		? formatDelimiter
		: delimiters.find((d) : boolean => input.indexOf(d) != -1);
	// 分割日期和格式
	const dateParts = strictMode ? enhancedSplit(input, delimiters) : input.split(dateDelimiter ?? '');
	const formatParts = strictMode ? enhancedSplit(format.toLowerCase(), delimiters) : format.toLowerCase().split(formatDelimiter ?? '');
	// 组合成键值对
	const dateAndFormat = zip(dateParts, formatParts);
	const dateObj = new Map<string, string>();


	// 解析日期组成部分
	for (const [dateWord, formatWord] of dateAndFormat) {
		if (dateWord == '' || formatWord == '' || dateWord.length != formatWord.length) {
			return false;
		}
		dateObj.set(formatWord.charAt(0), dateWord)
	}

	// 年份处理
	let fullYear = dateObj.get('y');

	if (fullYear == null) return false;

	// 检查年份前导负号
	if (fullYear.startsWith('-')) return false;

	// 两位年份转四位
	if (fullYear.length == 2) {
		const parsedYear = parseInt(fullYear, 10);

		if (isNaN(parsedYear)) {
			return false;
		}

		const currentYear = new Date().getFullYear();
		const century = currentYear - (currentYear % 100);
		fullYear = (parseInt(fullYear, 10) < (currentYear % 100))
			? `${century + 100 + parseInt(fullYear, 10)}`
			: `${century + parseInt(fullYear, 10)}`;
	}

	// 月份补零
	const month = dateObj.get('m')?.padStart(2, '0') ?? '';
	// 日期补零
	const day = dateObj.get('d')?.padStart(2, '0') ?? '';

	const isoDate = `${fullYear}-${month}-${day}T00:00:00.000Z`;

	// return new Date(time).getDate() == parseInt(day);

	// 构造 ISO 日期字符串验证
	try {
		// #ifndef APP-ANDROID
		const date = new Date(isoDate);
		return date.getUTCDate() === parseInt(day, 10) &&
			(date.getUTCMonth() + 1) === parseInt(month, 10) &&
			date.getUTCFullYear() === parseInt(fullYear, 10);
		// #endif
		// #ifdef APP-ANDROID
		const date = new Date(isoDate);
		return date.getDate() == parseInt(day, 10) &&
			(date.getMonth() + 1) == parseInt(month, 10) &&
			date.getFullYear() == parseInt(fullYear, 10);
		// #endif
	} catch {
		return false;
	}

}