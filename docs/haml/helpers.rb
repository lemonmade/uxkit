require "yaml"

def render(file, locals = {})
    Haml::Engine.new(File.read(file)).render(Object.new, locals)
end

def render_partial(partial, locals = {})
    render "docs/haml/partials/#{partial}.haml", locals
end

def render_source_code(component)
    component_file = component_filename component
    source_html = File.read("dist/components/#{component_file}/#{component_file}.html")
    source_css = File.read("dist/components/#{component_file}/#{component_file}.css")
    source_js = File.read("dist/components/#{component_file}/#{component_file}.js")

    render_partial :source_code, html: source_html, css: source_css, js: source_js
end

def render_javascript_api(component)
    component_file = component_filename component
    api = YAML.load(File.read("docs/haml/api/#{component_file}.yaml"))
    render_partial :javascript_api, api: api, component_file: component_file
end




def component_filename(component)
    component.downcase.gsub /\s+/, "-"
end

def component_name(component_file)
    component_file.split("-").map(&:capitalize).join " "
end