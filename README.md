# How to Start

## In a normal Browser

Go to 
https://smu4242.github.io/Microphone-Visualizer/

and click the button to allow the microphone. That's it.



## In a broadcaster software like obs studio

1) Close obs. Then start obs with --enable-media-stream. Checkout the file obs_with_browser_media_support.cmd for windows. You might need to adjust the path to make it work.

2) To get it running in obs studio (or streamlabs obs), add a new "browser source" and point it to the link above.
Avoid changing the "transform", as that may make it look ugly.
Instead, use the "properties" of the browser source and give it a proper width and height.

### Using the right microphone (audio input device)

This is only relevant if you have more than one microphone.

In a browser like Chrome, you can set the used microphone to your preferred device.

In obs studio, you have NO option to select a microphone. The only workaround I found for this is to disable all other microphones in windows settings. Then restart obs.


# Credits

Inspired by and originally forked from https://codepen.io/GobieNan/pen/dZpZMQ
