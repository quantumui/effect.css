/*
 jquery.bootstap-effectcss.js 
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
    $.fn.tooltip.Constructor.DEFAULTS.animation = false;
    $.fn.popover.Constructor.DEFAULTS.animation = false;
   
    //MAKE BOOTSTRAP MODAL ANIMATABLE
    var oldmodal = $.fn.modal;
    $.fn.modal = function (options, target) {
        var $this = $(this)
        if (options == 'toggle' && target) {
            var newdata = $.extend({}, $this.data('bs.modal').options, $(target).data())
            $this.data('bs.modal').options = newdata;
        }
        $this.removeClass('fade')
        oldmodal.apply(this, arguments)
        return this;
    }
    //MAKE BOOTSTRAP MODAL ANIMATABLE
    $(document)
    .on('shown.bs.modal', $('.modal'), modalOnShown)
    .on('hide.bs.modal', $('.modal'), modalOnHide)
    function modalOnShown(evt) {
        var element = $(evt.target)
        var data, dialog, backdrop;
        data = element.data('bs.modal')
        var options = $.extend({}, getModalOptions(element), data.options);
        dialog = element.find('.modal-dialog')
        backdrop = data.$backdrop;
        element.removeClass('fade')
        backdrop.removeClass('fade')
        if (dialog && options.animation) {
            backdrop.addClass(options.speed)
            dialog.addClass(options.speed)
            backdrop.addClass('fade-in', true)
            dialog.addClass(options.animation, true)
        }
    }
    function modalOnHide(evt) {
        var element = $(evt.target)
       
        var data, dialog, backdrop;
        data = element.data('bs.modal')
        var options = $.extend({}, getModalOptions(element), data.options);
        dialog = element.find('.modal-dialog')
        backdrop = data.$backdrop;
        if (options.animation)
            evt.preventDefault();
        if (dialog && options.animation) {
            backdrop.removeClass('fade-in', true).one('animationEnd', function () {
                backdrop.remove()
            })
            dialog.removeClass(options.animation, true).one('animationEnd', function () {
                //now complate hiding the modal
                element.modal('escape');
                element.data('bs.modal').isShown = false;
                $(document).off('focusin.bs.modal')
                element.removeClass('in').attr('aria-hidden', true).off('click.dismiss.bs.modal');
                element.modal('hideModal');

            })
        }
    }
    function getModalOptions(element) {
        var options = {
            animation: 'rotate',
            speed: 'fast'
        };
        $.each(['animation', 'speed'], function (i, key) {
            if (element.data(key))
                options[key] = element.data(key);
        })
        return options;
    }

    //MAKE POPOVER AND TOOLTIP ANIMATABLE
    $(document)
    .on('show.bs.tooltip', $('[data-toggle="tooltip"]'), function (evt) {
         $(evt.target).data('bs.tooltip').options.animation = false;
     }).on('shown.bs.tooltip', $('[data-toggle="tooltip"]'), function(evt){
        tipsOnShown(evt, 'tooltip')
    }).on('hide.bs.tooltip', $('[data-toggle="tooltip"]'),  function(evt){
        tipsOnHide(evt, 'tooltip')
    }).on('show.bs.popover', $('[data-toggle="popover"]'), function (evt) {
        $(evt.target).data('bs.popover').options.animation = false;
    }).on('shown.bs.popover', $('[data-toggle="popover"]'), function (evt) {
        tipsOnShown(evt, 'popover')
    }).on('hide.bs.popover', $('[data-toggle="popover"]'), function (evt) {
        tipsOnHide(evt, 'popover')
    })
    function tipsOnShown(evt, type) {
        var element = $(evt.target)
        var options = getTipsOptions(element, type);
        var tip = element.data('bs.' + type).$tip
        if (tip && options.animation) {
            tip.addClass(options.speed)
            tip.addClass(options.animation, true)
        }
    }
    function tipsOnHide(evt, type) {
        var element = $(evt.target)
        var options = getTipsOptions(element, type);
        if (options.animation)
            evt.preventDefault();
        var tip = element.data('bs.' + type).$tip
        if (tip && options.animation) {
            tip.removeClass(options.animation, true).one('animationEnd',function () {
                tip.removeClass(options.speed) 
                tip.removeClass('in')
                tip.detach()
                element.trigger('hidden.bs.' + type)
            });
        }
    }
    function getTipsOptions(element, type) {
        var options = type == 'popover' ? {
            animation: 'flip-x',
            speed: 'fast'
        }: {
            animation: 'fade-in',
            speed: 'fast'
        }
        $.each(['animation', 'speed'], function (i, key) {
            if (element.data(key))
                options[key] = element.data(key);
        })
        return options;
    }
    //MAKE BOOTSTRAP DROPDOWN ANIMATABLE
    $(document)
    .on('show.bs.dropdown', $('.dropdown'), function (evt) {
        var element = $(evt.target),
        menu = element.find('.dropdown-menu')
        var options = getDropdownOptions(element);
        if (options.animation) {
            if (!menu.length)
                menu = findTarget(evt.relatedTarget)
            if (menu.length) {
                menu.addClass(options.speed)
                menu.addClass(options.animation, true)
            }
        }
    })
    .on('hide.bs.dropdown', $('.dropdown'), function (evt) {
        var element = $(evt.target),
        menu = element.find('.dropdown-menu')
        var options = getDropdownOptions(element);
        if (options.animation) {
            if (!menu.length)
                menu = findTarget(evt.relatedTarget)
            if (menu.length) {
                menu.addClass(options.speed)
                menu.removeClass(options.animation, true).on('animationEnd', function () {
                    menu.removeClass(options.speed)
                })
            }
                
        }
    })
    function findTarget(relTarget) {
        return $($(relTarget).attr('data-target'))
    }
    function getDropdownOptions(element) {
        var options = {
            animation: 'sing',
            speed: 'fast'
        }
        $.each(['animation', 'speed'], function (i, key) {
            if (element.data(key))
                options[key] = element.data(key);
        })
        return options;
    }
    $(document)
    .on('show.bs.tab', $('a[data-toggle="tab"]'), animateTab)
    function animateTab(e) {
        var element = $(e.target)
        var current = $(element.attr('href')), options = getTabOptions(element)
        var past = $($(e.relatedTarget).attr('href'))
        past.addClass(options.speed).addClass(options.animation).css('display', 'block').css('position', 'absolute').css('top', '0px').css('left', '0px')
        past.removeClass(options.animation, true).one('animationEnd', function () {
            past.css('display', 'none').css('position', '').css('top', '').css('left', '')
        })
        current.addClass(options.speed).css('display', '').css('position', '').css('top', '').css('left', '')
        current.addClass(options.animation, true)
    }
    function getTabOptions(element) {
        var options = {
            animation: 'slide-right-left',
            speed: 'fast'
        }
        var nav = element.closest('nav-tabs')
        $.each(['animation', 'speed'], function (i, key) {
            if (element.data(key))
                options[key] = element.data(key);
        })
        return options;
    }
}(jQuery)