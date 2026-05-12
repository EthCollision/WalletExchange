// @ts-nocheck
import type { ComponentPublicInstance, Ref } from 'vue'
import { ease, linear } from './ease';
import { Timeline, Animation } from './';
export type UseTransitionOptions = {
	duration ?: number
	immediate ?: boolean
	context ?: ComponentPublicInstance
}
// #ifndef UNI-APP-X && APP
import { ref, watch } from '@/uni_modules/lime-shared/vue'

export function useTransition(percent : Ref<number>|(() => number), options : UseTransitionOptions) : Ref<number> {
	const current = ref(0)
	const { immediate, duration = 300 } = options
	let tl:Timeline|null = null;
	let timer = -1
	const isFunction = typeof percent === 'function'
	watch(isFunction ? percent : () => percent.value, (v) => {
		if(tl == null){
			tl = new Timeline()
		}
		tl.start();
		tl.add(
			new Animation(
				current.value,
				v,
				duration,
				0,
				ease,
				nowValue => {
					current.value = nowValue
					clearTimeout(timer)
					if(current.value == v){
						timer = setTimeout(()=>{
							tl?.pause();
							tl = null
						}, duration)
					}
				}
			)
		);
	}, { immediate })

	return current
}

// #endif

// #ifdef UNI-APP-X && APP
type UseTransitionReturnType = Ref<number>
export function useTransition(source : any, options : UseTransitionOptions) : UseTransitionReturnType {
	const outputRef : Ref<number> = ref(0)
	const immediate = options.immediate ?? false
	const duration = options.duration ?? 300
	const context = options.context //as ComponentPublicInstance | null
	let tl:Timeline|null = null;
	let timer = -1
	const watchFunc = (v : number) => {
		if(tl == null){
			tl = new Timeline()
		}
		tl!.start();
		tl!.add(
			new Animation(
				outputRef.value,
				v,
				duration,
				0,
				ease,
				nowValue => {
					outputRef.value = nowValue
					clearTimeout(timer)
					if(outputRef.value == v){
						timer = setTimeout(()=>{
							tl?.pause();
							tl = null
						}, duration)
					}
				}
			), 
			null
		);
	}

	if (context != null && typeof source == 'string') {
		context.$watch(source, watchFunc, { immediate } as WatchOptions)
	} else if(typeof source == 'function'){
		watch(source, watchFunc, { immediate })
	} 
	// #ifdef APP-ANDROID
	else if(isRef(source) && source instanceof Ref<number>) {
		watch(source as Ref<number>, watchFunc, { immediate })
	}
	// #endif
	// #ifndef APP-ANDROID
	else if(isRef(source) && typeof source.value == 'number') {
		watch(source, watchFunc, { immediate })
	}
	// #endif
	
	const stop = ()=>{
		
	}
	return outputRef //as UseTransitionReturnType
}

// #endif