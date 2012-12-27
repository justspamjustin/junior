var HomeTemplate = [
  '<div class="content">',
  ' <header class="junior-intro">',
  '   <h1 class="junior-name"><i class="icon-umbrella"></i> Junior</h1>',
  '   <p>A front-end framework for building html5 mobile apps with a native look and feel.</p>',
  ' </header>',
  ' <ul class="list divider-list"><li class="list-divider">Features</li></ul>',
  ' <div class="carousel-container">',
  '   <ul class="carousel-list">',
  '     <li class="carousel-item native-look-and-feel">',
  '       <summary>Transitions with a native look and feel.</summary>',
  '       <div class="feature-icon"></div>',
  '     </li>',
  '     <li class="carousel-item carousel-content">',
  '       <summary>Carousels using flickable.js</summary>',
  '       <i class="icon-picture"></i>',
  '     </li>',
  '     <li class="carousel-item backbone-content">',
  '       <summary>Integrated with Backbone.js</summary>',
  '       <div class="feature-icon"></div>',
  '     </li>',
  '   </ul>',
  ' </div>',
  ' <div class="button-positive button-block show-more-button">Show me more!</div>',
  '</div>'
].join('\n');

var HomeView = Jr.View.extend({
  render: function(){
    this.$el.html(HomeTemplate);
    this.afterRender();
    return this;
  },

  afterRender: function() {
    var after = function() {
      this.$('.carousel-list').flickable({segments:3});
    };
    setTimeout(after,1);

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
