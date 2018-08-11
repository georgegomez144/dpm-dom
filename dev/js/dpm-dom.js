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
  NodeList.prototype.forEach = Array.prototype.forEach = function(callback, context) {
    for ( let i = 0; i < this.length; i++ ) {
      if(context) {
        let bindContext = callback.bind(context);
        bindContext(this[i], i);
      } else {
        let bindThis = callback.bind(this)
        bindThis(this[i], i);
      }
    }
    return (context) ? context : this;
  };
  Object.prototype.forEach = function(callback, context) {
    const keys = Object.keys(this);
    for ( let i in keys ) {
      if(context) {
        let bindContext = callback.bind(context);
        bindContext(this[keys[i]], keys[i]);
      } else {
        let bindThis = callback.bind(this)
        bindThis(this[keys[i]], keys[i]);
      }
    }
    return (context) ? context : this;
  };
  NodeList.prototype.map = Array.prototype.map = function(callback, context) {
    let newArray = [];
    for ( let i = 0; i < this.length; i++ ) {
      if(context) {
        let bindContext = callback.bind(context);
        bindContext(this[i], i);
      } else {
        let bindThis = callback.bind(this)
        bindThis(this[i], i);
      }
      newArray[i] = this[i];
    }
    return newArray;
  };
  Object.prototype.map = function(callback, context) {
    let newObject = {};
    const keys = Object.keys(this);
    for ( let i in keys ) {
      if(context) {
        let bindContext = callback.bind(context);
        bindContext(this[keys[i]], keys[i]);
      } else {
        let bindThis = callback.bind(this)
        bindThis(this[keys[i]], keys[i]);
      }
      newObject[keys[i]] = this[keys[i]];
    }
    return newObject;
  };

  const array1 = ['name','email','address'];
  const array2 = ['other','newname'];
  const object1 = {name:'george',email:'george144k.dev@gmail.com',number:'800-987-1523'};

  object1.forEach(function(v,i) {
    v = i + ' ' + v;
  });
  console.log(object1);

  let newArray = array1.map(function(v,i) {
    v = v + ' addition';
  });
  console.log(newArray);

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
    forEach: function(callback) {
      for ( t = 0; t < this.length; t++ ) callback(this[t], t);
      return this;
    },
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
    addClass: function(className) {
      var classNames = className.split(' ');

      return this;
    },
    removeClass: function(className) {
      if(!className) {
        // remove all classes
      } else {

      }
      return this;
    },
    prop: function(prop, value) {},
    attr: function(attr, value) {},
    removeAttr: function(attr) {},
    data: function(data, value) {},
    css: function(styles) {}
  };

  /* Internal Functions */
  function createElement(element) {
    var wrapper = document.createElement('div');
    wrapper.innerHTML = element;
    return wrapper.childNodes[0];
  }

  return (__dom);

})(window || this);