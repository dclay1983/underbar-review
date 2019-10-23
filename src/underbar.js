(function() {
  'use strict';

  window._ = {};

  //------------------------IDENTITY---------------------------//
  _.identity = (val) => {
    return val;
  };

  //-----------------------FIRST-------------------------------//
  _.first = (array, n) => {
    return n === undefined ? array[0] : array.slice(0, n);
  };

  //-------------------------LAST------------------------------//
  _.last = (array, n) => {
    if (n === undefined) { return array[array.length - 1]; }
    if (n > 0) {
      return array.slice(n > array.length - 1 ? 0 : n);
    } else if ( n === 0) {
      return [];
    }
  };

  //----------------------EACH---------------------------------//
  _.each = (collection, iterator) => {
    if (Array.isArray(collection)) {
      for (let i = 0; i < collection.length; i++) {
        iterator(collection[i], i, collection);
      }
    } else {
      for (let key in collection) {
        iterator(collection[key], key, collection);
      }
    }
  };

  //--------------------INDEXOF--------------------------------//
  _.indexOf = (array, target) => {
    var result = -1;
    _.each(array, (item, index) => {
      if (item === target && result === -1) {
        result = index;
      }
    });
    return result;
  };

  //------------------FILTER-----------------------------------//
  _.filter = (collection, test) => {
    var results = [];
    _.each(collection, (item) => {
      if (test(item)) {
        results.push(item);
      }
    });
    return results;
  };

  //---------------------REJECT--------------------------------//
  _.reject = (collection, test) => {
    return _.filter(collection, (item) => {
      return !test(item);
    });
  };

  //------------------------UNIQ-------------------------------//
  _.uniq = (array, isSorted, iterator = _.identity) => {
    var results = [];
    if (isSorted) {
      _.each(array, (val) => {
        if (iterator(results[results.length - 1]) !== iterator(val)) {
          results.push(val);
        }
      });
    } else {
      _.each(array, (val) => {
        let isUniq = true;
        _.each(results, (rval) => {
          if (iterator(rval) === iterator(val)) {
            isUniq = false;
            return;
          }
        });
        if (isUniq) { results.push(val); }
      });
    }
    return results;
  };

  //----------------------MAP----------------------------------//
  _.map = (collection, iterator = _.identity) => {
    let results = [];
    _.each(collection, (val) => {
      results.push(iterator(val));
    });
    return results;
  };

  //-------------------PLUCK-----------------------------------//
  _.pluck = (collection, key) => {
    return _.map(collection, (item) => {
      return item[key];
    });
  };

  //------------------REDUCE-----------------------------------//
  _.reduce = (collection, iterator, accumulator) => {
    let isMemo = !(accumulator === undefined);
    _.each(collection, (val) => {
      if (isMemo) {
        accumulator = iterator(accumulator, val);
      } else {
        accumulator = val;
        isMemo = true;
      }
    });
    return accumulator;
  };

  //------------------------CONTAINS---------------------------//
  _.contains = (collection, target) => {
    return _.reduce(collection, (wasFound, item) => {
      if (wasFound) {
        return true;
      }
      return item === target;
    }, false);
  };


  //-----------------------------EVERY-------------------------//
  _.every = (collection, iterator = _.identity)=>{
    return _.reduce(collection, (accumulator, val) => {
      if (!accumulator) {
        return false;
      } else {
        return Boolean(iterator(val));
      }
    }, true);
  };

  //-------------------------SOME------------------------------//
  _.some = (collection, iterator = _.identity) => {
    return !_.every(collection, (val) => {
      return !iterator(val);
    });
  };

  //------------------------EXTEND-----------------------------//
  _.extend = (obj, ...objs) => {
    return _.reduce(objs, (obj, obj2) => {
      _.each(obj2, (value, key) => {
        obj[key] = value;
      });
      return obj;
    }, obj);
  };

  //------------------------------DEFAULTS---------------------//
  _.defaults = (obj, ...objs) => {
    return _.reduce(objs, (obj, obj2) => {
      _.each(obj2, (value, key) => {
        if (!obj.hasOwnProperty(key)) {
          obj[key] = value;
        }
      });
      return obj;
    }, obj);
  };


  //----------------------------ONCE---------------------------//
  _.once = (func) => {
    var alreadyCalled = false;
    var result;

    return function() {
      if (!alreadyCalled) {
        result = func.apply(this, arguments);
        alreadyCalled = true;
      }

      return result;
    };
  };

  //----------------------------MEMOIZE------------------------//
  _.memoize = (func) => {
    var results = {};

    return function(...args) {
      let argsString = JSON.stringify(args);

      if (!results.hasOwnProperty(argsString)) {
        results[argsString] = _.once(func);
        return results[argsString](...args);
      }

      return results[argsString]();
    };
  };

  //--------------------DELAY----------------------------------//
  _.delay = (func, wait, ...args) => {
    setTimeout(func, wait, ...args);
  };

  //------------------------SHUFFLE----------------------------//
  _.shuffle = (array) => {
    array = array.slice(0);
    let results = [];

    while (array.length > 0) {
      let index = Math.floor(Math.random() * array.length);
      results.push(array.splice(index, 1)[0]);
    }

    return results;
  };


  /**
   * ADVANCED
   * =================
   *
   * Note: This is the end of the pre-course curriculum. Feel free to continue,
   * but nothing beyond here is required.
   */

  //------------------------INVOKE------------------------------------//
  _.invoke = (collection, functionOrKey, args) => {
    if (typeof functionOrKey === 'string') {
      functionOrKey = collection[0][functionOrKey];
    }
    return _.map(collection, (val) => {
      return functionOrKey.apply(val, args);
    });
  };

  //-----------------------------SORTBY-----------------------------------------------------//
  _.sortBy = (collection, iterator) => {
    collection = collection.slice(0);
    let results = [];
    if (collection.length > 1) {
      let mid = Math.floor(collection.length / 2);
      let left = _.sortBy(collection.slice(0, mid), iterator);
      let right = _.sortBy(collection.slice(mid), iterator);

      if (typeof iterator === 'string') {
        var iter = function(val) {
          return val[iterator] === undefined ? Infinity : val[iterator];
        };
      } else {
        var iter = function(val) {
          return iterator(val) === undefined ? Infinity : iterator(val);
        };
      }

      let leftIndex = 0;
      let rightIndex = 0;
      while (leftIndex < left.length && rightIndex < right.length) {
        if (iter(left[leftIndex]) <= iter(right[rightIndex])) {
          results.push(left[leftIndex]);
          leftIndex++;
        } else {
          results.push(right[rightIndex]);
          rightIndex++;
        }
      }
      for (leftIndex; leftIndex < left.length; leftIndex++) {
        results.push(left[leftIndex]);
      }
      for (rightIndex; rightIndex < right.length; rightIndex++) {
        results.push(right[rightIndex]);
      }
    } else {
      results = collection;
    }
    return results;
  };

  // Zip together two or more arrays with elements of the same index
  // going together.
  //
  // Example:
  // _.zip(['a','b','c','d'], [1,2,3]) returns [['a',1], ['b',2], ['c',3], ['d',undefined]]
  _.zip = function() {
  };

  // Takes a multidimensional array and converts it to a one-dimensional array.
  // The new array should contain all elements of the multidimensional array.
  //
  // Hint: Use Array.isArray to check if something is an array
  _.flatten = function(nestedArray, result) {
  };

  // Takes an arbitrary number of arrays and produces an array that contains
  // every item shared between all the passed-in arrays.
  _.intersection = function() {
  };

  // Take the difference between one array and a number of other arrays.
  // Only the elements present in just the first array will remain.
  _.difference = function(array) {
  };

  // Returns a function, that, when invoked, will only be triggered at most once
  // during a given window of time.  See the Underbar readme for extra details
  // on this function.
  //
  // Note: This is difficult! It may take a while to implement.
  _.throttle = function(func, wait) {
  };
}());
