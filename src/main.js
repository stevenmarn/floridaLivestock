<<<<<<< HEAD
import 'bootstrap';
=======
import environment from './environment';

//Configure Bluebird Promises.
//Note: You may want to use environment-specific configuration.
Promise.config({
  warnings: {
    wForgottenReturn: false
  }
});
>>>>>>> 3420a262dfab67117259d7ac478654b59464ab67

export function configure(aurelia) {
  aurelia.use
    .standardConfiguration()
<<<<<<< HEAD
    .developmentLogging();

  //Uncomment the line below to enable animation.
  //aurelia.use.plugin('aurelia-animator-css');
  //if the css animator is enabled, add swap-order="after" to all router-view elements

  //Anyone wanting to use HTMLImports to load views, will need to install the following plugin.
  //aurelia.use.plugin('aurelia-html-import-template-loader')
=======
    .feature('resources')
    .plugin('aurelia-animator-css')
    .plugin('aurelia-dialog');

  if (environment.debug) {
    aurelia.use.developmentLogging();
  }

  if (environment.testing) {
    aurelia.use.plugin('aurelia-testing');
  }
>>>>>>> 3420a262dfab67117259d7ac478654b59464ab67

  aurelia.start().then(() => aurelia.setRoot());
}
