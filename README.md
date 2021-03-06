# How to Start

## In a normal Browser

Go to
https://smu4242.github.io/Microphone-Visualizer/

and click the button to allow the microphone. That's it.

## In a broadcaster software like obs studio

1) Close obs. Then start obs with --enable-media-stream. Checkout the file obs_with_browser_media_support.cmd for windows. You might need to adjust the path to make it work.

2) To get it running in obs studio (streamlabs did not work for me due to not picking up the mic at all), add a new "browser source" and point it to this url: https://smu4242.github.io/Microphone-Visualizer/
Avoid changing the "transform", as that may make it look ugly.
Instead, use the "properties" of the browser source and give it a proper width and height.

### Using the right microphone (audio input device)

This is only relevant if you have more than one microphone.

In a browser like Chrome, you can set the used microphone to your preferred device.

In obs studio, you have NO option to select a microphone. The only workaround I found for this is to disable all other microphones in windows settings. Then restart obs. It should then pick up the correct microphone.

I stumbled upon this because my secondary mic has much worse quality.

It looked like this - note that there are no bars on the right:

![bad mic](https://raw.githubusercontent.com/smu4242/Microphone-Visualizer/master/bad_mic.gif)

After selecting the correct mic, it looked like this. The whole spectrum is now picked up:

![good mic](https://raw.githubusercontent.com/smu4242/Microphone-Visualizer/master/good_mic.gif)


## Configuration

You can configure:
* The number of bars shown: "numBars" Default is 256
* The width of the gap between each bar "gapWidth" Default is 0.5. Reasonable values are between 0.1 and 2.0

An example with all parameters set explicitly:
https://smu4242.github.io/Microphone-Visualizer/?numBars=12&gapWidth=0.3

# Credits

Inspired by and originally forked from https://codepen.io/GobieNan/pen/dZpZMQ
