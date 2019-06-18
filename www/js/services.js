angular.module('starter.services', [])

.factory('Chats', function() {
  // Might use a resource here that returns a JSON array

  // Some fake testing data
  var chats = [{
    id: 0,
    name: 'Sofia Reyes',
    lastText: 'You on your way?',
    face: 'img/sofia.jpg'
  }, {
    id: 1,
    name: 'Karen Castillo',
    lastText: 'Hey, it\'s me',
    face: 'img/karen.jpg'
  }, {
    id: 2,
    name: 'Mauricio Rosales',
    lastText: 'I should buy a boat',
    face: 'img/mauricio.jpg'
  }, {
    id: 3,
    name: 'Jose Perez',
    lastText: 'Look at my mukluks!',
    face: 'img/jose.jpg'
  }, {
    id: 4,
    name: 'Dilcia Mendez',
    lastText: 'This is wicked good ice cream.',
    face: 'img/dilcia.jpg'
  }];

  return {
    all: function() {
      return chats;
    },
    remove: function(chat) {
      chats.splice(chats.indexOf(chat), 1);
    },
    get: function(chatId) {
      for (var i = 0; i < chats.length; i++) {
        if (chats[i].id === parseInt(chatId)) {
          return chats[i];
        }
      }
      return null;
    }
  };
});
