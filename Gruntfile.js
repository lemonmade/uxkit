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
                    styles: "dist/components/message-bubble/message-bubble.css",
                    template: require("grunt-template-jasmine-istanbul"),
                    templateOptions: {
                        coverage: "bin/coverage/coverage.json",
                        report: [
                            {
                                type: "html",
                                options: {
                                    dir: "bin/coverage/html"
                                }
                            },

                            {
                                type: 'cobertura',
                                options: {
                                    dir: "bin/coverage/cobertura"
                                }
                            },

                            {
                                type: "text-summary"
                            }
                        ]
                    }
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
                    styles: "dist/components/toggle-switch/toggle-switch.css",
                    template: require("grunt-template-jasmine-istanbul"),
                    templateOptions: {
                        coverage: "bin/coverage/coverage.json",
                        report: [
                            {
                                type: "html",
                                options: {
                                    dir: "bin/coverage/html"
                                }
                            },

                            {
                                type: 'cobertura',
                                options: {
                                    dir: "bin/coverage/cobertura"
                                }
                            },

                            {
                                type: "text-summary"
                            }
                        ]
                    }
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
                src: "src/behaviors/springs.coffee",
                dest: "dist/behaviors/springs.js"
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
            },

            docs: {
                src: "docs/coffee/script.coffee",
                dest: "docs/public/js/script.js"
            }
        },

        uglify: {
            build: {
                src: "dist/behaviors/springs.js",
                dest: "dist/behaviors/springs.min.js"
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

            drag: {
                src: [
                    "dist/behaviors/drag.js",
                    "dist/components/notification-ios/notification-ios.js"
                ],
                dest: "dist/components/notification-ios/notification-ios-drag.js"
            },

            springs: {
                src: [
                    "src/behaviors/helpers.scss",
                    "src/behaviors/springs.scss"
                ],
                dest: "dist/behaviors/springs.scss"
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
                    cwd: "docs/haml/components-standalone",
                    src: ["**/*.haml"],
                    dest: "docs/pages/components",
                    ext: ".html"
                }]
            },

            fullDocs: {
                files: {
                    "docs/pages/site.html": "docs/haml/site.haml"
                }
            }
        },

        imagemin: {
            all: {
                options: { optimizationLevel: 1 },

                files: [{
                    expand: true,
                    cwd: "docs/img/",
                    src: ["**/*.{png,jpg,jpeg,gif}"],
                    dest: "docs/public/img/"
                }]
            }
        },

        shell: {
            copyMain: {
                command: [
                    // "cp src/springs.js dist/springs.js",
                    // "cp src/springs.scss dist/springs.scss",
                    "cp src/behaviors/drag.js dist/behaviors/drag.js",
                    "cp src/components/*/*.scss docs/scss/components",
                    "cp dist/components/toggle-switch/toggle-switch.js docs/public/js/toggle-switch.js",
                    "rsync -av src/components/ dist/components/"
                ].join("&&")
            },

            copyBehaviors: {
                command: [
                    "cp dist/components/notification-ios/notification-ios-drag.js docs/public/js/notification-ios-drag.js"
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

            drag: {
                files: ["src/behaviors/drag.js"],
                tasks: ["shell:copyMain", "concat", "shell:copyBehaviors"],
                options: { spawn: false }
            },

            coffee: {
                files: ["src/**/*.coffee"],
                tasks: ["coffee:components", "coffee:build"]
            },

            coffeeSpecs: {
                files: "spec/**/*.coffee",
                tasks: ["coffee:specs"],
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
                tasks: ["haml:docs", "haml:fullDocs"],
                options: { spawn: false }
            },

            docsScss: {
                files: ["docs/scss/**/*.scss"],
                tasks: ["sass:docs", "autoprefixer:docs"],
                options: { spawn: false }
            },

            api: {
                files: ["docs/haml/api/**/*.yaml"],
                tasks: ["haml:docs", "haml:fullDocs"],
                options: { spawn: false }
            },

            docsCoffee: {
                files: ["docs/coffee/**/*.coffee"],
                tasks: ["coffee:docs"],
                options: { spawn: false }
            }
        }
    });

    // 2. TASKS
    require("load-grunt-tasks")(grunt);

    // 3. PERFORM
    grunt.registerTask("default", ["coffee:build", "coffee:components", "concat", "sass", "autoprefixer", "csscss", "uglify", "compare_size", "haml", "shell", "imagemin"]);
    grunt.registerTask("tests", ["coffee:specHelpers", "coffee:specs", "jasmine"]);
    grunt.registerTask("full", ["coffee", "jasmine", "concat", "sass", "autoprefixer", "csscss", "uglify", "compare_size", "slim", "shell", "imagemin"]);
    grunt.registerTask("docs", ["haml:fullDocs", "haml:docs", "sass:docs", "autoprefixer:docs", "imagemin"]);

}
