# lime-shared 工具库
- 本人插件的几个公共函数
- 按需引入

## 安装
在插件市场导入即可

## 文档
[shared](https://limex.qcoon.cn/shared/overview.html)

## 使用
按需引入只会引入相关的方法，不要看着 插件函数列表多 而占空间，只要不引用不会被打包
```js
import {getRect} from '@/uni_modules/lime-shared/getRect'
```

## 目录
+ [getRect](#api_getRect): 获取节点尺寸信息
+ [addUnit](#api_addUnit): 将未带单位的数值添加px，如果有单位则返回原值
+ [unitConvert](#api_unitConvert): 将带有rpx|px的字符转成number,若本身是number则直接返回
+ [canIUseCanvas2d](#api_canIUseCanvas2d): 环境是否支持使用 canvas 2d
+ [getCurrentPage](#api_getCurrentPage): 获取当前页
+ [base64ToPath](#api_base64ToPath): 把base64的图片转成临时路径
+ [pathToBase64](#api_pathToBase64): 把图片的临时路径转成base64
+ [sleep](#api_sleep): async 内部程序等待一定时间后再执行
+ [throttle](#api_throttle): 节流
+ [debounce](#api_debounce): 防抖
+ [random](#api_random): 返回指定范围的随机数
+ [range](#api_range): 生成区间数组 
+ [clamp](#api_clamp): 夹在min和max之间的数值 
+ [floatAdd](#api_floatAdd): 返回两个浮点数相加的结果
+ [fillZero](#api_fillZero): 补零，如果传入的是个位数则在前面补0
+ [exif](#api_exif): 获取图片exif
+ [selectComponent](#api_selectComponent): 获取页面或当前实例的指定组件
+ [createAnimation](#api_createAnimation): uni.createAnimation
+ [animation](#api_animation): 数值从一个值到另一个值的过渡
+ [camelCase](#api_camelCase): 字符串转换为 camelCase 或 PascalCase 风格的命名约定
+ [kebabCase](#api_kebabCase): 将字符串转换为指定连接符的命名约定
+ [closest](#api_closest): 在给定数组中找到最接近目标数字的元素
+ [shuffle](#api_shuffle): 将给定的数组打乱
+ [merge](#api_merge): 深度合并两个对象
+ [isBase64](#api_isBase64): 判断字符串是否为base64
+ [isNumber](#api_isNumber): 检查一个值是否为数字类型
+ [isNumeric](#api_isNumeric): 检查一个值是否为数字类型或表示数字的字符串
+ [isString](#api_isString): 检查一个值是否为字符串类型
+ [isIP](#api_isIP): 检查一个值是否为IP地址格式
+ [composition-api](#api_composition-api): 为兼容vue2

## Utils


### getRect <a id="api_getRect"></a>
- 返回节点尺寸信息

```js
// 组件内需要传入上下文
// 如果是nvue 则需要在节点上加与id或class同名的ref
getRect('#id',this).then(res => {})
```
##### 兼容性
| uni-app      | uni-app x                      | 
|------------|----------------------------------|
| √     | √                 | 




### addUnit <a id="api_addUnit"></a> 
- 将未带单位的数值添加px，如果有单位则返回原值

```js
addUnit(10)
// 10px
```

##### 兼容性
| uni-app      | uni-app x                      | 
|------------|----------------------------------|
| √     | √                 | 




### unitConvert <a id="api_unitConvert"></a>
- 将带有rpx|px的字符转成number,若本身是number则直接返回

```js
unitConvert('10rpx') 
// 5 设备不同 返回的值也不同
unitConvert('10px') 
// 10
unitConvert(10) 
// 10
```
##### 兼容性
| uni-app      | uni-app x                      | 
|------------|----------------------------------|
| √     | √                 | 



### canIUseCanvas2d <a id="api_canIUseCanvas2d"></a>
- 环境是否支持使用 canvas 2d

```js
canIUseCanvas2d()
// 若支持返回 true 否则 false
```
##### 兼容性
| uni-app      | uni-app x                      | 
|------------|----------------------------------|
| √     | √                 | 



### getCurrentPage <a id="api_getCurrentPage"></a>
- 获取当前页

```js
const page = getCurrentPage()
```
##### 兼容性
| uni-app      | uni-app x                      | 
|------------|----------------------------------|
| √     | √                 | 



### base64ToPath <a id="api_base64ToPath"></a>
- 把base64的图片转成临时路径

```js
base64ToPath(`xxxxx`).then(res => {})
```
##### 兼容性
| uni-app      | uni-app x                      | 
|------------|----------------------------------|
| √     | √                 | 



### pathToBase64 <a id="api_pathToBase64"></a>
- 把图片的临时路径转成base64

```js
pathToBase64(`xxxxx/xxx.png`).then(res => {})
```
##### 兼容性
| uni-app      | uni-app x                      | 
|------------|----------------------------------|
| √     | √                 | 



### sleep <a id="api_sleep"></a>
- 睡眠，让 async 内部程序等待一定时间后再执行

```js
async next () => {
	await sleep(300)
	console.log('limeui');
}
```
##### 兼容性
| uni-app      | uni-app x                      | 
|------------|----------------------------------|
| √     | √                 | 


### throttle <a id="api_throttle"></a> 
- 节流

```js
throttle((nama) => {console.log(nama)}, 200)('limeui');
```
##### 兼容性
| uni-app      | uni-app x                      | 
|------------|----------------------------------|
| √     | √                 | 


### debounce <a id="api_debounce"></a>
- 防抖

```js
debounce((nama) => {console.log(nama)}, 200)('limeui');
```
##### 兼容性
| uni-app      | uni-app x                      | 
|------------|----------------------------------|
| √     | √                 | 


### random <a id="api_random"></a>
- 返回指定范围的随机数

```js
random(1, 5);
```
##### 兼容性
| uni-app      | uni-app x                      | 
|------------|----------------------------------|
| √     | √                 | 


### range <a id="api_range"></a>
- 生成区间数组

```js
range(0, 5)
// [0,1,2,3,4,5]
```
##### 兼容性
| uni-app      | uni-app x                      | 
|------------|----------------------------------|
| √     | √                 | 



### clamp <a id="api_clamp"></a>
- 夹在min和max之间的数值，如小于min，返回min, 如大于max，返回max，否侧原值返回

```js
clamp(0, 10, -1)
// 0
clamp(0, 10, 11)
// 10
clamp(0, 10, 9)
// 9
```
##### 兼容性
| uni-app      | uni-app x                      | 
|------------|----------------------------------|
| √     | √                 | 



### floatAdd <a id="api_floatAdd"></a>
- 返回两个浮点数相加的结果

```js
floatAdd(0.1, 0.2) // 0.3
```
##### 兼容性
| uni-app      | uni-app x                      | 
|------------|----------------------------------|
| √     | √                 | 


### fillZero <a id="api_fillZero"></a>
- 补零，如果传入的是`个位数`则在前面补0

```js
fillZero(9);
// 09
```
##### 兼容性
| uni-app      | uni-app x                      | 
|------------|----------------------------------|
| √     | √                 | 


### exif <a id="api_exif"></a>
- 获取图片exif
- 支持临时路径、base64

```js
uni.chooseImage({
	count: 1, //最多可以选择的图片张数
	sizeType: "original",
	success: (res) => {
		exif.getData(res.tempFiles[0], function() {
			let tagj = exif.getTag(this, "GPSLongitude");
			let	Orientation = exif.getTag(this, 'Orientation');  
			console.log(tagj, Orientation)
		})
	}
})
```

##### 兼容性
| uni-app      | uni-app x                      | 
|------------|----------------------------------|
| √     | x                 | 


### selectComponent <a id="api_selectComponent"></a>
- 获取页面或当前实例的指定组件，会在页面或实例向所有的节点查找（包括子组件或子子组件）
- 仅vue3，vue2没有测试过

```js
// 当前页面
const page = getCurrentPage()
selectComponent('.custom', {context: page}).then(res => {
})
```
##### 兼容性
| uni-app      | uni-app x                      | 
|------------|----------------------------------|
| √     | x                 | 



### createAnimation <a id="api_createAnimation"></a>
- 创建动画，与uni.createAnimation使用方法一致，只为了抹平nvue

```html
<view ref="ball" :animation="animationData"></view>
```
```js
const ball = ref(null)
const animation = createAnimation({
  transformOrigin: "50% 50%",
  duration: 1000,
  timingFunction: "ease",
  delay: 0
})

animation.scale(2,2).rotate(45).step()
// nvue 无导出数据，这样写只为了平台一致，
// nvue 需要把 ref 传入，其它平台不需要
const animationData = animation.export(ball.value)
```
##### 兼容性
| uni-app      | uni-app x                      | 
|------------|----------------------------------|
| √     | √                 | 



##### 兼容性
| uni-app      | uni-app x                      | 
|------------|----------------------------------|
| √     | √                 | 



### camelCase <a id="api_camelCase"></a>
- 将字符串转换为 camelCase 或 PascalCase 风格的命名约定

```js
camelCase("hello world") // helloWorld
camelCase("hello world", true) // HelloWorld
```

##### 兼容性
| uni-app      | uni-app x                      | 
|------------|----------------------------------|
| √     | √                 | 


### kebabCase <a id="api_kebabCase"></a>
- 将字符串转换为指定连接符的命名约定

```js
kebabCase("helloWorld") // hello-world
kebabCase("hello world_example") // hello-world-example
kebabCase("helloWorld", "_") // hello_world
```

##### 兼容性
| uni-app      | uni-app x                      | 
|------------|----------------------------------|
| √     | √                 | 




### closest <a id="api_closest"></a>
- 在给定数组中找到最接近目标数字的元素

```js
closest([1, 3, 5, 7, 9], 6) // 5
```

##### 兼容性
| uni-app      | uni-app x                      | 
|------------|----------------------------------|
| √     | √                 | 


### shuffle <a id="api_shuffle"></a>
- 在给定数组中找到最接近目标数字的元素

```js
shuffle([1, 3, 5, 7, 9]) 
```

##### 兼容性
| uni-app      | uni-app x                      | 
|------------|----------------------------------|
| √     | √                 | 


### merge <a id="api_merge"></a>
- 深度合并两个对象

```js
const original = { color: 'red' };
const merged = merge({ ...original }, { color: 'blue', size: 'M' });

console.log('original', original);    // 输出: { color: 'red' } (保持不变)
console.log('merged', merged);      // 输出: { color: 'red', size: 'M' }


type ColorType = {
	color?: string,
	size?: string,
}

const merged2 = merge({ color: 'red' } as ColorType, { color: 'blue', size: 'M' } as ColorType);
console.log('merged2', merged2)
```

##### 兼容性
| uni-app      | uni-app x                      | 
|------------|----------------------------------|
| √     | √                 | 




### isBase64 <a id="api_isBase64"></a>
- 判断字符串是否为base64

```js
isBase64('xxxxx')
```
##### 兼容性
| uni-app      | uni-app x                      | 
|------------|----------------------------------|
| √     | √                 | 


### isNumber <a id="api_isNumber"></a>
-  检查一个值是否为数字类型

```js
isNumber('0') // false
isNumber(0) // true
```
##### 兼容性
| uni-app      | uni-app x                      | 
|------------|----------------------------------|
| √     | √                 | 


### isNumeric <a id="api_isNumeric"></a>
-  检查一个值是否为数字类型或表示数字的字符串

```js
isNumeric('0') // true
isNumeric(0) // true
```
##### 兼容性
| uni-app      | uni-app x                      | 
|------------|----------------------------------|
| √     | √                 | 

### isString <a id="api_isString"></a>
-  检查一个值是否为数字类型或表示数字的字符串

```js
isString('0') // true
isString(0) // false
```
##### 兼容性
| uni-app      | uni-app x                      | 
|------------|----------------------------------|
| √     | √                 | 

### isIP <a id="api_isIP"></a>
-  检查一个值是否为IP地址格式，可以检测ipv4,ipv6

```js
console.log(isIP('192.168.1.1'));             // true
console.log(isIP('2001:0db8:85a3:0000:0000:8a2e:0370:7334')); // true

console.log(isIP('192.168.1.1', 4));             // true
console.log(isIP('255.255.255.255', { version: 4 })); // true

// 标准IPv6格式
console.log(isIP('2001:0db8:85a3:0000:0000:8a2e:0370:7334', 6)); // true
console.log(isIP('fe80::1%eth0', { version: 6 }));               // true（带区域标识）

```
##### 兼容性
| uni-app      | uni-app x                      | 
|------------|----------------------------------|
| √     | √                 | 




## composition-api <a id="api_composition-api"></a>
- 因本人插件需要兼容vue2/vue3，故增加一个vue文件,代替条件编译
- vue2需要在main.js加上这一段
```js
// vue2
import Vue from 'vue'
import VueCompositionAPI from '@vue/composition-api'
Vue.use(VueCompositionAPI)
```

```js
//使用
import {computed, onMounted, watch, reactive} from '@/uni_modules/lime-shared/vue'
```

##### 兼容性
| uni-app      | uni-app x                      | 
|------------|----------------------------------|
| √     | x                 | 
