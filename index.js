(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory(require('karas')) :
  typeof define === 'function' && define.amd ? define(['karas'], factory) :
  (global = global || self, global.karas = factory(global.karas));
}(this, (function (karas) { 'use strict';

  karas = karas && Object.prototype.hasOwnProperty.call(karas, 'default') ? karas['default'] : karas;

  function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  }

  function _defineProperties(target, props) {
    for (var i = 0; i < props.length; i++) {
      var descriptor = props[i];
      descriptor.enumerable = descriptor.enumerable || false;
      descriptor.configurable = true;
      if ("value" in descriptor) descriptor.writable = true;
      Object.defineProperty(target, descriptor.key, descriptor);
    }
  }

  function _createClass(Constructor, protoProps, staticProps) {
    if (protoProps) _defineProperties(Constructor.prototype, protoProps);
    if (staticProps) _defineProperties(Constructor, staticProps);
    return Constructor;
  }

  function _inherits(subClass, superClass) {
    if (typeof superClass !== "function" && superClass !== null) {
      throw new TypeError("Super expression must either be null or a function");
    }

    subClass.prototype = Object.create(superClass && superClass.prototype, {
      constructor: {
        value: subClass,
        writable: true,
        configurable: true
      }
    });
    if (superClass) _setPrototypeOf(subClass, superClass);
  }

  function _getPrototypeOf(o) {
    _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) {
      return o.__proto__ || Object.getPrototypeOf(o);
    };
    return _getPrototypeOf(o);
  }

  function _setPrototypeOf(o, p) {
    _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) {
      o.__proto__ = p;
      return o;
    };

    return _setPrototypeOf(o, p);
  }

  function _isNativeReflectConstruct() {
    if (typeof Reflect === "undefined" || !Reflect.construct) return false;
    if (Reflect.construct.sham) return false;
    if (typeof Proxy === "function") return true;

    try {
      Date.prototype.toString.call(Reflect.construct(Date, [], function () {}));
      return true;
    } catch (e) {
      return false;
    }
  }

  function _assertThisInitialized(self) {
    if (self === void 0) {
      throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
    }

    return self;
  }

  function _possibleConstructorReturn(self, call) {
    if (call && (typeof call === "object" || typeof call === "function")) {
      return call;
    }

    return _assertThisInitialized(self);
  }

  function _createSuper(Derived) {
    return function () {
      var Super = _getPrototypeOf(Derived),
          result;

      if (_isNativeReflectConstruct()) {
        var NewTarget = _getPrototypeOf(this).constructor;

        result = Reflect.construct(Super, arguments, NewTarget);
      } else {
        result = Super.apply(this, arguments);
      }

      return _possibleConstructorReturn(this, result);
    };
  }

  function _superPropBase(object, property) {
    while (!Object.prototype.hasOwnProperty.call(object, property)) {
      object = _getPrototypeOf(object);
      if (object === null) break;
    }

    return object;
  }

  function _get(target, property, receiver) {
    if (typeof Reflect !== "undefined" && Reflect.get) {
      _get = Reflect.get;
    } else {
      _get = function _get(target, property, receiver) {
        var base = _superPropBase(target, property);

        if (!base) return;
        var desc = Object.getOwnPropertyDescriptor(base, property);

        if (desc.get) {
          return desc.get.call(receiver);
        }

        return desc.value;
      };
    }

    return _get(target, property, receiver || target);
  }

  karas.inject.requestAnimationFrame = function (cb) {
    setTimeout(cb, 1000 / 60);
  };

  var Root = /*#__PURE__*/function (_karas$Root) {
    _inherits(Root, _karas$Root);

    var _super = _createSuper(Root);

    function Root() {
      _classCallCheck(this, Root);

      return _super.apply(this, arguments);
    }

    _createClass(Root, [{
      key: "appendTo",
      value: function appendTo(ctx) {
        this.__initProps();

        this.__refreshLevel = karas.level.REFLOW;
        this.__ctx = ctx;
        this.__renderMode = karas.mode.CANVAS;
        this.__defs = {
          clear: function clear() {}
        };
        var style = this.style;

        if (['flex', 'block'].indexOf(style.display) === -1) {
          style.display = 'block';
        } // 同理position不能为absolute


        if (style.position === 'absolute') {
          style.position = 'static';
        }

        var renderMode = this.renderMode,
            myCtx = this.ctx;

        this.__traverse(myCtx, undefined, renderMode);

        this.__traverseCss(this, this.props.css);

        this.__init();

        this.refresh();
      }
    }, {
      key: "refresh",
      value: function refresh(cb) {
        var ctx = this.ctx;

        function wrap() {
          ctx.draw(true);
          cb && cb();
        }

        _get(_getPrototypeOf(Root.prototype), "refresh", this).call(this, wrap);
      }
    }]);

    return Root;
  }(karas.Root); // Root引用指过来


  var createVd = karas.createVd;

  karas.createVd = function (tagName, props, children) {
    if (['canvas', 'svg'].indexOf(tagName) > -1) {
      return new Root(tagName, props, children);
    }

    return createVd(tagName, props, children);
  };

  karas.inject.measureImg = function (src, cb) {
    var optinos = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};

    if (src.indexOf('data:') === 0) {
      var _optinos$width = optinos.width,
          width = _optinos$width === void 0 ? {} : _optinos$width,
          _optinos$height = optinos.height,
          height = _optinos$height === void 0 ? {} : _optinos$height;
      cb({
        success: true,
        width: width.value,
        height: height.value,
        source: src
      });
      return;
    }

    my.getImageInfo({
      src: src,
      success: function success(res) {
        cb({
          success: true,
          width: res.width,
          height: res.height,
          source: src
        });
      },
      fail: function fail() {
        cb({
          success: false
        });
      }
    });
  };

  karas.inject.isDom = function (o) {
    return o && karas.util.isFunction(o.arc);
  };

  var cc, mc;

  karas.inject.setCacheCanvas = function (o) {
    cc = o;
  };

  karas.inject.setMaskCanvas = function (o) {
    mc = o;
  };

  karas.inject.getCacheCanvas = function () {
    if (!cc) {
      throw new Error('Need a cache canvas');
    }

    return {
      ctx: cc,
      canvas: cc,
      draw: function draw(ctx) {
        ctx.draw(true);
      }
    };
  };

  karas.inject.getMaskCanvas = function () {
    if (!mc) {
      throw new Error('Need a mask canvas');
    }

    return {
      ctx: mc,
      canvas: mc,
      draw: function draw(ctx) {
        ctx.draw(true);
      }
    };
  };

  return karas;

})));
//# sourceMappingURL=index.js.map
