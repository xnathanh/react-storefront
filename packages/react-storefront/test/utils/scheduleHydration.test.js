import scheduleHydration from '../../src/utils/scheduleHydration'

describe('scheduleHydration', () => {
  beforeAll(() => {
    Object.defineProperty(document, 'readyState', {
      get() {
        return 'loading'
      }
    })
  })
  it('should not delay', () => {
    const fn = jest.fn()
    scheduleHydration(undefined, undefined, fn)
    expect(fn).toHaveBeenCalled()
  })
  it('should hydrate after load when delayed', done => {
    const fn = jest.fn()
    scheduleHydration(true, undefined, fn)
    window.dispatchEvent(new Event('load'))
    expect(fn).toHaveBeenCalled()
    done()
  })
  it('should additionally delay hydration after load', done => {
    const fn = jest.fn()
    scheduleHydration(true, 100, fn)
    window.dispatchEvent(new Event('load'))
    expect(fn).not.toHaveBeenCalled()
    setTimeout(() => {
      expect(fn).toHaveBeenCalled()
      done()
    }, 150)
  })
})
