// @ts-nocheck
/**
 * 深度克隆一个对象或数组
 * @param obj 要克隆的对象或数组
 * @returns 克隆后的对象或数组
 */
export function cloneDeep<T>(obj : any) : T {
	if (obj instanceof Set) {
		const set = new Set<any>();
		obj.forEach((item : any) => {
			set.add(item)
		})
		return set as T;
	}
	if (obj instanceof Map) {
		const map = new Map<any, any>();
		obj.forEach((value : any, key : any) => {
			map.set(key, value)
		})
		return map as T;
	}

	if (obj instanceof RegExp) {
		return new RegExp(obj) as T;
	}

	if (Array.isArray(obj)) {
		return (obj as any[]).map((item : any):any => item) as T;
	}

	if (obj instanceof Date) {
		return new Date(obj.getTime()) as T;
	}

	if (typeof obj == 'object') {
		return UTSJSONObject.assign<T>({}, toRaw(obj))! 
	}
	return obj as T
}