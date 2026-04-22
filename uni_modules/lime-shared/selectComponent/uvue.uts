// @ts-nocheck
import { type ComponentPublicInstance } from 'vue';
// #ifdef APP
function findChildren(selector: string, context: ComponentPublicInstance, needAll: boolean): ComponentPublicInstance [] | null{
	let result:ComponentPublicInstance[] = []
	
	if(context !== null && context.$children.length > 0) {
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

class Query {
	context : ComponentPublicInstance | null = null
	selector : string = ''
	// components : ComponentPublicInstance[] = []
	constructor(selector : string, context : ComponentPublicInstance | null) {
		this.selector = selector
		this.context = context
	}
	in(context : ComponentPublicInstance) : Query {
		return new Query(this.selector, context)
	}
	find(): ComponentPublicInstance | null {
		const selector = this.selector
		if(selector == '') return null
		const component = findChildren(selector, this.context!, false)
		return component != null ? component[0]: null
	}
	findAll():ComponentPublicInstance[] | null {
		const selector = this.selector
		if(selector == '') return null
		return findChildren(selector, this.context!, true)
	}
	closest(): ComponentPublicInstance | null {
		const selector = this.selector
		if(selector == '') return null
		let parent = this.context!.$parent
		let name = parent?.$options?.name;
		while (parent != null && (name == null || selector != name)) {
			parent = parent.$parent
			if (parent != null) {
				name = parent.$options.name
			}
		}
		return parent
	}
}

export function selectComponent(selector: string): Query{
	return new Query(selector, null)
}
// #endif

// selectComponent('selector').in(this).find()
// selectComponent('selector').in(this).findAll()
// selectComponent('selector').in(this).closest()
