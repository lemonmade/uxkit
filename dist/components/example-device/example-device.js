(function() {
  var ExampleDevice, ExampleDeviceController;

  ExampleDevice = (function() {
    function ExampleDevice() {}

    return ExampleDevice;

  })();

  ExampleDevice.template = "<div class='example-device'> <div class='example-device-ratiometer'> <div class='example-device-content-wrapper'> <div class='example-device-content'> </div> </div> </div> </div>";

  ExampleDevice.iphone = "device-iphone";

  ExampleDevice.ipad = "device-ipad";

  ExampleDevice.transform = "device-transform";

  ExampleDevice.flat = "style-flat";

  ExampleDevice.realistic = "style-realistic";

  ExampleDeviceController = (function() {
    function ExampleDeviceController(options) {
      if (options == null) {
        options = {};
      }
    }

    ExampleDeviceController.prototype.newExampleDevice = function(options) {
      var $device, defaults;
      if (options == null) {
        options = {};
      }
      defaults = {
        device: ExampleDevice.iphone,
        style: ExampleDevice.flat,
        content: void 0,
        container: "body"
      };
      options = $.extend(defaults, options);
      $device = $(ExampleDevice.template);
      $device.addClass("" + options.device + " " + options.style);
      if (options.content != null) {
        $(options.content).appendTo($device.find(".example-device-content"));
      }
      return $device.appendTo(options.container);
    };

    ExampleDeviceController.prototype.add = function(options) {
      return this.newExampleDevice(options);
    };

    return ExampleDeviceController;

  })();

  window.ExampleDeviceController = ExampleDeviceController;

  window.ExampleDevice = ExampleDevice;

}).call(this);
