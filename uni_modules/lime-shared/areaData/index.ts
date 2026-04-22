// @ts-nocheck
import _areaList from './city-china.json';
export const areaList = _areaList
// #ifndef UNI-APP-X
type UTSJSONObject = Record<string, string>
// #endif
// #ifdef UNI-APP-X
type Object = UTSJSONObject
// #endif
type AreaList = {
	province_list : Map<string, string>;
	city_list : Map<string, string>;
	county_list : Map<string, string>;
}
// type CascaderOption = {
// 	text : string;
// 	value : string;
// 	children ?: CascaderOption[];
// };

const makeOption = (
	label : string,
	value : string,
	children ?: UTSJSONObject[],
) : UTSJSONObject => ({
	label,
	value,
	children,
});



export function useCascaderAreaData() : UTSJSONObject[] {
	const city = areaList['city_list'] as UTSJSONObject
	const county = areaList['county_list'] as UTSJSONObject
	const province = areaList['province_list'] as UTSJSONObject
	const provinceMap = new Map<string, UTSJSONObject>();
	Object.keys(province).forEach((code) => {
		provinceMap.set(code.slice(0, 2), makeOption(`${province[code]}`, code, []));
	});

	const cityMap = new Map<string, UTSJSONObject>();

	Object.keys(city).forEach((code) => {
		const option = makeOption(`${city[code]}`, code, []);
		cityMap.set(code.slice(0, 4), option);

		const _province = provinceMap.get(code.slice(0, 2));
		if (_province != null) {
			(_province['children'] as UTSJSONObject[]).push(option)
		}
	});

	Object.keys(county).forEach((code) => {
		const _city = cityMap.get(code.slice(0, 4));
		if (_city != null) {
			(_city['children'] as UTSJSONObject[]).push(makeOption(`${county[code]}`, code, null));
		}
	});
	
	// #ifndef APP-ANDROID || APP-IOS
	return Array.from(provinceMap.values());
	// #endif
	// #ifdef APP-ANDROID || APP-IOS
	const obj : UTSJSONObject[] = []
	provinceMap.forEach((value, code) => {
		obj.push(value)
	})
	return obj
	// #endif
}