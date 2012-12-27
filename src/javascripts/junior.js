var Jr = Jr || {};
(function(Jr){
  Jr.View = Backbone.View.extend({
    delegateEvents: function(events) {
      var key, newKey, oldValue;
      this.events = this.events || events;
      for (key in this.events) {
        if (key.indexOf('click') === 0) {
          if (Modernizr.touch) {
            newKey = key.replace('click', 'touchend');
            oldValue = this.events[key];
            this.events[newKey] = oldValue;
            delete this.events[key];
          }
        }
      }
      return Backbone.View.prototype.delegateEvents.call(this, this.events);
    }
  });

  var navigatorStore;
  navigatorStore = {};
  Jr.Navigator = {
    directions: {
      UP: 'UP',
      DOWN: 'DOWN',
      LEFT: 'LEFT',
      RIGHT: 'RIGHT'
    },
    opposites: {
      UP: 'DOWN',
      DOWN: 'UP',
      LEFT: 'RIGHT',
      RIGHT: 'LEFT'
    },
    animations: {
      SLIDE_STACK: 'SLIDE_STACK',
      SLIDE_OVER: 'SLIDE_OVER'
    },
    navigate: function(url, opts) {
      navigatorStore.lastNavigate = opts;
      return Backbone.history.navigate(url, opts);
    },
    renderView: function(mainEl, view) {
      var animation, newEl, _ref;
      animation = navigatorStore != null ? (_ref = navigatorStore.lastNavigate) != null ? _ref.animation : void 0 : void 0;
      if (animation) {
        newEl = $('<div></div>');
        this.resetContent(newEl, view);
        this.normalRenderView(newEl, view);
        this.animate(mainEl, newEl, animation.type, animation.direction);
        return this.afterAnimation();
      } else {
        this.resetContent(mainEl, view);
        return this.normalRenderView(mainEl, view);
      }
    },
    normalRenderView: function(mainEl, view) {
      return mainEl.append(view.render().el);
    },
    resetContent: function(mainEl) {
      return mainEl.html('');
    },
    afterAnimation: function() {
      var animation, opposite;
      animation = navigatorStore.lastNavigate.animation;
      opposite = this.opposites[animation.direction];
      return navigatorStore.lastNavigate.animation.direction = opposite;
    },
    animate: function(fromEl, toEl, type, direction) {
      if (this.animations.hasOwnProperty(type)) {
        return this.doAnimation(fromEl, toEl, type, direction);
      } else {
        throw Error("Animation Not Available");
      }
    },
    doAnimation: function(fromEl, toEl, type, direction) {
      var after, next;
      $('body').prepend(toEl);
      toEl.addClass('animate-to-view').addClass(direction).addClass('initial');
      $('body').addClass('animate');
      $('body').addClass(direction);
      next = function() {
        return toEl.removeClass('initial');
      };
      setTimeout(next, 1);
      after = function() {
        fromEl.remove();
        toEl.attr('id', 'app-main');
        toEl.removeClass('animate-to-view').removeClass(direction);
        return $('body').removeClass('animate').removeClass(direction);
      };
      return setTimeout(after, 400);
    }
  };

  Jr.Router = Backbone.Router.extend({
    renderView: function(view) {
      return Jr.Navigator.renderView($('#app-main'), view);
    }
  })
})(Jr);