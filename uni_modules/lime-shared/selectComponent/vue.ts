// @ts-nocheck
// #ifdef MP
function findChildren(selector : string, context : ComponentPublicInstance, needAll : boolean) {
	const { proxy, $vm } = context
	context = $vm || proxy
	if ((selector.startsWith('.') || selector.startsWith('#'))) {
		const queue = [context]
		let result = null
		while (queue.length > 0) {
			const child = queue.shift();
			const flag = child?.selectComponent(selector)
			if (flag) {
				if (!needAll) { return result = flag.$vm }
				return result = child.selectAllComponents(selector).map(item => item.$vm)
			} else {
				child.$children && (queue.push(...child.$children));
			}
		}
		return result
	} else {
		const { $templateRefs } = context.$
		const selectorValue = /#|\.|@|$/.test(selector) ? selector.substring(1) : selector
		const nameMap = {}
		for (var i = 0; i < $templateRefs.length; i++) {
			const item = $templateRefs[i]
			nameMap[item.i] = item.r
		}
		let result = []
		if (context.$children.length) {
			const queue = [...context.$children]
			while (queue.length > 0) {
				const child = queue.shift();
				if (child.type?.name === selectorValue || child.$?.type?.name === selectorValue) {
					result.push(child)
				} else if (child.$refs && child.$refs[selectorValue]) {
					result = child.$refs[selectorValue]
				} else if (nameMap[child.id] === selectorValue) {
					result.push(child)
				} else {
					child.$children && (queue.push(...child.$children));
				}
				if (result.length && !needAll) {
					return;
				}
			}
		}
		return needAll ? result : result[0]
	}
}
// #endif

// #ifdef H5
function findChildren(selector : string, context : ComponentPublicInstance, needAll : boolean){
	const {_, component } = context
	const child = {component: _ || component || context, children: null , subTree: null, props: null}
	let result = []
	let queue = [child]
	const selectorValue = /#|\.|@|$/.test(selector) ? selector.substring(1) : selector
	while(queue.length > 0 ) {
		const child = queue.shift()
		const {component, children , props, subTree} = child
		if(component?.type?.name == selectorValue) {
			result.push(component)
		} else if(selector.startsWith('$') && component && (props?.ref == selectorValue || component[key][selectorValue])) {
			if(props?.ref == selectorValue) {
				//exposed
				result.push(component)
			} else if(component[key][selectorValue]) {
				result.push(component[key][selectorValue])
			}
		} else if(!selector.startsWith('$') && component?.exposed && new RegExp(`\\b${selectorValue}\\b`).test(component.attrs[key])) {
			// exposed
			result.push(component)
		} else if(children && Array.isArray(children)) {
			queue.push(...children)
		} else if(!component && subTree) {
			queue.push(subTree)
		} else if(component?.subTree) {
			queue.push(component.subTree)
		}
		if(result.length && !needAll) {
			break
		}
	}
	return needAll ? result : result[0]
}
// #endif

// #ifdef APP
function findChildren(selector : string, context : ComponentPublicInstance, needAll : boolean){
	let result = []
	const selectorValue = /#|\.|@|$/.test(selector) ? selector.substring(1) : selector
	const queue = [context]
	while(queue.length > 0) {
		const child = queue.shift()
		const {component, children, props, subTree} = child
		const isComp = component && props && component.exposed && !node
		if(child.type && child.type.name === selectorValue) {
			result.push(component)
		} else if(props?.[key] === selectorValue && node) {
			result.push(child)
		} else if(selector.startsWith('$') && isComp && (props.ref === selectorValue || props.ref_key === selectorValue)) {
			// exposed
			result.push(component)
		} else if(!selector.startsWith('$') && isComp && new RegExp(`\\b${selectorValue}\\b`).test(props[key])) {
			// exposed
			result.push(component)
		}
		else if(subTree) {
			queue.push(subTree)
		} else if(component && component.subTree){
			queue.push(component.subTree)
		} 
		 else if(children && Array.isArray(children)) {
			queue.push(...children)
		}
		if(result.length && !needAll) {
			break;
		}
	}
	return needAll ? result : result[0]
}
// #endif

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
	find() : ComponentPublicInstance | null {
		return findChildren(this.selector, this.context, false)
	}
	findAll() : ComponentPublicInstance[] | null {
		return findChildren(this.selector, this.context, true)
	}
	closest() : ComponentPublicInstance | null {
		return null
	}
}

export function selectComponent(selector: string) {
	return new Query(selector)
}