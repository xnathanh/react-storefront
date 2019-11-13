/**
 * @license
 * Copyright © 2017-2019 Moov Corporation.  All rights reserved.
 */
import getAPIVersion from './getAPIVersion'
import { REACT_STOREFRONT, API_VERSION } from './headers'

/**
 * The standard fetch with two additional headers:
 *
 * REACT_STOREFRONT - allows moovweb xdn logging to track that the request came from react-storefront
 * API_VERSION - required by the service worker's bootstrap.js to fulfill a request from the cache.
 *
 * @param {String} url
 * @param {Object} options
 * @return {Promise}
 */
export default function versionedFetch(url, options = {}) {
  options = {
    ...options,
    headers: {
      ...(options.headers || {}),
      [REACT_STOREFRONT]: 'true', // allows back end handlers to quickly identify PWA API requests,
      [API_VERSION]: getAPIVersion() // needed for the service worker to determine the correct runtime cache name and ensure that we're not getting a cached response from a previous api version
    }
  }
  return require('isomorphic-unfetch')(url, options)
}

/**
 * Overrides `window.fetch` to use `versionedFetch`.
 */
export function patchBroweserFetch() {
  if (typeof window !== 'undefined') {
    window.fetch = versionedFetch
  }
}
