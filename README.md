# Point Text Helper
"Point Text" Helper for ThreeJS

<a href="https://jniac.github.io/three-point-text-helper/tests/examples/dist/vertices/">
<p align="center">
  <img width="600px" src="screenshots/vertices.jpg">
<p>
<p align="center">
  some texts
</p>
</a>

<a href="https://jniac.github.io/three-point-text-helper/tests/examples/dist/vertices-stress/">
<p align="center">
  <img width="600px" src="screenshots/vertices-stress.jpg">
<p>
<p align="center">
  a lot of texts (37212)
</p>
</a>


## scripts
```shell
npm run generate-atlas
```

compile:
```
tsc
```

## Run the tests/examples
2 process required for the time being:
- run the library itself + static server
```shell
npm run dev
# (equivalent to)
ts-node extras/dev.ts
```
- webpack
```
cd tests/examples
webpack --watch
```


## Documentation, references...

how to use three in typescript?  
https://gist.github.com/mattdesl/06d056f10322532e6e07bc97ef91b557

test npm package without publishing  
https://medium.com/@vcarl/problems-with-npm-link-and-an-alternative-4dbdd3e66811

