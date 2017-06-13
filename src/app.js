<<<<<<< HEAD
export class App {
  configureRouter(config, router) {
    config.title = 'Florida Livestock';
    config.map([
      { route: ['', 'welcome'], name: 'welcome',      moduleId: 'welcome',      nav: true, title: 'Welcome' },
      { route: 'users',         name: 'users',        moduleId: 'users',        nav: true, title: 'Github Users' },
      { route: 'child-router',  name: 'child-router', moduleId: 'child-router', nav: true, title: 'Child Router' }
=======
import {activationStrategy} from 'aurelia-router';

export class App {
  configureRouter(config, router){
    config.title = 'Florida Livestock';
    config.map([
      { route: '', moduleId: 'welcome' },
      {
        name: 'notes',
        route: 'notes',
        moduleId: 'notes/index',
        nav: true,
        title:'Notes',
        href: '#/notes?filter=none',
        settings: { icon:'file-text' },
        activationStrategy: activationStrategy.invokeLifecycle
      },
      { route: 'notebooks', moduleId: 'notebooks/index', nav: true, title: 'Notebooks', settings: { icon:'book' } },
      { route: 'settings',  moduleId: 'settings/index', nav: true, title: 'Settings', settings: { icon:'cog' } }
>>>>>>> 3420a262dfab67117259d7ac478654b59464ab67
    ]);

    this.router = router;
  }
}
