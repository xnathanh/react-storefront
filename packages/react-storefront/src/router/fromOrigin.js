/**
 * @license
 * Copyright © 2017-2018 Moov Corporation.  All rights reserved.
 */

import transformParams from './transformParams'
import proxyUpstream from './proxyUpstream'

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

  if (process.env.MOOV_ENV === 'development') {
    // perfect proxy in development since we have no CDN
    return proxyUpstream()
  }

  return {
    type,
    runOn,
    config: () => config,
    transformPath: path => {
      return {
        type,
        runOn,
        config: routePath => {
          config.proxy.rewrite_path_regex = transformParams(routePath, path)
          return config
        },
        fn
      }
    },
    fn
  }
}
