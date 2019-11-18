/**
 * @license
 * Copyright © 2017-2018 Moov Corporation.  All rights reserved.
 */

/**
 * Sets the correct response headers to configure browser and server caching
 * @param {Object} options
 * @param {Number} options.serverMaxAge The max age in seconds for edge caches.
 * @param {Number} options.serverStaleWhileRevalidate The time in seconds before revalidation for edge caches.
 * @param {Number} options.browserMaxAge The TTL for the browser's cache
 */
export function cache({ serverMaxAge, serverStaleWhileRevalidate, browserMaxAge }) {
  const cacheControl = []

  if (browserMaxAge === 0) {
    cacheControl.push('private, no-store, no-cache')
  } else if (browserMaxAge != null) {
    cacheControl.push(`max-age=${browserMaxAge}`)
  }

  const serverHeaders = []

  if (serverMaxAge) {
    serverHeaders.push(`max-age=${serverMaxAge}`)
  }

  if (serverStaleWhileRevalidate) {
    serverHeaders.push(`stale-while-revalidate=${serverStaleWhileRevalidate}`)
  }

  if (serverHeaders.length) {
    // remove these headers so varnish caching works correctly
    headers.removeAllHeaders('Age')
    headers.removeAllHeaders('Via')
    headers.removeAllHeaders('Expires')
    headers.header('X-Moov-Cache', 'true')
    headers.header('x-moov-cache-control', serverHeaders.join(', '))
  }

  if (cacheControl.length) {
    headers.header('Cache-Control', cacheControl.join(', '))
  }
}

/**
 * Sets a cache time of one day for all image and font assets which are proxied from upstream.
 * @param {String} pathname
 */
export function cacheProxiedAssets(pathname, { serverMaxAge }) {
  if (pathname.match(/(jpeg|jpg|png|gif|svg|woff2?|ttf|otf)$/)) {
    cache({ serverMaxAge })
  }
}

/**
 * The TTL for far-future cached assets
 */
export const FAR_FUTURE = 290304000

/**
 * The number of seconds in a day
 */
export const ONE_DAY = 86400
