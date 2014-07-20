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
    yaml_file = "docs/haml/api/#{component_file}.yaml"

    if File.file?(yaml_file)
        api = YAML.load(File.read(yaml_file))
        render_partial :javascript_api, api: api, component_file: component_file
    else
        ""
    end
end

def render_example(component)
    component_file = component_filename component
    source_html = File.read("dist/components/#{component_file}/#{component_file}.html")

    render_partial :example, html: source_html
end

def render_component_actions(component)
    render_partial :component_actions, component: component
end

def render_requirements(component, requirements)
    render_partial :requirements, component: component, requirements: requirements
end

def render_playground(statements, comments, example_commands)
    render_partial :playground, statements: statements, comments: comments, example_commands: example_commands
end

def render_download_links(component)
    render_partial :download_links, component: component
end




def component_filename(component)
    component.downcase.gsub /\s+/, "-"
end

def component_name(component_file)
    component_file.split("-").map(&:capitalize).join " "
end



def requirement_link(requirement)
    component_file = component_filename requirement[0]
    "<a href='/#{component_file}' class='requirement-link'>#{component_file} #{requirement[1].to_s}</a>#{if requirement[2] then ", " + requirement[2] else "" end}"
end