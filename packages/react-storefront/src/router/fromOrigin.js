/**
 * @license
 * Copyright © 2017-2018 Moov Corporation.  All rights reserved.
 */

import transformParams from './transformParams'

async function fn(params, request, response) {
  throw new Error('fromOrigin is only supported when running in the Moovweb XDN.')
}

export default function fromOrigin(backend = 'origin') {
  const type = 'fromOrigin'
  const config = {
    proxy: {
      backend
    }
  }
  const runOn = { server: true, client: false }

  let hostHeader = null
  let transformPath = null

  const build = () => {
    return {
      type,
      runOn,
      config: routePath => {
        if (transformPath && routePath) {
          config.proxy.rewrite_path_regex = transformParams(routePath, transformPath)
        }
        return config
      },
      hostHeader,
      withHostHeader: header => {
        hostHeader = header
        return build()
      },
      transformPath: path => {
        transformPath = path
        return build()
      },
      fn
    }
  }

  return build()
}
