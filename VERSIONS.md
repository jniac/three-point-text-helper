## 1.0.10:
- disabling mipmaps
- update to three 0.164.1 (no more "XxxBufferGeometry")
  - update tests (vanilla, typescript / webpack)
- update other dev dependencies (rollup, webpack, canvas...)

## 1.0.9: 
- enable "alpha discard" when using the "NormalBlending" (fix the z-depth issue).

## 1.0.8:
- enable "NormalBlending" (with a "graphic bug": no z-sorting because no use of 
  the z-depth buffer on transparent shaders)
