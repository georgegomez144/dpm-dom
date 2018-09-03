/* 
  DpmDOM (D_)
  Created by: George Gomez
  Contact: george144k.dev@gmail.com
  Date Created: 07/25/2018
*/

const D = (function (win, undefined) {

  // for internal debugging
  const $log = console;

  // internal use of prototypes
  if (!Array.prototype.forEach) {
    Array.prototype.forEach = function(callback/*, thisArg*/) {
      var T, k;
      if (this == null) throw new TypeError('this is null or not defined');
      var O = Object(this);
      var len = O.length >>> 0;
      if (typeof callback !== 'function') throw new TypeError(callback + ' is not a function');
      if (arguments.length > 1) T = arguments[1];
      k = 0;
      while (k < len) {
        var kValue;
        if (k in O) {
          kValue = O[k];
          callback.call(T, kValue, k, O);
        }
        k++;
      }
    };
  }
  if (!NodeList.prototype.forEach) NodeList.prototype.forEach = Array.prototype.forEach;

  if (!Array.prototype.map) {
    Array.prototype.map = function(callback/*, thisArg*/) {
      var T, A, k;
      if (this == null) {
        throw new TypeError('this is null or not defined');
      }
      var O = Object(this);
      var len = O.length >>> 0;
      if (typeof callback !== 'function') {
        throw new TypeError(callback + ' is not a function');
      }
      if (arguments.length > 1) {
        T = arguments[1];
      }
      A = new Array(len);
      k = 0;
      while (k < len) {
        var kValue, mappedValue;
        if (k in O) {
          kValue = O[k];
          mappedValue = callback.call(T, kValue, k, O);
          A[k] = mappedValue;
        }
        k++;
      }
      return A;
    };
  }
  if (!NodeList.prototype.map) NodeList.prototype.map = Array.prototype.map;

  // RegExp
  const reg_hasIdSelector = /\#[a-z0-9\-\_]+$/i;
  const reg_hasClassSelector = /(?:\s)?\.[a-z0-9\-\_]+$/i;
  const reg_hasNodeSelector = /[a-z0-9\-\_]+$/i;
  const reg_isNode = /^\<([a-z0-9\-\_]+)\s/i;
  const reg_findId = /(?:\sid\=\"([a-z0-9\-\_]+)\")/i;
  const reg_findClass = /(?:\sclass\=\"([a-z0-9\-\_\s]+)\")/i;
  const reg_findAttrs = /(?:\s(?!class)(?!data\-)(?!id)([a-z0-9\-]+)\=\"([a-z0-9\-\_\s]+)\")/gi;
  const reg_findDataset = /(?:\sdata\-([a-z0-9\-]+)\=\"([a-z0-9\-\_\s]+)\")/i;

  const __dom = function (selector) {
    return new DpmDOM(selector);
  };

  /* Public API */
  function DpmDOM(selector) {
    this.__selector = selector;
    switch (typeof this.__selector) {
      case 'string':
        if (this.__selector.search(reg_isNode) > -1) {
          this[0] = createElement(this.__selector);
          this.length = 1;
        } else {
          const prepSelectorArray = this.__selector.split(',');
          let elements = [];
          for (let i = 0; i < prepSelectorArray.length; i++) {
            const trimmedSelector = prepSelectorArray[i].trim();
            const querySelectorAll = document.querySelectorAll(trimmedSelector);
            for (let q = 0; q < querySelectorAll.length; q++) elements.push(querySelectorAll[q]);
          }
          for (let i = 0; i < elements.length; i++) this[i] = elements[i];
          this.length = elements.length;
        }
        break;
      case 'object':
        this[0] = this.__selector;
        this.length = 1;
        break;
    }
    return this;
  }

  let t;

  DpmDOM.prototype = {
    ready: function (callback) {
      for (t = 0; t < this.length; t++) {
        if (this.__selector === document) {
          document.onreadystatechange = function () {
            if (document.readyState === 'complete') {
              callback();
            }
          };
        } else {
          this[t].addEventListener('load', callback);
        }
      }
    },
    forEach: Array.prototype.forEach,
    map: Array.prototype.map,
    append: function(element) {
      if(typeof element === 'string') element = createElement(element);
      for(t = 0; t < this.length; t++) {
        this[t].appendChild(element);
      }
      return this;
    },
    prepend: function(element) {
      for(t=0;t<this.length;t++) {
        if(typeof element === 'string') element = createElement(element);
        this[t].parentNode.insertBefore(element, this[t]);
      }
      return this;
    },
    addClass: function(classNames) {
      var classNames = classNames.split(' ');
      for(t=0;t<this.length;t++) {
        var $this = this[t]
        classNames.forEach(function(className) {
          $this.classList.add(className)
        })
      }
      return this;
    },
    removeClass: function(classNames) {
      var classNames = classNames ? classNames.split(' ') : classNames;
      console.log('classNames', classNames);
      for(t=0;t<this.length;t++) {
        var $this = this[t]
        if(classNames == undefined || classNames.length == 0) {
          $this.className = ''
        } else {
          classNames.forEach(function(className) {
            $this.classList.remove(className)
          })
        }
      }
      return this;
    },
    prop: function(prop, value) {
      for(t=0;t<this.length;t++) {
        var $this = this[t]
        if( value !== undefined ) {
          $this[prop] = value
        } else {
          return $this[prop]
        }
      }
      return this;
    },
    removeProp: function(prop) {
      for(t=0;t<this.length;t++) {
        var $this = this[t]
        delete $this[prop]
      }
      return this;
    },
    attr: function(attr, value) {
      for(t=0;t<this.length;t++) {
        var $this = this[t]
        if( value !== undefined ) {
          $this.setAttribute(attr,value)
        } else {
          return $this.getAttribute(attr)
        }
      }
      return this;
    },
    removeAttr: function(attr) {
      for(t=0;t<this.length;t++) {
        var $this = this[t]
        $this.removeAttribute(attr)
      }
      return this;
    },
    data: function(data, value) {
      for(t=0;t<this.length;t++) {
        if(!value) {
          return this.dataset[data]
        } else {
          this.dataset[data] = value
        }
      }
      return this;
    },
    css: function() {
      var args = arguments;
      for(t=0;t<this.length;t++) {
        var $this = this[t]
        if(args[0]) {
          if(typeof args[0] === 'object') {
            for(let i in args[0]) {
              $this.style[i] = args[0][i]
            }
          }
          if(typeof args[0] === 'string') {
            if(!args[1]) {
              return $this.style[args[0]]
            } else {
              $this.style[args[0]] = args[1]
            }
          }
        }
      }
      return this;
    }
  };

  /* Internal Functions */
  function createElement(element) {
    var wrapper = document.createElement('div');
    wrapper.innerHTML = element;
    return wrapper.childNodes[0];
  }

  return (__dom);

})(window || this);