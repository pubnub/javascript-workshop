(function() {
  'use strict';
  
  var output = document.querySelector('.output'),
    input = document.querySelector('input'),
    button = document.querySelector('button'),
    avatar = document.querySelector('.avatar'),
    presence = document.querySelector('.presence');

  var channel = 'simple-chat-giphy';

  // Assign a random avatar in random color
  avatar.className = 'face-' + ((Math.random() * 13 + 1) >>> 0) + ' color-' + ((Math.random() * 10 + 1) >>> 0);

  // Hey, when you fork this and try by yourself, please use your own keys! Get your keys at http://admin.pubnub.com
  var pubnub = PUBNUB.init({
    subscribe_key: 'sub-c-00ac33a4-3e28-11e6-971e-02ee2ddab7fe',
    publish_key: 'pub-c-1a5f74ed-f634-47eb-a1b9-53d98390c644'
  });


  // PubNub Subscribe API
  // with Presence API to see how many people are online
  pubnub.subscribe({
    channel: channel,
    callback: function(m) {
      
      var content = '<p><i class="' + m.avatar + '"></i><span>';

      if (m.text) {
        content += m.text.replace(/[<>]/ig, '');
      }
      if (m.gif) {
        console.log('giphy added...');
        content += '<img src="' + m.gif + '">'
      }
      content += '</span></p>';

      output.innerHTML = content + output.innerHTML;
    },
    presence: function(m) {
      if (m.occupancy > 1) {
        presence.textContent = m.occupancy + ' people online';
      } else {
        presence.textContent = 'Only you are online';
      }
    },
    connect: fetchOldMessages
  });

  input.addEventListener('keyup', function(e) { 
    (e.keyCode || e.charCode) === 13 && send();
  }, false);
 
  button.addEventListener('click', send, false);

  function send() {
    var text = input.value;

    if (!text) return;

     // PubNub Publish API
    pubnub.publish({
      channel: channel,
      message: {
        avatar: avatar.className,
        text: text
      },
      callback: function(m) {
        input.value = '';
        
        if (text.toLowerCase().indexOf('/giphy') > -1) {
          console.log(text.toLowerCase());
          var query = text.replace('/giphy ', '').split(' ').join('+');
          
          getGiphy(query);
        }
      }
    });
  }

  function fetchOldMessages() {
    pubnub.history({
      channel: channel,
      count: 50,
      callback: function(messages) {
        messages[0].forEach(function(m) {
          var content = '<p><i class="' + m.avatar + '"></i><span>';

          if (m.text) {
            content += m.text.replace(/[<>]/ig, '');
          }
          if (m.gif) {
            console.log('giphy added...');
            content += '<img src="' + m.gif + '">'
          }
          content += '</span></p>';

          output.innerHTML = content + output.innerHTML;
        });
      }
    });
  }

  function publishGif(gif) {
    pubnub.publish({
      channel: channel,
      message: {
        avatar: avatar.className,
        gif: gif
      }
    });
  }

  // Giphy API
  function getGiphy(q) {
    console.log(q);
    var url = 'http://api.giphy.com/v1/gifs/translate?api_key=dc6zaTOxFJmzC&s=' + q;

    var xhr = new XMLHttpRequest();
    xhr.open('GET', url);
    xhr.onload = function() {
      var json = JSON.parse(xhr.response);
      var gif = json.data.images.fixed_height.url;
      
      publishGif(gif);
    };
    xhr.onerror = function(e) {
      console.log(e);
    };
    xhr.send();
  }

})();