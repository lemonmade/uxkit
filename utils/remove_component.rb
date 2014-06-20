#!/usr/bin/env ruby

require 'fileutils'

component_file = ARGV.first.downcase.strip.gsub /\s+/, "-"

src_dir = "../src/components/#{component_file}"

`rm -rf #{src_dir}`
`rm -rf #{src_dir.sub /src/, "dist"}`
`find ../spec -type f -name "#{component_file}\*" -exec rm {} \\;`
`find ../docs -type f -name "#{component_file}\*" -exec rm {} \\;`

open("../src/style.scss", "r") do |f|
    open("../src/style.scss.tmp", "w") do |f2|
        f.each_line do |line|
            f2.write(line) unless line.start_with? "@import #{component_file}"
        end
    end
end

FileUtils.mv "../src/style.scss.tmp", "../src/style.scss"

`grunt sass`
`grunt haml`