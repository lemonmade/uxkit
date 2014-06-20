require 'sinatra'
require 'rest-client'

APP_ROOT = File.dirname(__FILE__)

get '/' do
    File.read(File.join(APP_ROOT, "pages", "site.html"))
end

get '/:component' do |c|
    File.read(File.join(APP_ROOT, "pages/components", "#{c}.html"))
end