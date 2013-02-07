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
    currentWaitingRenderId: null,
    navigate: function(url, opts) {
      if (this.currentWaitingRenderId) {
        clearInterval(this.currentWaitingRenderId);
        this.currentWaitingRenderId = null;
      }

      var appContainer = $('#app-container');
      var isNotAnimating = function () {
        return !appContainer.hasClass('animate');
      };

      if (isNotAnimating()) {
        return this._navigateWithoutCheck(url, opts);
      } else {        
        this.currentWaitingRenderId = setInterval((function (self) {
          return function () {
            if (isNotAnimating()) {
              clearInterval(self.currentWaitingRenderId);
              self.currentWaitingRenderId = null;

              return this._navigateWithoutCheck(url, opts);             
            }
          };  
        })(this), 200)
      }
    },
    _navigateWithoutCheck: function (url, opts) {
        this.history.push(opts); // @todo: We only ever use the last item of the history so it figures that keeping a gigantic list is pretty stupid...
        this.backButtonFlag = false;
        return Backbone.history.navigate(url, opts);   
    },
    renderView: function(mainEl, view) {
      var animation, newEl;
      animation = this.history.length > 0 ? this.history[this.history.length - 1].animation : null;
      if (animation) {
        newEl = $('<div></div>');
        this.resetContent(newEl);
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
      var appContainer = $('#app-container');
      appContainer.prepend(toEl);

      toEl.addClass('animate-to-view initial ' + direction);
      appContainer.addClass('animate ' + direction);
      setTimeout(function () {
        return toEl.removeClass('initial');
      }, 1);

      appContainer.bind('webkitTransitionEnd transitionend oTransitionEnd', function (event) {
        fromEl.remove();
        toEl.attr('id', 'app-main');
        toEl.removeClass('animate-to-view ' + direction);
        
        $(this).unbind(event);
        return appContainer.removeClass('animate ' + direction);
      });

      return;
    }
  };

  Jr.Router = Backbone.Router.extend({
    renderView: function(view) {
      return Jr.Navigator.renderView($('#app-main'), view);
    }
  })
})(Jr);