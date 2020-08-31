module.exports = function (babel) {
  const { types: t } = babel
  const importSet = new Set()
  const importNodes = []
  return {
    name: 'ast-transform', // not required
    visitor: {
      Program: {
        exit(path) {
          if (importSet.size === 0) return
          const imports = Array.from(importSet)
          const importSpecifiers = imports.map(imp => {
            const identifier = t.identifier(imp)
            return t.importSpecifier(identifier, identifier)
          })
          const wineryImportDeclaration = t.importDeclaration(
            importSpecifiers,
            t.stringLiteral('@xingternal/winery')
          )
          importNodes.forEach((node, index) => {
            if (index === 0) node.replaceWith(wineryImportDeclaration)
            else node.remove()
          })
        },
      },
      ImportDeclaration(path) {
        if (path.node.source.value.startsWith('@xingternal/winery')) {
          const importedNames = path.node.specifiers.map(
            specifier => specifier.imported.name
          )
          importedNames.forEach(name => importSet.add(name))
          importNodes.push(path)
        }
      },
    },
  }
}
