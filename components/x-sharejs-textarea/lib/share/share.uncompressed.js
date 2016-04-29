// Generated by CoffeeScript 1.6.3
(function() {
  var BCSocket, Connection, Doc, MicroEvent, ReconnectingWebSocket, SockJS, WebSocket, append, bootstrapTransform, checkValidComponent, checkValidOp, exports, hasBCSocket, hasSockJS, invertComponent, nextTick, socketImpl, strInject, text, transformComponent, transformPosition, types,
    __slice = [].slice,
    __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
    __indexOf = [].indexOf || function(item) { for (var i = 0, l = this.length; i < l; i++) { if (i in this && this[i] === item) return i; } return -1; };

  window.sharejs = exports = {
    'version': '0.6.2'
  };

  if (typeof WEB === 'undefined') {
    window.WEB = true;
  }

  nextTick = typeof WEB !== "undefined" && WEB !== null ? function(fn) {
    return setTimeout(fn, 0);
  } : process['nextTick'];

  MicroEvent = (function() {
    function MicroEvent() {}

    MicroEvent.prototype.on = function(event, f) {
      var _base;
      this._events || (this._events = {});
      (_base = this._events)[event] || (_base[event] = []);
      this._events[event].push(f);
      return this;
    };

    MicroEvent.prototype.removeListener = function(event, fct) {
      var i, listeners, _base,
        _this = this;
      this._events || (this._events = {});
      listeners = ((_base = this._events)[event] || (_base[event] = []));
      i = 0;
      while (i < listeners.length) {
        if (listeners[i] === fct) {
          listeners[i] = void 0;
        }
        i++;
      }
      nextTick(function() {
        var x;
        return _this._events[event] = (function() {
          var _i, _len, _ref, _results;
          _ref = this._events[event];
          _results = [];
          for (_i = 0, _len = _ref.length; _i < _len; _i++) {
            x = _ref[_i];
            if (x) {
              _results.push(x);
            }
          }
          return _results;
        }).call(_this);
      });
      return this;
    };

    MicroEvent.prototype.emit = function() {
      var args, event, fn, _i, _len, _ref, _ref1;
      event = arguments[0], args = 2 <= arguments.length ? __slice.call(arguments, 1) : [];
      if (!((_ref = this._events) != null ? _ref[event] : void 0)) {
        return this;
      }
      _ref1 = this._events[event];
      for (_i = 0, _len = _ref1.length; _i < _len; _i++) {
        fn = _ref1[_i];
        if (fn) {
          fn.apply(this, args);
        }
      }
      return this;
    };

    MicroEvent.prototype.once = function(event, f) {
      var listener,
        _this = this;
      return this.on(event, listener = function() {
        var args;
        args = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
        _this.removeListener(event, listener);
        return f.apply(_this, args);
      });
    };

    return MicroEvent;

  })();

  MicroEvent.mixin = function(obj) {
    var proto;
    proto = obj.prototype || obj;
    proto.on = MicroEvent.prototype.on;
    proto.removeListener = MicroEvent.prototype.removeListener;
    proto.emit = MicroEvent.prototype.emit;
    proto.once = MicroEvent.prototype.once;
    return obj;
  };

  if (typeof WEB === "undefined" || WEB === null) {
    module.exports = MicroEvent;
  }

  exports['_bt'] = bootstrapTransform = function(type, transformComponent, checkValidOp, append) {
    var transformComponentX, transformX;
    transformComponentX = function(left, right, destLeft, destRight) {
      transformComponent(destLeft, left, right, 'left');
      return transformComponent(destRight, right, left, 'right');
    };
    type.transformX = type['transformX'] = transformX = function(leftOp, rightOp) {
      var k, l, l_, newLeftOp, newRightOp, nextC, r, r_, rightComponent, _i, _j, _k, _l, _len, _len1, _len2, _len3, _ref, _ref1;
      checkValidOp(leftOp);
      checkValidOp(rightOp);
      newRightOp = [];
      for (_i = 0, _len = rightOp.length; _i < _len; _i++) {
        rightComponent = rightOp[_i];
        newLeftOp = [];
        k = 0;
        while (k < leftOp.length) {
          nextC = [];
          transformComponentX(leftOp[k], rightComponent, newLeftOp, nextC);
          k++;
          if (nextC.length === 1) {
            rightComponent = nextC[0];
          } else if (nextC.length === 0) {
            _ref = leftOp.slice(k);
            for (_j = 0, _len1 = _ref.length; _j < _len1; _j++) {
              l = _ref[_j];
              append(newLeftOp, l);
            }
            rightComponent = null;
            break;
          } else {
            _ref1 = transformX(leftOp.slice(k), nextC), l_ = _ref1[0], r_ = _ref1[1];
            for (_k = 0, _len2 = l_.length; _k < _len2; _k++) {
              l = l_[_k];
              append(newLeftOp, l);
            }
            for (_l = 0, _len3 = r_.length; _l < _len3; _l++) {
              r = r_[_l];
              append(newRightOp, r);
            }
            rightComponent = null;
            break;
          }
        }
        if (rightComponent != null) {
          append(newRightOp, rightComponent);
        }
        leftOp = newLeftOp;
      }
      return [leftOp, newRightOp];
    };
    return type.transform = type['transform'] = function(op, otherOp, type) {
      var left, right, _, _ref, _ref1;
      if (!(type === 'left' || type === 'right')) {
        throw new Error("type must be 'left' or 'right'");
      }
      if (otherOp.length === 0) {
        return op;
      }
      if (op.length === 1 && otherOp.length === 1) {
        return transformComponent([], op[0], otherOp[0], type);
      }
      if (type === 'left') {
        _ref = transformX(op, otherOp), left = _ref[0], _ = _ref[1];
        return left;
      } else {
        _ref1 = transformX(otherOp, op), _ = _ref1[0], right = _ref1[1];
        return right;
      }
    };
  };

  if (typeof WEB === 'undefined') {
    exports.bootstrapTransform = bootstrapTransform;
  }

  text = {};

  text.name = 'text';

  text.create = function() {
    return '';
  };

  strInject = function(s1, pos, s2) {
    return s1.slice(0, pos) + s2 + s1.slice(pos);
  };

  checkValidComponent = function(c) {
    var d_type, i_type;
    if (typeof c.p !== 'number') {
      throw new Error('component missing position field');
    }
    i_type = typeof c.i;
    d_type = typeof c.d;
    if (!((i_type === 'string') ^ (d_type === 'string'))) {
      throw new Error('component needs an i or d field');
    }
    if (!(c.p >= 0)) {
      throw new Error('position cannot be negative');
    }
  };

  checkValidOp = function(op) {
    var c, _i, _len;
    for (_i = 0, _len = op.length; _i < _len; _i++) {
      c = op[_i];
      checkValidComponent(c);
    }
    return true;
  };

  text.apply = function(snapshot, op) {
    var component, deleted, _i, _len;
    checkValidOp(op);
    for (_i = 0, _len = op.length; _i < _len; _i++) {
      component = op[_i];
      if (component.i != null) {
        snapshot = strInject(snapshot, component.p, component.i);
      } else {
        deleted = snapshot.slice(component.p, component.p + component.d.length);
        if (component.d !== deleted) {
          throw new Error("Delete component '" + component.d + "' does not match deleted text '" + deleted + "'");
        }
        snapshot = snapshot.slice(0, component.p) + snapshot.slice(component.p + component.d.length);
      }
    }
    return snapshot;
  };

  text._append = append = function(newOp, c) {
    var last, _ref, _ref1;
    if (c.i === '' || c.d === '') {
      return;
    }
    if (newOp.length === 0) {
      return newOp.push(c);
    } else {
      last = newOp[newOp.length - 1];
      if ((last.i != null) && (c.i != null) && (last.p <= (_ref = c.p) && _ref <= (last.p + last.i.length))) {
        return newOp[newOp.length - 1] = {
          i: strInject(last.i, c.p - last.p, c.i),
          p: last.p
        };
      } else if ((last.d != null) && (c.d != null) && (c.p <= (_ref1 = last.p) && _ref1 <= (c.p + c.d.length))) {
        return newOp[newOp.length - 1] = {
          d: strInject(c.d, last.p - c.p, last.d),
          p: c.p
        };
      } else {
        return newOp.push(c);
      }
    }
  };

  text.compose = function(op1, op2) {
    var c, newOp, _i, _len;
    checkValidOp(op1);
    checkValidOp(op2);
    newOp = op1.slice();
    for (_i = 0, _len = op2.length; _i < _len; _i++) {
      c = op2[_i];
      append(newOp, c);
    }
    return newOp;
  };

  text.compress = function(op) {
    return text.compose([], op);
  };

  text.normalize = function(op) {
    var c, newOp, _i, _len;
    newOp = [];
    if ((op.i != null) || (op.p != null)) {
      op = [op];
    }
    for (_i = 0, _len = op.length; _i < _len; _i++) {
      c = op[_i];
      if (c.p == null) {
        c.p = 0;
      }
      append(newOp, c);
    }
    return newOp;
  };

  transformPosition = function(pos, c, insertAfter) {
    if (c.i != null) {
      if (c.p < pos || (c.p === pos && insertAfter)) {
        return pos + c.i.length;
      } else {
        return pos;
      }
    } else {
      if (pos <= c.p) {
        return pos;
      } else if (pos <= c.p + c.d.length) {
        return c.p;
      } else {
        return pos - c.d.length;
      }
    }
  };

  text.transformCursor = function(position, op, side) {
    var c, insertAfter, _i, _len;
    insertAfter = side === 'right';
    for (_i = 0, _len = op.length; _i < _len; _i++) {
      c = op[_i];
      position = transformPosition(position, c, insertAfter);
    }
    return position;
  };

  text._tc = transformComponent = function(dest, c, otherC, side) {
    var cIntersect, intersectEnd, intersectStart, newC, otherIntersect, s;
    checkValidOp([c]);
    checkValidOp([otherC]);
    if (c.i != null) {
      append(dest, {
        i: c.i,
        p: transformPosition(c.p, otherC, side === 'right')
      });
    } else {
      if (otherC.i != null) {
        s = c.d;
        if (c.p < otherC.p) {
          append(dest, {
            d: s.slice(0, otherC.p - c.p),
            p: c.p
          });
          s = s.slice(otherC.p - c.p);
        }
        if (s !== '') {
          append(dest, {
            d: s,
            p: c.p + otherC.i.length
          });
        }
      } else {
        if (c.p >= otherC.p + otherC.d.length) {
          append(dest, {
            d: c.d,
            p: c.p - otherC.d.length
          });
        } else if (c.p + c.d.length <= otherC.p) {
          append(dest, c);
        } else {
          newC = {
            d: '',
            p: c.p
          };
          if (c.p < otherC.p) {
            newC.d = c.d.slice(0, otherC.p - c.p);
          }
          if (c.p + c.d.length > otherC.p + otherC.d.length) {
            newC.d += c.d.slice(otherC.p + otherC.d.length - c.p);
          }
          intersectStart = Math.max(c.p, otherC.p);
          intersectEnd = Math.min(c.p + c.d.length, otherC.p + otherC.d.length);
          cIntersect = c.d.slice(intersectStart - c.p, intersectEnd - c.p);
          otherIntersect = otherC.d.slice(intersectStart - otherC.p, intersectEnd - otherC.p);
          if (cIntersect !== otherIntersect) {
            throw new Error('Delete ops delete different text in the same region of the document');
          }
          if (newC.d !== '') {
            newC.p = transformPosition(newC.p, otherC);
            append(dest, newC);
          }
        }
      }
    }
    return dest;
  };

  invertComponent = function(c) {
    if (c.i != null) {
      return {
        d: c.i,
        p: c.p
      };
    } else {
      return {
        i: c.d,
        p: c.p
      };
    }
  };

  text.invert = function(op) {
    var c, _i, _len, _ref, _results;
    _ref = op.slice().reverse();
    _results = [];
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      c = _ref[_i];
      _results.push(invertComponent(c));
    }
    return _results;
  };

  if (typeof WEB !== "undefined" && WEB !== null) {
    exports.types || (exports.types = {});
    bootstrapTransform(text, transformComponent, checkValidOp, append);
    exports.types.text = text;
  } else {
    module.exports = text;
    require('./helpers').bootstrapTransform(text, transformComponent, checkValidOp, append);
  }

  if (typeof WEB === 'undefined') {
    text = require('./text');
  }

  text.api = {
    provides: {
      text: true
    },
    getLength: function() {
      return this.snapshot.length;
    },
    getText: function() {
      return this.snapshot;
    },
    insert: function(pos, text, callback) {
      var op;
      op = [
        {
          p: pos,
          i: text
        }
      ];
      this.submitOp(op, callback);
      return op;
    },
    del: function(pos, length, callback) {
      var op;
      op = [
        {
          p: pos,
          d: this.snapshot.slice(pos, pos + length)
        }
      ];
      this.submitOp(op, callback);
      return op;
    },
    _register: function() {
      return this.on('remoteop', function(op) {
        var component, _i, _len, _results;
        _results = [];
        for (_i = 0, _len = op.length; _i < _len; _i++) {
          component = op[_i];
          if (component.i !== void 0) {
            _results.push(this.emit('insert', component.p, component.i));
          } else {
            _results.push(this.emit('delete', component.p, component.d));
          }
        }
        return _results;
      });
    }
  };

  if (typeof WEB === "undefined" || WEB === null) {
    types = require('../types');
  }

  if (typeof WEB !== "undefined" && WEB !== null) {
    exports.extendDoc = function(name, fn) {
      return Doc.prototype[name] = fn;
    };
  }

  Doc = (function() {
    function Doc(connection, name, openData) {
      this.connection = connection;
      this.name = name;
      this.shout = __bind(this.shout, this);
      this.flush = __bind(this.flush, this);
      openData || (openData = {});
      this.version = openData.v;
      this.snapshot = openData.snaphot;
      if (openData.type) {
        this._setType(openData.type);
      }
      this.state = 'closed';
      this.autoOpen = false;
      this._create = openData.create;
      this.inflightOp = null;
      this.inflightCallbacks = [];
      this.inflightSubmittedIds = [];
      this.pendingOp = null;
      this.pendingCallbacks = [];
      this.serverOps = {};
    }

    Doc.prototype._xf = function(client, server) {
      var client_, server_;
      if (this.type.transformX) {
        return this.type.transformX(client, server);
      } else {
        client_ = this.type.transform(client, server, 'left');
        server_ = this.type.transform(server, client, 'right');
        return [client_, server_];
      }
    };

    Doc.prototype._otApply = function(docOp, isRemote) {
      var oldSnapshot;
      oldSnapshot = this.snapshot;
      this.snapshot = this.type.apply(this.snapshot, docOp);
      this.emit('change', docOp, oldSnapshot);
      if (isRemote) {
        return this.emit('remoteop', docOp, oldSnapshot);
      }
    };

    Doc.prototype._connectionStateChanged = function(state, data) {
      switch (state) {
        case 'disconnected':
          this.state = 'closed';
          if (this.inflightOp) {
            this.inflightSubmittedIds.push(this.connection.id);
          }
          this.emit('closed');
          break;
        case 'ok':
          if (this.autoOpen) {
            this.open();
          }
          break;
        case 'stopped':
          if (typeof this._openCallback === "function") {
            this._openCallback(data);
          }
      }
      return this.emit(state, data);
    };

    Doc.prototype._setType = function(type) {
      var k, v, _ref;
      if (this.type) {
        return;
      }
      if (typeof type === 'string') {
        type = types[type];
      }
      if (!(type && type.compose)) {
        throw new Error('Support for types without compose() is not implemented');
      }
      this.type = type;
      if (type.api) {
        _ref = type.api;
        for (k in _ref) {
          v = _ref[k];
          this[k] = v;
        }
        return typeof this._register === "function" ? this._register() : void 0;
      } else {
        return this.provides = {};
      }
    };

    Doc.prototype._onMessage = function(msg) {
      var callback, docOp, error, oldInflightOp, op, path, response, undo, value, _i, _j, _len, _len1, _ref, _ref1, _ref2, _ref3, _ref4, _ref5, _ref6;
      switch (false) {
        case msg.open !== true:
          this.state = 'open';
          this._create = false;
          if (this.created == null) {
            this.created = !!msg.create;
          }
          if (msg.type) {
            this._setType(msg.type);
          }
          if (msg.create) {
            this.created = true;
            this.snapshot = this.type.create();
          } else {
            if (this.created !== true) {
              this.created = false;
            }
            if (msg.snapshot !== void 0) {
              this.snapshot = msg.snapshot;
            }
          }
          if (msg.meta) {
            this.meta = msg.meta;
          }
          if (msg.v != null) {
            this.version = msg.v;
          }
          if (this.inflightOp) {
            response = {
              doc: this.name,
              op: this.inflightOp,
              v: this.version
            };
            if (this.inflightSubmittedIds.length) {
              response.dupIfSource = this.inflightSubmittedIds;
            }
            this.connection.send(response);
          } else {
            this.flush();
          }
          this.emit('open');
          return typeof this._openCallback === "function" ? this._openCallback(null) : void 0;
        case msg.open !== false:
          if (msg.error) {
            if (typeof console !== "undefined" && console !== null) {
              console.error("Could not open document: " + msg.error);
            }
            this.emit('error', msg.error);
            if (typeof this._openCallback === "function") {
              this._openCallback(msg.error);
            }
          }
          this.state = 'closed';
          this.emit('closed');
          if (typeof this._closeCallback === "function") {
            this._closeCallback();
          }
          return this._closeCallback = null;
        case !(msg.op === null && error === 'Op already submitted'):
          break;
        case !((msg.op === void 0 && msg.v !== void 0) || (msg.op && (_ref = msg.meta.source, __indexOf.call(this.inflightSubmittedIds, _ref) >= 0))):
          oldInflightOp = this.inflightOp;
          this.inflightOp = null;
          this.inflightSubmittedIds.length = 0;
          error = msg.error;
          if (error) {
            if (this.type.invert) {
              undo = this.type.invert(oldInflightOp);
              if (this.pendingOp) {
                _ref1 = this._xf(this.pendingOp, undo), this.pendingOp = _ref1[0], undo = _ref1[1];
              }
              this._otApply(undo, true);
            } else {
              this.emit('error', "Op apply failed (" + error + ") and the op could not be reverted");
            }
            _ref2 = this.inflightCallbacks;
            for (_i = 0, _len = _ref2.length; _i < _len; _i++) {
              callback = _ref2[_i];
              callback(error);
            }
          } else {
            if (msg.v !== this.version) {
              throw new Error('Invalid version from server');
            }
            this.serverOps[this.version] = oldInflightOp;
            this.version++;
            this.emit('acknowledge', oldInflightOp);
            _ref3 = this.inflightCallbacks;
            for (_j = 0, _len1 = _ref3.length; _j < _len1; _j++) {
              callback = _ref3[_j];
              callback(null, oldInflightOp);
            }
          }
          return this.flush();
        case !msg.op:
          if (msg.v < this.version) {
            return;
          }
          if (msg.doc !== this.name) {
            return this.emit('error', "Expected docName '" + this.name + "' but got " + msg.doc);
          }
          if (msg.v !== this.version) {
            return this.emit('error', "Expected version " + this.version + " but got " + msg.v);
          }
          op = msg.op;
          this.serverOps[this.version] = op;
          docOp = op;
          if (this.inflightOp !== null) {
            _ref4 = this._xf(this.inflightOp, docOp), this.inflightOp = _ref4[0], docOp = _ref4[1];
          }
          if (this.pendingOp !== null) {
            _ref5 = this._xf(this.pendingOp, docOp), this.pendingOp = _ref5[0], docOp = _ref5[1];
          }
          this.version++;
          return this._otApply(docOp, true);
        case !msg.meta:
          _ref6 = msg.meta, path = _ref6.path, value = _ref6.value;
          switch (path != null ? path[0] : void 0) {
            case 'shout':
              return this.emit('shout', value);
            default:
              return typeof console !== "undefined" && console !== null ? console.warn('Unhandled meta op:', msg) : void 0;
          }
          break;
        default:
          return typeof console !== "undefined" && console !== null ? console.warn('Unhandled document message:', msg) : void 0;
      }
    };

    Doc.prototype.flush = function() {
      if (!(this.connection.state === 'ok' && this.inflightOp === null && this.pendingOp !== null)) {
        return;
      }
      this.inflightOp = this.pendingOp;
      this.inflightCallbacks = this.pendingCallbacks;
      this.pendingOp = null;
      this.pendingCallbacks = [];
      return this.connection.send({
        doc: this.name,
        op: this.inflightOp,
        v: this.version
      });
    };

    Doc.prototype.submitOp = function(op, callback) {
      if (this.type.normalize != null) {
        op = this.type.normalize(op);
      }
      this.snapshot = this.type.apply(this.snapshot, op);
      if (this.pendingOp !== null) {
        this.pendingOp = this.type.compose(this.pendingOp, op);
      } else {
        this.pendingOp = op;
      }
      if (callback) {
        this.pendingCallbacks.push(callback);
      }
      this.emit('change', op);
      return setTimeout(this.flush, 0);
    };

    Doc.prototype.shout = function(msg) {
      return this.connection.send({
        doc: this.name,
        meta: {
          path: ['shout'],
          value: msg
        }
      });
    };

    Doc.prototype.open = function(callback) {
      var message,
        _this = this;
      this.autoOpen = true;
      if (this.state !== 'closed') {
        return;
      }
      message = {
        doc: this.name,
        open: true
      };
      if (this.snapshot === void 0) {
        message.snapshot = null;
      }
      if (this.type) {
        message.type = this.type.name;
      }
      if (this.version != null) {
        message.v = this.version;
      }
      if (this._create) {
        message.create = true;
      }
      this.connection.send(message);
      this.state = 'opening';
      return this._openCallback = function(error) {
        _this._openCallback = null;
        return typeof callback === "function" ? callback(error) : void 0;
      };
    };

    Doc.prototype.close = function(callback) {
      this.autoOpen = false;
      if (this.state === 'closed') {
        return typeof callback === "function" ? callback() : void 0;
      }
      this.connection.send({
        doc: this.name,
        open: false
      });
      this.state = 'closed';
      this.emit('closing');
      return this._closeCallback = callback;
    };

    return Doc;

  })();

  if (typeof WEB === "undefined" || WEB === null) {
    MicroEvent = require('./microevent');
  }

  MicroEvent.mixin(Doc);

  exports.Doc = Doc;

  /*
  This behaves like a WebSocket in every way, except if it fails to connect,
  or it gets disconnected, it will repeatedly poll until it succesfully connects
  again.

  It is API compatible, so when you have:
  ws = new WebSocket('ws://....');
  you can replace with:
  ws = new ReconnectingWebSocket('ws://....');

  The event stream will typically look like:
  onopen
  onmessage
  onmessage
  onclose // lost connection
  onopen  // sometime later...
  onmessage
  onmessage
  etc...

  It is API compatible with the standard WebSocket API.

  Inspired from: https://github.com/joewalnes/reconnecting-websocket/
  Contributors:
  - Joe Walnes
  - Didier Colens
  - Wout Mertens
  */


  ReconnectingWebSocket = (function() {
    function ReconnectingWebSocket(url, protocols, Socket) {
      var connect, timedOut,
        _this = this;
      if ((protocols != null) && typeof protocols === 'function') {
        Socket = protocols;
        protocols = void 0;
      } else if (typeof Socket !== 'function') {
        Socket = WebSocket;
      }
      this.debug = this.debugAll;
      this.reconnectInterval = 1000;
      this.timeoutInterval = 2000;
      this.forcedClose = false;
      this.url = url;
      this.protocols = protocols;
      this.readyState = Socket.CONNECTING;
      this.URL = url;
      timedOut = false;
      connect = function(reconnectAttempt) {
        var timeout;
        _this.ws = new Socket(_this.url);
        if (_this.debug) {
          console.debug("ReconnectingWebSocket", "attempt-connect", _this.url);
        }
        timeout = setTimeout(function() {
          if (_this.debug) {
            console.debug("ReconnectingWebSocket", "connection-timeout", _this.url);
          }
          timedOut = true;
          _this.ws.close();
          return timedOut = false;
        }, _this.timeoutInterval);
        _this.ws.onopen = function(event) {
          clearTimeout(timeout);
          if (_this.debug) {
            console.debug("ReconnectingWebSocket", "onopen", _this.url);
          }
          _this.readyState = Socket.OPEN;
          reconnectAttempt = false;
          return _this.onopen(event);
        };
        _this.ws.onclose = function(event) {
          clearTimeout(timeout);
          _this.ws = null;
          if (_this.forcedClose) {
            _this.readyState = Socket.CLOSED;
            return _this.onclose(event);
          } else {
            _this.readyState = Socket.CONNECTING;
            _this.onconnecting(event);
            if (!reconnectAttempt && !timedOut) {
              if (_this.debug) {
                console.debug("ReconnectingWebSocket", "onclose", _this.url);
              }
              _this.onclose(event);
            }
            return setTimeout((function() {
              return connect(true);
            }), _this.reconnectInterval);
          }
        };
        _this.ws.onmessage = function(event) {
          if (_this.debug) {
            console.debug("ReconnectingWebSocket", "onmessage", _this.url, event.data);
          }
          return _this.onmessage(event);
        };
        return _this.ws.onerror = function(event) {
          if (_this.debug) {
            console.debug("ReconnectingWebSocket", "onerror", _this.url, event);
          }
          return _this.onerror(event);
        };
      };
      connect(this.url);
    }

    ReconnectingWebSocket.prototype.onopen = function(event) {};

    ReconnectingWebSocket.prototype.onclose = function(event) {};

    ReconnectingWebSocket.prototype.onconnecting = function(event) {};

    ReconnectingWebSocket.prototype.onmessage = function(event) {};

    ReconnectingWebSocket.prototype.onerror = function(event) {};

    ReconnectingWebSocket.prototype.send = function(data) {
      if (this.ws) {
        if (this.debug) {
          console.debug("ReconnectingWebSocket", "send", this.url, data);
        }
        return this.ws.send(data);
      } else {
        throw "INVALID_STATE_ERR : Pausing to reconnect websocket";
      }
    };

    ReconnectingWebSocket.prototype.close = function() {
      if (this.ws) {
        this.forcedClose = true;
        return this.ws.close();
      }
    };

    /*
    Setting this to true is the equivalent of setting all instances of ReconnectingWebSocket.debug to true.
    */


    ReconnectingWebSocket.prototype.debugAll = false;

    /*
    Additional public API method to refresh the connection if still open (close, re-open).
    For example, if the app suspects bad data / missed heart beats, it can try to refresh.
    */


    ReconnectingWebSocket.prototype.refresh = function() {
      if (this.ws) {
        return this.ws.close();
      }
    };

    return ReconnectingWebSocket;

  })();

  if (typeof WEB !== "undefined" && WEB !== null) {
    types = exports.types;
    BCSocket = window.BCSocket, SockJS = window.SockJS, WebSocket = window.WebSocket;
    if (BCSocket) {
      socketImpl = 'channel';
    } else {
      if (SockJS) {
        socketImpl = 'sockjs';
      } else {
        socketImpl = 'websocket';
      }
    }
  } else {
    types = require('../types');
    BCSocket = require('browserchannel').BCSocket;
    Doc = require('./doc').Doc;
    WebSocket = require('ws');
    socketImpl = null;
  }

  Connection = (function() {
    function Connection(host, authentication) {
      var _this = this;
      this.docs = {};
      this.state = 'connecting';
      if (socketImpl == null) {
        if (host.match(/^ws:/)) {
          socketImpl = 'websocket';
        }
      }
      this.socket = (function() {
        switch (socketImpl) {
          case 'channel':
            return new BCSocket(host, {
              reconnect: true
            });
          case 'sockjs':
            return new ReconnectingWebSocket(host, SockJS);
          case 'websocket':
            return new ReconnectingWebSocket(host);
          default:
            return new BCSocket(host, {
              reconnect: true
            });
        }
      })();
      this.socket.onmessage = function(msg) {
        var docName;
        if (socketImpl === 'sockjs' || socketImpl === 'websocket') {
          msg = JSON.parse(msg.data);
        }
        if (msg.auth === null) {
          _this.lastError = msg.error;
          _this.disconnect();
          return _this.emit('connect failed', msg.error);
        } else if (msg.auth) {
          _this.id = msg.auth;
          _this.setState('ok');
          return;
        }
        docName = msg.doc;
        if (docName !== void 0) {
          _this.lastReceivedDoc = docName;
        } else {
          msg.doc = docName = _this.lastReceivedDoc;
        }
        if (_this.docs[docName]) {
          return _this.docs[docName]._onMessage(msg);
        } else {
          return typeof console !== "undefined" && console !== null ? console.error('Unhandled message', msg) : void 0;
        }
      };
      this.connected = false;
      this.socket.onclose = function(reason) {
        _this.setState('disconnected', reason);
        if (reason === 'Closed' || reason === 'Stopped by server') {
          return _this.setState('stopped', _this.lastError || reason);
        }
      };
      this.socket.onerror = function(e) {
        return _this.emit('error', e);
      };
      this.socket.onopen = function() {
        _this.send({
          "auth": authentication ? authentication : null
        });
        _this.lastError = _this.lastReceivedDoc = _this.lastSentDoc = null;
        return _this.setState('handshaking');
      };
      this.socket.onconnecting = function() {
        return _this.setState('connecting');
      };
    }

    Connection.prototype.setState = function(state, data) {
      console.log('setState', state, data);
      var doc, docName, _ref, _results;
      if (this.state === state) {
        return;
      }
      this.state = state;
      if (state === 'disconnected') {
        delete this.id;
      }
      this.emit(state, data);
      _ref = this.docs;
      _results = [];
      for (docName in _ref) {
        doc = _ref[docName];
        _results.push(doc._connectionStateChanged(state, data));
      }
      return _results;
    };

    Connection.prototype.send = function(data) {
      var docName;
      if (data.doc) {
        docName = data.doc;
        if (docName === this.lastSentDoc) {
          delete data.doc;
        } else {
          this.lastSentDoc = docName;
        }
      }
      if (socketImpl === 'sockjs' || socketImpl === 'websocket') {
        data = JSON.stringify(data);
      }
      return this.socket.send(data);
    };

    Connection.prototype.disconnect = function() {
      return this.socket.close();
    };

    Connection.prototype.makeDoc = function(name, data, callback) {
      var doc,
        _this = this;
      if (this.docs[name]) {
        throw new Error("Doc " + name + " already open");
      }
      doc = new Doc(this, name, data);
      this.docs[name] = doc;
      return doc.open(function(error) {
        if (error) {
          delete _this.docs[name];
        }
        if (!error) {
          doc.on('closed', function() {
            if (!doc.autoOpen) {
              return delete _this.docs[name];
            }
          });
        }
        return callback(error, (!error ? doc : void 0));
      });
    };

    Connection.prototype.openExisting = function(docName, callback) {
      var doc;
      if (this.state === 'stopped') {
        return callback('connection closed');
      }
      if (this.docs[docName]) {
        return this._ensureOpenState(this.docs[docName], callback);
      }
      return doc = this.makeDoc(docName, {}, callback);
    };

    Connection.prototype.open = function(docName, type, callback) {
      var doc;
      if (this.state === 'stopped') {
        return callback('connection closed');
      }
      if (this.state === 'connecting') {
        this.on('handshaking', function() {
          this.open(docName, type, callback);
          return callback = null;
        });
        return;
      }
      if (typeof type === 'function') {
        callback = type;
        type = 'text';
      }
      callback || (callback = function() {});
      if (typeof type === 'string') {
        type = types[type];
      }
      if (!type) {
        throw new Error("OT code for document type missing");
      }
      if (docName == null) {
        throw new Error('Server-generated random doc names are not currently supported');
      }
      if (this.docs[docName]) {
        doc = this.docs[docName];
        if (doc.type === type) {
          this._ensureOpenState(doc, callback);
        } else {
          callback('Type mismatch', doc);
        }
        return;
      }
      return this.makeDoc(docName, {
        create: true,
        type: type.name
      }, callback);
    };

    Connection.prototype._ensureOpenState = function(doc, callback) {
      switch (doc.state) {
        case 'open':
          callback(null, doc);
          break;
        case 'opening':
          this.on('open', function() {
            return callback(null, doc);
          });
          break;
        case 'closed':
          doc.open(function(error) {
            return callback(error, (!error ? doc : void 0));
          });
      }
    };

    return Connection;

  })();

  if (typeof WEB === "undefined" || WEB === null) {
    MicroEvent = require('./microevent');
  }

  MicroEvent.mixin(Connection);

  exports.Connection = Connection;

  if (typeof WEB !== "undefined" && WEB !== null) {
    hasBCSocket = window.BCSocket !== void 0;
    hasSockJS = window.SockJS !== void 0;
    if (hasBCSocket) {
      socketImpl = 'channel';
    } else {
      if (hasSockJS) {
        socketImpl = 'sockjs';
      } else {
        socketImpl = 'websocket';
      }
    }
  } else {
    Connection = require('./connection').Connection;
  }

  exports.open = (function() {
    var connections, getConnection, maybeClose;
    connections = {};
    getConnection = function(origin, authentication) {
      var c, del, location, protocol;
      if ((typeof WEB !== "undefined" && WEB !== null) && (origin == null)) {
        location = window.location;
        protocol = socketImpl === 'websocket' ? 'ws:' : location.protocol;
        origin = "" + protocol + "//" + location.host + "/" + socketImpl;
      }
      if (!connections[origin]) {
        c = new Connection(origin, authentication);
        del = function() {
          return delete connections[origin];
        };
        c.on('disconnected', del);
        c.on('connect failed', del);
        connections[origin] = c;
      }
      return connections[origin];
    };
    maybeClose = function(c) {
      var doc, name, numDocs, _ref;
      numDocs = 0;
      _ref = c.docs;
      for (name in _ref) {
        doc = _ref[name];
        if (doc.state !== 'closed' || doc.autoOpen) {
          numDocs++;
        }
      }
      if (numDocs === 0) {
        return c.disconnect();
      }
    };
    return function(docName, type, options, callback) {
      var authentication, c, origin;
      if (typeof options === 'function') {
        callback = options;
        options = {};
      }
      if (typeof options === 'string') {
        options = {
          'origin': options
        };
      }
      origin = options.origin;
      authentication = options.authentication;
      c = getConnection(origin, authentication);
      c.open(docName, type, function(error, doc) {
        if (error) {
          callback(error);
          return maybeClose(c);
        } else {
          doc.on('closed', function() {
            return maybeClose(c);
          });
          return callback(null, doc);
        }
      });
      c.on('connect failed');
      return c;
    };
  })();

  if (typeof WEB === "undefined" || WEB === null) {
    exports.Doc = require('./doc').Doc;
    exports.Connection = require('./connection').Connection;
  }

}).call(this);
