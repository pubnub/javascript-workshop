#  2. Internet of Things: "Poor man's HUE"

PubNub is not just for chat apps but has so many use cases- one of the popular use cases is for IoT (Internet of Things) applications. Companies like Insteon and LIFX are using the PubNub network for theor smart home devices including smart light bulbs. 

Here, you are going to create a remote control to change the color of an LED.

The simplest operation can be describe as below:

![Arduino LED](https://cms-assets.tutsplus.com/uploads/users/48/posts/25508/image/Arduino-LED-green.png)



### Demo

Try it at: [http://localhost:8001/02-iot/](http://localhost:8001/02-iot/)



## Creating Web User Interface

In your **index.html**, include [the latest JavaScript version](https://www.pubnub.com/docs/web-javascript/pubnub-javascript-sdk):

```html
<script src="//cdn.pubnub.com/pubnub-3.15.2.min.js"></script>
```



As a control slider, use the HTML5 element `<input type="range"` to draw a slider bar to let a user to change the value of each “R”, “G”, and “B”. Each color has the values of 0 to 255 (min="0" max="255") and uses only integer values by setting the increment by 1 (step="1").

```html
<input id="red" type="range" min="0" max="255" step="1" value="0">
```

This controls the intensity of the red color. I won’t talk about styling with CSS in this tutorial, but you can view the **index.html**.



## Initializing PubNub

In **app.js**, create an instance of the object and initializing using your API keys:

```javascript
var pubnub = PUBNUB.init({
  subscribe_key: 'sub-c-182105ac-...',
  publish_key: 'pub-c-ce04f67b-...'
});
```

If you are taking this course in a class room with a bunch of other students, let's use the keys provided in **app.js** already, so you can actually use your final app to chat with your classmates! Otherwise, use your own API keys.

and create a channel name. it can be almost any arbitary string. (there are some restrictions apply!)

```javescript
var channel = 'hue-clone';
```



## Sending a Color Value to a LED

Create an object to access the slider:

```javascript
var red = document.getElementById('red');
var green = document.getElementById('green');
var blue = document.getElementById('blue');
```

Listen to the change event of the slider DOM, and send any changes to PubNub with the `publish` method.

```javascript
// Initial brightness state
var brightness = {r: 0, g: 0, b: 0}; 

red.addEventListener('change', function(e){
  brightness.r = this.value;
  publishUpdate(brightness);
}, false);
```

You also need to add a listener for green and blue sliders.

The `publishUpdate()` takes an object that include r (red), g (green), and b (blue) values to publish to PubNub network:

```javascript
function publishUpdate(data) {
  pubnub.publish({
    channel: channel, 
    message: data
  });
}
```



## Subscribing Data Coming from All Other Subscribers

```javascript
pubnub.subscribe({
  channel: channel,
  message: resetSliders
});
```

```javascript
function resetSliders(m) {
  red.value = brightness.r = m.r;
  green.value = brightness.g = m.g;
  blue.value = brightness.b = m.b;
}
```



## Setting an Intial State of the LED

```javascript
pubnub.subscribe({
  channel: channel,
  message: resetSliders, // reset the slider UI every time a subscriber makes a change
  connect: initSliders // initialize the slider states for the fisrt time launching the app
});
```

```javascript
function initSliders() {
  pubnub.history({
    channel: channel,
    count: 1,
    callback: function(messages) {
      messages[0].forEach(function(m) {
        console.log(m);
        resetSliders(m);
      });
    }
  });
}
```

Now the slider UI should align with the last state of the LED.



Let's play with it together!



## Arduino with Node.js

I am not covering this in this workshop, but if you are interested, look at the code in [/arduino-led](/arduino-led)

