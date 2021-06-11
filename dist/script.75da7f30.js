// modules are defined as an array
// [ module function, map of requires ]
//
// map of requires is short require name -> numeric require
//
// anything defined in a previous bundle is accessed via the
// orig method which is the require for previous bundles
parcelRequire = (function (modules, cache, entry, globalName) {
  // Save the require from previous bundle to this closure if any
  var previousRequire = typeof parcelRequire === 'function' && parcelRequire;
  var nodeRequire = typeof require === 'function' && require;

  function newRequire(name, jumped) {
    if (!cache[name]) {
      if (!modules[name]) {
        // if we cannot find the module within our internal map or
        // cache jump to the current global require ie. the last bundle
        // that was added to the page.
        var currentRequire = typeof parcelRequire === 'function' && parcelRequire;
        if (!jumped && currentRequire) {
          return currentRequire(name, true);
        }

        // If there are other bundles on this page the require from the
        // previous one is saved to 'previousRequire'. Repeat this as
        // many times as there are bundles until the module is found or
        // we exhaust the require chain.
        if (previousRequire) {
          return previousRequire(name, true);
        }

        // Try the node require function if it exists.
        if (nodeRequire && typeof name === 'string') {
          return nodeRequire(name);
        }

        var err = new Error('Cannot find module \'' + name + '\'');
        err.code = 'MODULE_NOT_FOUND';
        throw err;
      }

      localRequire.resolve = resolve;
      localRequire.cache = {};

      var module = cache[name] = new newRequire.Module(name);

      modules[name][0].call(module.exports, localRequire, module, module.exports, this);
    }

    return cache[name].exports;

    function localRequire(x){
      return newRequire(localRequire.resolve(x));
    }

    function resolve(x){
      return modules[name][1][x] || x;
    }
  }

  function Module(moduleName) {
    this.id = moduleName;
    this.bundle = newRequire;
    this.exports = {};
  }

  newRequire.isParcelRequire = true;
  newRequire.Module = Module;
  newRequire.modules = modules;
  newRequire.cache = cache;
  newRequire.parent = previousRequire;
  newRequire.register = function (id, exports) {
    modules[id] = [function (require, module) {
      module.exports = exports;
    }, {}];
  };

  var error;
  for (var i = 0; i < entry.length; i++) {
    try {
      newRequire(entry[i]);
    } catch (e) {
      // Save first error but execute all entries
      if (!error) {
        error = e;
      }
    }
  }

  if (entry.length) {
    // Expose entry point to Node, AMD or browser globals
    // Based on https://github.com/ForbesLindesay/umd/blob/master/template.js
    var mainExports = newRequire(entry[entry.length - 1]);

    // CommonJS
    if (typeof exports === "object" && typeof module !== "undefined") {
      module.exports = mainExports;

    // RequireJS
    } else if (typeof define === "function" && define.amd) {
     define(function () {
       return mainExports;
     });

    // <script>
    } else if (globalName) {
      this[globalName] = mainExports;
    }
  }

  // Override the current require with this new one
  parcelRequire = newRequire;

  if (error) {
    // throw error from earlier, _after updating parcelRequire_
    throw error;
  }

  return newRequire;
})({"components/navigation.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var Navigation = /*#__PURE__*/function () {
  function Navigation(links, pages) {
    _classCallCheck(this, Navigation);

    this.links = links;
    this.pages = pages;
    this.currentPage = null;
  }

  _createClass(Navigation, [{
    key: "getLinks",
    value: function getLinks() {
      console.log(this.links);
    }
  }, {
    key: "setPage",
    value: function setPage(pageId) {
      var _this = this;

      this.currentPage = pageId;
      console.log(this.currentPage);
      this.links.forEach(function (link) {
        link.classList.remove('active');

        if (_this.getHash(link) === pageId) {
          link.classList.add('active');
        }
      });
      this.pages.forEach(function (page) {
        page.style.display = 'none';
      });
      document.getElementById(pageId).style.display = "block";
    }
  }, {
    key: "getHash",
    value: function getHash(link) {
      return link.href.split("#")[1];
    }
  }]);

  return Navigation;
}();

var _default = Navigation;
exports.default = _default;
},{}],"components/tasklist.js":[function(require,module,exports) {
function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var form = document.getElementById("taskform");
var button = document.querySelector("#taskform > button");
var taskInput = document.getElementById("taskInput");
var tasklist = document.querySelector("#tasklist > ul");
var tasklistundo = document.querySelector("#undolist");
var tasklistdoing = document.querySelector("#doinglist");
var tasklistdone = document.querySelector("#donelist");
var dueDateInput = document.getElementById("dueDateInput");
var completionTimeInput = document.getElementById("completionTimeInput");
var estimatedTimeInput = document.getElementById("estimatedTimeInput");
var priorityInput = document.getElementById("priorityInput");
var clockTime;
form.addEventListener("submit", function (event) {
  event.preventDefault();
  var task = taskInput.value;
  var dueDate = dueDateInput.value;
  var completionTime = completionTimeInput.value;
  var estimatedTime = estimatedTimeInput.value;
  var priorityRating = priorityInput.options[priorityInput.selectedIndex].value;

  if (task) {
    addTask(task, dueDate, estimatedTime, priorityRating, completionTime, 0);
  }
});
var taskListArray = [];

function addTask(taskDescription, dueDate, estimatedTime, priorityRating, completionTime, completionStatus) {
  var _task;

  var d = new Date();
  var dateCreated = d.getFullYear();
  var elapsedTime = 0; // Total elapsed time: initialized as zero with the unit second 

  var beginningElapsedTime = 0; // Beginning elapsed time: initialized as zero with the unit second, used for updating doing tasks

  var task = (_task = {
    id: Date.now(),
    taskDescription: taskDescription,
    dueDate: dueDate,
    dateCreated: dateCreated,
    estimatedTime: estimatedTime,
    completionTime: completionTime,
    priorityRating: priorityRating
  }, _defineProperty(_task, "estimatedTime", estimatedTime), _defineProperty(_task, "completionStatus", completionStatus), _defineProperty(_task, "elapsedTime", elapsedTime), _defineProperty(_task, "beginningElapsedTime", beginningElapsedTime), _task);
  taskListArray.push(task);
  renderTask(task);
}

function renderTask(task) {
  // Create HTML elements 
  // <div class="item">
  //                         <img src="images/icon.png">
  //                         <div class="taskcont"> 
  //                             <span>TaskB</span>
  //                             <div class="tasksubcont">
  //                                 <p>sjlkjgewsjlkjgewsjlkjgews</p>
  //                             </div>
  //                         </div>
  //                     </div>
  var item = document.createElement("div");
  item.setAttribute('data-id', task.id);
  item.setAttribute('class', 'item');
  item.innerHTML = "<button class='" + task.priorityRating + "'>" + task.priorityRating + "</button>" + "<div class='taskcont'> " + "<span style='display:none'>" + task.id + "</span>" + "<div class='tasksubcont'>" + "<p>" + getElapsedTime(task) + "</p>" + "<p>" + task.taskDescription + "</p>" + "</div>" + "</div>";
  tasklistundo.appendChild(item); // let item = document.createElement("li");
  // item.setAttribute('data-id',task.id);
  // item.innerHTML = "<p>" + task.taskDescription + "</p>";
  // tasklist.appendChild(item);
  // Extra Task DOM elements

  var delButton = document.createElement("button");
  delButton.setAttribute('class', 'deletebtn');
  var delButtonText = document.createTextNode("Delete");
  delButton.appendChild(delButtonText);
  item.appendChild(delButton);
  var startButton = document.createElement("button");
  startButton.setAttribute('class', 'startbtn');
  var startButtonText = document.createTextNode("Start");
  startButton.appendChild(startButtonText);
  item.appendChild(startButton);
  var restartButton = document.createElement("button");
  restartButton.setAttribute('class', 'startbtn');
  var restartButtonText = document.createTextNode("Restart");
  restartButton.appendChild(restartButtonText);
  item.appendChild(restartButton); // Event Listeners for DOM elements

  delButton.addEventListener("click", function (event) {
    event.preventDefault();
    var id = event.target.parentElement.getAttribute('data-id');
    var index = taskListArray.findIndex(function (task) {
      return task.id === Number(id);
    });
    removeItemFromArray(taskListArray, index);
    console.log(taskListArray);
    item.remove();
    updateEmpty();
  }); //delete from taskListArray to 

  startButton.addEventListener("click", function (event) {
    event.preventDefault();
    var id = event.target.parentElement.getAttribute('data-id');
    task.status = 2; // let index = taskListArray.findIndex(task => task.id === Number(id));
    // updateItemFromArray(taskListArray,index);

    console.log(taskListArray);
    item.remove();
    updateEmpty();
    addItemForDoing(task);
  });
  restartButton.addEventListener("click", function (event) {
    event.preventDefault();
    var id = event.target.parentElement.getAttribute('data-id');
    task.elapsedTime = 0;
    task.beginningElapsedTime = 0; // let index = taskListArray.findIndex(task => task.id === Number(id));
    // updateItemFromArray(taskListArray,index);

    console.log(taskListArray);
    item.remove();
    addItemForDoing(task);
    updateEmpty();
  }); // Clear the input form

  form.reset();
  updateEmpty();
}
/*
*
*/


function addItemForDoing(task) {
  // Create HTML elements 
  var item = document.createElement("div");
  item.setAttribute('data-id', task.id);
  item.setAttribute('class', 'item');
  item.innerHTML = "<button class='" + task.priorityRating + "'>" + task.priorityRating + "</button>" + "<p class='djs' id='djs_" + task.priorityRating + "'>00:00:00</p>" + "<div class='taskcont'> " + "<span style='display:none'> " + task.id + "</span>" + "<div class='tasksubcont'>" + "<p id = 'djs_elapsedTime'>" + getElapsedTime(task) + "</p>" + "<p>" + task.taskDescription + "</p>" + "</div>" + "</div>";
  tasklistdoing.appendChild(item);
  var delButton = document.createElement("button");
  delButton.setAttribute('class', 'deletebtn');
  var delButtonText = document.createTextNode("Delete");
  delButton.appendChild(delButtonText);
  item.appendChild(delButton);
  var endButton = document.createElement("button");
  endButton.setAttribute('class', 'startbtn');
  var endButtonText = document.createTextNode("Complete");
  endButton.appendChild(endButtonText);
  item.appendChild(endButton);
  var stopButton = document.createElement("button");
  stopButton.setAttribute('class', 'startbtn');
  var stopButtonText = document.createTextNode("Stop");
  stopButton.appendChild(stopButtonText);
  item.appendChild(stopButton);
  var restartButton = document.createElement("button");
  restartButton.setAttribute('class', 'startbtn');
  var restartButtonText = document.createTextNode("Restart");
  restartButton.appendChild(restartButtonText);
  item.appendChild(restartButton);
  updateTime(new Date(), "djs_" + task.priorityRating, task);
  restartButton.addEventListener("click", function (event) {
    event.preventDefault();
    clearInterval(clockTime);
    task.elapsedTime = 0;
    task.beginningElapsedTime = 0;
    updateTime(new Date(), "djs_" + task.priorityRating, task);
  });
  stopButton.addEventListener("click", function (event) {
    event.preventDefault();
    task.beginningElapsedTime = task.elapsedTime;
    clearInterval(clockTime);
    item.remove();
    addItemForNotDone(task);
    updateEmpty();
  }); // Event Listeners for DOM elements

  delButton.addEventListener("click", function (event) {
    event.preventDefault();
    var id = event.target.parentElement.getAttribute('data-id');
    var index = taskListArray.findIndex(function (task) {
      return task.id === Number(id);
    });
    removeItemFromArray(taskListArray, index);
    console.log(taskListArray);
    item.remove();
    updateEmpty();
  }); //delete from taskListArray to 

  endButton.addEventListener("click", function (event) {
    event.preventDefault();
    var id = event.target.parentElement.getAttribute('data-id');
    task.status = 3; // let index = taskListArray.findIndex(task => task.id === Number(id));
    // updateItemFromArray(taskListArray,index,status);

    item.remove();
    addItemForDone(task);
    updateEmpty();
  });
  updateEmpty();
}

function addItemForNotDone(task) {
  renderTask(task);
}

function addItemForDone(task) {
  updateEmpty(); // Create HTML elements 

  var item = document.createElement("div");
  item.setAttribute('data-id', task.id);
  item.setAttribute('class', 'item');
  item.innerHTML = "<button class='" + task.priorityRating + "'>" + task.priorityRating + "</button>" + "<div class='taskcont'> " + "<span style='display:none'>" + task.id + "</span>" + "<div class='tasksubcont'>" + "<p>" + getElapsedTime(task) + "</p>" + "<p>" + task.taskDescription + "</p>" + "</div>" + "</div>";
  tasklistdone.appendChild(item);
}

function removeItemFromArray(arr, index) {
  if (index > -1) {
    arr.splice(index, 1);
  }

  return arr;
}

function updateEmpty() {
  if (document.getElementById('donelist').getElementsByClassName("item").length > 0) {
    document.getElementById('donelistp').style.display = 'none';
  } else {
    document.getElementById('donelistp').style.display = 'block';
  }

  if (document.getElementById('undolist').getElementsByClassName("item").length > 0) {
    document.getElementById('undolistp').style.display = 'none';
  } else {
    document.getElementById('undolistp').style.display = 'block';
  } // if(document.getElementById('nextuplistp').getElementsByClassName("item").length>0){
  //     document.getElementById('nextuplistp').style.display = 'none';
  // }else{
  //     document.getElementById('nextuplistp').style.display = 'block';
  // }


  if (document.getElementById('doinglist').getElementsByClassName("item").length > 0) {
    document.getElementById('doinglistp').style.display = 'none';
  } else {
    document.getElementById('doinglistp').style.display = 'block';
  } // if(taskListArray.length > 0){
  //     document.getElementById('emptyList').style.display = 'none';
  // }else{
  //     document.getElementById('emptyList').style.display = 'block';
  // }

}

function updateTime(timestr, id, task) {
  clockTime = setInterval(function () {
    var nowTime = new Date(); //now time
    //create time
    // var endTime = new Date(timestr);
    // var seconds = parseInt((endTime.getTime() - nowTime.getTime()) / 1000);//sub

    var seconds = parseInt((nowTime.getTime() - timestr.getTime()) / 1000); //sub(s)
    // var d = parseInt(seconds / 3600 / 24);//d

    var h = parseInt(seconds / 3600); //h

    var m = parseInt(seconds / 60 % 60); //m

    var s = parseInt(seconds % 60); //s

    if (h < 10) h = "0" + h;
    if (m < 10) m = "0" + m;
    if (s < 10) s = "0" + s;
    document.getElementById(id).innerHTML = h + ":" + m + ":" + s; // Elapsed Time

    task.elapsedTime = task.beginningElapsedTime + seconds;
    document.getElementById('djs_elapsedTime').innerHTML = getElapsedTime(task);
  }, 1000);
} //Get String of Elapsed Time for displaying


function getElapsedTime(task) {
  var seconds = task.elapsedTime;
  var h = parseInt(seconds / 3600); //h

  var m = parseInt(seconds / 60 % 60); //m

  var s = parseInt(seconds % 60); //s

  if (h < 10) h = "0" + h;
  if (m < 10) m = "0" + m;
  if (s < 10) s = "0" + s;
  return "Total Time  Consumption: " + h + ":" + m + ":" + s;
}
},{}],"components/search.js":[function(require,module,exports) {
var searchbtn = document.getElementById("searchbtn");
var searchInput = document.getElementById("searchInput");
var getAnswer = document.querySelector("#getAnswer");
var Http = new XMLHttpRequest();
var url = "https://api.dictionaryapi.dev/api/v2/entries/en_US/";
searchbtn.addEventListener("click", function (event) {
  event.preventDefault();
  var getAnswerP = document.getElementById("getAnswer");
  getAnswerP.innerHTML = ""; // var child=document.getElementById('getAnswerCont');
  // getAnswerP.removeChild(child);

  searchForApi(searchInput.value);
});

function searchForApi(searchWord) {
  Http.open("GET", url + searchWord);
  Http.send();

  Http.onreadystatechange = function () {
    if (this.readyState === 4 && this.status === 200) {
      var data = JSON.parse(Http.responseText);

      for (var i = 0; i < data.length; i++) {
        var datason = data[i].meanings;

        for (var j = 0; j < datason.length; j++) {
          var datasonson = datason[j].definitions;

          for (var m = 0; m < datasonson.length; m++) {
            var item = document.createElement("div");
            item.setAttribute('id', 'getAnswerCont');
            item.innerHTML = "<span class='defintion'>" + datasonson[m].definition + "</span>";
            console.log("=====");

            if (datasonson[m].synonyms) {
              item.innerHTML += "<span class='synonyms'>[" + datasonson[m].synonyms + "]</span>";
            }

            getAnswer.appendChild(item);
          }
        }
      }
    }
  };
}
},{}],"script.js":[function(require,module,exports) {
"use strict";

var _navigation = _interopRequireDefault(require("./components/navigation"));

require("./components/tasklist");

require("./components/search");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var links = document.querySelectorAll('nav > ul > li > a');
var pages = document.querySelectorAll('.page-container');
var nav = new _navigation.default(links, pages);
nav.getLinks();
nav.links.forEach(function (link) {
  link.addEventListener('click', function () {
    var pageId = nav.getHash(link);
    nav.setPage(pageId);
  });
});
var subLinks = document.querySelectorAll('.sub-nav > ul > li > a');
var subPages = document.querySelectorAll('.sub-page-container');
var subNav = new _navigation.default(subLinks, subPages);
subNav.links.forEach(function (link) {
  link.addEventListener('click', function () {
    var pageId = subNav.getHash(link);
    subNav.setPage(pageId);
  });
});
},{"./components/navigation":"components/navigation.js","./components/tasklist":"components/tasklist.js","./components/search":"components/search.js"}],"../node_modules/parcel-bundler/src/builtins/hmr-runtime.js":[function(require,module,exports) {
var global = arguments[3];
var OVERLAY_ID = '__parcel__error__overlay__';
var OldModule = module.bundle.Module;

function Module(moduleName) {
  OldModule.call(this, moduleName);
  this.hot = {
    data: module.bundle.hotData,
    _acceptCallbacks: [],
    _disposeCallbacks: [],
    accept: function (fn) {
      this._acceptCallbacks.push(fn || function () {});
    },
    dispose: function (fn) {
      this._disposeCallbacks.push(fn);
    }
  };
  module.bundle.hotData = null;
}

module.bundle.Module = Module;
var checkedAssets, assetsToAccept;
var parent = module.bundle.parent;

if ((!parent || !parent.isParcelRequire) && typeof WebSocket !== 'undefined') {
  var hostname = "" || location.hostname;
  var protocol = location.protocol === 'https:' ? 'wss' : 'ws';
  var ws = new WebSocket(protocol + '://' + hostname + ':' + "56487" + '/');

  ws.onmessage = function (event) {
    checkedAssets = {};
    assetsToAccept = [];
    var data = JSON.parse(event.data);

    if (data.type === 'update') {
      var handled = false;
      data.assets.forEach(function (asset) {
        if (!asset.isNew) {
          var didAccept = hmrAcceptCheck(global.parcelRequire, asset.id);

          if (didAccept) {
            handled = true;
          }
        }
      }); // Enable HMR for CSS by default.

      handled = handled || data.assets.every(function (asset) {
        return asset.type === 'css' && asset.generated.js;
      });

      if (handled) {
        console.clear();
        data.assets.forEach(function (asset) {
          hmrApply(global.parcelRequire, asset);
        });
        assetsToAccept.forEach(function (v) {
          hmrAcceptRun(v[0], v[1]);
        });
      } else if (location.reload) {
        // `location` global exists in a web worker context but lacks `.reload()` function.
        location.reload();
      }
    }

    if (data.type === 'reload') {
      ws.close();

      ws.onclose = function () {
        location.reload();
      };
    }

    if (data.type === 'error-resolved') {
      console.log('[parcel] ✨ Error resolved');
      removeErrorOverlay();
    }

    if (data.type === 'error') {
      console.error('[parcel] 🚨  ' + data.error.message + '\n' + data.error.stack);
      removeErrorOverlay();
      var overlay = createErrorOverlay(data);
      document.body.appendChild(overlay);
    }
  };
}

function removeErrorOverlay() {
  var overlay = document.getElementById(OVERLAY_ID);

  if (overlay) {
    overlay.remove();
  }
}

function createErrorOverlay(data) {
  var overlay = document.createElement('div');
  overlay.id = OVERLAY_ID; // html encode message and stack trace

  var message = document.createElement('div');
  var stackTrace = document.createElement('pre');
  message.innerText = data.error.message;
  stackTrace.innerText = data.error.stack;
  overlay.innerHTML = '<div style="background: black; font-size: 16px; color: white; position: fixed; height: 100%; width: 100%; top: 0px; left: 0px; padding: 30px; opacity: 0.85; font-family: Menlo, Consolas, monospace; z-index: 9999;">' + '<span style="background: red; padding: 2px 4px; border-radius: 2px;">ERROR</span>' + '<span style="top: 2px; margin-left: 5px; position: relative;">🚨</span>' + '<div style="font-size: 18px; font-weight: bold; margin-top: 20px;">' + message.innerHTML + '</div>' + '<pre>' + stackTrace.innerHTML + '</pre>' + '</div>';
  return overlay;
}

function getParents(bundle, id) {
  var modules = bundle.modules;

  if (!modules) {
    return [];
  }

  var parents = [];
  var k, d, dep;

  for (k in modules) {
    for (d in modules[k][1]) {
      dep = modules[k][1][d];

      if (dep === id || Array.isArray(dep) && dep[dep.length - 1] === id) {
        parents.push(k);
      }
    }
  }

  if (bundle.parent) {
    parents = parents.concat(getParents(bundle.parent, id));
  }

  return parents;
}

function hmrApply(bundle, asset) {
  var modules = bundle.modules;

  if (!modules) {
    return;
  }

  if (modules[asset.id] || !bundle.parent) {
    var fn = new Function('require', 'module', 'exports', asset.generated.js);
    asset.isNew = !modules[asset.id];
    modules[asset.id] = [fn, asset.deps];
  } else if (bundle.parent) {
    hmrApply(bundle.parent, asset);
  }
}

function hmrAcceptCheck(bundle, id) {
  var modules = bundle.modules;

  if (!modules) {
    return;
  }

  if (!modules[id] && bundle.parent) {
    return hmrAcceptCheck(bundle.parent, id);
  }

  if (checkedAssets[id]) {
    return;
  }

  checkedAssets[id] = true;
  var cached = bundle.cache[id];
  assetsToAccept.push([bundle, id]);

  if (cached && cached.hot && cached.hot._acceptCallbacks.length) {
    return true;
  }

  return getParents(global.parcelRequire, id).some(function (id) {
    return hmrAcceptCheck(global.parcelRequire, id);
  });
}

function hmrAcceptRun(bundle, id) {
  var cached = bundle.cache[id];
  bundle.hotData = {};

  if (cached) {
    cached.hot.data = bundle.hotData;
  }

  if (cached && cached.hot && cached.hot._disposeCallbacks.length) {
    cached.hot._disposeCallbacks.forEach(function (cb) {
      cb(bundle.hotData);
    });
  }

  delete bundle.cache[id];
  bundle(id);
  cached = bundle.cache[id];

  if (cached && cached.hot && cached.hot._acceptCallbacks.length) {
    cached.hot._acceptCallbacks.forEach(function (cb) {
      cb();
    });

    return true;
  }
}
},{}]},{},["../node_modules/parcel-bundler/src/builtins/hmr-runtime.js","script.js"], null)
//# sourceMappingURL=/script.75da7f30.js.map