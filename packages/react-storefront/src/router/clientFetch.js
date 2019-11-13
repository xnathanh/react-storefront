import getAPIVersion from './getAPIVersion'
import { REACT_STOREFRONT, API_VERSION } from './headers'

export default function clientFetch(url, options = {}) {
  options = {
    ...options,
    headers: {
      ...(options.headers || {}),
      [REACT_STOREFRONT]: 'true', // allows back end handlers to quickly identify PWA API requests,
      [API_VERSION]: getAPIVersion() // needed for the service worker to determine the correct runtime cache name and ensure that we're not getting a cached response from a previous api version
    }
  }

  console.log('fetch', url, options)
  return require('isomorphic-unfetch')(url, options)
}

export function patchBroweserFetch() {
  if (typeof window !== 'undefined') {
    window.fetch = clientFetch
  }
}
