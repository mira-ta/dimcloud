#!/bin/sh

__USAGE="Usage: $0 [OPTIONS]

Options:
    -m(chrome|firefox|opera)    Specify target manifest
                                (default: chrome).
    -d=<PATH>                   Distribution path (default: dist).
    -h                          Show command help.
    -F                          Do npm install before executing.
    -f, --force                 Do npm install from current package.json (npm install)"

DISTRIBUTION_TYPE="chrome";
DISTRIBUTION_PATH="dist";

DO_NPM="_t0";
# _t0 - Do not
# _t1 - npm install
# _t2 - npm install <specified packages>

for argument in $@; do
    case $argument in
        -m*)
            # erase -t
            DISTRIBUTION_TYPE="${argument#-m}";
            shift;;
        -d=*)
            DISTRIBUTION_PATH="${argument#-d=}";
            shift;;
        -h)
            echo "$__USAGE";
            exit;;
        -f|--force)
            DO_NPM=_t1;
            shift;;
        -F)
            DO_NPM=_t2;
            shift;;
    esac;
done;

if ! ls -A | grep "package.json" -q; then
    echo "Not in a project directory (no package.json file found). Aborting.";
    exit;
fi;


npm_() {
    if [ $DO_NPM = _t0 ]; then
        return 1;
    else
        if [ -d npm ]; then
            echo "npm is not installed in the system.";
            return -1;
        fi;

        case $DO_NPM in
            _t1)
                npm install;
                return $?;;
            _t2)
                npm install $*;
                return $?;;
        esac;
    fi;
}

npm_ --save-dev @babel/core @babel/preset-env @babel/cli babel-preset-minify node-sass

sass() (
    node_modules/node-sass/bin/node-sass $*;
)

manifest() (
    cp "assets/manifests/$DISTRIBUTION_TYPE.json" $*;
)

assets() (
    cp assets/dimlogo.png "$*/dimlogo.png";
)

js() {
    node node_modules/@babel/cli/bin/babel.js $*;
}

js -d "$DISTRIBUTION_PATH" --quiet --no-babelrc "src/js/content.js" --no-comments --presets minify;
sass -q --output-style compressed --output "$DISTRIBUTION_PATH" "src/scss/dimcloud.scss";
manifest "$DISTRIBUTION_PATH/manifest.json";
assets "$DISTRIBUTION_PATH"