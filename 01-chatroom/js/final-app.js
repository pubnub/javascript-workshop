(function() {

  var output = document.querySelector('.output'),
    input = document.querySelector('input'),
    button = document.querySelector('button'),
    avatar = document.querySelector('.avatar'),
    presence = document.querySelector('.presence');
  
  var channel = 'simple-chat';

  // Assign a random avatar in random color
  avatar.className = 'face-' + ((Math.random() * 13 + 1) >>> 0) + ' color-' + ((Math.random() * 10 + 1) >>> 0);

  var pubnub = PUBNUB.init({ // Hey, use your own keys!
    subscribe_key: 'sub-c-182105ac-0001-11e5-8fd4-0619f8945a4f',
    publish_key: 'pub-c-ce04f67b-0f26-43ce-8be2-192e9821d1a3'
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

  input.addEventListener('keyup', function(e) { console.log(e);
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