const traverse = require('@babel/traverse').default;
const t = require('@babel/types');
const template = require('@babel/template').default;
const { parse, print } = require('recast');
var fs = require('fs');

function runBabelPlugin({ filePath, babelPlugin, options = {} }) {
  try {
    const source = fs.readFileSync(filePath, { encoding: 'utf8' });
    const ast = parse(source, {
      parser: {
        parse(source, options) {
          // Notes: the provided Typescript parser doesn't handle JSX (just flow),
          // so we need to add this code to get both
          const babelOptions = require('recast/parsers/_babel_options').default(
            options
          );
          babelOptions.plugins.push('jsx', 'typescript');
          return require('@babel/parser').parse(source, babelOptions);
        },
      },
    });
    traverse(ast, babelPlugin({ types: t, template }, options).visitor);
    const { code: output } = print(ast);
    if (options.isDryRun !== true) {
      fs.writeFileSync(filePath, output, { encoding: 'utf8' });
    }

    if (output !== source) {
      return { hasChanged: true };
    }
  } catch (e) {
    console.error('Error in ' + filePath);
    console.error(e);
    return { hasError: true };
  }
  return {};
}

module.exports = runBabelPlugin;
