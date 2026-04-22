// @ts-nocheck
const TICK = Symbol('tick');
const TICK_HANDLER = Symbol('tick-handler');
const ANIMATIONS = Symbol('animations');
const START_TIMES = Symbol('start-times');
const PAUSE_START = Symbol('pause-start');
const PAUSE_TIME = Symbol('pause-time');
const _raf = typeof requestAnimationFrame !== 'undefined' ? requestAnimationFrame : function(cb: Function) {return setTimeout(cb, 1000/60)}
const _caf = typeof cancelAnimationFrame !== 'undefined' ? cancelAnimationFrame: function(id: any) {clearTimeout(id)}

// const TICK = 'tick';
// const TICK_HANDLER = 'tick-handler';
// const ANIMATIONS = 'animations';
// const START_TIMES = 'start-times';
// const PAUSE_START = 'pause-start';
// const PAUSE_TIME = 'pause-time';
// const _raf = function(callback):number|null {return setTimeout(callback, 1000/60)}
// const _caf = function(id: number):void {clearTimeout(id)}

export class Timeline {
	state: string
	constructor() {
		this.state = 'Initiated';
		this[ANIMATIONS] = new Set();
		this[START_TIMES] = new Map();
	}
	start() {
		if (!(this.state === 'Initiated')) return;
		this.state = 'Started';

		let startTime = Date.now();
		this[PAUSE_TIME] = 0;
		this[TICK] = () => {
			let now = Date.now();
			this[ANIMATIONS].forEach((animation) => {
				 let t: number;
				 if (this[START_TIMES].get(animation) < startTime) {
				 	t = now - startTime - animation.delay - this[PAUSE_TIME];
				 } else {
				 	t = now - this[START_TIMES].get(animation) - animation.delay - this[PAUSE_TIME];
				 }
				 
				 if (t > animation.duration) {
				 	this[ANIMATIONS].delete(animation);
				 	t = animation.duration;
				 }
				 if (t > 0) animation.run(t);
			})
			// for (let animation of this[ANIMATIONS]) {
			// 	let t: number;
			// 	console.log('animation', animation)
			// 	if (this[START_TIMES].get(animation) < startTime) {
			// 		t = now - startTime - animation.delay - this[PAUSE_TIME];
			// 	} else {
			// 		t = now - this[START_TIMES].get(animation) - animation.delay - this[PAUSE_TIME];
			// 	}

			// 	if (t > animation.duration) {
			// 		this[ANIMATIONS].delete(animation);
			// 		t = animation.duration;
			// 	}
			// 	if (t > 0) animation.run(t);
			// }
			this[TICK_HANDLER] = _raf(this[TICK]);
		};
		this[TICK]();
	}
	pause() {
		if (!(this.state === 'Started')) return;
		this.state = 'Paused';

		this[PAUSE_START] = Date.now();
		_caf(this[TICK_HANDLER]);
	}
	resume() {
		if (!(this.state === 'Paused')) return;
		this.state = 'Started';

		this[PAUSE_TIME] += Date.now() - this[PAUSE_START];
		this[TICK]();
	}
	reset() {
		this.pause();
		this.state = 'Initiated';
		this[PAUSE_TIME] = 0;
		this[PAUSE_START] = 0;
		this[ANIMATIONS] = new Set();
		this[START_TIMES] = new Map();
		this[TICK_HANDLER] = null;
	}
	add(animation: any, startTime?: number) {
		if (arguments.length < 2) startTime = Date.now();
		this[ANIMATIONS].add(animation);
		this[START_TIMES].set(animation, startTime);
	}
}

export class Animation {
	startValue: number
	endValue: number
	duration: number
	timingFunction: (t: number) => number
	delay: number
	template: (t: number) => void
	constructor(startValue: number, endValue: number, duration: number, delay: number, timingFunction: (t: number) => number, template: (v: number) => void) {
		timingFunction = timingFunction || (v => v);
		template = template || (v => v);
		
		this.startValue = startValue;
		this.endValue = endValue;
		this.duration = duration;
		this.timingFunction = timingFunction;
		this.delay = delay;
		this.template = template;
	}

	run(time: number) {
		let range = this.endValue - this.startValue;
		let progress = time / this.duration
		if(progress != 1) progress = this.timingFunction(progress)
		this.template(this.startValue + range * progress)
	}
}