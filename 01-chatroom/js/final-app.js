(function() {
  'use strict';

  var output = document.querySelector('.output'),
    input = document.querySelector('input'),
    button = document.querySelector('button'),
    avatar = document.querySelector('.avatar'),
    presence = document.querySelector('.presence');
  
  var channel = 'simple-chat';

  // Assign a random avatar in random color
  avatar.className = 'face-' + ((Math.random() * 13 + 1) >>> 0) + ' color-' + ((Math.random() * 10 + 1) >>> 0);

  var pubnub = PUBNUB.init({ // Hey, use your own keys!
    subscribe_key: 'sub-c-00ac33a4-3e28-11e6-971e-02ee2ddab7fe',
    publish_key: 'pub-c-1a5f74ed-f634-47eb-a1b9-53d98390c644'
  });

  pubnub.subscribe({
    channel: channel,
    callback: function(m) {
      output.innerHTML = '<p><i class="' + m.avatar + '"></i><span>' + m.text.replace(/[<>]/ig, '') + '</span></p>' + output.innerHTML;
    },
    // Add-ons: Presence and History
    presence: function(m) {
      presence.textContent = 'Occupancy: ' + m.occupancy;
    },
    connect: fetchOldMessages
  });

  input.addEventListener('keyup', function(e) {
    (e.keyCode || e.charCode) === 13 && send();
  }, false);
 
  button.addEventListener('click', send, false);

  function send() {
    pubnub.publish({
      channel: channel,
      message: {
        avatar: avatar.className,
        text: input.value
      },
      callback: function(){input.value = '';}
    });
  }

  // Add-on: PubNub Playback to fetch past messages
  function fetchOldMessages() {
    pubnub.history({
      channel: channel,
      count: 50,
      callback: function(messages) {
        messages[0].forEach(function(m) {
          output.innerHTML = '<p><i class="' + m.avatar + '"></i><span>' + m.text.replace(/[<>]/ig, '') + '</span></p>' + output.innerHTML;
        });
      }
    });
  }

})();