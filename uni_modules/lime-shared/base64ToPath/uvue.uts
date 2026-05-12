// @ts-nocheck
import { processFile, type ProcessFileOptions  } from '@/uni_modules/lime-file-utils'

/**
 * base64转路径
 * @param {Object} base64
 */
export function base64ToPath(base64: string, filename: string | null = null):Promise<string> {
	return new Promise((resolve,reject) => {
		processFile({
		    type: 'toDataURL',
		    path: base64,
		    filename,
		    success(res: string){
		       resolve(res)
		    },
			fail(err){
				reject(err)
			}
		} as ProcessFileOptions)
	})
}