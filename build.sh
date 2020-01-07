#!/bin/bash

declare __USAGE="Usage: $0 [OPTIONS]

Options:
    -m(chrome|firefox|opera)    Specify target manifest
                                (default: chrome).
    -d=<PATH>                   Distribution path (default: dist).
    -h                          Show command help."

declare DISTRIBUTION_TYPE="chrome";
declare DISTRIBUTION_PATH="dist";

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
    esac;
done;


sass() (
    _is_project_dir() {
        ls -A | grep "package.json" -q
    }

    _does_npm_exist() {
        [[ ! -d npm ]];
        return $?;
    }

    _is_sass_installed() {
        if _is_project_dir; then
            [[ -f node_modules/node-sass/bin/node-sass ]];
            return $?;
        else
            [[ -d node-sass ]];
            return 0;
        fi;
    }

    if ! _is_sass_installed; then
        if _does_npm_exist; then
            if _is_project_dir; then
                npm install --save-dev node-sass;
            else
                npm install -g node-sass;
            fi;
        else
            echo "npm is not installed and node-sass does not exist in the PATH either in the node_modules/node-sass/bin folder. aborting.";
            return;
        fi;
    fi;

    if _is_project_dir; then
        node_modules/node-sass/bin/node-sass $*;
        return $?;
    else
        node-sass $*;
        return $?;
    fi;
)


manifest() (
    manif-get() {
        echo "assets/manifests/$DISTRIBUTION_TYPE.json";
    }

    cp "$(manif-get)" $*;
)

sass --output "$DISTRIBUTION_PATH" "src/scss/dimcloud.scss";
manifest "$DISTRIBUTION_PATH/manifest.json";
