#!/usr/bin/env ruby

component_file = ARGV.first.downcase.strip.gsub /\s+/, "-"
component_name = component_file.split("-").map(&:capitalize).join " "

args = ARGV[1..-1].join " " if ARGV[1] else ""

# Options
no_js = !(args =~ /no\-js/).nil?
no_spec = !(args =~ /no\-spec/).nil?
no_docs = !(args =~ /no\-docs/).nil?

src_dir = "../src/components/#{component_file}"

# Shell commands
`mkdir #{src_dir}`

# Component pieces
`touch #{src_dir}/#{component_file}.scss`
`touch #{src_dir}/#{component_file}.haml`
`touch #{src_dir}/#{component_file}.coffee` unless no_js

# Docs
# `touch ../docs/haml/pages/#{component_file}.haml`
unless no_docs
    doc_file = "../docs/haml/components/#{component_file}.haml"
    `touch #{doc_file}`

    File.open(doc_file).do |file|
        file.puts <<-EOS
        - load "docs/haml/helpers.rb"
        - component = "#{component_name}"

        %h2= component

        = render_example component

        / Write all relevant documentation here.

        = render_component_actions component
        = render_source_code component
        = render_javascript_api component"
        EOS

        doc_standalone_file = "../docs/haml/components-standalone/#{component_file}.haml"
        `touch #{doc_standalone_file}`

        File.open(doc_standalone_file).do |file|
            file.puts <<-EOS
            - load "docs/haml/helpers.rb"
            - component_file = "#{component_file}"

            %html
                = render_partial :head, title: "\#\{component_name component_file\} - uxkit"

                %body
                    = render_partial :page_header
                    = render_partial :sidebar, full_page: false, current_component: component_file
                    %div.components
                        = render "docs/haml/components/\#\{component_file\}.haml"
            EOS
    end

    unless no_js
        `touch ../docs/haml/api/#{component_file}.yaml`
    end
end

# Specs
unless no_js or no_spec
    `touch ../spec/fixtures/#{component_file}-fixture.html`
    `touch ../spec/helpers/#{component_file}-helpers.coffee`
    `touch ../spec/#{component_file}-spec.coffee`
end

# Add it to cummulative stylesheet
File.open("../src/style.scss", "a") do |file|
    file.puts "\n@import \"components/#{component_file}.scss\";"
end