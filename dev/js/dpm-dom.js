/* 
  DpmDOM (D_)
  Created by: George Gomez
  Contact: george144k.dev@gmail.com
  Date Created: 07/25/2018
*/

var D_ = (function (win) {

  // for internal debugging
  var $log = console;

  // RegExp
  var reg_hasIdSelector = /\#[a-z0-9\-\_]+$/i;
  var reg_hasClassSelector = /(?:\s)?\.[a-z0-9\-\_]+$/i;
  var reg_hasNodeSelector = /[a-z0-9\-\_]+$/i;
  var reg_isNode = /^\<([a-z0-9\-\_]+)\s/i;
  var reg_findId = /(?:\sid\=\"([a-z0-9\-\_]+)\")/i;
  var reg_findClass = /(?:\sclass\=\"([a-z0-9\-\_\s]+)\")/i;
  var reg_findAttrs = /(?:\s(?!class)(?!data\-)(?!id)([a-z0-9\-]+)\=\"([a-z0-9\-\_\s]+)\")/gi;
  var reg_findDataset = /(?:\sdata\-([a-z0-9\-]+)\=\"([a-z0-9\-\_\s]+)\")/i;

  var __dom = function (selector) {
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
    }
  };

  /* Internal Functions */
  function createElement(element) {
    let newElement, id, classes, attrs, datasets;
    newElement = document.createElement( element.match(reg_isNode)[1] );
    if(id = element.match(reg_findId)) newElement.id = id[1];
    if(classes = element.match(reg_findClass)) {
      let classNames = classes[1].split(' ');
      for(let i = 0; i < classNames.length; i++) {
        newElement.classList.add(classNames[i]);
      }
    }
    if(attrs = element.match(reg_findAttrs)) {
      for(let i = 0; i < attrs.length; i++) {
        const arrAttrs = attrs[i].trim().split('=');
        newElement[arrAttrs[0]] = arrAttrs[1];
      }
    }
    if(datasets = element.match(reg_findDataset)) newElement.dataset[datasets[1]] = datasets[2];
    return newElement;
  }

  return (__dom);

})(window || this);