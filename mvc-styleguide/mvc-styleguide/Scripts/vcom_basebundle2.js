var Framework; (function (Framework) {
    /*NOTE: Can we inline styles*/
    var TextEditor = (function () {
        function TextEditor(options) { var _self = this; this._options = options; this._endpoint = this._options.endpoint || '/'; this._context = this._options.context || 'body'; this._infoText = this._options.infoText || '.redactorInfoText'; this._minlength = this._options.minlength || 0; this._maxlength = this._options.maxlength || 1000; this._characterCountId = this._options.characterCountId || "characterCount"; this._redactorToolbarClass = this._options.redactorToolbarClass || "redactor_toolbar"; this._jquery = this._options.jquery || $8; this._redactorClass = this._options.redactorClass || ".redactor"; this._buttons = this._options.buttons || { edit: ".editButton", save: ".saveButton", cancel: ".cancelButton" }; this._redatorButtons = this._options.redatorButtons || ['bold', 'italic']; this._allowedTags = this._options.allowedTags || ['strong', 'b', 'em', 'i', 'p', '&nbsp;']; this._removeAttr = this._options.removeAttr || [['p', ['class', 'style']]]; this._shortcuts = this._options.shortcuts || false, this._pastePlainText = this._options.pastePlainText || false, this._linkNofollow = this._options.linkNofollow || true, this._redactor = this._jquery(this._redactorClass, this._context); this._defaultHtml = this._options.defaultHtml || this._redactor.html(); this._messageContainer = this._options.messageContainer || this._options.context; this._messageOptions = this._options.messageOptions || { "debug": false, "positionClass": "toast-top-right-absolute", "target": _self._messageContainer, "showDuration": "500", "hideDuration": "500", "timeOut": "1500", error: function () { _self._redactor.html(_self._defaultHtml); }, success: function () { _self._jquery(_self._buttons.cancel, _self._context).removeClass("disabled"); _self._jquery(_self._buttons.save, _self._context).removeClass("disabled"); _self._defaultHtml = _self._redactor.redactor('get'); } }; }
        TextEditor.prototype.init = function () { var _self = this; _self._redactor.redactor({ focus: true, buttons: _self._redatorButtons, allowedTags: _self._allowedTags, removeAttr: [['p', ['class', 'style']]], shortcuts: false, pastePlainText: false, linkNofollow: true, initCallback: function () { var str = this.get(); var $text = _self._jquery(str).text(); _self._updateCountArea($text); }, keyupCallback: function (e) { var str = this.get(); var $text = _self._jquery(str).text(); _self._updateCountArea($text); }, changeCallback: function (html) { var str = this.get(); var $text = _self._jquery(str).text(); _self._updateCountArea($text); } }); }; TextEditor.prototype.initEvents = function () {
            var _self = this; _self._jquery(_self._buttons.edit, _self._context).on("click", function (event, ui) { _self._showButtons("save"); _self._redactor.redactor({ focus: true, buttons: _self._redatorButtons, allowedTags: _self._allowedTags, removeAttr: [['p', ['class', 'style']]], shortcuts: false, pastePlainText: false, linkNofollow: true, initCallback: function () { var str = this.get(); var $text = _self._jquery(str).text(); _self._updateCountArea($text); }, keyupCallback: function (e) { var str = this.get(); var $text = _self._jquery(str).text(); _self._updateCountArea($text); }, changeCallback: function (html) { var str = this.get(); var $text = _self._jquery(str).text(); _self._updateCountArea($text); } }); }); _self._jquery(_self._buttons.cancel, _self._context).on("click", function (event, ui) { _self._showButtons("edit"); _self._redactor.redactor('destroy').html(_self._defaultHtml); }); _self._jquery(_self._buttons.save, _self._context).on("click", function (event, ui) {
                if (_self._jquery(this).hasClass("disabled")) { return; }
                _self._jquery(_self._buttons.cancel, _self._context).addClass("disabled"); _self._jquery(_self._buttons.save, _self._context).addClass("disabled"); var html = _self._redactor.redactor('get'), obj = { Id: _self._jquery(_self._context).attr("data-meid"), Html: html, Context: _self._context.substring(1) }, errorMessage = "<strong>There was a problem saving this text.</strong>"; _self._jquery(this).tpajax({ serviceUri: _self._endpoint, data: obj, method: "POST", dataType: "json", objectName: "editableFields", success: function (data) { if (data != null) { _self._showButtons("edit"); _self._defaultHtml = html; Framework.Messaging.CreateMessage(data, _self._messageOptions); } }, error: function (jqXHR, textStatus, errorThrown) { if (_self._jquery.tp.debug) { _self._redactor.html(errorMessage); _self._showButtons("edit"); var message = { type: "error", title: "Error!", message: "A server error occurred." }; Framework.Messaging.CreateMessage(message, _self._messageOptions); } } }); _self._redactor.redactor('destroy');
            });
        }; TextEditor.prototype._showButtons = function (mode) { switch (mode) { case "edit": this._jquery(this._buttons.save, this._context).hide(); this._jquery(this._buttons.cancel, this._context).hide(); this._jquery(this._buttons.edit, this._context).show(); this._jquery(this._infoText, this._context).hide(); this._jquery(this._buttons.cancel, this._context).removeClass("disabled"); this._jquery(this._buttons.save, this._context).removeClass("disabled"); this._jquery(this._messageContainer, this._context).hide(); break; case "save": this._jquery(this._buttons.save, this._context).show(); this._jquery(this._buttons.cancel, this._context).show(); this._jquery(this._buttons.edit, this._context).hide(); this._jquery(this._infoText, this._context).show(); this._jquery(this._buttons.edit, this._context).removeClass("disabled"); this._jquery(this._messageContainer, this._context).show(); break; } }; TextEditor.prototype._updateCountArea = function (text) {
            this._jquery("#" + this._characterCountId, this._context).remove(); if (!this._jquery("#" + this._characterCountId, this._context).length) { this._jquery("." + this._redactorToolbarClass, this._context).append("<li id='" + this._characterCountId + "'>" + text.length + " of " + this._maxlength + "</li>"); }
            this._jquery("#" + this._characterCountId, this._context).addClass("characterCount"); if (text.length <= this._maxlength && text.length >= this._minlength) { this._jquery("#" + this._characterCountId, this._context).html(text.length + " of " + this._maxlength); this._jquery(this._buttons.save, this._context).removeClass("disabled"); } else if (text.length <= this._minlength) { this._jquery(this._buttons.save, this._context).addClass("disabled"); this._jquery("#" + this._characterCountId, this._context).html("<span class='characterWarning'>Minimum of " + this._minlength + " characters required </span>" + text.length + " of " + this._maxlength); } else { this._jquery(this._buttons.save, this._context).addClass("disabled"); this._jquery("#" + this._characterCountId, this._context).html("<span class='characterWarning'>Character Limit Exceeded </span>" + text.length + " of " + this._maxlength); }
        }; return TextEditor;
    })(); Framework.TextEditor = TextEditor; (function (Utilities) {
        function HumanReadableFromFileSize(bytes, unitSize) {
            bytes = bytes; unitSize = unitSize; var thresh = unitSize ? 1000 : 1024; if (bytes < thresh)
                return bytes + ' B'; var units = unitSize ? ['KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'] : ['KiB', 'MiB', 'GiB', 'TiB', 'PiB', 'EiB', 'ZiB', 'YiB']; var u = -1; do { bytes /= thresh; ++u; } while (bytes >= thresh); var readable = bytes.toFixed(1) + ' ' + units[u]; return readable;
        }
        Utilities.HumanReadableFromFileSize = HumanReadableFromFileSize; function IsJsonValid(str) {
            var isValid = true; try { JSON.parse(str); } catch (e) { isValid = false; }
            return isValid;
        }
        Utilities.IsJsonValid = IsJsonValid;
    })(Framework.Utilities || (Framework.Utilities = {})); var Utilities = Framework.Utilities; (function (Messaging) {
        function CreateMessage(data, options) {
            this.options = options; toastr.options = this.options; if (data != null) {
                switch (data.type) {
                    case "success": toastr.success(data.message, data.title); if (typeof this._success == "function")
                        this._success(); break; case "error": toastr.error(data.message, data.title); if (typeof this._error == "function")
                            this._error(); break; case "warning": toastr.warning(data.message, data.title); if (typeof this._warning == "function")
                                this._warning(); break; case "info": toastr.info(data.message, data.title); if (typeof this._info == "function")
                                    this._info(); break;
                }
            }
        }
        Messaging.CreateMessage = CreateMessage;
    })(Framework.Messaging || (Framework.Messaging = {})); var Messaging = Framework.Messaging;
})(Framework || (Framework = {}));

; jQuery.extend({
    parseQuerystring: function () {
        var nvpair = {}; var qs = window.location.search.replace('?', ''); var pairs = qs.split('&'); var $jjx = ''; if (typeof ($8) != 'undefined') { $jjx = $8; } else { $jjx = jQuery; }
        $jjx.each(pairs, function (i, v) { var pair = v.split('='); nvpair[pair[0]] = pair[1]; }); return nvpair;
    }
});

jQuery.extend({
    stringify: function stringify(obj) {
        var t = typeof (obj); if (t != "object" || obj === null) { if (t == "string") obj = '"' + obj + '"'; return String(obj); } else {
            var n, v, json = [], arr = (obj && obj.constructor == Array); for (n in obj) { v = obj[n]; t = typeof (v); if (obj.hasOwnProperty(n)) { if (t == "string") v = '"' + v + '"'; else if (t == "object" && v !== null) v = $8.stringify(v); json.push((arr ? "" : '"' + n + '":') + String(v)); } }
            return (arr ? "[" : "{") + String(json) + (arr ? "]" : "}");
        }
    }
});

(function ($, document, undefined) {
    var pluses = /\+/g; function raw(s) { return s; }
    function decoded(s) { return decodeURIComponent(s.replace(pluses, ' ')); }
    var config = $.cookie = function (key, value, options) {
        if (value !== undefined) {
            options = $.extend({}, config.defaults, options); if (value === null) { options.expires = -1; }
            if (typeof options.expires === 'number') { var days = options.expires, t = options.expires = new Date(); t.setDate(t.getDate() + days); }
            value = config.json ? JSON.stringify(value) : String(value); return (document.cookie = [encodeURIComponent(key), '=', config.raw ? value : encodeURIComponent(value), options.expires ? '; expires=' + options.expires.toUTCString() : '', options.path ? '; path=' + options.path : '', options.domain ? '; domain=' + options.domain : '', options.secure ? '; secure' : ''].join(''));
        }
        var decode = config.raw ? raw : decoded; var cookies = document.cookie.split('; '); for (var i = 0, l = cookies.length; i < l; i++) { var parts = cookies[i].split('='); if (decode(parts.shift()) === key) { var cookie = decode(parts.join('=')); return config.json ? JSON.parse(cookie) : cookie; } }
        return null;
    }; config.defaults = {}; $.removeCookie = function (key, options) {
        if ($.cookie(key) !== null) { $.cookie(key, null, options); return true; }
        return false;
    };
})(jQuery, document);

(function ($) {
    $.fn.extend({
        customSelect: function (options) {
            if (!$.browser.msie || ($.browser.msie && $.browser.version > 6)) {
                return this.each(function () {
                    var currentSelected = $(this).find(':selected'); var html = currentSelected.html(); if (!html) { html = '&nbsp;'; }
                    $(this).after('<span class="customStyleSelectBox"><span class="customStyleSelectBoxInner">' + html + '</span></span>').css({ position: 'absolute', opacity: 0, fontSize: $(this).next().css('font-size') }); var selectBoxSpan = $(this).next(); var selectBoxWidth = parseInt($(this).width()) - parseInt(selectBoxSpan.css('padding-left')) - parseInt(selectBoxSpan.css('padding-right')); var selectBoxSpanInner = selectBoxSpan.find(':first-child'); selectBoxSpan.css({ display: 'inline-block' }); selectBoxSpanInner.css({ width: selectBoxWidth, display: 'inline-block' }); var selectBoxHeight = parseInt(selectBoxSpan.height()) + parseInt(selectBoxSpan.css('padding-top')) + parseInt(selectBoxSpan.css('padding-bottom')); $(this).height(selectBoxHeight).change(function () { selectBoxSpanInner.text($(this).find(':selected').text()).parent().addClass('changed'); });
                });
            }
        }
    });
})(jQuery);



(function ($) { if (typeof $.fn.each2 == "undefined") { $.fn.extend({ each2: function (c) { var j = $([0]), i = -1, l = this.length; while (++i < l && (j.context = j[0] = this[i]) && c.call(j[0], i, j) !== false); return this; } }); } })(jQuery); (function ($, undefined) {
    "use strict"; if (window.Select2 !== undefined) { return; }
    var KEY, AbstractSelect2, SingleSelect2, MultiSelect2, nextUid, sizer, lastMousePosition, $document; KEY = {
        TAB: 9, ENTER: 13, ESC: 27, SPACE: 32, LEFT: 37, UP: 38, RIGHT: 39, DOWN: 40, SHIFT: 16, CTRL: 17, ALT: 18, PAGE_UP: 33, PAGE_DOWN: 34, HOME: 36, END: 35, BACKSPACE: 8, DELETE: 46, isArrow: function (k) {
            k = k.which ? k.which : k; switch (k) { case KEY.LEFT: case KEY.RIGHT: case KEY.UP: case KEY.DOWN: return true; }
            return false;
        }, isControl: function (e) {
            var k = e.which; switch (k) { case KEY.SHIFT: case KEY.CTRL: case KEY.ALT: return true; }
            if (e.metaKey) return true; return false;
        }, isFunctionKey: function (k) { k = k.which ? k.which : k; return k >= 112 && k <= 123; }
    }; $document = $(document); nextUid = (function () { var counter = 1; return function () { return counter++; }; }()); function indexOf(value, array) {
        var i = 0, l = array.length; for (; i < l; i = i + 1) { if (equal(value, array[i])) return i; }
        return -1;
    }
    function equal(a, b) { if (a === b) return true; if (a === undefined || b === undefined) return false; if (a === null || b === null) return false; if (a.constructor === String) return a + '' === b + ''; if (b.constructor === String) return b + '' === a + ''; return false; }
    function splitVal(string, separator) { var val, i, l; if (string === null || string.length < 1) return []; val = string.split(separator); for (i = 0, l = val.length; i < l; i = i + 1) val[i] = $.trim(val[i]); return val; }
    function getSideBorderPadding(element) { return element.outerWidth(false) - element.width(); }
    function installKeyUpChangeEvent(element) { var key = "keyup-change-value"; element.bind("keydown", function () { if ($.data(element, key) === undefined) { $.data(element, key, element.val()); } }); element.bind("keyup", function () { var val = $.data(element, key); if (val !== undefined && element.val() !== val) { $.removeData(element, key); element.trigger("keyup-change"); } }); }
    $document.bind("mousemove", function (e) { lastMousePosition = { x: e.pageX, y: e.pageY }; }); function installFilteredMouseMove(element) { element.bind("mousemove", function (e) { var lastpos = lastMousePosition; if (lastpos === undefined || lastpos.x !== e.pageX || lastpos.y !== e.pageY) { $(e.target).trigger("mousemove-filtered", e); } }); }
    function debounce(quietMillis, fn, ctx) { ctx = ctx || undefined; var timeout; return function () { var args = arguments; window.clearTimeout(timeout); timeout = window.setTimeout(function () { fn.apply(ctx, args); }, quietMillis); }; }
    function thunk(formula) {
        var evaluated = false, value; return function () {
            if (evaluated === false) { value = formula(); evaluated = true; }
            return value;
        };
    }; function installDebouncedScroll(threshold, element) { var notify = debounce(threshold, function (e) { element.trigger("scroll-debounced", e); }); element.bind("scroll", function (e) { if (indexOf(e.target, element.get()) >= 0) notify(e); }); }
    function focus($el) {
        if ($el[0] === document.activeElement) return; window.setTimeout(function () {
            var el = $el[0], pos = $el.val().length, range; $el.focus(); if ($el.is(":visible") && el === document.activeElement) {
                if (el.setSelectionRange) { el.setSelectionRange(pos, pos); }
                else if (el.createTextRange) { range = el.createTextRange(); range.collapse(false); range.select(); }
            }
        }, 0);
    }
    function killEvent(event) { event.preventDefault(); event.stopPropagation(); }
    function killEventImmediately(event) { event.preventDefault(); event.stopImmediatePropagation(); }
    function measureTextWidth(e) {
        if (!sizer) { var style = e[0].currentStyle || window.getComputedStyle(e[0], null); sizer = $(document.createElement("div")).css({ position: "absolute", left: "-10000px", top: "-10000px", display: "none", fontSize: style.fontSize, fontFamily: style.fontFamily, fontStyle: style.fontStyle, fontWeight: style.fontWeight, letterSpacing: style.letterSpacing, textTransform: style.textTransform, whiteSpace: "nowrap" }); sizer.attr("class", "select2-sizer"); $("body").append(sizer); }
        sizer.text(e.val()); return sizer.width();
    }
    function syncCssClasses(dest, src, adapter) {
        var classes, replacements = [], adapted; classes = dest.attr("class"); if (classes) { classes = '' + classes; $(classes.split(" ")).each2(function () { if (this.indexOf("select2-") === 0) { replacements.push(this); } }); }
        classes = src.attr("class"); if (classes) { classes = '' + classes; $(classes.split(" ")).each2(function () { if (this.indexOf("select2-") !== 0) { adapted = adapter(this); if (adapted) { replacements.push(this); } } }); }
        dest.attr("class", replacements.join(" "));
    }
    function markMatch(text, term, markup, escapeMarkup) {
        var match = text.toUpperCase().indexOf(term.toUpperCase()), tl = term.length; if (match < 0) { markup.push(escapeMarkup(text)); return; }
        markup.push(escapeMarkup(text.substring(0, match))); markup.push("<span class='select2-match'>"); markup.push(escapeMarkup(text.substring(match, match + tl))); markup.push("</span>"); markup.push(escapeMarkup(text.substring(match + tl, text.length)));
    }
    function ajax(options) {
        var timeout, requestSequence = 0, handler = null, quietMillis = options.quietMillis || 100, ajaxUrl = options.url, self = this; return function (query) {
            window.clearTimeout(timeout); timeout = window.setTimeout(function () {
                requestSequence += 1; var requestNumber = requestSequence, data = options.data, url = ajaxUrl, transport = options.transport || $.ajax, type = options.type || 'GET', params = {}; data = data ? data.call(self, query.term, query.page, query.context) : null; url = (typeof url === 'function') ? url.call(self, query.term, query.page, query.context) : url; if (null !== handler) { handler.abort(); }
                if (options.params) { if ($.isFunction(options.params)) { $.extend(params, options.params.call(self)); } else { $.extend(params, options.params); } }
                $.extend(params, {
                    url: url, dataType: options.dataType, data: data, type: type, cache: false, success: function (data) {
                        if (requestNumber < requestSequence) { return; }
                        var results = options.results(data, query.page); query.callback(results);
                    }
                }); handler = transport.call(self, params);
            }, quietMillis);
        };
    }
    function local(options) {
        var data = options, dataText, tmp, text = function (item) { return "" + item.text; }; if ($.isArray(data)) { tmp = data; data = { results: tmp }; }
        if ($.isFunction(data) === false) { tmp = data; data = function () { return tmp; }; }
        var dataItem = data(); if (dataItem.text) { text = dataItem.text; if (!$.isFunction(text)) { dataText = data.text; text = function (item) { return item[dataText]; }; } }
        return function (query) {
            var t = query.term, filtered = { results: [] }, process; if (t === "") { query.callback(data()); return; }
            process = function (datum, collection) {
                var group, attr; datum = datum[0]; if (datum.children) {
                    group = {}; for (attr in datum) { if (datum.hasOwnProperty(attr)) group[attr] = datum[attr]; }
                    group.children = []; $(datum.children).each2(function (i, childDatum) { process(childDatum, group.children); }); if (group.children.length || query.matcher(t, text(group), datum)) { collection.push(group); }
                } else { if (query.matcher(t, text(datum), datum)) { collection.push(datum); } }
            }; $(data().results).each2(function (i, datum) { process(datum, filtered.results); }); query.callback(filtered);
        };
    }
    function tags(data) { var isFunc = $.isFunction(data); return function (query) { var t = query.term, filtered = { results: [] }; $(isFunc ? data() : data).each(function () { var isObject = this.text !== undefined, text = isObject ? this.text : this; if (t === "" || query.matcher(t, text)) { filtered.results.push(isObject ? this : { id: this, text: this }); } }); query.callback(filtered); }; }
    function checkFormatter(formatter, formatterName) { if ($.isFunction(formatter)) return true; if (!formatter) return false; throw new Error("formatterName must be a function or a falsy value"); }
    function evaluate(val) { return $.isFunction(val) ? val() : val; }
    function countResults(results) { var count = 0; $.each(results, function (i, item) { if (item.children) { count += countResults(item.children); } else { count++; } }); return count; }
    function defaultTokenizer(input, selection, selectCallback, opts) {
        var original = input, dupe = false, token, index, i, l, separator; if (!opts.createSearchChoice || !opts.tokenSeparators || opts.tokenSeparators.length < 1) return undefined; while (true) {
            index = -1; for (i = 0, l = opts.tokenSeparators.length; i < l; i++) { separator = opts.tokenSeparators[i]; index = input.indexOf(separator); if (index >= 0) break; }
            if (index < 0) break; token = input.substring(0, index); input = input.substring(index + separator.length); if (token.length > 0) {
                token = opts.createSearchChoice(token, selection); if (token !== undefined && token !== null && opts.id(token) !== undefined && opts.id(token) !== null) {
                    dupe = false; for (i = 0, l = selection.length; i < l; i++) { if (equal(opts.id(token), opts.id(selection[i]))) { dupe = true; break; } }
                    if (!dupe) selectCallback(token);
                }
            }
        }
        if (original !== input) return input;
    }
    function clazz(SuperClass, methods) { var constructor = function () { }; constructor.prototype = new SuperClass; constructor.prototype.constructor = constructor; constructor.prototype.parent = SuperClass.prototype; constructor.prototype = $.extend(constructor.prototype, methods); return constructor; }
    AbstractSelect2 = clazz(Object, {
        bind: function (func) { var self = this; return function () { func.apply(self, arguments); }; }, init: function (opts) {
            var results, search, resultsSelector = ".select2-results", mask; this.opts = opts = this.prepareOpts(opts); this.id = opts.id; if (opts.element.data("select2") !== undefined && opts.element.data("select2") !== null) { this.destroy(); }
            this.enabled = true; this.container = this.createContainer(); this.containerId = "s2id_" + (opts.element.attr("id") || "autogen" + nextUid()); this.containerSelector = "#" + this.containerId.replace(/([;&,\.\+\*\~':"\!\^#$%@\[\]\(\)=>\|])/g, '\\$1'); this.container.attr("id", this.containerId); this.body = thunk(function () { return opts.element.closest("body"); }); syncCssClasses(this.container, this.opts.element, this.opts.adaptContainerCssClass); this.container.css(evaluate(opts.containerCss)); this.container.addClass(evaluate(opts.containerCssClass)); this.elementTabIndex = this.opts.element.attr("tabIndex"); this.opts.element.data("select2", this).addClass("select2-offscreen").bind("focus.select2", function () { $(this).select2("focus"); }).attr("tabIndex", "-1").before(this.container); this.container.data("select2", this); this.dropdown = this.container.find(".select2-drop"); this.dropdown.addClass(evaluate(opts.dropdownCssClass)); this.dropdown.data("select2", this); this.results = results = this.container.find(resultsSelector); this.search = search = this.container.find("input.select2-input"); search.attr("tabIndex", this.elementTabIndex); this.resultsPage = 0; this.context = null; this.initContainer(); installFilteredMouseMove(this.results); this.dropdown.delegate(resultsSelector, "mousemove-filtered touchstart touchmove touchend", this.bind(this.highlightUnderEvent)); installDebouncedScroll(80, this.results); this.dropdown.delegate(resultsSelector, "scroll-debounced", this.bind(this.loadMoreIfNeeded)); if ($.fn.mousewheel) { results.mousewheel(function (e, delta, deltaX, deltaY) { var top = results.scrollTop(), height; if (deltaY > 0 && top - deltaY <= 0) { results.scrollTop(0); killEvent(e); } else if (deltaY < 0 && results.get(0).scrollHeight - results.scrollTop() + deltaY <= results.height()) { results.scrollTop(results.get(0).scrollHeight - results.height()); killEvent(e); } }); }
            installKeyUpChangeEvent(search); search.bind("keyup-change input paste", this.bind(this.updateResults)); search.bind("focus", function () { search.addClass("select2-focused"); }); search.bind("blur", function () { search.removeClass("select2-focused"); }); this.dropdown.delegate(resultsSelector, "mouseup", this.bind(function (e) { if ($(e.target).closest(".select2-result-selectable").length > 0) { this.highlightUnderEvent(e); this.selectHighlighted(e); } })); this.dropdown.bind("click mouseup mousedown", function (e) { e.stopPropagation(); }); if ($.isFunction(this.opts.initSelection)) { this.initSelection(); this.monitorSource(); }
            if (opts.element.is(":disabled") || opts.element.is("[readonly='readonly']")) this.disable();
        }, destroy: function () {
            var select2 = this.opts.element.data("select2"); if (this.propertyObserver) { delete this.propertyObserver; this.propertyObserver = null; }
            if (select2 !== undefined) { select2.container.remove(); select2.dropdown.remove(); select2.opts.element.removeClass("select2-offscreen").removeData("select2").unbind(".select2").attr({ "tabIndex": this.elementTabIndex }).show(); }
        }, prepareOpts: function (opts) {
            var element, select, idKey, ajaxUrl; element = opts.element; if (element.get(0).tagName.toLowerCase() === "select") { this.select = select = opts.element; }
            if (select) { $.each(["id", "multiple", "ajax", "query", "createSearchChoice", "initSelection", "data", "tags"], function () { if (this in opts) { throw new Error("Option '" + this + "' is not allowed for Select2 when attached to a <select> element."); } }); }
            opts = $.extend({}, {
                populateResults: function (container, results, query) {
                    var populate, data, result, children, id = this.opts.id, self = this; populate = function (results, container, depth) {
                        var i, l, result, selectable, disabled, compound, node, label, innerContainer, formatted; results = opts.sortResults(results, container, query); for (i = 0, l = results.length; i < l; i = i + 1) {
                            result = results[i]; disabled = (result.disabled === true); selectable = (!disabled) && (id(result) !== undefined); compound = result.children && result.children.length > 0; node = $("<li></li>"); node.addClass("select2-results-dept-" + depth); node.addClass("select2-result"); node.addClass(selectable ? "select2-result-selectable" : "select2-result-unselectable"); if (disabled) { node.addClass("select2-disabled"); }
                            if (compound) { node.addClass("select2-result-with-children"); }
                            node.addClass(self.opts.formatResultCssClass(result)); label = $(document.createElement("div")); label.addClass("select2-result-label"); formatted = opts.formatResult(result, label, query, self.opts.escapeMarkup); if (formatted !== undefined) { label.html(formatted); }
                            node.append(label); if (compound) { innerContainer = $("<ul></ul>"); innerContainer.addClass("select2-result-sub"); populate(result.children, innerContainer, depth + 1); node.append(innerContainer); }
                            node.data("select2-data", result); container.append(node);
                        }
                    }; populate(results, container, 0);
                }
            }, $.fn.select2.defaults, opts); if (typeof (opts.id) !== "function") { idKey = opts.id; opts.id = function (e) { return e[idKey]; }; }
            if ($.isArray(opts.element.data("select2Tags"))) {
                if ("tags" in opts) { throw "tags specified as both an attribute 'data-select2-tags' and in options of Select2 " + opts.element.attr("id"); }
                opts.tags = opts.element.data("select2Tags");
            }
            if (select) {
                opts.query = this.bind(function (query) {
                    var data = { results: [], more: false }, term = query.term, children, firstChild, process; process = function (element, collection) { var group; if (element.is("option")) { if (query.matcher(term, element.text(), element)) { collection.push({ id: element.attr("value"), text: element.text(), element: element.get(), css: element.attr("class"), disabled: equal(element.attr("disabled"), "disabled") }); } } else if (element.is("optgroup")) { group = { text: element.attr("label"), children: [], element: element.get(), css: element.attr("class") }; element.children().each2(function (i, elm) { process(elm, group.children); }); if (group.children.length > 0) { collection.push(group); } } }; children = element.children(); if (this.getPlaceholder() !== undefined && children.length > 0) { firstChild = children[0]; if ($(firstChild).text() === "") { children = children.not(firstChild); } }
                    children.each2(function (i, elm) { process(elm, data.results); }); query.callback(data);
                }); opts.id = function (e) { return e.id; }; opts.formatResultCssClass = function (data) { return data.css; };
            } else {
                if (!("query" in opts)) {
                    if ("ajax" in opts) {
                        ajaxUrl = opts.element.data("ajax-url"); if (ajaxUrl && ajaxUrl.length > 0) { opts.ajax.url = ajaxUrl; }
                        opts.query = ajax.call(opts.element, opts.ajax);
                    } else if ("data" in opts) { opts.query = local(opts.data); } else if ("tags" in opts) {
                        opts.query = tags(opts.tags); if (opts.createSearchChoice === undefined) { opts.createSearchChoice = function (term) { return { id: term, text: term }; }; }
                        if (opts.initSelection === undefined) { opts.initSelection = function (element, callback) { var data = []; $(splitVal(element.val(), opts.separator)).each(function () { var id = this, text = this, tags = opts.tags; if ($.isFunction(tags)) tags = tags(); $(tags).each(function () { if (equal(this.id, id)) { text = this.text; return false; } }); data.push({ id: id, text: text }); }); callback(data); }; }
                    }
                }
            }
            if (typeof (opts.query) !== "function") { throw "query function not defined for Select2 " + opts.element.attr("id"); }
            return opts;
        }, monitorSource: function () {
            var el = this.opts.element, sync; el.bind("change.select2", this.bind(function (e) { if (this.opts.element.data("select2-change-triggered") !== true) { this.initSelection(); } })); sync = this.bind(function () {
                var enabled, readonly, self = this; enabled = this.opts.element.attr("disabled") !== "disabled"; readonly = this.opts.element.attr("readonly") === "readonly"; enabled = enabled && !readonly; if (this.enabled !== enabled) { if (enabled) { this.enable(); } else { this.disable(); } }
                syncCssClasses(this.container, this.opts.element, this.opts.adaptContainerCssClass); this.container.addClass(evaluate(this.opts.containerCssClass)); syncCssClasses(this.dropdown, this.opts.element, this.opts.adaptDropdownCssClass); this.dropdown.addClass(evaluate(this.opts.dropdownCssClass));
            }); el.bind("propertychange.select2 DOMAttrModified.select2", sync); if (typeof WebKitMutationObserver !== "undefined") {
                if (this.propertyObserver) { delete this.propertyObserver; this.propertyObserver = null; }
                this.propertyObserver = new WebKitMutationObserver(function (mutations) { mutations.forEach(sync); }); this.propertyObserver.observe(el.get(0), { attributes: true, subtree: false });
            }
        }, triggerChange: function (details) {
            details = details || {}; details = $.extend({}, details, { type: "change", val: this.val() }); this.opts.element.data("select2-change-triggered", true); this.opts.element.trigger(details); this.opts.element.data("select2-change-triggered", false); this.opts.element.click(); if (this.opts.blurOnChange)
                this.opts.element.blur();
        }, enable: function () { if (this.enabled) return; this.enabled = true; this.container.removeClass("select2-container-disabled"); this.opts.element.removeAttr("disabled"); }, disable: function () { if (!this.enabled) return; this.close(); this.enabled = false; this.container.addClass("select2-container-disabled"); this.opts.element.attr("disabled", "disabled"); }, opened: function () { return this.container.hasClass("select2-dropdown-open"); }, positionDropdown: function () {
            var offset = this.container.offset(), height = this.container.outerHeight(false), width = this.container.outerWidth(false), dropHeight = this.dropdown.outerHeight(false), viewPortRight = $(window).scrollLeft() + $(window).width(), viewportBottom = $(window).scrollTop() + $(window).height(), dropTop = offset.top + height, dropLeft = offset.left, enoughRoomBelow = dropTop + dropHeight <= viewportBottom, enoughRoomAbove = (offset.top - dropHeight) >= this.body().scrollTop(), dropWidth = this.dropdown.outerWidth(false), enoughRoomOnRight = dropLeft + dropWidth <= viewPortRight, aboveNow = this.dropdown.hasClass("select2-drop-above"), bodyOffset, above, css; if (this.body().css('position') !== 'static') { bodyOffset = this.body().offset(); dropTop -= bodyOffset.top; dropLeft -= bodyOffset.left; }
            if (aboveNow) { above = true; if (!enoughRoomAbove && enoughRoomBelow) above = false; } else { above = false; if (!enoughRoomBelow && enoughRoomAbove) above = true; }
            if (!enoughRoomOnRight) { dropLeft = offset.left + width - dropWidth; }
            if (above) { dropTop = offset.top - dropHeight; this.container.addClass("select2-drop-above"); this.dropdown.addClass("select2-drop-above"); }
            else { this.container.removeClass("select2-drop-above"); this.dropdown.removeClass("select2-drop-above"); }
            css = $.extend({ top: dropTop, left: dropLeft, width: width }, evaluate(this.opts.dropdownCss)); this.dropdown.css(css);
        }, shouldOpen: function () { var event; if (this.opened()) return false; event = $.Event("opening"); this.opts.element.trigger(event); return !event.isDefaultPrevented(); }, clearDropdownAlignmentPreference: function () { this.container.removeClass("select2-drop-above"); this.dropdown.removeClass("select2-drop-above"); }, open: function () { if (!this.shouldOpen()) return false; this.opening(); return true; }, opening: function () {
            var cid = this.containerId, scroll = "scroll." + cid, resize = "resize." + cid, orient = "orientationchange." + cid, mask; this.clearDropdownAlignmentPreference(); this.container.addClass("select2-dropdown-open").addClass("select2-container-active"); if (this.dropdown[0] !== this.body().children().last()[0]) { this.dropdown.detach().appendTo(this.body()); }
            this.updateResults(true); mask = $("#select2-drop-mask"); if (mask.length == 0) {
                mask = $(document.createElement("div")); mask.attr("id", "select2-drop-mask").attr("class", "select2-drop-mask"); mask.hide(); mask.appendTo(this.body()); mask.bind("mousedown touchstart", function (e) {
                    var dropdown = $("#select2-drop"), self; if (dropdown.length > 0) {
                        self = dropdown.data("select2"); if (self.opts.selectOnBlur) { self.selectHighlighted({ noFocus: true }); }
                        self.close();
                    }
                });
            }
            if (this.dropdown.prev()[0] !== mask[0]) { this.dropdown.before(mask); }
            $("#select2-drop").removeAttr("id"); this.dropdown.attr("id", "select2-drop"); mask.css(_makeMaskCss()); mask.show(); this.dropdown.show(); this.positionDropdown(); this.dropdown.addClass("select2-drop-active"); this.ensureHighlightVisible(); var that = this; this.container.parents().add(window).each(function () { $(this).bind(resize + " " + scroll + " " + orient, function (e) { $("#select2-drop-mask").css(_makeMaskCss()); that.positionDropdown(); }); }); this.focusSearch(); function _makeMaskCss() { return { width: Math.max(document.documentElement.scrollWidth, $(window).width()), height: Math.max(document.documentElement.scrollHeight, $(window).height()) } }
        }, close: function () { if (!this.opened()) return; var cid = this.containerId, scroll = "scroll." + cid, resize = "resize." + cid, orient = "orientationchange." + cid; this.container.parents().add(window).each(function () { $(this).unbind(scroll).unbind(resize).unbind(orient); }); this.clearDropdownAlignmentPreference(); $("#select2-drop-mask").hide(); this.dropdown.removeAttr("id"); this.dropdown.hide(); this.container.removeClass("select2-dropdown-open"); this.results.empty(); this.clearSearch(); this.search.removeClass("select2-active"); this.opts.element.trigger($.Event("close")); }, clearSearch: function () { }, getMaximumSelectionSize: function () { return evaluate(this.opts.maximumSelectionSize); }, ensureHighlightVisible: function () {
            var results = this.results, children, index, child, hb, rb, y, more; index = this.highlight(); if (index < 0) return; if (index == 0) { results.scrollTop(0); return; }
            children = this.findHighlightableChoices(); child = $(children[index]); hb = child.offset().top + child.outerHeight(true); if (index === children.length - 1) { more = results.find("li.select2-more-results"); if (more.length > 0) { hb = more.offset().top + more.outerHeight(true); } }
            rb = results.offset().top + results.outerHeight(true); if (hb > rb) { results.scrollTop(results.scrollTop() + (hb - rb)); }
            y = child.offset().top - results.offset().top; if (y < 0 && child.css('display') != 'none') { results.scrollTop(results.scrollTop() + y); }
        }, findHighlightableChoices: function () { var h = this.results.find(".select2-result-selectable:not(.select2-selected):not(.select2-disabled)"); return this.results.find(".select2-result-selectable:not(.select2-selected):not(.select2-disabled)"); }, moveHighlight: function (delta) { var choices = this.findHighlightableChoices(), index = this.highlight(); while (index > -1 && index < choices.length) { index += delta; var choice = $(choices[index]); if (choice.hasClass("select2-result-selectable") && !choice.hasClass("select2-disabled") && !choice.hasClass("select2-selected")) { this.highlight(index); break; } } }, highlight: function (index) {
            var choices = this.findHighlightableChoices(), choice, data; if (arguments.length === 0) { return indexOf(choices.filter(".select2-highlighted")[0], choices.get()); }
            if (index >= choices.length) index = choices.length - 1; if (index < 0) index = 0; this.results.find(".select2-highlighted").removeClass("select2-highlighted"); choice = $(choices[index]); choice.addClass("select2-highlighted"); this.ensureHighlightVisible(); data = choice.data("select2-data"); if (data) { this.opts.element.trigger({ type: "highlight", val: this.id(data), choice: data }); }
        }, countSelectableResults: function () { return this.findHighlightableChoices().length; }, highlightUnderEvent: function (event) { var el = $(event.target).closest(".select2-result-selectable"); if (el.length > 0 && !el.is(".select2-highlighted")) { var choices = this.findHighlightableChoices(); this.highlight(choices.index(el)); } else if (el.length == 0) { this.results.find(".select2-highlighted").removeClass("select2-highlighted"); } }, loadMoreIfNeeded: function () {
            var results = this.results, more = results.find("li.select2-more-results"), below, offset = -1, page = this.resultsPage + 1, self = this, term = this.search.val(), context = this.context; if (more.length === 0) return; below = more.offset().top - results.offset().top - results.height(); if (below <= this.opts.loadMorePadding) {
                more.addClass("select2-active"); this.opts.query({
                    element: this.opts.element, term: term, page: page, context: context, matcher: this.opts.matcher, callback: this.bind(function (data) {
                        if (!self.opened()) return; self.opts.populateResults.call(this, results, data.results, { term: term, page: page, context: context }); self.postprocessResults(data, false, false); if (data.more === true) { more.detach().appendTo(results).text(self.opts.formatLoadMore(page + 1)); window.setTimeout(function () { self.loadMoreIfNeeded(); }, 10); } else { more.remove(); }
                        self.positionDropdown(); self.resultsPage = page; self.context = data.context;
                    })
                });
            }
        }, tokenize: function () { }, updateResults: function (initial) {
            var search = this.search, results = this.results, opts = this.opts, data, self = this, input, term = search.val(), lastTerm = $.data(this.container, "select2-last-term"); if (initial !== true && lastTerm && equal(term, lastTerm)) return; $.data(this.container, "select2-last-term", term); if (initial !== true && (this.showSearchInput === false || !this.opened())) { return; }
            function postRender() { results.scrollTop(0); search.removeClass("select2-active"); self.positionDropdown(); }
            function render(html) { results.html(html); postRender(); }
            var maxSelSize = this.getMaximumSelectionSize(); if (maxSelSize >= 1) { data = this.data(); if ($.isArray(data) && data.length >= maxSelSize && checkFormatter(opts.formatSelectionTooBig, "formatSelectionTooBig")) { render("<li class='select2-selection-limit'>" + opts.formatSelectionTooBig(maxSelSize) + "</li>"); return; } }
            if (search.val().length < opts.minimumInputLength) {
                if (checkFormatter(opts.formatInputTooShort, "formatInputTooShort")) { render("<li class='select2-no-results'>" + opts.formatInputTooShort(search.val(), opts.minimumInputLength) + "</li>"); } else { render(""); }
                return;
            }
            if (opts.maximumInputLength && search.val().length > opts.maximumInputLength) {
                if (checkFormatter(opts.formatInputTooLong, "formatInputTooLong")) { render("<li class='select2-no-results'>" + opts.formatInputTooLong(search.val(), opts.maximumInputLength) + "</li>"); } else { render(""); }
                return;
            }
            if (opts.formatSearching && this.findHighlightableChoices().length === 0) { render("<li class='select2-searching'>" + opts.formatSearching() + "</li>"); }
            search.addClass("select2-active"); input = this.tokenize(); if (input != undefined && input != null) { search.val(input); }
            this.resultsPage = 1; opts.query({
                element: opts.element, term: search.val(), page: this.resultsPage, context: null, matcher: opts.matcher, callback: this.bind(function (data) {
                    var def; if (!this.opened()) { this.search.removeClass("select2-active"); return; }
                    this.context = (data.context === undefined) ? null : data.context; if (this.opts.createSearchChoice && search.val() !== "") { def = this.opts.createSearchChoice.call(null, search.val(), data.results); if (def !== undefined && def !== null && self.id(def) !== undefined && self.id(def) !== null) { if ($(data.results).filter(function () { return equal(self.id(this), self.id(def)); }).length === 0) { data.results.unshift(def); } } }
                    if (data.results.length === 0 && checkFormatter(opts.formatNoMatches, "formatNoMatches")) { render("<li class='select2-no-results'>" + opts.formatNoMatches(search.val()) + "</li>"); return; }
                    results.empty(); self.opts.populateResults.call(this, results, data.results, { term: search.val(), page: this.resultsPage, context: null }); if (data.more === true && checkFormatter(opts.formatLoadMore, "formatLoadMore")) { results.append("<li class='select2-more-results'>" + self.opts.escapeMarkup(opts.formatLoadMore(this.resultsPage)) + "</li>"); window.setTimeout(function () { self.loadMoreIfNeeded(); }, 10); }
                    this.postprocessResults(data, initial); postRender(); this.opts.element.trigger({ type: "loaded", data: data });
                })
            });
        }, cancel: function () { this.close(); }, blur: function () {
            if (this.opts.selectOnBlur)
                this.selectHighlighted({ noFocus: true }); this.close(); this.container.removeClass("select2-container-active"); if (this.search[0] === document.activeElement) { this.search.blur(); }
            this.clearSearch(); this.selection.find(".select2-search-choice-focus").removeClass("select2-search-choice-focus");
        }, focusSearch: function () { focus(this.search); }, selectHighlighted: function (options) { var index = this.highlight(), highlighted = this.results.find(".select2-highlighted"), data = highlighted.closest('.select2-result').data("select2-data"); if (data) { this.highlight(index); this.onSelect(data, options); } }, getPlaceholder: function () { return this.opts.element.attr("placeholder") || this.opts.element.attr("data-placeholder") || this.opts.element.data("placeholder") || this.opts.placeholder; }, initContainerWidth: function () {
            function resolveContainerWidth() {
                var style, attrs, matches, i, l; if (this.opts.width === "off") { return null; } else if (this.opts.width === "element") { return this.opts.element.outerWidth(false) === 0 ? 'auto' : this.opts.element.outerWidth(false) + 'px'; } else if (this.opts.width === "copy" || this.opts.width === "resolve") {
                    style = this.opts.element.attr('style'); if (style !== undefined) {
                        attrs = style.split(';'); for (i = 0, l = attrs.length; i < l; i = i + 1) {
                            matches = attrs[i].replace(/\s/g, '').match(/width:(([-+]?([0-9]*\.)?[0-9]+)(px|em|ex|%|in|cm|mm|pt|pc))/); if (matches !== null && matches.length >= 1)
                                return matches[1];
                        }
                    }
                    if (this.opts.width === "resolve") { style = this.opts.element.css('width'); if (style.indexOf("%") > 0) return style; return (this.opts.element.outerWidth(false) === 0 ? 'auto' : this.opts.element.outerWidth(false) + 'px'); }
                    return null;
                } else if ($.isFunction(this.opts.width)) { return this.opts.width(); } else { return this.opts.width; }
            }; var width = resolveContainerWidth.call(this); if (width !== null) { this.container.css("width", width); }
        }
    }); SingleSelect2 = clazz(AbstractSelect2, {
        createContainer: function () { var container = $(document.createElement("div")).attr({ "class": "select2-container" }).html(["<a href='javascript:void(0)' onclick='return false;' class='select2-choice' tabindex='-1'>", "   <span></span><abbr class='select2-search-choice-close' style='display:none;'></abbr>", "   <div><b></b></div>", "</a>", "<input class='select2-focusser select2-offscreen' type='text'/>", "<div class='select2-drop' style='display:none'>", "   <div class='select2-search'>", "       <input type='text' autocomplete='off' class='select2-input'/>", "   </div>", "   <ul class='select2-results'>", "   </ul>", "</div>"].join("")); return container; }, disable: function () { if (!this.enabled) return; this.parent.disable.apply(this, arguments); this.focusser.attr("disabled", "disabled"); }, enable: function () { if (this.enabled) return; this.parent.enable.apply(this, arguments); this.focusser.removeAttr("disabled"); }, opening: function () { this.parent.opening.apply(this, arguments); this.focusser.attr("disabled", "disabled"); this.opts.element.trigger($.Event("open")); }, close: function () { if (!this.opened()) return; this.parent.close.apply(this, arguments); this.focusser.removeAttr("disabled"); focus(this.focusser); }, focus: function () { if (this.opened()) { this.close(); } else { this.focusser.removeAttr("disabled"); this.focusser.focus(); } }, isFocused: function () { return this.container.hasClass("select2-container-active"); }, cancel: function () { this.parent.cancel.apply(this, arguments); this.focusser.removeAttr("disabled"); this.focusser.focus(); }, initContainer: function () {
            var selection, container = this.container, dropdown = this.dropdown, clickingInside = false; this.showSearch(this.opts.minimumResultsForSearch >= 0); this.selection = selection = container.find(".select2-choice"); this.focusser = container.find(".select2-focusser"); this.focusser.attr("id", "s2id_autogen" + nextUid()); $("label[for='" + this.opts.element.attr("id") + "']").attr('for', this.focusser.attr('id')); this.search.bind("keydown", this.bind(function (e) {
                if (!this.enabled) return; if (e.which === KEY.PAGE_UP || e.which === KEY.PAGE_DOWN) { killEvent(e); return; }
                switch (e.which) { case KEY.UP: case KEY.DOWN: this.moveHighlight((e.which === KEY.UP) ? -1 : 1); killEvent(e); return; case KEY.TAB: case KEY.ENTER: this.selectHighlighted(); killEvent(e); return; case KEY.ESC: this.cancel(e); killEvent(e); return; }
            })); this.search.bind("blur", this.bind(function (e) { if (document.activeElement === this.body().get(0)) { window.setTimeout(this.bind(function () { this.search.focus(); }), 0); } })); this.focusser.bind("keydown", this.bind(function (e) {
                if (!this.enabled) return; if (e.which === KEY.TAB || KEY.isControl(e) || KEY.isFunctionKey(e) || e.which === KEY.ESC) { return; }
                if (this.opts.openOnEnter === false && e.which === KEY.ENTER) { killEvent(e); return; }
                if (e.which == KEY.DOWN || e.which == KEY.UP || (e.which == KEY.ENTER && this.opts.openOnEnter)) { this.open(); killEvent(e); return; }
                if (e.which == KEY.DELETE || e.which == KEY.BACKSPACE) {
                    if (this.opts.allowClear) { this.clear(); }
                    killEvent(e); return;
                }
            })); installKeyUpChangeEvent(this.focusser); this.focusser.bind("keyup-change input", this.bind(function (e) {
                if (this.opened()) return; this.open(); if (this.showSearchInput !== false) { this.search.val(this.focusser.val()); }
                this.focusser.val(""); killEvent(e);
            })); selection.delegate("abbr", "mousedown", this.bind(function (e) { if (!this.enabled) return; this.clear(); killEventImmediately(e); this.close(); this.selection.focus(); })); selection.bind("mousedown", this.bind(function (e) {
                clickingInside = true; if (this.opened()) { this.close(); } else if (this.enabled) { this.open(); }
                killEvent(e); clickingInside = false;
            })); dropdown.bind("mousedown", this.bind(function () { this.search.focus(); })); selection.bind("focus", this.bind(function (e) { killEvent(e); })); this.focusser.bind("focus", this.bind(function () { this.container.addClass("select2-container-active"); })).bind("blur", this.bind(function () { if (!this.opened()) { this.container.removeClass("select2-container-active"); } })); this.search.bind("focus", this.bind(function () { this.container.addClass("select2-container-active"); }))
            this.initContainerWidth(); this.setPlaceholder();
        }, clear: function (triggerChange) { var data = this.selection.data("select2-data"); if (data) { this.opts.element.val(""); this.selection.find("span").empty(); this.selection.removeData("select2-data"); this.setPlaceholder(); if (triggerChange !== false) { this.opts.element.trigger({ type: "removed", val: this.id(data), choice: data }); this.triggerChange({ removed: data }); } } }, initSelection: function () { var selected; if (this.opts.element.val() === "" && this.opts.element.text() === "") { this.close(); this.setPlaceholder(); } else { var self = this; this.opts.initSelection.call(null, this.opts.element, function (selected) { if (selected !== undefined && selected !== null) { self.updateSelection(selected); self.close(); self.setPlaceholder(); } }); } }, prepareOpts: function () {
            var opts = this.parent.prepareOpts.apply(this, arguments); if (opts.element.get(0).tagName.toLowerCase() === "select") {
                opts.initSelection = function (element, callback) {
                    var selected = element.find(":selected"); if ($.isFunction(callback))
                        callback({ id: selected.attr("value"), text: selected.text(), element: selected });
                };
            } else if ("data" in opts) {
                opts.initSelection = opts.initSelection || function (element, callback) {
                    var id = element.val(); var match = null; opts.query({
                        matcher: function (term, text, el) {
                            var is_match = equal(id, opts.id(el)); if (is_match) { match = el; }
                            return is_match;
                        }, callback: !$.isFunction(callback) ? $.noop : function () { callback(match); }
                    });
                };
            }
            return opts;
        }, getPlaceholder: function () {
            if (this.select) { if (this.select.find("option").first().text() !== "") { return undefined; } }
            return this.parent.getPlaceholder.apply(this, arguments);
        }, setPlaceholder: function () { var placeholder = this.getPlaceholder(); if (this.opts.element.val() === "" && placeholder !== undefined) { if (this.select && this.select.find("option:first").text() !== "") return; this.selection.find("span").html(this.opts.escapeMarkup(placeholder)); this.selection.addClass("select2-default"); this.selection.find("abbr").hide(); } }, postprocessResults: function (data, initial, noHighlightUpdate) {
            var selected = 0, self = this, showSearchInput = true; this.findHighlightableChoices().each2(function (i, elm) { if (equal(self.id(elm.data("select2-data")), self.opts.element.val())) { selected = i; return false; } }); if (noHighlightUpdate !== false) { this.highlight(selected); }
            if (initial === true) { var min = this.opts.minimumResultsForSearch; showSearchInput = min < 0 ? false : countResults(data.results) >= min; this.showSearch(showSearchInput); }
        }, showSearch: function (showSearchInput) { this.showSearchInput = showSearchInput; this.dropdown.find(".select2-search")[showSearchInput ? "removeClass" : "addClass"]("select2-search-hidden"); $(this.dropdown, this.container)[showSearchInput ? "addClass" : "removeClass"]("select2-with-searchbox"); }, onSelect: function (data, options) {
            var old = this.opts.element.val(); this.opts.element.val(this.id(data)); this.updateSelection(data); this.opts.element.trigger({ type: "selected", val: this.id(data), choice: data }); this.close(); if (!options || !options.noFocus)
                this.selection.focus(); if (!equal(old, this.id(data))) { this.triggerChange(); }
        }, updateSelection: function (data) {
            var container = this.selection.find("span"), formatted; this.selection.data("select2-data", data); container.empty(); formatted = this.opts.formatSelection(data, container); if (formatted !== undefined) { container.append(this.opts.escapeMarkup(formatted)); }
            this.selection.removeClass("select2-default"); if (this.opts.allowClear && this.getPlaceholder() !== undefined) { this.selection.find("abbr").show(); }
        }, val: function () {
            var val, triggerChange = false, data = null, self = this; if (arguments.length === 0) { return this.opts.element.val(); }
            val = arguments[0]; if (arguments.length > 1) { triggerChange = arguments[1]; }
            if (this.select) { this.select.val(val).find(":selected").each2(function (i, elm) { data = { id: elm.attr("value"), text: elm.text(), element: elm.get(0) }; return false; }); this.updateSelection(data); this.setPlaceholder(); if (triggerChange) { this.triggerChange(); } } else {
                if (this.opts.initSelection === undefined) { throw new Error("cannot call val() if initSelection() is not defined"); }
                if (!val && val !== 0) {
                    this.clear(triggerChange); if (triggerChange) { this.triggerChange(); }
                    return;
                }
                this.opts.element.val(val); this.opts.initSelection(this.opts.element, function (data) { self.opts.element.val(!data ? "" : self.id(data)); self.updateSelection(data); self.setPlaceholder(); if (triggerChange) { self.triggerChange(); } });
            }
        }, clearSearch: function () { this.search.val(""); this.focusser.val(""); }, data: function (value) { var data; if (arguments.length === 0) { data = this.selection.data("select2-data"); if (data == undefined) data = null; return data; } else { if (!value || value === "") { this.clear(); } else { this.opts.element.val(!value ? "" : this.id(value)); this.updateSelection(value); } } }
    }); MultiSelect2 = clazz(AbstractSelect2, {
        createContainer: function () { var container = $(document.createElement("div")).attr({ "class": "select2-container select2-container-multi" }).html(["    <ul class='select2-choices'>", "  <li class='select2-search-field'>", "    <input type='text' autocomplete='off' class='select2-input'>", "  </li>", "</ul>", "<div class='select2-drop select2-drop-multi' style='display:none;'>", "   <ul class='select2-results'>", "   </ul>", "</div>"].join("")); return container; }, prepareOpts: function () {
            var opts = this.parent.prepareOpts.apply(this, arguments); if (opts.element.get(0).tagName.toLowerCase() === "select") { opts.initSelection = function (element, callback) { var data = []; element.find(":selected").each2(function (i, elm) { data.push({ id: elm.attr("value"), text: elm.text(), element: elm[0] }); }); callback(data); }; } else if ("data" in opts) {
                opts.initSelection = opts.initSelection || function (element, callback) {
                    var ids = splitVal(element.val(), opts.separator); var matches = []; opts.query({
                        matcher: function (term, text, el) {
                            var is_match = $.grep(ids, function (id) { return equal(id, opts.id(el)); }).length; if (is_match) { matches.push(el); }
                            return is_match;
                        }, callback: !$.isFunction(callback) ? $.noop : function () { callback(matches); }
                    });
                };
            }
            return opts;
        }, initContainer: function () {
            var selector = ".select2-choices", selection; this.searchContainer = this.container.find(".select2-search-field"); this.selection = selection = this.container.find(selector); this.search.attr("id", "s2id_autogen" + nextUid()); $("label[for='" + this.opts.element.attr("id") + "']").attr('for', this.search.attr('id')); this.search.bind("input paste", this.bind(function () { if (!this.enabled) return; if (!this.opened()) { this.open(); } })); this.search.bind("keydown", this.bind(function (e) {
                if (!this.enabled) return; if (e.which === KEY.BACKSPACE && this.search.val() === "") {
                    this.close(); var choices, selected = selection.find(".select2-search-choice-focus"); if (selected.length > 0) { this.unselect(selected.first()); this.search.width(10); killEvent(e); return; }
                    choices = selection.find(".select2-search-choice:not(.select2-locked)"); if (choices.length > 0) { choices.last().addClass("select2-search-choice-focus"); }
                } else { selection.find(".select2-search-choice-focus").removeClass("select2-search-choice-focus"); }
                if (this.opened()) { switch (e.which) { case KEY.UP: case KEY.DOWN: this.moveHighlight((e.which === KEY.UP) ? -1 : 1); killEvent(e); return; case KEY.ENTER: case KEY.TAB: this.selectHighlighted(); killEvent(e); return; case KEY.ESC: this.cancel(e); killEvent(e); return; } }
                if (e.which === KEY.TAB || KEY.isControl(e) || KEY.isFunctionKey(e) || e.which === KEY.BACKSPACE || e.which === KEY.ESC) { return; }
                if (e.which === KEY.ENTER) { if (this.opts.openOnEnter === false) { return; } else if (e.altKey || e.ctrlKey || e.shiftKey || e.metaKey) { return; } }
                this.open(); if (e.which === KEY.PAGE_UP || e.which === KEY.PAGE_DOWN) { killEvent(e); }
                if (e.which === KEY.ENTER) { killEvent(e); }
            })); this.search.bind("keyup", this.bind(this.resizeSearch)); this.search.bind("blur", this.bind(function (e) { this.container.removeClass("select2-container-active"); this.search.removeClass("select2-focused"); if (!this.opened()) this.clearSearch(); e.stopImmediatePropagation(); })); this.container.delegate(selector, "mousedown", this.bind(function (e) {
                if (!this.enabled) return; if ($(e.target).closest(".select2-search-choice").length > 0) { return; }
                this.clearPlaceholder(); this.open(); this.focusSearch(); e.preventDefault();
            })); this.container.delegate(selector, "focus", this.bind(function () { if (!this.enabled) return; this.container.addClass("select2-container-active"); this.dropdown.addClass("select2-drop-active"); this.clearPlaceholder(); })); this.initContainerWidth(); this.clearSearch();
        }, enable: function () { if (this.enabled) return; this.parent.enable.apply(this, arguments); this.search.removeAttr("disabled"); }, disable: function () { if (!this.enabled) return; this.parent.disable.apply(this, arguments); this.search.attr("disabled", true); }, initSelection: function () {
            var data; if (this.opts.element.val() === "" && this.opts.element.text() === "") { this.updateSelection([]); this.close(); this.clearSearch(); }
            if (this.select || this.opts.element.val() !== "") { var self = this; this.opts.initSelection.call(null, this.opts.element, function (data) { if (data !== undefined && data !== null) { self.updateSelection(data); self.close(); self.clearSearch(); } }); }
        }, clearSearch: function () { var placeholder = this.getPlaceholder(); if (placeholder !== undefined && this.getVal().length === 0 && this.search.hasClass("select2-focused") === false) { this.search.val(placeholder).addClass("select2-default"); this.search.width(this.getMaxSearchWidth()); } else { this.search.val("").width(10); } }, clearPlaceholder: function () { if (this.search.hasClass("select2-default")) { this.search.val("").removeClass("select2-default"); } }, opening: function () { this.clearPlaceholder(); this.resizeSearch(); this.parent.opening.apply(this, arguments); this.focusSearch(); this.opts.element.trigger($.Event("open")); }, close: function () { if (!this.opened()) return; this.parent.close.apply(this, arguments); }, focus: function () { this.close(); this.search.focus(); }, isFocused: function () { return this.search.hasClass("select2-focused"); }, updateSelection: function (data) { var ids = [], filtered = [], self = this; $(data).each(function () { if (indexOf(self.id(this), ids) < 0) { ids.push(self.id(this)); filtered.push(this); } }); data = filtered; this.selection.find(".select2-search-choice").remove(); $(data).each(function () { self.addSelectedChoice(this); }); self.postprocessResults(); }, tokenize: function () { var input = this.search.val(); input = this.opts.tokenizer(input, this.data(), this.bind(this.onSelect), this.opts); if (input != null && input != undefined) { this.search.val(input); if (input.length > 0) { this.open(); } } }, onSelect: function (data, options) {
            this.addSelectedChoice(data); this.opts.element.trigger({ type: "selected", val: this.id(data), choice: data }); if (this.select || !this.opts.closeOnSelect) this.postprocessResults(); if (this.opts.closeOnSelect) { this.close(); this.search.width(10); } else {
                if (this.countSelectableResults() > 0) {
                    this.search.width(10); this.resizeSearch(); if (this.getMaximumSelectionSize() > 0 && this.val().length >= this.getMaximumSelectionSize()) { this.updateResults(true); }
                    this.positionDropdown();
                } else { this.close(); this.search.width(10); }
            }
            this.triggerChange({ added: data }); if (!options || !options.noFocus)
                this.focusSearch();
        }, cancel: function () { this.close(); this.focusSearch(); }, addSelectedChoice: function (data) {
            var enableChoice = !data.locked, enabledItem = $("<li class='select2-search-choice'>" + "    <div></div>" + "    <a href='#' onclick='return false;' class='select2-search-choice-close' tabindex='-1'></a>" + "</li>"), disabledItem = $("<li class='select2-search-choice select2-locked'>" + "<div></div>" + "</li>"); var choice = enableChoice ? enabledItem : disabledItem, id = this.id(data), val = this.getVal(), formatted; formatted = this.opts.formatSelection(data, choice.find("div")); if (formatted != undefined) { choice.find("div").replaceWith("<div>" + this.opts.escapeMarkup(formatted) + "</div>"); }
            if (enableChoice) { choice.find(".select2-search-choice-close").bind("mousedown", killEvent).bind("click dblclick", this.bind(function (e) { if (!this.enabled) return; $(e.target).closest(".select2-search-choice").fadeOut('fast', this.bind(function () { this.unselect($(e.target)); this.selection.find(".select2-search-choice-focus").removeClass("select2-search-choice-focus"); this.close(); this.focusSearch(); })).dequeue(); killEvent(e); })).bind("focus", this.bind(function () { if (!this.enabled) return; this.container.addClass("select2-container-active"); this.dropdown.addClass("select2-drop-active"); })); }
            choice.data("select2-data", data); choice.insertBefore(this.searchContainer); val.push(id); this.setVal(val);
        }, unselect: function (selected) {
            var val = this.getVal(), data, index; selected = selected.closest(".select2-search-choice"); if (selected.length === 0) { throw "Invalid argument: " + selected + ". Must be .select2-search-choice"; }
            data = selected.data("select2-data"); if (!data) { return; }
            index = indexOf(this.id(data), val); if (index >= 0) { val.splice(index, 1); this.setVal(val); if (this.select) this.postprocessResults(); }
            selected.remove(); this.opts.element.trigger({ type: "removed", val: this.id(data), choice: data }); this.triggerChange({ removed: data });
        }, postprocessResults: function () { var val = this.getVal(), choices = this.results.find(".select2-result"), compound = this.results.find(".select2-result-with-children"), self = this; choices.each2(function (i, choice) { var id = self.id(choice.data("select2-data")); if (indexOf(id, val) >= 0) { choice.addClass("select2-selected"); choice.find(".select2-result-selectable").addClass("select2-selected"); } }); compound.each2(function (i, choice) { if (!choice.is('.select2-result-selectable') && choice.find(".select2-result-selectable:not(.select2-selected)").length === 0) { choice.addClass("select2-selected"); } }); if (this.highlight() == -1) { self.highlight(0); } }, getMaxSearchWidth: function () { return this.selection.width() - getSideBorderPadding(this.search); }, resizeSearch: function () {
            var minimumWidth, left, maxWidth, containerLeft, searchWidth, sideBorderPadding = getSideBorderPadding(this.search); minimumWidth = measureTextWidth(this.search) + 10; left = this.search.offset().left; maxWidth = this.selection.width(); containerLeft = this.selection.offset().left; searchWidth = maxWidth - (left - containerLeft) - sideBorderPadding; if (searchWidth < minimumWidth) { searchWidth = maxWidth - sideBorderPadding; }
            if (searchWidth < 40) { searchWidth = maxWidth - sideBorderPadding; }
            if (searchWidth <= 0) { searchWidth = minimumWidth; }
            this.search.width(searchWidth);
        }, getVal: function () { var val; if (this.select) { val = this.select.val(); return val === null ? [] : val; } else { val = this.opts.element.val(); return splitVal(val, this.opts.separator); } }, setVal: function (val) { var unique; if (this.select) { this.select.val(val); } else { unique = []; $(val).each(function () { if (indexOf(this, unique) < 0) unique.push(this); }); this.opts.element.val(unique.length === 0 ? "" : unique.join(this.opts.separator)); } }, val: function () {
            var val, triggerChange = false, data = [], self = this; if (arguments.length === 0) { return this.getVal(); }
            val = arguments[0]; if (arguments.length > 1) { triggerChange = arguments[1]; }
            if (!val && val !== 0) {
                this.opts.element.val(""); this.updateSelection([]); this.clearSearch(); if (triggerChange) { this.triggerChange(); }
                return;
            }
            this.setVal(val); if (this.select) { this.opts.initSelection(this.select, this.bind(this.updateSelection)); if (triggerChange) { this.triggerChange(); } } else {
                if (this.opts.initSelection === undefined) { throw new Error("val() cannot be called if initSelection() is not defined"); }
                this.opts.initSelection(this.opts.element, function (data) { var ids = $(data).map(self.id); self.setVal(ids); self.updateSelection(data); self.clearSearch(); if (triggerChange) { self.triggerChange(); } });
            }
            this.clearSearch();
        }, onSortStart: function () {
            if (this.select) { throw new Error("Sorting of elements is not supported when attached to <select>. Attach to <input type='hidden'/> instead."); }
            this.search.width(0); this.searchContainer.hide();
        }, onSortEnd: function () { var val = [], self = this; this.searchContainer.show(); this.searchContainer.appendTo(this.searchContainer.parent()); this.resizeSearch(); this.selection.find(".select2-search-choice").each(function () { val.push(self.opts.id($(this).data("select2-data"))); }); this.setVal(val); this.triggerChange(); }, data: function (values) {
            var self = this, ids; if (arguments.length === 0) { return this.selection.find(".select2-search-choice").map(function () { return $(this).data("select2-data"); }).get(); } else {
                if (!values) { values = []; }
                ids = $.map(values, function (e) { return self.opts.id(e); }); this.setVal(ids); this.updateSelection(values); this.clearSearch();
            }
        }
    }); $.fn.select2 = function () {
        var args = Array.prototype.slice.call(arguments, 0), opts, select2, value, multiple, allowedMethods = ["val", "destroy", "opened", "open", "close", "focus", "isFocused", "container", "onSortStart", "onSortEnd", "enable", "disable", "positionDropdown", "data"]; this.each(function () {
            if (args.length === 0 || typeof (args[0]) === "object") {
                opts = args.length === 0 ? {} : $.extend({}, args[0]); opts.element = $(this); if (opts.element.get(0).tagName.toLowerCase() === "select") { multiple = opts.element.attr("multiple"); } else { multiple = opts.multiple || false; if ("tags" in opts) { opts.multiple = multiple = true; } }
                select2 = multiple ? new MultiSelect2() : new SingleSelect2(); select2.init(opts);
            } else if (typeof (args[0]) === "string") {
                if (indexOf(args[0], allowedMethods) < 0) { throw "Unknown method: " + args[0]; }
                value = undefined; select2 = $(this).data("select2"); if (select2 === undefined) return; if (args[0] === "container") { value = select2.container; } else { value = select2[args[0]].apply(select2, args.slice(1)); }
                if (value !== undefined) { return false; }
            } else { throw "Invalid arguments to select2 plugin: " + args; }
        }); return (value === undefined) ? this : value;
    }; $.fn.select2.defaults = { width: "copy", loadMorePadding: 0, closeOnSelect: true, openOnEnter: true, containerCss: {}, dropdownCss: {}, containerCssClass: "", dropdownCssClass: "", formatResult: function (result, container, query, escapeMarkup) { var markup = []; markMatch(result.text, query.term, markup, escapeMarkup); return markup.join(""); }, formatSelection: function (data, container) { return data ? data.text : undefined; }, sortResults: function (results, container, query) { return results; }, formatResultCssClass: function (data) { return undefined; }, formatNoMatches: function () { return "No matches found"; }, formatInputTooShort: function (input, min) { var n = min - input.length; return "Please enter " + n + " more character" + (n == 1 ? "" : "s"); }, formatInputTooLong: function (input, max) { var n = input.length - max; return "Please delete " + n + " character" + (n == 1 ? "" : "s"); }, formatSelectionTooBig: function (limit) { return "You can only select " + limit + " item" + (limit == 1 ? "" : "s"); }, formatLoadMore: function (pageNumber) { return "Loading more results..."; }, formatSearching: function () { return "Searching..."; }, minimumResultsForSearch: 0, minimumInputLength: 0, maximumInputLength: null, maximumSelectionSize: 0, id: function (e) { return e.id; }, matcher: function (term, text) { return ('' + text).toUpperCase().indexOf(('' + term).toUpperCase()) >= 0; }, separator: ",", tokenSeparators: [], tokenizer: defaultTokenizer, escapeMarkup: function (markup) { var replace_map = { '\\': '&#92;', '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&apos;', "/": '&#47;' }; return String(markup).replace(/[&<>"'\/\\]/g, function (match) { return replace_map[match[0]]; }); }, blurOnChange: false, selectOnBlur: false, adaptContainerCssClass: function (c) { return c; }, adaptDropdownCssClass: function (c) { return null; } }; window.Select2 = { query: { ajax: ajax, local: local, tags: tags }, util: { debounce: debounce, markMatch: markMatch }, "class": { "abstract": AbstractSelect2, "single": SingleSelect2, "multi": MultiSelect2 } };
}(jQuery));

(function ($) {
    '$:nomunge'; var interval_id, last_hash, cache_bust = 1, rm_callback, window = this, FALSE = !1, postMessage = 'postMessage', addEventListener = 'addEventListener', p_receiveMessage, has_postMessage = window[postMessage] && !$.browser.opera; $[postMessage] = function (message, target_url, target) {
        if (!target_url) { return; }
        message = typeof message === 'string' ? message : $.param(message); target = target || parent; if (has_postMessage) { target[postMessage](message, target_url.replace(/([^:]+:\/\/[^\/]+).*/, '$1')); } else if (target_url) { target.location = target_url.replace(/#.*$/, '') + '#' + (+new Date) + (cache_bust++) + '&' + message; }
    }; $.receiveMessage = p_receiveMessage = function (callback, source_origin, delay) {
        if (has_postMessage) {
            if (callback) {
                rm_callback && p_receiveMessage(); rm_callback = function (e) {
                    if ((typeof source_origin === 'string' && e.origin !== source_origin) || ($.isFunction(source_origin) && source_origin(e.origin) === FALSE)) { return FALSE; }
                    callback(e);
                };
            }
            if (window[addEventListener]) { window[callback ? addEventListener : 'removeEventListener']('message', rm_callback, FALSE); } else { window[callback ? 'attachEvent' : 'detachEvent']('onmessage', rm_callback); }
        } else { interval_id && clearInterval(interval_id); interval_id = null; if (callback) { delay = typeof source_origin === 'number' ? source_origin : typeof delay === 'number' ? delay : 100; interval_id = setInterval(function () { var hash = document.location.hash, re = /^#?\d+&/; if (hash !== last_hash && re.test(hash)) { last_hash = hash; callback({ data: hash.replace(re, '') }); } }, delay); } }
    };
})(jQuery);

var hasLocalStorage; try { localStorage.setItem("browserSupportsLocalStorage", "true"); localStorage.removeItem("browserSupportsLocalStorage"); sessionStorage.setItem("browserSupportsLocalStorage", "true"); sessionStorage.removeItem("browserSupportsLocalStorage"); hasLocalStorage = true; } catch (e) { hasLocalStorage = false; }
$8(document).ready(function ($) {
    if (typeof $8('#userInfo').attr('data-cobrandedname') !== 'undefined' && $8('#userInfo').attr('data-cobrandedname') != '') { delete $8.tp.SolrNameMap.Advisor.sort.LeadGenDesc; $8.tp.SolrNameMap.Advisor.sort.AdvisorNameAsc.Default = true; }
    if ($('#CMSHeaderDiv').length > 0 && $.trim($('#CMSHeaderDiv').text()) != "") { $("#bgLayer").css("top", "132px"); $("#navLayer").css("top", "132px"); }
    $.tp.debug = true; if (hasLocalStorage) {
        var $isIe8 = checkIeVersion(); var showIe8Warning = sessionStorage.getItem('showIe8Warning'); if (showIe8Warning == null)
            showIe8Warning = true; if ($isIe8 == true && showIe8Warning == true) { sessionStorage.setItem('showIe8Warning', false); var $msg = "Internet Explorer 8 and below are not supported. Please upgrade your browser."; $("<div>" + $msg + "</div>").dialog({ title: "Warning", resizable: false, height: 150, modal: true, autoOpen: true, buttons: { "OK": function () { $(this).dialog("destroy").remove(); } }, close: function () { $(this).dialog("destroy").remove(); } }); }
    }
    var qs = $.parseQuerystring(); var $entry = $("#searchBoxMainEntry"); if (qs.search || typeof qs.search != "undefined") { $entry.val(decodeURIComponent(qs.search)); $("#searchBoxWrapper #closeBox").makeVisible(); } else { }
    $(document).tooltip({ items: ".tooltip" }); drawCountriesSelect($('select#ddlCountries')); $.tp.data = {}; $.tp.service = "/TouchPoints/Services/UrlService.svc/GetWorkspaceUri"; $('style').remove(); $('.listContainer > div > br').remove(); var isLoggedIn = $("#userInfo").attr("data-loggedin"); var isComposerUser = $("#userInfo").attr("data-iscomposeruser"); if ($("#travelFolioDisplay:visible").length && isLoggedIn == "True" && isComposerUser == "True") { $.ajax({ type: "POST", url: $.tp.service, data: $.stringify($.tp.data), contentType: "application/json; charset=utf-8", dataType: "text json", processdata: true, success: function (data) { var uri = JSON.parse(data.GetWorkspaceUriResult); $("#travelFolioDisplay").find(".headerLink").attr("href", uri); } }); }
    $('a.popupLink').live('click', function () {
        var $this = $(this); var hyperlinkId = $this.attr("id"); var $panel = $("#popupPanel_" + hyperlinkId); if ($panel.length == 0) { $panel = $('<div class="itineraryPopupPanel" id="popupPanel_' + hyperlinkId + '"></div>'); $panel.appendTo("body"); }
        $panel.tpdialog({ openerId: hyperlinkId, contentUrl: $this.attr("href").length > 1 ? $this.attr("href") : "", title: $this.attr("title"), width: $panel.attr("width") || $this.attr("data-dialog-width") || "820", height: $panel.attr("height") || $this.attr("data-dialog-height") || "525", closeText: "Close", autoOpen: true, dialogOpenCallback: function () { $panel.addClass("popupInitialized"); var noButtonPane = $this.attr("data-dialog-noButtonPane"); if (noButtonPane != undefined && noButtonPane == "1") { $(".ui-dialog-buttonpane").hide(); } }, dialogCloseHandler: function () { $panel.empty(); $panel.tpdialog("close"); } }); return false;
    }); var currentCobrandedSiteName = $8.tp.sessionCobrandedSiteName(); var cobrandedSiteName = $("#userInfo").attr("data-cobrandedname"); if (currentCobrandedSiteName != cobrandedSiteName && $.tp.searchRequestManager != null) { $.tp.searchRequestManager.clearCacheOfAllSearchObjs(); }
    var isAlliancePartner = $("#userInfo").attr("data-isalliancepartner"); $.tp.sessionCobrandedSiteName(cobrandedSiteName); if (cobrandedSiteName != null && cobrandedSiteName != "" || isAlliancePartner) { $('#headerAreaOne').show(); } else { $('#headerAreaOne').hide(); }
    addClickTaleHooks();
}); $8.tp = {}; $8.tp.TemplatesPath = "/TouchPoints/Sites/VCom/PageTemplates/VComProductCatalogTemplate/Templates/"; $8.tp.DefaultProduct = "Cruise"; $8.tp.SolrNameMap = { "Air": { "title": "Air", "breadcrumb": "Air", "sort": { "AirCompanyNameAsc": { "Label": "Company Name A-Z", "Default": true }, "AirCompanyNameDesc": { "Label": "Company Name Z-A", "Default": false }, "AirRecommendationsDesc": { "Label": "Percent Recommended", "Default": false } } }, "Contact": { "title": "Contact", "breadcrumb": "Contact", "sort": { "ContactNameAsc": { "Label": "Contact Name A-Z", "Default": true }, "ContactNameDesc": { "Label": "Contact Name Z-A", "Default": false } } }, "Cruise": { "title": "Cruise", "breadcrumb": "Cruises", "sort": { "CruiseCompanyAsc": { "Label": "Company Name A-Z", "Default": false }, "CruiseCompanyDesc": { "Label": "Company Name Z-A", "Default": false }, "CruiseNameAsc": { "Label": "Cruise Name A-Z", "Default": false }, "CruiseNameDesc": { "Label": "Cruise Name Z-A", "Default": false }, "CruiseTravelDateAsc": { "Label": "Travel Date Ascending", "Default": true }, "CruiseTravelDateDesc": { "Label": "Travel Date Descending", "Default": false }, "CruiseLengthAsc": { "Label": "Length Ascending", "Default": false }, "CruiseLengthDesc": { "Label": "Length Descending", "Default": false }, "CruiseShipAsc": { "Label": "Ship A-Z", "Default": false }, "CruiseShipDesc": { "Label": "Ship Z-A", "Default": false }, "CruiseRecommendationsDesc": { "Label": "Percent Recommended", "Default": false } } }, "News": { "title": "News", "breadcrumb": "News", "sort": { "NewsPublishDateDesc": { "Label": "Most Recent", "Default": true } } }, "Package": { "title": "Package", "breadcrumb": "Packages", "sort": { "PackageCompanyNameAsc": { "Label": "Company Name A-Z", "Default": false }, "PackageCompanyNameDesc": { "Label": "Company Name Z-A", "Default": false }, "PackageLengthAsc": { "Label": "Length Ascending", "Default": false }, "PackageLengthDesc": { "Label": "Length Descending", "Default": false }, "PackageNameAsc": { "Label": "Package Name A-Z", "Default": false }, "PackageNameDesc": { "Label": "Package Name Z-A", "Default": false }, "PackageTravelDateAsc": { "Label": "Travel Date Ascending", "Default": true }, "PackageTravelDateDesc": { "Label": "Travel Date Descending", "Default": false }, "PackageRecommendationsDesc": { "Label": "Percent Recommended", "Default": false } } }, "Promotion": { "title": "Promotion", "breadcrumb": "Promotions", "sort": { "PromotionCompanyNameAsc": { "Label": "Company Name A-Z", "Default": false }, "PromotionCompanyNameDesc": { "Label": "Company Name Z-A", "Default": false }, "PromotionNameAsc": { "Label": "Promotion Name A-Z", "Default": false }, "PromotionNameDesc": { "Label": "Promotion Name Z-A", "Default": false }, "PromotionTravelDateAsc": { "Label": "Travel Date Ascending", "Default": true }, "PromotionTravelDateDesc": { "Label": "Travel Date Descending", "Default": false }, "PromotionRecommendationsDesc": { "Label": "Percent Recommended", "Default": false } } }, "Property": { "title": "Hotel", "breadcrumb": "Hotels", "sort": { "HotelNameAsc": { "Label": "Hotel Name A-Z", "Default": true }, "HotelNameDesc": { "Label": "Hotel Name Z-A", "Default": false } } }, "Service": { "title": "Service", "breadcrumb": "Services", "sort": { "ServiceCompanyNameAsc": { "Label": "Company Name A-Z", "Default": false }, "ServiceCompanyNameDesc": { "Label": "Company Name Z-A", "Default": false }, "ServiceNameAsc": { "Label": "Service Name A-Z", "Default": false }, "ServiceNameDesc": { "Label": "Service Name Z-A", "Default": false }, "ServiceTravelDateAsc": { "Label": "Travel Date Ascending", "Default": true }, "ServiceTravelDateDesc": { "Label": "Travel Date Descending", "Default": false }, "ServiceRecommendationsDesc": { "Label": "Percent Recommended", "Default": false } } }, "Tour": { "title": "Tour", "breadcrumb": "Tours", "sort": { "TourCompanyNameAsc": { "Label": "Company Name A-Z", "Default": false }, "TourCompanyNameDesc": { "Label": "Company Name Z-A", "Default": false }, "TourLengthAsc": { "Label": "Length Ascending", "default": false }, "TourLengthDesc": { "Label": "Length Descending", "default": false }, "TourNameAsc": { "Label": "Tour Name A-Z", "Default": false }, "TourNameDesc": { "Label": "Tour Name Z-A", "Default": false }, "TourTravelDateAsc": { "Label": "Travel Date Ascending", "Default": true }, "TourTravelDateDesc": { "Label": "Travel Date Descending", "Default": false }, "TourRecommendationsDesc": { "Label": "Percent Recommended", "Default": false } } }, "Gts": { "sort": { "GtsRelevance": { "Label": "Relevance", "Default": true } } }, "Advisor": { "title": "Advisor", "sort": { "LeadGenDesc": { "Label": "Available to Contact", "Default": true }, "AdvisorNameAsc": { "Label": "Advisor Name A-Z", "Default": false }, "AdvisorNameDesc": { "Label": "Advisor Name Z-A", "Default": false }, "AdvisorReviewsDesc": { "Label": "Number of Reviews", "Default": false }, "AdvisorRecommendationsDesc": { "Label": "Percent Recommended", "Default": false } } }, "Agency": { "title": "Agency", "sort": { "AgencyProximity": { "Label": "Closest to My Location", "Default": true }, "AgencyNameAsc": { "Label": "Company Name A-Z", "Default": false }, "AgencyNameDesc": { "Label": "Company Name Z-A", "Default": false } } }, "Supplier": { "title": "Supplier", "sort": { "SupplierNameAsc": { "Label": "Company Name A-Z", "Default": true }, "SupplierNameDesc": { "Label": "Company Name Z-A", "Default": false }, "SupplierReviewsDesc": { "Label": "Number of Reviews", "Default": false }, "SupplierRecommendationsDesc": { "Label": "Percent Recommended", "Default": false } } }, "ProductList": { "title": "Product", "sort": { "GtsRelevance": { "Label": "Relevance", "Default": true } } }, "Article": { "title": "Article", "sort": { "GtsRelevance": { "Label": "Relevance", "Default": true } } } }; $8.tp.getProductSortArray = function (searchObj) {
    var tempArray = []; $8.each($8.tp.SolrNameMap[searchObj.SearchType].sort, function (k, v) {
        var tempObj = {}; tempObj.value = k; tempObj.label = v.Label; if (searchObj.SortType == k) { tempObj.default = true; } else { tempObj.default = false; }
        tempArray.push(tempObj);
    }); return tempArray;
}; var tps = {}; $8.tp.subscriptions = function (id) {
    var callbacks, tp = id && tps[id]; if (!tp) { callbacks = $8.Callbacks(); tp = { publish: callbacks.fire, subscribe: callbacks.add, unsubcribe: callbacks.remove }; if (id) { tps[id] = tp; } }
    return tp;
}; var SessionComparisonCacheKey = "comparisoncache"; var SessionCountsMenuKey = "countsmenu"; var SessionPageContentKey = "pagecontent"; var SessionZeroCountFacetsKey = "zerocountfacets"; $8.tp.sessionObject = function (key, data) {
    if (hasLocalStorage) {
        if (typeof (sessionStorage) !== 'undefined') { if (typeof (data) !== 'undefined') { var json = JSON.stringify(data); sessionStorage.setItem(key, json); } else { var json2 = sessionStorage.getItem(key); var data2 = JSON.parse(json2); return data2; } }
        return null;
    }
}; $8.tp.sessionHtml = function (key, data) {
    if (hasLocalStorage) {
        if (typeof (sessionStorage) !== 'undefined') { if (typeof (data) !== 'undefined') { sessionStorage.setItem(key, data); } else { var json = sessionStorage.getItem(key); return json; } }
        return null;
    }
}; $8.tp.sessionComparisonCache = function (data) { return $8.tp.sessionObject(SessionComparisonCacheKey, data); }; $8.tp.sessionCountsMenu = function (data) { return null; }; $8.tp.sessionProductsPageContent = function (data) { return null; }; $8.tp.sessionZeroCountFacetsForCategory = function (category, data) { return $8.tp.sessionObject(SessionZeroCountFacetsKey + "_" + category, data); }; $8.tp.cleanupCachedPageContent = function () { if (typeof (sessionStorage) !== 'undefined') { sessionStorage.removeItem(SessionPageContentKey); } }; $8.tp.isProductsPage = function () { return /\/(cruises|tours|hotels|packages|promotions|services|air)/.test(location.pathname); }; $8.tp.getDefaultSort = function (productType) { var sortType = ""; $8.each($8.tp.SolrNameMap[productType].sort, function (k, v) { if (v["Default"]) { sortType = k; return false; } }); return sortType; }; function highlightActiveMenuItem(searchObj) { var currentType = searchObj.SearchType || $8.tp.DefaultProduct; $8(".menuItem").removeClass("active"); $8("#menuItem_" + currentType).addClass("active"); }
function esc_quot(str) { return (str + '').replace(/[\\"]/g, '\\$&').replace(/\u0000/g, '\\0'); }
function getInternetExplorerVersion() {
    var rv = -1; if (navigator.appName == 'Microsoft Internet Explorer') {
        var ua = navigator.userAgent; var re = new RegExp("MSIE ([0-9]{1,}[\.0-9]{0,})"); if (re.exec(ua) != null)
            rv = parseFloat(RegExp.$1);
    }
    return rv;
}
function checkIeVersion() {
    var ie8 = false; var ver = getInternetExplorerVersion(); if (ver > -1) {
        if (ver > 8.0)
            ie8 = false; else
            ie8 = true;
    }
    return ie8;
}
function log(obj) { if (typeof console !== "undefined" && console && console.log) { if ($8.tp.debug) console.log(obj); } }
function formatSelection(state) { var $flag = $8("#visibleFlag"); $flag.attr("src", "/TouchPoints/Sites/VCom/UserControls/CountryFlag/Images/CountryFlags/16/" + state.id.toLowerCase() + ".png"); return state.text; }
function drawCountriesSelect(select) {
    if (hasLocalStorage) {
        if (select.length > 0) {
            select.tpcountries({
                getCountries: function (e, element) {
                    var countryCode = (localStorage && localStorage.hasOwnProperty('countryCode')) ? localStorage.countryCode : ''; var data = { 'defaultCountryCode': countryCode }; $8.ajax({
                        cache: false, url: '/location/ajax/GetCountries/' + $8('#userInfo').attr('data-meid') + '.aspx', type: 'GET', datatype: 'json', data: data, success: function (data) {
                            var countries = data.countryList; var length = countries.length; var segment = $8('<segment></segment>'); var country; for (var index = 0; index < length; ++index) { country = countries[index]; if (data.isDisableDropDown == false || (data.isDisableDropDown == true && country.CountryCodeISO2 == data.selectedCode)) { segment.append($8('<option data-region="' + country.BusinessRegionID + '" value="' + country.CountryCodeISO2 + '">' + country.CountryName + '</option>')); if (data.isDisableDropDown == true) { break; } } }
                            select.attr("data-disabled", data.isDisableDropDown); select.empty().html(segment.html()); select.val(data.selectedCode); if (data.isDisableDropDown == true) { select.attr('disabled', 'disabled'); }
                            select.select2({ width: "resolve", formatSelection: formatSelection, closeOnSelect: true, disabled: data.isDisableDropDown }); $8("#countriesContainer").show(); if (select.is(":disabled")) { $8("#countriesContainer").find(".down-arrow").stop(true, true).hide(); }
                        }
                    });
                }, SelectedCountry: function (e, element) {
                    var region = $8('option:selected', element).attr('data-region'); var countryCode = $8('option:selected', element).val(); $8.ajax({
                        url: '/location/ajax/SetRegion', type: 'POST', datatype: 'json', data: { 'regionId': region, 'countryCode': countryCode }, success: function (data) {
                            if (data.success == true && data.saveInCache == true && localStorage) { localStorage.countryCode = data.code; if (typeof $8.tp.searchObj != 'undefined') { $8.tp.searchObj.CurrentPage = 1; $8.tp.searchObj.StartRow = 0; $8.tp.searchObj.SelectedFacets = []; $8.tp.searchRequestManager.saveState($8.tp.searchObj); } }
                            location.reload(true);
                        }, error: function (xhr, error, status) { }
                    });
                }
            });
        }
    }
}
Array.prototype.unique = function () {
    var a = this.concat(); for (var i = 0; i < a.length; ++i) {
        for (var j = i + 1; j < a.length; ++j) {
            if (a[i] === a[j])
                a.splice(j, 1);
        }
    }
    return a;
}; $8.tp.stopWatch = function () {
    var startTime = null; var stopTime = null; var running = false; var
    start = function () {
        if (running == true)
            return; else if (startTime != null)
                stopTime = null; running = true; startTime = getTime();
    }, stop = function () {
        if (running == false)
            return; stopTime = getTime(); running = false;
    }, duration = function () {
        if (startTime == null || stopTime == null)
            return 'Undefined'; else
            return (stopTime - startTime) / 1000;
    }, isRunning = function () { return running; }, logDuration = function () { log(duration()); }, getTime = function () { var day = new Date(); return day.getTime(); }; return { start: start, stop: stop, duration: duration, logDuration: logDuration };
}; var SessionCobrandedSiteNameKey = "cobrandedSiteName"; $8.tp.sessionCobrandedSiteName = function (data) { return $8.tp.sessionObject(SessionCobrandedSiteNameKey, data); }; function adjustCobrandedPageUri(originalUrl) {
    if (new RegExp("/member/").test(originalUrl) || new RegExp("/partner/").test(originalUrl) || new RegExp("/advisor/").test(originalUrl) || new RegExp("/campaign/").test(originalUrl)) { return originalUrl; }
    var newUrl = originalUrl; var isAgencyPartner = $8('#userInfo').attr('data-isagencypartner'); var isAlliancePartner = $8('#userInfo').attr('data-isalliancepartner'); var isMarketingProgram = $8('#userInfo').attr('data-ismarketingprogram'); var isAdvisorPartner = $8('#userInfo').attr('data-isadvisorpartner'); var slug = "/"; if (isAgencyPartner == "True") { slug = "/member/"; }
    if (isAlliancePartner == "True") { slug = "/partner/"; }
    if (isMarketingProgram == "True") { slug = "/campaign/"; }
    if (isMarketingProgram == "True") { slug = "/campaign/"; }
    if (isAdvisorPartner == "True") { slug = "/advisor/"; }
    if (originalUrl && originalUrl != "" && originalUrl.charAt(0) == "~") { newUrl = originalUrl.slice(1, originalUrl.length); }
    var cobrandedSiteName = $8('#userInfo').attr('data-cobrandedname'); if (cobrandedSiteName) { newUrl = slug + cobrandedSiteName + newUrl; }
    if (newUrl.slice(-1) == "/" && newUrl.length > 1) { newUrl = newUrl.substring(0, newUrl.length - 1); }
    return newUrl;
}
$8.fn.ucwords = function () {
    return this.each(function () {
        var val = $8(this).text(), newVal = ''; val = val.split(' '); for (var c = 0; c < val.length; c++) { newVal += val[c].substring(0, 1).toUpperCase() + val[c].substring(1, val[c].length) + (c + 1 == val.length ? '' : ' '); }
        $8(this).text(newVal);
    });
}; String.prototype.ucwords = function () { return this.toLowerCase().replace(/\b[a-z]/g, function (letter) { return letter.toUpperCase(); }); }; function createPagedUrl(inputUrl, param, value) {
    var val = new RegExp('(\\?|\\&)' + param + '=.*?(?=(&|$))'); var parts = inputUrl.toString().split('#'); var urlNoHash = parts[0]; var hash = parts[1]; var qstring = /\?.+$/; var newURL = urlNoHash; if (val.test(urlNoHash)) { newURL = urlNoHash.replace(val, '$1' + param + '=' + value); }
    else if (qstring.test(urlNoHash)) { newURL = urlNoHash + '&' + param + '=' + value; }
    else { newURL = urlNoHash + '?' + param + '=' + value; }
    if (hash) { newURL += '#' + hash; }
    return newURL;
}
$8.fn.fadeInFadeOut = function (speed, delay) { return $8(this).fadeIn(speed, function () { return $8(this).delay(delay).fadeOut(speed); }); }; function addClickTaleHooks() { if (typeof ClickTaleContext == 'object') { ClickTaleContext.getAggregationContextAsync("1", function (c) { var r = c.ReportType; if (r == 'MouseMoveHeatmap' || r == 'MouseClickHeatmap' || r == 'AttentionHeatmap' || r == 'ScrollReachHeatmap' || r == 'FormAnalytics') { var style = document.createElement('style'); style.innerHTML = 'html, body { height: 800px !important; }'; document.body.appendChild(style); } }); } }
$8.fn.makeInvisible = function () { this.css({ "visibility": "hidden" }); }; $8.fn.makeVisible = function () { this.css({ "visibility": "visible" }); }; function ClickTaleTest(cmd) { eval(cmd); }
String.prototype.removeElements = function (selector) { var text = this; if (!selector) { var rex = /(<([^>]+)>)/ig; return text.replace(rex, ""); } else { var wrapped = $8("<div>" + text + "</div>"); wrapped.find(selector).remove(); return wrapped.html(); } };

(function ($) {
    $.tp.searchRequestManager = $.tp.searchRequestManager || {
        SESSION_KEY: "SearchObj", _ignoreNextHashChange: false, _isFirstTimeCalled: true, searchSections: { "GTS": { sectionToken: "GTS", sectionUriPartRegex: /\/global/, getDefaultSearchObject: function () { return { CurrentPage: 1, FacetCategoryIndex: 0, FacetCategoryTitle: "", FacetLimit: 1000, LeftToShow: 0, ProductIds: [], RowsPerPage: 50, SearchMode: "Gts", SearchTerms: "", SearchType: "Gts", SearchView: "1col", SelectedFacets: [], SortType: $.tp.getDefaultSort("Gts"), StartRow: 0 }; } }, "NEWS": { sectionToken: "NEWS", sectionUriPartRegex: /\/news/, getDefaultSearchObject: function () { return { CurrentPage: 1, FacetCategoryIndex: 0, FacetCategoryTitle: "", FacetLimit: 1000, LeftToShow: 0, ProductIds: [], RowsPerPage: 50, SearchMode: "", SearchTerms: "", SearchType: "News", SearchView: "1col", SelectedFacets: [], SortType: $.tp.getDefaultSort("News"), StartRow: 0 }; } }, "ADVISORS": { sectionToken: "ADVISORS", sectionUriPartRegex: /\/(advisors)/, getDefaultSearchObject: function () { return { CurrentPage: 1, FacetCategoryIndex: 0, FacetCategoryTitle: "", FacetLimit: 7, LeftToShow: 0, ProductIds: [], RowsPerPage: 25, SearchMode: "Advisor", SearchTerms: "", SearchType: "Advisor", SearchView: "1col", SelectedFacets: [], SortType: $.tp.getDefaultSort("Advisor"), StartRow: 0 }; } }, "CONTACTS": { sectionToken: "CONTACTS", sectionUriPartRegex: /\/(contacts)/, getDefaultSearchObject: function () { return { CurrentPage: 1, FacetCategoryIndex: 0, FacetCategoryTitle: "", FacetLimit: 7, LeftToShow: 0, ProductIds: [], RowsPerPage: 25, SearchMode: "Contact", SearchTerms: "", SearchType: "Contact", SearchView: "1col", SelectedFacets: [], SortType: $.tp.getDefaultSort("Contact"), StartRow: 0 }; } }, "AGENCIES": { sectionToken: "AGENCIES", sectionUriPartRegex: /\/(agencies)/, getDefaultSearchObject: function () { return { CurrentPage: 1, FacetCategoryIndex: 0, FacetCategoryTitle: "", FacetLimit: 7, LeftToShow: 0, ProductIds: [], RowsPerPage: 25, SearchMode: "Agency", SearchTerms: "", SearchType: "Agency", SearchView: "1col", SelectedFacets: [], SortType: $.tp.getDefaultSort("Agency"), StartRow: 0 }; } }, "SUPPLIER": { sectionToken: "SUPPLIER", sectionUriPartRegex: /\/suppliers/, getDefaultSearchObject: function () { return { CurrentPage: 1, FacetCategoryIndex: 0, FacetCategoryTitle: "", FacetLimit: 11, LeftToShow: 0, ProductIds: [], RowsPerPage: 25, SearchMode: "Supplier", SearchTerms: "", SearchType: "Supplier", SearchView: "1col", SelectedFacets: [], SortType: $.tp.getDefaultSort("Supplier"), StartRow: 0 }; } }, "PRODUCTS": { sectionToken: "PRODUCTS", sectionUriPartRegex: /\/(cruises|tours|hotels|packages|promotions|services|air)/, getDefaultSearchObject: function () { return { CurrentPage: 1, FacetCategoryIndex: 0, FacetCategoryTitle: "", FacetLimit: 7, LeftToShow: 0, ProductIds: [], RowsPerPage: 25, SearchMode: "", SearchTerms: "", SearchType: "Cruise", SearchView: "1col", SelectedFacets: [], SortType: $.tp.getDefaultSort("Cruise"), StartRow: 0 }; } }, "PRODUCTLIST": { sectionToken: "PRODUCTLIST", sectionUriPartRegex: /\/suppliers\/[1-9]/, getDefaultSearchObject: function () { return { CurrentPage: 1, FacetCategoryIndex: 0, FacetCategoryTitle: "", FacetLimit: 7, LeftToShow: 0, ProductIds: [], SupplierId: "0", RowsPerPage: 10, SearchMode: "", SearchTerms: "", SearchType: "ProductList", SearchView: "1col", SelectedFacets: [], SortType: $.tp.getDefaultSort("ProductList"), StartRow: 0 }; } }, "ADVISOR_CHOOSER": { sectionToken: "ADVISOR_CHOOSER", sectionUriPartRegex: /findanadvisoriframetemplate\.aspx/, getDefaultSearchObject: function () { return { CurrentPage: 1, FacetCategoryIndex: 0, FacetCategoryTitle: "", FacetLimit: 7, LeftToShow: 0, ProductIds: [], RowsPerPage: 10, SearchMode: "AdvisorSelector", SearchTerms: "", SearchType: "Advisor", SearchView: "1col", SelectedFacets: [], SortType: $.tp.getDefaultSort("Advisor"), IsCobrandedSearch: "false", ParentCompanyHasBranches: "false", ParentCompanyId: 0, StartRow: 0 }; } } }, init: function () {
            var self = this; $.param.fragment.noEscape("[],"); $(window).bind('hashchange', function (event) {
                if (!self._ignoreNextHashChange) {
                    var searchObj = window.location.hash.length > 0 ? $.deparam.fragment(true) : self.buildSearchObject(); if ($.tp.searchObj.SearchMode == "AdvisorSelector" && $.tp.searchObj.SelectedFacets && $.tp.searchObj.SelectedFacets !== undefined) { searchObj.SelectedFacets = $.tp.searchObj.SelectedFacets; }
                    var defaultSearchObj = self.getSearchSection().getDefaultSearchObject(); $.tp.searchObj = self.adjustPageNumber($.extend({}, defaultSearchObj, searchObj, { SearchType: self.getProductTypeFromUri() })); log("In hashchange event handler.  Calling loadProductFacets."); ga('send', 'pageview', { 'page': location.pathname + location.search + location.hash, 'title': $.tp.searchObj.SearchType + ' Facet Selection' }); $.tp.subscriptions("refreshProductResults").publish({ obj: $.tp.searchObj, append: false }); $.tp.subscriptions("loadSortDropdown").publish({ obj: $.tp.searchObj }); $.tp.subscriptions("refreshInnerSearchBox").publish({ obj: $.tp.searchObj });
                } else { self._ignoreNextHashChange = false; }
            });
        }, getSearchSection: function () { var self = this; var currentPath = window.location.toString(); var section = null; $.each(self.searchSections, function (index, value) { if (value.sectionUriPartRegex.test(currentPath)) { section = this; return false; } }); return section; }, clearCacheOfAllSearchObjs: function () { if (hasLocalStorage) { var self = this; if (typeof (sessionStorage) !== 'undefined') { $.each(self.searchSections, function (index, value) { sessionStorage.removeItem(index + "_" + self.SESSION_KEY); }); } } }, buildSearchObject: function () {
            var self = this; var result = {}; var searchSectionObj = self.getSearchSection(); if (!searchSectionObj) { return null; }
            if (window.location.hash.length > 0) { log("Extracted following searchObj from QueryString:"); result = $.deparam.fragment(true) || {}; log(result); } else { if (hasLocalStorage && typeof (sessionStorage) !== 'undefined') { log("State not in querystring.  Fetched following searchObj from cache:"); var json2 = sessionStorage.getItem(searchSectionObj.sectionToken + "_" + self.SESSION_KEY); var data2 = JSON.parse(json2); result = data2 || {}; log(result); } }
            if (searchSectionObj.sectionToken == "GTS") { var objQueryString = $.deparam.querystring(); result.SearchMode = "Gts"; result.SearchTerms = objQueryString ? objQueryString.search : ""; }
            if (result.TravelProductStartDate)
                result.TravelProductStartDate = new Date(result.TravelProductStartDate); if (result.TravelProductEndDate)
                    result.TravelProductEndDate = new Date(result.TravelProductEndDate); var defaultSearchObj = searchSectionObj.getDefaultSearchObject(); return this.adjustPageNumber($.extend({}, defaultSearchObj, result, { SearchType: this.getProductTypeFromUri(), SearchView: "1col" }));
        }, getNewSearchObjectForProductType: function (productType) { return $.extend({}, $.tp.searchRequestManager.getSearchSection().getDefaultSearchObject(), { SearchType: productType, SortType: $.tp.getDefaultSort(productType) }); }, getProductTypeFromUri: function () {
            var prodType = "Cruise"; var path = window.location.pathname.replace('//', '/'); var urlPathArray = path.split('/'); if (urlPathArray.length > 1) {
                var prodInPath = urlPathArray[1]; if ((prodInPath == "member" || prodInPath == "partner" || prodInPath == "campaign" || prodInPath == "advisor") && urlPathArray.length > 3) { prodInPath = urlPathArray[3]; }
                switch (prodInPath) { case "cruises": prodType = "Cruise"; break; case "hotels": prodType = "Property"; break; case "tours": prodType = "Tour"; break; case "packages": prodType = "Package"; break; case "promotions": prodType = "Promotion"; break; case "services": prodType = "Service"; break; case "air": prodType = "Air"; break; case "advisors": prodType = "Advisor"; break; case "contacts": prodType = "Contact"; break; case "agencies": prodType = "Agency"; break; case "suppliers": prodType = "Supplier"; break; case "global": prodType = "Gts"; break; case "news": prodType = "News"; break; }
            }
            return prodType;
        }, getSearchUriForProductType: function (productType) {
            var uri = ""; switch (productType) { case "Cruise": uri = "/cruises"; break; case "Property": uri = "/hotels"; break; case "Tour": uri = "/tours"; break; case "Package": uri = "/packages"; break; case "Promotion": uri = "/promotions"; break; case "Service": uri = "/services"; break; case "Air": uri = "/air"; break; case "Advisor": uri = "/advisors"; break; case "Supplier": uri = "/suppliers"; break; case "Contact": uri = "/contacts"; break; case "News": uri = "/news"; break; default: alert("Unknown type in getSearchUriForProductType: " + productType); }
            return uri;
        }, adjustPageNumber: function (searchObj) {
            var urlPathArray = window.location.pathname.split('/'); var length = urlPathArray.length; if (length >= 4 && urlPathArray[length - 2] == "search") { searchObj.StartRow = (parseInt(urlPathArray[length - 1]) - 1) * searchObj.RowsPerPage; searchObj.CurrentPage = parseInt(urlPathArray[length - 1]); }
            return searchObj;
        }, saveState: function (searchObj) {
            var self = this; log("In searchRequestManager.saveState() with searchObj:"); log(searchObj); if (hasLocalStorage) { if (typeof (sessionStorage) !== 'undefined') { var json = JSON.stringify(searchObj); sessionStorage.setItem(this.getSearchSection().sectionToken + "_" + this.SESSION_KEY, json); } }
            var frag = "#" + $.param(self.shrinkSearchObj(searchObj)); if (frag != window.location.hash && searchObj.SearchType != "ProductList") {
                this._ignoreNextHashChange = true; $.param.fragment.noEscape("[],"); if (self._isFirstTimeCalled && 'replaceState' in history)
                    history.replaceState('', '', frag); else
                    $.bbq.pushState(self.shrinkSearchObj(searchObj)); self._isFirstTimeCalled = false; log("Called pushState() to update hash fragment.  Frag is now:"); log(window.location.hash); ga('send', 'pageview', { 'page': location.pathname + location.search + location.hash, 'title': $.tp.searchObj.SearchType + ' Facet Selection' });
            }
        }, shrinkSearchObj: function (inputObj) {
            var smallerObj = {}; var searchSectionObj = this.getSearchSection(); if (!searchSectionObj) { return inputObj; }
            var defaultObj = searchSectionObj.getDefaultSearchObject(); for (var property in inputObj) { if (!defaultObj.hasOwnProperty(property) || inputObj[property] != defaultObj[property]) { smallerObj[property] = inputObj[property]; } }
            return smallerObj;
        }
    };
})($8);

$8(document).ready(function ($) {
    $.siteSearch = { searchBox: $('#headerAreaTwo #searchBoxWrapper #searchBoxMainEntry'), closeBox: $("#headerAreaTwo #searchBoxWrapper #closeBox"), searchBoxButton: $("#headerAreaTwo #searchBoxBackdropButton") }; if ($.siteSearch.searchValue == "") { $.siteSearch.closeBox.makeInvisible(); }
    $.siteSearch.searchBoxButton.live("click", function () { sendSearchRequest($); }); $.siteSearch.searchBox.keydown(function (e) { var key = e.charCode ? e.charCode : e.keyCode ? e.keyCode : 0; if (key == 13) { e.preventDefault(); sendSearchRequest($); } }); $.siteSearch.searchBox.bind("keyup", function (event) { log(event.target.id); var $me = $(this); $.siteSearch.closeBox.makeVisible(); if ($me.val().length < 1) { $.siteSearch.closeBox.makeInvisible(); $me.val(""); } }); $.siteSearch.closeBox.bind("click", function () { $(this).makeInvisible(); $.siteSearch.searchBox.val(""); }); $.siteSearch.searchBox.autocomplete({
        open: function () { $(this).autocomplete('widget').css('z-index', 100); return false; }, source: function (request, response) {
            var searchOptionsLocal = {}; searchOptionsLocal.SearchType = 'Gts'; searchOptionsLocal.SearchTerms = stripDashSearch(stripslashes(request.term.replace(/["]/g, ''))); if (typeof $.tp.searchObj != "undefined" && $.tp.searchObj != null) { searchOptionsLocal.SelectedFacets = $.tp.searchObj.SelectedFacets; }
            $("body").tpajax({
                serviceUri: "/TouchPoints/Services/SearchService.svc/GetSuggestions", data: searchOptionsLocal, success: function (data) {
                    if (data[0] != null)
                        response(data);
                }
            });
        }, select: function (event, ui) { $.siteSearch.searchBox.val(ui.item.value); sendSearchRequest($); }, minLength: 1
    }); $.siteSearch.searchBox.data("autocomplete")._renderItem = function (ul, item) { var term = this.term.split(' ').join('|'); var re = new RegExp("(" + term + ")", "gi"); var t = item.label.replace(re, "<b>$1</b>"); return $("<li></li>").data("item.autocomplete", item).append("<a>" + t + "</a>").appendTo(ul); };
}); function sendSearchRequest($) {
    $.tp.searchRequestManager.clearCacheOfAllSearchObjs(); var $search = stripDashSearch(stripslashes($.siteSearch.searchBox.val().replace(/["]/g, ''))); if (($.tp.searchRequestManager.getSearchSection() != null) && (typeof $.tp.searchObj != "undefined" && $.tp.searchObj != null)) { $.tp.searchObj.SearchTerms = $search; $.tp.searchObj.SearchMode = "Gts"; $.tp.searchObj.StartRow = parseInt("0"); $.tp.searchObj.CurrentPage = parseInt("1"); }
    location.href = adjustCobrandedPageUri("/global/search?search=" + encodeURIComponent($search) + "&mode=Gts");
}
function stripDashSearch(term) {
    if (term == "-") { return ""; }
    return term;
}
function stripslashes(str) { return (str + '').replace(/\\(.?)/g, function (s, n1) { switch (n1) { case '\\': return ''; case '0': return '\u0000'; case '': return ''; default: return n1; } }); };

(function ($) {
    $.widget('touchpoints.tpajax', {
        options: { success: function () { alert("Please define a success callback"); }, error: function () { }, complete: function () { }, serviceUri: "/Services/SearchService.svc/IsSessionValid", data: {}, dataType: null, cache: false, method: "POST", objectName: "options" }, _create: function () { }, _init: function () {
            var self = this; var opt = self.options; if (opt.data.SelectedFacets && opt.data.SelectedFacets.length <= 0) { }
            if (typeof opt.data.SearchTerms == "undefined") { opt.data.SearchTerms = ""; }
            log("**************************\nSending From tpajax ......"); log('**************************\n{"' + opt.objectName + '":' + JSON.stringify(opt.data) + '}'); $.ajax({ type: opt.method, url: opt.serviceUri, data: '{"' + opt.objectName + '":' + JSON.stringify(opt.data) + '}', contentType: "application/json; charset=utf-8", dataType: opt.dataType, cache: opt.cache, success: function (data, textStatus, jqXHR) { opt.success(data, textStatus, jqXHR); }, error: function (jqXHR, textStatus, errorThrown) { opt.error(jqXHR, textStatus, errorThrown); }, complete: function (jqXHR, textStatus) { opt.complete(jqXHR, textStatus); } });
        }
    });
})($8);

(function ($) {
    var defaultWidth = 650, defaultHeight = 'auto', allowScroll = true; $(document).on('touchmove', function (e) { if (!allowScroll) { if (!$('.ui-dialog-content').has($(e.target)).length) { e.preventDefault(); } } }); $.widget("touchpoints.tpdialog", {
        options: { width: defaultWidth, height: defaultHeight, closeText: "Close", title: "", contentUrl: "", modal: true, resizable: false, dialogClass: "", openerId: "", openerClass: "", openerControl: null, buttons: null, autoOpen: false, hasDefaultCloseButton: true, dialogOpenCallback: null, dialogCloseHandler: null }, _create: function () {
            var self = this, opt = self.options, $el = self.element; var attrWidth = $el.attr("data-width"), attrHeight = $el.attr("data-height"), attrTitle = $el.attr("title"), attrContentUrl = $el.attr("data-contentUrl"), attrOpenerId = $el.attr("data-openerId"), attrOpenerClass = $el.attr("data-openerClass"), attrOpenerControl = $el.attr("data-openerControl"), attrHasDefaultCloseButton = $el.attr("data-hasDefaultCloseButton"), attrDialogClass = $el.attr("data-dialogClass"); if (opt.width == defaultWidth && typeof attrWidth != "undefined") { opt.width = attrWidth; }
            if (opt.height === "" && typeof attrHeight !== "undefined") { opt.height = attrHeight; }
            if (opt.title === "" && typeof attrTitle !== "undefined") { opt.title = attrTitle; }
            if (opt.contentUrl === "" && typeof attrContentUrl !== "undefined") { opt.contentUrl = attrContentUrl; }
            if (opt.openerId === "" && typeof attrOpenerId !== "undefined") { opt.openerId = attrOpenerId; }
            if (opt.openerClass && typeof attrHasDefaultCloseButton !== "undefined") { opt.openerClass = attrHasDefaultCloseButton; }
            if (opt.dialogClass && typeof attrDialogClass !== "undefined") { opt.dialogClass = attrDialogClass; }
            if (opt.hasDefaultCloseButton === "" && typeof attrOpenerClass !== "undefined") { opt.hasDefaultCloseButton = attrOpenerClass; }
            if (opt.openerControl === null && typeof attrOpenerControl !== "undefined") { opt.openerControl = attrOpenerControl; }
            if (opt.buttons === null && opt.hasDefaultCloseButton) { opt.buttons = [{ text: opt.closeText, click: function () { $(this).dialog("close"); } }]; }
        }, _init: function () {
            var self = this, opt = self.options, $el = self.element; $el.dialog({ height: opt.height, width: opt.width, modal: opt.modal, resizable: opt.resizable, dialogClass: opt.dialogClass, closeText: "", show: "fade", hide: "fade", autoOpen: opt.autoOpen, buttons: opt.buttons, title: opt.title, open: function (event, ui) { $("html").css({ overflow: 'hidden', display: 'block', paddingRight: '17px', boxSizing: 'border-box' }); $(document).on("click", ".ui-widget-overlay", function () { var $dialog = $(".ui-dialog").children(".ui-dialog-content"); $dialog.dialog("close"); }); allowScroll = false; }, beforeClose: function (event, ui) { $("html").css({ overflow: 'auto', display: 'block', paddingRight: '0px', boxSizing: 'border-box' }); allowScroll = true; }, close: function (event, ui) { if (opt.dialogCloseHandler != null && typeof opt.dialogCloseHandler == "function") { opt.dialogCloseHandler(); } } }); if (opt.openerId != "") { $("#" + opt.openerId).on("click.tpdialog", function () { opt.openerControl = this; self.open(); return false; }); }
            if (opt.openerClass != "") { $("." + opt.openerClass).on("click.tpdialog", function () { opt.openerControl = this; self.open(); return false; }); }
            if (opt.autoOpen) { self.open(); }
            return false;
        }, destroy: function () {
            var self = this, opt = self.options, $el = self.element; if (opt.openerControl != null) { $(opt.openerControl).off(".tpdialog"); }
            $el.dialog("destroy");
        }, open: function () {
            var self = this, opt = self.options, $el = self.element; var currentContentUrl = opt.contentUrl; if (opt.dialogOpenCallback != null && typeof opt.dialogOpenCallback == "function") { opt.dialogOpenCallback(self, opt.openerControl); }
            if (opt.contentUrl !== "") { var strSpinner = '<div class="loadingSpinnerContainer"><img src="/TouchPoints/Sites/VCom/Scripts/jquery-ui.touchpoints.tpdialog/images/smallindicator.gif" alt="Loading..." width="24" height="24" class="imgLoading"  /></div>'; var strIframe = '<iframe class="dialogIframe" src="' + opt.contentUrl + '" height="100%" width="100%" scrolling="auto" frameborder="0" framespacing="0" border="0"></iframe>'; $el.html('<div class="outerTpDialogContainer">' + strSpinner + '<div class="dialogIframeContainer" style="visibility:hidden">' + strIframe + '</div></div>'); var $iframe = $el.find("iframe"); $iframe.on('load', function () { $el.find(".loadingSpinnerContainer").hide(); $el.find(".outerTpDialogContainer").css({ height: "100%" }); var $iframeContainer = $el.find('.dialogIframeContainer'); $iframeContainer.hide(); $iframeContainer.css({ visibility: "visible", height: "100%" }); $iframeContainer.fadeIn("slow"); }); }
            $el.dialog("open");
        }, close: function () { var self = this, opt = self.options, $el = self.element; $el.dialog("close"); }
    });
})($8);

var tp = tp || {}; tp.utils = (function () {
    var
    attachSizeToMediaServerFileUrl = function (url, height, width) {
        var imageUrl = url; if (url && url.length > 0) { var lastSlash = url.lastIndexOf("/"); imageUrl = url.substring(0, lastSlash); imageUrl += "/H" + height; imageUrl += "/W" + width; imageUrl += url.substring(lastSlash); }
        return imageUrl;
    }; return { attachSizeToMediaServerFileUrl: attachSizeToMediaServerFileUrl };
})();

(function ($) {
    if ($.fn.dotdotdot)
    { return; }
    $.fn.dotdotdot = function (o) {
        if (this.length == 0)
        { debug(false, 'No element found for "' + this.selector + '".'); return this; }
        if (this.length > 1) {
            return this.each(function ()
            { $(this).dotdotdot(o); });
        }
        var $dot = this; if ($dot.data('dotdotdot'))
        { $dot.trigger('destroy.dot'); }
        $dot.bind_events = function () {
            $dot.bind('update.dot', function (e, c) {
                e.preventDefault(); e.stopPropagation(); opts.maxHeight = (typeof opts.height == 'number') ? opts.height : getTrueInnerHeight($dot); opts.maxHeight += opts.tolerance; if (typeof c != 'undefined') {
                    if (typeof c == 'string' || c instanceof HTMLElement)
                    { c = $('<div />').append(c).contents(); }
                    if (c instanceof $)
                    { orgContent = c; }
                }
                $inr = $dot.wrapInner('<div class="dotdotdot" />').children(); $inr.empty().append(orgContent.clone(true)).css({ 'height': 'auto', 'width': 'auto', 'border': 'none', 'padding': 0, 'margin': 0 }); var after = false, trunc = false; if (conf.afterElement)
                { after = conf.afterElement.clone(true); conf.afterElement.remove(); }
                if (test($inr, opts)) {
                    if (opts.wrap == 'children')
                    { trunc = children($inr, opts, after); }
                    else
                    { trunc = ellipsis($inr, $dot, $inr, opts, after); }
                }
                $inr.replaceWith($inr.contents()); $inr = null; if ($.isFunction(opts.callback))
                { opts.callback.call($dot[0], trunc, orgContent); }
                conf.isTruncated = trunc; return trunc;
            }).bind('isTruncated.dot', function (e, fn) {
                e.preventDefault(); e.stopPropagation(); if (typeof fn == 'function')
                { fn.call($dot[0], conf.isTruncated); }
                return conf.isTruncated;
            }).bind('originalContent.dot', function (e, fn) {
                e.preventDefault(); e.stopPropagation(); if (typeof fn == 'function')
                { fn.call($dot[0], orgContent); }
                return orgContent;
            }).bind('destroy.dot', function (e)
            { e.preventDefault(); e.stopPropagation(); $dot.unwatch().unbind_events().empty().append(orgContent).data('dotdotdot', false); }); return $dot;
        }; $dot.unbind_events = function ()
        { $dot.unbind('.dot'); return $dot; }; $dot.watch = function () {
            $dot.unwatch(); if (opts.watch == 'window') {
                var $window = $(window), _wWidth = $window.width(), _wHeight = $window.height(); $window.bind('resize.dot' + conf.dotId, function () {
                    if (_wWidth != $window.width() || _wHeight != $window.height() || !opts.windowResizeFix) {
                        _wWidth = $window.width(); _wHeight = $window.height(); if (watchInt)
                        { clearInterval(watchInt); }
                        watchInt = setTimeout(function ()
                        { $dot.trigger('update.dot'); }, 10);
                    }
                });
            }
            else {
                watchOrg = getSizes($dot); watchInt = setInterval(function () {
                    var watchNew = getSizes($dot); if (watchOrg.width != watchNew.width || watchOrg.height != watchNew.height)
                    { $dot.trigger('update.dot'); watchOrg = getSizes($dot); }
                }, 100);
            }
            return $dot;
        }; $dot.unwatch = function () {
            $(window).unbind('resize.dot' + conf.dotId); if (watchInt)
            { clearInterval(watchInt); }
            return $dot;
        }; var orgContent = $dot.contents(), opts = $.extend(true, {}, $.fn.dotdotdot.defaults, o), conf = {}, watchOrg = {}, watchInt = null, $inr = null; conf.afterElement = getElement(opts.after, $dot); conf.isTruncated = false; conf.dotId = dotId++; $dot.data('dotdotdot', true).bind_events().trigger('update.dot'); if (opts.watch)
        { $dot.watch(); }
        return $dot;
    }; $.fn.dotdotdot.defaults = { 'ellipsis': '... ', 'wrap': 'word', 'lastCharacter': { 'remove': [' ', ',', ';', '.', '!', '?'], 'noEllipsis': [] }, 'tolerance': 0, 'callback': null, 'after': null, 'height': null, 'watch': false, 'windowResizeFix': true, 'debug': false }; var dotId = 1; function children($elem, o, after) {
        var $elements = $elem.children(), isTruncated = false; $elem.empty(); for (var a = 0, l = $elements.length; a < l; a++) {
            var $e = $elements.eq(a); $elem.append($e); if (after)
            { $elem.append(after); }
            if (test($elem, o))
            { $e.remove(); isTruncated = true; break; }
            else
            {
                if (after)
                { after.remove(); }
            }
        }
        return isTruncated;
    }
    function ellipsis($elem, $d, $i, o, after) {
        var $elements = $elem.contents(), isTruncated = false; $elem.empty(); var notx = 'table, thead, tbody, tfoot, tr, col, colgroup, object, embed, param, ol, ul, dl, select, optgroup, option, textarea, script, style'; for (var a = 0, l = $elements.length; a < l; a++) {
            if (isTruncated)
            { break; }
            var e = $elements[a], $e = $(e); if (typeof e == 'undefined')
            { continue; }
            $elem.append($e); if (after)
            { var func = ($elem.is(notx)) ? 'after' : 'append'; $elem[func](after); }
            if (e.nodeType == 3) {
                if (test($i, o))
                { isTruncated = ellipsisElement($e, $d, $i, o, after); }
            }
            else { isTruncated = ellipsis($e, $d, $i, o, after); }
            if (!isTruncated) {
                if (after)
                { after.remove(); }
            }
        }
        return isTruncated;
    }
    function ellipsisElement($e, $d, $i, o, after) {
        var isTruncated = false, e = $e[0]; if (typeof e == 'undefined')
        { return false; }
        var seporator = (o.wrap == 'letter') ? '' : ' ', textArr = getTextContent(e).split(seporator), position = -1, midPos = -1, startPos = 0, endPos = textArr.length - 1; while (startPos <= endPos) {
            var m = Math.floor((startPos + endPos) / 2); if (m == midPos)
            { break; }
            midPos = m; setTextContent(e, textArr.slice(0, midPos + 1).join(seporator) + o.ellipsis); if (!test($i, o))
            { position = midPos; startPos = midPos; }
            else
            { endPos = midPos; }
        }
        if (position != -1) {
            var txt = textArr.slice(0, position + 1).join(seporator); isTruncated = true; while ($.inArray(txt.slice(-1), o.lastCharacter.remove) > -1)
            { txt = txt.slice(0, -1); }
            if ($.inArray(txt.slice(-1), o.lastCharacter.noEllipsis) < 0)
            { txt += o.ellipsis; }
            setTextContent(e, txt);
        }
        else {
            var $w = $e.parent(); $e.remove(); if ($w.contents().size() > 0)
            { $n = $w.contents().eq(-1); isTruncated = ellipsisElement($n, $d, $i, o, after); }
            else
            { isTruncated = true; }
        }
        return isTruncated;
    }
    function test($i, o)
    { return $i.innerHeight() > o.maxHeight; }
    function getSizes($d)
    { return { 'width': $d.innerWidth(), 'height': $d.innerHeight() }; }
    function setTextContent(e, content) {
        if (e.innerText)
        { e.innerText = content; }
        else if (e.nodeValue)
        { e.nodeValue = content; }
        else if (e.textContent)
        { e.textContent = content; }
    }
    function getTextContent(e) {
        if (e.innerText)
        { return e.innerText; }
        else if (e.nodeValue)
        { return e.nodeValue; }
        else if (e.textContent)
        { return e.textContent; }
        else
        { return ""; }
    }
    function getElement(e, $i) {
        if (typeof e == 'undefined')
        { return false; }
        if (!e)
        { return false; }
        if (typeof e == 'string')
        { e = $(e, $i); return (e.length) ? e : false; }
        if (typeof e == 'object')
        { return (typeof e.jquery == 'undefined') ? false : e; }
        return false;
    }
    function getTrueInnerHeight($el) {
        var h = $el.innerHeight(), a = ['paddingTop', 'paddingBottom']; for (z = 0, l = a.length; z < l; z++) {
            var m = parseInt($el.css(a[z]), 10); if (isNaN(m))
            { m = 0; }
            h -= m;
        }
        return h;
    }
    function debug(d, m) {
        if (!d)
        { return false; }
        if (typeof m == 'string')
        { m = 'dotdotdot: ' + m; }
        else
        { m = ['dotdotdot:', m]; }
        if (window.console && window.console.log)
        { window.console.log(m); }
        return false;
    }
    var _orgHtml = $.fn.html; $.fn.html = function (str) {
        if (typeof str != 'undefined') {
            if (this.data('dotdotdot')) {
                if (typeof str != 'function')
                { return this.trigger('update', [str]); }
            }
            return _orgHtml.call(this, str);
        }
        return _orgHtml.call(this);
    }; var _orgText = $.fn.text; $.fn.text = function (str) {
        if (typeof str != 'undefined') {
            if (this.data('dotdotdot'))
            { var temp = $('<div />'); temp.text(str); str = temp.html(); temp.remove(); return this.trigger('update', [str]); }
            return _orgText.call(this, str);
        }
        return _orgText.call(this);
    };
})(jQuery);

/*NOTE: What does this do?*/
$8(document).ready(function ($) { $(".disabledLink").attr("href", "javascript:void(0)"); });

$8(document).ready(function ($) {
    var $dropdownHidden = $("#countriesContainer").find("#flagArrow").not(":visible"); if ($dropdownHidden) { $("#countriesContainer").addClass("countriesContainer-disabled"); }
    if ($8("#userInfo").attr("data-isalliancepartner") == "True") { $8("#flagArrow").attr("src", "/TouchPoints/Sites/VCom/Images/menu-down-B.png"); } else { $8("#flagArrow").attr("src", "/TouchPoints/Sites/VCom/Images/menu-down-white-A.png"); }
    $("#countriesContainer").click(function (e) { log(e.target.id); e.stopPropagation(); var $me = $(this); var $container = $("#countriesContainer").find("#ddlCountries"); var $disabled = $("#ddlCountries").attr("data-disabled"); $me.addClass("selectedMenuItem"); if ($disabled == "false") { if ($me.find("ul").stop(true, true).is(":hidden")) { $me.find("ul").stop(true, true).show(); $container.select2("open"); $("#countriesContainer").removeClass("countriesContainer-disabled"); $("#countriesContainer").addClass("selectedMenuItem"); log("open"); } else { $container.select2("close"); $me.find("ul").hide(); log("close"); $("#countriesContainer").removeClass("selectedMenuItem"); $("#countriesContainer").addClass("countriesContainer-disabled"); } } }); $("#countriesContainer").hover(function () { var $disabled = $("#ddlCountries").attr("data-disabled"); if ($disabled == "false") { $(this).find(".down-arrow").stop(true, true).attr("src", "/Touchpoints/Sites/VCom/Images/menu-down-A.png"); $("#countriesContainer").removeClass("countriesContainer-disabled"); $("#countriesContainer").addClass("selectedMenuItem"); } }, function () {
        if (!$("#countriesContainer").find("ul").stop(true, true).is(":visible")) {
            var $disabled = $("#ddlCountries").attr("data-disabled"); if ($disabled == "false") {
                if ($8("#userInfo").attr("data-isalliancepartner") == "True") { $(this).find(".down-arrow").stop(true, true).attr("src", "/TouchPoints/Sites/VCom/Images/menu-down-B.png"); } else { $(this).find(".down-arrow").stop(true, true).attr("src", "/TouchPoints/Sites/VCom/Images/menu-down-white-A.png"); }
                $("#countriesContainer").removeClass("selectedMenuItem"); $("#countriesContainer").addClass("countriesContainer-disabled");
            }
        }
    }); $("#countriesContainer").find("ul").stop(true, true).click(function (e) { e.preventDefault(); e.stopPropagation(); }); $('#ddlCountries').click(function (e) { $("#countriesContainer").find("#visibleFlag").stop(true, true).hide(); e.preventDefault(); e.stopPropagation(); }); $('#ddlCountries').on('select', function (v) { $(this).select2("close"); $("#countriesContainer").removeClass("selectedMenuItem"); $("#countriesContainer").addClass("countriesContainer-disabled"); }); $('#ddlCountries').on('close', function (v) { $("#countriesContainer").stop(true, true).find("ul").hide(); $("#countriesContainer").removeClass("selectedMenuItem"); $("#countriesContainer").addClass("countriesContainer-disabled"); $("#countriesContainer").find(".down-arrow").stop(true, true).attr("src", "/Touchpoints/Sites/VCom/Images/menu-down-white-A.png"); });
});

$8(document).ready(function ($) {
    $("#destinationLink,#productsLink,#myAdvisorLink,#findAdvisorLink,#whyVirtuosoLink,#advisorToolsLink").hover(function () { $(this).find(".rightButtonImage").stop().show(); $(this).find("ul").stop(true, true).show(); }, function () { $(this).find(".rightButtonImage").stop().hide(); $(this).find("ul").stop(true, true).hide(); }); var qs = $.parseQuerystring(); var $mode = qs.mode; if (hasLocalStorage && $mode != "Gts") {
        if (typeof sessionStorage.PRODUCTS_SearchObj == "undefined") { setDefaultProductSearch("Cruise"); }
        if (typeof sessionStorage.ADVISORS_SearchObj == "undefined") { setDefaultAdvisorSearch(); }
    }
}); $8.tp.subscriptions("setProductLabel").subscribe(function (data) { if (data && data.obj) { $8("#productBreadCrumbContainer h2").text($8.tp.SolrNameMap[data.obj.SearchType].breadcrumb); } }); $8.tp.subscriptions("setAdvisorSearch").subscribe(function (data) { if (data && data.obj) { setAdvisorSearch(data.obj.uri); } }); $8.tp.subscriptions("setMenuState").subscribe(function (data) { $8("#headerAreaFive .mainMenuItem").removeClass("menuItemSelected").removeClass("removeBackground").addClass("menuItemNotSelected"); if (data && data.obj) { $8("#" + data.obj.item).addClass("menuItemSelected"); $8("#" + data.obj.item).next("li").stop(true, true).addClass("removeBackground"); } }); function setProductSearch(prod) { setDefaultProductSearch(prod); location.href = adjustCobrandedPageUri($8.tp.searchRequestManager.getSearchUriForProductType(prod)); }
function setAdvisorSearch(url) { setDefaultAdvisorSearch(); location.href = url; }
function setDefaultProductSearch(prod) {
    if (hasLocalStorage) {
        var json = sessionStorage.getItem("PRODUCTS_SearchObj"); var view = ""; var currentObj = new Object; if (json != null) { currentObj = JSON.parse(json); view = currentObj.SearchView; } else { view = "1col"; }
        var addOns = { SearchType: prod, SortType: $8.tp.getDefaultSort(prod), SearchView: view }; var searchObj = $8.extend({}, $8.tp.searchRequestManager.searchSections["PRODUCTS"].getDefaultSearchObject(), addOns); sessionStorage.PRODUCTS_SearchObj = JSON.stringify(searchObj);
    }
}
function setDefaultAdvisorSearch() {
    if (hasLocalStorage) {
        var json = sessionStorage.getItem("ADVISORS_SearchObj"); var view = ""; var currentObj = new Object; if (json != null) { currentObj = JSON.parse(json); view = currentObj.SearchView; } else { view = "1col"; }
        var addOns = { SearchView: view }; var partnerInfo = $8('#partnerInfo'), partnerName = partnerInfo.attr('data-displayName'); if (typeof partnerName == 'undefined' || partnerName == "") { var searchObj = $8.extend({}, $8.tp.searchRequestManager.searchSections["ADVISORS"].getDefaultSearchObject(), addOns); sessionStorage.ADVISORS_SearchObj = JSON.stringify(searchObj); }
    }
}
function launchTravelFolio() { $8.ajax({ url: "/advisors/ajax/LaunchTravelFolio", type: "POST", dataType: "text", success: function (urlWithToken) { OpenWindowForLoggedIn(urlWithToken); }, error: function (jqXHR, textStatus, errorThrown) { if ($8.tp.debug) { $8("#productResultsList").empty(); $8("#productResultsList").html(jqXHR.responseText); } } }); }
function launchComposer() { $8.ajax({ url: "/advisors/ajax/LaunchComposer", type: "POST", dataType: "text", success: function (urlWithToken) { OpenWindowForLoggedIn(urlWithToken); }, error: function (jqXHR, textStatus, errorThrown) { if ($8.tp.debug) { $8("#productResultsList").empty(); $8("#productResultsList").html(jqXHR.responseText); } } }); }
function launchComposerReports() { $8.ajax({ url: "/advisors/ajax/LaunchComposerReports", type: "POST", dataType: "text", success: function (urlWithToken) { OpenWindowForLoggedIn(urlWithToken); }, error: function (jqXHR, textStatus, errorThrown) { if ($8.tp.debug) { $8("#productResultsList").empty(); $8("#productResultsList").html(jqXHR.responseText); } } }); }
function launchVirtuosoTravelAcademy() { $8.ajax({ url: "/advisors/ajax/LaunchVirtuosoTravelAcademy", type: "POST", dataType: "text", success: function (urlWithToken) { OpenWindowForLoggedIn(urlWithToken); }, error: function (jqXHR, textStatus, errorThrown) { if ($8.tp.debug) { $8("#productResultsList").empty(); $8("#productResultsList").html(jqXHR.responseText); } } }); }
function launchComposerManageVoyagerClubRegistrations() { $8.ajax({ url: "/advisors/ajax/LaunchComposerManageVoyagerClubRegistrations", type: "POST", dataType: "text", success: function (urlWithToken) { OpenWindowForLoggedIn(urlWithToken, "productResultsList"); }, error: function (jqXHR, textStatus, errorThrown) { if ($8.tp.debug) { $8("#productResultsList").empty(); $8("#productResultsList").html(jqXHR.responseText); } } }); }
function OpenWindowForLoggedIn(uri, containerId) { $8.ajax({ type: "GET", url: "/WebServices/Ajax/IsLoggedIn", contentType: "application/json; charset=utf-8", dataType: "text json", processdata: true, success: function (data) { var obj = JSON.parse(data); log("Authentication.svc .............................. "); log(obj); if (obj.IsLoggedIn == "True") { var popup = window.open(uri, '_blank', 'width=1180,height=600,resizable=yes,scrollbars=yes,toolbar=1,location=1'); if (popup == null || typeof (popup) == 'undefined') { alert('Please disable your pop-up blocker and click the link again.'); } else { popup.focus(); } } else { location.reload(); } }, error: function (jqXHR, textStatus, errorThrown) { if ($8.tp.debug) { $8("#" + containerId).empty(); $8("#" + containerId).html(jqXHR.responseText); } } }); };

$8(document).ready(function ($) {
    $("#UserProfileDisplay").hover(function () { $(this).find("ul").stop(true, true).slideDown(100); $(this).find(".down-arrow").stop(true, true).attr("src", "/Touchpoints/Sites/VCom/Images/menu-down-A.png"); $("#countriesContainer").find("#ddlCountries").select2("close"); $("#countriesContainer ul").hide(); $("#countriesContainer").removeClass("selectedMenuItem"); }, function () {
        var cobranded = $("#userInfo").attr("data-cobrandedname"); if (cobranded != "") { $(this).find(".down-arrow").stop(true, true).attr("src", "/Touchpoints/Sites/VCom/Images/menu-down-b.png"); } else { $(this).find(".down-arrow").stop(true, true).attr("src", "/Touchpoints/Sites/VCom/Images/menu-down-white-A.png"); }
        $(this).find("ul").stop(true, true).slideUp(100);
    }); $("#loggedOutLink").click(function () {
        if (typeof $8.tp.searchObj != 'undefined') { $.tp.searchObj.SelectedFacets = []; $.tp.searchRequestManager.saveState($.tp.searchObj); }
        sessionStorage.removeItem('comparisoncache');
    });
});

$8(document).ready(function ($) {
    var cobranded = $("#userInfo").attr("data-cobrandedname"); if (cobranded != "") {
        if ($("#userInfo").attr("data-loggedin") == "True") { $("#UserProfileDisplay").addClass("loggedIn"); }
        $("#UserProfileDisplay .down-arrow").attr("src", "/Touchpoints/Sites/VCom/Images/menu-down-b.png");
    }
});

(function ($, window) {
    '$:nomunge'; var undefined, aps = Array.prototype.slice, decode = decodeURIComponent, jq_param = $.param, jq_param_fragment, jq_deparam, jq_deparam_fragment, jq_bbq = $.bbq = $.bbq || {}, jq_bbq_pushState, jq_bbq_getState, jq_elemUrlAttr, jq_event_special = $.event.special, str_hashchange = 'hashchange', str_querystring = 'querystring', str_fragment = 'fragment', str_elemUrlAttr = 'elemUrlAttr', str_location = 'location', str_href = 'href', str_src = 'src', re_trim_querystring = /^.*\?|#.*$/g, re_trim_fragment = /^.*\#/, re_no_escape, elemUrlAttr_cache = {}; function is_string(arg) { return typeof arg === 'string'; }; function curry(func) { var args = aps.call(arguments, 1); return function () { return func.apply(this, args.concat(aps.call(arguments))); }; }; function get_fragment(url) { return url.replace(/^[^#]*#?(.*)$/, '$1'); }; function get_querystring(url) { return url.replace(/(?:^[^?#]*\?([^#]*).*$)?.*/, '$1'); }; function jq_param_sub(is_fragment, get_func, url, params, merge_mode) {
        var result, qs, matches, url_params, hash; if (params !== undefined) {
            matches = url.match(is_fragment ? /^([^#]*)\#?(.*)$/ : /^([^#?]*)\??([^#]*)(#?.*)/); hash = matches[3] || ''; if (merge_mode === 2 && is_string(params)) { qs = params.replace(is_fragment ? re_trim_fragment : re_trim_querystring, ''); } else { url_params = jq_deparam(matches[2]); params = is_string(params) ? jq_deparam[is_fragment ? str_fragment : str_querystring](params) : params; qs = merge_mode === 2 ? params : merge_mode === 1 ? $.extend({}, params, url_params) : $.extend({}, url_params, params); qs = jq_param(qs); if (is_fragment) { qs = qs.replace(re_no_escape, decode); } }
            result = matches[1] + (is_fragment ? '#' : qs || !matches[1] ? '?' : '') + qs + hash;
        } else { result = get_func(url !== undefined ? url : window[str_location][str_href]); }
        return result;
    }; jq_param[str_querystring] = curry(jq_param_sub, 0, get_querystring); jq_param[str_fragment] = jq_param_fragment = curry(jq_param_sub, 1, get_fragment); jq_param_fragment.noEscape = function (chars) { chars = chars || ''; var arr = $.map(chars.split(''), encodeURIComponent); re_no_escape = new RegExp(arr.join('|'), 'g'); }; jq_param_fragment.noEscape(',/'); $.deparam = jq_deparam = function (params, coerce) {
        var obj = {}, coerce_types = { 'true': !0, 'false': !1, 'null': null }; $.each(params.replace(/\+/g, ' ').split('&'), function (j, v) {
            var param = v.split('='), key = decode(param[0]), val, cur = obj, i = 0, keys = key.split(']['), keys_last = keys.length - 1; if (/\[/.test(keys[0]) && /\]$/.test(keys[keys_last])) { keys[keys_last] = keys[keys_last].replace(/\]$/, ''); keys = keys.shift().split('[').concat(keys); keys_last = keys.length - 1; } else { keys_last = 0; }
            if (param.length === 2) {
                val = decode(param[1]); if (coerce) { val = val && !isNaN(val) ? +val : val === 'undefined' ? undefined : coerce_types[val] !== undefined ? coerce_types[val] : val; }
                if (keys_last) { for (; i <= keys_last; i++) { key = keys[i] === '' ? cur.length : keys[i]; cur = cur[key] = i < keys_last ? cur[key] || (keys[i + 1] && isNaN(keys[i + 1]) ? {} : []) : val; } } else { if ($.isArray(obj[key])) { obj[key].push(val); } else if (obj[key] !== undefined) { obj[key] = [obj[key], val]; } else { obj[key] = val; } }
            } else if (key) { obj[key] = coerce ? undefined : ''; }
        }); return obj;
    }; function jq_deparam_sub(is_fragment, url_or_params, coerce) {
        if (url_or_params === undefined || typeof url_or_params === 'boolean') { coerce = url_or_params; url_or_params = jq_param[is_fragment ? str_fragment : str_querystring](); } else { url_or_params = is_string(url_or_params) ? url_or_params.replace(is_fragment ? re_trim_fragment : re_trim_querystring, '') : url_or_params; }
        return jq_deparam(url_or_params, coerce);
    }; jq_deparam[str_querystring] = curry(jq_deparam_sub, 0); jq_deparam[str_fragment] = jq_deparam_fragment = curry(jq_deparam_sub, 1); $[str_elemUrlAttr] || ($[str_elemUrlAttr] = function (obj) { return $.extend(elemUrlAttr_cache, obj); })({ a: str_href, base: str_href, iframe: str_src, img: str_src, input: str_src, form: 'action', link: str_href, script: str_src }); jq_elemUrlAttr = $[str_elemUrlAttr]; function jq_fn_sub(mode, force_attr, params, merge_mode) {
        if (!is_string(params) && typeof params !== 'object') { merge_mode = params; params = force_attr; force_attr = undefined; }
        return this.each(function () { var that = $(this), attr = force_attr || jq_elemUrlAttr()[(this.nodeName || '').toLowerCase()] || '', url = attr && that.attr(attr) || ''; that.attr(attr, jq_param[mode](url, params, merge_mode)); });
    }; $.fn[str_querystring] = curry(jq_fn_sub, str_querystring); $.fn[str_fragment] = curry(jq_fn_sub, str_fragment); jq_bbq.pushState = jq_bbq_pushState = function (params, merge_mode) {
        if (is_string(params) && /^#/.test(params) && merge_mode === undefined) { merge_mode = 2; }
        var has_args = params !== undefined, url = jq_param_fragment(window[str_location][str_href], has_args ? params : {}, has_args ? merge_mode : 2); window[str_location][str_href] = url + (/#/.test(url) ? '' : '#');
    }; jq_bbq.getState = jq_bbq_getState = function (key, coerce) { return key === undefined || typeof key === 'boolean' ? jq_deparam_fragment(key) : jq_deparam_fragment(coerce)[key]; }; jq_bbq.removeState = function (arr) {
        var state = {}; if (arr !== undefined) { state = jq_bbq_getState(); $.each($.isArray(arr) ? arr : arguments, function (i, v) { delete state[v]; }); }
        jq_bbq_pushState(state, 2);
    }; jq_event_special[str_hashchange] = $.extend(jq_event_special[str_hashchange], { add: function (handleObj) { var old_handler; function new_handler(e) { var hash = e[str_fragment] = jq_param_fragment(); e.getState = function (key, coerce) { return key === undefined || typeof key === 'boolean' ? jq_deparam(hash, key) : jq_deparam(hash, coerce)[key]; }; old_handler.apply(this, arguments); }; if ($.isFunction(handleObj)) { old_handler = handleObj; return new_handler; } else { old_handler = handleObj.handler; handleObj.handler = new_handler; } } });
})(jQuery, this); (function ($, window, undefined) {
    '$:nomunge'; var fake_onhashchange, jq_event_special = $.event.special, str_location = 'location', str_hashchange = 'hashchange', str_href = 'href', browser = $.browser, mode = document.documentMode, is_old_ie = browser.msie && (mode === undefined || mode < 8), supports_onhashchange = 'on' + str_hashchange in window && !is_old_ie; function get_fragment(url) { url = url || window[str_location][str_href]; return url.replace(/^[^#]*#?(.*)$/, '$1'); }; $[str_hashchange + 'Delay'] = 100; jq_event_special[str_hashchange] = $.extend(jq_event_special[str_hashchange], {
        setup: function () {
            if (supports_onhashchange) { return false; }
            $(fake_onhashchange.start);
        }, teardown: function () {
            if (supports_onhashchange) { return false; }
            $(fake_onhashchange.stop);
        }
    }); fake_onhashchange = (function () {
        var self = {}, timeout_id, iframe, set_history, get_history; function init() { set_history = get_history = function (val) { return val; }; if (is_old_ie) { iframe = $('<iframe src="javascript:0"/>').hide().insertAfter('body')[0].contentWindow; get_history = function () { return get_fragment(iframe.document[str_location][str_href]); }; set_history = function (hash, history_hash) { if (hash !== history_hash) { var doc = iframe.document; doc.open().close(); doc[str_location].hash = '#' + hash; } }; set_history(get_fragment()); } }; self.start = function () {
            if (timeout_id) { return; }
            var last_hash = get_fragment(); set_history || init(); (function loopy() {
                var hash = get_fragment(), history_hash = get_history(last_hash); if (hash !== last_hash) { set_history(last_hash = hash, history_hash); $(window).trigger(str_hashchange); } else if (history_hash !== last_hash) { window[str_location][str_href] = window[str_location][str_href].replace(/#.*/, '') + '#' + history_hash; }
                timeout_id = setTimeout(loopy, $[str_hashchange + 'Delay']);
            })();
        }; self.stop = function () { if (!iframe) { timeout_id && clearTimeout(timeout_id); timeout_id = 0; } }; return self;
    })();
})(jQuery, this);

(function ($) { $.widget("touchpoints.tpcountries", { options: { theme: '' }, destroy: function () { }, _create: function () { var self = this, options = self.options, element = self.element; element.addClass(options.theme); self._trigger("getCountries", null, element); element.bind('change', function (e) { self._trigger('SelectedCountry', e, element); return false; }); }, _setOption: function (option, value) { $.Widget.prototype._setOption.apply(this, arguments); this.element.addClass(value); } }); })(jQuery);

; (function (define) {
    define(['jquery'], function ($) {
        return (function () {
            var $container; var listener; var toastId = 0; var toastType = { error: 'error', info: 'info', success: 'success', warning: 'warning' }; var toastr = { clear: clear, remove: remove, error: error, getContainer: getContainer, info: info, options: {}, subscribe: subscribe, success: success, version: '2.1.0', warning: warning }; var previousToast; return toastr; function error(message, title, optionsOverride) { return notify({ type: toastType.error, iconClass: getOptions().iconClasses.error, message: message, optionsOverride: optionsOverride, title: title }); }
            function getContainer(options, create) {
                if (!options) { options = getOptions(); }
                $container = $('#' + options.containerId); if ($container.length) { return $container; }
                if (create) { $container = createContainer(options); }
                return $container;
            }
            function info(message, title, optionsOverride) { return notify({ type: toastType.info, iconClass: getOptions().iconClasses.info, message: message, optionsOverride: optionsOverride, title: title }); }
            function subscribe(callback) { listener = callback; }
            function success(message, title, optionsOverride) { return notify({ type: toastType.success, iconClass: getOptions().iconClasses.success, message: message, optionsOverride: optionsOverride, title: title }); }
            function warning(message, title, optionsOverride) { return notify({ type: toastType.warning, iconClass: getOptions().iconClasses.warning, message: message, optionsOverride: optionsOverride, title: title }); }
            function clear($toastElement) {
                var options = getOptions(); if (!$container) { getContainer(options); }
                if (!clearToast($toastElement, options)) { clearContainer(options); }
            }
            function remove($toastElement) {
                var options = getOptions(); if (!$container) { getContainer(options); }
                if ($toastElement && $(':focus', $toastElement).length === 0) { removeToast($toastElement); return; }
                if ($container.children().length) { $container.remove(); }
            }
            function clearContainer(options) { var toastsToClear = $container.children(); for (var i = toastsToClear.length - 1; i >= 0; i--) { clearToast($(toastsToClear[i]), options); }; }
            function clearToast($toastElement, options) {
                if ($toastElement && $(':focus', $toastElement).length === 0) { $toastElement[options.hideMethod]({ duration: options.hideDuration, easing: options.hideEasing, complete: function () { removeToast($toastElement); } }); return true; }
                return false;
            }
            function createContainer(options) { $container = $('<div/>').attr('id', options.containerId).addClass(options.positionClass).attr('aria-live', 'polite').attr('role', 'alert'); $container.appendTo($(options.target)); return $container; }
            function getDefaults() { return { tapToDismiss: true, toastClass: 'toast', containerId: 'toast-container', debug: false, showMethod: 'fadeIn', showDuration: 300, showEasing: 'swing', onShown: undefined, hideMethod: 'fadeOut', hideDuration: 1000, hideEasing: 'swing', onHidden: undefined, extendedTimeOut: 1000, iconClasses: { error: 'toast-error', info: 'toast-info', success: 'toast-success', warning: 'toast-warning' }, iconClass: 'toast-info', positionClass: 'toast-top-right', timeOut: 5000, titleClass: 'toast-title', messageClass: 'toast-message', target: 'body', closeHtml: '<button>&times;</button>', newestOnTop: true, preventDuplicates: false }; }
            function publish(args) {
                if (!listener) { return; }
                listener(args);
            }
            function notify(map) {
                var options = getOptions(), iconClass = map.iconClass || options.iconClass; if (options.preventDuplicates) {
                    if (map.message === previousToast) { return; }
                    else { previousToast = map.message; }
                }
                if (typeof (map.optionsOverride) !== 'undefined') { options = $.extend(options, map.optionsOverride); iconClass = map.optionsOverride.iconClass || iconClass; }
                toastId++; $container = getContainer(options, true); var intervalId = null, $toastElement = $('<div/>'), $titleElement = $('<div/>'), $messageElement = $('<div/>'), $closeElement = $(options.closeHtml), response = { toastId: toastId, state: 'visible', startTime: new Date(), options: options, map: map }; if (map.iconClass) { $toastElement.addClass(options.toastClass).addClass(iconClass); }
                if (map.title) { $titleElement.append(map.title).addClass(options.titleClass); $toastElement.append($titleElement); }
                if (map.message) { $messageElement.append(map.message).addClass(options.messageClass); $toastElement.append($messageElement); }
                if (options.closeButton) { $closeElement.addClass('toast-close-button').attr("role", "button"); $toastElement.prepend($closeElement); }
                $toastElement.hide(); if (options.newestOnTop) { $container.prepend($toastElement); } else { $container.append($toastElement); }
                $toastElement[options.showMethod]({ duration: options.showDuration, easing: options.showEasing, complete: options.onShown }); if (options.timeOut > 0) { intervalId = setTimeout(hideToast, options.timeOut); }
                $toastElement.hover(stickAround, delayedHideToast); if (!options.onclick && options.tapToDismiss) { $toastElement.click(hideToast); }
                if (options.closeButton && $closeElement) {
                    $closeElement.click(function (event) {
                        if (event.stopPropagation) { event.stopPropagation(); } else if (event.cancelBubble !== undefined && event.cancelBubble !== true) { event.cancelBubble = true; }
                        hideToast(true);
                    });
                }
                if (options.onclick) { $toastElement.click(function () { options.onclick(); hideToast(); }); }
                publish(response); if (options.debug && console) { console.log(response); }
                return $toastElement; function hideToast(override) {
                    if ($(':focus', $toastElement).length && !override) { return; }
                    return $toastElement[options.hideMethod]({
                        duration: options.hideDuration, easing: options.hideEasing, complete: function () {
                            removeToast($toastElement); if (options.onHidden && response.state !== 'hidden') { options.onHidden(); }
                            response.state = 'hidden'; response.endTime = new Date(); publish(response);
                        }
                    });
                }
                function delayedHideToast() { if (options.timeOut > 0 || options.extendedTimeOut > 0) { intervalId = setTimeout(hideToast, options.extendedTimeOut); } }
                function stickAround() { clearTimeout(intervalId); $toastElement.stop(true, true)[options.showMethod]({ duration: options.showDuration, easing: options.showEasing }); }
            }
            function getOptions() { return $.extend({}, getDefaults(), toastr.options); }
            function removeToast($toastElement) {
                if (!$container) { $container = getContainer(); }
                if ($toastElement.is(':visible')) { return; }
                $toastElement.remove(); $toastElement = null; if ($container.children().length === 0) { $container.remove(); }
            }
        })();
    });
}(typeof define === 'function' && define.amd ? define : function (deps, factory) { if (typeof module !== 'undefined' && module.exports) { module.exports = factory(require('jquery')); } else { window['toastr'] = factory(window['jQuery']); } }));

/*!
 * Knockout JavaScript library v3.2.0
 * (c) Steven Sanderson - http://knockoutjs.com/
 * License: MIT (http://www.opensource.org/licenses/mit-license.php)
 */

(function () {
    var DEBUG = true;
    (function (undefined) {
        // (0, eval)('this') is a robust way of getting a reference to the global object
        // For details, see http://stackoverflow.com/questions/14119988/return-this-0-evalthis/14120023#14120023
        var window = this || (0, eval)('this'),
            document = window['document'],
            navigator = window['navigator'],
            jQueryInstance = window["jQuery"],
            JSON = window["JSON"];
        (function (factory) {
            // Support three module loading scenarios
            if (typeof require === 'function' && typeof exports === 'object' && typeof module === 'object') {
                // [1] CommonJS/Node.js
                var target = module['exports'] || exports; // module.exports is for Node.js
                factory(target, require);
            } else if (typeof define === 'function' && define['amd']) {
                // [2] AMD anonymous module
                define(['exports', 'require'], factory);
            } else {
                // [3] No module loader (plain <script> tag) - put directly in global namespace
                factory(window['ko'] = {});
            }
        }(function (koExports, require) {
            // Internally, all KO objects are attached to koExports (even the non-exported ones whose names will be minified by the closure compiler).
            // In the future, the following "ko" variable may be made distinct from "koExports" so that private objects are not externally reachable.
            var ko = typeof koExports !== 'undefined' ? koExports : {};
            // Google Closure Compiler helpers (used only to make the minified file smaller)
            ko.exportSymbol = function (koPath, object) {
                var tokens = koPath.split(".");

                // In the future, "ko" may become distinct from "koExports" (so that non-exported objects are not reachable)
                // At that point, "target" would be set to: (typeof koExports !== "undefined" ? koExports : ko)
                var target = ko;

                for (var i = 0; i < tokens.length - 1; i++)
                    target = target[tokens[i]];
                target[tokens[tokens.length - 1]] = object;
            };
            ko.exportProperty = function (owner, publicName, object) {
                owner[publicName] = object;
            };
            ko.version = "3.2.0";

            ko.exportSymbol('version', ko.version);
            ko.utils = (function () {
                function objectForEach(obj, action) {
                    for (var prop in obj) {
                        if (obj.hasOwnProperty(prop)) {
                            action(prop, obj[prop]);
                        }
                    }
                }

                function extend(target, source) {
                    if (source) {
                        for (var prop in source) {
                            if (source.hasOwnProperty(prop)) {
                                target[prop] = source[prop];
                            }
                        }
                    }
                    return target;
                }

                function setPrototypeOf(obj, proto) {
                    obj.__proto__ = proto;
                    return obj;
                }

                var canSetPrototype = ({ __proto__: [] } instanceof Array);

                // Represent the known event types in a compact way, then at runtime transform it into a hash with event name as key (for fast lookup)
                var knownEvents = {}, knownEventTypesByEventName = {};
                var keyEventTypeName = (navigator && /Firefox\/2/i.test(navigator.userAgent)) ? 'KeyboardEvent' : 'UIEvents';
                knownEvents[keyEventTypeName] = ['keyup', 'keydown', 'keypress'];
                knownEvents['MouseEvents'] = ['click', 'dblclick', 'mousedown', 'mouseup', 'mousemove', 'mouseover', 'mouseout', 'mouseenter', 'mouseleave'];
                objectForEach(knownEvents, function (eventType, knownEventsForType) {
                    if (knownEventsForType.length) {
                        for (var i = 0, j = knownEventsForType.length; i < j; i++)
                            knownEventTypesByEventName[knownEventsForType[i]] = eventType;
                    }
                });
                var eventsThatMustBeRegisteredUsingAttachEvent = { 'propertychange': true }; // Workaround for an IE9 issue - https://github.com/SteveSanderson/knockout/issues/406

                // Detect IE versions for bug workarounds (uses IE conditionals, not UA string, for robustness)
                // Note that, since IE 10 does not support conditional comments, the following logic only detects IE < 10.
                // Currently this is by design, since IE 10+ behaves correctly when treated as a standard browser.
                // If there is a future need to detect specific versions of IE10+, we will amend this.
                var ieVersion = document && (function () {
                    var version = 3, div = document.createElement('div'), iElems = div.getElementsByTagName('i');

                    // Keep constructing conditional HTML blocks until we hit one that resolves to an empty fragment
                    while (
                        div.innerHTML = '<!--[if gt IE ' + (++version) + ']><i></i><![endif]-->',
                        iElems[0]
                    ) { }
                    return version > 4 ? version : undefined;
                }());
                var isIe6 = ieVersion === 6,
                    isIe7 = ieVersion === 7;

                function isClickOnCheckableElement(element, eventType) {
                    if ((ko.utils.tagNameLower(element) !== "input") || !element.type) return false;
                    if (eventType.toLowerCase() != "click") return false;
                    var inputType = element.type;
                    return (inputType == "checkbox") || (inputType == "radio");
                }

                return {
                    fieldsIncludedWithJsonPost: ['authenticity_token', /^__RequestVerificationToken(_.*)?$/],

                    arrayForEach: function (array, action) {
                        for (var i = 0, j = array.length; i < j; i++)
                            action(array[i], i);
                    },

                    arrayIndexOf: function (array, item) {
                        if (typeof Array.prototype.indexOf == "function")
                            return Array.prototype.indexOf.call(array, item);
                        for (var i = 0, j = array.length; i < j; i++)
                            if (array[i] === item)
                                return i;
                        return -1;
                    },

                    arrayFirst: function (array, predicate, predicateOwner) {
                        for (var i = 0, j = array.length; i < j; i++)
                            if (predicate.call(predicateOwner, array[i], i))
                                return array[i];
                        return null;
                    },

                    arrayRemoveItem: function (array, itemToRemove) {
                        var index = ko.utils.arrayIndexOf(array, itemToRemove);
                        if (index > 0) {
                            array.splice(index, 1);
                        }
                        else if (index === 0) {
                            array.shift();
                        }
                    },

                    arrayGetDistinctValues: function (array) {
                        array = array || [];
                        var result = [];
                        for (var i = 0, j = array.length; i < j; i++) {
                            if (ko.utils.arrayIndexOf(result, array[i]) < 0)
                                result.push(array[i]);
                        }
                        return result;
                    },

                    arrayMap: function (array, mapping) {
                        array = array || [];
                        var result = [];
                        for (var i = 0, j = array.length; i < j; i++)
                            result.push(mapping(array[i], i));
                        return result;
                    },

                    arrayFilter: function (array, predicate) {
                        array = array || [];
                        var result = [];
                        for (var i = 0, j = array.length; i < j; i++)
                            if (predicate(array[i], i))
                                result.push(array[i]);
                        return result;
                    },

                    arrayPushAll: function (array, valuesToPush) {
                        if (valuesToPush instanceof Array)
                            array.push.apply(array, valuesToPush);
                        else
                            for (var i = 0, j = valuesToPush.length; i < j; i++)
                                array.push(valuesToPush[i]);
                        return array;
                    },

                    addOrRemoveItem: function (array, value, included) {
                        var existingEntryIndex = ko.utils.arrayIndexOf(ko.utils.peekObservable(array), value);
                        if (existingEntryIndex < 0) {
                            if (included)
                                array.push(value);
                        } else {
                            if (!included)
                                array.splice(existingEntryIndex, 1);
                        }
                    },

                    canSetPrototype: canSetPrototype,

                    extend: extend,

                    setPrototypeOf: setPrototypeOf,

                    setPrototypeOfOrExtend: canSetPrototype ? setPrototypeOf : extend,

                    objectForEach: objectForEach,

                    objectMap: function (source, mapping) {
                        if (!source)
                            return source;
                        var target = {};
                        for (var prop in source) {
                            if (source.hasOwnProperty(prop)) {
                                target[prop] = mapping(source[prop], prop, source);
                            }
                        }
                        return target;
                    },

                    emptyDomNode: function (domNode) {
                        while (domNode.firstChild) {
                            ko.removeNode(domNode.firstChild);
                        }
                    },

                    moveCleanedNodesToContainerElement: function (nodes) {
                        // Ensure it's a real array, as we're about to reparent the nodes and
                        // we don't want the underlying collection to change while we're doing that.
                        var nodesArray = ko.utils.makeArray(nodes);

                        var container = document.createElement('div');
                        for (var i = 0, j = nodesArray.length; i < j; i++) {
                            container.appendChild(ko.cleanNode(nodesArray[i]));
                        }
                        return container;
                    },

                    cloneNodes: function (nodesArray, shouldCleanNodes) {
                        for (var i = 0, j = nodesArray.length, newNodesArray = []; i < j; i++) {
                            var clonedNode = nodesArray[i].cloneNode(true);
                            newNodesArray.push(shouldCleanNodes ? ko.cleanNode(clonedNode) : clonedNode);
                        }
                        return newNodesArray;
                    },

                    setDomNodeChildren: function (domNode, childNodes) {
                        ko.utils.emptyDomNode(domNode);
                        if (childNodes) {
                            for (var i = 0, j = childNodes.length; i < j; i++)
                                domNode.appendChild(childNodes[i]);
                        }
                    },

                    replaceDomNodes: function (nodeToReplaceOrNodeArray, newNodesArray) {
                        var nodesToReplaceArray = nodeToReplaceOrNodeArray.nodeType ? [nodeToReplaceOrNodeArray] : nodeToReplaceOrNodeArray;
                        if (nodesToReplaceArray.length > 0) {
                            var insertionPoint = nodesToReplaceArray[0];
                            var parent = insertionPoint.parentNode;
                            for (var i = 0, j = newNodesArray.length; i < j; i++)
                                parent.insertBefore(newNodesArray[i], insertionPoint);
                            for (var i = 0, j = nodesToReplaceArray.length; i < j; i++) {
                                ko.removeNode(nodesToReplaceArray[i]);
                            }
                        }
                    },

                    fixUpContinuousNodeArray: function (continuousNodeArray, parentNode) {
                        // Before acting on a set of nodes that were previously outputted by a template function, we have to reconcile
                        // them against what is in the DOM right now. It may be that some of the nodes have already been removed, or that
                        // new nodes might have been inserted in the middle, for example by a binding. Also, there may previously have been
                        // leading comment nodes (created by rewritten string-based templates) that have since been removed during binding.
                        // So, this function translates the old "map" output array into its best guess of the set of current DOM nodes.
                        //
                        // Rules:
                        //   [A] Any leading nodes that have been removed should be ignored
                        //       These most likely correspond to memoization nodes that were already removed during binding
                        //       See https://github.com/SteveSanderson/knockout/pull/440
                        //   [B] We want to output a continuous series of nodes. So, ignore any nodes that have already been removed,
                        //       and include any nodes that have been inserted among the previous collection

                        if (continuousNodeArray.length) {
                            // The parent node can be a virtual element; so get the real parent node
                            parentNode = (parentNode.nodeType === 8 && parentNode.parentNode) || parentNode;

                            // Rule [A]
                            while (continuousNodeArray.length && continuousNodeArray[0].parentNode !== parentNode)
                                continuousNodeArray.shift();

                            // Rule [B]
                            if (continuousNodeArray.length > 1) {
                                var current = continuousNodeArray[0], last = continuousNodeArray[continuousNodeArray.length - 1];
                                // Replace with the actual new continuous node set
                                continuousNodeArray.length = 0;
                                while (current !== last) {
                                    continuousNodeArray.push(current);
                                    current = current.nextSibling;
                                    if (!current) // Won't happen, except if the developer has manually removed some DOM elements (then we're in an undefined scenario)
                                        return;
                                }
                                continuousNodeArray.push(last);
                            }
                        }
                        return continuousNodeArray;
                    },

                    setOptionNodeSelectionState: function (optionNode, isSelected) {
                        // IE6 sometimes throws "unknown error" if you try to write to .selected directly, whereas Firefox struggles with setAttribute. Pick one based on browser.
                        if (ieVersion < 7)
                            optionNode.setAttribute("selected", isSelected);
                        else
                            optionNode.selected = isSelected;
                    },

                    stringTrim: function (string) {
                        return string === null || string === undefined ? '' :
                            string.trim ?
                                string.trim() :
                                string.toString().replace(/^[\s\xa0]+|[\s\xa0]+$/g, '');
                    },

                    stringStartsWith: function (string, startsWith) {
                        string = string || "";
                        if (startsWith.length > string.length)
                            return false;
                        return string.substring(0, startsWith.length) === startsWith;
                    },

                    domNodeIsContainedBy: function (node, containedByNode) {
                        if (node === containedByNode)
                            return true;
                        if (node.nodeType === 11)
                            return false; // Fixes issue #1162 - can't use node.contains for document fragments on IE8
                        if (containedByNode.contains)
                            return containedByNode.contains(node.nodeType === 3 ? node.parentNode : node);
                        if (containedByNode.compareDocumentPosition)
                            return (containedByNode.compareDocumentPosition(node) & 16) == 16;
                        while (node && node != containedByNode) {
                            node = node.parentNode;
                        }
                        return !!node;
                    },

                    domNodeIsAttachedToDocument: function (node) {
                        return ko.utils.domNodeIsContainedBy(node, node.ownerDocument.documentElement);
                    },

                    anyDomNodeIsAttachedToDocument: function (nodes) {
                        return !!ko.utils.arrayFirst(nodes, ko.utils.domNodeIsAttachedToDocument);
                    },

                    tagNameLower: function (element) {
                        // For HTML elements, tagName will always be upper case; for XHTML elements, it'll be lower case.
                        // Possible future optimization: If we know it's an element from an XHTML document (not HTML),
                        // we don't need to do the .toLowerCase() as it will always be lower case anyway.
                        return element && element.tagName && element.tagName.toLowerCase();
                    },

                    registerEventHandler: function (element, eventType, handler) {
                        var mustUseAttachEvent = ieVersion && eventsThatMustBeRegisteredUsingAttachEvent[eventType];
                        if (!mustUseAttachEvent && jQueryInstance) {
                            jQueryInstance(element)['bind'](eventType, handler);
                        } else if (!mustUseAttachEvent && typeof element.addEventListener == "function")
                            element.addEventListener(eventType, handler, false);
                        else if (typeof element.attachEvent != "undefined") {
                            var attachEventHandler = function (event) { handler.call(element, event); },
                                attachEventName = "on" + eventType;
                            element.attachEvent(attachEventName, attachEventHandler);

                            // IE does not dispose attachEvent handlers automatically (unlike with addEventListener)
                            // so to avoid leaks, we have to remove them manually. See bug #856
                            ko.utils.domNodeDisposal.addDisposeCallback(element, function () {
                                element.detachEvent(attachEventName, attachEventHandler);
                            });
                        } else
                            throw new Error("Browser doesn't support addEventListener or attachEvent");
                    },

                    triggerEvent: function (element, eventType) {
                        if (!(element && element.nodeType))
                            throw new Error("element must be a DOM node when calling triggerEvent");

                        // For click events on checkboxes and radio buttons, jQuery toggles the element checked state *after* the
                        // event handler runs instead of *before*. (This was fixed in 1.9 for checkboxes but not for radio buttons.)
                        // IE doesn't change the checked state when you trigger the click event using "fireEvent".
                        // In both cases, we'll use the click method instead.
                        var useClickWorkaround = isClickOnCheckableElement(element, eventType);

                        if (jQueryInstance && !useClickWorkaround) {
                            jQueryInstance(element)['trigger'](eventType);
                        } else if (typeof document.createEvent == "function") {
                            if (typeof element.dispatchEvent == "function") {
                                var eventCategory = knownEventTypesByEventName[eventType] || "HTMLEvents";
                                var event = document.createEvent(eventCategory);
                                event.initEvent(eventType, true, true, window, 0, 0, 0, 0, 0, false, false, false, false, 0, element);
                                element.dispatchEvent(event);
                            }
                            else
                                throw new Error("The supplied element doesn't support dispatchEvent");
                        } else if (useClickWorkaround && element.click) {
                            element.click();
                        } else if (typeof element.fireEvent != "undefined") {
                            element.fireEvent("on" + eventType);
                        } else {
                            throw new Error("Browser doesn't support triggering events");
                        }
                    },

                    unwrapObservable: function (value) {
                        return ko.isObservable(value) ? value() : value;
                    },

                    peekObservable: function (value) {
                        return ko.isObservable(value) ? value.peek() : value;
                    },

                    toggleDomNodeCssClass: function (node, classNames, shouldHaveClass) {
                        if (classNames) {
                            var cssClassNameRegex = /\S+/g,
                                currentClassNames = node.className.match(cssClassNameRegex) || [];
                            ko.utils.arrayForEach(classNames.match(cssClassNameRegex), function (className) {
                                ko.utils.addOrRemoveItem(currentClassNames, className, shouldHaveClass);
                            });
                            node.className = currentClassNames.join(" ");
                        }
                    },

                    setTextContent: function (element, textContent) {
                        var value = ko.utils.unwrapObservable(textContent);
                        if ((value === null) || (value === undefined))
                            value = "";

                        // We need there to be exactly one child: a text node.
                        // If there are no children, more than one, or if it's not a text node,
                        // we'll clear everything and create a single text node.
                        var innerTextNode = ko.virtualElements.firstChild(element);
                        if (!innerTextNode || innerTextNode.nodeType != 3 || ko.virtualElements.nextSibling(innerTextNode)) {
                            ko.virtualElements.setDomNodeChildren(element, [element.ownerDocument.createTextNode(value)]);
                        } else {
                            innerTextNode.data = value;
                        }

                        ko.utils.forceRefresh(element);
                    },

                    setElementName: function (element, name) {
                        element.name = name;

                        // Workaround IE 6/7 issue
                        // - https://github.com/SteveSanderson/knockout/issues/197
                        // - http://www.matts411.com/post/setting_the_name_attribute_in_ie_dom/
                        if (ieVersion <= 7) {
                            try {
                                element.mergeAttributes(document.createElement("<input name='" + element.name + "'/>"), false);
                            }
                            catch (e) { } // For IE9 with doc mode "IE9 Standards" and browser mode "IE9 Compatibility View"
                        }
                    },

                    forceRefresh: function (node) {
                        // Workaround for an IE9 rendering bug - https://github.com/SteveSanderson/knockout/issues/209
                        if (ieVersion >= 9) {
                            // For text nodes and comment nodes (most likely virtual elements), we will have to refresh the container
                            var elem = node.nodeType == 1 ? node : node.parentNode;
                            if (elem.style)
                                elem.style.zoom = elem.style.zoom;
                        }
                    },

                    ensureSelectElementIsRenderedCorrectly: function (selectElement) {
                        // Workaround for IE9 rendering bug - it doesn't reliably display all the text in dynamically-added select boxes unless you force it to re-render by updating the width.
                        // (See https://github.com/SteveSanderson/knockout/issues/312, http://stackoverflow.com/questions/5908494/select-only-shows-first-char-of-selected-option)
                        // Also fixes IE7 and IE8 bug that causes selects to be zero width if enclosed by 'if' or 'with'. (See issue #839)
                        if (ieVersion) {
                            var originalWidth = selectElement.style.width;
                            selectElement.style.width = 0;
                            selectElement.style.width = originalWidth;
                        }
                    },

                    range: function (min, max) {
                        min = ko.utils.unwrapObservable(min);
                        max = ko.utils.unwrapObservable(max);
                        var result = [];
                        for (var i = min; i <= max; i++)
                            result.push(i);
                        return result;
                    },

                    makeArray: function (arrayLikeObject) {
                        var result = [];
                        for (var i = 0, j = arrayLikeObject.length; i < j; i++) {
                            result.push(arrayLikeObject[i]);
                        };
                        return result;
                    },

                    isIe6: isIe6,
                    isIe7: isIe7,
                    ieVersion: ieVersion,

                    getFormFields: function (form, fieldName) {
                        var fields = ko.utils.makeArray(form.getElementsByTagName("input")).concat(ko.utils.makeArray(form.getElementsByTagName("textarea")));
                        var isMatchingField = (typeof fieldName == 'string')
                            ? function (field) { return field.name === fieldName }
                            : function (field) { return fieldName.test(field.name) }; // Treat fieldName as regex or object containing predicate
                        var matches = [];
                        for (var i = fields.length - 1; i >= 0; i--) {
                            if (isMatchingField(fields[i]))
                                matches.push(fields[i]);
                        };
                        return matches;
                    },

                    parseJson: function (jsonString) {
                        if (typeof jsonString == "string") {
                            jsonString = ko.utils.stringTrim(jsonString);
                            if (jsonString) {
                                if (JSON && JSON.parse) // Use native parsing where available
                                    return JSON.parse(jsonString);
                                return (new Function("return " + jsonString))(); // Fallback on less safe parsing for older browsers
                            }
                        }
                        return null;
                    },

                    stringifyJson: function (data, replacer, space) {   // replacer and space are optional
                        if (!JSON || !JSON.stringify)
                            throw new Error("Cannot find JSON.stringify(). Some browsers (e.g., IE < 8) don't support it natively, but you can overcome this by adding a script reference to json2.js, downloadable from http://www.json.org/json2.js");
                        return JSON.stringify(ko.utils.unwrapObservable(data), replacer, space);
                    },

                    postJson: function (urlOrForm, data, options) {
                        options = options || {};
                        var params = options['params'] || {};
                        var includeFields = options['includeFields'] || this.fieldsIncludedWithJsonPost;
                        var url = urlOrForm;

                        // If we were given a form, use its 'action' URL and pick out any requested field values
                        if ((typeof urlOrForm == 'object') && (ko.utils.tagNameLower(urlOrForm) === "form")) {
                            var originalForm = urlOrForm;
                            url = originalForm.action;
                            for (var i = includeFields.length - 1; i >= 0; i--) {
                                var fields = ko.utils.getFormFields(originalForm, includeFields[i]);
                                for (var j = fields.length - 1; j >= 0; j--)
                                    params[fields[j].name] = fields[j].value;
                            }
                        }

                        data = ko.utils.unwrapObservable(data);
                        var form = document.createElement("form");
                        form.style.display = "none";
                        form.action = url;
                        form.method = "post";
                        for (var key in data) {
                            // Since 'data' this is a model object, we include all properties including those inherited from its prototype
                            var input = document.createElement("input");
                            input.type = "hidden";
                            input.name = key;
                            input.value = ko.utils.stringifyJson(ko.utils.unwrapObservable(data[key]));
                            form.appendChild(input);
                        }
                        objectForEach(params, function (key, value) {
                            var input = document.createElement("input");
                            input.type = "hidden";
                            input.name = key;
                            input.value = value;
                            form.appendChild(input);
                        });
                        document.body.appendChild(form);
                        options['submitter'] ? options['submitter'](form) : form.submit();
                        setTimeout(function () { form.parentNode.removeChild(form); }, 0);
                    }
                }
            }());

            ko.exportSymbol('utils', ko.utils);
            ko.exportSymbol('utils.arrayForEach', ko.utils.arrayForEach);
            ko.exportSymbol('utils.arrayFirst', ko.utils.arrayFirst);
            ko.exportSymbol('utils.arrayFilter', ko.utils.arrayFilter);
            ko.exportSymbol('utils.arrayGetDistinctValues', ko.utils.arrayGetDistinctValues);
            ko.exportSymbol('utils.arrayIndexOf', ko.utils.arrayIndexOf);
            ko.exportSymbol('utils.arrayMap', ko.utils.arrayMap);
            ko.exportSymbol('utils.arrayPushAll', ko.utils.arrayPushAll);
            ko.exportSymbol('utils.arrayRemoveItem', ko.utils.arrayRemoveItem);
            ko.exportSymbol('utils.extend', ko.utils.extend);
            ko.exportSymbol('utils.fieldsIncludedWithJsonPost', ko.utils.fieldsIncludedWithJsonPost);
            ko.exportSymbol('utils.getFormFields', ko.utils.getFormFields);
            ko.exportSymbol('utils.peekObservable', ko.utils.peekObservable);
            ko.exportSymbol('utils.postJson', ko.utils.postJson);
            ko.exportSymbol('utils.parseJson', ko.utils.parseJson);
            ko.exportSymbol('utils.registerEventHandler', ko.utils.registerEventHandler);
            ko.exportSymbol('utils.stringifyJson', ko.utils.stringifyJson);
            ko.exportSymbol('utils.range', ko.utils.range);
            ko.exportSymbol('utils.toggleDomNodeCssClass', ko.utils.toggleDomNodeCssClass);
            ko.exportSymbol('utils.triggerEvent', ko.utils.triggerEvent);
            ko.exportSymbol('utils.unwrapObservable', ko.utils.unwrapObservable);
            ko.exportSymbol('utils.objectForEach', ko.utils.objectForEach);
            ko.exportSymbol('utils.addOrRemoveItem', ko.utils.addOrRemoveItem);
            ko.exportSymbol('unwrap', ko.utils.unwrapObservable); // Convenient shorthand, because this is used so commonly

            if (!Function.prototype['bind']) {
                // Function.prototype.bind is a standard part of ECMAScript 5th Edition (December 2009, http://www.ecma-international.org/publications/files/ECMA-ST/ECMA-262.pdf)
                // In case the browser doesn't implement it natively, provide a JavaScript implementation. This implementation is based on the one in prototype.js
                Function.prototype['bind'] = function (object) {
                    var originalFunction = this, args = Array.prototype.slice.call(arguments), object = args.shift();
                    return function () {
                        return originalFunction.apply(object, args.concat(Array.prototype.slice.call(arguments)));
                    };
                };
            }

            ko.utils.domData = new (function () {
                var uniqueId = 0;
                var dataStoreKeyExpandoPropertyName = "__ko__" + (new Date).getTime();
                var dataStore = {};

                function getAll(node, createIfNotFound) {
                    var dataStoreKey = node[dataStoreKeyExpandoPropertyName];
                    var hasExistingDataStore = dataStoreKey && (dataStoreKey !== "null") && dataStore[dataStoreKey];
                    if (!hasExistingDataStore) {
                        if (!createIfNotFound)
                            return undefined;
                        dataStoreKey = node[dataStoreKeyExpandoPropertyName] = "ko" + uniqueId++;
                        dataStore[dataStoreKey] = {};
                    }
                    return dataStore[dataStoreKey];
                }

                return {
                    get: function (node, key) {
                        var allDataForNode = getAll(node, false);
                        return allDataForNode === undefined ? undefined : allDataForNode[key];
                    },
                    set: function (node, key, value) {
                        if (value === undefined) {
                            // Make sure we don't actually create a new domData key if we are actually deleting a value
                            if (getAll(node, false) === undefined)
                                return;
                        }
                        var allDataForNode = getAll(node, true);
                        allDataForNode[key] = value;
                    },
                    clear: function (node) {
                        var dataStoreKey = node[dataStoreKeyExpandoPropertyName];
                        if (dataStoreKey) {
                            delete dataStore[dataStoreKey];
                            node[dataStoreKeyExpandoPropertyName] = null;
                            return true; // Exposing "did clean" flag purely so specs can infer whether things have been cleaned up as intended
                        }
                        return false;
                    },

                    nextKey: function () {
                        return (uniqueId++) + dataStoreKeyExpandoPropertyName;
                    }
                };
            })();

            ko.exportSymbol('utils.domData', ko.utils.domData);
            ko.exportSymbol('utils.domData.clear', ko.utils.domData.clear); // Exporting only so specs can clear up after themselves fully

            ko.utils.domNodeDisposal = new (function () {
                var domDataKey = ko.utils.domData.nextKey();
                var cleanableNodeTypes = { 1: true, 8: true, 9: true };       // Element, Comment, Document
                var cleanableNodeTypesWithDescendants = { 1: true, 9: true }; // Element, Document

                function getDisposeCallbacksCollection(node, createIfNotFound) {
                    var allDisposeCallbacks = ko.utils.domData.get(node, domDataKey);
                    if ((allDisposeCallbacks === undefined) && createIfNotFound) {
                        allDisposeCallbacks = [];
                        ko.utils.domData.set(node, domDataKey, allDisposeCallbacks);
                    }
                    return allDisposeCallbacks;
                }
                function destroyCallbacksCollection(node) {
                    ko.utils.domData.set(node, domDataKey, undefined);
                }

                function cleanSingleNode(node) {
                    // Run all the dispose callbacks
                    var callbacks = getDisposeCallbacksCollection(node, false);
                    if (callbacks) {
                        callbacks = callbacks.slice(0); // Clone, as the array may be modified during iteration (typically, callbacks will remove themselves)
                        for (var i = 0; i < callbacks.length; i++)
                            callbacks[i](node);
                    }

                    // Erase the DOM data
                    ko.utils.domData.clear(node);

                    // Perform cleanup needed by external libraries (currently only jQuery, but can be extended)
                    ko.utils.domNodeDisposal["cleanExternalData"](node);

                    // Clear any immediate-child comment nodes, as these wouldn't have been found by
                    // node.getElementsByTagName("*") in cleanNode() (comment nodes aren't elements)
                    if (cleanableNodeTypesWithDescendants[node.nodeType])
                        cleanImmediateCommentTypeChildren(node);
                }

                function cleanImmediateCommentTypeChildren(nodeWithChildren) {
                    var child, nextChild = nodeWithChildren.firstChild;
                    while (child = nextChild) {
                        nextChild = child.nextSibling;
                        if (child.nodeType === 8)
                            cleanSingleNode(child);
                    }
                }

                return {
                    addDisposeCallback: function (node, callback) {
                        if (typeof callback != "function")
                            throw new Error("Callback must be a function");
                        getDisposeCallbacksCollection(node, true).push(callback);
                    },

                    removeDisposeCallback: function (node, callback) {
                        var callbacksCollection = getDisposeCallbacksCollection(node, false);
                        if (callbacksCollection) {
                            ko.utils.arrayRemoveItem(callbacksCollection, callback);
                            if (callbacksCollection.length == 0)
                                destroyCallbacksCollection(node);
                        }
                    },

                    cleanNode: function (node) {
                        // First clean this node, where applicable
                        if (cleanableNodeTypes[node.nodeType]) {
                            cleanSingleNode(node);

                            // ... then its descendants, where applicable
                            if (cleanableNodeTypesWithDescendants[node.nodeType]) {
                                // Clone the descendants list in case it changes during iteration
                                var descendants = [];
                                ko.utils.arrayPushAll(descendants, node.getElementsByTagName("*"));
                                for (var i = 0, j = descendants.length; i < j; i++)
                                    cleanSingleNode(descendants[i]);
                            }
                        }
                        return node;
                    },

                    removeNode: function (node) {
                        ko.cleanNode(node);
                        if (node.parentNode)
                            node.parentNode.removeChild(node);
                    },

                    "cleanExternalData": function (node) {
                        // Special support for jQuery here because it's so commonly used.
                        // Many jQuery plugins (including jquery.tmpl) store data using jQuery's equivalent of domData
                        // so notify it to tear down any resources associated with the node & descendants here.
                        if (jQueryInstance && (typeof jQueryInstance['cleanData'] == "function"))
                            jQueryInstance['cleanData']([node]);
                    }
                }
            })();
            ko.cleanNode = ko.utils.domNodeDisposal.cleanNode; // Shorthand name for convenience
            ko.removeNode = ko.utils.domNodeDisposal.removeNode; // Shorthand name for convenience
            ko.exportSymbol('cleanNode', ko.cleanNode);
            ko.exportSymbol('removeNode', ko.removeNode);
            ko.exportSymbol('utils.domNodeDisposal', ko.utils.domNodeDisposal);
            ko.exportSymbol('utils.domNodeDisposal.addDisposeCallback', ko.utils.domNodeDisposal.addDisposeCallback);
            ko.exportSymbol('utils.domNodeDisposal.removeDisposeCallback', ko.utils.domNodeDisposal.removeDisposeCallback);
            (function () {
                var leadingCommentRegex = /^(\s*)<!--(.*?)-->/;

                function simpleHtmlParse(html) {
                    // Based on jQuery's "clean" function, but only accounting for table-related elements.
                    // If you have referenced jQuery, this won't be used anyway - KO will use jQuery's "clean" function directly

                    // Note that there's still an issue in IE < 9 whereby it will discard comment nodes that are the first child of
                    // a descendant node. For example: "<div><!-- mycomment -->abc</div>" will get parsed as "<div>abc</div>"
                    // This won't affect anyone who has referenced jQuery, and there's always the workaround of inserting a dummy node
                    // (possibly a text node) in front of the comment. So, KO does not attempt to workaround this IE issue automatically at present.

                    // Trim whitespace, otherwise indexOf won't work as expected
                    var tags = ko.utils.stringTrim(html).toLowerCase(), div = document.createElement("div");

                    // Finds the first match from the left column, and returns the corresponding "wrap" data from the right column
                    var wrap = tags.match(/^<(thead|tbody|tfoot)/) && [1, "<table>", "</table>"] ||
                               !tags.indexOf("<tr") && [2, "<table><tbody>", "</tbody></table>"] ||
                               (!tags.indexOf("<td") || !tags.indexOf("<th")) && [3, "<table><tbody><tr>", "</tr></tbody></table>"] ||
                               /* anything else */[0, "", ""];

                    // Go to html and back, then peel off extra wrappers
                    // Note that we always prefix with some dummy text, because otherwise, IE<9 will strip out leading comment nodes in descendants. Total madness.
                    var markup = "ignored<div>" + wrap[1] + html + wrap[2] + "</div>";
                    if (typeof window['innerShiv'] == "function") {
                        div.appendChild(window['innerShiv'](markup));
                    } else {
                        div.innerHTML = markup;
                    }

                    // Move to the right depth
                    while (wrap[0]--)
                        div = div.lastChild;

                    return ko.utils.makeArray(div.lastChild.childNodes);
                }

                function jQueryHtmlParse(html) {
                    // jQuery's "parseHTML" function was introduced in jQuery 1.8.0 and is a documented public API.
                    if (jQueryInstance['parseHTML']) {
                        return jQueryInstance['parseHTML'](html) || []; // Ensure we always return an array and never null
                    } else {
                        // For jQuery < 1.8.0, we fall back on the undocumented internal "clean" function.
                        var elems = jQueryInstance['clean']([html]);

                        // As of jQuery 1.7.1, jQuery parses the HTML by appending it to some dummy parent nodes held in an in-memory document fragment.
                        // Unfortunately, it never clears the dummy parent nodes from the document fragment, so it leaks memory over time.
                        // Fix this by finding the top-most dummy parent element, and detaching it from its owner fragment.
                        if (elems && elems[0]) {
                            // Find the top-most parent element that's a direct child of a document fragment
                            var elem = elems[0];
                            while (elem.parentNode && elem.parentNode.nodeType !== 11 /* i.e., DocumentFragment */)
                                elem = elem.parentNode;
                            // ... then detach it
                            if (elem.parentNode)
                                elem.parentNode.removeChild(elem);
                        }

                        return elems;
                    }
                }

                ko.utils.parseHtmlFragment = function (html) {
                    return jQueryInstance ? jQueryHtmlParse(html)   // As below, benefit from jQuery's optimisations where possible
                                          : simpleHtmlParse(html);  // ... otherwise, this simple logic will do in most common cases.
                };

                ko.utils.setHtml = function (node, html) {
                    ko.utils.emptyDomNode(node);

                    // There's no legitimate reason to display a stringified observable without unwrapping it, so we'll unwrap it
                    html = ko.utils.unwrapObservable(html);

                    if ((html !== null) && (html !== undefined)) {
                        if (typeof html != 'string')
                            html = html.toString();

                        // jQuery contains a lot of sophisticated code to parse arbitrary HTML fragments,
                        // for example <tr> elements which are not normally allowed to exist on their own.
                        // If you've referenced jQuery we'll use that rather than duplicating its code.
                        if (jQueryInstance) {
                            jQueryInstance(node)['html'](html);
                        } else {
                            // ... otherwise, use KO's own parsing logic.
                            var parsedNodes = ko.utils.parseHtmlFragment(html);
                            for (var i = 0; i < parsedNodes.length; i++)
                                node.appendChild(parsedNodes[i]);
                        }
                    }
                };
            })();

            ko.exportSymbol('utils.parseHtmlFragment', ko.utils.parseHtmlFragment);
            ko.exportSymbol('utils.setHtml', ko.utils.setHtml);

            ko.memoization = (function () {
                var memos = {};

                function randomMax8HexChars() {
                    return (((1 + Math.random()) * 0x100000000) | 0).toString(16).substring(1);
                }
                function generateRandomId() {
                    return randomMax8HexChars() + randomMax8HexChars();
                }
                function findMemoNodes(rootNode, appendToArray) {
                    if (!rootNode)
                        return;
                    if (rootNode.nodeType == 8) {
                        var memoId = ko.memoization.parseMemoText(rootNode.nodeValue);
                        if (memoId != null)
                            appendToArray.push({ domNode: rootNode, memoId: memoId });
                    } else if (rootNode.nodeType == 1) {
                        for (var i = 0, childNodes = rootNode.childNodes, j = childNodes.length; i < j; i++)
                            findMemoNodes(childNodes[i], appendToArray);
                    }
                }

                return {
                    memoize: function (callback) {
                        if (typeof callback != "function")
                            throw new Error("You can only pass a function to ko.memoization.memoize()");
                        var memoId = generateRandomId();
                        memos[memoId] = callback;
                        return "<!--[ko_memo:" + memoId + "]-->";
                    },

                    unmemoize: function (memoId, callbackParams) {
                        var callback = memos[memoId];
                        if (callback === undefined)
                            throw new Error("Couldn't find any memo with ID " + memoId + ". Perhaps it's already been unmemoized.");
                        try {
                            callback.apply(null, callbackParams || []);
                            return true;
                        }
                        finally { delete memos[memoId]; }
                    },

                    unmemoizeDomNodeAndDescendants: function (domNode, extraCallbackParamsArray) {
                        var memos = [];
                        findMemoNodes(domNode, memos);
                        for (var i = 0, j = memos.length; i < j; i++) {
                            var node = memos[i].domNode;
                            var combinedParams = [node];
                            if (extraCallbackParamsArray)
                                ko.utils.arrayPushAll(combinedParams, extraCallbackParamsArray);
                            ko.memoization.unmemoize(memos[i].memoId, combinedParams);
                            node.nodeValue = ""; // Neuter this node so we don't try to unmemoize it again
                            if (node.parentNode)
                                node.parentNode.removeChild(node); // If possible, erase it totally (not always possible - someone else might just hold a reference to it then call unmemoizeDomNodeAndDescendants again)
                        }
                    },

                    parseMemoText: function (memoText) {
                        var match = memoText.match(/^\[ko_memo\:(.*?)\]$/);
                        return match ? match[1] : null;
                    }
                };
            })();

            ko.exportSymbol('memoization', ko.memoization);
            ko.exportSymbol('memoization.memoize', ko.memoization.memoize);
            ko.exportSymbol('memoization.unmemoize', ko.memoization.unmemoize);
            ko.exportSymbol('memoization.parseMemoText', ko.memoization.parseMemoText);
            ko.exportSymbol('memoization.unmemoizeDomNodeAndDescendants', ko.memoization.unmemoizeDomNodeAndDescendants);
            ko.extenders = {
                'throttle': function (target, timeout) {
                    // Throttling means two things:

                    // (1) For dependent observables, we throttle *evaluations* so that, no matter how fast its dependencies
                    //     notify updates, the target doesn't re-evaluate (and hence doesn't notify) faster than a certain rate
                    target['throttleEvaluation'] = timeout;

                    // (2) For writable targets (observables, or writable dependent observables), we throttle *writes*
                    //     so the target cannot change value synchronously or faster than a certain rate
                    var writeTimeoutInstance = null;
                    return ko.dependentObservable({
                        'read': target,
                        'write': function (value) {
                            clearTimeout(writeTimeoutInstance);
                            writeTimeoutInstance = setTimeout(function () {
                                target(value);
                            }, timeout);
                        }
                    });
                },

                'rateLimit': function (target, options) {
                    var timeout, method, limitFunction;

                    if (typeof options == 'number') {
                        timeout = options;
                    } else {
                        timeout = options['timeout'];
                        method = options['method'];
                    }

                    limitFunction = method == 'notifyWhenChangesStop' ? debounce : throttle;
                    target.limit(function (callback) {
                        return limitFunction(callback, timeout);
                    });
                },

                'notify': function (target, notifyWhen) {
                    target["equalityComparer"] = notifyWhen == "always" ?
                        null :  // null equalityComparer means to always notify
                        valuesArePrimitiveAndEqual;
                }
            };

            var primitiveTypes = { 'undefined': 1, 'boolean': 1, 'number': 1, 'string': 1 };
            function valuesArePrimitiveAndEqual(a, b) {
                var oldValueIsPrimitive = (a === null) || (typeof (a) in primitiveTypes);
                return oldValueIsPrimitive ? (a === b) : false;
            }

            function throttle(callback, timeout) {
                var timeoutInstance;
                return function () {
                    if (!timeoutInstance) {
                        timeoutInstance = setTimeout(function () {
                            timeoutInstance = undefined;
                            callback();
                        }, timeout);
                    }
                };
            }

            function debounce(callback, timeout) {
                var timeoutInstance;
                return function () {
                    clearTimeout(timeoutInstance);
                    timeoutInstance = setTimeout(callback, timeout);
                };
            }

            function applyExtenders(requestedExtenders) {
                var target = this;
                if (requestedExtenders) {
                    ko.utils.objectForEach(requestedExtenders, function (key, value) {
                        var extenderHandler = ko.extenders[key];
                        if (typeof extenderHandler == 'function') {
                            target = extenderHandler(target, value) || target;
                        }
                    });
                }
                return target;
            }

            ko.exportSymbol('extenders', ko.extenders);

            ko.subscription = function (target, callback, disposeCallback) {
                this.target = target;
                this.callback = callback;
                this.disposeCallback = disposeCallback;
                this.isDisposed = false;
                ko.exportProperty(this, 'dispose', this.dispose);
            };
            ko.subscription.prototype.dispose = function () {
                this.isDisposed = true;
                this.disposeCallback();
            };

            ko.subscribable = function () {
                ko.utils.setPrototypeOfOrExtend(this, ko.subscribable['fn']);
                this._subscriptions = {};
            }

            var defaultEvent = "change";

            var ko_subscribable_fn = {
                subscribe: function (callback, callbackTarget, event) {
                    var self = this;

                    event = event || defaultEvent;
                    var boundCallback = callbackTarget ? callback.bind(callbackTarget) : callback;

                    var subscription = new ko.subscription(self, boundCallback, function () {
                        ko.utils.arrayRemoveItem(self._subscriptions[event], subscription);
                        if (self.afterSubscriptionRemove)
                            self.afterSubscriptionRemove(event);
                    });

                    if (self.beforeSubscriptionAdd)
                        self.beforeSubscriptionAdd(event);

                    if (!self._subscriptions[event])
                        self._subscriptions[event] = [];
                    self._subscriptions[event].push(subscription);

                    return subscription;
                },

                "notifySubscribers": function (valueToNotify, event) {
                    event = event || defaultEvent;
                    if (this.hasSubscriptionsForEvent(event)) {
                        try {
                            ko.dependencyDetection.begin(); // Begin suppressing dependency detection (by setting the top frame to undefined)
                            for (var a = this._subscriptions[event].slice(0), i = 0, subscription; subscription = a[i]; ++i) {
                                // In case a subscription was disposed during the arrayForEach cycle, check
                                // for isDisposed on each subscription before invoking its callback
                                if (!subscription.isDisposed)
                                    subscription.callback(valueToNotify);
                            }
                        } finally {
                            ko.dependencyDetection.end(); // End suppressing dependency detection
                        }
                    }
                },

                limit: function (limitFunction) {
                    var self = this, selfIsObservable = ko.isObservable(self),
                        isPending, previousValue, pendingValue, beforeChange = 'beforeChange';

                    if (!self._origNotifySubscribers) {
                        self._origNotifySubscribers = self["notifySubscribers"];
                        self["notifySubscribers"] = function (value, event) {
                            if (!event || event === defaultEvent) {
                                self._rateLimitedChange(value);
                            } else if (event === beforeChange) {
                                self._rateLimitedBeforeChange(value);
                            } else {
                                self._origNotifySubscribers(value, event);
                            }
                        };
                    }

                    var finish = limitFunction(function () {
                        // If an observable provided a reference to itself, access it to get the latest value.
                        // This allows computed observables to delay calculating their value until needed.
                        if (selfIsObservable && pendingValue === self) {
                            pendingValue = self();
                        }
                        isPending = false;
                        if (self.isDifferent(previousValue, pendingValue)) {
                            self._origNotifySubscribers(previousValue = pendingValue);
                        }
                    });

                    self._rateLimitedChange = function (value) {
                        isPending = true;
                        pendingValue = value;
                        finish();
                    };
                    self._rateLimitedBeforeChange = function (value) {
                        if (!isPending) {
                            previousValue = value;
                            self._origNotifySubscribers(value, beforeChange);
                        }
                    };
                },

                hasSubscriptionsForEvent: function (event) {
                    return this._subscriptions[event] && this._subscriptions[event].length;
                },

                getSubscriptionsCount: function () {
                    var total = 0;
                    ko.utils.objectForEach(this._subscriptions, function (eventName, subscriptions) {
                        total += subscriptions.length;
                    });
                    return total;
                },

                isDifferent: function (oldValue, newValue) {
                    return !this['equalityComparer'] || !this['equalityComparer'](oldValue, newValue);
                },

                extend: applyExtenders
            };

            ko.exportProperty(ko_subscribable_fn, 'subscribe', ko_subscribable_fn.subscribe);
            ko.exportProperty(ko_subscribable_fn, 'extend', ko_subscribable_fn.extend);
            ko.exportProperty(ko_subscribable_fn, 'getSubscriptionsCount', ko_subscribable_fn.getSubscriptionsCount);

            // For browsers that support proto assignment, we overwrite the prototype of each
            // observable instance. Since observables are functions, we need Function.prototype
            // to still be in the prototype chain.
            if (ko.utils.canSetPrototype) {
                ko.utils.setPrototypeOf(ko_subscribable_fn, Function.prototype);
            }

            ko.subscribable['fn'] = ko_subscribable_fn;


            ko.isSubscribable = function (instance) {
                return instance != null && typeof instance.subscribe == "function" && typeof instance["notifySubscribers"] == "function";
            };

            ko.exportSymbol('subscribable', ko.subscribable);
            ko.exportSymbol('isSubscribable', ko.isSubscribable);

            ko.computedContext = ko.dependencyDetection = (function () {
                var outerFrames = [],
                    currentFrame,
                    lastId = 0;

                // Return a unique ID that can be assigned to an observable for dependency tracking.
                // Theoretically, you could eventually overflow the number storage size, resulting
                // in duplicate IDs. But in JavaScript, the largest exact integral value is 2^53
                // or 9,007,199,254,740,992. If you created 1,000,000 IDs per second, it would
                // take over 285 years to reach that number.
                // Reference http://blog.vjeux.com/2010/javascript/javascript-max_int-number-limits.html
                function getId() {
                    return ++lastId;
                }

                function begin(options) {
                    outerFrames.push(currentFrame);
                    currentFrame = options;
                }

                function end() {
                    currentFrame = outerFrames.pop();
                }

                return {
                    begin: begin,

                    end: end,

                    registerDependency: function (subscribable) {
                        if (currentFrame) {
                            if (!ko.isSubscribable(subscribable))
                                throw new Error("Only subscribable things can act as dependencies");
                            currentFrame.callback(subscribable, subscribable._id || (subscribable._id = getId()));
                        }
                    },

                    ignore: function (callback, callbackTarget, callbackArgs) {
                        try {
                            begin();
                            return callback.apply(callbackTarget, callbackArgs || []);
                        } finally {
                            end();
                        }
                    },

                    getDependenciesCount: function () {
                        if (currentFrame)
                            return currentFrame.computed.getDependenciesCount();
                    },

                    isInitial: function () {
                        if (currentFrame)
                            return currentFrame.isInitial;
                    }
                };
            })();

            ko.exportSymbol('computedContext', ko.computedContext);
            ko.exportSymbol('computedContext.getDependenciesCount', ko.computedContext.getDependenciesCount);
            ko.exportSymbol('computedContext.isInitial', ko.computedContext.isInitial);
            ko.exportSymbol('computedContext.isSleeping', ko.computedContext.isSleeping);
            ko.observable = function (initialValue) {
                var _latestValue = initialValue;

                function observable() {
                    if (arguments.length > 0) {
                        // Write

                        // Ignore writes if the value hasn't changed
                        if (observable.isDifferent(_latestValue, arguments[0])) {
                            observable.valueWillMutate();
                            _latestValue = arguments[0];
                            if (DEBUG) observable._latestValue = _latestValue;
                            observable.valueHasMutated();
                        }
                        return this; // Permits chained assignments
                    }
                    else {
                        // Read
                        ko.dependencyDetection.registerDependency(observable); // The caller only needs to be notified of changes if they did a "read" operation
                        return _latestValue;
                    }
                }
                ko.subscribable.call(observable);
                ko.utils.setPrototypeOfOrExtend(observable, ko.observable['fn']);

                if (DEBUG) observable._latestValue = _latestValue;
                observable.peek = function () { return _latestValue };
                observable.valueHasMutated = function () { observable["notifySubscribers"](_latestValue); }
                observable.valueWillMutate = function () { observable["notifySubscribers"](_latestValue, "beforeChange"); }

                ko.exportProperty(observable, 'peek', observable.peek);
                ko.exportProperty(observable, "valueHasMutated", observable.valueHasMutated);
                ko.exportProperty(observable, "valueWillMutate", observable.valueWillMutate);

                return observable;
            }

            ko.observable['fn'] = {
                "equalityComparer": valuesArePrimitiveAndEqual
            };

            var protoProperty = ko.observable.protoProperty = "__ko_proto__";
            ko.observable['fn'][protoProperty] = ko.observable;

            // Note that for browsers that don't support proto assignment, the
            // inheritance chain is created manually in the ko.observable constructor
            if (ko.utils.canSetPrototype) {
                ko.utils.setPrototypeOf(ko.observable['fn'], ko.subscribable['fn']);
            }

            ko.hasPrototype = function (instance, prototype) {
                if ((instance === null) || (instance === undefined) || (instance[protoProperty] === undefined)) return false;
                if (instance[protoProperty] === prototype) return true;
                return ko.hasPrototype(instance[protoProperty], prototype); // Walk the prototype chain
            };

            ko.isObservable = function (instance) {
                return ko.hasPrototype(instance, ko.observable);
            }
            ko.isWriteableObservable = function (instance) {
                // Observable
                if ((typeof instance == "function") && instance[protoProperty] === ko.observable)
                    return true;
                // Writeable dependent observable
                if ((typeof instance == "function") && (instance[protoProperty] === ko.dependentObservable) && (instance.hasWriteFunction))
                    return true;
                // Anything else
                return false;
            }


            ko.exportSymbol('observable', ko.observable);
            ko.exportSymbol('isObservable', ko.isObservable);
            ko.exportSymbol('isWriteableObservable', ko.isWriteableObservable);
            ko.exportSymbol('isWritableObservable', ko.isWriteableObservable);
            ko.observableArray = function (initialValues) {
                initialValues = initialValues || [];

                if (typeof initialValues != 'object' || !('length' in initialValues))
                    throw new Error("The argument passed when initializing an observable array must be an array, or null, or undefined.");

                var result = ko.observable(initialValues);
                ko.utils.setPrototypeOfOrExtend(result, ko.observableArray['fn']);
                return result.extend({ 'trackArrayChanges': true });
            };

            ko.observableArray['fn'] = {
                'remove': function (valueOrPredicate) {
                    var underlyingArray = this.peek();
                    var removedValues = [];
                    var predicate = typeof valueOrPredicate == "function" && !ko.isObservable(valueOrPredicate) ? valueOrPredicate : function (value) { return value === valueOrPredicate; };
                    for (var i = 0; i < underlyingArray.length; i++) {
                        var value = underlyingArray[i];
                        if (predicate(value)) {
                            if (removedValues.length === 0) {
                                this.valueWillMutate();
                            }
                            removedValues.push(value);
                            underlyingArray.splice(i, 1);
                            i--;
                        }
                    }
                    if (removedValues.length) {
                        this.valueHasMutated();
                    }
                    return removedValues;
                },

                'removeAll': function (arrayOfValues) {
                    // If you passed zero args, we remove everything
                    if (arrayOfValues === undefined) {
                        var underlyingArray = this.peek();
                        var allValues = underlyingArray.slice(0);
                        this.valueWillMutate();
                        underlyingArray.splice(0, underlyingArray.length);
                        this.valueHasMutated();
                        return allValues;
                    }
                    // If you passed an arg, we interpret it as an array of entries to remove
                    if (!arrayOfValues)
                        return [];
                    return this['remove'](function (value) {
                        return ko.utils.arrayIndexOf(arrayOfValues, value) >= 0;
                    });
                },

                'destroy': function (valueOrPredicate) {
                    var underlyingArray = this.peek();
                    var predicate = typeof valueOrPredicate == "function" && !ko.isObservable(valueOrPredicate) ? valueOrPredicate : function (value) { return value === valueOrPredicate; };
                    this.valueWillMutate();
                    for (var i = underlyingArray.length - 1; i >= 0; i--) {
                        var value = underlyingArray[i];
                        if (predicate(value))
                            underlyingArray[i]["_destroy"] = true;
                    }
                    this.valueHasMutated();
                },

                'destroyAll': function (arrayOfValues) {
                    // If you passed zero args, we destroy everything
                    if (arrayOfValues === undefined)
                        return this['destroy'](function () { return true });

                    // If you passed an arg, we interpret it as an array of entries to destroy
                    if (!arrayOfValues)
                        return [];
                    return this['destroy'](function (value) {
                        return ko.utils.arrayIndexOf(arrayOfValues, value) >= 0;
                    });
                },

                'indexOf': function (item) {
                    var underlyingArray = this();
                    return ko.utils.arrayIndexOf(underlyingArray, item);
                },

                'replace': function (oldItem, newItem) {
                    var index = this['indexOf'](oldItem);
                    if (index >= 0) {
                        this.valueWillMutate();
                        this.peek()[index] = newItem;
                        this.valueHasMutated();
                    }
                }
            };

            // Populate ko.observableArray.fn with read/write functions from native arrays
            // Important: Do not add any additional functions here that may reasonably be used to *read* data from the array
            // because we'll eval them without causing subscriptions, so ko.computed output could end up getting stale
            ko.utils.arrayForEach(["pop", "push", "reverse", "shift", "sort", "splice", "unshift"], function (methodName) {
                ko.observableArray['fn'][methodName] = function () {
                    // Use "peek" to avoid creating a subscription in any computed that we're executing in the context of
                    // (for consistency with mutating regular observables)
                    var underlyingArray = this.peek();
                    this.valueWillMutate();
                    this.cacheDiffForKnownOperation(underlyingArray, methodName, arguments);
                    var methodCallResult = underlyingArray[methodName].apply(underlyingArray, arguments);
                    this.valueHasMutated();
                    return methodCallResult;
                };
            });

            // Populate ko.observableArray.fn with read-only functions from native arrays
            ko.utils.arrayForEach(["slice"], function (methodName) {
                ko.observableArray['fn'][methodName] = function () {
                    var underlyingArray = this();
                    return underlyingArray[methodName].apply(underlyingArray, arguments);
                };
            });

            // Note that for browsers that don't support proto assignment, the
            // inheritance chain is created manually in the ko.observableArray constructor
            if (ko.utils.canSetPrototype) {
                ko.utils.setPrototypeOf(ko.observableArray['fn'], ko.observable['fn']);
            }

            ko.exportSymbol('observableArray', ko.observableArray);
            var arrayChangeEventName = 'arrayChange';
            ko.extenders['trackArrayChanges'] = function (target) {
                // Only modify the target observable once
                if (target.cacheDiffForKnownOperation) {
                    return;
                }
                var trackingChanges = false,
                    cachedDiff = null,
                    pendingNotifications = 0,
                    underlyingSubscribeFunction = target.subscribe;

                // Intercept "subscribe" calls, and for array change events, ensure change tracking is enabled
                target.subscribe = target['subscribe'] = function (callback, callbackTarget, event) {
                    if (event === arrayChangeEventName) {
                        trackChanges();
                    }
                    return underlyingSubscribeFunction.apply(this, arguments);
                };

                function trackChanges() {
                    // Calling 'trackChanges' multiple times is the same as calling it once
                    if (trackingChanges) {
                        return;
                    }

                    trackingChanges = true;

                    // Intercept "notifySubscribers" to track how many times it was called.
                    var underlyingNotifySubscribersFunction = target['notifySubscribers'];
                    target['notifySubscribers'] = function (valueToNotify, event) {
                        if (!event || event === defaultEvent) {
                            ++pendingNotifications;
                        }
                        return underlyingNotifySubscribersFunction.apply(this, arguments);
                    };

                    // Each time the array changes value, capture a clone so that on the next
                    // change it's possible to produce a diff
                    var previousContents = [].concat(target.peek() || []);
                    cachedDiff = null;
                    target.subscribe(function (currentContents) {
                        // Make a copy of the current contents and ensure it's an array
                        currentContents = [].concat(currentContents || []);

                        // Compute the diff and issue notifications, but only if someone is listening
                        if (target.hasSubscriptionsForEvent(arrayChangeEventName)) {
                            var changes = getChanges(previousContents, currentContents);
                            if (changes.length) {
                                target['notifySubscribers'](changes, arrayChangeEventName);
                            }
                        }

                        // Eliminate references to the old, removed items, so they can be GCed
                        previousContents = currentContents;
                        cachedDiff = null;
                        pendingNotifications = 0;
                    });
                }

                function getChanges(previousContents, currentContents) {
                    // We try to re-use cached diffs.
                    // The scenarios where pendingNotifications > 1 are when using rate-limiting or the Deferred Updates
                    // plugin, which without this check would not be compatible with arrayChange notifications. Normally,
                    // notifications are issued immediately so we wouldn't be queueing up more than one.
                    if (!cachedDiff || pendingNotifications > 1) {
                        cachedDiff = ko.utils.compareArrays(previousContents, currentContents, { 'sparse': true });
                    }

                    return cachedDiff;
                }

                target.cacheDiffForKnownOperation = function (rawArray, operationName, args) {
                    // Only run if we're currently tracking changes for this observable array
                    // and there aren't any pending deferred notifications.
                    if (!trackingChanges || pendingNotifications) {
                        return;
                    }
                    var diff = [],
                        arrayLength = rawArray.length,
                        argsLength = args.length,
                        offset = 0;

                    function pushDiff(status, value, index) {
                        return diff[diff.length] = { 'status': status, 'value': value, 'index': index };
                    }
                    switch (operationName) {
                        case 'push':
                            offset = arrayLength;
                        case 'unshift':
                            for (var index = 0; index < argsLength; index++) {
                                pushDiff('added', args[index], offset + index);
                            }
                            break;

                        case 'pop':
                            offset = arrayLength - 1;
                        case 'shift':
                            if (arrayLength) {
                                pushDiff('deleted', rawArray[offset], offset);
                            }
                            break;

                        case 'splice':
                            // Negative start index means 'from end of array'. After that we clamp to [0...arrayLength].
                            // See https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/splice
                            var startIndex = Math.min(Math.max(0, args[0] < 0 ? arrayLength + args[0] : args[0]), arrayLength),
                                endDeleteIndex = argsLength === 1 ? arrayLength : Math.min(startIndex + (args[1] || 0), arrayLength),
                                endAddIndex = startIndex + argsLength - 2,
                                endIndex = Math.max(endDeleteIndex, endAddIndex),
                                additions = [], deletions = [];
                            for (var index = startIndex, argsIndex = 2; index < endIndex; ++index, ++argsIndex) {
                                if (index < endDeleteIndex)
                                    deletions.push(pushDiff('deleted', rawArray[index], index));
                                if (index < endAddIndex)
                                    additions.push(pushDiff('added', args[argsIndex], index));
                            }
                            ko.utils.findMovesInArrayComparison(deletions, additions);
                            break;

                        default:
                            return;
                    }
                    cachedDiff = diff;
                };
            };
            ko.computed = ko.dependentObservable = function (evaluatorFunctionOrOptions, evaluatorFunctionTarget, options) {
                var _latestValue,
                    _needsEvaluation = true,
                    _isBeingEvaluated = false,
                    _suppressDisposalUntilDisposeWhenReturnsFalse = false,
                    _isDisposed = false,
                    readFunction = evaluatorFunctionOrOptions,
                    pure = false,
                    isSleeping = false;

                if (readFunction && typeof readFunction == "object") {
                    // Single-parameter syntax - everything is on this "options" param
                    options = readFunction;
                    readFunction = options["read"];
                } else {
                    // Multi-parameter syntax - construct the options according to the params passed
                    options = options || {};
                    if (!readFunction)
                        readFunction = options["read"];
                }
                if (typeof readFunction != "function")
                    throw new Error("Pass a function that returns the value of the ko.computed");

                function addSubscriptionToDependency(subscribable, id) {
                    if (!_subscriptionsToDependencies[id]) {
                        _subscriptionsToDependencies[id] = subscribable.subscribe(evaluatePossiblyAsync);
                        ++_dependenciesCount;
                    }
                }

                function disposeAllSubscriptionsToDependencies() {
                    ko.utils.objectForEach(_subscriptionsToDependencies, function (id, subscription) {
                        subscription.dispose();
                    });
                    _subscriptionsToDependencies = {};
                }

                function disposeComputed() {
                    disposeAllSubscriptionsToDependencies();
                    _dependenciesCount = 0;
                    _isDisposed = true;
                    _needsEvaluation = false;
                }

                function evaluatePossiblyAsync() {
                    var throttleEvaluationTimeout = dependentObservable['throttleEvaluation'];
                    if (throttleEvaluationTimeout && throttleEvaluationTimeout >= 0) {
                        clearTimeout(evaluationTimeoutInstance);
                        evaluationTimeoutInstance = setTimeout(evaluateImmediate, throttleEvaluationTimeout);
                    } else if (dependentObservable._evalRateLimited) {
                        dependentObservable._evalRateLimited();
                    } else {
                        evaluateImmediate();
                    }
                }

                function evaluateImmediate(suppressChangeNotification) {
                    if (_isBeingEvaluated) {
                        if (pure) {
                            throw Error("A 'pure' computed must not be called recursively");
                        }
                        // If the evaluation of a ko.computed causes side effects, it's possible that it will trigger its own re-evaluation.
                        // This is not desirable (it's hard for a developer to realise a chain of dependencies might cause this, and they almost
                        // certainly didn't intend infinite re-evaluations). So, for predictability, we simply prevent ko.computeds from causing
                        // their own re-evaluation. Further discussion at https://github.com/SteveSanderson/knockout/pull/387
                        return;
                    }

                    // Do not evaluate (and possibly capture new dependencies) if disposed
                    if (_isDisposed) {
                        return;
                    }

                    if (disposeWhen && disposeWhen()) {
                        // See comment below about _suppressDisposalUntilDisposeWhenReturnsFalse
                        if (!_suppressDisposalUntilDisposeWhenReturnsFalse) {
                            dispose();
                            return;
                        }
                    } else {
                        // It just did return false, so we can stop suppressing now
                        _suppressDisposalUntilDisposeWhenReturnsFalse = false;
                    }

                    _isBeingEvaluated = true;

                    // When sleeping, recalculate the value and return.
                    if (isSleeping) {
                        try {
                            var dependencyTracking = {};
                            ko.dependencyDetection.begin({
                                callback: function (subscribable, id) {
                                    if (!dependencyTracking[id]) {
                                        dependencyTracking[id] = 1;
                                        ++_dependenciesCount;
                                    }
                                },
                                computed: dependentObservable,
                                isInitial: undefined
                            });
                            _dependenciesCount = 0;
                            _latestValue = readFunction.call(evaluatorFunctionTarget);
                        } finally {
                            ko.dependencyDetection.end();
                            _isBeingEvaluated = false;
                        }
                    } else {
                        try {
                            // Initially, we assume that none of the subscriptions are still being used (i.e., all are candidates for disposal).
                            // Then, during evaluation, we cross off any that are in fact still being used.
                            var disposalCandidates = _subscriptionsToDependencies, disposalCount = _dependenciesCount;
                            ko.dependencyDetection.begin({
                                callback: function (subscribable, id) {
                                    if (!_isDisposed) {
                                        if (disposalCount && disposalCandidates[id]) {
                                            // Don't want to dispose this subscription, as it's still being used
                                            _subscriptionsToDependencies[id] = disposalCandidates[id];
                                            ++_dependenciesCount;
                                            delete disposalCandidates[id];
                                            --disposalCount;
                                        } else {
                                            // Brand new subscription - add it
                                            addSubscriptionToDependency(subscribable, id);
                                        }
                                    }
                                },
                                computed: dependentObservable,
                                isInitial: pure ? undefined : !_dependenciesCount        // If we're evaluating when there are no previous dependencies, it must be the first time
                            });

                            _subscriptionsToDependencies = {};
                            _dependenciesCount = 0;

                            try {
                                var newValue = evaluatorFunctionTarget ? readFunction.call(evaluatorFunctionTarget) : readFunction();

                            } finally {
                                ko.dependencyDetection.end();

                                // For each subscription no longer being used, remove it from the active subscriptions list and dispose it
                                if (disposalCount) {
                                    ko.utils.objectForEach(disposalCandidates, function (id, toDispose) {
                                        toDispose.dispose();
                                    });
                                }

                                _needsEvaluation = false;
                            }

                            if (dependentObservable.isDifferent(_latestValue, newValue)) {
                                dependentObservable["notifySubscribers"](_latestValue, "beforeChange");

                                _latestValue = newValue;
                                if (DEBUG) dependentObservable._latestValue = _latestValue;

                                if (suppressChangeNotification !== true) {  // Check for strict true value since setTimeout in Firefox passes a numeric value to the function
                                    dependentObservable["notifySubscribers"](_latestValue);
                                }
                            }
                        } finally {
                            _isBeingEvaluated = false;
                        }
                    }

                    if (!_dependenciesCount)
                        dispose();
                }

                function dependentObservable() {
                    if (arguments.length > 0) {
                        if (typeof writeFunction === "function") {
                            // Writing a value
                            writeFunction.apply(evaluatorFunctionTarget, arguments);
                        } else {
                            throw new Error("Cannot write a value to a ko.computed unless you specify a 'write' option. If you wish to read the current value, don't pass any parameters.");
                        }
                        return this; // Permits chained assignments
                    } else {
                        // Reading the value
                        ko.dependencyDetection.registerDependency(dependentObservable);
                        if (_needsEvaluation)
                            evaluateImmediate(true /* suppressChangeNotification */);
                        return _latestValue;
                    }
                }

                function peek() {
                    // Peek won't re-evaluate, except to get the initial value when "deferEvaluation" is set, or while the computed is sleeping.
                    // Those are the only times that both of these conditions will be satisfied.
                    if (_needsEvaluation && !_dependenciesCount)
                        evaluateImmediate(true /* suppressChangeNotification */);
                    return _latestValue;
                }

                function isActive() {
                    return _needsEvaluation || _dependenciesCount > 0;
                }

                // By here, "options" is always non-null
                var writeFunction = options["write"],
                    disposeWhenNodeIsRemoved = options["disposeWhenNodeIsRemoved"] || options.disposeWhenNodeIsRemoved || null,
                    disposeWhenOption = options["disposeWhen"] || options.disposeWhen,
                    disposeWhen = disposeWhenOption,
                    dispose = disposeComputed,
                    _subscriptionsToDependencies = {},
                    _dependenciesCount = 0,
                    evaluationTimeoutInstance = null;

                if (!evaluatorFunctionTarget)
                    evaluatorFunctionTarget = options["owner"];

                ko.subscribable.call(dependentObservable);
                ko.utils.setPrototypeOfOrExtend(dependentObservable, ko.dependentObservable['fn']);

                dependentObservable.peek = peek;
                dependentObservable.getDependenciesCount = function () { return _dependenciesCount; };
                dependentObservable.hasWriteFunction = typeof options["write"] === "function";
                dependentObservable.dispose = function () { dispose(); };
                dependentObservable.isActive = isActive;

                // Replace the limit function with one that delays evaluation as well.
                var originalLimit = dependentObservable.limit;
                dependentObservable.limit = function (limitFunction) {
                    originalLimit.call(dependentObservable, limitFunction);
                    dependentObservable._evalRateLimited = function () {
                        dependentObservable._rateLimitedBeforeChange(_latestValue);

                        _needsEvaluation = true;    // Mark as dirty

                        // Pass the observable to the rate-limit code, which will access it when
                        // it's time to do the notification.
                        dependentObservable._rateLimitedChange(dependentObservable);
                    }
                };

                if (options['pure']) {
                    pure = true;
                    isSleeping = true;     // Starts off sleeping; will awake on the first subscription
                    dependentObservable.beforeSubscriptionAdd = function () {
                        // If asleep, wake up the computed and evaluate to register any dependencies.
                        if (isSleeping) {
                            isSleeping = false;
                            evaluateImmediate(true /* suppressChangeNotification */);
                        }
                    }
                    dependentObservable.afterSubscriptionRemove = function () {
                        if (!dependentObservable.getSubscriptionsCount()) {
                            disposeAllSubscriptionsToDependencies();
                            isSleeping = _needsEvaluation = true;
                        }
                    }
                } else if (options['deferEvaluation']) {
                    // This will force a computed with deferEvaluation to evaluate when the first subscriptions is registered.
                    dependentObservable.beforeSubscriptionAdd = function () {
                        peek();
                        delete dependentObservable.beforeSubscriptionAdd;
                    }
                }

                ko.exportProperty(dependentObservable, 'peek', dependentObservable.peek);
                ko.exportProperty(dependentObservable, 'dispose', dependentObservable.dispose);
                ko.exportProperty(dependentObservable, 'isActive', dependentObservable.isActive);
                ko.exportProperty(dependentObservable, 'getDependenciesCount', dependentObservable.getDependenciesCount);

                // Add a "disposeWhen" callback that, on each evaluation, disposes if the node was removed without using ko.removeNode.
                if (disposeWhenNodeIsRemoved) {
                    // Since this computed is associated with a DOM node, and we don't want to dispose the computed
                    // until the DOM node is *removed* from the document (as opposed to never having been in the document),
                    // we'll prevent disposal until "disposeWhen" first returns false.
                    _suppressDisposalUntilDisposeWhenReturnsFalse = true;

                    // Only watch for the node's disposal if the value really is a node. It might not be,
                    // e.g., { disposeWhenNodeIsRemoved: true } can be used to opt into the "only dispose
                    // after first false result" behaviour even if there's no specific node to watch. This
                    // technique is intended for KO's internal use only and shouldn't be documented or used
                    // by application code, as it's likely to change in a future version of KO.
                    if (disposeWhenNodeIsRemoved.nodeType) {
                        disposeWhen = function () {
                            return !ko.utils.domNodeIsAttachedToDocument(disposeWhenNodeIsRemoved) || (disposeWhenOption && disposeWhenOption());
                        };
                    }
                }

                // Evaluate, unless sleeping or deferEvaluation is true
                if (!isSleeping && !options['deferEvaluation'])
                    evaluateImmediate();

                // Attach a DOM node disposal callback so that the computed will be proactively disposed as soon as the node is
                // removed using ko.removeNode. But skip if isActive is false (there will never be any dependencies to dispose).
                if (disposeWhenNodeIsRemoved && isActive() && disposeWhenNodeIsRemoved.nodeType) {
                    dispose = function () {
                        ko.utils.domNodeDisposal.removeDisposeCallback(disposeWhenNodeIsRemoved, dispose);
                        disposeComputed();
                    };
                    ko.utils.domNodeDisposal.addDisposeCallback(disposeWhenNodeIsRemoved, dispose);
                }

                return dependentObservable;
            };

            ko.isComputed = function (instance) {
                return ko.hasPrototype(instance, ko.dependentObservable);
            };

            var protoProp = ko.observable.protoProperty; // == "__ko_proto__"
            ko.dependentObservable[protoProp] = ko.observable;

            ko.dependentObservable['fn'] = {
                "equalityComparer": valuesArePrimitiveAndEqual
            };
            ko.dependentObservable['fn'][protoProp] = ko.dependentObservable;

            // Note that for browsers that don't support proto assignment, the
            // inheritance chain is created manually in the ko.dependentObservable constructor
            if (ko.utils.canSetPrototype) {
                ko.utils.setPrototypeOf(ko.dependentObservable['fn'], ko.subscribable['fn']);
            }

            ko.exportSymbol('dependentObservable', ko.dependentObservable);
            ko.exportSymbol('computed', ko.dependentObservable); // Make "ko.computed" an alias for "ko.dependentObservable"
            ko.exportSymbol('isComputed', ko.isComputed);

            ko.pureComputed = function (evaluatorFunctionOrOptions, evaluatorFunctionTarget) {
                if (typeof evaluatorFunctionOrOptions === 'function') {
                    return ko.computed(evaluatorFunctionOrOptions, evaluatorFunctionTarget, { 'pure': true });
                } else {
                    evaluatorFunctionOrOptions = ko.utils.extend({}, evaluatorFunctionOrOptions);   // make a copy of the parameter object
                    evaluatorFunctionOrOptions['pure'] = true;
                    return ko.computed(evaluatorFunctionOrOptions, evaluatorFunctionTarget);
                }
            }
            ko.exportSymbol('pureComputed', ko.pureComputed);

            (function () {
                var maxNestedObservableDepth = 10; // Escape the (unlikely) pathalogical case where an observable's current value is itself (or similar reference cycle)

                ko.toJS = function (rootObject) {
                    if (arguments.length == 0)
                        throw new Error("When calling ko.toJS, pass the object you want to convert.");

                    // We just unwrap everything at every level in the object graph
                    return mapJsObjectGraph(rootObject, function (valueToMap) {
                        // Loop because an observable's value might in turn be another observable wrapper
                        for (var i = 0; ko.isObservable(valueToMap) && (i < maxNestedObservableDepth) ; i++)
                            valueToMap = valueToMap();
                        return valueToMap;
                    });
                };

                ko.toJSON = function (rootObject, replacer, space) {     // replacer and space are optional
                    var plainJavaScriptObject = ko.toJS(rootObject);
                    return ko.utils.stringifyJson(plainJavaScriptObject, replacer, space);
                };

                function mapJsObjectGraph(rootObject, mapInputCallback, visitedObjects) {
                    visitedObjects = visitedObjects || new objectLookup();

                    rootObject = mapInputCallback(rootObject);
                    var canHaveProperties = (typeof rootObject == "object") && (rootObject !== null) && (rootObject !== undefined) && (!(rootObject instanceof Date)) && (!(rootObject instanceof String)) && (!(rootObject instanceof Number)) && (!(rootObject instanceof Boolean));
                    if (!canHaveProperties)
                        return rootObject;

                    var outputProperties = rootObject instanceof Array ? [] : {};
                    visitedObjects.save(rootObject, outputProperties);

                    visitPropertiesOrArrayEntries(rootObject, function (indexer) {
                        var propertyValue = mapInputCallback(rootObject[indexer]);

                        switch (typeof propertyValue) {
                            case "boolean":
                            case "number":
                            case "string":
                            case "function":
                                outputProperties[indexer] = propertyValue;
                                break;
                            case "object":
                            case "undefined":
                                var previouslyMappedValue = visitedObjects.get(propertyValue);
                                outputProperties[indexer] = (previouslyMappedValue !== undefined)
                                    ? previouslyMappedValue
                                    : mapJsObjectGraph(propertyValue, mapInputCallback, visitedObjects);
                                break;
                        }
                    });

                    return outputProperties;
                }

                function visitPropertiesOrArrayEntries(rootObject, visitorCallback) {
                    if (rootObject instanceof Array) {
                        for (var i = 0; i < rootObject.length; i++)
                            visitorCallback(i);

                        // For arrays, also respect toJSON property for custom mappings (fixes #278)
                        if (typeof rootObject['toJSON'] == 'function')
                            visitorCallback('toJSON');
                    } else {
                        for (var propertyName in rootObject) {
                            visitorCallback(propertyName);
                        }
                    }
                };

                function objectLookup() {
                    this.keys = [];
                    this.values = [];
                };

                objectLookup.prototype = {
                    constructor: objectLookup,
                    save: function (key, value) {
                        var existingIndex = ko.utils.arrayIndexOf(this.keys, key);
                        if (existingIndex >= 0)
                            this.values[existingIndex] = value;
                        else {
                            this.keys.push(key);
                            this.values.push(value);
                        }
                    },
                    get: function (key) {
                        var existingIndex = ko.utils.arrayIndexOf(this.keys, key);
                        return (existingIndex >= 0) ? this.values[existingIndex] : undefined;
                    }
                };
            })();

            ko.exportSymbol('toJS', ko.toJS);
            ko.exportSymbol('toJSON', ko.toJSON);
            (function () {
                var hasDomDataExpandoProperty = '__ko__hasDomDataOptionValue__';

                // Normally, SELECT elements and their OPTIONs can only take value of type 'string' (because the values
                // are stored on DOM attributes). ko.selectExtensions provides a way for SELECTs/OPTIONs to have values
                // that are arbitrary objects. This is very convenient when implementing things like cascading dropdowns.
                ko.selectExtensions = {
                    readValue: function (element) {
                        switch (ko.utils.tagNameLower(element)) {
                            case 'option':
                                if (element[hasDomDataExpandoProperty] === true)
                                    return ko.utils.domData.get(element, ko.bindingHandlers.options.optionValueDomDataKey);
                                return ko.utils.ieVersion <= 7
                                    ? (element.getAttributeNode('value') && element.getAttributeNode('value').specified ? element.value : element.text)
                                    : element.value;
                            case 'select':
                                return element.selectedIndex >= 0 ? ko.selectExtensions.readValue(element.options[element.selectedIndex]) : undefined;
                            default:
                                return element.value;
                        }
                    },

                    writeValue: function (element, value, allowUnset) {
                        switch (ko.utils.tagNameLower(element)) {
                            case 'option':
                                switch (typeof value) {
                                    case "string":
                                        ko.utils.domData.set(element, ko.bindingHandlers.options.optionValueDomDataKey, undefined);
                                        if (hasDomDataExpandoProperty in element) { // IE <= 8 throws errors if you delete non-existent properties from a DOM node
                                            delete element[hasDomDataExpandoProperty];
                                        }
                                        element.value = value;
                                        break;
                                    default:
                                        // Store arbitrary object using DomData
                                        ko.utils.domData.set(element, ko.bindingHandlers.options.optionValueDomDataKey, value);
                                        element[hasDomDataExpandoProperty] = true;

                                        // Special treatment of numbers is just for backward compatibility. KO 1.2.1 wrote numerical values to element.value.
                                        element.value = typeof value === "number" ? value : "";
                                        break;
                                }
                                break;
                            case 'select':
                                if (value === "" || value === null)       // A blank string or null value will select the caption
                                    value = undefined;
                                var selection = -1;
                                for (var i = 0, n = element.options.length, optionValue; i < n; ++i) {
                                    optionValue = ko.selectExtensions.readValue(element.options[i]);
                                    // Include special check to handle selecting a caption with a blank string value
                                    if (optionValue == value || (optionValue == "" && value === undefined)) {
                                        selection = i;
                                        break;
                                    }
                                }
                                if (allowUnset || selection >= 0 || (value === undefined && element.size > 1)) {
                                    element.selectedIndex = selection;
                                }
                                break;
                            default:
                                if ((value === null) || (value === undefined))
                                    value = "";
                                element.value = value;
                                break;
                        }
                    }
                };
            })();

            ko.exportSymbol('selectExtensions', ko.selectExtensions);
            ko.exportSymbol('selectExtensions.readValue', ko.selectExtensions.readValue);
            ko.exportSymbol('selectExtensions.writeValue', ko.selectExtensions.writeValue);
            ko.expressionRewriting = (function () {
                var javaScriptReservedWords = ["true", "false", "null", "undefined"];

                // Matches something that can be assigned to--either an isolated identifier or something ending with a property accessor
                // This is designed to be simple and avoid false negatives, but could produce false positives (e.g., a+b.c).
                // This also will not properly handle nested brackets (e.g., obj1[obj2['prop']]; see #911).
                var javaScriptAssignmentTarget = /^(?:[$_a-z][$\w]*|(.+)(\.\s*[$_a-z][$\w]*|\[.+\]))$/i;

                function getWriteableValue(expression) {
                    if (ko.utils.arrayIndexOf(javaScriptReservedWords, expression) >= 0)
                        return false;
                    var match = expression.match(javaScriptAssignmentTarget);
                    return match === null ? false : match[1] ? ('Object(' + match[1] + ')' + match[2]) : expression;
                }

                // The following regular expressions will be used to split an object-literal string into tokens

                // These two match strings, either with double quotes or single quotes
                var stringDouble = '"(?:[^"\\\\]|\\\\.)*"',
                    stringSingle = "'(?:[^'\\\\]|\\\\.)*'",
                    // Matches a regular expression (text enclosed by slashes), but will also match sets of divisions
                    // as a regular expression (this is handled by the parsing loop below).
                    stringRegexp = '/(?:[^/\\\\]|\\\\.)*/\w*',
                    // These characters have special meaning to the parser and must not appear in the middle of a
                    // token, except as part of a string.
                    specials = ',"\'{}()/:[\\]',
                    // Match text (at least two characters) that does not contain any of the above special characters,
                    // although some of the special characters are allowed to start it (all but the colon and comma).
                    // The text can contain spaces, but leading or trailing spaces are skipped.
                    everyThingElse = '[^\\s:,/][^' + specials + ']*[^\\s' + specials + ']',
                    // Match any non-space character not matched already. This will match colons and commas, since they're
                    // not matched by "everyThingElse", but will also match any other single character that wasn't already
                    // matched (for example: in "a: 1, b: 2", each of the non-space characters will be matched by oneNotSpace).
                    oneNotSpace = '[^\\s]',

                    // Create the actual regular expression by or-ing the above strings. The order is important.
                    bindingToken = RegExp(stringDouble + '|' + stringSingle + '|' + stringRegexp + '|' + everyThingElse + '|' + oneNotSpace, 'g'),

                    // Match end of previous token to determine whether a slash is a division or regex.
                    divisionLookBehind = /[\])"'A-Za-z0-9_$]+$/,
                    keywordRegexLookBehind = { 'in': 1, 'return': 1, 'typeof': 1 };

                function parseObjectLiteral(objectLiteralString) {
                    // Trim leading and trailing spaces from the string
                    var str = ko.utils.stringTrim(objectLiteralString);

                    // Trim braces '{' surrounding the whole object literal
                    if (str.charCodeAt(0) === 123) str = str.slice(1, -1);

                    // Split into tokens
                    var result = [], toks = str.match(bindingToken), key, values, depth = 0;

                    if (toks) {
                        // Append a comma so that we don't need a separate code block to deal with the last item
                        toks.push(',');

                        for (var i = 0, tok; tok = toks[i]; ++i) {
                            var c = tok.charCodeAt(0);
                            // A comma signals the end of a key/value pair if depth is zero
                            if (c === 44) { // ","
                                if (depth <= 0) {
                                    if (key)
                                        result.push(values ? { key: key, value: values.join('') } : { 'unknown': key });
                                    key = values = depth = 0;
                                    continue;
                                }
                                // Simply skip the colon that separates the name and value
                            } else if (c === 58) { // ":"
                                if (!values)
                                    continue;
                                // A set of slashes is initially matched as a regular expression, but could be division
                            } else if (c === 47 && i && tok.length > 1) {  // "/"
                                // Look at the end of the previous token to determine if the slash is actually division
                                var match = toks[i - 1].match(divisionLookBehind);
                                if (match && !keywordRegexLookBehind[match[0]]) {
                                    // The slash is actually a division punctuator; re-parse the remainder of the string (not including the slash)
                                    str = str.substr(str.indexOf(tok) + 1);
                                    toks = str.match(bindingToken);
                                    toks.push(',');
                                    i = -1;
                                    // Continue with just the slash
                                    tok = '/';
                                }
                                // Increment depth for parentheses, braces, and brackets so that interior commas are ignored
                            } else if (c === 40 || c === 123 || c === 91) { // '(', '{', '['
                                ++depth;
                            } else if (c === 41 || c === 125 || c === 93) { // ')', '}', ']'
                                --depth;
                                // The key must be a single token; if it's a string, trim the quotes
                            } else if (!key && !values) {
                                key = (c === 34 || c === 39) /* '"', "'" */ ? tok.slice(1, -1) : tok;
                                continue;
                            }
                            if (values)
                                values.push(tok);
                            else
                                values = [tok];
                        }
                    }
                    return result;
                }

                // Two-way bindings include a write function that allow the handler to update the value even if it's not an observable.
                var twoWayBindings = {};

                function preProcessBindings(bindingsStringOrKeyValueArray, bindingOptions) {
                    bindingOptions = bindingOptions || {};

                    function processKeyValue(key, val) {
                        var writableVal;
                        function callPreprocessHook(obj) {
                            return (obj && obj['preprocess']) ? (val = obj['preprocess'](val, key, processKeyValue)) : true;
                        }
                        if (!bindingParams) {
                            if (!callPreprocessHook(ko['getBindingHandler'](key)))
                                return;

                            if (twoWayBindings[key] && (writableVal = getWriteableValue(val))) {
                                // For two-way bindings, provide a write method in case the value
                                // isn't a writable observable.
                                propertyAccessorResultStrings.push("'" + key + "':function(_z){" + writableVal + "=_z}");
                            }
                        }
                        // Values are wrapped in a function so that each value can be accessed independently
                        if (makeValueAccessors) {
                            val = 'function(){return ' + val + ' }';
                        }
                        resultStrings.push("'" + key + "':" + val);
                    }

                    var resultStrings = [],
                        propertyAccessorResultStrings = [],
                        makeValueAccessors = bindingOptions['valueAccessors'],
                        bindingParams = bindingOptions['bindingParams'],
                        keyValueArray = typeof bindingsStringOrKeyValueArray === "string" ?
                            parseObjectLiteral(bindingsStringOrKeyValueArray) : bindingsStringOrKeyValueArray;

                    ko.utils.arrayForEach(keyValueArray, function (keyValue) {
                        processKeyValue(keyValue.key || keyValue['unknown'], keyValue.value);
                    });

                    if (propertyAccessorResultStrings.length)
                        processKeyValue('_ko_property_writers', "{" + propertyAccessorResultStrings.join(",") + " }");

                    return resultStrings.join(",");
                }

                return {
                    bindingRewriteValidators: [],

                    twoWayBindings: twoWayBindings,

                    parseObjectLiteral: parseObjectLiteral,

                    preProcessBindings: preProcessBindings,

                    keyValueArrayContainsKey: function (keyValueArray, key) {
                        for (var i = 0; i < keyValueArray.length; i++)
                            if (keyValueArray[i]['key'] == key)
                                return true;
                        return false;
                    },

                    // Internal, private KO utility for updating model properties from within bindings
                    // property:            If the property being updated is (or might be) an observable, pass it here
                    //                      If it turns out to be a writable observable, it will be written to directly
                    // allBindings:         An object with a get method to retrieve bindings in the current execution context.
                    //                      This will be searched for a '_ko_property_writers' property in case you're writing to a non-observable
                    // key:                 The key identifying the property to be written. Example: for { hasFocus: myValue }, write to 'myValue' by specifying the key 'hasFocus'
                    // value:               The value to be written
                    // checkIfDifferent:    If true, and if the property being written is a writable observable, the value will only be written if
                    //                      it is !== existing value on that writable observable
                    writeValueToProperty: function (property, allBindings, key, value, checkIfDifferent) {
                        if (!property || !ko.isObservable(property)) {
                            var propWriters = allBindings.get('_ko_property_writers');
                            if (propWriters && propWriters[key])
                                propWriters[key](value);
                        } else if (ko.isWriteableObservable(property) && (!checkIfDifferent || property.peek() !== value)) {
                            property(value);
                        }
                    }
                };
            })();

            ko.exportSymbol('expressionRewriting', ko.expressionRewriting);
            ko.exportSymbol('expressionRewriting.bindingRewriteValidators', ko.expressionRewriting.bindingRewriteValidators);
            ko.exportSymbol('expressionRewriting.parseObjectLiteral', ko.expressionRewriting.parseObjectLiteral);
            ko.exportSymbol('expressionRewriting.preProcessBindings', ko.expressionRewriting.preProcessBindings);

            // Making bindings explicitly declare themselves as "two way" isn't ideal in the long term (it would be better if
            // all bindings could use an official 'property writer' API without needing to declare that they might). However,
            // since this is not, and has never been, a public API (_ko_property_writers was never documented), it's acceptable
            // as an internal implementation detail in the short term.
            // For those developers who rely on _ko_property_writers in their custom bindings, we expose _twoWayBindings as an
            // undocumented feature that makes it relatively easy to upgrade to KO 3.0. However, this is still not an official
            // public API, and we reserve the right to remove it at any time if we create a real public property writers API.
            ko.exportSymbol('expressionRewriting._twoWayBindings', ko.expressionRewriting.twoWayBindings);

            // For backward compatibility, define the following aliases. (Previously, these function names were misleading because
            // they referred to JSON specifically, even though they actually work with arbitrary JavaScript object literal expressions.)
            ko.exportSymbol('jsonExpressionRewriting', ko.expressionRewriting);
            ko.exportSymbol('jsonExpressionRewriting.insertPropertyAccessorsIntoJson', ko.expressionRewriting.preProcessBindings);
            (function () {
                // "Virtual elements" is an abstraction on top of the usual DOM API which understands the notion that comment nodes
                // may be used to represent hierarchy (in addition to the DOM's natural hierarchy).
                // If you call the DOM-manipulating functions on ko.virtualElements, you will be able to read and write the state
                // of that virtual hierarchy
                //
                // The point of all this is to support containerless templates (e.g., <!-- ko foreach:someCollection -->blah<!-- /ko -->)
                // without having to scatter special cases all over the binding and templating code.

                // IE 9 cannot reliably read the "nodeValue" property of a comment node (see https://github.com/SteveSanderson/knockout/issues/186)
                // but it does give them a nonstandard alternative property called "text" that it can read reliably. Other browsers don't have that property.
                // So, use node.text where available, and node.nodeValue elsewhere
                var commentNodesHaveTextProperty = document && document.createComment("test").text === "<!--test-->";

                var startCommentRegex = commentNodesHaveTextProperty ? /^<!--\s*ko(?:\s+([\s\S]+))?\s*-->$/ : /^\s*ko(?:\s+([\s\S]+))?\s*$/;
                var endCommentRegex = commentNodesHaveTextProperty ? /^<!--\s*\/ko\s*-->$/ : /^\s*\/ko\s*$/;
                var htmlTagsWithOptionallyClosingChildren = { 'ul': true, 'ol': true };

                function isStartComment(node) {
                    return (node.nodeType == 8) && startCommentRegex.test(commentNodesHaveTextProperty ? node.text : node.nodeValue);
                }

                function isEndComment(node) {
                    return (node.nodeType == 8) && endCommentRegex.test(commentNodesHaveTextProperty ? node.text : node.nodeValue);
                }

                function getVirtualChildren(startComment, allowUnbalanced) {
                    var currentNode = startComment;
                    var depth = 1;
                    var children = [];
                    while (currentNode = currentNode.nextSibling) {
                        if (isEndComment(currentNode)) {
                            depth--;
                            if (depth === 0)
                                return children;
                        }

                        children.push(currentNode);

                        if (isStartComment(currentNode))
                            depth++;
                    }
                    if (!allowUnbalanced)
                        throw new Error("Cannot find closing comment tag to match: " + startComment.nodeValue);
                    return null;
                }

                function getMatchingEndComment(startComment, allowUnbalanced) {
                    var allVirtualChildren = getVirtualChildren(startComment, allowUnbalanced);
                    if (allVirtualChildren) {
                        if (allVirtualChildren.length > 0)
                            return allVirtualChildren[allVirtualChildren.length - 1].nextSibling;
                        return startComment.nextSibling;
                    } else
                        return null; // Must have no matching end comment, and allowUnbalanced is true
                }

                function getUnbalancedChildTags(node) {
                    // e.g., from <div>OK</div><!-- ko blah --><span>Another</span>, returns: <!-- ko blah --><span>Another</span>
                    //       from <div>OK</div><!-- /ko --><!-- /ko -->,             returns: <!-- /ko --><!-- /ko -->
                    var childNode = node.firstChild, captureRemaining = null;
                    if (childNode) {
                        do {
                            if (captureRemaining)                   // We already hit an unbalanced node and are now just scooping up all subsequent nodes
                                captureRemaining.push(childNode);
                            else if (isStartComment(childNode)) {
                                var matchingEndComment = getMatchingEndComment(childNode, /* allowUnbalanced: */ true);
                                if (matchingEndComment)             // It's a balanced tag, so skip immediately to the end of this virtual set
                                    childNode = matchingEndComment;
                                else
                                    captureRemaining = [childNode]; // It's unbalanced, so start capturing from this point
                            } else if (isEndComment(childNode)) {
                                captureRemaining = [childNode];     // It's unbalanced (if it wasn't, we'd have skipped over it already), so start capturing
                            }
                        } while (childNode = childNode.nextSibling);
                    }
                    return captureRemaining;
                }

                ko.virtualElements = {
                    allowedBindings: {},

                    childNodes: function (node) {
                        return isStartComment(node) ? getVirtualChildren(node) : node.childNodes;
                    },

                    emptyNode: function (node) {
                        if (!isStartComment(node))
                            ko.utils.emptyDomNode(node);
                        else {
                            var virtualChildren = ko.virtualElements.childNodes(node);
                            for (var i = 0, j = virtualChildren.length; i < j; i++)
                                ko.removeNode(virtualChildren[i]);
                        }
                    },

                    setDomNodeChildren: function (node, childNodes) {
                        if (!isStartComment(node))
                            ko.utils.setDomNodeChildren(node, childNodes);
                        else {
                            ko.virtualElements.emptyNode(node);
                            var endCommentNode = node.nextSibling; // Must be the next sibling, as we just emptied the children
                            for (var i = 0, j = childNodes.length; i < j; i++)
                                endCommentNode.parentNode.insertBefore(childNodes[i], endCommentNode);
                        }
                    },

                    prepend: function (containerNode, nodeToPrepend) {
                        if (!isStartComment(containerNode)) {
                            if (containerNode.firstChild)
                                containerNode.insertBefore(nodeToPrepend, containerNode.firstChild);
                            else
                                containerNode.appendChild(nodeToPrepend);
                        } else {
                            // Start comments must always have a parent and at least one following sibling (the end comment)
                            containerNode.parentNode.insertBefore(nodeToPrepend, containerNode.nextSibling);
                        }
                    },

                    insertAfter: function (containerNode, nodeToInsert, insertAfterNode) {
                        if (!insertAfterNode) {
                            ko.virtualElements.prepend(containerNode, nodeToInsert);
                        } else if (!isStartComment(containerNode)) {
                            // Insert after insertion point
                            if (insertAfterNode.nextSibling)
                                containerNode.insertBefore(nodeToInsert, insertAfterNode.nextSibling);
                            else
                                containerNode.appendChild(nodeToInsert);
                        } else {
                            // Children of start comments must always have a parent and at least one following sibling (the end comment)
                            containerNode.parentNode.insertBefore(nodeToInsert, insertAfterNode.nextSibling);
                        }
                    },

                    firstChild: function (node) {
                        if (!isStartComment(node))
                            return node.firstChild;
                        if (!node.nextSibling || isEndComment(node.nextSibling))
                            return null;
                        return node.nextSibling;
                    },

                    nextSibling: function (node) {
                        if (isStartComment(node))
                            node = getMatchingEndComment(node);
                        if (node.nextSibling && isEndComment(node.nextSibling))
                            return null;
                        return node.nextSibling;
                    },

                    hasBindingValue: isStartComment,

                    virtualNodeBindingValue: function (node) {
                        var regexMatch = (commentNodesHaveTextProperty ? node.text : node.nodeValue).match(startCommentRegex);
                        return regexMatch ? regexMatch[1] : null;
                    },

                    normaliseVirtualElementDomStructure: function (elementVerified) {
                        // Workaround for https://github.com/SteveSanderson/knockout/issues/155
                        // (IE <= 8 or IE 9 quirks mode parses your HTML weirdly, treating closing </li> tags as if they don't exist, thereby moving comment nodes
                        // that are direct descendants of <ul> into the preceding <li>)
                        if (!htmlTagsWithOptionallyClosingChildren[ko.utils.tagNameLower(elementVerified)])
                            return;

                        // Scan immediate children to see if they contain unbalanced comment tags. If they do, those comment tags
                        // must be intended to appear *after* that child, so move them there.
                        var childNode = elementVerified.firstChild;
                        if (childNode) {
                            do {
                                if (childNode.nodeType === 1) {
                                    var unbalancedTags = getUnbalancedChildTags(childNode);
                                    if (unbalancedTags) {
                                        // Fix up the DOM by moving the unbalanced tags to where they most likely were intended to be placed - *after* the child
                                        var nodeToInsertBefore = childNode.nextSibling;
                                        for (var i = 0; i < unbalancedTags.length; i++) {
                                            if (nodeToInsertBefore)
                                                elementVerified.insertBefore(unbalancedTags[i], nodeToInsertBefore);
                                            else
                                                elementVerified.appendChild(unbalancedTags[i]);
                                        }
                                    }
                                }
                            } while (childNode = childNode.nextSibling);
                        }
                    }
                };
            })();
            ko.exportSymbol('virtualElements', ko.virtualElements);
            ko.exportSymbol('virtualElements.allowedBindings', ko.virtualElements.allowedBindings);
            ko.exportSymbol('virtualElements.emptyNode', ko.virtualElements.emptyNode);
            //ko.exportSymbol('virtualElements.firstChild', ko.virtualElements.firstChild);     // firstChild is not minified
            ko.exportSymbol('virtualElements.insertAfter', ko.virtualElements.insertAfter);
            //ko.exportSymbol('virtualElements.nextSibling', ko.virtualElements.nextSibling);   // nextSibling is not minified
            ko.exportSymbol('virtualElements.prepend', ko.virtualElements.prepend);
            ko.exportSymbol('virtualElements.setDomNodeChildren', ko.virtualElements.setDomNodeChildren);
            (function () {
                var defaultBindingAttributeName = "data-bind";

                ko.bindingProvider = function () {
                    this.bindingCache = {};
                };

                ko.utils.extend(ko.bindingProvider.prototype, {
                    'nodeHasBindings': function (node) {
                        switch (node.nodeType) {
                            case 1: // Element
                                return node.getAttribute(defaultBindingAttributeName) != null
                                    || ko.components['getComponentNameForNode'](node);
                            case 8: // Comment node
                                return ko.virtualElements.hasBindingValue(node);
                            default: return false;
                        }
                    },

                    'getBindings': function (node, bindingContext) {
                        var bindingsString = this['getBindingsString'](node, bindingContext),
                            parsedBindings = bindingsString ? this['parseBindingsString'](bindingsString, bindingContext, node) : null;
                        return ko.components.addBindingsForCustomElement(parsedBindings, node, bindingContext, /* valueAccessors */ false);
                    },

                    'getBindingAccessors': function (node, bindingContext) {
                        var bindingsString = this['getBindingsString'](node, bindingContext),
                            parsedBindings = bindingsString ? this['parseBindingsString'](bindingsString, bindingContext, node, { 'valueAccessors': true }) : null;
                        return ko.components.addBindingsForCustomElement(parsedBindings, node, bindingContext, /* valueAccessors */ true);
                    },

                    // The following function is only used internally by this default provider.
                    // It's not part of the interface definition for a general binding provider.
                    'getBindingsString': function (node, bindingContext) {
                        switch (node.nodeType) {
                            case 1: return node.getAttribute(defaultBindingAttributeName);   // Element
                            case 8: return ko.virtualElements.virtualNodeBindingValue(node); // Comment node
                            default: return null;
                        }
                    },

                    // The following function is only used internally by this default provider.
                    // It's not part of the interface definition for a general binding provider.
                    'parseBindingsString': function (bindingsString, bindingContext, node, options) {
                        try {
                            var bindingFunction = createBindingsStringEvaluatorViaCache(bindingsString, this.bindingCache, options);
                            return bindingFunction(bindingContext, node);
                        } catch (ex) {
                            ex.message = "Unable to parse bindings.\nBindings value: " + bindingsString + "\nMessage: " + ex.message;
                            throw ex;
                        }
                    }
                });

                ko.bindingProvider['instance'] = new ko.bindingProvider();

                function createBindingsStringEvaluatorViaCache(bindingsString, cache, options) {
                    var cacheKey = bindingsString + (options && options['valueAccessors'] || '');
                    return cache[cacheKey]
                        || (cache[cacheKey] = createBindingsStringEvaluator(bindingsString, options));
                }

                function createBindingsStringEvaluator(bindingsString, options) {
                    // Build the source for a function that evaluates "expression"
                    // For each scope variable, add an extra level of "with" nesting
                    // Example result: with(sc1) { with(sc0) { return (expression) } }
                    var rewrittenBindings = ko.expressionRewriting.preProcessBindings(bindingsString, options),
                        functionBody = "with($context){with($data||{}){return{" + rewrittenBindings + "}}}";
                    return new Function("$context", "$element", functionBody);
                }
            })();

            ko.exportSymbol('bindingProvider', ko.bindingProvider);
            (function () {
                ko.bindingHandlers = {};

                // The following element types will not be recursed into during binding. In the future, we
                // may consider adding <template> to this list, because such elements' contents are always
                // intended to be bound in a different context from where they appear in the document.
                var bindingDoesNotRecurseIntoElementTypes = {
                    // Don't want bindings that operate on text nodes to mutate <script> contents,
                    // because it's unexpected and a potential XSS issue
                    'script': true
                };

                // Use an overridable method for retrieving binding handlers so that a plugins may support dynamically created handlers
                ko['getBindingHandler'] = function (bindingKey) {
                    return ko.bindingHandlers[bindingKey];
                };

                // The ko.bindingContext constructor is only called directly to create the root context. For child
                // contexts, use bindingContext.createChildContext or bindingContext.extend.
                ko.bindingContext = function (dataItemOrAccessor, parentContext, dataItemAlias, extendCallback) {

                    // The binding context object includes static properties for the current, parent, and root view models.
                    // If a view model is actually stored in an observable, the corresponding binding context object, and
                    // any child contexts, must be updated when the view model is changed.
                    function updateContext() {
                        // Most of the time, the context will directly get a view model object, but if a function is given,
                        // we call the function to retrieve the view model. If the function accesses any obsevables or returns
                        // an observable, the dependency is tracked, and those observables can later cause the binding
                        // context to be updated.
                        var dataItemOrObservable = isFunc ? dataItemOrAccessor() : dataItemOrAccessor,
                            dataItem = ko.utils.unwrapObservable(dataItemOrObservable);

                        if (parentContext) {
                            // When a "parent" context is given, register a dependency on the parent context. Thus whenever the
                            // parent context is updated, this context will also be updated.
                            if (parentContext._subscribable)
                                parentContext._subscribable();

                            // Copy $root and any custom properties from the parent context
                            ko.utils.extend(self, parentContext);

                            // Because the above copy overwrites our own properties, we need to reset them.
                            // During the first execution, "subscribable" isn't set, so don't bother doing the update then.
                            if (subscribable) {
                                self._subscribable = subscribable;
                            }
                        } else {
                            self['$parents'] = [];
                            self['$root'] = dataItem;

                            // Export 'ko' in the binding context so it will be available in bindings and templates
                            // even if 'ko' isn't exported as a global, such as when using an AMD loader.
                            // See https://github.com/SteveSanderson/knockout/issues/490
                            self['ko'] = ko;
                        }
                        self['$rawData'] = dataItemOrObservable;
                        self['$data'] = dataItem;
                        if (dataItemAlias)
                            self[dataItemAlias] = dataItem;

                        // The extendCallback function is provided when creating a child context or extending a context.
                        // It handles the specific actions needed to finish setting up the binding context. Actions in this
                        // function could also add dependencies to this binding context.
                        if (extendCallback)
                            extendCallback(self, parentContext, dataItem);

                        return self['$data'];
                    }
                    function disposeWhen() {
                        return nodes && !ko.utils.anyDomNodeIsAttachedToDocument(nodes);
                    }

                    var self = this,
                        isFunc = typeof (dataItemOrAccessor) == "function" && !ko.isObservable(dataItemOrAccessor),
                        nodes,
                        subscribable = ko.dependentObservable(updateContext, null, { disposeWhen: disposeWhen, disposeWhenNodeIsRemoved: true });

                    // At this point, the binding context has been initialized, and the "subscribable" computed observable is
                    // subscribed to any observables that were accessed in the process. If there is nothing to track, the
                    // computed will be inactive, and we can safely throw it away. If it's active, the computed is stored in
                    // the context object.
                    if (subscribable.isActive()) {
                        self._subscribable = subscribable;

                        // Always notify because even if the model ($data) hasn't changed, other context properties might have changed
                        subscribable['equalityComparer'] = null;

                        // We need to be able to dispose of this computed observable when it's no longer needed. This would be
                        // easy if we had a single node to watch, but binding contexts can be used by many different nodes, and
                        // we cannot assume that those nodes have any relation to each other. So instead we track any node that
                        // the context is attached to, and dispose the computed when all of those nodes have been cleaned.

                        // Add properties to *subscribable* instead of *self* because any properties added to *self* may be overwritten on updates
                        nodes = [];
                        subscribable._addNode = function (node) {
                            nodes.push(node);
                            ko.utils.domNodeDisposal.addDisposeCallback(node, function (node) {
                                ko.utils.arrayRemoveItem(nodes, node);
                                if (!nodes.length) {
                                    subscribable.dispose();
                                    self._subscribable = subscribable = undefined;
                                }
                            });
                        };
                    }
                }

                // Extend the binding context hierarchy with a new view model object. If the parent context is watching
                // any obsevables, the new child context will automatically get a dependency on the parent context.
                // But this does not mean that the $data value of the child context will also get updated. If the child
                // view model also depends on the parent view model, you must provide a function that returns the correct
                // view model on each update.
                ko.bindingContext.prototype['createChildContext'] = function (dataItemOrAccessor, dataItemAlias, extendCallback) {
                    return new ko.bindingContext(dataItemOrAccessor, this, dataItemAlias, function (self, parentContext) {
                        // Extend the context hierarchy by setting the appropriate pointers
                        self['$parentContext'] = parentContext;
                        self['$parent'] = parentContext['$data'];
                        self['$parents'] = (parentContext['$parents'] || []).slice(0);
                        self['$parents'].unshift(self['$parent']);
                        if (extendCallback)
                            extendCallback(self);
                    });
                };

                // Extend the binding context with new custom properties. This doesn't change the context hierarchy.
                // Similarly to "child" contexts, provide a function here to make sure that the correct values are set
                // when an observable view model is updated.
                ko.bindingContext.prototype['extend'] = function (properties) {
                    // If the parent context references an observable view model, "_subscribable" will always be the
                    // latest view model object. If not, "_subscribable" isn't set, and we can use the static "$data" value.
                    return new ko.bindingContext(this._subscribable || this['$data'], this, null, function (self, parentContext) {
                        // This "child" context doesn't directly track a parent observable view model,
                        // so we need to manually set the $rawData value to match the parent.
                        self['$rawData'] = parentContext['$rawData'];
                        ko.utils.extend(self, typeof (properties) == "function" ? properties() : properties);
                    });
                };

                // Returns the valueAccesor function for a binding value
                function makeValueAccessor(value) {
                    return function () {
                        return value;
                    };
                }

                // Returns the value of a valueAccessor function
                function evaluateValueAccessor(valueAccessor) {
                    return valueAccessor();
                }

                // Given a function that returns bindings, create and return a new object that contains
                // binding value-accessors functions. Each accessor function calls the original function
                // so that it always gets the latest value and all dependencies are captured. This is used
                // by ko.applyBindingsToNode and getBindingsAndMakeAccessors.
                function makeAccessorsFromFunction(callback) {
                    return ko.utils.objectMap(ko.dependencyDetection.ignore(callback), function (value, key) {
                        return function () {
                            return callback()[key];
                        };
                    });
                }

                // Given a bindings function or object, create and return a new object that contains
                // binding value-accessors functions. This is used by ko.applyBindingsToNode.
                function makeBindingAccessors(bindings, context, node) {
                    if (typeof bindings === 'function') {
                        return makeAccessorsFromFunction(bindings.bind(null, context, node));
                    } else {
                        return ko.utils.objectMap(bindings, makeValueAccessor);
                    }
                }

                // This function is used if the binding provider doesn't include a getBindingAccessors function.
                // It must be called with 'this' set to the provider instance.
                function getBindingsAndMakeAccessors(node, context) {
                    return makeAccessorsFromFunction(this['getBindings'].bind(this, node, context));
                }

                function validateThatBindingIsAllowedForVirtualElements(bindingName) {
                    var validator = ko.virtualElements.allowedBindings[bindingName];
                    if (!validator)
                        throw new Error("The binding '" + bindingName + "' cannot be used with virtual elements")
                }

                function applyBindingsToDescendantsInternal(bindingContext, elementOrVirtualElement, bindingContextsMayDifferFromDomParentElement) {
                    var currentChild,
                        nextInQueue = ko.virtualElements.firstChild(elementOrVirtualElement),
                        provider = ko.bindingProvider['instance'],
                        preprocessNode = provider['preprocessNode'];

                    // Preprocessing allows a binding provider to mutate a node before bindings are applied to it. For example it's
                    // possible to insert new siblings after it, and/or replace the node with a different one. This can be used to
                    // implement custom binding syntaxes, such as {{ value }} for string interpolation, or custom element types that
                    // trigger insertion of <template> contents at that point in the document.
                    if (preprocessNode) {
                        while (currentChild = nextInQueue) {
                            nextInQueue = ko.virtualElements.nextSibling(currentChild);
                            preprocessNode.call(provider, currentChild);
                        }
                        // Reset nextInQueue for the next loop
                        nextInQueue = ko.virtualElements.firstChild(elementOrVirtualElement);
                    }

                    while (currentChild = nextInQueue) {
                        // Keep a record of the next child *before* applying bindings, in case the binding removes the current child from its position
                        nextInQueue = ko.virtualElements.nextSibling(currentChild);
                        applyBindingsToNodeAndDescendantsInternal(bindingContext, currentChild, bindingContextsMayDifferFromDomParentElement);
                    }
                }

                function applyBindingsToNodeAndDescendantsInternal(bindingContext, nodeVerified, bindingContextMayDifferFromDomParentElement) {
                    var shouldBindDescendants = true;

                    // Perf optimisation: Apply bindings only if...
                    // (1) We need to store the binding context on this node (because it may differ from the DOM parent node's binding context)
                    //     Note that we can't store binding contexts on non-elements (e.g., text nodes), as IE doesn't allow expando properties for those
                    // (2) It might have bindings (e.g., it has a data-bind attribute, or it's a marker for a containerless template)
                    var isElement = (nodeVerified.nodeType === 1);
                    if (isElement) // Workaround IE <= 8 HTML parsing weirdness
                        ko.virtualElements.normaliseVirtualElementDomStructure(nodeVerified);

                    var shouldApplyBindings = (isElement && bindingContextMayDifferFromDomParentElement)             // Case (1)
                                           || ko.bindingProvider['instance']['nodeHasBindings'](nodeVerified);       // Case (2)
                    if (shouldApplyBindings)
                        shouldBindDescendants = applyBindingsToNodeInternal(nodeVerified, null, bindingContext, bindingContextMayDifferFromDomParentElement)['shouldBindDescendants'];

                    if (shouldBindDescendants && !bindingDoesNotRecurseIntoElementTypes[ko.utils.tagNameLower(nodeVerified)]) {
                        // We're recursing automatically into (real or virtual) child nodes without changing binding contexts. So,
                        //  * For children of a *real* element, the binding context is certainly the same as on their DOM .parentNode,
                        //    hence bindingContextsMayDifferFromDomParentElement is false
                        //  * For children of a *virtual* element, we can't be sure. Evaluating .parentNode on those children may
                        //    skip over any number of intermediate virtual elements, any of which might define a custom binding context,
                        //    hence bindingContextsMayDifferFromDomParentElement is true
                        applyBindingsToDescendantsInternal(bindingContext, nodeVerified, /* bindingContextsMayDifferFromDomParentElement: */ !isElement);
                    }
                }

                var boundElementDomDataKey = ko.utils.domData.nextKey();


                function topologicalSortBindings(bindings) {
                    // Depth-first sort
                    var result = [],                // The list of key/handler pairs that we will return
                        bindingsConsidered = {},    // A temporary record of which bindings are already in 'result'
                        cyclicDependencyStack = []; // Keeps track of a depth-search so that, if there's a cycle, we know which bindings caused it
                    ko.utils.objectForEach(bindings, function pushBinding(bindingKey) {
                        if (!bindingsConsidered[bindingKey]) {
                            var binding = ko['getBindingHandler'](bindingKey);
                            if (binding) {
                                // First add dependencies (if any) of the current binding
                                if (binding['after']) {
                                    cyclicDependencyStack.push(bindingKey);
                                    ko.utils.arrayForEach(binding['after'], function (bindingDependencyKey) {
                                        if (bindings[bindingDependencyKey]) {
                                            if (ko.utils.arrayIndexOf(cyclicDependencyStack, bindingDependencyKey) !== -1) {
                                                throw Error("Cannot combine the following bindings, because they have a cyclic dependency: " + cyclicDependencyStack.join(", "));
                                            } else {
                                                pushBinding(bindingDependencyKey);
                                            }
                                        }
                                    });
                                    cyclicDependencyStack.length--;
                                }
                                // Next add the current binding
                                result.push({ key: bindingKey, handler: binding });
                            }
                            bindingsConsidered[bindingKey] = true;
                        }
                    });

                    return result;
                }

                function applyBindingsToNodeInternal(node, sourceBindings, bindingContext, bindingContextMayDifferFromDomParentElement) {
                    // Prevent multiple applyBindings calls for the same node, except when a binding value is specified
                    var alreadyBound = ko.utils.domData.get(node, boundElementDomDataKey);
                    if (!sourceBindings) {
                        if (alreadyBound) {
                            throw Error("You cannot apply bindings multiple times to the same element.");
                        }
                        ko.utils.domData.set(node, boundElementDomDataKey, true);
                    }

                    // Optimization: Don't store the binding context on this node if it's definitely the same as on node.parentNode, because
                    // we can easily recover it just by scanning up the node's ancestors in the DOM
                    // (note: here, parent node means "real DOM parent" not "virtual parent", as there's no O(1) way to find the virtual parent)
                    if (!alreadyBound && bindingContextMayDifferFromDomParentElement)
                        ko.storedBindingContextForNode(node, bindingContext);

                    // Use bindings if given, otherwise fall back on asking the bindings provider to give us some bindings
                    var bindings;
                    if (sourceBindings && typeof sourceBindings !== 'function') {
                        bindings = sourceBindings;
                    } else {
                        var provider = ko.bindingProvider['instance'],
                            getBindings = provider['getBindingAccessors'] || getBindingsAndMakeAccessors;

                        // Get the binding from the provider within a computed observable so that we can update the bindings whenever
                        // the binding context is updated or if the binding provider accesses observables.
                        var bindingsUpdater = ko.dependentObservable(
                            function () {
                                bindings = sourceBindings ? sourceBindings(bindingContext, node) : getBindings.call(provider, node, bindingContext);
                                // Register a dependency on the binding context to support obsevable view models.
                                if (bindings && bindingContext._subscribable)
                                    bindingContext._subscribable();
                                return bindings;
                            },
                            null, { disposeWhenNodeIsRemoved: node }
                        );

                        if (!bindings || !bindingsUpdater.isActive())
                            bindingsUpdater = null;
                    }

                    var bindingHandlerThatControlsDescendantBindings;
                    if (bindings) {
                        // Return the value accessor for a given binding. When bindings are static (won't be updated because of a binding
                        // context update), just return the value accessor from the binding. Otherwise, return a function that always gets
                        // the latest binding value and registers a dependency on the binding updater.
                        var getValueAccessor = bindingsUpdater
                            ? function (bindingKey) {
                                return function () {
                                    return evaluateValueAccessor(bindingsUpdater()[bindingKey]);
                                };
                            } : function (bindingKey) {
                                return bindings[bindingKey];
                            };

                        // Use of allBindings as a function is maintained for backwards compatibility, but its use is deprecated
                        function allBindings() {
                            return ko.utils.objectMap(bindingsUpdater ? bindingsUpdater() : bindings, evaluateValueAccessor);
                        }
                        // The following is the 3.x allBindings API
                        allBindings['get'] = function (key) {
                            return bindings[key] && evaluateValueAccessor(getValueAccessor(key));
                        };
                        allBindings['has'] = function (key) {
                            return key in bindings;
                        };

                        // First put the bindings into the right order
                        var orderedBindings = topologicalSortBindings(bindings);

                        // Go through the sorted bindings, calling init and update for each
                        ko.utils.arrayForEach(orderedBindings, function (bindingKeyAndHandler) {
                            // Note that topologicalSortBindings has already filtered out any nonexistent binding handlers,
                            // so bindingKeyAndHandler.handler will always be nonnull.
                            var handlerInitFn = bindingKeyAndHandler.handler["init"],
                                handlerUpdateFn = bindingKeyAndHandler.handler["update"],
                                bindingKey = bindingKeyAndHandler.key;

                            if (node.nodeType === 8) {
                                validateThatBindingIsAllowedForVirtualElements(bindingKey);
                            }

                            try {
                                // Run init, ignoring any dependencies
                                if (typeof handlerInitFn == "function") {
                                    ko.dependencyDetection.ignore(function () {
                                        var initResult = handlerInitFn(node, getValueAccessor(bindingKey), allBindings, bindingContext['$data'], bindingContext);

                                        // If this binding handler claims to control descendant bindings, make a note of this
                                        if (initResult && initResult['controlsDescendantBindings']) {
                                            if (bindingHandlerThatControlsDescendantBindings !== undefined)
                                                throw new Error("Multiple bindings (" + bindingHandlerThatControlsDescendantBindings + " and " + bindingKey + ") are trying to control descendant bindings of the same element. You cannot use these bindings together on the same element.");
                                            bindingHandlerThatControlsDescendantBindings = bindingKey;
                                        }
                                    });
                                }

                                // Run update in its own computed wrapper
                                if (typeof handlerUpdateFn == "function") {
                                    ko.dependentObservable(
                                        function () {
                                            handlerUpdateFn(node, getValueAccessor(bindingKey), allBindings, bindingContext['$data'], bindingContext);
                                        },
                                        null,
                                        { disposeWhenNodeIsRemoved: node }
                                    );
                                }
                            } catch (ex) {
                                ex.message = "Unable to process binding \"" + bindingKey + ": " + bindings[bindingKey] + "\"\nMessage: " + ex.message;
                                throw ex;
                            }
                        });
                    }

                    return {
                        'shouldBindDescendants': bindingHandlerThatControlsDescendantBindings === undefined
                    };
                };

                var storedBindingContextDomDataKey = ko.utils.domData.nextKey();
                ko.storedBindingContextForNode = function (node, bindingContext) {
                    if (arguments.length == 2) {
                        ko.utils.domData.set(node, storedBindingContextDomDataKey, bindingContext);
                        if (bindingContext._subscribable)
                            bindingContext._subscribable._addNode(node);
                    } else {
                        return ko.utils.domData.get(node, storedBindingContextDomDataKey);
                    }
                }

                function getBindingContext(viewModelOrBindingContext) {
                    return viewModelOrBindingContext && (viewModelOrBindingContext instanceof ko.bindingContext)
                        ? viewModelOrBindingContext
                        : new ko.bindingContext(viewModelOrBindingContext);
                }

                ko.applyBindingAccessorsToNode = function (node, bindings, viewModelOrBindingContext) {
                    if (node.nodeType === 1) // If it's an element, workaround IE <= 8 HTML parsing weirdness
                        ko.virtualElements.normaliseVirtualElementDomStructure(node);
                    return applyBindingsToNodeInternal(node, bindings, getBindingContext(viewModelOrBindingContext), true);
                };

                ko.applyBindingsToNode = function (node, bindings, viewModelOrBindingContext) {
                    var context = getBindingContext(viewModelOrBindingContext);
                    return ko.applyBindingAccessorsToNode(node, makeBindingAccessors(bindings, context, node), context);
                };

                ko.applyBindingsToDescendants = function (viewModelOrBindingContext, rootNode) {
                    if (rootNode.nodeType === 1 || rootNode.nodeType === 8)
                        applyBindingsToDescendantsInternal(getBindingContext(viewModelOrBindingContext), rootNode, true);
                };

                ko.applyBindings = function (viewModelOrBindingContext, rootNode) {
                    // If jQuery is loaded after Knockout, we won't initially have access to it. So save it here.
                    if (!jQueryInstance && window['jQuery']) {
                        jQueryInstance = window['jQuery'];
                    }

                    if (rootNode && (rootNode.nodeType !== 1) && (rootNode.nodeType !== 8))
                        throw new Error("ko.applyBindings: first parameter should be your view model; second parameter should be a DOM node");
                    rootNode = rootNode || window.document.body; // Make "rootNode" parameter optional

                    applyBindingsToNodeAndDescendantsInternal(getBindingContext(viewModelOrBindingContext), rootNode, true);
                };

                // Retrieving binding context from arbitrary nodes
                ko.contextFor = function (node) {
                    // We can only do something meaningful for elements and comment nodes (in particular, not text nodes, as IE can't store domdata for them)
                    switch (node.nodeType) {
                        case 1:
                        case 8:
                            var context = ko.storedBindingContextForNode(node);
                            if (context) return context;
                            if (node.parentNode) return ko.contextFor(node.parentNode);
                            break;
                    }
                    return undefined;
                };
                ko.dataFor = function (node) {
                    var context = ko.contextFor(node);
                    return context ? context['$data'] : undefined;
                };

                ko.exportSymbol('bindingHandlers', ko.bindingHandlers);
                ko.exportSymbol('applyBindings', ko.applyBindings);
                ko.exportSymbol('applyBindingsToDescendants', ko.applyBindingsToDescendants);
                ko.exportSymbol('applyBindingAccessorsToNode', ko.applyBindingAccessorsToNode);
                ko.exportSymbol('applyBindingsToNode', ko.applyBindingsToNode);
                ko.exportSymbol('contextFor', ko.contextFor);
                ko.exportSymbol('dataFor', ko.dataFor);
            })();
            (function (undefined) {
                var loadingSubscribablesCache = {}, // Tracks component loads that are currently in flight
                    loadedDefinitionsCache = {};    // Tracks component loads that have already completed

                ko.components = {
                    get: function (componentName, callback) {
                        var cachedDefinition = getObjectOwnProperty(loadedDefinitionsCache, componentName);
                        if (cachedDefinition) {
                            // It's already loaded and cached. Reuse the same definition object.
                            // Note that for API consistency, even cache hits complete asynchronously.
                            setTimeout(function () { callback(cachedDefinition) }, 0);
                        } else {
                            // Join the loading process that is already underway, or start a new one.
                            loadComponentAndNotify(componentName, callback);
                        }
                    },

                    clearCachedDefinition: function (componentName) {
                        delete loadedDefinitionsCache[componentName];
                    },

                    _getFirstResultFromLoaders: getFirstResultFromLoaders
                };

                function getObjectOwnProperty(obj, propName) {
                    return obj.hasOwnProperty(propName) ? obj[propName] : undefined;
                }

                function loadComponentAndNotify(componentName, callback) {
                    var subscribable = getObjectOwnProperty(loadingSubscribablesCache, componentName),
                        completedAsync;
                    if (!subscribable) {
                        // It's not started loading yet. Start loading, and when it's done, move it to loadedDefinitionsCache.
                        subscribable = loadingSubscribablesCache[componentName] = new ko.subscribable();
                        beginLoadingComponent(componentName, function (definition) {
                            loadedDefinitionsCache[componentName] = definition;
                            delete loadingSubscribablesCache[componentName];

                            // For API consistency, all loads complete asynchronously. However we want to avoid
                            // adding an extra setTimeout if it's unnecessary (i.e., the completion is already
                            // async) since setTimeout(..., 0) still takes about 16ms or more on most browsers.
                            if (completedAsync) {
                                subscribable['notifySubscribers'](definition);
                            } else {
                                setTimeout(function () {
                                    subscribable['notifySubscribers'](definition);
                                }, 0);
                            }
                        });
                        completedAsync = true;
                    }
                    subscribable.subscribe(callback);
                }

                function beginLoadingComponent(componentName, callback) {
                    getFirstResultFromLoaders('getConfig', [componentName], function (config) {
                        if (config) {
                            // We have a config, so now load its definition
                            getFirstResultFromLoaders('loadComponent', [componentName, config], function (definition) {
                                callback(definition);
                            });
                        } else {
                            // The component has no config - it's unknown to all the loaders.
                            // Note that this is not an error (e.g., a module loading error) - that would abort the
                            // process and this callback would not run. For this callback to run, all loaders must
                            // have confirmed they don't know about this component.
                            callback(null);
                        }
                    });
                }

                function getFirstResultFromLoaders(methodName, argsExceptCallback, callback, candidateLoaders) {
                    // On the first call in the stack, start with the full set of loaders
                    if (!candidateLoaders) {
                        candidateLoaders = ko.components['loaders'].slice(0); // Use a copy, because we'll be mutating this array
                    }

                    // Try the next candidate
                    var currentCandidateLoader = candidateLoaders.shift();
                    if (currentCandidateLoader) {
                        var methodInstance = currentCandidateLoader[methodName];
                        if (methodInstance) {
                            var wasAborted = false,
                                synchronousReturnValue = methodInstance.apply(currentCandidateLoader, argsExceptCallback.concat(function (result) {
                                    if (wasAborted) {
                                        callback(null);
                                    } else if (result !== null) {
                                        // This candidate returned a value. Use it.
                                        callback(result);
                                    } else {
                                        // Try the next candidate
                                        getFirstResultFromLoaders(methodName, argsExceptCallback, callback, candidateLoaders);
                                    }
                                }));

                            // Currently, loaders may not return anything synchronously. This leaves open the possibility
                            // that we'll extend the API to support synchronous return values in the future. It won't be
                            // a breaking change, because currently no loader is allowed to return anything except undefined.
                            if (synchronousReturnValue !== undefined) {
                                wasAborted = true;

                                // Method to suppress exceptions will remain undocumented. This is only to keep
                                // KO's specs running tidily, since we can observe the loading got aborted without
                                // having exceptions cluttering up the console too.
                                if (!currentCandidateLoader['suppressLoaderExceptions']) {
                                    throw new Error('Component loaders must supply values by invoking the callback, not by returning values synchronously.');
                                }
                            }
                        } else {
                            // This candidate doesn't have the relevant handler. Synchronously move on to the next one.
                            getFirstResultFromLoaders(methodName, argsExceptCallback, callback, candidateLoaders);
                        }
                    } else {
                        // No candidates returned a value
                        callback(null);
                    }
                }

                // Reference the loaders via string name so it's possible for developers
                // to replace the whole array by assigning to ko.components.loaders
                ko.components['loaders'] = [];

                ko.exportSymbol('components', ko.components);
                ko.exportSymbol('components.get', ko.components.get);
                ko.exportSymbol('components.clearCachedDefinition', ko.components.clearCachedDefinition);
            })();
            (function (undefined) {

                // The default loader is responsible for two things:
                // 1. Maintaining the default in-memory registry of component configuration objects
                //    (i.e., the thing you're writing to when you call ko.components.register(someName, ...))
                // 2. Answering requests for components by fetching configuration objects
                //    from that default in-memory registry and resolving them into standard
                //    component definition objects (of the form { createViewModel: ..., template: ... })
                // Custom loaders may override either of these facilities, i.e.,
                // 1. To supply configuration objects from some other source (e.g., conventions)
                // 2. Or, to resolve configuration objects by loading viewmodels/templates via arbitrary logic.

                var defaultConfigRegistry = {};

                ko.components.register = function (componentName, config) {
                    if (!config) {
                        throw new Error('Invalid configuration for ' + componentName);
                    }

                    if (ko.components.isRegistered(componentName)) {
                        throw new Error('Component ' + componentName + ' is already registered');
                    }

                    defaultConfigRegistry[componentName] = config;
                }

                ko.components.isRegistered = function (componentName) {
                    return componentName in defaultConfigRegistry;
                }

                ko.components.unregister = function (componentName) {
                    delete defaultConfigRegistry[componentName];
                    ko.components.clearCachedDefinition(componentName);
                }

                ko.components.defaultLoader = {
                    'getConfig': function (componentName, callback) {
                        var result = defaultConfigRegistry.hasOwnProperty(componentName)
                            ? defaultConfigRegistry[componentName]
                            : null;
                        callback(result);
                    },

                    'loadComponent': function (componentName, config, callback) {
                        var errorCallback = makeErrorCallback(componentName);
                        possiblyGetConfigFromAmd(errorCallback, config, function (loadedConfig) {
                            resolveConfig(componentName, errorCallback, loadedConfig, callback);
                        });
                    },

                    'loadTemplate': function (componentName, templateConfig, callback) {
                        resolveTemplate(makeErrorCallback(componentName), templateConfig, callback);
                    },

                    'loadViewModel': function (componentName, viewModelConfig, callback) {
                        resolveViewModel(makeErrorCallback(componentName), viewModelConfig, callback);
                    }
                };

                var createViewModelKey = 'createViewModel';

                // Takes a config object of the form { template: ..., viewModel: ... }, and asynchronously convert it
                // into the standard component definition format:
                //    { template: <ArrayOfDomNodes>, createViewModel: function(params, componentInfo) { ... } }.
                // Since both template and viewModel may need to be resolved asynchronously, both tasks are performed
                // in parallel, and the results joined when both are ready. We don't depend on any promises infrastructure,
                // so this is implemented manually below.
                function resolveConfig(componentName, errorCallback, config, callback) {
                    var result = {},
                        makeCallBackWhenZero = 2,
                        tryIssueCallback = function () {
                            if (--makeCallBackWhenZero === 0) {
                                callback(result);
                            }
                        },
                        templateConfig = config['template'],
                        viewModelConfig = config['viewModel'];

                    if (templateConfig) {
                        possiblyGetConfigFromAmd(errorCallback, templateConfig, function (loadedConfig) {
                            ko.components._getFirstResultFromLoaders('loadTemplate', [componentName, loadedConfig], function (resolvedTemplate) {
                                result['template'] = resolvedTemplate;
                                tryIssueCallback();
                            });
                        });
                    } else {
                        tryIssueCallback();
                    }

                    if (viewModelConfig) {
                        possiblyGetConfigFromAmd(errorCallback, viewModelConfig, function (loadedConfig) {
                            ko.components._getFirstResultFromLoaders('loadViewModel', [componentName, loadedConfig], function (resolvedViewModel) {
                                result[createViewModelKey] = resolvedViewModel;
                                tryIssueCallback();
                            });
                        });
                    } else {
                        tryIssueCallback();
                    }
                }

                function resolveTemplate(errorCallback, templateConfig, callback) {
                    if (typeof templateConfig === 'string') {
                        // Markup - parse it
                        callback(ko.utils.parseHtmlFragment(templateConfig));
                    } else if (templateConfig instanceof Array) {
                        // Assume already an array of DOM nodes - pass through unchanged
                        callback(templateConfig);
                    } else if (isDocumentFragment(templateConfig)) {
                        // Document fragment - use its child nodes
                        callback(ko.utils.makeArray(templateConfig.childNodes));
                    } else if (templateConfig['element']) {
                        var element = templateConfig['element'];
                        if (isDomElement(element)) {
                            // Element instance - copy its child nodes
                            callback(cloneNodesFromTemplateSourceElement(element));
                        } else if (typeof element === 'string') {
                            // Element ID - find it, then copy its child nodes
                            var elemInstance = document.getElementById(element);
                            if (elemInstance) {
                                callback(cloneNodesFromTemplateSourceElement(elemInstance));
                            } else {
                                errorCallback('Cannot find element with ID ' + element);
                            }
                        } else {
                            errorCallback('Unknown element type: ' + element);
                        }
                    } else {
                        errorCallback('Unknown template value: ' + templateConfig);
                    }
                }

                function resolveViewModel(errorCallback, viewModelConfig, callback) {
                    if (typeof viewModelConfig === 'function') {
                        // Constructor - convert to standard factory function format
                        // By design, this does *not* supply componentInfo to the constructor, as the intent is that
                        // componentInfo contains non-viewmodel data (e.g., the component's element) that should only
                        // be used in factory functions, not viewmodel constructors.
                        callback(function (params /*, componentInfo */) {
                            return new viewModelConfig(params);
                        });
                    } else if (typeof viewModelConfig[createViewModelKey] === 'function') {
                        // Already a factory function - use it as-is
                        callback(viewModelConfig[createViewModelKey]);
                    } else if ('instance' in viewModelConfig) {
                        // Fixed object instance - promote to createViewModel format for API consistency
                        var fixedInstance = viewModelConfig['instance'];
                        callback(function (params, componentInfo) {
                            return fixedInstance;
                        });
                    } else if ('viewModel' in viewModelConfig) {
                        // Resolved AMD module whose value is of the form { viewModel: ... }
                        resolveViewModel(errorCallback, viewModelConfig['viewModel'], callback);
                    } else {
                        errorCallback('Unknown viewModel value: ' + viewModelConfig);
                    }
                }

                function cloneNodesFromTemplateSourceElement(elemInstance) {
                    switch (ko.utils.tagNameLower(elemInstance)) {
                        case 'script':
                            return ko.utils.parseHtmlFragment(elemInstance.text);
                        case 'textarea':
                            return ko.utils.parseHtmlFragment(elemInstance.value);
                        case 'template':
                            // For browsers with proper <template> element support (i.e., where the .content property
                            // gives a document fragment), use that document fragment.
                            if (isDocumentFragment(elemInstance.content)) {
                                return ko.utils.cloneNodes(elemInstance.content.childNodes);
                            }
                    }

                    // Regular elements such as <div>, and <template> elements on old browsers that don't really
                    // understand <template> and just treat it as a regular container
                    return ko.utils.cloneNodes(elemInstance.childNodes);
                }

                function isDomElement(obj) {
                    if (window['HTMLElement']) {
                        return obj instanceof HTMLElement;
                    } else {
                        return obj && obj.tagName && obj.nodeType === 1;
                    }
                }

                function isDocumentFragment(obj) {
                    if (window['DocumentFragment']) {
                        return obj instanceof DocumentFragment;
                    } else {
                        return obj && obj.nodeType === 11;
                    }
                }

                function possiblyGetConfigFromAmd(errorCallback, config, callback) {
                    if (typeof config['require'] === 'string') {
                        // The config is the value of an AMD module
                        if (require || window['require']) {
                            (require || window['require'])([config['require']], callback);
                        } else {
                            errorCallback('Uses require, but no AMD loader is present');
                        }
                    } else {
                        callback(config);
                    }
                }

                function makeErrorCallback(componentName) {
                    return function (message) {
                        throw new Error('Component \'' + componentName + '\': ' + message);
                    };
                }

                ko.exportSymbol('components.register', ko.components.register);
                ko.exportSymbol('components.isRegistered', ko.components.isRegistered);
                ko.exportSymbol('components.unregister', ko.components.unregister);

                // Expose the default loader so that developers can directly ask it for configuration
                // or to resolve configuration
                ko.exportSymbol('components.defaultLoader', ko.components.defaultLoader);

                // By default, the default loader is the only registered component loader
                ko.components['loaders'].push(ko.components.defaultLoader);

                // Privately expose the underlying config registry for use in old-IE shim
                ko.components._allRegisteredComponents = defaultConfigRegistry;
            })();
            (function (undefined) {
                // Overridable API for determining which component name applies to a given node. By overriding this,
                // you can for example map specific tagNames to components that are not preregistered.
                ko.components['getComponentNameForNode'] = function (node) {
                    var tagNameLower = ko.utils.tagNameLower(node);
                    return ko.components.isRegistered(tagNameLower) && tagNameLower;
                };

                ko.components.addBindingsForCustomElement = function (allBindings, node, bindingContext, valueAccessors) {
                    // Determine if it's really a custom element matching a component
                    if (node.nodeType === 1) {
                        var componentName = ko.components['getComponentNameForNode'](node);
                        if (componentName) {
                            // It does represent a component, so add a component binding for it
                            allBindings = allBindings || {};

                            if (allBindings['component']) {
                                // Avoid silently overwriting some other 'component' binding that may already be on the element
                                throw new Error('Cannot use the "component" binding on a custom element matching a component');
                            }

                            var componentBindingValue = { 'name': componentName, 'params': getComponentParamsFromCustomElement(node, bindingContext) };

                            allBindings['component'] = valueAccessors
                                ? function () { return componentBindingValue; }
                                : componentBindingValue;
                        }
                    }

                    return allBindings;
                }

                var nativeBindingProviderInstance = new ko.bindingProvider();

                function getComponentParamsFromCustomElement(elem, bindingContext) {
                    var paramsAttribute = elem.getAttribute('params');

                    if (paramsAttribute) {
                        var params = nativeBindingProviderInstance['parseBindingsString'](paramsAttribute, bindingContext, elem, { 'valueAccessors': true, 'bindingParams': true }),
                            rawParamComputedValues = ko.utils.objectMap(params, function (paramValue, paramName) {
                                return ko.computed(paramValue, null, { disposeWhenNodeIsRemoved: elem });
                            }),
                            result = ko.utils.objectMap(rawParamComputedValues, function (paramValueComputed, paramName) {
                                // Does the evaluation of the parameter value unwrap any observables?
                                if (!paramValueComputed.isActive()) {
                                    // No it doesn't, so there's no need for any computed wrapper. Just pass through the supplied value directly.
                                    // Example: "someVal: firstName, age: 123" (whether or not firstName is an observable/computed)
                                    return paramValueComputed.peek();
                                } else {
                                    // Yes it does. Supply a computed property that unwraps both the outer (binding expression)
                                    // level of observability, and any inner (resulting model value) level of observability.
                                    // This means the component doesn't have to worry about multiple unwrapping.
                                    return ko.computed(function () {
                                        return ko.utils.unwrapObservable(paramValueComputed());
                                    }, null, { disposeWhenNodeIsRemoved: elem });
                                }
                            });

                        // Give access to the raw computeds, as long as that wouldn't overwrite any custom param also called '$raw'
                        // This is in case the developer wants to react to outer (binding) observability separately from inner
                        // (model value) observability, or in case the model value observable has subobservables.
                        if (!result.hasOwnProperty('$raw')) {
                            result['$raw'] = rawParamComputedValues;
                        }

                        return result;
                    } else {
                        // For consistency, absence of a "params" attribute is treated the same as the presence of
                        // any empty one. Otherwise component viewmodels need special code to check whether or not
                        // 'params' or 'params.$raw' is null/undefined before reading subproperties, which is annoying.
                        return { '$raw': {} };
                    }
                }

                // --------------------------------------------------------------------------------
                // Compatibility code for older (pre-HTML5) IE browsers

                if (ko.utils.ieVersion < 9) {
                    // Whenever you preregister a component, enable it as a custom element in the current document
                    ko.components['register'] = (function (originalFunction) {
                        return function (componentName) {
                            document.createElement(componentName); // Allows IE<9 to parse markup containing the custom element
                            return originalFunction.apply(this, arguments);
                        }
                    })(ko.components['register']);

                    // Whenever you create a document fragment, enable all preregistered component names as custom elements
                    // This is needed to make innerShiv/jQuery HTML parsing correctly handle the custom elements
                    document.createDocumentFragment = (function (originalFunction) {
                        return function () {
                            var newDocFrag = originalFunction(),
                                allComponents = ko.components._allRegisteredComponents;
                            for (var componentName in allComponents) {
                                if (allComponents.hasOwnProperty(componentName)) {
                                    newDocFrag.createElement(componentName);
                                }
                            }
                            return newDocFrag;
                        };
                    })(document.createDocumentFragment);
                }
            })(); (function (undefined) {

                var componentLoadingOperationUniqueId = 0;

                ko.bindingHandlers['component'] = {
                    'init': function (element, valueAccessor, ignored1, ignored2, bindingContext) {
                        var currentViewModel,
                            currentLoadingOperationId,
                            disposeAssociatedComponentViewModel = function () {
                                var currentViewModelDispose = currentViewModel && currentViewModel['dispose'];
                                if (typeof currentViewModelDispose === 'function') {
                                    currentViewModelDispose.call(currentViewModel);
                                }

                                // Any in-flight loading operation is no longer relevant, so make sure we ignore its completion
                                currentLoadingOperationId = null;
                            };

                        ko.utils.domNodeDisposal.addDisposeCallback(element, disposeAssociatedComponentViewModel);

                        ko.computed(function () {
                            var value = ko.utils.unwrapObservable(valueAccessor()),
                                componentName, componentParams;

                            if (typeof value === 'string') {
                                componentName = value;
                            } else {
                                componentName = ko.utils.unwrapObservable(value['name']);
                                componentParams = ko.utils.unwrapObservable(value['params']);
                            }

                            if (!componentName) {
                                throw new Error('No component name specified');
                            }

                            var loadingOperationId = currentLoadingOperationId = ++componentLoadingOperationUniqueId;
                            ko.components.get(componentName, function (componentDefinition) {
                                // If this is not the current load operation for this element, ignore it.
                                if (currentLoadingOperationId !== loadingOperationId) {
                                    return;
                                }

                                // Clean up previous state
                                disposeAssociatedComponentViewModel();

                                // Instantiate and bind new component. Implicitly this cleans any old DOM nodes.
                                if (!componentDefinition) {
                                    throw new Error('Unknown component \'' + componentName + '\'');
                                }
                                cloneTemplateIntoElement(componentName, componentDefinition, element);
                                var componentViewModel = createViewModel(componentDefinition, element, componentParams),
                                    childBindingContext = bindingContext['createChildContext'](componentViewModel);
                                currentViewModel = componentViewModel;
                                ko.applyBindingsToDescendants(childBindingContext, element);
                            });
                        }, null, { disposeWhenNodeIsRemoved: element });

                        return { 'controlsDescendantBindings': true };
                    }
                };

                ko.virtualElements.allowedBindings['component'] = true;

                function cloneTemplateIntoElement(componentName, componentDefinition, element) {
                    var template = componentDefinition['template'];
                    if (!template) {
                        throw new Error('Component \'' + componentName + '\' has no template');
                    }

                    var clonedNodesArray = ko.utils.cloneNodes(template);
                    ko.virtualElements.setDomNodeChildren(element, clonedNodesArray);
                }

                function createViewModel(componentDefinition, element, componentParams) {
                    var componentViewModelFactory = componentDefinition['createViewModel'];
                    return componentViewModelFactory
                        ? componentViewModelFactory.call(componentDefinition, componentParams, { element: element })
                        : componentParams; // Template-only component
                }

            })();
            var attrHtmlToJavascriptMap = { 'class': 'className', 'for': 'htmlFor' };
            ko.bindingHandlers['attr'] = {
                'update': function (element, valueAccessor, allBindings) {
                    var value = ko.utils.unwrapObservable(valueAccessor()) || {};
                    ko.utils.objectForEach(value, function (attrName, attrValue) {
                        attrValue = ko.utils.unwrapObservable(attrValue);

                        // To cover cases like "attr: { checked:someProp }", we want to remove the attribute entirely
                        // when someProp is a "no value"-like value (strictly null, false, or undefined)
                        // (because the absence of the "checked" attr is how to mark an element as not checked, etc.)
                        var toRemove = (attrValue === false) || (attrValue === null) || (attrValue === undefined);
                        if (toRemove)
                            element.removeAttribute(attrName);

                        // In IE <= 7 and IE8 Quirks Mode, you have to use the Javascript property name instead of the
                        // HTML attribute name for certain attributes. IE8 Standards Mode supports the correct behavior,
                        // but instead of figuring out the mode, we'll just set the attribute through the Javascript
                        // property for IE <= 8.
                        if (ko.utils.ieVersion <= 8 && attrName in attrHtmlToJavascriptMap) {
                            attrName = attrHtmlToJavascriptMap[attrName];
                            if (toRemove)
                                element.removeAttribute(attrName);
                            else
                                element[attrName] = attrValue;
                        } else if (!toRemove) {
                            element.setAttribute(attrName, attrValue.toString());
                        }

                        // Treat "name" specially - although you can think of it as an attribute, it also needs
                        // special handling on older versions of IE (https://github.com/SteveSanderson/knockout/pull/333)
                        // Deliberately being case-sensitive here because XHTML would regard "Name" as a different thing
                        // entirely, and there's no strong reason to allow for such casing in HTML.
                        if (attrName === "name") {
                            ko.utils.setElementName(element, toRemove ? "" : attrValue.toString());
                        }
                    });
                }
            };
            (function () {

                ko.bindingHandlers['checked'] = {
                    'after': ['value', 'attr'],
                    'init': function (element, valueAccessor, allBindings) {
                        var checkedValue = ko.pureComputed(function () {
                            // Treat "value" like "checkedValue" when it is included with "checked" binding
                            if (allBindings['has']('checkedValue')) {
                                return ko.utils.unwrapObservable(allBindings.get('checkedValue'));
                            } else if (allBindings['has']('value')) {
                                return ko.utils.unwrapObservable(allBindings.get('value'));
                            }

                            return element.value;
                        });

                        function updateModel() {
                            // This updates the model value from the view value.
                            // It runs in response to DOM events (click) and changes in checkedValue.
                            var isChecked = element.checked,
                                elemValue = useCheckedValue ? checkedValue() : isChecked;

                            // When we're first setting up this computed, don't change any model state.
                            if (ko.computedContext.isInitial()) {
                                return;
                            }

                            // We can ignore unchecked radio buttons, because some other radio
                            // button will be getting checked, and that one can take care of updating state.
                            if (isRadio && !isChecked) {
                                return;
                            }

                            var modelValue = ko.dependencyDetection.ignore(valueAccessor);
                            if (isValueArray) {
                                if (oldElemValue !== elemValue) {
                                    // When we're responding to the checkedValue changing, and the element is
                                    // currently checked, replace the old elem value with the new elem value
                                    // in the model array.
                                    if (isChecked) {
                                        ko.utils.addOrRemoveItem(modelValue, elemValue, true);
                                        ko.utils.addOrRemoveItem(modelValue, oldElemValue, false);
                                    }

                                    oldElemValue = elemValue;
                                } else {
                                    // When we're responding to the user having checked/unchecked a checkbox,
                                    // add/remove the element value to the model array.
                                    ko.utils.addOrRemoveItem(modelValue, elemValue, isChecked);
                                }
                            } else {
                                ko.expressionRewriting.writeValueToProperty(modelValue, allBindings, 'checked', elemValue, true);
                            }
                        };

                        function updateView() {
                            // This updates the view value from the model value.
                            // It runs in response to changes in the bound (checked) value.
                            var modelValue = ko.utils.unwrapObservable(valueAccessor());

                            if (isValueArray) {
                                // When a checkbox is bound to an array, being checked represents its value being present in that array
                                element.checked = ko.utils.arrayIndexOf(modelValue, checkedValue()) >= 0;
                            } else if (isCheckbox) {
                                // When a checkbox is bound to any other value (not an array), being checked represents the value being trueish
                                element.checked = modelValue;
                            } else {
                                // For radio buttons, being checked means that the radio button's value corresponds to the model value
                                element.checked = (checkedValue() === modelValue);
                            }
                        };

                        var isCheckbox = element.type == "checkbox",
                            isRadio = element.type == "radio";

                        // Only bind to check boxes and radio buttons
                        if (!isCheckbox && !isRadio) {
                            return;
                        }

                        var isValueArray = isCheckbox && (ko.utils.unwrapObservable(valueAccessor()) instanceof Array),
                            oldElemValue = isValueArray ? checkedValue() : undefined,
                            useCheckedValue = isRadio || isValueArray;

                        // IE 6 won't allow radio buttons to be selected unless they have a name
                        if (isRadio && !element.name)
                            ko.bindingHandlers['uniqueName']['init'](element, function () { return true });

                        // Set up two computeds to update the binding:

                        // The first responds to changes in the checkedValue value and to element clicks
                        ko.computed(updateModel, null, { disposeWhenNodeIsRemoved: element });
                        ko.utils.registerEventHandler(element, "click", updateModel);

                        // The second responds to changes in the model value (the one associated with the checked binding)
                        ko.computed(updateView, null, { disposeWhenNodeIsRemoved: element });
                    }
                };
                ko.expressionRewriting.twoWayBindings['checked'] = true;

                ko.bindingHandlers['checkedValue'] = {
                    'update': function (element, valueAccessor) {
                        element.value = ko.utils.unwrapObservable(valueAccessor());
                    }
                };

            })(); var classesWrittenByBindingKey = '__ko__cssValue';
            ko.bindingHandlers['css'] = {
                'update': function (element, valueAccessor) {
                    var value = ko.utils.unwrapObservable(valueAccessor());
                    if (typeof value == "object") {
                        ko.utils.objectForEach(value, function (className, shouldHaveClass) {
                            shouldHaveClass = ko.utils.unwrapObservable(shouldHaveClass);
                            ko.utils.toggleDomNodeCssClass(element, className, shouldHaveClass);
                        });
                    } else {
                        value = String(value || ''); // Make sure we don't try to store or set a non-string value
                        ko.utils.toggleDomNodeCssClass(element, element[classesWrittenByBindingKey], false);
                        element[classesWrittenByBindingKey] = value;
                        ko.utils.toggleDomNodeCssClass(element, value, true);
                    }
                }
            };
            ko.bindingHandlers['enable'] = {
                'update': function (element, valueAccessor) {
                    var value = ko.utils.unwrapObservable(valueAccessor());
                    if (value && element.disabled)
                        element.removeAttribute("disabled");
                    else if ((!value) && (!element.disabled))
                        element.disabled = true;
                }
            };

            ko.bindingHandlers['disable'] = {
                'update': function (element, valueAccessor) {
                    ko.bindingHandlers['enable']['update'](element, function () { return !ko.utils.unwrapObservable(valueAccessor()) });
                }
            };
            // For certain common events (currently just 'click'), allow a simplified data-binding syntax
            // e.g. click:handler instead of the usual full-length event:{click:handler}
            function makeEventHandlerShortcut(eventName) {
                ko.bindingHandlers[eventName] = {
                    'init': function (element, valueAccessor, allBindings, viewModel, bindingContext) {
                        var newValueAccessor = function () {
                            var result = {};
                            result[eventName] = valueAccessor();
                            return result;
                        };
                        return ko.bindingHandlers['event']['init'].call(this, element, newValueAccessor, allBindings, viewModel, bindingContext);
                    }
                }
            }

            ko.bindingHandlers['event'] = {
                'init': function (element, valueAccessor, allBindings, viewModel, bindingContext) {
                    var eventsToHandle = valueAccessor() || {};
                    ko.utils.objectForEach(eventsToHandle, function (eventName) {
                        if (typeof eventName == "string") {
                            ko.utils.registerEventHandler(element, eventName, function (event) {
                                var handlerReturnValue;
                                var handlerFunction = valueAccessor()[eventName];
                                if (!handlerFunction)
                                    return;

                                try {
                                    // Take all the event args, and prefix with the viewmodel
                                    var argsForHandler = ko.utils.makeArray(arguments);
                                    viewModel = bindingContext['$data'];
                                    argsForHandler.unshift(viewModel);
                                    handlerReturnValue = handlerFunction.apply(viewModel, argsForHandler);
                                } finally {
                                    if (handlerReturnValue !== true) { // Normally we want to prevent default action. Developer can override this be explicitly returning true.
                                        if (event.preventDefault)
                                            event.preventDefault();
                                        else
                                            event.returnValue = false;
                                    }
                                }

                                var bubble = allBindings.get(eventName + 'Bubble') !== false;
                                if (!bubble) {
                                    event.cancelBubble = true;
                                    if (event.stopPropagation)
                                        event.stopPropagation();
                                }
                            });
                        }
                    });
                }
            };
            // "foreach: someExpression" is equivalent to "template: { foreach: someExpression }"
            // "foreach: { data: someExpression, afterAdd: myfn }" is equivalent to "template: { foreach: someExpression, afterAdd: myfn }"
            ko.bindingHandlers['foreach'] = {
                makeTemplateValueAccessor: function (valueAccessor) {
                    return function () {
                        var modelValue = valueAccessor(),
                            unwrappedValue = ko.utils.peekObservable(modelValue);    // Unwrap without setting a dependency here

                        // If unwrappedValue is the array, pass in the wrapped value on its own
                        // The value will be unwrapped and tracked within the template binding
                        // (See https://github.com/SteveSanderson/knockout/issues/523)
                        if ((!unwrappedValue) || typeof unwrappedValue.length == "number")
                            return { 'foreach': modelValue, 'templateEngine': ko.nativeTemplateEngine.instance };

                        // If unwrappedValue.data is the array, preserve all relevant options and unwrap again value so we get updates
                        ko.utils.unwrapObservable(modelValue);
                        return {
                            'foreach': unwrappedValue['data'],
                            'as': unwrappedValue['as'],
                            'includeDestroyed': unwrappedValue['includeDestroyed'],
                            'afterAdd': unwrappedValue['afterAdd'],
                            'beforeRemove': unwrappedValue['beforeRemove'],
                            'afterRender': unwrappedValue['afterRender'],
                            'beforeMove': unwrappedValue['beforeMove'],
                            'afterMove': unwrappedValue['afterMove'],
                            'templateEngine': ko.nativeTemplateEngine.instance
                        };
                    };
                },
                'init': function (element, valueAccessor, allBindings, viewModel, bindingContext) {
                    return ko.bindingHandlers['template']['init'](element, ko.bindingHandlers['foreach'].makeTemplateValueAccessor(valueAccessor));
                },
                'update': function (element, valueAccessor, allBindings, viewModel, bindingContext) {
                    return ko.bindingHandlers['template']['update'](element, ko.bindingHandlers['foreach'].makeTemplateValueAccessor(valueAccessor), allBindings, viewModel, bindingContext);
                }
            };
            ko.expressionRewriting.bindingRewriteValidators['foreach'] = false; // Can't rewrite control flow bindings
            ko.virtualElements.allowedBindings['foreach'] = true;
            var hasfocusUpdatingProperty = '__ko_hasfocusUpdating';
            var hasfocusLastValue = '__ko_hasfocusLastValue';
            ko.bindingHandlers['hasfocus'] = {
                'init': function (element, valueAccessor, allBindings) {
                    var handleElementFocusChange = function (isFocused) {
                        // Where possible, ignore which event was raised and determine focus state using activeElement,
                        // as this avoids phantom focus/blur events raised when changing tabs in modern browsers.
                        // However, not all KO-targeted browsers (Firefox 2) support activeElement. For those browsers,
                        // prevent a loss of focus when changing tabs/windows by setting a flag that prevents hasfocus
                        // from calling 'blur()' on the element when it loses focus.
                        // Discussion at https://github.com/SteveSanderson/knockout/pull/352
                        element[hasfocusUpdatingProperty] = true;
                        var ownerDoc = element.ownerDocument;
                        if ("activeElement" in ownerDoc) {
                            var active;
                            try {
                                active = ownerDoc.activeElement;
                            } catch (e) {
                                // IE9 throws if you access activeElement during page load (see issue #703)
                                active = ownerDoc.body;
                            }
                            isFocused = (active === element);
                        }
                        var modelValue = valueAccessor();
                        ko.expressionRewriting.writeValueToProperty(modelValue, allBindings, 'hasfocus', isFocused, true);

                        //cache the latest value, so we can avoid unnecessarily calling focus/blur in the update function
                        element[hasfocusLastValue] = isFocused;
                        element[hasfocusUpdatingProperty] = false;
                    };
                    var handleElementFocusIn = handleElementFocusChange.bind(null, true);
                    var handleElementFocusOut = handleElementFocusChange.bind(null, false);

                    ko.utils.registerEventHandler(element, "focus", handleElementFocusIn);
                    ko.utils.registerEventHandler(element, "focusin", handleElementFocusIn); // For IE
                    ko.utils.registerEventHandler(element, "blur", handleElementFocusOut);
                    ko.utils.registerEventHandler(element, "focusout", handleElementFocusOut); // For IE
                },
                'update': function (element, valueAccessor) {
                    var value = !!ko.utils.unwrapObservable(valueAccessor()); //force boolean to compare with last value
                    if (!element[hasfocusUpdatingProperty] && element[hasfocusLastValue] !== value) {
                        value ? element.focus() : element.blur();
                        ko.dependencyDetection.ignore(ko.utils.triggerEvent, null, [element, value ? "focusin" : "focusout"]); // For IE, which doesn't reliably fire "focus" or "blur" events synchronously
                    }
                }
            };
            ko.expressionRewriting.twoWayBindings['hasfocus'] = true;

            ko.bindingHandlers['hasFocus'] = ko.bindingHandlers['hasfocus']; // Make "hasFocus" an alias
            ko.expressionRewriting.twoWayBindings['hasFocus'] = true;
            ko.bindingHandlers['html'] = {
                'init': function () {
                    // Prevent binding on the dynamically-injected HTML (as developers are unlikely to expect that, and it has security implications)
                    return { 'controlsDescendantBindings': true };
                },
                'update': function (element, valueAccessor) {
                    // setHtml will unwrap the value if needed
                    ko.utils.setHtml(element, valueAccessor());
                }
            };
            // Makes a binding like with or if
            function makeWithIfBinding(bindingKey, isWith, isNot, makeContextCallback) {
                ko.bindingHandlers[bindingKey] = {
                    'init': function (element, valueAccessor, allBindings, viewModel, bindingContext) {
                        var didDisplayOnLastUpdate,
                            savedNodes;
                        ko.computed(function () {
                            var dataValue = ko.utils.unwrapObservable(valueAccessor()),
                                shouldDisplay = !isNot !== !dataValue, // equivalent to isNot ? !dataValue : !!dataValue
                                isFirstRender = !savedNodes,
                                needsRefresh = isFirstRender || isWith || (shouldDisplay !== didDisplayOnLastUpdate);

                            if (needsRefresh) {
                                // Save a copy of the inner nodes on the initial update, but only if we have dependencies.
                                if (isFirstRender && ko.computedContext.getDependenciesCount()) {
                                    savedNodes = ko.utils.cloneNodes(ko.virtualElements.childNodes(element), true /* shouldCleanNodes */);
                                }

                                if (shouldDisplay) {
                                    if (!isFirstRender) {
                                        ko.virtualElements.setDomNodeChildren(element, ko.utils.cloneNodes(savedNodes));
                                    }
                                    ko.applyBindingsToDescendants(makeContextCallback ? makeContextCallback(bindingContext, dataValue) : bindingContext, element);
                                } else {
                                    ko.virtualElements.emptyNode(element);
                                }

                                didDisplayOnLastUpdate = shouldDisplay;
                            }
                        }, null, { disposeWhenNodeIsRemoved: element });
                        return { 'controlsDescendantBindings': true };
                    }
                };
                ko.expressionRewriting.bindingRewriteValidators[bindingKey] = false; // Can't rewrite control flow bindings
                ko.virtualElements.allowedBindings[bindingKey] = true;
            }

            // Construct the actual binding handlers
            makeWithIfBinding('if');
            makeWithIfBinding('ifnot', false /* isWith */, true /* isNot */);
            makeWithIfBinding('with', true /* isWith */, false /* isNot */,
                function (bindingContext, dataValue) {
                    return bindingContext['createChildContext'](dataValue);
                }
            );
            var captionPlaceholder = {};
            ko.bindingHandlers['options'] = {
                'init': function (element) {
                    if (ko.utils.tagNameLower(element) !== "select")
                        throw new Error("options binding applies only to SELECT elements");

                    // Remove all existing <option>s.
                    while (element.length > 0) {
                        element.remove(0);
                    }

                    // Ensures that the binding processor doesn't try to bind the options
                    return { 'controlsDescendantBindings': true };
                },
                'update': function (element, valueAccessor, allBindings) {
                    function selectedOptions() {
                        return ko.utils.arrayFilter(element.options, function (node) { return node.selected; });
                    }

                    var selectWasPreviouslyEmpty = element.length == 0;
                    var previousScrollTop = (!selectWasPreviouslyEmpty && element.multiple) ? element.scrollTop : null;
                    var unwrappedArray = ko.utils.unwrapObservable(valueAccessor());
                    var includeDestroyed = allBindings.get('optionsIncludeDestroyed');
                    var arrayToDomNodeChildrenOptions = {};
                    var captionValue;
                    var filteredArray;
                    var previousSelectedValues;

                    if (element.multiple) {
                        previousSelectedValues = ko.utils.arrayMap(selectedOptions(), ko.selectExtensions.readValue);
                    } else {
                        previousSelectedValues = element.selectedIndex >= 0 ? [ko.selectExtensions.readValue(element.options[element.selectedIndex])] : [];
                    }

                    if (unwrappedArray) {
                        if (typeof unwrappedArray.length == "undefined") // Coerce single value into array
                            unwrappedArray = [unwrappedArray];

                        // Filter out any entries marked as destroyed
                        filteredArray = ko.utils.arrayFilter(unwrappedArray, function (item) {
                            return includeDestroyed || item === undefined || item === null || !ko.utils.unwrapObservable(item['_destroy']);
                        });

                        // If caption is included, add it to the array
                        if (allBindings['has']('optionsCaption')) {
                            captionValue = ko.utils.unwrapObservable(allBindings.get('optionsCaption'));
                            // If caption value is null or undefined, don't show a caption
                            if (captionValue !== null && captionValue !== undefined) {
                                filteredArray.unshift(captionPlaceholder);
                            }
                        }
                    } else {
                        // If a falsy value is provided (e.g. null), we'll simply empty the select element
                    }

                    function applyToObject(object, predicate, defaultValue) {
                        var predicateType = typeof predicate;
                        if (predicateType == "function")    // Given a function; run it against the data value
                            return predicate(object);
                        else if (predicateType == "string") // Given a string; treat it as a property name on the data value
                            return object[predicate];
                        else                                // Given no optionsText arg; use the data value itself
                            return defaultValue;
                    }

                    // The following functions can run at two different times:
                    // The first is when the whole array is being updated directly from this binding handler.
                    // The second is when an observable value for a specific array entry is updated.
                    // oldOptions will be empty in the first case, but will be filled with the previously generated option in the second.
                    var itemUpdate = false;
                    function optionForArrayItem(arrayEntry, index, oldOptions) {
                        if (oldOptions.length) {
                            previousSelectedValues = oldOptions[0].selected ? [ko.selectExtensions.readValue(oldOptions[0])] : [];
                            itemUpdate = true;
                        }
                        var option = element.ownerDocument.createElement("option");
                        if (arrayEntry === captionPlaceholder) {
                            ko.utils.setTextContent(option, allBindings.get('optionsCaption'));
                            ko.selectExtensions.writeValue(option, undefined);
                        } else {
                            // Apply a value to the option element
                            var optionValue = applyToObject(arrayEntry, allBindings.get('optionsValue'), arrayEntry);
                            ko.selectExtensions.writeValue(option, ko.utils.unwrapObservable(optionValue));

                            // Apply some text to the option element
                            var optionText = applyToObject(arrayEntry, allBindings.get('optionsText'), optionValue);
                            ko.utils.setTextContent(option, optionText);
                        }
                        return [option];
                    }

                    // By using a beforeRemove callback, we delay the removal until after new items are added. This fixes a selection
                    // problem in IE<=8 and Firefox. See https://github.com/knockout/knockout/issues/1208
                    arrayToDomNodeChildrenOptions['beforeRemove'] =
                        function (option) {
                            element.removeChild(option);
                        };

                    function setSelectionCallback(arrayEntry, newOptions) {
                        // IE6 doesn't like us to assign selection to OPTION nodes before they're added to the document.
                        // That's why we first added them without selection. Now it's time to set the selection.
                        if (previousSelectedValues.length) {
                            var isSelected = ko.utils.arrayIndexOf(previousSelectedValues, ko.selectExtensions.readValue(newOptions[0])) >= 0;
                            ko.utils.setOptionNodeSelectionState(newOptions[0], isSelected);

                            // If this option was changed from being selected during a single-item update, notify the change
                            if (itemUpdate && !isSelected)
                                ko.dependencyDetection.ignore(ko.utils.triggerEvent, null, [element, "change"]);
                        }
                    }

                    var callback = setSelectionCallback;
                    if (allBindings['has']('optionsAfterRender')) {
                        callback = function (arrayEntry, newOptions) {
                            setSelectionCallback(arrayEntry, newOptions);
                            ko.dependencyDetection.ignore(allBindings.get('optionsAfterRender'), null, [newOptions[0], arrayEntry !== captionPlaceholder ? arrayEntry : undefined]);
                        }
                    }

                    ko.utils.setDomNodeChildrenFromArrayMapping(element, filteredArray, optionForArrayItem, arrayToDomNodeChildrenOptions, callback);

                    ko.dependencyDetection.ignore(function () {
                        if (allBindings.get('valueAllowUnset') && allBindings['has']('value')) {
                            // The model value is authoritative, so make sure its value is the one selected
                            ko.selectExtensions.writeValue(element, ko.utils.unwrapObservable(allBindings.get('value')), true /* allowUnset */);
                        } else {
                            // Determine if the selection has changed as a result of updating the options list
                            var selectionChanged;
                            if (element.multiple) {
                                // For a multiple-select box, compare the new selection count to the previous one
                                // But if nothing was selected before, the selection can't have changed
                                selectionChanged = previousSelectedValues.length && selectedOptions().length < previousSelectedValues.length;
                            } else {
                                // For a single-select box, compare the current value to the previous value
                                // But if nothing was selected before or nothing is selected now, just look for a change in selection
                                selectionChanged = (previousSelectedValues.length && element.selectedIndex >= 0)
                                    ? (ko.selectExtensions.readValue(element.options[element.selectedIndex]) !== previousSelectedValues[0])
                                    : (previousSelectedValues.length || element.selectedIndex >= 0);
                            }

                            // Ensure consistency between model value and selected option.
                            // If the dropdown was changed so that selection is no longer the same,
                            // notify the value or selectedOptions binding.
                            if (selectionChanged) {
                                ko.utils.triggerEvent(element, "change");
                            }
                        }
                    });

                    // Workaround for IE bug
                    ko.utils.ensureSelectElementIsRenderedCorrectly(element);

                    if (previousScrollTop && Math.abs(previousScrollTop - element.scrollTop) > 20)
                        element.scrollTop = previousScrollTop;
                }
            };
            ko.bindingHandlers['options'].optionValueDomDataKey = ko.utils.domData.nextKey();
            ko.bindingHandlers['selectedOptions'] = {
                'after': ['options', 'foreach'],
                'init': function (element, valueAccessor, allBindings) {
                    ko.utils.registerEventHandler(element, "change", function () {
                        var value = valueAccessor(), valueToWrite = [];
                        ko.utils.arrayForEach(element.getElementsByTagName("option"), function (node) {
                            if (node.selected)
                                valueToWrite.push(ko.selectExtensions.readValue(node));
                        });
                        ko.expressionRewriting.writeValueToProperty(value, allBindings, 'selectedOptions', valueToWrite);
                    });
                },
                'update': function (element, valueAccessor) {
                    if (ko.utils.tagNameLower(element) != "select")
                        throw new Error("values binding applies only to SELECT elements");

                    var newValue = ko.utils.unwrapObservable(valueAccessor());
                    if (newValue && typeof newValue.length == "number") {
                        ko.utils.arrayForEach(element.getElementsByTagName("option"), function (node) {
                            var isSelected = ko.utils.arrayIndexOf(newValue, ko.selectExtensions.readValue(node)) >= 0;
                            ko.utils.setOptionNodeSelectionState(node, isSelected);
                        });
                    }
                }
            };
            ko.expressionRewriting.twoWayBindings['selectedOptions'] = true;
            ko.bindingHandlers['style'] = {
                'update': function (element, valueAccessor) {
                    var value = ko.utils.unwrapObservable(valueAccessor() || {});
                    ko.utils.objectForEach(value, function (styleName, styleValue) {
                        styleValue = ko.utils.unwrapObservable(styleValue);

                        if (styleValue === null || styleValue === undefined || styleValue === false) {
                            // Empty string removes the value, whereas null/undefined have no effect
                            styleValue = "";
                        }

                        element.style[styleName] = styleValue;
                    });
                }
            };
            ko.bindingHandlers['submit'] = {
                'init': function (element, valueAccessor, allBindings, viewModel, bindingContext) {
                    if (typeof valueAccessor() != "function")
                        throw new Error("The value for a submit binding must be a function");
                    ko.utils.registerEventHandler(element, "submit", function (event) {
                        var handlerReturnValue;
                        var value = valueAccessor();
                        try { handlerReturnValue = value.call(bindingContext['$data'], element); }
                        finally {
                            if (handlerReturnValue !== true) { // Normally we want to prevent default action. Developer can override this be explicitly returning true.
                                if (event.preventDefault)
                                    event.preventDefault();
                                else
                                    event.returnValue = false;
                            }
                        }
                    });
                }
            };
            ko.bindingHandlers['text'] = {
                'init': function () {
                    // Prevent binding on the dynamically-injected text node (as developers are unlikely to expect that, and it has security implications).
                    // It should also make things faster, as we no longer have to consider whether the text node might be bindable.
                    return { 'controlsDescendantBindings': true };
                },
                'update': function (element, valueAccessor) {
                    ko.utils.setTextContent(element, valueAccessor());
                }
            };
            ko.virtualElements.allowedBindings['text'] = true;
            (function () {

                if (window && window.navigator) {
                    var parseVersion = function (matches) {
                        if (matches) {
                            return parseFloat(matches[1]);
                        }
                    };

                    // Detect various browser versions because some old versions don't fully support the 'input' event
                    var operaVersion = window.opera && window.opera.version && parseInt(window.opera.version()),
                        userAgent = window.navigator.userAgent,
                        safariVersion = parseVersion(userAgent.match(/^(?:(?!chrome).)*version\/([^ ]*) safari/i)),
                        firefoxVersion = parseVersion(userAgent.match(/Firefox\/([^ ]*)/));
                }

                // IE 8 and 9 have bugs that prevent the normal events from firing when the value changes.
                // But it does fire the 'selectionchange' event on many of those, presumably because the
                // cursor is moving and that counts as the selection changing. The 'selectionchange' event is
                // fired at the document level only and doesn't directly indicate which element changed. We
                // set up just one event handler for the document and use 'activeElement' to determine which
                // element was changed.
                if (ko.utils.ieVersion < 10) {
                    var selectionChangeRegisteredName = ko.utils.domData.nextKey(),
                        selectionChangeHandlerName = ko.utils.domData.nextKey();
                    var selectionChangeHandler = function (event) {
                        var target = this.activeElement,
                            handler = target && ko.utils.domData.get(target, selectionChangeHandlerName);
                        if (handler) {
                            handler(event);
                        }
                    };
                    var registerForSelectionChangeEvent = function (element, handler) {
                        var ownerDoc = element.ownerDocument;
                        if (!ko.utils.domData.get(ownerDoc, selectionChangeRegisteredName)) {
                            ko.utils.domData.set(ownerDoc, selectionChangeRegisteredName, true);
                            ko.utils.registerEventHandler(ownerDoc, 'selectionchange', selectionChangeHandler);
                        }
                        ko.utils.domData.set(element, selectionChangeHandlerName, handler);
                    };
                }

                ko.bindingHandlers['textInput'] = {
                    'init': function (element, valueAccessor, allBindings) {

                        var previousElementValue = element.value,
                            timeoutHandle,
                            elementValueBeforeEvent;

                        var updateModel = function (event) {
                            clearTimeout(timeoutHandle);
                            elementValueBeforeEvent = timeoutHandle = undefined;

                            var elementValue = element.value;
                            if (previousElementValue !== elementValue) {
                                // Provide a way for tests to know exactly which event was processed
                                if (DEBUG && event) element['_ko_textInputProcessedEvent'] = event.type;
                                previousElementValue = elementValue;
                                ko.expressionRewriting.writeValueToProperty(valueAccessor(), allBindings, 'textInput', elementValue);
                            }
                        };

                        var deferUpdateModel = function (event) {
                            if (!timeoutHandle) {
                                // The elementValueBeforeEvent variable is set *only* during the brief gap between an
                                // event firing and the updateModel function running. This allows us to ignore model
                                // updates that are from the previous state of the element, usually due to techniques
                                // such as rateLimit. Such updates, if not ignored, can cause keystrokes to be lost.
                                elementValueBeforeEvent = element.value;
                                var handler = DEBUG ? updateModel.bind(element, { type: event.type }) : updateModel;
                                timeoutHandle = setTimeout(handler, 4);
                            }
                        };

                        var updateView = function () {
                            var modelValue = ko.utils.unwrapObservable(valueAccessor());

                            if (modelValue === null || modelValue === undefined) {
                                modelValue = '';
                            }

                            if (elementValueBeforeEvent !== undefined && modelValue === elementValueBeforeEvent) {
                                setTimeout(updateView, 4);
                                return;
                            }

                            // Update the element only if the element and model are different. On some browsers, updating the value
                            // will move the cursor to the end of the input, which would be bad while the user is typing.
                            if (element.value !== modelValue) {
                                previousElementValue = modelValue;  // Make sure we ignore events (propertychange) that result from updating the value
                                element.value = modelValue;
                            }
                        };

                        var onEvent = function (event, handler) {
                            ko.utils.registerEventHandler(element, event, handler);
                        };

                        if (DEBUG && ko.bindingHandlers['textInput']['_forceUpdateOn']) {
                            // Provide a way for tests to specify exactly which events are bound
                            ko.utils.arrayForEach(ko.bindingHandlers['textInput']['_forceUpdateOn'], function (eventName) {
                                if (eventName.slice(0, 5) == 'after') {
                                    onEvent(eventName.slice(5), deferUpdateModel);
                                } else {
                                    onEvent(eventName, updateModel);
                                }
                            });
                        } else {
                            if (ko.utils.ieVersion < 10) {
                                // Internet Explorer <= 8 doesn't support the 'input' event, but does include 'propertychange' that fires whenever
                                // any property of an element changes. Unlike 'input', it also fires if a property is changed from JavaScript code,
                                // but that's an acceptable compromise for this binding. IE 9 does support 'input', but since it doesn't fire it
                                // when using autocomplete, we'll use 'propertychange' for it also.
                                onEvent('propertychange', function (event) {
                                    if (event.propertyName === 'value') {
                                        updateModel(event);
                                    }
                                });

                                if (ko.utils.ieVersion == 8) {
                                    // IE 8 has a bug where it fails to fire 'propertychange' on the first update following a value change from
                                    // JavaScript code. It also doesn't fire if you clear the entire value. To fix this, we bind to the following
                                    // events too.
                                    onEvent('keyup', updateModel);      // A single keystoke
                                    onEvent('keydown', updateModel);    // The first character when a key is held down
                                }
                                if (ko.utils.ieVersion >= 8) {
                                    // Internet Explorer 9 doesn't fire the 'input' event when deleting text, including using
                                    // the backspace, delete, or ctrl-x keys, clicking the 'x' to clear the input, dragging text
                                    // out of the field, and cutting or deleting text using the context menu. 'selectionchange'
                                    // can detect all of those except dragging text out of the field, for which we use 'dragend'.
                                    // These are also needed in IE8 because of the bug described above.
                                    registerForSelectionChangeEvent(element, updateModel);  // 'selectionchange' covers cut, paste, drop, delete, etc.
                                    onEvent('dragend', deferUpdateModel);
                                }
                            } else {
                                // All other supported browsers support the 'input' event, which fires whenever the content of the element is changed
                                // through the user interface.
                                onEvent('input', updateModel);

                                if (safariVersion < 5 && ko.utils.tagNameLower(element) === "textarea") {
                                    // Safari <5 doesn't fire the 'input' event for <textarea> elements (it does fire 'textInput'
                                    // but only when typing). So we'll just catch as much as we can with keydown, cut, and paste.
                                    onEvent('keydown', deferUpdateModel);
                                    onEvent('paste', deferUpdateModel);
                                    onEvent('cut', deferUpdateModel);
                                } else if (operaVersion < 11) {
                                    // Opera 10 doesn't always fire the 'input' event for cut, paste, undo & drop operations.
                                    // We can try to catch some of those using 'keydown'.
                                    onEvent('keydown', deferUpdateModel);
                                } else if (firefoxVersion < 4.0) {
                                    // Firefox <= 3.6 doesn't fire the 'input' event when text is filled in through autocomplete
                                    onEvent('DOMAutoComplete', updateModel);

                                    // Firefox <=3.5 doesn't fire the 'input' event when text is dropped into the input.
                                    onEvent('dragdrop', updateModel);       // <3.5
                                    onEvent('drop', updateModel);           // 3.5
                                }
                            }
                        }

                        // Bind to the change event so that we can catch programmatic updates of the value that fire this event.
                        onEvent('change', updateModel);

                        ko.computed(updateView, null, { disposeWhenNodeIsRemoved: element });
                    }
                };
                ko.expressionRewriting.twoWayBindings['textInput'] = true;

                // textinput is an alias for textInput
                ko.bindingHandlers['textinput'] = {
                    // preprocess is the only way to set up a full alias
                    'preprocess': function (value, name, addBinding) {
                        addBinding('textInput', value);
                    }
                };

            })(); ko.bindingHandlers['uniqueName'] = {
                'init': function (element, valueAccessor) {
                    if (valueAccessor()) {
                        var name = "ko_unique_" + (++ko.bindingHandlers['uniqueName'].currentIndex);
                        ko.utils.setElementName(element, name);
                    }
                }
            };
            ko.bindingHandlers['uniqueName'].currentIndex = 0;
            ko.bindingHandlers['value'] = {
                'after': ['options', 'foreach'],
                'init': function (element, valueAccessor, allBindings) {
                    // If the value binding is placed on a radio/checkbox, then just pass through to checkedValue and quit
                    if (element.tagName.toLowerCase() == "input" && (element.type == "checkbox" || element.type == "radio")) {
                        ko.applyBindingAccessorsToNode(element, { 'checkedValue': valueAccessor });
                        return;
                    }

                    // Always catch "change" event; possibly other events too if asked
                    var eventsToCatch = ["change"];
                    var requestedEventsToCatch = allBindings.get("valueUpdate");
                    var propertyChangedFired = false;
                    var elementValueBeforeEvent = null;

                    if (requestedEventsToCatch) {
                        if (typeof requestedEventsToCatch == "string") // Allow both individual event names, and arrays of event names
                            requestedEventsToCatch = [requestedEventsToCatch];
                        ko.utils.arrayPushAll(eventsToCatch, requestedEventsToCatch);
                        eventsToCatch = ko.utils.arrayGetDistinctValues(eventsToCatch);
                    }

                    var valueUpdateHandler = function () {
                        elementValueBeforeEvent = null;
                        propertyChangedFired = false;
                        var modelValue = valueAccessor();
                        var elementValue = ko.selectExtensions.readValue(element);
                        ko.expressionRewriting.writeValueToProperty(modelValue, allBindings, 'value', elementValue);
                    }

                    // Workaround for https://github.com/SteveSanderson/knockout/issues/122
                    // IE doesn't fire "change" events on textboxes if the user selects a value from its autocomplete list
                    var ieAutoCompleteHackNeeded = ko.utils.ieVersion && element.tagName.toLowerCase() == "input" && element.type == "text"
                                                   && element.autocomplete != "off" && (!element.form || element.form.autocomplete != "off");
                    if (ieAutoCompleteHackNeeded && ko.utils.arrayIndexOf(eventsToCatch, "propertychange") == -1) {
                        ko.utils.registerEventHandler(element, "propertychange", function () { propertyChangedFired = true });
                        ko.utils.registerEventHandler(element, "focus", function () { propertyChangedFired = false });
                        ko.utils.registerEventHandler(element, "blur", function () {
                            if (propertyChangedFired) {
                                valueUpdateHandler();
                            }
                        });
                    }

                    ko.utils.arrayForEach(eventsToCatch, function (eventName) {
                        // The syntax "after<eventname>" means "run the handler asynchronously after the event"
                        // This is useful, for example, to catch "keydown" events after the browser has updated the control
                        // (otherwise, ko.selectExtensions.readValue(this) will receive the control's value *before* the key event)
                        var handler = valueUpdateHandler;
                        if (ko.utils.stringStartsWith(eventName, "after")) {
                            handler = function () {
                                // The elementValueBeforeEvent variable is non-null *only* during the brief gap between
                                // a keyX event firing and the valueUpdateHandler running, which is scheduled to happen
                                // at the earliest asynchronous opportunity. We store this temporary information so that
                                // if, between keyX and valueUpdateHandler, the underlying model value changes separately,
                                // we can overwrite that model value change with the value the user just typed. Otherwise,
                                // techniques like rateLimit can trigger model changes at critical moments that will
                                // override the user's inputs, causing keystrokes to be lost.
                                elementValueBeforeEvent = ko.selectExtensions.readValue(element);
                                setTimeout(valueUpdateHandler, 0);
                            };
                            eventName = eventName.substring("after".length);
                        }
                        ko.utils.registerEventHandler(element, eventName, handler);
                    });

                    var updateFromModel = function () {
                        var newValue = ko.utils.unwrapObservable(valueAccessor());
                        var elementValue = ko.selectExtensions.readValue(element);

                        if (elementValueBeforeEvent !== null && newValue === elementValueBeforeEvent) {
                            setTimeout(updateFromModel, 0);
                            return;
                        }

                        var valueHasChanged = (newValue !== elementValue);

                        if (valueHasChanged) {
                            if (ko.utils.tagNameLower(element) === "select") {
                                var allowUnset = allBindings.get('valueAllowUnset');
                                var applyValueAction = function () {
                                    ko.selectExtensions.writeValue(element, newValue, allowUnset);
                                };
                                applyValueAction();

                                if (!allowUnset && newValue !== ko.selectExtensions.readValue(element)) {
                                    // If you try to set a model value that can't be represented in an already-populated dropdown, reject that change,
                                    // because you're not allowed to have a model value that disagrees with a visible UI selection.
                                    ko.dependencyDetection.ignore(ko.utils.triggerEvent, null, [element, "change"]);
                                } else {
                                    // Workaround for IE6 bug: It won't reliably apply values to SELECT nodes during the same execution thread
                                    // right after you've changed the set of OPTION nodes on it. So for that node type, we'll schedule a second thread
                                    // to apply the value as well.
                                    setTimeout(applyValueAction, 0);
                                }
                            } else {
                                ko.selectExtensions.writeValue(element, newValue);
                            }
                        }
                    };

                    ko.computed(updateFromModel, null, { disposeWhenNodeIsRemoved: element });
                },
                'update': function () { } // Keep for backwards compatibility with code that may have wrapped value binding
            };
            ko.expressionRewriting.twoWayBindings['value'] = true;
            ko.bindingHandlers['visible'] = {
                'update': function (element, valueAccessor) {
                    var value = ko.utils.unwrapObservable(valueAccessor());
                    var isCurrentlyVisible = !(element.style.display == "none");
                    if (value && !isCurrentlyVisible)
                        element.style.display = "";
                    else if ((!value) && isCurrentlyVisible)
                        element.style.display = "none";
                }
            };
            // 'click' is just a shorthand for the usual full-length event:{click:handler}
            makeEventHandlerShortcut('click');
            // If you want to make a custom template engine,
            //
            // [1] Inherit from this class (like ko.nativeTemplateEngine does)
            // [2] Override 'renderTemplateSource', supplying a function with this signature:
            //
            //        function (templateSource, bindingContext, options) {
            //            // - templateSource.text() is the text of the template you should render
            //            // - bindingContext.$data is the data you should pass into the template
            //            //   - you might also want to make bindingContext.$parent, bindingContext.$parents,
            //            //     and bindingContext.$root available in the template too
            //            // - options gives you access to any other properties set on "data-bind: { template: options }"
            //            //
            //            // Return value: an array of DOM nodes
            //        }
            //
            // [3] Override 'createJavaScriptEvaluatorBlock', supplying a function with this signature:
            //
            //        function (script) {
            //            // Return value: Whatever syntax means "Evaluate the JavaScript statement 'script' and output the result"
            //            //               For example, the jquery.tmpl template engine converts 'someScript' to '${ someScript }'
            //        }
            //
            //     This is only necessary if you want to allow data-bind attributes to reference arbitrary template variables.
            //     If you don't want to allow that, you can set the property 'allowTemplateRewriting' to false (like ko.nativeTemplateEngine does)
            //     and then you don't need to override 'createJavaScriptEvaluatorBlock'.

            ko.templateEngine = function () { };

            ko.templateEngine.prototype['renderTemplateSource'] = function (templateSource, bindingContext, options) {
                throw new Error("Override renderTemplateSource");
            };

            ko.templateEngine.prototype['createJavaScriptEvaluatorBlock'] = function (script) {
                throw new Error("Override createJavaScriptEvaluatorBlock");
            };

            ko.templateEngine.prototype['makeTemplateSource'] = function (template, templateDocument) {
                // Named template
                if (typeof template == "string") {
                    templateDocument = templateDocument || document;
                    var elem = templateDocument.getElementById(template);
                    if (!elem)
                        throw new Error("Cannot find template with ID " + template);
                    return new ko.templateSources.domElement(elem);
                } else if ((template.nodeType == 1) || (template.nodeType == 8)) {
                    // Anonymous template
                    return new ko.templateSources.anonymousTemplate(template);
                } else
                    throw new Error("Unknown template type: " + template);
            };

            ko.templateEngine.prototype['renderTemplate'] = function (template, bindingContext, options, templateDocument) {
                var templateSource = this['makeTemplateSource'](template, templateDocument);
                return this['renderTemplateSource'](templateSource, bindingContext, options);
            };

            ko.templateEngine.prototype['isTemplateRewritten'] = function (template, templateDocument) {
                // Skip rewriting if requested
                if (this['allowTemplateRewriting'] === false)
                    return true;
                return this['makeTemplateSource'](template, templateDocument)['data']("isRewritten");
            };

            ko.templateEngine.prototype['rewriteTemplate'] = function (template, rewriterCallback, templateDocument) {
                var templateSource = this['makeTemplateSource'](template, templateDocument);
                var rewritten = rewriterCallback(templateSource['text']());
                templateSource['text'](rewritten);
                templateSource['data']("isRewritten", true);
            };

            ko.exportSymbol('templateEngine', ko.templateEngine);

            ko.templateRewriting = (function () {
                var memoizeDataBindingAttributeSyntaxRegex = /(<([a-z]+\d*)(?:\s+(?!data-bind\s*=\s*)[a-z0-9\-]+(?:=(?:\"[^\"]*\"|\'[^\']*\'))?)*\s+)data-bind\s*=\s*(["'])([\s\S]*?)\3/gi;
                var memoizeVirtualContainerBindingSyntaxRegex = /<!--\s*ko\b\s*([\s\S]*?)\s*-->/g;

                function validateDataBindValuesForRewriting(keyValueArray) {
                    var allValidators = ko.expressionRewriting.bindingRewriteValidators;
                    for (var i = 0; i < keyValueArray.length; i++) {
                        var key = keyValueArray[i]['key'];
                        if (allValidators.hasOwnProperty(key)) {
                            var validator = allValidators[key];

                            if (typeof validator === "function") {
                                var possibleErrorMessage = validator(keyValueArray[i]['value']);
                                if (possibleErrorMessage)
                                    throw new Error(possibleErrorMessage);
                            } else if (!validator) {
                                throw new Error("This template engine does not support the '" + key + "' binding within its templates");
                            }
                        }
                    }
                }

                function constructMemoizedTagReplacement(dataBindAttributeValue, tagToRetain, nodeName, templateEngine) {
                    var dataBindKeyValueArray = ko.expressionRewriting.parseObjectLiteral(dataBindAttributeValue);
                    validateDataBindValuesForRewriting(dataBindKeyValueArray);
                    var rewrittenDataBindAttributeValue = ko.expressionRewriting.preProcessBindings(dataBindKeyValueArray, { 'valueAccessors': true });

                    // For no obvious reason, Opera fails to evaluate rewrittenDataBindAttributeValue unless it's wrapped in an additional
                    // anonymous function, even though Opera's built-in debugger can evaluate it anyway. No other browser requires this
                    // extra indirection.
                    var applyBindingsToNextSiblingScript =
                        "ko.__tr_ambtns(function($context,$element){return(function(){return{ " + rewrittenDataBindAttributeValue + " } })()},'" + nodeName.toLowerCase() + "')";
                    return templateEngine['createJavaScriptEvaluatorBlock'](applyBindingsToNextSiblingScript) + tagToRetain;
                }

                return {
                    ensureTemplateIsRewritten: function (template, templateEngine, templateDocument) {
                        if (!templateEngine['isTemplateRewritten'](template, templateDocument))
                            templateEngine['rewriteTemplate'](template, function (htmlString) {
                                return ko.templateRewriting.memoizeBindingAttributeSyntax(htmlString, templateEngine);
                            }, templateDocument);
                    },

                    memoizeBindingAttributeSyntax: function (htmlString, templateEngine) {
                        return htmlString.replace(memoizeDataBindingAttributeSyntaxRegex, function () {
                            return constructMemoizedTagReplacement(/* dataBindAttributeValue: */ arguments[4], /* tagToRetain: */ arguments[1], /* nodeName: */ arguments[2], templateEngine);
                        }).replace(memoizeVirtualContainerBindingSyntaxRegex, function () {
                            return constructMemoizedTagReplacement(/* dataBindAttributeValue: */ arguments[1], /* tagToRetain: */ "<!-- ko -->", /* nodeName: */ "#comment", templateEngine);
                        });
                    },

                    applyMemoizedBindingsToNextSibling: function (bindings, nodeName) {
                        return ko.memoization.memoize(function (domNode, bindingContext) {
                            var nodeToBind = domNode.nextSibling;
                            if (nodeToBind && nodeToBind.nodeName.toLowerCase() === nodeName) {
                                ko.applyBindingAccessorsToNode(nodeToBind, bindings, bindingContext);
                            }
                        });
                    }
                }
            })();


            // Exported only because it has to be referenced by string lookup from within rewritten template
            ko.exportSymbol('__tr_ambtns', ko.templateRewriting.applyMemoizedBindingsToNextSibling);
            (function () {
                // A template source represents a read/write way of accessing a template. This is to eliminate the need for template loading/saving
                // logic to be duplicated in every template engine (and means they can all work with anonymous templates, etc.)
                //
                // Two are provided by default:
                //  1. ko.templateSources.domElement       - reads/writes the text content of an arbitrary DOM element
                //  2. ko.templateSources.anonymousElement - uses ko.utils.domData to read/write text *associated* with the DOM element, but
                //                                           without reading/writing the actual element text content, since it will be overwritten
                //                                           with the rendered template output.
                // You can implement your own template source if you want to fetch/store templates somewhere other than in DOM elements.
                // Template sources need to have the following functions:
                //   text() 			- returns the template text from your storage location
                //   text(value)		- writes the supplied template text to your storage location
                //   data(key)			- reads values stored using data(key, value) - see below
                //   data(key, value)	- associates "value" with this template and the key "key". Is used to store information like "isRewritten".
                //
                // Optionally, template sources can also have the following functions:
                //   nodes()            - returns a DOM element containing the nodes of this template, where available
                //   nodes(value)       - writes the given DOM element to your storage location
                // If a DOM element is available for a given template source, template engines are encouraged to use it in preference over text()
                // for improved speed. However, all templateSources must supply text() even if they don't supply nodes().
                //
                // Once you've implemented a templateSource, make your template engine use it by subclassing whatever template engine you were
                // using and overriding "makeTemplateSource" to return an instance of your custom template source.

                ko.templateSources = {};

                // ---- ko.templateSources.domElement -----

                ko.templateSources.domElement = function (element) {
                    this.domElement = element;
                }

                ko.templateSources.domElement.prototype['text'] = function (/* valueToWrite */) {
                    var tagNameLower = ko.utils.tagNameLower(this.domElement),
                        elemContentsProperty = tagNameLower === "script" ? "text"
                                             : tagNameLower === "textarea" ? "value"
                                             : "innerHTML";

                    if (arguments.length == 0) {
                        return this.domElement[elemContentsProperty];
                    } else {
                        var valueToWrite = arguments[0];
                        if (elemContentsProperty === "innerHTML")
                            ko.utils.setHtml(this.domElement, valueToWrite);
                        else
                            this.domElement[elemContentsProperty] = valueToWrite;
                    }
                };

                var dataDomDataPrefix = ko.utils.domData.nextKey() + "_";
                ko.templateSources.domElement.prototype['data'] = function (key /*, valueToWrite */) {
                    if (arguments.length === 1) {
                        return ko.utils.domData.get(this.domElement, dataDomDataPrefix + key);
                    } else {
                        ko.utils.domData.set(this.domElement, dataDomDataPrefix + key, arguments[1]);
                    }
                };

                // ---- ko.templateSources.anonymousTemplate -----
                // Anonymous templates are normally saved/retrieved as DOM nodes through "nodes".
                // For compatibility, you can also read "text"; it will be serialized from the nodes on demand.
                // Writing to "text" is still supported, but then the template data will not be available as DOM nodes.

                var anonymousTemplatesDomDataKey = ko.utils.domData.nextKey();
                ko.templateSources.anonymousTemplate = function (element) {
                    this.domElement = element;
                }
                ko.templateSources.anonymousTemplate.prototype = new ko.templateSources.domElement();
                ko.templateSources.anonymousTemplate.prototype.constructor = ko.templateSources.anonymousTemplate;
                ko.templateSources.anonymousTemplate.prototype['text'] = function (/* valueToWrite */) {
                    if (arguments.length == 0) {
                        var templateData = ko.utils.domData.get(this.domElement, anonymousTemplatesDomDataKey) || {};
                        if (templateData.textData === undefined && templateData.containerData)
                            templateData.textData = templateData.containerData.innerHTML;
                        return templateData.textData;
                    } else {
                        var valueToWrite = arguments[0];
                        ko.utils.domData.set(this.domElement, anonymousTemplatesDomDataKey, { textData: valueToWrite });
                    }
                };
                ko.templateSources.domElement.prototype['nodes'] = function (/* valueToWrite */) {
                    if (arguments.length == 0) {
                        var templateData = ko.utils.domData.get(this.domElement, anonymousTemplatesDomDataKey) || {};
                        return templateData.containerData;
                    } else {
                        var valueToWrite = arguments[0];
                        ko.utils.domData.set(this.domElement, anonymousTemplatesDomDataKey, { containerData: valueToWrite });
                    }
                };

                ko.exportSymbol('templateSources', ko.templateSources);
                ko.exportSymbol('templateSources.domElement', ko.templateSources.domElement);
                ko.exportSymbol('templateSources.anonymousTemplate', ko.templateSources.anonymousTemplate);
            })();
            (function () {
                var _templateEngine;
                ko.setTemplateEngine = function (templateEngine) {
                    if ((templateEngine != undefined) && !(templateEngine instanceof ko.templateEngine))
                        throw new Error("templateEngine must inherit from ko.templateEngine");
                    _templateEngine = templateEngine;
                }

                function invokeForEachNodeInContinuousRange(firstNode, lastNode, action) {
                    var node, nextInQueue = firstNode, firstOutOfRangeNode = ko.virtualElements.nextSibling(lastNode);
                    while (nextInQueue && ((node = nextInQueue) !== firstOutOfRangeNode)) {
                        nextInQueue = ko.virtualElements.nextSibling(node);
                        action(node, nextInQueue);
                    }
                }

                function activateBindingsOnContinuousNodeArray(continuousNodeArray, bindingContext) {
                    // To be used on any nodes that have been rendered by a template and have been inserted into some parent element
                    // Walks through continuousNodeArray (which *must* be continuous, i.e., an uninterrupted sequence of sibling nodes, because
                    // the algorithm for walking them relies on this), and for each top-level item in the virtual-element sense,
                    // (1) Does a regular "applyBindings" to associate bindingContext with this node and to activate any non-memoized bindings
                    // (2) Unmemoizes any memos in the DOM subtree (e.g., to activate bindings that had been memoized during template rewriting)

                    if (continuousNodeArray.length) {
                        var firstNode = continuousNodeArray[0],
                            lastNode = continuousNodeArray[continuousNodeArray.length - 1],
                            parentNode = firstNode.parentNode,
                            provider = ko.bindingProvider['instance'],
                            preprocessNode = provider['preprocessNode'];

                        if (preprocessNode) {
                            invokeForEachNodeInContinuousRange(firstNode, lastNode, function (node, nextNodeInRange) {
                                var nodePreviousSibling = node.previousSibling;
                                var newNodes = preprocessNode.call(provider, node);
                                if (newNodes) {
                                    if (node === firstNode)
                                        firstNode = newNodes[0] || nextNodeInRange;
                                    if (node === lastNode)
                                        lastNode = newNodes[newNodes.length - 1] || nodePreviousSibling;
                                }
                            });

                            // Because preprocessNode can change the nodes, including the first and last nodes, update continuousNodeArray to match.
                            // We need the full set, including inner nodes, because the unmemoize step might remove the first node (and so the real
                            // first node needs to be in the array).
                            continuousNodeArray.length = 0;
                            if (!firstNode) { // preprocessNode might have removed all the nodes, in which case there's nothing left to do
                                return;
                            }
                            if (firstNode === lastNode) {
                                continuousNodeArray.push(firstNode);
                            } else {
                                continuousNodeArray.push(firstNode, lastNode);
                                ko.utils.fixUpContinuousNodeArray(continuousNodeArray, parentNode);
                            }
                        }

                        // Need to applyBindings *before* unmemoziation, because unmemoization might introduce extra nodes (that we don't want to re-bind)
                        // whereas a regular applyBindings won't introduce new memoized nodes
                        invokeForEachNodeInContinuousRange(firstNode, lastNode, function (node) {
                            if (node.nodeType === 1 || node.nodeType === 8)
                                ko.applyBindings(bindingContext, node);
                        });
                        invokeForEachNodeInContinuousRange(firstNode, lastNode, function (node) {
                            if (node.nodeType === 1 || node.nodeType === 8)
                                ko.memoization.unmemoizeDomNodeAndDescendants(node, [bindingContext]);
                        });

                        // Make sure any changes done by applyBindings or unmemoize are reflected in the array
                        ko.utils.fixUpContinuousNodeArray(continuousNodeArray, parentNode);
                    }
                }

                function getFirstNodeFromPossibleArray(nodeOrNodeArray) {
                    return nodeOrNodeArray.nodeType ? nodeOrNodeArray
                                                    : nodeOrNodeArray.length > 0 ? nodeOrNodeArray[0]
                                                    : null;
                }

                function executeTemplate(targetNodeOrNodeArray, renderMode, template, bindingContext, options) {
                    options = options || {};
                    var firstTargetNode = targetNodeOrNodeArray && getFirstNodeFromPossibleArray(targetNodeOrNodeArray);
                    var templateDocument = firstTargetNode && firstTargetNode.ownerDocument;
                    var templateEngineToUse = (options['templateEngine'] || _templateEngine);
                    ko.templateRewriting.ensureTemplateIsRewritten(template, templateEngineToUse, templateDocument);
                    var renderedNodesArray = templateEngineToUse['renderTemplate'](template, bindingContext, options, templateDocument);

                    // Loosely check result is an array of DOM nodes
                    if ((typeof renderedNodesArray.length != "number") || (renderedNodesArray.length > 0 && typeof renderedNodesArray[0].nodeType != "number"))
                        throw new Error("Template engine must return an array of DOM nodes");

                    var haveAddedNodesToParent = false;
                    switch (renderMode) {
                        case "replaceChildren":
                            ko.virtualElements.setDomNodeChildren(targetNodeOrNodeArray, renderedNodesArray);
                            haveAddedNodesToParent = true;
                            break;
                        case "replaceNode":
                            ko.utils.replaceDomNodes(targetNodeOrNodeArray, renderedNodesArray);
                            haveAddedNodesToParent = true;
                            break;
                        case "ignoreTargetNode": break;
                        default:
                            throw new Error("Unknown renderMode: " + renderMode);
                    }

                    if (haveAddedNodesToParent) {
                        activateBindingsOnContinuousNodeArray(renderedNodesArray, bindingContext);
                        if (options['afterRender'])
                            ko.dependencyDetection.ignore(options['afterRender'], null, [renderedNodesArray, bindingContext['$data']]);
                    }

                    return renderedNodesArray;
                }

                function resolveTemplateName(template, data, context) {
                    // The template can be specified as:
                    if (ko.isObservable(template)) {
                        // 1. An observable, with string value
                        return template();
                    } else if (typeof template === 'function') {
                        // 2. A function of (data, context) returning a string
                        return template(data, context);
                    } else {
                        // 3. A string
                        return template;
                    }
                }

                ko.renderTemplate = function (template, dataOrBindingContext, options, targetNodeOrNodeArray, renderMode) {
                    options = options || {};
                    if ((options['templateEngine'] || _templateEngine) == undefined)
                        throw new Error("Set a template engine before calling renderTemplate");
                    renderMode = renderMode || "replaceChildren";

                    if (targetNodeOrNodeArray) {
                        var firstTargetNode = getFirstNodeFromPossibleArray(targetNodeOrNodeArray);

                        var whenToDispose = function () { return (!firstTargetNode) || !ko.utils.domNodeIsAttachedToDocument(firstTargetNode); }; // Passive disposal (on next evaluation)
                        var activelyDisposeWhenNodeIsRemoved = (firstTargetNode && renderMode == "replaceNode") ? firstTargetNode.parentNode : firstTargetNode;

                        return ko.dependentObservable( // So the DOM is automatically updated when any dependency changes
                            function () {
                                // Ensure we've got a proper binding context to work with
                                var bindingContext = (dataOrBindingContext && (dataOrBindingContext instanceof ko.bindingContext))
                                    ? dataOrBindingContext
                                    : new ko.bindingContext(ko.utils.unwrapObservable(dataOrBindingContext));

                                var templateName = resolveTemplateName(template, bindingContext['$data'], bindingContext),
                                    renderedNodesArray = executeTemplate(targetNodeOrNodeArray, renderMode, templateName, bindingContext, options);

                                if (renderMode == "replaceNode") {
                                    targetNodeOrNodeArray = renderedNodesArray;
                                    firstTargetNode = getFirstNodeFromPossibleArray(targetNodeOrNodeArray);
                                }
                            },
                            null,
                            { disposeWhen: whenToDispose, disposeWhenNodeIsRemoved: activelyDisposeWhenNodeIsRemoved }
                        );
                    } else {
                        // We don't yet have a DOM node to evaluate, so use a memo and render the template later when there is a DOM node
                        return ko.memoization.memoize(function (domNode) {
                            ko.renderTemplate(template, dataOrBindingContext, options, domNode, "replaceNode");
                        });
                    }
                };

                ko.renderTemplateForEach = function (template, arrayOrObservableArray, options, targetNode, parentBindingContext) {
                    // Since setDomNodeChildrenFromArrayMapping always calls executeTemplateForArrayItem and then
                    // activateBindingsCallback for added items, we can store the binding context in the former to use in the latter.
                    var arrayItemContext;

                    // This will be called by setDomNodeChildrenFromArrayMapping to get the nodes to add to targetNode
                    var executeTemplateForArrayItem = function (arrayValue, index) {
                        // Support selecting template as a function of the data being rendered
                        arrayItemContext = parentBindingContext['createChildContext'](arrayValue, options['as'], function (context) {
                            context['$index'] = index;
                        });

                        var templateName = resolveTemplateName(template, arrayValue, arrayItemContext);
                        return executeTemplate(null, "ignoreTargetNode", templateName, arrayItemContext, options);
                    }

                    // This will be called whenever setDomNodeChildrenFromArrayMapping has added nodes to targetNode
                    var activateBindingsCallback = function (arrayValue, addedNodesArray, index) {
                        activateBindingsOnContinuousNodeArray(addedNodesArray, arrayItemContext);
                        if (options['afterRender'])
                            options['afterRender'](addedNodesArray, arrayValue);
                    };

                    return ko.dependentObservable(function () {
                        var unwrappedArray = ko.utils.unwrapObservable(arrayOrObservableArray) || [];
                        if (typeof unwrappedArray.length == "undefined") // Coerce single value into array
                            unwrappedArray = [unwrappedArray];

                        // Filter out any entries marked as destroyed
                        var filteredArray = ko.utils.arrayFilter(unwrappedArray, function (item) {
                            return options['includeDestroyed'] || item === undefined || item === null || !ko.utils.unwrapObservable(item['_destroy']);
                        });

                        // Call setDomNodeChildrenFromArrayMapping, ignoring any observables unwrapped within (most likely from a callback function).
                        // If the array items are observables, though, they will be unwrapped in executeTemplateForArrayItem and managed within setDomNodeChildrenFromArrayMapping.
                        ko.dependencyDetection.ignore(ko.utils.setDomNodeChildrenFromArrayMapping, null, [targetNode, filteredArray, executeTemplateForArrayItem, options, activateBindingsCallback]);

                    }, null, { disposeWhenNodeIsRemoved: targetNode });
                };

                var templateComputedDomDataKey = ko.utils.domData.nextKey();
                function disposeOldComputedAndStoreNewOne(element, newComputed) {
                    var oldComputed = ko.utils.domData.get(element, templateComputedDomDataKey);
                    if (oldComputed && (typeof (oldComputed.dispose) == 'function'))
                        oldComputed.dispose();
                    ko.utils.domData.set(element, templateComputedDomDataKey, (newComputed && newComputed.isActive()) ? newComputed : undefined);
                }

                ko.bindingHandlers['template'] = {
                    'init': function (element, valueAccessor) {
                        // Support anonymous templates
                        var bindingValue = ko.utils.unwrapObservable(valueAccessor());
                        if (typeof bindingValue == "string" || bindingValue['name']) {
                            // It's a named template - clear the element
                            ko.virtualElements.emptyNode(element);
                        } else {
                            // It's an anonymous template - store the element contents, then clear the element
                            var templateNodes = ko.virtualElements.childNodes(element),
                                container = ko.utils.moveCleanedNodesToContainerElement(templateNodes); // This also removes the nodes from their current parent
                            new ko.templateSources.anonymousTemplate(element)['nodes'](container);
                        }
                        return { 'controlsDescendantBindings': true };
                    },
                    'update': function (element, valueAccessor, allBindings, viewModel, bindingContext) {
                        var value = valueAccessor(),
                            dataValue,
                            options = ko.utils.unwrapObservable(value),
                            shouldDisplay = true,
                            templateComputed = null,
                            templateName;

                        if (typeof options == "string") {
                            templateName = value;
                            options = {};
                        } else {
                            templateName = options['name'];

                            // Support "if"/"ifnot" conditions
                            if ('if' in options)
                                shouldDisplay = ko.utils.unwrapObservable(options['if']);
                            if (shouldDisplay && 'ifnot' in options)
                                shouldDisplay = !ko.utils.unwrapObservable(options['ifnot']);

                            dataValue = ko.utils.unwrapObservable(options['data']);
                        }

                        if ('foreach' in options) {
                            // Render once for each data point (treating data set as empty if shouldDisplay==false)
                            var dataArray = (shouldDisplay && options['foreach']) || [];
                            templateComputed = ko.renderTemplateForEach(templateName || element, dataArray, options, element, bindingContext);
                        } else if (!shouldDisplay) {
                            ko.virtualElements.emptyNode(element);
                        } else {
                            // Render once for this single data point (or use the viewModel if no data was provided)
                            var innerBindingContext = ('data' in options) ?
                                bindingContext['createChildContext'](dataValue, options['as']) :  // Given an explitit 'data' value, we create a child binding context for it
                                bindingContext;                                                        // Given no explicit 'data' value, we retain the same binding context
                            templateComputed = ko.renderTemplate(templateName || element, innerBindingContext, options, element);
                        }

                        // It only makes sense to have a single template computed per element (otherwise which one should have its output displayed?)
                        disposeOldComputedAndStoreNewOne(element, templateComputed);
                    }
                };

                // Anonymous templates can't be rewritten. Give a nice error message if you try to do it.
                ko.expressionRewriting.bindingRewriteValidators['template'] = function (bindingValue) {
                    var parsedBindingValue = ko.expressionRewriting.parseObjectLiteral(bindingValue);

                    if ((parsedBindingValue.length == 1) && parsedBindingValue[0]['unknown'])
                        return null; // It looks like a string literal, not an object literal, so treat it as a named template (which is allowed for rewriting)

                    if (ko.expressionRewriting.keyValueArrayContainsKey(parsedBindingValue, "name"))
                        return null; // Named templates can be rewritten, so return "no error"
                    return "This template engine does not support anonymous templates nested within its templates";
                };

                ko.virtualElements.allowedBindings['template'] = true;
            })();

            ko.exportSymbol('setTemplateEngine', ko.setTemplateEngine);
            ko.exportSymbol('renderTemplate', ko.renderTemplate);
            // Go through the items that have been added and deleted and try to find matches between them.
            ko.utils.findMovesInArrayComparison = function (left, right, limitFailedCompares) {
                if (left.length && right.length) {
                    var failedCompares, l, r, leftItem, rightItem;
                    for (failedCompares = l = 0; (!limitFailedCompares || failedCompares < limitFailedCompares) && (leftItem = left[l]) ; ++l) {
                        for (r = 0; rightItem = right[r]; ++r) {
                            if (leftItem['value'] === rightItem['value']) {
                                leftItem['moved'] = rightItem['index'];
                                rightItem['moved'] = leftItem['index'];
                                right.splice(r, 1);         // This item is marked as moved; so remove it from right list
                                failedCompares = r = 0;     // Reset failed compares count because we're checking for consecutive failures
                                break;
                            }
                        }
                        failedCompares += r;
                    }
                }
            };

            ko.utils.compareArrays = (function () {
                var statusNotInOld = 'added', statusNotInNew = 'deleted';

                // Simple calculation based on Levenshtein distance.
                function compareArrays(oldArray, newArray, options) {
                    // For backward compatibility, if the third arg is actually a bool, interpret
                    // it as the old parameter 'dontLimitMoves'. Newer code should use { dontLimitMoves: true }.
                    options = (typeof options === 'boolean') ? { 'dontLimitMoves': options } : (options || {});
                    oldArray = oldArray || [];
                    newArray = newArray || [];

                    if (oldArray.length <= newArray.length)
                        return compareSmallArrayToBigArray(oldArray, newArray, statusNotInOld, statusNotInNew, options);
                    else
                        return compareSmallArrayToBigArray(newArray, oldArray, statusNotInNew, statusNotInOld, options);
                }

                function compareSmallArrayToBigArray(smlArray, bigArray, statusNotInSml, statusNotInBig, options) {
                    var myMin = Math.min,
                        myMax = Math.max,
                        editDistanceMatrix = [],
                        smlIndex, smlIndexMax = smlArray.length,
                        bigIndex, bigIndexMax = bigArray.length,
                        compareRange = (bigIndexMax - smlIndexMax) || 1,
                        maxDistance = smlIndexMax + bigIndexMax + 1,
                        thisRow, lastRow,
                        bigIndexMaxForRow, bigIndexMinForRow;

                    for (smlIndex = 0; smlIndex <= smlIndexMax; smlIndex++) {
                        lastRow = thisRow;
                        editDistanceMatrix.push(thisRow = []);
                        bigIndexMaxForRow = myMin(bigIndexMax, smlIndex + compareRange);
                        bigIndexMinForRow = myMax(0, smlIndex - 1);
                        for (bigIndex = bigIndexMinForRow; bigIndex <= bigIndexMaxForRow; bigIndex++) {
                            if (!bigIndex)
                                thisRow[bigIndex] = smlIndex + 1;
                            else if (!smlIndex)  // Top row - transform empty array into new array via additions
                                thisRow[bigIndex] = bigIndex + 1;
                            else if (smlArray[smlIndex - 1] === bigArray[bigIndex - 1])
                                thisRow[bigIndex] = lastRow[bigIndex - 1];                  // copy value (no edit)
                            else {
                                var northDistance = lastRow[bigIndex] || maxDistance;       // not in big (deletion)
                                var westDistance = thisRow[bigIndex - 1] || maxDistance;    // not in small (addition)
                                thisRow[bigIndex] = myMin(northDistance, westDistance) + 1;
                            }
                        }
                    }

                    var editScript = [], meMinusOne, notInSml = [], notInBig = [];
                    for (smlIndex = smlIndexMax, bigIndex = bigIndexMax; smlIndex || bigIndex;) {
                        meMinusOne = editDistanceMatrix[smlIndex][bigIndex] - 1;
                        if (bigIndex && meMinusOne === editDistanceMatrix[smlIndex][bigIndex - 1]) {
                            notInSml.push(editScript[editScript.length] = {     // added
                                'status': statusNotInSml,
                                'value': bigArray[--bigIndex],
                                'index': bigIndex
                            });
                        } else if (smlIndex && meMinusOne === editDistanceMatrix[smlIndex - 1][bigIndex]) {
                            notInBig.push(editScript[editScript.length] = {     // deleted
                                'status': statusNotInBig,
                                'value': smlArray[--smlIndex],
                                'index': smlIndex
                            });
                        } else {
                            --bigIndex;
                            --smlIndex;
                            if (!options['sparse']) {
                                editScript.push({
                                    'status': "retained",
                                    'value': bigArray[bigIndex]
                                });
                            }
                        }
                    }

                    // Set a limit on the number of consecutive non-matching comparisons; having it a multiple of
                    // smlIndexMax keeps the time complexity of this algorithm linear.
                    ko.utils.findMovesInArrayComparison(notInSml, notInBig, smlIndexMax * 10);

                    return editScript.reverse();
                }

                return compareArrays;
            })();

            ko.exportSymbol('utils.compareArrays', ko.utils.compareArrays);
            (function () {
                // Objective:
                // * Given an input array, a container DOM node, and a function from array elements to arrays of DOM nodes,
                //   map the array elements to arrays of DOM nodes, concatenate together all these arrays, and use them to populate the container DOM node
                // * Next time we're given the same combination of things (with the array possibly having mutated), update the container DOM node
                //   so that its children is again the concatenation of the mappings of the array elements, but don't re-map any array elements that we
                //   previously mapped - retain those nodes, and just insert/delete other ones

                // "callbackAfterAddingNodes" will be invoked after any "mapping"-generated nodes are inserted into the container node
                // You can use this, for example, to activate bindings on those nodes.

                function mapNodeAndRefreshWhenChanged(containerNode, mapping, valueToMap, callbackAfterAddingNodes, index) {
                    // Map this array value inside a dependentObservable so we re-map when any dependency changes
                    var mappedNodes = [];
                    var dependentObservable = ko.dependentObservable(function () {
                        var newMappedNodes = mapping(valueToMap, index, ko.utils.fixUpContinuousNodeArray(mappedNodes, containerNode)) || [];

                        // On subsequent evaluations, just replace the previously-inserted DOM nodes
                        if (mappedNodes.length > 0) {
                            ko.utils.replaceDomNodes(mappedNodes, newMappedNodes);
                            if (callbackAfterAddingNodes)
                                ko.dependencyDetection.ignore(callbackAfterAddingNodes, null, [valueToMap, newMappedNodes, index]);
                        }

                        // Replace the contents of the mappedNodes array, thereby updating the record
                        // of which nodes would be deleted if valueToMap was itself later removed
                        mappedNodes.length = 0;
                        ko.utils.arrayPushAll(mappedNodes, newMappedNodes);
                    }, null, { disposeWhenNodeIsRemoved: containerNode, disposeWhen: function () { return !ko.utils.anyDomNodeIsAttachedToDocument(mappedNodes); } });
                    return { mappedNodes: mappedNodes, dependentObservable: (dependentObservable.isActive() ? dependentObservable : undefined) };
                }

                var lastMappingResultDomDataKey = ko.utils.domData.nextKey();

                ko.utils.setDomNodeChildrenFromArrayMapping = function (domNode, array, mapping, options, callbackAfterAddingNodes) {
                    // Compare the provided array against the previous one
                    array = array || [];
                    options = options || {};
                    var isFirstExecution = ko.utils.domData.get(domNode, lastMappingResultDomDataKey) === undefined;
                    var lastMappingResult = ko.utils.domData.get(domNode, lastMappingResultDomDataKey) || [];
                    var lastArray = ko.utils.arrayMap(lastMappingResult, function (x) { return x.arrayEntry; });
                    var editScript = ko.utils.compareArrays(lastArray, array, options['dontLimitMoves']);

                    // Build the new mapping result
                    var newMappingResult = [];
                    var lastMappingResultIndex = 0;
                    var newMappingResultIndex = 0;

                    var nodesToDelete = [];
                    var itemsToProcess = [];
                    var itemsForBeforeRemoveCallbacks = [];
                    var itemsForMoveCallbacks = [];
                    var itemsForAfterAddCallbacks = [];
                    var mapData;

                    function itemMovedOrRetained(editScriptIndex, oldPosition) {
                        mapData = lastMappingResult[oldPosition];
                        if (newMappingResultIndex !== oldPosition)
                            itemsForMoveCallbacks[editScriptIndex] = mapData;
                        // Since updating the index might change the nodes, do so before calling fixUpContinuousNodeArray
                        mapData.indexObservable(newMappingResultIndex++);
                        ko.utils.fixUpContinuousNodeArray(mapData.mappedNodes, domNode);
                        newMappingResult.push(mapData);
                        itemsToProcess.push(mapData);
                    }

                    function callCallback(callback, items) {
                        if (callback) {
                            for (var i = 0, n = items.length; i < n; i++) {
                                if (items[i]) {
                                    ko.utils.arrayForEach(items[i].mappedNodes, function (node) {
                                        callback(node, i, items[i].arrayEntry);
                                    });
                                }
                            }
                        }
                    }

                    for (var i = 0, editScriptItem, movedIndex; editScriptItem = editScript[i]; i++) {
                        movedIndex = editScriptItem['moved'];
                        switch (editScriptItem['status']) {
                            case "deleted":
                                if (movedIndex === undefined) {
                                    mapData = lastMappingResult[lastMappingResultIndex];

                                    // Stop tracking changes to the mapping for these nodes
                                    if (mapData.dependentObservable)
                                        mapData.dependentObservable.dispose();

                                    // Queue these nodes for later removal
                                    nodesToDelete.push.apply(nodesToDelete, ko.utils.fixUpContinuousNodeArray(mapData.mappedNodes, domNode));
                                    if (options['beforeRemove']) {
                                        itemsForBeforeRemoveCallbacks[i] = mapData;
                                        itemsToProcess.push(mapData);
                                    }
                                }
                                lastMappingResultIndex++;
                                break;

                            case "retained":
                                itemMovedOrRetained(i, lastMappingResultIndex++);
                                break;

                            case "added":
                                if (movedIndex !== undefined) {
                                    itemMovedOrRetained(i, movedIndex);
                                } else {
                                    mapData = { arrayEntry: editScriptItem['value'], indexObservable: ko.observable(newMappingResultIndex++) };
                                    newMappingResult.push(mapData);
                                    itemsToProcess.push(mapData);
                                    if (!isFirstExecution)
                                        itemsForAfterAddCallbacks[i] = mapData;
                                }
                                break;
                        }
                    }

                    // Call beforeMove first before any changes have been made to the DOM
                    callCallback(options['beforeMove'], itemsForMoveCallbacks);

                    // Next remove nodes for deleted items (or just clean if there's a beforeRemove callback)
                    ko.utils.arrayForEach(nodesToDelete, options['beforeRemove'] ? ko.cleanNode : ko.removeNode);

                    // Next add/reorder the remaining items (will include deleted items if there's a beforeRemove callback)
                    for (var i = 0, nextNode = ko.virtualElements.firstChild(domNode), lastNode, node; mapData = itemsToProcess[i]; i++) {
                        // Get nodes for newly added items
                        if (!mapData.mappedNodes)
                            ko.utils.extend(mapData, mapNodeAndRefreshWhenChanged(domNode, mapping, mapData.arrayEntry, callbackAfterAddingNodes, mapData.indexObservable));

                        // Put nodes in the right place if they aren't there already
                        for (var j = 0; node = mapData.mappedNodes[j]; nextNode = node.nextSibling, lastNode = node, j++) {
                            if (node !== nextNode)
                                ko.virtualElements.insertAfter(domNode, node, lastNode);
                        }

                        // Run the callbacks for newly added nodes (for example, to apply bindings, etc.)
                        if (!mapData.initialized && callbackAfterAddingNodes) {
                            callbackAfterAddingNodes(mapData.arrayEntry, mapData.mappedNodes, mapData.indexObservable);
                            mapData.initialized = true;
                        }
                    }

                    // If there's a beforeRemove callback, call it after reordering.
                    // Note that we assume that the beforeRemove callback will usually be used to remove the nodes using
                    // some sort of animation, which is why we first reorder the nodes that will be removed. If the
                    // callback instead removes the nodes right away, it would be more efficient to skip reordering them.
                    // Perhaps we'll make that change in the future if this scenario becomes more common.
                    callCallback(options['beforeRemove'], itemsForBeforeRemoveCallbacks);

                    // Finally call afterMove and afterAdd callbacks
                    callCallback(options['afterMove'], itemsForMoveCallbacks);
                    callCallback(options['afterAdd'], itemsForAfterAddCallbacks);

                    // Store a copy of the array items we just considered so we can difference it next time
                    ko.utils.domData.set(domNode, lastMappingResultDomDataKey, newMappingResult);
                }
            })();

            ko.exportSymbol('utils.setDomNodeChildrenFromArrayMapping', ko.utils.setDomNodeChildrenFromArrayMapping);
            ko.nativeTemplateEngine = function () {
                this['allowTemplateRewriting'] = false;
            }

            ko.nativeTemplateEngine.prototype = new ko.templateEngine();
            ko.nativeTemplateEngine.prototype.constructor = ko.nativeTemplateEngine;
            ko.nativeTemplateEngine.prototype['renderTemplateSource'] = function (templateSource, bindingContext, options) {
                var useNodesIfAvailable = !(ko.utils.ieVersion < 9), // IE<9 cloneNode doesn't work properly
                    templateNodesFunc = useNodesIfAvailable ? templateSource['nodes'] : null,
                    templateNodes = templateNodesFunc ? templateSource['nodes']() : null;

                if (templateNodes) {
                    return ko.utils.makeArray(templateNodes.cloneNode(true).childNodes);
                } else {
                    var templateText = templateSource['text']();
                    return ko.utils.parseHtmlFragment(templateText);
                }
            };

            ko.nativeTemplateEngine.instance = new ko.nativeTemplateEngine();
            ko.setTemplateEngine(ko.nativeTemplateEngine.instance);

            ko.exportSymbol('nativeTemplateEngine', ko.nativeTemplateEngine);
            (function () {
                ko.jqueryTmplTemplateEngine = function () {
                    // Detect which version of jquery-tmpl you're using. Unfortunately jquery-tmpl
                    // doesn't expose a version number, so we have to infer it.
                    // Note that as of Knockout 1.3, we only support jQuery.tmpl 1.0.0pre and later,
                    // which KO internally refers to as version "2", so older versions are no longer detected.
                    var jQueryTmplVersion = this.jQueryTmplVersion = (function () {
                        if (!jQueryInstance || !(jQueryInstance['tmpl']))
                            return 0;
                        // Since it exposes no official version number, we use our own numbering system. To be updated as jquery-tmpl evolves.
                        try {
                            if (jQueryInstance['tmpl']['tag']['tmpl']['open'].toString().indexOf('__') >= 0) {
                                // Since 1.0.0pre, custom tags should append markup to an array called "__"
                                return 2; // Final version of jquery.tmpl
                            }
                        } catch (ex) { /* Apparently not the version we were looking for */ }

                        return 1; // Any older version that we don't support
                    })();

                    function ensureHasReferencedJQueryTemplates() {
                        if (jQueryTmplVersion < 2)
                            throw new Error("Your version of jQuery.tmpl is too old. Please upgrade to jQuery.tmpl 1.0.0pre or later.");
                    }

                    function executeTemplate(compiledTemplate, data, jQueryTemplateOptions) {
                        return jQueryInstance['tmpl'](compiledTemplate, data, jQueryTemplateOptions);
                    }

                    this['renderTemplateSource'] = function (templateSource, bindingContext, options) {
                        options = options || {};
                        ensureHasReferencedJQueryTemplates();

                        // Ensure we have stored a precompiled version of this template (don't want to reparse on every render)
                        var precompiled = templateSource['data']('precompiled');
                        if (!precompiled) {
                            var templateText = templateSource['text']() || "";
                            // Wrap in "with($whatever.koBindingContext) { ... }"
                            templateText = "{{ko_with $item.koBindingContext}}" + templateText + "{{/ko_with}}";

                            precompiled = jQueryInstance['template'](null, templateText);
                            templateSource['data']('precompiled', precompiled);
                        }

                        var data = [bindingContext['$data']]; // Prewrap the data in an array to stop jquery.tmpl from trying to unwrap any arrays
                        var jQueryTemplateOptions = jQueryInstance['extend']({ 'koBindingContext': bindingContext }, options['templateOptions']);

                        var resultNodes = executeTemplate(precompiled, data, jQueryTemplateOptions);
                        resultNodes['appendTo'](document.createElement("div")); // Using "appendTo" forces jQuery/jQuery.tmpl to perform necessary cleanup work

                        jQueryInstance['fragments'] = {}; // Clear jQuery's fragment cache to avoid a memory leak after a large number of template renders
                        return resultNodes;
                    };

                    this['createJavaScriptEvaluatorBlock'] = function (script) {
                        return "{{ko_code ((function() { return " + script + " })()) }}";
                    };

                    this['addTemplate'] = function (templateName, templateMarkup) {
                        document.write("<script type='text/html' id='" + templateName + "'>" + templateMarkup + "<" + "/script>");
                    };

                    if (jQueryTmplVersion > 0) {
                        jQueryInstance['tmpl']['tag']['ko_code'] = {
                            open: "__.push($1 || '');"
                        };
                        jQueryInstance['tmpl']['tag']['ko_with'] = {
                            open: "with($1) {",
                            close: "} "
                        };
                    }
                };

                ko.jqueryTmplTemplateEngine.prototype = new ko.templateEngine();
                ko.jqueryTmplTemplateEngine.prototype.constructor = ko.jqueryTmplTemplateEngine;

                // Use this one by default *only if jquery.tmpl is referenced*
                var jqueryTmplTemplateEngineInstance = new ko.jqueryTmplTemplateEngine();
                if (jqueryTmplTemplateEngineInstance.jQueryTmplVersion > 0)
                    ko.setTemplateEngine(jqueryTmplTemplateEngineInstance);

                ko.exportSymbol('jqueryTmplTemplateEngine', ko.jqueryTmplTemplateEngine);
            })();
        }));
    }());
})();

