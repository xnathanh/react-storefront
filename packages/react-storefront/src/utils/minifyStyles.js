/**
 * @license
 * Copyright © 2017-2019 Moov Corporation.  All rights reserved.
 */

/**
 * Add prefixes and minify given CSS
 */
export default async function minifyStyles(css) {
  const postcss = require('postcss')
  const autoprefixer = require('autoprefixer')
  const CleanCSS = require('clean-css')
  const prefixer = postcss([autoprefixer])
  const cleanCSS = new CleanCSS()
  const prefixed = await prefixer.process(css, { from: undefined })
  return cleanCSS.minify(prefixed.css).styles
}
