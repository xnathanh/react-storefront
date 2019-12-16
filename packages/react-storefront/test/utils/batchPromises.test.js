import batchPromises from '../../src/utils/batchPromises'

describe('batchPromises', () => {
  it('should call the fn with all supplied inputs', async () => {
    const resolved = []
    const inputs = [100, 200, 200, 100, 100, 100, 200, 200, 100, 1, 1, 1, 200, 100]

    await batchPromises(7, inputs, input => {
      return new Promise((resolve, reject) => {
        setTimeout(() => {
          resolved.push(input)
          resolve()
        }, input)
      })
    })

    expect(inputs.length).toBe(resolved.length)
  })
})
