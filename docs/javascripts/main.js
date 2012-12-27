var HomeTemplate = [
  '<header class="bar-title">',
  ' <div class="header-animated">',
  '   <h1 class="title">List Example</h1>',
  ' </div>',
  '</header>',
  '<div class="content">',
  '  <ul class="list">',
  '      <li>',
  '          <a href="#" class="go-to-details">',
  '              Go to details',
  '          </a>',
  '          <span class="chevron"></span>',
  '      </li>',
  '      <li>',
  '          <a href="#" class="go-to-details">',
  '              Go to details',
  '          </a>',
  '          <span class="chevron"></span>',
  '      </li>',
  '      <li>',
  '          <a href="#" class="go-to-details">',
  '              Go to details',
  '          </a>',
  '          <span class="chevron"></span>',
  '      </li>',
  '  </ul>',
  '</div>'
].join('\n');

var HomeView = Jr.View.extend({
  render: function(){
    this.$el.html(HomeTemplate);
    return this;
  },

  events: {
    'click .go-to-details': 'onClickGoToDetails'
  },

  onClickGoToDetails: function() {
    Jr.Navigator.navigate('details',{
      trigger: true,
      animation: {
        type: Jr.Navigator.animations.SLIDE_STACK,
        direction: Jr.Navigator.directions.LEFT
      }
    })
    return false;
  }

});

var DetailsTemplate = [
  '<header class="bar-title">',
  ' <div class="header-animated">',
  ' <div class="button-prev">Back</div>',
  '   <h1 class="title">Details</h1>',
  ' </div>',
  '</header>',
  '<div class="content">',
  'Hello World!',
  '</div>'
].join('\n');

var DetailsView = Jr.View.extend({
  render: function(){
    this.$el.html(DetailsTemplate);
    return this;
  },

  events: {
    'click .button-prev': 'onClickButtonPrev'
  },

  onClickButtonPrev: function() {
    Jr.Navigator.navigate('',{
      trigger: true,
      animation: {
        type: Jr.Navigator.animations.SLIDE_STACK,
        direction: Jr.Navigator.directions.RIGHT
      }
    })
  }

});


var AppRouter = Jr.Router.extend({
  routes: {
    '': 'home',
    'details': 'details'
  },

  home: function(){
    var homeView = new HomeView();
    this.renderView(homeView);
  },

  details: function() {
    var detailsView = new DetailsView();
    this.renderView(detailsView);
  }
});

var appRouter = new AppRouter();
Backbone.history.start();
