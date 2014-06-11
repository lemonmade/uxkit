class ExampleDevice
    constructor: ->


ExampleDevice.template = "<div class='example-device'>
                            <div class='example-device-ratiometer'>
                                <div class='example-device-content-wrapper'>
                                    <div class='example-device-content'>
                                    </div>
                                </div>
                            </div>
                        </div>"

# Device types
ExampleDevice.iphone = "device-iphone"
ExampleDevice.ipad = "device-ipad"
ExampleDevice.transform = "device-transform"

# Device styles
ExampleDevice.flat = "style-flat"
ExampleDevice.realistic = "style-realistic"



class ExampleDeviceController
    constructor: (options = {}) ->


    newExampleDevice: (options = {}) ->
        defaults =
            device: ExampleDevice.iphone
            style: ExampleDevice.flat
            content: undefined
            container: "body"

        options = $.extend defaults, options

        $device = $(ExampleDevice.template)
        $device.addClass "#{options.device} #{options.style}"
        if options.content? then $(options.content).appendTo($device.find ".example-device-content")
        $device.appendTo options.container

    add: (options) -> @newExampleDevice options




window.ExampleDeviceController = ExampleDeviceController
window.ExampleDevice = ExampleDevice