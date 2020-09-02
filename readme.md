# Run babel plugins as codemods

Tool to run babel plugins as a codemod of your codebase.

## Motivation

Minimalistic runner that run your Babel plugins as codemods.  
Use `recast` under the wood.  
Supports Typescript and JSX

## Example

```
  yarn start -p path/to/your/babel/plugin.js -d path/to/your/target/directory
```

**CLI Options**

- **-h** or **-help**  
  Help
- **-dry-run**  
  The script is run, but your files aren't modified.  
  
  A good way to check if the script blows up (and where) on your codebase.
- **-f** _path_  
  Path of the file to run the script on
- **-d** _path_  
  Path of the directory to run the script on.  
  The script will be run recursively on all files and folders contains in this folders, except for a few exceptions (`node_modules`, `.git`, `public`, `temp`, ...)
