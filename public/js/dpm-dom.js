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
  var reg_isNode = /^\<[a-z0-9\-\_]+\s/i;
  var reg_findId = /(?:\sid\=\"([a-z0-9\-\_]+)\")/i;
  var reg_findClass = /(?:\sclass\=\"([a-z0-9\-\_]+)\")/i;
  var reg_findAttrs = /(?:\s(?!class)(?!data\-)(?!id)([a-z0-9\-]+)\=\"([a-z0-9\-\_]+)\")/i
  var reg_findDataset = /(?:\sdata\-([a-z0-9\-]+)\=\"([a-z0-9\-\_]+)\")/i

  var __dom = function (selector) {
    return new DpmDOM(selector);
  };

  /*
   * Public API
   * */
  function DpmDOM(selector) {
    this.__selector = selector;
    switch (typeof this.__selector) {
      case 'string':
        if (this.__selector.search(reg_isNode) > -1) {
          this[0] = createElement(this.__selector);
          this.length = 1;
        } else {
          var prepSelectorArray = this.__selector.split(',');
          var elements = [];
          for (i = 0; i < prepSelectorArray.length; i++) {
            var trimmedSelector = prepSelectorArray[i].trim();
            var querySelectorAll = document.querySelectorAll(trimmedSelector);
            for (q = 0; q < querySelectorAll.length; q++) elements.push(querySelectorAll[q]);
          }
          for (i = 0; i < elements.length; i++) this[i] = elements[i];
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
    }
  };

  /* 
   *  Internal Functions
   * */
  function createElement(element) {
    var newElement, node, id, classes, attrs, datasets;
    node = element.match(reg_isNode);
    $log.log(node);

    return newElement;
  }

  return (__dom);

})(window || this);