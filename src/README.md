# `/src` How is it organized?

| Directory | Suppose |
| - | - |
| **assets** | Contains manifests and image stuff; must be copied while building. |
| **assets/manifests** | Browser manifests. Being chosen in building script. |
| **js** | Mainly just content script. |
| **scss** | SCSS source, build withs script to a specified folder. By default is the same directory. |

## Script

```sh
# build the extension into `./dist` folder.
./build.sh
```

```sh
# to get help
./build.sh -h
```

```sh
# to pass type of build
#              -t=                         -d=
./build.sh --type=chrome|firefox|opera --dist=path 
```