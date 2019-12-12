import requestContext from './requestContext'

const wrap = (wrapped, fn) => {
  return (...args) => {
    fn()
    return wrapped(...args)
  }
}

fns.init$ = wrap(fns.init$, () => requestContext.set('synthetic', true))
