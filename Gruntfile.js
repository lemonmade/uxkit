module.exports = function(grunt) {

    // 1. CONFIG
    grunt.initConfig({
        pkg: grunt.file.readJSON("package.json"),

        jasmine: {
            messageBubble: {
                src: "dist/components/message-bubble/message-bubble.js",
                options: {
                    specs: "spec/specs-js/message-bubble-spec.js",
                    vendor: [
                        "bower_components/jquery/dist/jquery.js",
                        "bower_components/jasmine-jquery/lib/jasmine-jquery.js"
                    ],
                    helpers: "spec/helpers-js/message-bubble-helpers.js",
                    styles: "dist/components/message-bubble/message-bubble.css"
                }
            },

            toggleSwitch: {
                src: "dist/components/toggle-switch/toggle-switch.js",
                options: {
                    specs: "spec/specs-js/toggle-switch-spec.js",
                    vendor: [
                        "bower_components/jquery/dist/jquery.js",
                        "bower_components/jasmine-jquery/lib/jasmine-jquery.js"
                    ],
                    helpers: "spec/helpers-js/toggle-switch-helpers.js",
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

            specs: {
                files: [{
                    expand: true,
                    cwd: "spec/specs",
                    src: ["**/*.coffee"],
                    dest: "spec/specs-js",
                    ext: ".js"
                }]
            },

            specHelpers: {
                files: [{
                    expand: true,
                    cwd: "spec/helpers",
                    src: ["**/*.coffee"],
                    dest: "spec/helpers-js",
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
            },

            components: {
                src: ["src/components/*/*.scss"],
                dest: "docs/scss/components.scss"
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
            },

            docs: {
                files: {
                    "docs/public/css/style.css": "docs/scss/style.scss"
                }
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
            },

            docs: {
                files: {
                    "docs/public/css/style.css": "docs/public/css/style.css"
                }
            }
        },

        compare_size: {
            files: [
                "dist/*.js",
                "dist/components/*.js"
            ]
        },

        haml: {
            components: {
                files: [{
                    expand: true,
                    cwd: "src/components",
                    src: ["**/*.haml"],
                    dest: "dist/components",
                    ext: ".html"
                }]
            },

            docs: {
                files: [{
                    expand: true,
                    cwd: "docs/haml/pages",
                    src: ["**/*.haml"],
                    dest: "docs/pages",
                    ext: ".html"
                }]
            },

            fullDocs: {
                files: {
                    "docs/pages/full.html": "docs/haml/site.haml"
                }
            }
        },

        shell: {
            copyMain: {
                command: [
                    // "cp src/springs.js dist/springs.js",
                    // "cp src/springs.scss dist/springs.scss",
                    "cp src/components/*/*.scss docs/scss/components",
                    "rsync -av src/components/ dist/components/"
                ].join("&&")
            }
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

            haml: {
                files: ["src/**/*.haml"],
                tasks: ["haml"],
                options: { spawn: false }
            },

            docsHaml: {
                files: ["docs/haml/**/*.haml"],
                tasks: ["haml:fullDocs"],
                options: { spawn: false }
            },

            docsScss: {
                files: ["docs/scss/**/*.scss"],
                tasks: ["sass:docs", "autoprefixer:docs"],
                options: { spawn: false }
            }
        }
    });

    // 2. TASKS
    require("load-grunt-tasks")(grunt);

    // 3. PERFORM
    grunt.registerTask("default", ["coffee:build", "coffee:components", "concat", "sass", "autoprefixer", "csscss", "uglify", "compare_size", "haml", "shell"]);
    grunt.registerTask("tests", ["coffee:specHelpers", "coffee:specs", "jasmine"]);
    grunt.registerTask("full", ["coffee", "jasmine", "concat", "sass", "autoprefixer", "csscss", "uglify", "compare_size", "slim", "shell"]);
    grunt.registerTask("docs", ["haml:fullDocs", "sass:docs", "autoprefixer:docs"]);

}