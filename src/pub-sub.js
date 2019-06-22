//	Publish/Subscribe Pattern

(function pubsubIEFE(window) {

  var store = {};

  var id = -1;

  var pubsub = {
    subscribe(topic, func, context) {
      if (!store.hasOwnProperty(topic)) {
        store[ topic ] = [];
      }

      store[ topic ].push({
        id: ++id,
        func: func,
        context: context || Object.create(null)
      });

      return id;
    },
    unsubscribe(id) {
      console.log(store);
      for (topic in store) {
        var subscribers = store[ topic ];
        for (let i = 0; i < subscribers.length; i++) {
          if (subscribers[i].id == id) {
            subscribers.splice(i, 1);
          }
        }
      }
      return this;
    },
    publish(topic, args) {
      if (!store.hasOwnProperty(topic)) {
        return false;
      }

      var subscribers = store[ topic ];
      subscribers.forEach((s) => {
        s.func.call(s.context, args);
      });

      return this;
    }
  }

  window.app = window.app || {};
  window.app.pubsub = pubsub;
}(window));
