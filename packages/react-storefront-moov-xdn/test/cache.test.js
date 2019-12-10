import { cache } from '../src/cache'

describe('cache', () => {
  beforeEach(() => {
    global.headers = {
      header: jest.fn(),
      removeAllHeaders: jest.fn()
    }
  })

  afterEach(() => {
    delete global.headers
  })

  it('should send no-cache when browserMaxAge is 0', () => {
    cache({ browserMaxAge: 0 })
    expect(global.headers.header).toHaveBeenCalledWith(
      'Cache-Control',
      'private, no-store, no-cache'
    )
  })

  it('should send maxage when browserMaxAge is greater than 0', () => {
    cache({ browserMaxAge: 300 })
    expect(global.headers.header).toHaveBeenCalledWith('Cache-Control', 'max-age=300')
  })

  it('should send no cache-control header when neither browserMaxAge or serverMaxAge is specified', () => {
    cache({})
    expect(global.headers.header).not.toHaveBeenCalled()
  })

  it('should send x-moov-cache-control with max-age when serverMaxAge is greater than 0', () => {
    cache({ serverMaxAge: 300 })
    expect(global.headers.header).toHaveBeenCalledWith('x-moov-cache-control', 'max-age=300')
  })

  it('should send x-moov-cache-control with stale-while-revalidate when serverMaxAge is greater than 0', () => {
    cache({ serverStaleWhileRevalidate: 300 })
    expect(global.headers.header).toHaveBeenCalledWith(
      'x-moov-cache-control',
      'stale-while-revalidate=300'
    )
  })

  it('should send x-moov-cache-control with stale-while-revalidate and max-age when both are greater than 0', () => {
    cache({ serverMaxAge: 1000, serverStaleWhileRevalidate: 300 })
    expect(global.headers.header).toHaveBeenCalledWith(
      'x-moov-cache-control',
      'max-age=1000, stale-while-revalidate=300'
    )
  })

  it('should not send s-maxage when serverMaxAge is 0', () => {
    cache({ serverMaxAge: 0 })
    expect(global.headers.header).not.toHaveBeenCalled()
  })

  it('should not send no-cache when serverMaxAge is 0 and browserMaxAge is 0', () => {
    cache({ serverMaxAge: 0, browserMaxAge: 0 })
    expect(global.headers.header).toHaveBeenCalledWith(
      'Cache-Control',
      'private, no-store, no-cache'
    )
  })
})
