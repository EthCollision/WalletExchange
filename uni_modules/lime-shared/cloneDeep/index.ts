// @ts-nocheck

// #ifdef APP-ANDROID
// export * from './uvue.uts'
export { cloneDeep } from  './uvue.uts'
// #endif


// #ifndef APP-ANDROID
// export * from './vue.ts'
export { cloneDeep } from  './vue.ts'
// #endif