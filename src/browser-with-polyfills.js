import { polyfill as promisePolyfill } from 'es6-promise';
import browser from './browser';

promisePolyfill();

export default browser;