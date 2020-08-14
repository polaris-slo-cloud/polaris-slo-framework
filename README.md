# SLOC

Repository for the SLOC Futurewei project.

This is a polyglot monorepository.
All our SLOC code (including all libraries), in all used programming languages, is contained in this repository.
The root folder contains one subfolder for each used programming language.

**Note:** Due to issues with the gopls language server (https://github.com/golang/vscode-go/issues/275, https://github.com/golang/go/issues/32394, https://github.com/golang/go/issues/36899) the VS Code Go extension will report an error (`go: cannot find main module, but found .git/config`) when opening the root folder of the repository.
Until these errors are fixed, it is recommended to use a language's folder (e.g., `golang` or `ts`) as the workspace's root (i.e., open VS Code in the respective folder) or to use VS Code's multiroot workspace feature.
