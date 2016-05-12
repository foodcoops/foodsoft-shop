// Global configuration

// replaced by webpack
export const isDev = !process.env.NODE_ENV || process.env.NODE_ENV === 'development';
export const appName = process.env.APP_NAME;
export const appVersion = process.env.APP_VERSION;

// configurable on global window object
export const foodsoftUrl = window.foodsoftUrl || (isDev ? 'http://localhost:3000/f' : undefined);
export const foodsoftClientId = window.foodsoftClientId || '-- please set window.foodsoftClientId --';
