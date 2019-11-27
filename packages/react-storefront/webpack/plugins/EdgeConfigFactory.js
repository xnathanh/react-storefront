/**
 * @license
 * Copyright © 2017-2018 Moov Corporation.  All rights reserved.
 */

const RegexpVisitor = require('route-parser/lib/route/visitors/regexp')
const get = require('lodash/get')

/**
 * Creates an outer edge manager config for a React Storefront router
 */
module.exports = class EdgeConfigFactory {
  /**
   * @param {Router} router An instance of React Storefront's router
   */
  constructor(router) {
    this.routes = router.routes
    this.fallbackHandlers = router.fallbackHandlers
  }

  /**
   * Creates the config for outer edge manager
   */
  createConfig() {
    const custom_cache_keys = []
    const request_router = []
    const response_router = []
    const matchEdgeHandlers = ({ type }) => ['fromOrigin', 'redirectTo'].includes(type)

    this.routes.concat({ handlers: this.fallbackHandlers }).forEach(route => {
      const edgeHandler = route.handlers.find(matchEdgeHandlers)
      const cache = route.handlers.find(handler => handler.type === 'cache')
      const path_regex = this.routeToRegex(route)
      const spec = get(route, 'path.spec', '__fallback__')
      const notes = `rsf: ${spec}`

      if (edgeHandler) {
        request_router.push({ notes, path_regex, ...edgeHandler.config(route.path) })

        if (cache && cache.edge && cache.edge.maxAgeSeconds) {
          response_router.push({ notes, path_regex, ttl: `${cache.edge.maxAgeSeconds}s` })
        }
      } else {
        request_router.push({ notes, path_regex, proxy: { backend: 'moov' } })
      }

      if (cache && cache.edge && cache.edge.key) {
        custom_cache_keys.push({ notes, path_regex, ...cache.edge.key.toJSON() })
      } else {
        custom_cache_keys.push({ notes, path_regex })
      }
    })

    return {
      custom_cache_keys,
      backends: {
        moov: {
          request_router,
          response_router
        }
      }
    }
  }

  /**
   * Gets the regular expression for the specified route
   * @private
   * @param {Object} route
   */
  routeToRegex(route) {
    if (route.path) {
      return RegexpVisitor.visit(route.path.ast).re.source.replace(/\\\//g, '/')
    } else {
      return '.'
    }
  }
}
