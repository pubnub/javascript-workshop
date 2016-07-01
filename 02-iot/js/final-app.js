(function(){
  'use strict';

  var pubnub = PUBNUB.init({
    subscribe_key: 'sub-c-00ac33a4-3e28-11e6-971e-02ee2ddab7fe',
    publish_key: 'pub-c-1a5f74ed-f634-47eb-a1b9-53d98390c644'
  });

  var channel = 'hue-clone';

  var red = document.getElementById('red');
  var green = document.getElementById('green');
  var blue = document.getElementById('blue');

  // Initial brightness state
  var brightness = {r: 0, g: 0, b: 0}; 


  // UI Reset: Subscribe data from all subscibers of the channel to set the state correctly

  pubnub.subscribe({
    channel: channel,
    message: resetSliders, // reset the slider UI every time a subscriber makes a change
    connect: initSliders // initialize the slider states for the fisrt time launching the app
  });

  function resetSliders(m) {
    red.value = brightness.r = m.r;
    green.value = brightness.g = m.g;
    blue.value = brightness.b = m.b;
  }

  function initSliders() {
    pubnub.history({
      channel: channel,
      count: 1,
      callback: function(m) {
        resetSliders(m[0][0]);
      }
    });
  }

  function publishUpdate(data) {
    console.log(data);

    pubnub.publish({
      channel: channel, 
      message: data
    });
  }

  // UI EVENTS

  red.addEventListener('change', function(e){
    brightness.r = this.value;
    publishUpdate(brightness);
  }, false);

  green.addEventListener('change', function(e){
    brightness.g = this.value;
    publishUpdate(brightness);
  }, false);

  blue.addEventListener('change', function(e){
    brightness.b = this.value;
    publishUpdate(brightness);
  }, false);

})();