// @ts-nocheck
// #ifdef WEB
export const isBrowser = typeof window !== 'undefined';
// #endif

// #ifndef WEB
export const isBrowser = false;
// #endif