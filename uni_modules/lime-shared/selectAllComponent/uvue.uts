// @ts-nocheck
import { type ComponentPublicInstance } from 'vue';

type SelectOptions = {
	context : ComponentPublicInstance,
	needAll : boolean | null,
	
}

export function selectAllComponent(selector : string, options : UTSJSONObject) : ComponentPublicInstance[]|null {
	const context = options.get('context')! as ComponentPublicInstance;
	let needAll = options.get('needAll') as  boolean;
	let result:ComponentPublicInstance[] = []
	
	if(needAll == null) { needAll = true };
	
	if(context.$children.length > 0) {
		const queue:ComponentPublicInstance[] = [...context.$children];
		while(queue.length > 0) {
			const child = queue.shift();
			const name = child?.$options?.name;
			if(name == selector) {
				result.push(child as ComponentPublicInstance)
			} else {
				const children = child?.$children 
				if(children !== null) {
					queue.push(...children)
				}
			}
			if(result.length > 0 && !needAll) {
				break;
			}
		}
	}
	if(result.length > 0) {
		return result
	}
	return null
}