/**
 * @param {grunt.IConfigComponents} grunt
 */
module.exports = function (grunt) {
    grunt.initConfig({
        pkg: grunt.file.readJSON("package.json"),

        sass: {
            options: {
                style: "minified",
                implementation: require("node-sass")
            },
            dist: {
                files: {
                    "dist/main.css": "dimcloud.styles/dimcloud.scss"
                }
            }
        },

        webpack: {
            myconfig: require("./webpack.config")
        },

        copy: {
            main: {
                expand: true,
                flatten: true,
                src: "dimcloud.manifests/*",
                dest: "dist/"
            }
        },

        clean: {
            build: [
                "dist/*"
            ]
        }
    });

    grunt.loadNpmTasks("grunt-webpack");
    grunt.loadNpmTasks("grunt-sass");
    grunt.loadNpmTasks("grunt-contrib-copy");
    grunt.loadNpmTasks("grunt-contrib-clean");

    grunt.registerTask("default", ["clean", "sass", "copy", "webpack"])
}
