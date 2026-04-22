// @ts-nocheck
import { raf,  cancelRaf} from '../raf'
export class Timeline {
	state : string
	animations : Set<Animation> = new Set<Animation>()
	delAnimations : Animation[] = []
	startTimes : Map<Animation, number> = new Map<Animation, number>()
	pauseTime : number = 0
	pauseStart : number = Date.now()
	tickHandler : number = 0
	tickHandlers : number[] = []
	tick : (() => void) | null = null
	constructor() {
		this.state = 'Initiated';
	}
	start() {
		if (!(this.state == 'Initiated')) return;
		this.state = 'Started';

		let startTime = Date.now();
		this.pauseTime = 0;
		this.tick = () => {
			let now = Date.now();
			this.animations.forEach((animation : Animation) => {
				let t:number;
				const ani = this.startTimes.get(animation)
				if (ani == null) return
				if (ani < startTime) {
					t = now - startTime - animation.delay - this.pauseTime;
				} else {
					t = now - ani - animation.delay - this.pauseTime;
				}
				if (t > animation.duration) {
					this.delAnimations.push(animation)
					// 不能在 foreach 里面 对 集合进行删除操作
					// this.animations.delete(animation);
					t = animation.duration;
				}
				if (t > 0) animation.run(t);
			})
			// 不能在 foreach 里面 对 集合进行删除操作
			while (this.delAnimations.length > 0) {
				const animation = this.delAnimations.pop();
				if (animation == null) return
				this.animations.delete(animation);
			}
			// cancelAnimationFrame(this.tickHandler);
			if (this.state != 'Started') return
		
			 this.tickHandler = raf(()=>{
				this.tick!()
			})
			
			this.tickHandlers.push(this.tickHandler)
		}
		if(this.tick != null) {
			this.tick!()
		}
		
	}
	pause() {
		if (!(this.state === 'Started')) return;
		this.state = 'Paused';
		this.pauseStart = Date.now();
		cancelRaf(this.tickHandler);
		// cancelRaf(this.tickHandler);
	}
	resume() {
		if (!(this.state === 'Paused')) return;
		this.state = 'Started';
		this.pauseTime += Date.now() - this.pauseStart;
		this.tick!();
	}
	reset() {
		this.pause();
		this.state = 'Initiated';
		this.pauseTime = 0;
		this.pauseStart = 0;
		this.animations.clear()
		this.delAnimations.clear()
		this.startTimes.clear()
		this.tickHandler = 0;
	}
	add(animation : Animation, startTime ?: number | null) {
		if (startTime == null) startTime = Date.now();
		this.animations.add(animation);
		this.startTimes.set(animation, startTime);
	}
}

export class Animation {
	startValue : number
	endValue : number
	duration : number
	timingFunction : (t : number) => number
	delay : number
	template : (t : number) => void
	constructor(
		startValue : number,
		endValue : number,
		duration : number,
		delay : number,
		timingFunction : (t : number) => number,
		template : (v : number) => void) {
		this.startValue = startValue;
		this.endValue = endValue;
		this.duration = duration;
		this.timingFunction = timingFunction;
		this.delay = delay;
		this.template = template;
	}

	run(time : number) {
		let range = this.endValue - this.startValue;
		let progress = time / this.duration
		if(progress != 1) progress = this.timingFunction(progress)
		this.template(this.startValue + range * progress)
	}
}