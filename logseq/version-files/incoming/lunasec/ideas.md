
- using [semgrep](https://semgrep.dev/) to filter out dependencies that have never been called in code
- write [snyk lockfile parser](https://github.com/lunasec-io/nodejs-lockfile-parser) as a go module to be used by a [syft cataloger](https://github.com/anchore/syft/blob/caff67289aead9a0ed1ec05c8534c3c440669e42/syft/pkg/cataloger/javascript/parse_package_lock.go)
	- this [golang graph package](https://pkg.go.dev/github.com/yourbasic/graph#Acyclic) might help
- currently the [inserting of a parsed package lock](https://github.com/lunasec-io/lunasec/blob/master/lunatrace/bsl/backend/src/snapshot/node-package-tree.ts#L168) takes a long time, this could be optimized with an sql query formatted using a library like [zapatos](https://jawj.github.io/zapatos/#how-do-i-get-it)
- for testing, a [local git server](https://gabrielcsapo.github.io/node-git-server/docs/intro/) could be helpful to avoid calling into github