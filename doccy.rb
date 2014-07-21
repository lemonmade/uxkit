require "haml"
require "yaml"

class Doccy
  attr_accessor :include
  attr_accessor :special_titles

  def initialize(template)
    @docs = []
    @special_titles = {}
    @template = template
  end

  def find_docs()
    components = Dir["src/components/*"]
    components = components.select(&@include) unless @include.nil?

    components.each do |component_dir|

      component_files = Dir["#{component_dir}/*"] + Dir["#{component_dir.gsub(/src/, "dist")}/*"]

      scss   = component_files.select { |file| file.end_with?(".scss") }
      css    = component_files.select { |file| file.end_with?(".css") }
      coffee = component_files.select { |file| file.end_with?(".coffee") }
      js     = component_files.select { |file| file.end_with?(".js") }
      haml   = component_files.select { |file| file.end_with?(".haml") }
      html   = component_files.select { |file| file.end_with?(".html") }

      short_name = component_dir.split("/").last

      doc = {
        name:       titleize(short_name),
        short_name: short_name,
        scss:       scss.first,
        css:        css.first,
        coffee:     coffee.first,
        js:         js.first,
        haml:       haml.first,
        html:       html.first,
        api:        "docs/haml/api/#{short_name}.yaml",
        playground: "docs/haml/playgrounds/#{short_name}.yaml"
      }

      File.open("docs/pages/components/#{short_name}.html", 'w') do |file|
        file.write haml(@template, doc: doc)
      end
    end
  end

  def partial(partial, locals = {})
    haml "docs/haml/partials/#{partial}.haml", locals
  end



  def titleize(str)
    special_title = @special_titles[str]
    special_title.nil? ? str.split(/[\-_]+/).map(&:capitalize).join(" ") : special_title
  end

  def haml(file, locals = {})
    Haml::Engine.new(File.read(file)).render(self, locals)
  end

end


doc = Doccy.new "docs/haml/template.haml"
doc.include = lambda { |component| !( component =~ /(example\-device|notification\-mac)/ ) }
doc.special_titles["notification-ios"] = "Notification - iOS"
doc.find_docs()
