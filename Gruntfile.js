module.exports = function(grunt) {

    // 1. CONFIG
    grunt.initConfig({
        pkg: grunt.file.readJSON("package.json"),

        jasmine: {
            messageBubble: {
                src: "dist/components/message-bubble/message-bubble.js",
                options: {
                    specs: "spec/message-bubble-spec.js",
                    vendor: [
                        "bower_components/jquery/dist/jquery.js",
                        "bower_components/jasmine-jquery/lib/jasmine-jquery.js"
                    ],
                    helpers: "spec/helpers/message-bubble-helpers.js",
                    styles: "dist/components/message-bubble/message-bubble.css"
                }
            },

            toggleSwitch: {
                src: "dist/components/toggle-switch/toggle-switch.js",
                options: {
                    specs: "spec/toggle-switch-spec.js",
                    vendor: [
                        "bower_components/jquery/dist/jquery.js",
                        "bower_components/jasmine-jquery/lib/jasmine-jquery.js"
                    ],
                    helpers: "spec/helpers/toggle-switch-helpers.js",
                    styles: "dist/components/toggle-switch/toggle-switch.css"
                }
            },

            options: {
                "--web-security" : false,
                "--local-to-remote-url-access" : true,
                "--ignore-ssl-errors" : true
            }
        },

        coffee: {
            build: {
                src: "src/springs.coffee",
                dest: "dist/springs.js"
            },

            tests: {
                files: [{
                    expand: true,
                    cwd: "spec",
                    src: ["**/*.coffee"],
                    dest: "spec",
                    ext: ".js"
                }]
            },

            components: {
                files: [{
                    expand: true,
                    cwd: "src",
                    src: ["components/**/*.coffee"],
                    dest: "dist",
                    ext: ".js"
                }]
            }
        },

        uglify: {
            build: {
                src: "dist/springs.js",
                dest: "dist/springs.min.js"
            },

            components: {
                files: [{
                    expand: true,
                    cwd: "dist",
                    src: ["components/**/*.js"],
                    dest: "dist",
                    ext: ".min.js"
                }]
            }
        },

        concat: {
            options: {
                stripBanners: true,
                banner: "// <%= pkg.name %> - v<%= pkg.version %> - " +
                        "<%= grunt.template.today(\"yyyy.mm.dd\") %>\n\n\n",
                separator: "\n\n\n// -----\n\n\n"
            },

            // js: {
            //     src: "src/*.js",
            //     dest: "dist/springs.js"
            // },

            springs: {
                src: [
                    "src/helpers.scss",
                    "src/springs.scss"
                ],
                dest: "dist/springs.scss"
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

        csscss: {
            options: {
                ignoreSassMixins: true
            },

            dist: {
                src: ["scss/**/*.scss"]
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

        compare_size: {
            files: [
                "dist/*.js",
                "dist/components/*.js"
            ]
        },

        watch: {
            options: { livereload: false },

            js: {
                files: ["dist/**/*.js"],
                tasks: ["concat", "shell"],
                options: { spawn: false }
            },

            coffee: {
                files: ["src/**/*.coffee"],
                tasks: ["coffee:components", "coffee:build"]
            },

            coffeeSpecs: {
                files: "spec/**/*.coffee",
                tasks: ["coffee:tests"],
                options: { spawn: false }
            },

            jsSpecs: {
                files: "spec/**/*.js",
                tasks: ["jasmine"],
                options: { spawn: false }
            },

            scss: {
                files: ["src/**/*.scss", "test/**/*.scss"],
                tasks: ["concat", "sass", "autoprefixer", "csscss", "shell"],
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
                    // "cp src/springs.js dist/springs.js",
                    // "cp src/springs.scss dist/springs.scss",
                    "rsync -av src/components/ dist/components/"
                ].join("&&")
            }
        }
    });

    // 2. TASKS
    require("load-grunt-tasks")(grunt);

    // 3. PERFORM
    grunt.registerTask("default", ["coffee:build", "coffee:components", "concat", "sass", "autoprefixer", "csscss", "uglify", "compare_size", "shell"]);
    grunt.registerTask("tests", ["coffee:tests", "jasmine"]);
    grunt.registerTask("full", ["coffee", "jasmine", "concat", "sass", "autoprefixer", "csscss", "uglify", "compare_size", "shell"]);

}