const whitelisted = ['require', 'inject', 'withStyles', undefined]

module.exports = {
  meta: {
    messages: {
      moduleScopeCall:
        "Function called in module scope may introduce overhead on all requests: {{name}}'"
    }
  },
  create(context) {
    return {
      CallExpression(node) {
        if (context.getScope().type === 'module' && whitelisted.indexOf(node.callee.name) === -1) {
          context.report({
            node,
            messageId: 'moduleScopeCall',
            data: {
              name: node.callee.name
            }
          })
        }
      }
    }
  }
}
