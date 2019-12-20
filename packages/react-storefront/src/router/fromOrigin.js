/**
 * @license
 * Copyright © 2017-2018 Moov Corporation.  All rights reserved.
 */

import transformParams from './transformParams'
import proxyUpstream from './proxyUpstream'

export default function fromOrigin(alternative_backend = 'origin') {
  const type = 'fromOrigin'

  const config = {
    proxy: {
      alternative_backend
    }
  }

  const result = {
    ...proxyUpstream(),
    type,
    config: () => config
  }

  result.transformPath = path => ({
    ...result,
    config: routePath => {
      config.proxy.rewrite_path_regex = transformParams(routePath, path)
      return config
    }
  })

  return result
}
