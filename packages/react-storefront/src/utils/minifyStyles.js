/**
 * @license
 * Copyright © 2017-2019 Moov Corporation.  All rights reserved.
 */

/**
 * This used to use clean-css to minify styles, but we found that it had a really slow
 * initialization time that added significantly to server sync js times (wp).  So we removed
 * it, but left this stub in case anything was calling it.
 */
export default async function minifyStyles(css) {
  return css
}
