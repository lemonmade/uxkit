component = ARGV.first.downcase.strip
component.gsub! %r{\s+}, "-"
src_dir = "../src/components/#{component}"

# Shell commands
`mkdir #{src_dir}`

`touch #{src_dir}/#{component}.scss`
`touch #{src_dir}/#{component}.haml`
`touch #{src_dir}/#{component}.coffee`

`touch ../docs/haml/pages/#{component}.haml`

`touch ../spec/fixtures/#{component}-fixture.html`
`touch ../spec/helpers/#{component}-helpers.coffee`
`touch ../spec/#{component}-spec.coffee`

File.open("../src/style.scss", "a") do |file|
    file.puts "\n@import \"components/#{component}.scss\";"
end