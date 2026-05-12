// @ts-nocheck
// #ifndef UNI-APP-X
type UTSJSONObject = Record<string, any>
// #endif

/**
 * 将对象转换为URL查询字符串
 * @param data - 需要转换的键值对对象
 * @param isPrefix - 是否添加问号前缀，默认为false
 * @returns 格式化后的URL查询参数字符串
 * 
 * @example
 * // 基础用法
 * obj2url({ name: '张三', age: 25 }); 
 * // => "name=%E5%BC%A0%E4%B8%89&age=25"
 * 
 * @example
 * // 数组参数处理
 * obj2url({ tags: ['js', 'ts'] });
 * // => "tags[]=js&tags[]=ts"
 * 
 * @example
 * // 包含空值的过滤
 * obj2url({ name: '', age: null, city: undefined });
 * // => ""
 * 
 * @description
 * 1. 自动过滤空值（空字符串、null、undefined）
 * 2. 支持数组参数转换（自动添加[]后缀）
 * 3. 自动进行URI编码
 * 4. 支持自定义是否添加问号前缀
 */
export function obj2url(data : UTSJSONObject, isPrefix : boolean = false) : string {
	const prefix = isPrefix ? '?' : '';

	const _result:string[] = [];
	const empty:(any|null)[] = ['', null]

	// #ifndef APP-ANDROID
	empty.push(undefined)
	// #endif

	for (const key in data) {
		const value = data[key];

		// 去掉为空的参数
		if (empty.includes(value)) {
			continue;
		}
		if (Array.isArray(value)) {
			(value as any[]).forEach((_value) => {
				_result.push(
					encodeURIComponent(key) + '[]=' + encodeURIComponent(`${_value}`),
				);
			});
		} else {
			_result.push(encodeURIComponent(key) + '=' + encodeURIComponent(`${value}`));
		}
	}
	return _result.length > 0 ? prefix + _result.join('&') : '';
}