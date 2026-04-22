// @ts-nocheck
// #ifdef APP-NVUE  || APP-VUE
export const getLocalFilePath = (path : string) => {
	if (typeof plus == 'undefined') return path
	if (/^(_www|_doc|_documents|_downloads|file:\/\/|\/storage\/emulated\/0\/)/.test(path)) return path
	if (/^\//.test(path)) {
		const localFilePath = plus.io.convertAbsoluteFileSystem(path)
		if (localFilePath !== path) {
			return localFilePath
		} else {
			path = path.slice(1)
		}
	}
	return '_www/' + path
}
// #endif


// #ifdef UNI-APP-X && APP
export { getResourcePath as getLocalFilePath } from '@/uni_modules/lime-file-utils'
// export const getLocalFilePath = (path : string) : string => {
// 	let uri = path
// 	if (uri.startsWith("http") || uri.startsWith("<svg") || uri.startsWith("data:image/svg+xml")) {
// 		return uri
// 	}
// 	if (uri.startsWith("file://")) {
// 		uri = uri.substring("file://".length)
// 	} else if (uri.startsWith("unifile://")) {
// 		uri = UTSAndroid.convert2AbsFullPath(uri)
// 	} else {
// 		uri = UTSAndroid.convert2AbsFullPath(uri)
// 		if (uri.startsWith("/android_asset/")) {
// 			uri = uri.replace("/android_asset/", "")
// 		}
// 	}
// 	if (new File(uri).exists()) {
// 		return uri
// 	} else {
// 		return null
// 	}
// 	// return UTSAndroid.convert2AbsFullPath(path)
// }
// #endif
// #ifdef APP-IOS
// export const getLocalFilePath = (path : string) : string => {
// 	try {
// 		let uri = path
// 		if (uri.startsWith("http") || uri.startsWith("<svg") || uri.startsWith("data:image/svg+xml")) {
// 			return uri
// 		}
// 		if (uri.startsWith("file://")) {
// 			return uri.substring("file://".length)
// 		} else if (path.startsWith("/var/")) {
// 			return path
// 		}
// 		return UTSiOS.getResourcePath(path)
// 	} catch (e) {
// 		return null
// 	}
// 	// return UTSiOS.getResourcePath(path)
// }
// #endif
