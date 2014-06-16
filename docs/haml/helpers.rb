def render(partial, locals = {})
    Haml::Engine.new(File.read("docs/haml/partials/#{partial}.haml")).render(Object.new, locals)
end