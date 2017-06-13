export class ChildRouter {
  heading = 'Child Router';

  configureRouter(config, router) {
    config.map([
      { route: ['', 'Goats'], name: 'goats',       moduleId: 'welcome',       nav: true, title: 'Welcome' },
      { route: 'users',         name: 'users',         moduleId: 'users',         nav: true, title: 'Github Users' },
      { route: 'search-bar',  name: 'search-bar',  moduleId: 'search-bar',  nav: true, title: 'Search Bar' }
    ]);

    this.router = router;
  }
}
