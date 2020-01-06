#!/bin/bash

for argument in $@; do
    case $argument in
        -d=*|--dist=*)
            DISTRIBUTION_PATH="${argument#*=}";
            shift;;
        -t=*|--type=*)
            DISTRIBUTION_TYPE="${argument#*=}";
            shift;;
        -h|--help)
            echo \
"Usage: ${0} [OPTIONS]

Options:
    -d=<PATH>, --dist=<PATH>    Put distribution package into
                                specified folder (default: \"dist\").
    -t=<TYPE>, --type=<TYPE>    Type of package: chrome, opera, firefox
                                (default: chrome).
    -h, --help                  Show help info.
";
            exit;;
    esac;
done;

if [[ -z "$DISTRIBUTION_PATH" ]]; then
    DISTRIBUTION_PATH="dist";
fi;

if [[ -z "$DISTRIBUTION_TYPE" ]]; then
    DISTRIBUTION_TYPE="chrome";
fi;


# Get current manifests in the folder
function ls-manif {
    if [[ -z "$1" ]]; then
        ls src/assets/manifests -A1
    else
        ls $1 -A1
    fi | grep -P ".json$" | gawk '{ print "src/assets/manifests/" $1 }';
}

function cp-manif {
    if [[ -z "$1" ]]; then
        echo "No type of manifest given.";
    elif [[ -z "$2" ]]; then
        echo "No distribution path given.";
    fi;

    cp $(ls-manif | grep "$1\.json" -P) "$2/manifest.json"
}

function bd-sass {
    if [[ -z "$1" ]]; then
        echo "No input sass/scss file given.";
    elif [[ -z "$2" ]]; then
        echo "No distribution path given.";
    fi;

    node_modules/node-sass/bin/node-sass --output-style compressed "$1" --output "$2" -q
}


# build manifest
mkdir -p "$DISTRIBUTION_PATH";
cp-manif "$DISTRIBUTION_TYPE" "$DISTRIBUTION_PATH";

# build sass
bd-sass "src/scss/dimcloud.scss" "$DISTRIBUTION_PATH";

# copy js
cp "src/js/content.js" "dist/content.js";

# copy icons
ls src/assets -pA | grep "\\.(png|jpg|jpeg)" -P | gawk '{ print "src/assets/"$1" dist/"$1 }' | xargs cp