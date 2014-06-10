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





class ExampleDeviceController
    constructor: (options = {}) ->


    newExampleDevice: (options = {}) ->
        $device = $(ExampleDevice.template)
        if options.content? then $(options.content).appendTo($device.find ".example-device-content")
        $device.appendTo "body"

    add: (options) -> @newExampleDevice options




window.ExampleDeviceController = ExampleDeviceController