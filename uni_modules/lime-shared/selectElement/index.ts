// @ts-nocheck
import {isDef} from '../isDef'
// #ifdef UNI-APP-X
import {type ComponentPublicInstance} from '../vue'
// #endif

type HasSelectorFunc = (selector : string, element : UniElement) => boolean

const hasSelectorClassName : HasSelectorFunc = (selector : string, element : UniElement) : boolean => {
	return element.classList.includes(selector)
}
const hasSelectorId : HasSelectorFunc = (selector : string, element : UniElement) : boolean => {
	return element.getAttribute("id") == selector
}
const hasSelectorTagName : HasSelectorFunc = (selector : string, element : UniElement) : boolean => {
	return element.tagName!.toLowerCase() == selector.toLowerCase()
}

type ProcessSelectorResult = {
	selectorValue : string
	hasSelector : HasSelectorFunc
}
const processSelector = (selector : string) : ProcessSelectorResult => {

	const selectorValue = /#|\./.test(selector) ? selector.substring(1) : selector
	let hasSelector : HasSelectorFunc

	if (selector.startsWith('.')) {
		hasSelector = hasSelectorClassName
	} else if (selector.startsWith('#')) {
		hasSelector = hasSelectorId
	} else {
		hasSelector = hasSelectorTagName
	}

	return {
		selectorValue,
		hasSelector
	} as ProcessSelectorResult
}


function isNotEmptyString(str:string): boolean {
  return str.length > 0;
}

function isElement(element:UniElement|null):boolean {
  return isDef(element) && element?.tagName != 'COMMENT';
}

type ElementArray = Array<UniElement|null>
class Query {
	context : ComponentPublicInstance | null = null
	selector : string = ''
	elements : ElementArray = []
	constructor(selector : string | null, context : ComponentPublicInstance | null) {
		this.context = context
		if(selector != null){
			this.selector = selector
		}
		this.find(this.selector)
	}
	in(context : ComponentPublicInstance) : Query {
		return new Query(this.selector, context)
	}
	findAll(selector : string): Query {
		if (isDef(this.context)) {
			const root = this.context?.$el //as Element | null;
			if (isDef(root)) {
				this.elements = [root!] //as ElementArray
			}
			const { selectorValue, hasSelector } = processSelector(selector)
			const foundElements : ElementArray = [];
		
			function findChildren(element : UniElement) {
				element.children.forEach((child : UniElement) => {
					if (hasSelector(selectorValue, child)) {
						foundElements.push(child)
					}
				})
			}
			this.elements.forEach(el => {
				findChildren(el!);
			});
			this.elements = foundElements
		} else if (selector.startsWith('#')) {
			const element = uni.getElementById(selector)
			if (isElement(element!)) {
				this.elements = [element]
			}
		}
		return this;
	}
	/**
	 * 在当前元素集合中查找匹配的元素
	 */
	find(selector : string) : Query {
		if (isDef(this.context)) {
			const root = this.context?.$el //as Element | null;
			if (isElement(root)) {
				this.elements = [root] //as ElementArray
			}
			if(isNotEmptyString(selector) && this.elements.length > 0){
				const { selectorValue, hasSelector } = processSelector(selector)
				const foundElements : ElementArray = [];
				function findChildren(element : UniElement) {
					element.children.forEach((child : UniElement) => {
						if (hasSelector(selectorValue, child) && foundElements.length < 1) {
							foundElements.push(child)
						}
						if (foundElements.length < 1) {
							findChildren(child);
						}
					})
				}
				this.elements.forEach(el => {
					findChildren(el!);
				});
				this.elements = foundElements
			}
			
		} else if (selector.startsWith('#')) {
			const element = uni.getElementById(selector)
			if (isElement(element!)) {
				this.elements = [element]
			}
		}
		return this;
	}
	/**
	 * 获取当前元素集合的直接子元素
	 */
	children() : Query {
		// if (this.elements.length > 0) {
			// const children = this.elements.reduce((acc, el) => [...acc, ...Array.from(el.children)], []);
			// this.elements = children;
		// }
		return this;
	}
	/**
	 * 获取当前元素集合的父元素
	 */
	parent() : Query {
		// if (this.elements.length > 0) {
		// 	const parents = this.elements.map(el => el.parentElement).filter(parent => parent !== null) as ElementArray;
		// 	this.elements = parents
		// 	// this.elements = Array.from(new Set(parents));
		// }
		return this;
	}
	/**
	 * 获取当前元素集合的兄弟元素
	 */
	siblings() : Query {
		// if (this.elements.length > 0) {
			// const siblings = this.elements.reduce((acc, el) => [...acc, ...Array.from(el.parentElement?.children || [])], []);
			// this.elements = siblings.filter(sibling => sibling !== null && !this.elements?.includes(sibling));
		// }
		return this;
	}
	/**
	 * 获取当前元素集合的下一个兄弟元素
	 */
	next() : Query {
		// if (this.elements.length > 0) {
		// 	const nextElements = this.elements.map(el => el.nextElementSibling).filter(next => next !== null) as ElementArray;
		// 	this.elements = nextElements;
		// }
		return this;
	}
	/**
	 * 获取当前元素集合的上一个兄弟元素
	 */
	prev() : Query {
		// if (this.elements.length > 0) {
		// 	const prevElements = this.elements.map(el => el.previousElementSibling).filter(prev => prev !== null) as ElementArray;
		// 	this.elements = prevElements;
		// }
		return this;
	}
	/**
	 * 从当前元素开始向上查找匹配的元素
	 */
	closest(selector : string) : Query {
		if (isDef(this.context)) {
			// && this.context.$parent != null && this.context.$parent.$el !== null
			if(this.elements.length == 0 && isDef(this.context?.$parent) && isElement(this.context!.$parent?.$el)){
				this.elements = [this.context!.$parent?.$el!]
			}
			
			const selectorsArray = selector.split(',')
			// const { selectorValue, hasSelector } = processSelector(selector)
			const processedSelectors = selectorsArray.map((selector: string):ProcessSelectorResult => processSelector(selector)) 
			const closestElements = this.elements.map((el) : UniElement | null => {
				let closestElement : UniElement | null = el
				while (closestElement !== null) {
					// if (hasSelector(selectorValue, closestElement)) {
					// 	break;
					// }
					const isMatchingSelector = processedSelectors.some(({selectorValue, hasSelector}):boolean => {
						return hasSelector(selectorValue, closestElement!)
					})
					if(isMatchingSelector){
						break;
					}
					closestElement = closestElement.parentElement;
				}
				return closestElement
			})
			this.elements = closestElements.filter((closest : UniElement | null) : boolean => isDef(closest))// as ElementArray
			
		}
		return this;
	}

	/**
	 * 从当前元素集合中过滤出匹配的元素
	 */
	filter() : Query {

		return this;
	}
	/**
	 * 从当前元素集合中排除匹配的元素
	 */
	not() { }
	/**
	 * 从当前元素集合中查找包含匹配元素的元素
	 */
	has() { }
	/**
	 * 获取当前元素集合的第一个
	 */
	first() : Query {
		if (this.elements.length > 0) {
			// this.elements = [this.elements[0]];
		}
		return this;
	}
	/**
	 * 最后一个元素
	 */
	last() : Query {
		if (this.elements.length > 0) {
			// this.elements = [this.elements[this.elements.length - 1]];
		}
		return this;
	}
	/**
	 * 获取当前元素在其兄弟元素中的索引
	 */
	index() : number | null {
		// if (this.elements.length > 0 && this.elements.length > 0 && this.elements[0].parentElement !== null) {
		// 	return Array.from(this.elements[0].parentElement.children).indexOf(this.elements[0]);
		// }
		return null;
	}
	get(index : number) : UniElement | null {
		if (this.elements.length > index) {
			return this.elements[index] //as Element
		}
		return null
	}
}

export function selectElement(selector : string | null = null) : Query {
	// if(typeof selector == 'string' || selector == null){
	// 	return new Query(selector as string | null, null)
	// } 
	// else if(selector instanceof  ComponentPublicInstance){
	// 	return new Query(null, selector)
	// }
	return new Query(selector, null)
}

// $('xxx').in(this).find('xxx')
// $('xxx').in(this).get()