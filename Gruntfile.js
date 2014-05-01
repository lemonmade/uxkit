module.exports = function(grunt) {

    // 1. CONFIG
    grunt.initConfig({
        pkg: grunt.file.readJSON("package.json"),

        jshint: {
            options: {
                reporter: require("jshint-stylish"),

                globals: {
                    console:    true,
                    $:          true,
                    jQuery:     true,
                }
            },

            target: ["src/springs.js"]
        },

        uglify: {
            build: {
                src: "src/springs.js",
                dest: "dist/springs.min.js"
            }
        },

        concat: {
            options: {
                stripBanners: true,
                banner: "// <%= pkg.name %> - v<%= pkg.version %> - " +
                        "<%= grunt.template.today(\"yyyy.mm.dd\") %>\n\n\n",
                separator: "\n\n\n// -----\n\n\n"
            },

            springs: {
                // src: [
                //     "src/helpers.scss",
                //     "src/springs.scss"
                // ],
                // dest: "dist/springs.scss"
            }
        },

        sass: {
            dist: {
                options: {
                    style: "expanded",
                    loadPath: "src/"
                },

                files: {
                    "test/test.css": "test/test.scss"
                }
            },

            components: {
                options: {
                    style: "expanded",
                    loadPath: "src/"
                },

                files: [{
                    expand: true,
                    cwd: "src",
                    src: ["components/**/*.scss"],
                    dest: "dist",
                    ext: ".css"
                }]
            }
        },

        autoprefixer: {
            dist: {
                files: {
                    "test/test.css": "test/test.css"
                }
            },

            components: {
                files: [{
                    expand: true,
                    cwd: "dist/components",
                    src: ["*/*.css"],
                    dest: "dist/components",
                    ext: ".css"
                }]
            }
        },

        watch: {
            options: { livereload: false },

            js: {
                files: ["src/springs.js"],
                tasks: ["uglify", "jshint", "shell"],
                options: { spawn: false }
            },

            scss: {
                files: ["src/**/*.scss", "test/**/*.scss"],
                tasks: ["concat", "sass", "shell", "autoprefixer"],
                options: { spawn: false }
            },

            css: {
                files: ["dist/**/*.css", "test/**/*.css"],
                tasks: ["autoprefixer"],
                options: { spawn: false }
            },

            html: {
                files: ["src/**/*.html"],
                tasks: ["shell"],
                options: { spawn: false }
            }
        },

        shell: {
            copyMain: {
                command: [
                    "cp src/springs.js dist/springs.js",
                    "cp src/springs.scss dist/springs.scss",
                    "rsync -av src/components/ dist/components/"
                ].join("&&")
            }
        }
    });

    // 2. TASKS
    require("load-grunt-tasks")(grunt);

    // 3. PERFORM
    grunt.registerTask("default", ["jshint", "sass", "autoprefixer", "uglify", "concat", "shell"]);

}