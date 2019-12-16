/**
 * @license
 * Copyright © 2017-2019 Moov Corporation.  All rights reserved.
 */
/**
 * Schedules hydration based on the specified options
 * @param {Boolean} options.delayHydrationUntilPageLoad If `true` hydration will not occur until the window load event.  This helps improve initial page load time, especially largest image render.
 * @param {Function} delayHydrationUntilPageLoad A function that hydrates the react app
 */
export default function scheduleHydration(delayHydrationUntilPageLoad, additionalDelay, hydrate) {
  if (delayHydrationUntilPageLoad && document.readyState !== 'complete') {
    let doHydrate = hydrate

    if (additionalDelay) {
      doHydrate = () => setTimeout(hydrate, additionalDelay)
    }

    return window.addEventListener('load', doHydrate, { once: true })
  } else {
    hydrate()
  }
}
