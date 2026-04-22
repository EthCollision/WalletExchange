import {cubicBezier} from './bezier';
export let ease = cubicBezier(0.25, 0.1, 0.25, 1);
export let linear = cubicBezier(0,0,1,1);