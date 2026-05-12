// @ts-nocheck

// #ifdef UNI-APP-X && APP
// export * from './uvue'
export { raf, doubleRaf, cancelRaf } from './uvue'
// #endif


// #ifndef UNI-APP-X && APP
// export * from './vue'
export { raf, doubleRaf, cancelRaf } from './vue'
// #endif
