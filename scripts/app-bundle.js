define('app',['exports', 'aurelia-router'], function (exports, _aureliaRouter) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.App = undefined;

  function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  }

  var App = exports.App = function () {
    function App() {
      _classCallCheck(this, App);
    }

    App.prototype.configureRouter = function configureRouter(config, router) {
      config.title = 'Florida Livestock';
      config.map([{ route: '', moduleId: 'welcome' }, {
        name: 'notes',
        route: 'notes',
        moduleId: 'notes/index',
        nav: true,
        title: 'Notes',
        href: '#/notes?filter=none',
        settings: { icon: 'file-text' },
        activationStrategy: _aureliaRouter.activationStrategy.invokeLifecycle
      }, { route: 'notebooks', moduleId: 'notebooks/index', nav: true, title: 'Notebooks', settings: { icon: 'book' } }, { route: 'settings', moduleId: 'settings/index', nav: true, title: 'Settings', settings: { icon: 'cog' } }]);

      this.router = router;
    };

    return App;
  }();
});
define('environment',["exports"], function (exports) {
  "use strict";

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = {
    debug: true,
    testing: true
  };
});
define('main',['exports', './environment'], function (exports, _environment) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.configure = configure;

  var _environment2 = _interopRequireDefault(_environment);

  function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : {
      default: obj
    };
  }

  Promise.config({
    warnings: {
      wForgottenReturn: false
    }
  });

  function configure(aurelia) {
    aurelia.use.standardConfiguration().feature('resources').plugin('aurelia-animator-css').plugin('aurelia-dialog');

    if (_environment2.default.debug) {
      aurelia.use.developmentLogging();
    }

    if (_environment2.default.testing) {
      aurelia.use.plugin('aurelia-testing');
    }

    aurelia.start().then(function () {
      return aurelia.setRoot();
    });
  }
});
define('search-bar',["exports"], function (exports) {
  "use strict";

  Object.defineProperty(exports, "__esModule", {
    value: true
  });

  function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  }

  var SearchBar = exports.SearchBar = function () {
    function SearchBar() {
      _classCallCheck(this, SearchBar);
    }

    SearchBar.prototype.activate = function activate() {};

    return SearchBar;
  }();
});
define('welcome',["exports"], function (exports) {
  "use strict";

  Object.defineProperty(exports, "__esModule", {
    value: true
  });

  function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  }

  var Welcome = exports.Welcome = function Welcome() {
    _classCallCheck(this, Welcome);
  };
});
define('backend/database',['exports'], function (exports) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  var lastId = 0;

  function nextId() {
    return ++lastId;
  }

  var defaultNotebook = {
    id: nextId(),
    title: 'My Notes'
  };

  var database = exports.database = {
    nextId: nextId,
    notebooks: [defaultNotebook],
    notes: [{
      id: nextId(),
      notebookId: defaultNotebook.id,
      title: 'Sample Note',
      body: 'This is a sample note. You can type details in here!'
    }]
  };
});
define('backend/server',['exports', './database'], function (exports, _database) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.Server = undefined;

  function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  }

  var Server = exports.Server = function () {
    function Server() {
      _classCallCheck(this, Server);
    }

    Server.prototype.newNote = function newNote() {
      return {
        title: 'New Note',
        body: '',
        notebookId: _database.database.notebooks[0].id
      };
    };

    Server.prototype.hasChanged = function hasChanged(a, b) {
      return a.title !== b.title || a.body !== b.body || a.notebookId !== b.notebookId;
    };

    Server.prototype.getNoteList = function getNoteList(filter) {
      var results = filter && filter !== 'none' ? _database.database.notes.filter(function (x) {
        return x.notebookId === parseInt(filter);
      }) : _database.database.notes;

      results = results.map(function (x) {
        return {
          id: x.id,
          title: x.title,
          body: x.body
        };
      });

      return Promise.resolve(results);
    };

    Server.prototype.getNote = function getNote(id) {
      var found = _database.database.notes.find(function (x) {
        return x.id == id;
      });
      return Promise.resolve(found ? JSON.parse(JSON.stringify(found)) : null);
    };

    Server.prototype.getNotebookList = function getNotebookList() {
      return Promise.resolve(_database.database.notebooks.map(function (x) {
        return {
          id: x.id,
          title: x.title
        };
      }));
    };

    Server.prototype.saveNote = function saveNote(note) {
      var existing = void 0;

      if (note.id) {
        existing = _database.database.notes.find(function (x) {
          return x.id === note.id;
        });
      } else {
        existing = { id: _database.database.nextId() };
        _database.database.notes.push(existing);
      }

      Object.assign(existing, note);
      return Promise.resolve(JSON.parse(JSON.stringify(existing)));
    };

    Server.prototype.createNotebook = function createNotebook(name) {
      var notebook = {
        id: _database.database.nextId(),
        title: name
      };

      _database.database.notebooks.push(notebook);

      return Promise.resolve(JSON.parse(JSON.stringify(notebook)));
    };

    return Server;
  }();
});
define('notebooks/index',['exports', 'backend/server', 'aurelia-framework'], function (exports, _server, _aureliaFramework) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.NotebooksIndex = undefined;

  function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  }

  var _dec, _class;

  var NotebooksIndex = exports.NotebooksIndex = (_dec = (0, _aureliaFramework.inject)(_server.Server), _dec(_class = function () {
    function NotebooksIndex(server) {
      _classCallCheck(this, NotebooksIndex);

      this.server = server;
      this.notebookName = '';
    }

    NotebooksIndex.prototype.activate = function activate() {
      var _this = this;

      return this.server.getNotebookList().then(function (x) {
        return _this.notebookList = x;
      });
    };

    NotebooksIndex.prototype.createNotebook = function createNotebook() {
      var _this2 = this;

      if (!this.notebookName) {
        return Promise.resolve();
      }

      return this.server.createNotebook(this.notebookName).then(function (notebook) {
        _this2.notebookName = '';
        _this2.notebookList.push(notebook);
      });
    };

    return NotebooksIndex;
  }()) || _class);
});
define('notes/detail',['exports', 'backend/server', 'aurelia-router', 'aurelia-event-aggregator', 'resources/dialogs/common-dialogs', 'aurelia-framework'], function (exports, _server, _aureliaRouter, _aureliaEventAggregator, _commonDialogs, _aureliaFramework) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.Detail = undefined;

  function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  }

  var _dec, _class;

  var Detail = exports.Detail = (_dec = (0, _aureliaFramework.inject)(_server.Server, _aureliaRouter.Router, _aureliaEventAggregator.EventAggregator, _commonDialogs.CommonDialogs), _dec(_class = function () {
    function Detail(server, router, ea, commonDialogs) {
      _classCallCheck(this, Detail);

      this.server = server;
      this.router = router;
      this.ea = ea;
      this.commonDialogs = commonDialogs;
    }

    Detail.prototype.canActivate = function canActivate(params) {
      var _this = this;

      return this.server.getNotebookList().then(function (notebooks) {
        return _this.notebooks = notebooks;
      }).then(function () {
        if (!params.noteId) {
          return _this.server.newNote();
        } else {
          return _this.server.getNote(params.noteId);
        }
      }).then(function (note) {
        if (note) {
          _this.edit(note);
        } else {
          return new _aureliaRouter.Redirect('');
        }
      });
    };

    Detail.prototype.activate = function activate() {
      if (this.note.id) {
        this.ea.publish('note:editing', this.note);
      }
    };

    Detail.prototype.canDeactivate = function canDeactivate() {
      if (this.original && this.server.hasChanged(this.note, this.original)) {
        var message = 'You have made changes to your note. Are you sure you wish to navigate away?';

        return this.commonDialogs.showMessage(message, 'Unsaved Changes', ['Yes', 'No']).then(function (result) {
          return !result.wasCancelled;
        });
      }

      return true;
    };

    Detail.prototype.edit = function edit(note) {
      this.note = note;
      this.original = JSON.parse(JSON.stringify(note));
    };

    Detail.prototype.save = function save() {
      var _this2 = this;

      var isNew = !this.note.id;
      this.server.saveNote(this.note).then(function (note) {
        _this2.ea.publish('note:updated', note);
        _this2.edit(note);

        if (isNew) {
          _this2.router.navigateToRoute('edit', { noteId: note.id }, { replace: true, trigger: true });
        }
      });
    };

    return Detail;
  }()) || _class);
});
define('notes/index',['exports', 'backend/server', 'aurelia-event-aggregator', 'aurelia-framework'], function (exports, _server, _aureliaEventAggregator, _aureliaFramework) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.Notes = undefined;

  function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  }

  var _dec, _class;

  var Notes = exports.Notes = (_dec = (0, _aureliaFramework.inject)(_server.Server, _aureliaEventAggregator.EventAggregator), _dec(_class = function () {
    function Notes(server, ea) {
      var _this = this;

      _classCallCheck(this, Notes);

      this.server = server;
      this.ea = ea;
      this.filter = 'none';
      this.noteList = [];

      this.updatedSubscription = this.ea.subscribe('note:updated', function (note) {
        return _this.noteUpdated(note);
      });
      this.editingSubscription = this.ea.subscribe('note:editing', function (note) {
        return _this.noteEditing(note);
      });
    }

    Notes.prototype.configureRouter = function configureRouter(config, router) {
      config.map([{ route: '', moduleId: './no-selection' }, { route: 'new', moduleId: './detail', name: 'new' }, { route: 'edit/:noteId', name: 'edit', moduleId: './detail' }]);

      this.router = router;
    };

    Notes.prototype.activate = function activate(params) {
      var _this2 = this;

      this.filter = params.filter ? params.filter : this.filter;
      return this.server.getNoteList(this.filter).then(function (x) {
        return _this2.noteList = x;
      });
    };

    Notes.prototype.noteUpdated = function noteUpdated(note) {
      var found = this.noteList.find(function (x) {
        return x.id === note.id;
      });
      if (found) {
        Object.assign(found, note);
      } else {
        this.noteList.push(note);
      }
    };

    Notes.prototype.noteEditing = function noteEditing(note) {
      var prev = this.noteList.find(function (x) {
        return x.isActive;
      });
      var next = this.noteList.find(function (x) {
        return x.id === note.id;
      });
      if (next) {
        if (prev) {
          prev.isActive = false;
        }

        next.isActive = true;
      }
    };

    Notes.prototype.detached = function detached() {
      this.updatedSubscription.dispose();
      this.editingSubscription.dispose();
    };

    return Notes;
  }()) || _class);
});
define('notes/no-selection',["exports"], function (exports) {
  "use strict";

  Object.defineProperty(exports, "__esModule", {
    value: true
  });

  function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  }

  var NoSelection = exports.NoSelection = function NoSelection() {
    _classCallCheck(this, NoSelection);
  };
});
define('resources/index',["exports"], function (exports) {
  "use strict";

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.configure = configure;
  function configure(config) {}
});
define('settings/index',['exports'], function (exports) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });

  function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  }

  var _createClass = function () {
    function defineProperties(target, props) {
      for (var i = 0; i < props.length; i++) {
        var descriptor = props[i];
        descriptor.enumerable = descriptor.enumerable || false;
        descriptor.configurable = true;
        if ("value" in descriptor) descriptor.writable = true;
        Object.defineProperty(target, descriptor.key, descriptor);
      }
    }

    return function (Constructor, protoProps, staticProps) {
      if (protoProps) defineProperties(Constructor.prototype, protoProps);
      if (staticProps) defineProperties(Constructor, staticProps);
      return Constructor;
    };
  }();

  var SettingsIndex = exports.SettingsIndex = function () {
    function SettingsIndex() {
      _classCallCheck(this, SettingsIndex);

      this.firstName = 'John';
      this.lastName = 'Doe';
    }

    SettingsIndex.prototype.submit = function submit() {
      alert('Setting saved!');
    };

    _createClass(SettingsIndex, [{
      key: 'fullName',
      get: function get() {
        return this.firstName + ' ' + this.lastName;
      }
    }]);

    return SettingsIndex;
  }();
});
define('resources/dialogs/common-dialogs',['exports', 'aurelia-framework', 'aurelia-dialog', './message-box'], function (exports, _aureliaFramework, _aureliaDialog, _messageBox) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.CommonDialogs = undefined;

  function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  }

  var _dec, _class;

  var CommonDialogs = exports.CommonDialogs = (_dec = (0, _aureliaFramework.inject)(_aureliaDialog.DialogService), _dec(_class = function () {
    function CommonDialogs(dialogService) {
      _classCallCheck(this, CommonDialogs);

      this.dialogService = dialogService;
    }

    CommonDialogs.prototype.showMessage = function showMessage(message) {
      var title = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 'Message';
      var options = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : ['Ok'];

      return this.dialogService.open({ viewModel: _messageBox.MessageBox, model: { message: message, title: title, options: options } });
    };

    return CommonDialogs;
  }()) || _class);
});
define('resources/dialogs/message-box',['exports', 'aurelia-dialog', 'aurelia-framework'], function (exports, _aureliaDialog, _aureliaFramework) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.MessageBox = undefined;

  function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  }

  var _dec, _class;

  var MessageBox = exports.MessageBox = (_dec = (0, _aureliaFramework.inject)(_aureliaDialog.DialogController), _dec(_class = function () {
    function MessageBox(dialogController) {
      _classCallCheck(this, MessageBox);

      this.dialogController = dialogController;
    }

    MessageBox.prototype.activate = function activate(model) {
      this.model = model;
    };

    MessageBox.prototype.selectOption = function selectOption(option) {
      if (isCancel(option)) {
        this.dialogController.cancel(option);
      } else {
        this.dialogController.ok(option);
      }
    };

    return MessageBox;
  }()) || _class);


  function isCancel(option) {
    return ['cancel', 'no'].indexOf(option.toLowerCase()) !== -1;
  }
});
define('resources/elements/loading-indicator',['exports', 'nprogress', 'aurelia-framework'], function (exports, _nprogress, _aureliaFramework) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.LoadingIndicator = undefined;

  var _nprogress2 = _interopRequireDefault(_nprogress);

  function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : {
      default: obj
    };
  }

  function _initDefineProp(target, property, descriptor, context) {
    if (!descriptor) return;
    Object.defineProperty(target, property, {
      enumerable: descriptor.enumerable,
      configurable: descriptor.configurable,
      writable: descriptor.writable,
      value: descriptor.initializer ? descriptor.initializer.call(context) : void 0
    });
  }

  function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  }

  function _applyDecoratedDescriptor(target, property, decorators, descriptor, context) {
    var desc = {};
    Object['ke' + 'ys'](descriptor).forEach(function (key) {
      desc[key] = descriptor[key];
    });
    desc.enumerable = !!desc.enumerable;
    desc.configurable = !!desc.configurable;

    if ('value' in desc || desc.initializer) {
      desc.writable = true;
    }

    desc = decorators.slice().reverse().reduce(function (desc, decorator) {
      return decorator(target, property, desc) || desc;
    }, desc);

    if (context && desc.initializer !== void 0) {
      desc.value = desc.initializer ? desc.initializer.call(context) : void 0;
      desc.initializer = undefined;
    }

    if (desc.initializer === void 0) {
      Object['define' + 'Property'](target, property, desc);
      desc = null;
    }

    return desc;
  }

  function _initializerWarningHelper(descriptor, context) {
    throw new Error('Decorating class property failed. Please ensure that transform-class-properties is enabled.');
  }

  var _dec, _class, _desc, _value, _class2, _descriptor;

  _nprogress2.default.configure({ showSpinner: false });

  var LoadingIndicator = exports.LoadingIndicator = (_dec = (0, _aureliaFramework.noView)(['nprogress/nprogress.css']), _dec(_class = (_class2 = function () {
    function LoadingIndicator() {
      _classCallCheck(this, LoadingIndicator);

      _initDefineProp(this, 'loading', _descriptor, this);
    }

    LoadingIndicator.prototype.loadingChanged = function loadingChanged(newValue) {
      if (newValue) {
        _nprogress2.default.start();
      } else {
        _nprogress2.default.done();
      }
    };

    return LoadingIndicator;
  }(), (_descriptor = _applyDecoratedDescriptor(_class2.prototype, 'loading', [_aureliaFramework.bindable], {
    enumerable: true,
    initializer: function initializer() {
      return false;
    }
  })), _class2)) || _class);
});
define('resources/value-converters/truncate',['exports'], function (exports) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });

  function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  }

  var TruncateValueConverter = exports.TruncateValueConverter = function () {
    function TruncateValueConverter() {
      _classCallCheck(this, TruncateValueConverter);
    }

    TruncateValueConverter.prototype.toView = function toView(value) {
      if (value.length > 50) {
        return value.substring(0, 50) + '...';
      }

      return value;
    };

    return TruncateValueConverter;
  }();
});
define('aurelia-dialog/dialog-configuration',["require", "exports", "./renderer", "./dialog-settings", "./dialog-renderer", "aurelia-pal"], function (require, exports, renderer_1, dialog_settings_1, dialog_renderer_1, aurelia_pal_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var defaultRenderer = dialog_renderer_1.DialogRenderer;
    var resources = {
        'ux-dialog': aurelia_pal_1.PLATFORM.moduleName('./ux-dialog'),
        'ux-dialog-header': aurelia_pal_1.PLATFORM.moduleName('./ux-dialog-header'),
        'ux-dialog-body': aurelia_pal_1.PLATFORM.moduleName('./ux-dialog-body'),
        'ux-dialog-footer': aurelia_pal_1.PLATFORM.moduleName('./ux-dialog-footer'),
        'attach-focus': aurelia_pal_1.PLATFORM.moduleName('./attach-focus')
    };
    // tslint:disable-next-line:max-line-length
    var defaultCSSText = "ux-dialog-container,ux-dialog-overlay{position:fixed;top:0;right:0;bottom:0;left:0}ux-dialog-overlay{opacity:0}ux-dialog-overlay.active{opacity:1}ux-dialog-container{display:block;transition:opacity .2s linear;opacity:0;overflow-x:hidden;overflow-y:auto;-webkit-overflow-scrolling:touch}ux-dialog-container.active{opacity:1}ux-dialog-container>div{padding:30px}ux-dialog-container>div>div{display:block;min-width:300px;width:-moz-fit-content;width:-webkit-fit-content;width:fit-content;height:-moz-fit-content;height:-webkit-fit-content;height:fit-content;margin:auto}ux-dialog-container,ux-dialog-container>div,ux-dialog-container>div>div{outline:0}ux-dialog{display:table;box-shadow:0 5px 15px rgba(0,0,0,.5);border:1px solid rgba(0,0,0,.2);border-radius:5px;padding:3px;min-width:300px;width:-moz-fit-content;width:-webkit-fit-content;width:fit-content;height:-moz-fit-content;height:-webkit-fit-content;height:fit-content;margin:auto;border-image-source:initial;border-image-slice:initial;border-image-width:initial;border-image-outset:initial;border-image-repeat:initial;background:#fff}ux-dialog>ux-dialog-header{display:block;padding:16px;border-bottom:1px solid #e5e5e5}ux-dialog>ux-dialog-header>button{float:right;border:none;display:block;width:32px;height:32px;background:0 0;font-size:22px;line-height:16px;margin:-14px -16px 0 0;padding:0;cursor:pointer}ux-dialog>ux-dialog-body{display:block;padding:16px}ux-dialog>ux-dialog-footer{display:block;padding:6px;border-top:1px solid #e5e5e5;text-align:right}ux-dialog>ux-dialog-footer button{color:#333;background-color:#fff;padding:6px 12px;font-size:14px;text-align:center;white-space:nowrap;vertical-align:middle;-ms-touch-action:manipulation;touch-action:manipulation;cursor:pointer;background-image:none;border:1px solid #ccc;border-radius:4px;margin:5px 0 5px 5px}ux-dialog>ux-dialog-footer button:disabled{cursor:default;opacity:.45}ux-dialog>ux-dialog-footer button:hover:enabled{color:#333;background-color:#e6e6e6;border-color:#adadad}.ux-dialog-open{overflow:hidden}";
    /**
     * A configuration builder for the dialog plugin.
     */
    var DialogConfiguration = (function () {
        function DialogConfiguration(frameworkConfiguration, applySetter) {
            var _this = this;
            this.resources = [];
            this.fwConfig = frameworkConfiguration;
            this.settings = this.fwConfig.container.get(dialog_settings_1.DefaultDialogSettings);
            applySetter(function () { return _this._apply(); });
        }
        DialogConfiguration.prototype._apply = function () {
            var _this = this;
            this.fwConfig.transient(renderer_1.Renderer, this.renderer);
            this.resources.forEach(function (resourceName) { return _this.fwConfig.globalResources(resources[resourceName]); });
            if (this.cssText) {
                aurelia_pal_1.DOM.injectStyles(this.cssText);
            }
        };
        /**
         * Selects the Aurelia conventional defaults for the dialog plugin.
         * @return This instance.
         */
        DialogConfiguration.prototype.useDefaults = function () {
            return this.useRenderer(defaultRenderer)
                .useCSS(defaultCSSText)
                .useStandardResources();
        };
        /**
         * Exports the standard set of dialog behaviors to Aurelia's global resources.
         * @return This instance.
         */
        DialogConfiguration.prototype.useStandardResources = function () {
            return this.useResource('ux-dialog')
                .useResource('ux-dialog-header')
                .useResource('ux-dialog-body')
                .useResource('ux-dialog-footer')
                .useResource('attach-focus');
        };
        /**
         * Exports the chosen dialog element or view to Aurelia's global resources.
         * @param resourceName The name of the dialog resource to export.
         * @return This instance.
         */
        DialogConfiguration.prototype.useResource = function (resourceName) {
            this.resources.push(resourceName);
            return this;
        };
        /**
         * Configures the plugin to use a specific dialog renderer.
         * @param renderer A type that implements the Renderer interface.
         * @param settings Global settings for the renderer.
         * @return This instance.
         */
        DialogConfiguration.prototype.useRenderer = function (renderer, settings) {
            this.renderer = renderer;
            if (settings) {
                Object.assign(this.settings, settings);
            }
            return this;
        };
        /**
         * Configures the plugin to use specific css.
         * @param cssText The css to use in place of the default styles.
         * @return This instance.
         */
        DialogConfiguration.prototype.useCSS = function (cssText) {
            this.cssText = cssText;
            return this;
        };
        return DialogConfiguration;
    }());
    exports.DialogConfiguration = DialogConfiguration;
});

define('aurelia-dialog/renderer',["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    /**
     * An abstract base class for implementors of the basic Renderer API.
     */
    var Renderer = (function () {
        function Renderer() {
        }
        /**
         * Gets an anchor for the ViewSlot to insert a view into.
         * @returns A DOM element.
         */
        Renderer.prototype.getDialogContainer = function () {
            throw new Error('DialogRenderer must implement getDialogContainer().');
        };
        /**
         * Displays the dialog.
         * @returns Promise A promise that resolves when the dialog has been displayed.
         */
        Renderer.prototype.showDialog = function (dialogController) {
            throw new Error('DialogRenderer must implement showDialog().');
        };
        /**
         * Hides the dialog.
         * @returns Promise A promise that resolves when the dialog has been hidden.
         */
        Renderer.prototype.hideDialog = function (dialogController) {
            throw new Error('DialogRenderer must implement hideDialog().');
        };
        return Renderer;
    }());
    exports.Renderer = Renderer;
});

define('aurelia-dialog/dialog-settings',["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    /**
     * @internal
     */
    var DefaultDialogSettings = (function () {
        function DefaultDialogSettings() {
            this.lock = true;
            this.startingZIndex = 1000;
            this.centerHorizontalOnly = false;
            this.rejectOnCancel = false;
            this.ignoreTransitions = false;
        }
        return DefaultDialogSettings;
    }());
    exports.DefaultDialogSettings = DefaultDialogSettings;
});

var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
define('aurelia-dialog/dialog-renderer',["require", "exports", "aurelia-pal", "aurelia-dependency-injection"], function (require, exports, aurelia_pal_1, aurelia_dependency_injection_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var containerTagName = 'ux-dialog-container';
    var overlayTagName = 'ux-dialog-overlay';
    exports.transitionEvent = (function () {
        var transition;
        return function () {
            if (transition) {
                return transition;
            }
            var el = aurelia_pal_1.DOM.createElement('fakeelement');
            var transitions = {
                transition: 'transitionend',
                OTransition: 'oTransitionEnd',
                MozTransition: 'transitionend',
                WebkitTransition: 'webkitTransitionEnd'
            };
            for (var t in transitions) {
                if (el.style[t] !== undefined) {
                    transition = transitions[t];
                    return transition;
                }
            }
            return '';
        };
    })();
    exports.hasTransition = (function () {
        var unprefixedName = 'transitionDuration';
        var el = aurelia_pal_1.DOM.createElement('fakeelement');
        var prefixedNames = ['webkitTransitionDuration', 'oTransitionDuration'];
        var transitionDurationName;
        if (unprefixedName in el.style) {
            transitionDurationName = unprefixedName;
        }
        else {
            transitionDurationName = prefixedNames.find(function (prefixed) { return (prefixed in el.style); });
        }
        return function (element) {
            return !!transitionDurationName && !!(aurelia_pal_1.DOM.getComputedStyle(element)[transitionDurationName]
                .split(',')
                .find(function (duration) { return !!parseFloat(duration); }));
        };
    })();
    var body = aurelia_pal_1.DOM.querySelectorAll('body')[0];
    function getActionKey(e) {
        if ((e.code || e.key) === 'Escape' || e.keyCode === 27) {
            return 'Escape';
        }
        if ((e.code || e.key) === 'Enter' || e.keyCode === 13) {
            return 'Enter';
        }
        return undefined;
    }
    var DialogRenderer = DialogRenderer_1 = (function () {
        function DialogRenderer() {
        }
        DialogRenderer.keyboardEventHandler = function (e) {
            var key = getActionKey(e);
            if (!key) {
                return;
            }
            var top = DialogRenderer_1.dialogControllers[DialogRenderer_1.dialogControllers.length - 1];
            if (!top || !top.settings.keyboard) {
                return;
            }
            var keyboard = top.settings.keyboard;
            if (key === 'Escape'
                && (keyboard === true || keyboard === key || (Array.isArray(keyboard) && keyboard.indexOf(key) > -1))) {
                top.cancel();
            }
            else if (key === 'Enter' && (keyboard === key || (Array.isArray(keyboard) && keyboard.indexOf(key) > -1))) {
                top.ok();
            }
        };
        DialogRenderer.trackController = function (dialogController) {
            if (!DialogRenderer_1.dialogControllers.length) {
                aurelia_pal_1.DOM.addEventListener('keyup', DialogRenderer_1.keyboardEventHandler, false);
            }
            DialogRenderer_1.dialogControllers.push(dialogController);
        };
        DialogRenderer.untrackController = function (dialogController) {
            var i = DialogRenderer_1.dialogControllers.indexOf(dialogController);
            if (i !== -1) {
                DialogRenderer_1.dialogControllers.splice(i, 1);
            }
            if (!DialogRenderer_1.dialogControllers.length) {
                aurelia_pal_1.DOM.removeEventListener('keyup', DialogRenderer_1.keyboardEventHandler, false);
            }
        };
        DialogRenderer.prototype.getOwnElements = function (parent, selector) {
            var elements = parent.querySelectorAll(selector);
            var own = [];
            for (var i = 0; i < elements.length; i++) {
                if (elements[i].parentElement === parent) {
                    own.push(elements[i]);
                }
            }
            return own;
        };
        DialogRenderer.prototype.attach = function (dialogController) {
            var spacingWrapper = aurelia_pal_1.DOM.createElement('div'); // TODO: check if redundant
            spacingWrapper.appendChild(this.anchor);
            this.dialogContainer = aurelia_pal_1.DOM.createElement(containerTagName);
            this.dialogContainer.appendChild(spacingWrapper);
            this.dialogOverlay = aurelia_pal_1.DOM.createElement(overlayTagName);
            var zIndex = typeof dialogController.settings.startingZIndex === 'number'
                ? dialogController.settings.startingZIndex + ''
                : null;
            this.dialogOverlay.style.zIndex = zIndex;
            this.dialogContainer.style.zIndex = zIndex;
            var lastContainer = this.getOwnElements(this.host, containerTagName).pop();
            if (lastContainer && lastContainer.parentElement) {
                this.host.insertBefore(this.dialogContainer, lastContainer.nextSibling);
                this.host.insertBefore(this.dialogOverlay, lastContainer.nextSibling);
            }
            else {
                this.host.insertBefore(this.dialogContainer, this.host.firstChild);
                this.host.insertBefore(this.dialogOverlay, this.host.firstChild);
            }
            dialogController.controller.attached();
            this.host.classList.add('ux-dialog-open');
        };
        DialogRenderer.prototype.detach = function (dialogController) {
            this.host.removeChild(this.dialogOverlay);
            this.host.removeChild(this.dialogContainer);
            dialogController.controller.detached();
            if (!DialogRenderer_1.dialogControllers.length) {
                this.host.classList.remove('ux-dialog-open');
            }
        };
        DialogRenderer.prototype.setAsActive = function () {
            this.dialogOverlay.classList.add('active');
            this.dialogContainer.classList.add('active');
        };
        DialogRenderer.prototype.setAsInactive = function () {
            this.dialogOverlay.classList.remove('active');
            this.dialogContainer.classList.remove('active');
        };
        DialogRenderer.prototype.setupClickHandling = function (dialogController) {
            this.stopPropagation = function (e) { e._aureliaDialogHostClicked = true; };
            this.closeDialogClick = function (e) {
                if (dialogController.settings.overlayDismiss && !e._aureliaDialogHostClicked) {
                    dialogController.cancel();
                }
            };
            this.dialogContainer.addEventListener('click', this.closeDialogClick);
            this.anchor.addEventListener('click', this.stopPropagation);
        };
        DialogRenderer.prototype.clearClickHandling = function () {
            this.dialogContainer.removeEventListener('click', this.closeDialogClick);
            this.anchor.removeEventListener('click', this.stopPropagation);
        };
        DialogRenderer.prototype.centerDialog = function () {
            var child = this.dialogContainer.children[0];
            var vh = Math.max(aurelia_pal_1.DOM.querySelectorAll('html')[0].clientHeight, window.innerHeight || 0);
            child.style.marginTop = Math.max((vh - child.offsetHeight) / 2, 30) + 'px';
            child.style.marginBottom = Math.max((vh - child.offsetHeight) / 2, 30) + 'px';
        };
        DialogRenderer.prototype.awaitTransition = function (setActiveInactive, ignore) {
            var _this = this;
            return new Promise(function (resolve) {
                var renderer = _this;
                var eventName = exports.transitionEvent();
                function onTransitionEnd(e) {
                    if (e.target !== renderer.dialogContainer) {
                        return;
                    }
                    renderer.dialogContainer.removeEventListener(eventName, onTransitionEnd);
                    resolve();
                }
                if (ignore || !exports.hasTransition(_this.dialogContainer)) {
                    resolve();
                }
                else {
                    _this.dialogContainer.addEventListener(eventName, onTransitionEnd);
                }
                setActiveInactive();
            });
        };
        DialogRenderer.prototype.getDialogContainer = function () {
            return this.anchor || (this.anchor = aurelia_pal_1.DOM.createElement('div'));
        };
        DialogRenderer.prototype.showDialog = function (dialogController) {
            var _this = this;
            if (dialogController.settings.host) {
                this.host = dialogController.settings.host;
            }
            else {
                this.host = body;
            }
            var settings = dialogController.settings;
            this.attach(dialogController);
            if (typeof settings.position === 'function') {
                settings.position(this.dialogContainer, this.dialogOverlay);
            }
            else if (!settings.centerHorizontalOnly) {
                this.centerDialog();
            }
            DialogRenderer_1.trackController(dialogController);
            this.setupClickHandling(dialogController);
            return this.awaitTransition(function () { return _this.setAsActive(); }, dialogController.settings.ignoreTransitions);
        };
        DialogRenderer.prototype.hideDialog = function (dialogController) {
            var _this = this;
            this.clearClickHandling();
            DialogRenderer_1.untrackController(dialogController);
            return this.awaitTransition(function () { return _this.setAsInactive(); }, dialogController.settings.ignoreTransitions)
                .then(function () { _this.detach(dialogController); });
        };
        return DialogRenderer;
    }());
    DialogRenderer.dialogControllers = [];
    DialogRenderer = DialogRenderer_1 = __decorate([
        aurelia_dependency_injection_1.transient()
    ], DialogRenderer);
    exports.DialogRenderer = DialogRenderer;
    var DialogRenderer_1;
});

var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
define('aurelia-dialog/ux-dialog',["require", "exports", "aurelia-templating"], function (require, exports, aurelia_templating_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var UxDialog = (function () {
        function UxDialog() {
        }
        return UxDialog;
    }());
    UxDialog = __decorate([
        aurelia_templating_1.customElement('ux-dialog'),
        aurelia_templating_1.inlineView("\n  <template>\n    <slot></slot>\n  </template>\n")
    ], UxDialog);
    exports.UxDialog = UxDialog;
});

var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
define('aurelia-dialog/ux-dialog-header',["require", "exports", "aurelia-templating", "./dialog-controller"], function (require, exports, aurelia_templating_1, dialog_controller_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var UxDialogHeader = (function () {
        function UxDialogHeader(controller) {
            this.controller = controller;
        }
        UxDialogHeader.prototype.bind = function () {
            if (typeof this.showCloseButton !== 'boolean') {
                this.showCloseButton = !this.controller.settings.lock;
            }
        };
        return UxDialogHeader;
    }());
    /**
     * @internal
     */
    UxDialogHeader.inject = [dialog_controller_1.DialogController];
    __decorate([
        aurelia_templating_1.bindable()
    ], UxDialogHeader.prototype, "showCloseButton", void 0);
    UxDialogHeader = __decorate([
        aurelia_templating_1.customElement('ux-dialog-header'),
        aurelia_templating_1.inlineView("\n  <template>\n    <button\n      type=\"button\"\n      class=\"dialog-close\"\n      aria-label=\"Close\"\n      if.bind=\"showCloseButton\"\n      click.trigger=\"controller.cancel()\">\n      <span aria-hidden=\"true\">&times;</span>\n    </button>\n\n    <div class=\"dialog-header-content\">\n      <slot></slot>\n    </div>\n  </template>\n")
    ], UxDialogHeader);
    exports.UxDialogHeader = UxDialogHeader;
});

define('aurelia-dialog/dialog-controller',["require", "exports", "./renderer", "./lifecycle", "./dialog-cancel-error"], function (require, exports, renderer_1, lifecycle_1, dialog_cancel_error_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    /**
     * A controller object for a Dialog instance.
     */
    var DialogController = (function () {
        /**
         * Creates an instance of DialogController.
         */
        function DialogController(renderer, settings, resolve, reject) {
            this.resolve = resolve;
            this.reject = reject;
            this.settings = settings;
            this.renderer = renderer;
        }
        /**
         * @internal
         */
        DialogController.prototype.releaseResources = function () {
            var _this = this;
            return lifecycle_1.invokeLifecycle(this.controller.viewModel || {}, 'deactivate')
                .then(function () { return _this.renderer.hideDialog(_this); })
                .then(function () { _this.controller.unbind(); });
        };
        /**
         * @internal
         */
        DialogController.prototype.cancelOperation = function () {
            if (!this.settings.rejectOnCancel) {
                return { wasCancelled: true };
            }
            throw dialog_cancel_error_1.createDialogCancelError();
        };
        /**
         * Closes the dialog with a successful output.
         * @param output The returned success output.
         */
        DialogController.prototype.ok = function (output) {
            return this.close(true, output);
        };
        /**
         * Closes the dialog with a cancel output.
         * @param output The returned cancel output.
         */
        DialogController.prototype.cancel = function (output) {
            return this.close(false, output);
        };
        /**
         * Closes the dialog with an error result.
         * @param message An error message.
         * @returns Promise An empty promise object.
         */
        DialogController.prototype.error = function (message) {
            var _this = this;
            return this.releaseResources().then(function () { _this.reject(message); });
        };
        /**
         * Closes the dialog.
         * @param ok Whether or not the user input signified success.
         * @param output The specified output.
         * @returns Promise An empty promise object.
         */
        DialogController.prototype.close = function (ok, output) {
            var _this = this;
            if (this.closePromise) {
                return this.closePromise;
            }
            return this.closePromise = lifecycle_1.invokeLifecycle(this.controller.viewModel || {}, 'canDeactivate').catch(function (reason) {
                _this.closePromise = undefined;
                return Promise.reject(reason);
            }).then(function (canDeactivate) {
                if (!canDeactivate) {
                    _this.closePromise = undefined; // we are done, do not block consecutive calls
                    return _this.cancelOperation();
                }
                return _this.releaseResources().then(function () {
                    if (!_this.settings.rejectOnCancel || ok) {
                        _this.resolve({ wasCancelled: !ok, output: output });
                    }
                    else {
                        _this.reject(dialog_cancel_error_1.createDialogCancelError(output));
                    }
                    return { wasCancelled: false };
                }).catch(function (reason) {
                    _this.closePromise = undefined;
                    return Promise.reject(reason);
                });
            });
        };
        return DialogController;
    }());
    /**
     * @internal
     */
    DialogController.inject = [renderer_1.Renderer];
    exports.DialogController = DialogController;
});

define('aurelia-dialog/lifecycle',["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    /**
     * Call a lifecycle method on a viewModel if it exists.
     * @function
     * @param instance The viewModel instance.
     * @param name The lifecycle method name.
     * @param model The model to pass to the lifecycle method.
     * @returns Promise The result of the lifecycle method.
     */
    function invokeLifecycle(instance, name, model) {
        if (typeof instance[name] === 'function') {
            return new Promise(function (resolve) {
                resolve(instance[name](model));
            }).then(function (result) {
                if (result !== null && result !== undefined) {
                    return result;
                }
                return true;
            });
        }
        return Promise.resolve(true);
    }
    exports.invokeLifecycle = invokeLifecycle;
});

define('aurelia-dialog/dialog-cancel-error',["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    /**
     * @internal
     */
    function createDialogCancelError(output) {
        var error = new Error('Operation cancelled.');
        error.wasCancelled = true;
        error.output = output;
        return error;
    }
    exports.createDialogCancelError = createDialogCancelError;
});

var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
define('aurelia-dialog/ux-dialog-body',["require", "exports", "aurelia-templating"], function (require, exports, aurelia_templating_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var UxDialogBody = (function () {
        function UxDialogBody() {
        }
        return UxDialogBody;
    }());
    UxDialogBody = __decorate([
        aurelia_templating_1.customElement('ux-dialog-body'),
        aurelia_templating_1.inlineView("\n  <template>\n    <slot></slot>\n  </template>\n")
    ], UxDialogBody);
    exports.UxDialogBody = UxDialogBody;
});

var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
define('aurelia-dialog/ux-dialog-footer',["require", "exports", "aurelia-templating", "./dialog-controller"], function (require, exports, aurelia_templating_1, dialog_controller_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    /**
     * View-model for footer of Dialog.
     */
    var UxDialogFooter = UxDialogFooter_1 = (function () {
        function UxDialogFooter(controller) {
            this.controller = controller;
            this.buttons = [];
            this.useDefaultButtons = false;
        }
        UxDialogFooter.isCancelButton = function (value) {
            return value === 'Cancel';
        };
        UxDialogFooter.prototype.close = function (buttonValue) {
            if (UxDialogFooter_1.isCancelButton(buttonValue)) {
                this.controller.cancel(buttonValue);
            }
            else {
                this.controller.ok(buttonValue);
            }
        };
        UxDialogFooter.prototype.useDefaultButtonsChanged = function (newValue) {
            if (newValue) {
                this.buttons = ['Cancel', 'Ok'];
            }
        };
        return UxDialogFooter;
    }());
    /**
     * @internal
     */
    UxDialogFooter.inject = [dialog_controller_1.DialogController];
    __decorate([
        aurelia_templating_1.bindable
    ], UxDialogFooter.prototype, "buttons", void 0);
    __decorate([
        aurelia_templating_1.bindable
    ], UxDialogFooter.prototype, "useDefaultButtons", void 0);
    UxDialogFooter = UxDialogFooter_1 = __decorate([
        aurelia_templating_1.customElement('ux-dialog-footer'),
        aurelia_templating_1.inlineView("\n  <template>\n    <slot></slot>\n    <template if.bind=\"buttons.length > 0\">\n      <button type=\"button\"\n        class=\"btn btn-default\"\n        repeat.for=\"button of buttons\"\n        click.trigger=\"close(button)\">\n        ${button}\n      </button>\n    </template>\n  </template>\n")
    ], UxDialogFooter);
    exports.UxDialogFooter = UxDialogFooter;
    var UxDialogFooter_1;
});

var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
define('aurelia-dialog/attach-focus',["require", "exports", "aurelia-templating", "aurelia-pal"], function (require, exports, aurelia_templating_1, aurelia_pal_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var AttachFocus = (function () {
        function AttachFocus(element) {
            this.element = element;
            this.value = true;
        }
        AttachFocus.prototype.attached = function () {
            if (this.value && this.value !== 'false') {
                this.element.focus();
            }
        };
        AttachFocus.prototype.valueChanged = function (newValue) {
            this.value = newValue;
        };
        return AttachFocus;
    }());
    /**
     * @internal
     */
    AttachFocus.inject = [aurelia_pal_1.DOM.Element];
    AttachFocus = __decorate([
        aurelia_templating_1.customAttribute('attach-focus')
    ], AttachFocus);
    exports.AttachFocus = AttachFocus;
});

define('aurelia-dialog/dialog-service',["require", "exports", "aurelia-dependency-injection", "aurelia-metadata", "aurelia-templating", "./dialog-settings", "./dialog-cancel-error", "./lifecycle", "./dialog-controller"], function (require, exports, aurelia_dependency_injection_1, aurelia_metadata_1, aurelia_templating_1, dialog_settings_1, dialog_cancel_error_1, lifecycle_1, dialog_controller_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    /* tslint:enable:max-line-length */
    function whenClosed(onfulfilled, onrejected) {
        return this.then(function (r) { return r.wasCancelled ? r : r.closeResult; }).then(onfulfilled, onrejected);
    }
    function asDialogOpenPromise(promise) {
        promise.whenClosed = whenClosed;
        return promise;
    }
    /**
     * A service allowing for the creation of dialogs.
     */
    var DialogService = (function () {
        function DialogService(container, compositionEngine, defaultSettings) {
            /**
             * The current dialog controllers
             */
            this.controllers = [];
            /**
             * Is there an open dialog
             */
            this.hasOpenDialog = false;
            this.hasActiveDialog = false;
            this.container = container;
            this.compositionEngine = compositionEngine;
            this.defaultSettings = defaultSettings;
        }
        DialogService.prototype.validateSettings = function (settings) {
            if (!settings.viewModel && !settings.view) {
                throw new Error('Invalid Dialog Settings. You must provide "viewModel", "view" or both.');
            }
        };
        // tslint:disable-next-line:max-line-length
        DialogService.prototype.createCompositionContext = function (childContainer, host, settings) {
            return {
                container: childContainer.parent,
                childContainer: childContainer,
                bindingContext: null,
                viewResources: null,
                model: settings.model,
                view: settings.view,
                viewModel: settings.viewModel,
                viewSlot: new aurelia_templating_1.ViewSlot(host, true),
                host: host
            };
        };
        DialogService.prototype.ensureViewModel = function (compositionContext) {
            if (typeof compositionContext.viewModel === 'function') {
                compositionContext.viewModel = aurelia_metadata_1.Origin.get(compositionContext.viewModel).moduleId;
            }
            if (typeof compositionContext.viewModel === 'string') {
                return this.compositionEngine.ensureViewModel(compositionContext);
            }
            return Promise.resolve(compositionContext);
        };
        DialogService.prototype._cancelOperation = function (rejectOnCancel) {
            if (!rejectOnCancel) {
                return { wasCancelled: true };
            }
            throw dialog_cancel_error_1.createDialogCancelError();
        };
        // tslint:disable-next-line:max-line-length
        DialogService.prototype.composeAndShowDialog = function (compositionContext, dialogController) {
            var _this = this;
            if (!compositionContext.viewModel) {
                // provide access to the dialog controller for view only dialogs
                compositionContext.bindingContext = { controller: dialogController };
            }
            return this.compositionEngine.compose(compositionContext).then(function (controller) {
                dialogController.controller = controller;
                return dialogController.renderer.showDialog(dialogController).then(function () {
                    _this.controllers.push(dialogController);
                    _this.hasActiveDialog = _this.hasOpenDialog = !!_this.controllers.length;
                }, function (reason) {
                    if (controller.viewModel) {
                        lifecycle_1.invokeLifecycle(controller.viewModel, 'deactivate');
                    }
                    return Promise.reject(reason);
                });
            });
        };
        /**
         * @internal
         */
        DialogService.prototype.createSettings = function (settings) {
            settings = Object.assign({}, this.defaultSettings, settings);
            if (typeof settings.keyboard !== 'boolean' && !settings.keyboard) {
                settings.keyboard = !settings.lock;
            }
            if (typeof settings.overlayDismiss !== 'boolean') {
                settings.overlayDismiss = !settings.lock;
            }
            Object.defineProperty(settings, 'rejectOnCancel', {
                writable: false,
                configurable: true,
                enumerable: true
            });
            this.validateSettings(settings);
            return settings;
        };
        DialogService.prototype.open = function (settings) {
            var _this = this;
            if (settings === void 0) { settings = {}; }
            // tslint:enable:max-line-length
            settings = this.createSettings(settings);
            var childContainer = settings.childContainer || this.container.createChild();
            var resolveCloseResult;
            var rejectCloseResult;
            var closeResult = new Promise(function (resolve, reject) {
                resolveCloseResult = resolve;
                rejectCloseResult = reject;
            });
            var dialogController = childContainer.invoke(dialog_controller_1.DialogController, [settings, resolveCloseResult, rejectCloseResult]);
            childContainer.registerInstance(dialog_controller_1.DialogController, dialogController);
            closeResult.then(function () {
                removeController(_this, dialogController);
            }, function () {
                removeController(_this, dialogController);
            });
            var compositionContext = this.createCompositionContext(childContainer, dialogController.renderer.getDialogContainer(), dialogController.settings);
            var openResult = this.ensureViewModel(compositionContext).then(function (compositionContext) {
                if (!compositionContext.viewModel) {
                    return true;
                }
                return lifecycle_1.invokeLifecycle(compositionContext.viewModel, 'canActivate', dialogController.settings.model);
            }).then(function (canActivate) {
                if (!canActivate) {
                    return _this._cancelOperation(dialogController.settings.rejectOnCancel);
                }
                // if activation granted, compose and show
                return _this.composeAndShowDialog(compositionContext, dialogController)
                    .then(function () { return ({ controller: dialogController, closeResult: closeResult, wasCancelled: false }); });
            });
            return asDialogOpenPromise(openResult);
        };
        /**
         * Closes all open dialogs at the time of invocation.
         * @return Promise<DialogController[]> All controllers whose close operation was cancelled.
         */
        DialogService.prototype.closeAll = function () {
            return Promise.all(this.controllers.slice(0).map(function (controller) {
                if (!controller.settings.rejectOnCancel) {
                    return controller.cancel().then(function (result) {
                        if (result.wasCancelled) {
                            return controller;
                        }
                        return;
                    });
                }
                return controller.cancel().then(function () { return; }).catch(function (reason) {
                    if (reason.wasCancelled) {
                        return controller;
                    }
                    return Promise.reject(reason);
                });
            })).then(function (unclosedControllers) { return unclosedControllers.filter(function (unclosed) { return !!unclosed; }); });
        };
        return DialogService;
    }());
    /**
     * @internal
     */
    DialogService.inject = [aurelia_dependency_injection_1.Container, aurelia_templating_1.CompositionEngine, dialog_settings_1.DefaultDialogSettings];
    exports.DialogService = DialogService;
    function removeController(service, dialogController) {
        var i = service.controllers.indexOf(dialogController);
        if (i !== -1) {
            service.controllers.splice(i, 1);
            service.hasActiveDialog = service.hasOpenDialog = !!service.controllers.length;
        }
    }
});

define('text!app.html', ['module'], function(module) { module.exports = "<template>\r\n  <require from=\"./search-bar\"></require>\r\n  <require from=\"./app.css\"></require>\r\n  <require from=\"resources/elements/loading-indicator\"></require>\r\n\r\n  <loading-indicator loading.bind=\"router.isNavigating\"></loading-indicator>\r\n\r\n  <header class=\"flex-container\" >\r\n      <search-bar ></search-bar>\r\n    <!--<div class=\"flex-row\">\r\n      <div class=\"title flex-column\">\r\n        Florida Livestock\r\n      </div>\r\n      <input class=\"flex-column left\" type=\"text\" placeholder = \"&#xf002; What are you looking for?\"  />\r\n      <input class=\"flex-column right\" type=\"text\" placeholder = \"&#xf002; Enter your zip code\"  />\r\n      \r\n      <button class=\"right\">Search</button>\r\n      <a class=\"button sell\" href=\"#/notes/new\">Sell My Stuff\r\n        <i class=\"fa fa-camera\"></i></a>\r\n        \r\n    </div>-->\r\n  </header>\r\n\r\n  <main>\r\n    <nav class=\"main\">\r\n      <ul>\r\n        <li repeat.for=\"item of router.navigation\" class=\"${item.isActive ? 'active' : ''}\">\r\n          <a href.bind=\"item.href\" title.bind=\"item.title\">\r\n            <i class=\"fa fa-${item.settings.icon}\"></i>\r\n          </a>\r\n        </li>\r\n      </ul>\r\n    </nav>\r\n\r\n    <router-view></router-view>\r\n  </main>\r\n</template>\r\n"; });
define('text!app.css', ['module'], function(module) { module.exports = "* {\r\n  box-sizing: border-box;\r\n}\r\n\r\n.flex-container {\r\n   display: -webkit-flex;\r\n   display: flex;\r\n}\r\n\r\n.flex-row{\r\n   display: -webkit-flex;\r\n   display: flex;\r\n   -webkit-flex-direction: row;\r\n   flex-direction: row;\r\n}\r\n\r\n.flex-column{\r\n   -webkit-flex-direction: column;\r\n   flex-direction: column;\r\n}\r\n\r\n\r\n.left {\r\n      border-bottom-left-radius: 5px;\r\n      border-top-left-radius: 5px;\r\n}\r\n.right {\r\n      border-bottom-right-radius: 5px;\r\n      border-top-right-radius: 5px;\r\n}\r\nheader .title {\r\n  font-size:2em; \r\n  font-weight:bold; \r\n  font-family:'Segoe UI'\r\n  , Tahoma\r\n  , Geneva\r\n  , Verdana\r\n  , sans-serif; \r\n  width:800px;\r\n  padding-right: 40px;\r\n}\r\n\r\nhtml, body {\r\n  margin: 0;\r\n  padding: 0;\r\n  width: 100%;\r\n  height: 100%;\r\n}\r\n\r\nheader input {\r\n    background: #f3f3f3;\r\n    border: 1px solid #d8d8d8;\r\n    box-shadow: none;\r\n    -webkit-appearance: none;\r\n    height: 35px;\r\n    font-weight: lighter;\r\n    line-height: 17px;\r\n    outline: 0;\r\n    padding: 0 0 0 32px;\r\n    width: 20%;\r\n    height: 100%;\r\n    font-family: FontAwesome;\r\n}\r\nheader {\r\n  padding: 12px;\r\n  background-color:lightsteelblue;\r\n  position: absolute;\r\n  top:0;\r\n  left:0;\r\n  right:0;\r\n  height: 60px;\r\n  width: 100%\r\n}\r\n\r\nheader h1 {\r\n  margin: 0;\r\n  padding: 0;\r\n  float: left;\r\n}\r\n\r\nheader a.button {\r\n  float: right;\r\n  margin-left: .2em;\r\n  background-color: black;\r\n  text-decoration: none;\r\n  width: 140px;\r\n}\r\n\r\nmain {\r\n  position: absolute;\r\n  top: 60px;\r\n  left: 0;\r\n  right: 0;\r\n  bottom: 0;\r\n  display: flex;\r\n  flex-direction: row;\r\n}\r\n\r\nnav.main {\r\n  background: #0092C3;\r\n  border-right: 1px solid gray;\r\n}\r\n\r\nnav > ul {\r\n  margin: 0;\r\n  padding: 0;\r\n  list-style: none;\r\n}\r\n\r\nnav.main > ul > li > a {\r\n  padding: 16px;\r\n  display: block;\r\n}\r\n\r\nnav.main > ul > li > a > i {\r\n  color: white;\r\n  font-size: 22px !important;\r\n}\r\n\r\nnav.main > ul > li.active > a > i {\r\n  text-shadow: 0 0 20px white;\r\n}\r\n\r\nnav.main > ul > li:last-child {\r\n  position: absolute;\r\n  bottom: 0;\r\n}\r\n\r\nmain > router-view {\r\n  flex: 1;\r\n  border-top: 1px solid rgba(128, 128, 128, 0.25);\r\n}\r\n\r\nbutton, a.button {\r\n  padding: 6px 12px;\r\n  color: #fff;\r\n  background-color: #5cb85c;\r\n  border-color: #4cae4c;\r\n  border: 1px solid transparent;\r\n  border-radius: 4px;\r\n  font-size: 14px;\r\n}\r\n\r\nrouter-view {\r\n  display: block;\r\n  height: 100%;\r\n  width: 100%;\r\n}\r\n\r\nsection.au-enter-active {\r\n  -webkit-animation: fadeIn 1s;\r\n  animation: fadeIn 1s;\r\n}\r\n\r\n@-webkit-keyframes fadeIn {\r\n  0% {\r\n    opacity: 0;\r\n  }\r\n  100% {\r\n    opacity: 1;\r\n  }\r\n}\r\n\r\n@keyframes fadeIn {\r\n  0% {\r\n    opacity: 0;\r\n  }\r\n  100% {\r\n    opacity: 1;\r\n  }\r\n}\r\n\r\nai-dialog > ai-dialog-header {\r\n  background: #0092C3;\r\n  color: white;\r\n  border-radius: 4px 4px 0 0;\r\n  font-weight: bold;\r\n  letter-spacing: 1px;\r\n  font-size: 16px;\r\n}"; });
define('text!search-bar.html', ['module'], function(module) { module.exports = "<template>\r\n    <require from=\"./search-bar.css\"></require>\r\n    <div class=\"flex-container\" >\r\n        <div class=\"flex-row\">\r\n            <div class=\"text-nowrap title flex-column col-sm-6 col-md-3\">\r\n                Florida Livestock\r\n            </div>\r\n            <div class=\"flex-column flex-column col-sm-6 col-md-6\">\r\n                <div class=\"flex-row\"></div>\r\n                <!--<i class=\"left fa fa-search\"></i>-->\r\n                <input class=\"flex-column left  col-sm-3 col-md-8\" type=\"text\" placeholder = \"&#xf002; What are you looking for?\"/>\r\n                <a click.delegate=\"detectLocation()\">\r\n                    <i class= \"flex-column fa fa-map-marker\"></i>\r\n                </a>\r\n\r\n                <input class=\"flex-column col-sm-1\" type=\"text\" placeholder = \"&#xf002; Enter your zip code\"  />\r\n                <input class=\"flex-column right col-sm-1\" type=\"text\" placeholder = \"&#xf002; Enter your zip code\"  />\r\n            </div>\r\n            \r\n            <button class=\"right\">Search</button>\r\n            <a class=\"button sell\" href=\"#/notes/new\">Sell My Stuff\r\n                <i class=\"fa fa-camera\"></i></a>\r\n            \r\n        </div>\r\n    </div>\r\n</template>"; });
define('text!search-bar.css', ['module'], function(module) { module.exports = ".flex-container {\r\n  padding: 12px;\r\n  background-color:lightsteelblue;\r\n  position: absolute;\r\n  top:0;\r\n  left:0;\r\n  right:0;\r\n  height: 60px;\r\n  /*width: 100%*/\r\n}\r\n\r\n.title {\r\n  margin: 0;\r\n  padding: 0;\r\n  float: left;\r\n  font-size:2em; \r\n  font-weight:bold; \r\n  font-family:'Segoe UI'\r\n  , Tahoma\r\n  , Geneva\r\n  , Verdana\r\n  , sans-serif; \r\n  /*width:800px;*/\r\n  padding-right: 40px;  \r\n}\r\n\r\na{\r\n    height: 35px;\r\n    background: #f3f3f3;    \r\n}\r\na.button {\r\n\r\n  margin-left: .2em;\r\n  background-color: black;\r\n  text-decoration: none;\r\n  /*width: 150px;*/\r\n}\r\n\r\ninput {\r\n    background: #f3f3f3;\r\n    border: 1px solid #d8d8d8;\r\n    box-shadow: none;\r\n    -webkit-appearance: none;\r\n    height: 35px;\r\n    font-weight: lighter;\r\n    line-height: 17px;\r\n    outline: 0;\r\n    padding: 0 0 0 5px;\r\n    /*width: 20%;*/\r\n    height: 100%;\r\n    font-family: FontAwesome;\r\n}\r\n\r\n.left {\r\n      border-bottom-left-radius: 5px;\r\n      border-top-left-radius: 5px;\r\n}\r\n.right {\r\n      border-bottom-right-radius: 5px;\r\n      border-top-right-radius: 5px;\r\n}\r\n"; });
define('text!welcome.css', ['module'], function(module) { module.exports = ".welcome {\r\n  width: 100%;\r\n  height: 100%;\r\n\r\n  display: flex;\r\n\r\n  align-items: center;\r\n  justify-content: center;\r\n  font-size: 28px;\r\n}\r\n"; });
define('text!welcome.html', ['module'], function(module) { module.exports = "<template>\r\n  <require from=\"./welcome.css\"></require>\r\n\r\n  <section class=\"welcome\">\r\n    Loading <i class=\"fa fa-spinner fa-pulse\"></i>\r\n  </section>\r\n</template>\r\n"; });
define('text!notebooks/index.css', ['module'], function(module) { module.exports = "section.notebook-list {\r\n  display: flex;\r\n  flex-direction: column;\r\n  height: 100%;\r\n}\r\n\r\n\r\nsection.notebook-list ul {\r\n  margin: 0;\r\n  padding: 0;\r\n  list-style: none;\r\n}\r\n\r\nsection.notebook-list li {\r\n  border-bottom: 1px solid #F1F0F0;\r\n  padding: 12px;\r\n}\r\n\r\nsection.notebook-list h3 {\r\n  margin: 0;\r\n}\r\n\r\nsection.notebook-list a {\r\n  text-decoration: none;\r\n  color: black;\r\n}\r\n\r\nsection.notebook-list > form {\r\n  background-color: #F1F0F0;\r\n  padding: 12px;\r\n  border-bottom: 1px solid rgba(128, 128, 128, 0.25);\r\n}\r\n\r\nsection.notebook-list > form input {\r\n  font-size: 20px;\r\n  position: relative;\r\n  top: 2px;\r\n}\r\n\r\nsection.notebook-list > div {\r\n  flex: 1;\r\n}\r\n"; });
define('text!notebooks/index.html', ['module'], function(module) { module.exports = "<template>\r\n  <require from=\"./index.css\"></require>\r\n\r\n  <section class=\"notebook-list au-animate\">\r\n    <form submit.trigger=\"createNotebook()\">\r\n      <input type=\"text\" value.bind=\"notebookName\">\r\n      <button type=\"submit\">Create Notebook</button>\r\n    </form>\r\n    <div>\r\n      <ul>\r\n        <li repeat.for=\"notebook of notebookList\">\r\n          <a route-href=\"route: notes; params.bind: { filter: notebook.id }\">\r\n            <h3>${notebook.title}</h3>\r\n          </a>\r\n        </li>\r\n      </ul>\r\n    </div>\r\n  </section>\r\n</template>\r\n"; });
define('text!notes/detail.css', ['module'], function(module) { module.exports = ".note {\r\n  padding: 12px;\r\n  display: flex;\r\n  flex-direction: column;\r\n  height: 100%;\r\n}\r\n\r\n.note div.body {\r\n  flex: 1;\r\n  position: relative;\r\n}\r\n\r\n.note div.notebook-selector {\r\n  float: right;\r\n  margin-top: 8px;\r\n}\r\n\r\n.note div.notebook-selector span {\r\n  position: relative;\r\n  top: 2px;\r\n}\r\n\r\n.note input {\r\n  font-size: 28px;\r\n  background-color: transparent;\r\n  border: none;\r\n  outline: none;\r\n}\r\n\r\n.note textarea {\r\n  background: transparent;\r\n  resize: none;\r\n  outline: none;\r\n  border: none;\r\n  height: 100%;\r\n  font-size: 18px;\r\n  position: absolute;\r\n  top: 0;\r\n  left: 0;\r\n  width: 100%;\r\n  bottom: 0;\r\n}\r\n\r\n.note .button-bar {\r\n  text-align: right;\r\n}\r\n"; });
define('text!notes/detail.html', ['module'], function(module) { module.exports = "<template>\r\n  <require from=\"./detail.css\"></require>\r\n\r\n  <form class=\"note\" submit.trigger=\"save()\">\r\n    <div class=\"title\">\r\n      <input type=\"text\" value.bind=\"note.title\" placeholder=\"title\">\r\n\r\n      <div class=\"notebook-selector\">\r\n        <span>In </span>\r\n        <select value.bind=\"note.notebookId\">\r\n          <option repeat.for=\"notebook of notebooks\" model.bind=\"notebook.id\">${notebook.title}</option>\r\n        </select>\r\n      </div>\r\n    </div>\r\n\r\n    <div class=\"body\">\r\n      <textarea value.bind=\"note.body\" placeholder=\"body\"></textarea>\r\n    </div>\r\n\r\n    <div class=\"button-bar\">\r\n      <button type=\"submit\">Save</button>\r\n    </div>\r\n  </form>\r\n</template>\r\n"; });
define('text!notes/index.css', ['module'], function(module) { module.exports = ".notes {\r\n  display: flex;\r\n  flex-direction: row;\r\n  height: 100%;\r\n}\r\n\r\n.notes .list {\r\n  padding: 8px;\r\n  width: 264px;\r\n  border-right: 1px solid rgba(128, 128, 128, 0.25);\r\n}\r\n\r\n.notes .list li {\r\n  padding: 12px;\r\n  border: 1px solid rgba(128, 128, 128, 0.25);\r\n  margin: 4px;\r\n  border-radius: 4px;\r\n}\r\n\r\n.notes .list li.active {\r\n  border-color: #0092C3;\r\n  box-shadow: 0 0 5px #0092C3;\r\n}\r\n\r\n.notes .list p, .notes .list h3 {\r\n  margin: 0;\r\n}\r\n\r\n.notes .list a {\r\n  text-decoration: none;\r\n  color: black;\r\n}\r\n\r\n.notes .detail {\r\n  flex: 1;\r\n  height: 100%;\r\n}\r\n"; });
define('text!notes/index.html', ['module'], function(module) { module.exports = "<template>\r\n  <require from=\"./index.css\"></require>\r\n  <require from=\"resources/value-converters/truncate\"></require>\r\n\r\n  <section class=\"notes au-animate\">\r\n    <nav class=\"list\">\r\n      <ul>\r\n        <li repeat.for=\"note of noteList\" class=\"${note.isActive ? 'active' : ''}\">\r\n          <a route-href=\"route: edit; params.bind: {noteId: note.id}\">\r\n            <h3>${note.title}</h3>\r\n            <p>${note.body | truncate}</p>\r\n          </a>\r\n        </li>\r\n      </ul>\r\n    </nav>\r\n\r\n    <section class=\"detail\">\r\n      <router-view></router-view>\r\n    </section>\r\n  </section>\r\n</template>\r\n"; });
define('text!notes/no-selection.css', ['module'], function(module) { module.exports = ".no-note-selected {\r\n  width: 100%;\r\n  height: 100%;\r\n\r\n  display: flex;\r\n\r\n  align-items: center;\r\n  justify-content: center;\r\n  font-size: 28px;\r\n}\r\n"; });
define('text!notes/no-selection.html', ['module'], function(module) { module.exports = "<template>\r\n  <require from=\"./no-selection.css\"></require>\r\n\r\n  <section class=\"no-note-selected\">\r\n    Please select a note or&nbsp;<a route-href=\"route: new\">create a new note</a>.\r\n  </section>\r\n</template>\r\n"; });
define('text!settings/index.css', ['module'], function(module) { module.exports = "section.settings {\r\n  padding: 12px;\r\n}\r\n"; });
define('text!settings/index.html', ['module'], function(module) { module.exports = "<template>\r\n  <require from=\"./index.css\"></require>\r\n\r\n  <section class=\"settings au-animate\">\r\n    <form role=\"form\" submit.trigger=\"submit()\">\r\n      <div class=\"form-group\">\r\n        <label for=\"fn\">First Name</label>\r\n        <input type=\"text\" value.bind=\"firstName\" class=\"form-control\" id=\"fn\" placeholder=\"first name\">\r\n      </div>\r\n      <div class=\"form-group\">\r\n        <label for=\"ln\">Last Name</label>\r\n        <input type=\"text\" value.bind=\"lastName\" class=\"form-control\" id=\"ln\" placeholder=\"last name\">\r\n      </div>\r\n      <div class=\"form-group\">\r\n        <label>Full Name</label>\r\n        <p class=\"help-block\">${fullName}</p>\r\n      </div>\r\n      <button type=\"submit\" class=\"btn btn-default\">Submit</button>\r\n    </form>\r\n  </section>\r\n</template>\r\n"; });
define('text!resources/dialogs/message-box.html', ['module'], function(module) { module.exports = "<template>\r\n  <ai-dialog style=\"max-width: 325px\">\r\n    <ai-dialog-header>${model.title}</ai-dialog-header>\r\n\r\n    <ai-dialog-body>\r\n      ${model.message}\r\n    </ai-dialog-body>\r\n\r\n    <ai-dialog-footer>\r\n      <button repeat.for=\"option of model.options\" click.trigger=\"selectOption(option)\">${option}</button>\r\n    </ai-dialog-footer>\r\n  </ai-dialog>\r\n</template>"; });
//# sourceMappingURL=app-bundle.js.map