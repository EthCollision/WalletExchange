// @ts-nocheck
export function getRect(selector : string, context: ComponentPublicInstance):Promise<NodeInfo> {
	return new Promise((resolve)=>{
		uni.createSelectorQuery().in(context).select(selector).boundingClientRect(res =>{
			resolve(res as NodeInfo)
		}).exec();
	})
}

export function getAllRect(selector : string, context: ComponentPublicInstance):Promise<NodeInfo[]> {
	return new Promise((resolve)=>{
		uni.createSelectorQuery().in(context).selectAll(selector).boundingClientRect(res =>{
			resolve(res as NodeInfo[])
		}).exec();
	})
}

