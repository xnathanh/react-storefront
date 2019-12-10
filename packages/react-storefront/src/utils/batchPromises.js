/**
 * @license
 * Copyright © 2017-2019 Moov Corporation.  All rights reserved.
 */
import PQueue from 'p-queue'

/**
 * @param {*} batchSize The number of promises to run concurrently
 * @param {*} thenArr
 * @param {*} fn
 */
export default function(batchSize, thenArr, fn) {
  const queue = new PQueue({ concurrency: batchSize })
  return queue.addAll(thenArr.map(i => () => fn(i)))
}
