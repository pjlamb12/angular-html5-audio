# Angular HTML5 Audio

This Angular component gives you customizable controls for an HTML5 Audio player. It uses an `<audio>` tag to play the audio, but uses custom events and other HTML elements to play, pause, jump around the track, control the volume, etc.

## Configuration

An object with the following attributes is needed for configuring the component:

* `iconClassPrefix` (such as `fa` for FontAwesome)
* `showAudio`
* `audioLowerIconClass`
* `audioHigherIconClass`
* `playIconClass`
* `pauseIconClass`
* `pauseIconClass`
* `controlColors`

The only other needed input is the audio source URL, passed in via the `audioSrc` input attribute.
