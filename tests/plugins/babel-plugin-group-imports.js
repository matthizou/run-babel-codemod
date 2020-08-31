const IMPORT = "@xingternal/winery";

module.exports = function (babel) {
  const { types: t } = babel;
  const importMap = new Map();
  const importNodes = [];
  return {
    name: "ast-transform", // not required
    visitor: {
      Program: {
        exit(path) {
          if (importMap.size === 0) return;

          const importSpecifiers = Array.from(importMap)
            .sort((a, b) => (a[0] > b[0] ? 1 : -1))
            .map(([name, { alias }]) => {
              const identifier = t.identifier(name);
              if (alias) {
                return t.importSpecifier(t.identifier(alias), identifier);
              }
              return t.importSpecifier(identifier, identifier);
            });

          const wineryImportDeclaration = t.importDeclaration(
            importSpecifiers,
            t.stringLiteral(IMPORT)
          );
          importNodes.forEach((node, index) => {
            if (index === 0) node.replaceWith(wineryImportDeclaration);
            else node.remove();
          });
        }
      },
      ImportDeclaration(path) {
        if (path.node.source.value.startsWith(IMPORT)) {
          const specifiers = path.node.specifiers.map((specifier) => ({
            name: specifier.imported.name,
            alias: specifier.local.name
          }));
          specifiers.forEach((specifier) => importMap.set(specifier.name, specifier));
          importNodes.push(path);
        }
      }
    }
  };
}
