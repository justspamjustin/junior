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

  Jr.Navigator = {
    backButtonFlag: true,
    history: [],
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
      this.history.push(opts);
      this.backButtonFlag = false;
      return Backbone.history.navigate(url, opts);
    },
    renderView: function(mainEl, view) {
      var animation, newEl;
      animation = this.history.length > 0 ? this.history[this.history.length -1].animation : null;
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
      var lastNavigate = this.history.pop();
      animation = lastNavigate.animation;
      opposite = this.opposites[animation.direction];
      lastNavigate.animation.direction = opposite;
      this.history.push(lastNavigate);
      if(this.backButtonFlag) {
        this.history.pop();
      }
      this.backButtonFlag = true;
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
      $('#app-container').prepend(toEl);
      toEl.addClass('animate-to-view').addClass(direction).addClass('initial');
      $('#app-container').addClass('animate');
      $('#app-container').addClass(direction);
      next = function() {
        return toEl.removeClass('initial');
      };
      setTimeout(next, 1);
      after = function() {
        fromEl.remove();
        toEl.attr('id', 'app-main');
        toEl.removeClass('animate-to-view').removeClass(direction);
        return $('#app-container').removeClass('animate').removeClass(direction);
      };
      return setTimeout(after, 400);
    }
  };

  Jr.Router = Backbone.Router.extend({
    renderView: function(view) {
      return Jr.Navigator.renderView($('#app-main'), view);
    }
  });
})(Jr);