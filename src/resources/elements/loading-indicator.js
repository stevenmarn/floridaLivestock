import nprogress from 'nprogress';
import {bindable, noView} from 'aurelia-framework';

nprogress.configure({ showSpinner: false });

@noView(['nprogress/nprogress.css'])
export class LoadingIndicator {
  @bindable loading = false;

  loadingChanged(newValue){
    if (newValue) {
      nprogress.start();
    } else{
      nprogress.done();
    }
  }
}
