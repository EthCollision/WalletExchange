# lime-qrcode 二维码
- 一款全平台通用的二维码生成插件，支持uniapp/uniappx
- uniappx app 需要导入[lime-qrcodegen](https://ext.dcloud.net.cn/plugin?id=15838)


## 安装
在插件市场导入即可。

**注意**
- uniappx app 需要导入**[lime-qrcodegen](https://ext.dcloud.net.cn/plugin?id=15838)**,
- 非uniappx app可直接使用

## 代码演示

### 基础使用

```html
<l-qrcode value="http://lime.qcoon.cn" />
```


### ICON
- 带 Icon 的二维码

```html
<l-qrcode value="https://limeui.qcoon.cn" size="300rpx" icon="/static/logo.png" iconSize="70rpx"></l-qrcode>
```

### 颜色
- 通过设置 `color` 自定义二维码颜色，通过设置 `bgColor` 自定义背景颜色。

```html
<l-qrcode value="https://limeui.qcoon.cn" size="300rpx" color="rgb(82,196,26)"></l-qrcode>
<l-qrcode value="https://limeui.qcoon.cn" size="300rpx" color="rgb(22,119,255)" bgColor="rgb(245,245,245)"></l-qrcode>
```

### 纠错比例
- 通过设置 `errorLevel` 调整不同的容错等级。

```html
<l-qrcode value="img10.360buyimg.com/img/jfs/t1/182127/16/37474/11761/64659c31F0cd84976/21f25b952f03a49a.jpg" size="300rpx" errorLevel="H"></l-qrcode>
```

### 生成图片
如果是canvas 2d的环境生成的是base64
- 1、通过调用插件的`canvasToTempFilePath`方法生成图片。

```html
<image v-if="image" :src="image" style="width: 300rpx;" mode="widthFix"></image>
<l-qrcode ref="qrcodeRef" value="https://limeui.qcoon.cn" size="300rpx" icon="https://img10.360buyimg.com/img/jfs/t1/182127/16/37474/11761/64659c31F0cd84976/21f25b952f03a49a.jpg" iconSize="70rpx"></l-qrcode>
<button @click="onClick">生成图片</button>
```
```js
// vue3
const qrcodeRef = ref(null)
const onClick = () => {
	if(!qrcodeRef.value) return
	qrcodeRef.value.canvasToTempFilePath({
		success(res) {
			image.value = res.tempFilePath
			console.log('success:::', res)
		},
		fail(err) {
			console.log('err:::', err)
		}
	})
}

// vue2
const el = this.$refs['qrcodeRef'] 
el.canvasToTempFilePath({
	success:(res)=>{
		this.image = res.tempFilePath
	},
	fail(err) {
		console.log('err:::', err)
	}
})

// uvue
const el:LQrcodeComponentPublicInstance = this.$refs['qrcodeRef'] as LQrcodeComponentPublicInstance 
el.canvasToTempFilePath({
	success:(res: TakeSnapshotSuccess)=>{
		this.image = res.tempFilePath
	},
	fail(err: TakeSnapshotFail) {
		console.log('err:::', err)
	}
})
```

- 2、通过设置`useCanvasToTempFilePath`在`success`事件里接收图片地址

```html
<image v-if="image" :src="image" style="width: 300rpx;" mode="widthFix"></image>
<l-qrcode useCanvasToTempFilePath @success="success" value="https://limeui.qcoon.cn"></l-qrcode>
```
```js
const image = ref(null)
const success = (img) => {
	image.value = img
}
```

### 关于vue2的使用方式
- 插件使用了`composition-api`, 如果你希望在vue2中使用请按官方的教程[vue-composition-api](https://uniapp.dcloud.net.cn/tutorial/vue-composition-api.html)配置
- 关键代码是: 在main.js中 在vue2部分加上这一段即可

```js
// main.js vue2
import Vue from 'vue'
import VueCompositionAPI from '@vue/composition-api'
Vue.use(VueCompositionAPI)
```
另外插件也用到了TS，vue2可能会遇过官方的TS版本过低的问题,找到HX目录下的`compile-typescript`目录
```cmd
// \HBuilderX\plugins\compile-typescript
yarn add typescript -D
- or - 
npm install typescript -D
```

### 查看示例
- 导入后直接使用这个标签查看演示效果

```html
// 代码位于 uni_modules/lime-qrcode/compoents/lime-qrcode
<lime-qrcode />
```

### 插件标签
- 默认 l-qrcode 为 component
- 默认 lime-qrcode 为 demo



## API

### Props

| 参数                       | 说明                                                         | 类型             | 默认值       |
| --------------------------| ------------------------------------------------------------ | ---------------- | ------------ |
| value                     | 扫描后的文本                                       			| <em>string</em>  | `-`        |
| icon                      | 二维码中图片的地址                                              | <em>string</em>  | `-`        |
| size                      | 二维码大小                                                      | <em>number，string</em>  | `160`     |
| iconSize           		| 二维码中图片的大小                                                | <em>number，string</em>  | `40`      |
| color           	        | 二维码颜色                                                        | <em>string</em>  | `-`      |
| bgColor           	    | 二维码背景颜色          	                                      | <em>string</em>  | `-`  |
| errorLevel             	| 二维码纠错等级       					                         | `'L' | 'M' | 'Q' | 'H' ` | `M`  |
| marginSize             	| 边距码大小，默认为0码点      					                          | <em>number</em>  | `0`     |

### 常见问题
- icon 是网络地址时，H5和Nvue需要解决跨域问题，小程序需要配置download

## 打赏

如果你觉得本插件，解决了你的问题，赠人玫瑰，手留余香。  
![](https://testingcf.jsdelivr.net/gh/liangei/image@1.9/alipay.png)
![](https://testingcf.jsdelivr.net/gh/liangei/image@1.9/wpay.png)