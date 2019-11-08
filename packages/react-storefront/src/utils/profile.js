/**
 * @license
 * Copyright © 2017-2019 Moov Corporation.  All rights reserved.
 */
export default async function profile(header, cb) {
  const start = new Date().getTime()
  const result = await cb()
  const end = new Date().getTime()

  if (env.rsf_response) {
    env.rsf_response.set(header, end - start)
  }

  console.log(header, end - start)
  return result
}

global.profile = profile
