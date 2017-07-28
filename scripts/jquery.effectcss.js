/*
 jquery.effectcss.js 
 <http://effectcss.ya.com.tr>
 <http://effectcss.quantumui.org>
 (c) 2014 Mehmet Ötkün <info [at] ya.com.tr>
  all rights reserved
  Under the terms of this license, the licensee is granted the following privileges:
  - The right to use the library as part of a website or application that is used for commercial purposes
  - The right to modify the library to suit his purpose.
*/
+function ($) {
    "use strict";
    function animationEvents() {
        var el = document.createElement('suit')
        var animEndEventNames = {
            'WebkitAnimation': 'webkitAnimationEnd'
        , 'MozAnimation': 'animationend'
        , 'OAnimation': 'oanimationend'
        , 'animation': 'animationend'
        , 'MSAnimation': 'MSAnimationEnd'
        }
        var animStartEventNames = {
            'WebkitAnimation': 'webkitAnimationStart'
        , 'MozAnimation': 'animationstart'
        , 'OAnimation': 'oanimationstart'
        , 'animation': 'animationstart'
        , 'MSAnimation': 'MSAnimationStart'
        }
        for (var name in animEndEventNames) {
            if (el.style[name] !== undefined) {
                return { end: animEndEventNames[name], start: animStartEventNames[name] }
            }
        }
    }
    $.fn.emulateAnimationEnd = function (duration) {
        var called = false, $el = this
        $(this).one($.support.animation.end, function () { called = true })
        var callback = function () { if (!called) $($el).trigger($.support.animation.end) }
        setTimeout(callback, duration)
        return this
    }
    $.fn.emulateAnimationStart = function (duration) {
        var called = false, $el = this
        $(this).one($.support.animation.start, function () { called = true })
        var callback = function () { if (!called) $($el).trigger($.support.animation.start), $($el).trigger($.support.animation.end) }
        setTimeout(callback, duration)
        return this
    }
    $(function () {
        $.support.animation = animationEvents()
    })
}(jQuery)
+ function ($) {
    "use strict";
    $.each(["addClass", "removeClass", "toggleClass", "show", "hide", "toggle", "appendTo", "prependTo", "insertAfter", "insertBefore", "remove", "detach"],
        function (i, methodname) {
            var oldmethod = $.fn[methodname];
            $.fn[methodname] = function () {
                var $this = $(this)
                var arg = arguments[0], applyAnim = false;
                if ($.isFunction(arg) || !$.support.animation) {
                    oldmethod.apply(this, arguments);
                    return this
                }
                if (methodname == "toggleClass") {
                    methodname = $this.hasClass(arg) ? 'removeClass' : 'addClass';
                }
                else if (methodname == "toggle") {
                    if ($this.length > 1) {
                        $.each($this, function (l, elem) {
                            $(elem).is(':hidden') ? $(elem).show(arguments[0]) : $(elem).hide(arguments[0]);
                        })
                    }
                    else {
                        $this.is(':hidden') ? $($this).show(arguments[0]) : $($this).hide(arguments[0]);
                    }
                    return this

                }
                if (methodname == "show" || methodname == "hide" || methodname == "detach") {
                    applyAnim = arguments[0] == true;
                    arguments[0] = undefined;
                }
                else if (methodname == "remove") {
                    //now we cannot supprt remove, beacuse it effects other methods
                    applyAnim = false;
                }
                else {
                    applyAnim = arguments[1] == true;
                }
                if (applyAnim) {
                    $this.removeClass('ng-animate', false)
                    $this.addClass('ng-animate', false)
                    $this.removeClass('ng-hide-animate', false)
                    switch (methodname) {
                       
                        case 'addClass':
                            if ($this.hasClass(arg)) return this;
                            oldmethod.apply(this, arguments);
                            $this.removeClass(arg + '-remove', false)
                            $this.addClass(arg + '-add', false)
                            processAnimation($this, methodname, arg)
                            break;
                        case 'removeClass':
                            if (!$this.hasClass(arg)) return this;
                            oldmethod.apply(this, arguments);
                            $this.removeClass(arg + '-add', false)
                            $this.addClass(arg + '-remove', false)
                            processAnimation($this, methodname, arg)
                            break;
                        case 'show':
                            if ($this.is(':visible')) return this;
                            oldmethod.apply(this, arguments);
                            $this.removeClass('ng-hide', false)
                            $this.removeClass('ng-hide-add', false)
                            $this.addClass('ng-hide-remove', false)
                            processAnimation($this, methodname)
                            break
                        case 'hide':
                            if ($this.is(':hidden')) return this;
                            var that = this, args = arguments;
                            $this.removeClass('ng-hide-remove', false);
                            $this.addClass('ng-hide', false);
                            $this.addClass('ng-hide-animate', false)
                            $this.addClass('ng-hide-add', false);
                            processAnimation($this, methodname, function () {
                                oldmethod.apply(that, args);
                            })
                            break
                        case 'appendTo':
                        case 'prependTo':
                        case 'insertAfter':
                        case 'insertBefore':
                            $this.removeClass('ng-enter', false)
                            $this.addClass('ng-enter', false);
                            if (arg.length > 1) {
                                for (var j = 0; j < arg.length; j++){
                                    var elem = $(arg[j])
                                    if (j == 0) {
                                        attachElement(elem, $this, methodname)
                                        processAnimation($this, methodname)
                                    }
                                    else {
                                        var clone = $this.clone(true, true)
                                        attachElement(elem, clone, methodname)
                                        processAnimation(clone, methodname)
                                    }
                                }
                            }
                            else {
                                oldmethod.apply(this, arguments);
                                processAnimation($this, methodname)
                            }
                            break
                        case 'remove':
                        case 'detach':
                            var that = this, args = arguments;
                            $this.removeClass('ng-leave', false);
                            $this.addClass('ng-leave', false)
                            processAnimation($this, methodname, function () {
                                oldmethod.apply(that, args);
                            })
                            break
                    }
                }
                else
                    oldmethod.apply(this, arguments);

                return this;
            }
        });
    //private methods
    function attachElement($parent, attachment, method) {
        switch (method) {
            case 'appendTo':
                $parent.append(attachment)
                break;
            case 'prependTo':
                $parent.prepend(attachment)
                break;
            case 'insertAfter':
                $parent.after(attachment)
                break
            case 'insertBefore':
                $parent.before(attachment)
                break
        }
    }
    function processAnimation($elm, method, arg) {
        var $this = $elm;
        //var duration = getDuration($elm);

        $elm.one($.support.animation.start, $.proxy(function (e) {
            switch (method) {
                case 'addClass':
                    $this.addClass(arg + '-add-active', false)
                    break;
                case 'removeClass':
                    $this.addClass(arg + '-remove-active', false)
                    break;
                case 'show':
                    $this.addClass('ng-hide-remove-active', false)
                    break
                case 'hide':
                    $this.addClass('ng-hide-add-active', false)
                    break
                case 'appendTo':
                case 'prependTo':
                case 'insertAfter':
                case 'insertBefore':
                    $this.addClass('ng-enter-active', false)
                    break
                case 'remove':
                case 'detach':
                    $this.addClass('ng-leave-active', false)
                    break
            }
            $this.trigger('animationStart')
        }, $this[0])).emulateAnimationStart(150)
        $elm.one($.support.animation.end, $.proxy(function (e) {
            endProcess($this, method, arg)
        }, $this[0])).emulateAnimationStart(150)
        //if (!duration && /hide|remove|detach/.test(method)) {
        //if (!duration) {
        //    endProcess($this, method, arg)
        //}
    }
    function endProcess($this, method, arg) {
        $this.removeClass('ng-animate', false)
        switch (method) {
            case 'addClass':
                $this.removeClass(arg + '-add', false)
                $this.removeClass(arg + '-add-active', false)
                break;
            case 'removeClass':
                $this.removeClass(arg + '-remove', false)
                $this.removeClass(arg + '-remove-active', false)
                break;
            case 'show':
                $this.removeClass('ng-hide-remove', false)
                $this.removeClass('ng-hide-remove-active', false)
                break
            case 'hide':
                $this.removeClass('ng-hide-add', false)
                $this.removeClass('ng-hide-add-active', false)
                arg();
                break
            case 'appendTo':
            case 'prependTo':
            case 'insertAfter':
            case 'insertBefore':
                $this.removeClass('ng-enter', false)
                $this.removeClass('ng-enter-active', false)
                break
            case 'remove':
            case 'detach':
                $this.removeClass('ng-leave', false)
                $this.removeClass('ng-leave-active', false)
                arg();
                break
        }
        $this.trigger('animationEnd')
    }
    //function getDuration($elm) {
    //    var duration = $elm.css('animation-duration') || $elm.css('-webkit-animation-duration') || $elm.css('-moz-animation-duration') || $elm.css('-ms-animation-duration') || $elm.css('-o-animation-duration')
    //    if (duration) {
    //        duration = duration.indexOf('ms') > -1 ? parseFloat(duration) : parseFloat(duration) * 1000
    //    }
    //    return duration;
    //}
}(jQuery);