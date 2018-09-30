"use strict";

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

var nui = function () {
  /* natUIve by rado.bg */

  /* DOM functions via http://youmightnotneedjquery.com */
  // To do: translate to ES6, as the packager adds a check to skip the below when ES6 unavailable and optionally server Babel-transpiled version using the extra footer script
  var bodyElement = document.body;

  if (typeof window['chrome'] !== 'undefined') {
    document.body.setAttribute('data-chrome', 'true');
  }

  var aria_expanded = 'aria-expanded';
  var scripts_location = document.getElementsByTagName('script'); // To do: 1. maybe move this global variable to window.scripts_location. 2. This is wrong with async scripts. To do: Use document.currentScript

  scripts_location = scripts_location[scripts_location.length - 1].src;
  scripts_location = scripts_location.slice(0, scripts_location.length - scripts_location.split('/').pop().length); // DOM functions – start

  function q(selector) {
    return document.querySelector(selector);
  }

  ;

  function qa(selector) {
    return document.querySelectorAll(selector);
  }

  ;

  function addClass(el, className) {
    el.classList.add(className);
  }

  function removeClass(el, className) {
    // To do: remove a single '.' for foolproof operation; Support multiple classes separated by space, dot, comma
    el.classList.remove(className);
  }

  function hasClass(el, className) {
    return el.classList.contains(className); // To do: remove a single '.' for foolproof operation; Support multiple classes separated by space, dot, comma
  }

  function toggleClass(el, className) {
    if (hasClass(el, className)) {
      removeClass(el, className);
    } else {
      addClass(el, className);
    }
  }

  function toggleAttribute(el, attribute) {
    if (el.getAttribute(attribute)) {
      el.removeAttribute(attribute);
    } else {
      el.setAttribute(attribute, true);
    }
  }

  function forEach(selector, fn) {
    // Because IE11 doesn't support el.forEach(). Accepts both an array and a selector
    var elements = typeof selector === 'string' ? qa(selector) : selector;

    if (elements.length > 0) {
      for (var i = 0; i < elements.length; i++) {
        fn(elements[i], i);
      }
    }
  } // DOM functions – end


  function transferClass(el_origin, el_target, className) {
    if (hasClass(el_origin, className)) {
      addClass(el_target, className);
    }
  }

  function parseHTML(str) {
    var tmp = document.implementation.createHTMLDocument('Parsed');
    tmp.body.innerHTML = str; // To do: destroy the HTMLDocument before returning

    return tmp.body;
  }

  function stopEvent(e) {
    if (!e) {
      if (typeof window.event === 'undefined') {
        return;
      }
    }

    if (typeof e === 'undefined') {
      return false;
    } //e.cancelBubble is supported by IE, this will kill the bubbling process.


    e.cancelBubble = true;
    e.returnValue = false; //e.stopPropagation works only in Firefox.

    if (e.stopPropagation) {
      e.stopPropagation();
    }

    if (e.preventDefault) {
      e.preventDefault();
    }

    return false;
  }

  function thisIndex(el) {
    if (!el) return;
    var node, nodes;
    nodes = node = el.parentNode.childNodes;
    var i = 0;
    var count = 0;

    while ((node = nodes.item(i++)) && node !== el) {
      if (node.nodeType === 1) {
        count++;
      }
    }

    return count;
  }

  function getCookie(k) {
    // Thanks Simon Steinberger
    var v = document.cookie.match('(^|;) ?' + k + '=([^;]*)(;|$)');
    return v ? v[2] : null;
  }

  function wrap(toWrap, wrapper) {
    // Thanks yckart
    // 	observerOff();
    wrapper = wrapper || document.createElement('div');
    var sibling = toWrap.nextSibling;
    var parent = toWrap.parentNode;
    wrapper.appendChild(toWrap);

    if (parent) {
      // Already attached to DOM
      if (sibling) {
        // Attach the wrapper
        parent.insertBefore(wrapper, sibling);
      } else {
        parent.appendChild(wrapper);
      }
    } //     observerOn();


    return wrapper;
  }
  /*
  function ready(fn) { // Not working with async and defer
  
    if (document.readyState != 'loading') {
  
      fn();
  
    } else if (document.addEventListener) {
  
      document.addEventListener('DOMContentLoaded', fn);
  
    } else {
  
      document.attachEvent('onreadystatechange', function() {
      	if (document.readyState != 'loading')
          	fn();
      });
  
    }
  
  }
  */


  function removeHash() {
    history.pushState("", document.title, window.location.pathname + window.location.search);
  }
  /* ––– */


  function getURLParameters() {
    // return all URL parameters in an array
    var res = {};
    var re = /[?&]([^?&]+)=([^?&]+)/g;
    location.href.replace(re, function (_, k, v) {
      res[k] = v;
    });
    return res;
  }
  /*
  // URI parameters
  
  function updateURLParameter(url, param, paramVal) { // return input string with updated/added URL parameter
  
      var newAdditionalURL = '';
      url = url.split('#')[0];
      var tempArray = url.split('?');
      var baseURL = tempArray[0];
      var additionalURL = tempArray[1];
      var temp = '';
      if (additionalURL) {
          tempArray = additionalURL.split('&');
          for (var i = 0; i < tempArray.length; i++) {
              if (tempArray[i].split('=')[0] != param) {
                  newAdditionalURL += temp + tempArray[i];
                  temp = '&';
              }
          }
      }
  
      var rows_txt = temp + '' + param + '=' + paramVal;
      return baseURL + '?' + newAdditionalURL + rows_txt.split('#')[0];
  
  }
  
  // URI parameters relay. Omit links starting with "javascript", "mailto", skip parameters not listed in the array
  
  var parameters_list = new Array('parameter1', 'parameter2'); // To do: load this from an external JSON file. Such data has no place here.
  
  function relayParameters() {
  
      var parameters = getURLParameters();
  
      forEach('a[href]', function(el, i) {
  
          for (var name in parameters) {
  
              if (el.href.indexOf('javascript') === -1 && el.href.indexOf('mailto') === -1 && parameters_list.indexOf(name) != -1) {
  	            
  	            var hash = el.href.split('#')[1];
  	            el.href = updateURLParameter(el.href, name, parameters[name]);
  	            if (typeof hash != 'undefined') {
  		            
  		            el.href = el.href.split('#')[0] + '#' + hash;
  		            
  	            }
  	            
              }
  
          }
  
      });
  
  }
  */


  function arrow_keys_handler(e) {
    switch (e.keyCode) {
      case 37:
      case 39:
      case 38:
      case 40: // Arrow keys

      case 32:
        e.preventDefault();
        break;
      // Space

      default:
        break;
      // do not block other keys
    }
  }

  var external = RegExp('^((f|ht)tps?:)?//(?!' + location.host + ')');
  var full_window_content = null;
  var previousScrollOffset = 0;
  var previouslyFocused = false;
  /* Animate anchor links */

  function getCumulativeOffset(obj) {
    // Offset from element to top of page
    var left, top;
    left = top = 0;

    if (obj.offsetParent) {
      do {
        left += obj.offsetLeft;
        top += obj.offsetTop;
        obj = obj.offsetParent;
      } while (obj);
    }

    return {
      x: left,
      y: top
    };
  }

  function animateAnchors(e) {
    if (typeof e === 'undefined') {
      return;
    }

    var el = e.target;

    while (typeof el.href !== 'string') {
      // If a child of the link is clicked
      el = el.parentNode;
    }

    if (el.href.split(/#|\?/)[0] != window.location.href.split(/#|\?/)[0]) {
      // External page?
      return;
    }

    var hash = null;

    if (el.href.split('#').pop().length > 0) {
      hash = document.getElementById(el.href.split('#').pop());
    }

    if (q('#nav-trigger')) {
      q('#nav-trigger').checked = false;

      if (q('header > nav > div')) {
        removeClass(q('header > nav > div'), 'open');
      }
    }

    scrollToAnimated(hash === null ? 0 : getCumulativeOffset(hash).y, .5, function (e) {
      // To do: fix jumping to new hash – is the fallback executed properly in animate()?
      window.location = el.href.split('#')[0] + '#' + el.href.split('#').pop();
    });
    return false;
  }

  function closest(el, target) {
    // Thanks http://gomakethings.com/ditching-jquery/ – Accepts either a selector string or an actual element
    for (; el && el !== document; el = el.parentNode) {
      if (typeof target === 'string' ? el.matches(target) : el === target) {
        return el;
      }
    }

    return false;
  }
  /* Check for host PHP support */


  var php_support = 0;
  var request = new XMLHttpRequest();
  request.open('GET', document.location, true);

  request.onload = function () {
    php_support = request.getAllResponseHeaders().toLowerCase().indexOf('php') === -1 ? 0 : 1;
  };

  request.send(null);
  /* Chainable animation specified as CSS Animation */

  var temp = document.createElement('temp');
  var animations = {
    'animation': 'animationend',
    'MozAnimation': 'animationend',
    'WebkitAnimation': 'webkitAnimationEnd'
  };
  var animationEndEvent = false;

  for (var t in animations) {
    if (temp.style[t] !== 'undefined') {
      animationEndEvent = animations[t];
    }
  }

  function animate(el, animation_code, duration, callback) {
    // Default duration = .2s, callback optional
    // To do: add animation-fill-mode: forwards to keep the end state
    if (!el.getAttribute('data-animation') && animationEndEvent) {
      el.addEventListener(animationEndEvent, function animationEndHandler(e) {
        stopEvent(e);
        var el = e.target;
        q('head').removeChild(q('.' + el.getAttribute('data-animation')));
        el.removeAttribute('data-animation');
        el.removeEventListener(animationEndEvent, animationEndHandler);

        if (typeof callback === 'function') {
          callback();
        }
      }, false);
      var animation_name = 'a' + new Date().getTime(); // Unique animation name

      if (q('head .' + animation_name)) {
        animation_name += '-';
      }

      var styles = document.createElement('style');
      styles.innerHTML = '@keyframes ' + animation_name + ' {' + animation_code + '} [data-animation=' + animation_name + '] { animation-name: ' + animation_name + '; animation-duration: ' + (typeof duration === 'undefined' ? .2 : duration) + 's; }'; // Where animation format is 		0% { opacity: 1 } 100% { opacity: 0 }

      q('head').appendChild(styles);
      addClass(styles, animation_name); // 		el.dataset.animation = animation_name;

      el.setAttribute('data-animation', animation_name);
    }
  } // Scroll the page to any position


  function scrollToAnimated(to, duration, callback) {
    var difference = bodyElement.clientHeight - window.innerHeight;

    if (to > difference) {
      to = difference;
    }

    function scrollToCallback(callback) {
      q('html').scrollTop = bodyElement.scrollTop = to;

      if (typeof callback === 'function') {
        callback();
      }
    }

    animate(q('html'), '100% { transform: translate3d(0, ' + -1 * (to - (document.documentElement.scrollTop || bodyElement.scrollTop)) + 'px, 0); }', duration, scrollToCallback.bind(null, callback));
  } // Clicking a button copies a target element's contents


  function copyButton(el, target, echo) {
    el.addEventListener('click', function (event) {
      window.getSelection().removeAllRanges(); // Clear previous clipboard

      var range = document.createRange();
      range.selectNode(target);
      window.getSelection().addRange(range);

      try {
        document.execCommand('copy');

        if (typeof echo !== 'undefined' && componentNotify) {
          componentNotify.notify('📋 ' + target.textContent, 'fixed timeout');
        }
      } catch (err) {}
    });
  }
  /*
  function loadScriptFile(file_name) {
  	
      var js_el = document.createElement('script');
      js_el.type = 'text/javascript';
      js_el.src = scripts_location + file_name;
      if (!js_el || typeof js_el === 'undefined') {
  	    
  	    document.head.appendChild(js_el);
  	
  	}
  
  }
  */
  // Real time touch detection to support devices with both touch and mouse. http://www.javascriptkit.com/dhtmltutors/sticky-hover-issue-solutions.shtml
  // To do: use an attribtue instead of class


  ;

  (function () {
    var isTouch = false; //var to indicate current input type (is touch versus no touch) 

    var isTouchTimer;
    var curRootClass = ''; //var indicating current document root class ("can-touch" or "")

    function addtouchclass(e) {
      clearTimeout(isTouchTimer);
      isTouch = true;

      if (curRootClass != 'can-touch') {
        //add "can-touch' class if it's not already present
        curRootClass = 'can-touch';
        addClass(q('html'), curRootClass);
      }

      isTouchTimer = setTimeout(function () {
        isTouch = false;
      }, 500); //maintain "istouch" state for 500ms so removetouchclass doesn't get fired immediately following a touch event
    }

    function removetouchclass(e) {
      if (!isTouch && curRootClass === 'can-touch') {
        //remove 'can-touch' class if not triggered by a touch event and class is present
        isTouch = false;
        curRootClass = '';
        removeClass(q('html'), 'can-touch');
      }
    }

    document.addEventListener('mouseover', removetouchclass, false); //this event gets called when input type is everything from touch to mouse/ trackpad

    document.addEventListener('touchstart', addtouchclass, false); //this event only gets called when input type is touch
  })();

  function makeReady(el) {
    el.setAttribute('data-ready', true);
  }

  function focusWithin(selector) {
    // To do: If not IE/Edge, return q(selector + ':focus-within');
    var result = null;
    forEach(qa(selector), function (el) {
      if (el.querySelector(':focus')) {
        result = el;
      }
    });
    return result;
  }

  function addComponent(host, el) {
    host.insertAdjacentHTML('beforeend', el); // 	initComponents(host); // No need, observer does it automatically
  }

  function initThreshold(host) {
    // Scroll effects
    forEach(host.querySelectorAll('[data-threshold]:not([data-ready])'), function (el) {
      // Set a variable reflecting how much of the element's height has been scrolled; .threshold on scroll over element height
      window.addEventListener('scroll', function () {
        setTimeout(function () {
          var relativeScroll = q('html').scrollTop || bodyElement.scrollTop;
          /*
          			q('html').style.setProperty('--scroll-top', relativeScroll);
          			q('html').style.setProperty('--scroll-bottom', q('html').scrollHeight - relativeScroll - q('html').offsetHeight);
          			q('html').style.setProperty('--page-height', q('html').scrollHeight);
          */

          var threshold = el.scrollHeight; // To do: either element height or data-threshold height in px, % or vh

          if (relativeScroll > threshold) {
            relativeScroll = threshold;
          }

          if (relativeScroll < 0) {
            relativeScroll = 0;
          }

          el.style.setProperty('--height', threshold);
          el.style.setProperty('--threshold', parseFloat(relativeScroll / threshold, 10).toPrecision(1)); // Percentage of threshold reached. 0 – 1. Can be used with CSS calc().
          // To do: Add --offset-top, --offset-bottom (distance from top/bottom of element to top/bottom of viewport)

          if (relativeScroll >= threshold) {
            addClass(el, 'threshold');
            bodyElement.setAttribute('data-threshold', true);
          } else {
            removeClass(el, 'threshold');
            removeClass(bodyElement, 'threshold');
            bodyElement.removeAttribute('data-threshold');
          }
        }, 50);
      });
      makeReady(el);
    });
  }

  var current_slider = q('.slider');
  var draggingNow = false;
  var components = new Array();

  function registerComponent(name, init) {
    components[name] = new Array();
    components[name].push({
      init: init
    });
  }

  function initComponents(host) {
    observerOff();

    var _host = typeof host === 'undefined' ? bodyElement : host;

    for (var key in components) {
      components[key][0].init(_host);
    }

    observerOn();
  }

  var observer = false;

  function observerOn() {
    if (observer) {
      observer.observe(bodyElement, {
        childList: true,
        subtree: true
      });
    }
  }

  function observerOff() {
    if (observer) {
      observer.disconnect();
    }
  }

  if (typeof MutationObserver === 'function') {
    observer = new MutationObserver(function (mutations, observer) {
      observerOff();
      var mutation = mutations[0];

      if (mutation.type === 'childList' && mutation.addedNodes.length > 0) {
        var i = 0;

        while (i < mutation.addedNodes.length) {
          var el = mutation.addedNodes[i++];

          if (_typeof(el) === 'object' && el.nodeName !== '#text' && !el.getAttribute('data-ready') && el.parentNode) {
            initComponents(el.parentNode);
          }
        }
      }

      observerOn();
    });
  }

  initThreshold(bodyElement); // Animate anchor link jumps

  forEach(document.querySelectorAll('a[href^="#"]'), function (el) {
    el.onclick = el.onclick || animateAnchors; // Don't add to previous onclick event handler
  });
  /*
  	notifyCloseEvent();
  
  	window.addEventListener('touchstart', function (e) {
  		
  		draggingNow = false;
  		
  	});
  
  	window.addEventListener('touchmove', function (e) {
  		
  		draggingNow = true;
  		
  	});
  */

  ; // Component Fold – start

  (function () {
    /* Fold – start */
    function toggleAccordion(e) {
      stopEvent(e);
      var el = closest(e.target, '.n-fold');
      var content = el.querySelector('.n-fold--content');
      content.style.setProperty('--width', content.scrollWidth + 'px');
      content.style.setProperty('--max-height', content.scrollHeight + 'px');
      var content_height = content.style.getPropertyValue('--start-height') || 0; // Animation, not CSS, because of nested accordions

      if (hasClass(el, 'n-fold--horizontal')) {
        toggleAttribute(el, aria_expanded);
      } else {
        if (el.hasAttribute(aria_expanded)) {
          animate(content, '0% { max-height: ' + content.scrollHeight + 'px; } 100% { max-height: ' + content_height + '; }', .2, function () {
            toggleAttribute(el, aria_expanded);
          });
        } else {
          toggleAttribute(el, aria_expanded);
          animate(content, '0% { max-height: ' + content_height + '; } 100% { max-height: ' + content.scrollHeight + 'px; }');
        }
      }

      return false;
    } // Close all Fold elements when clicking/tapping outside of them


    function closeFoldClickOutside(e) {
      var el = e.target;

      if (!closest(el, '.n-fold') && !closest(el, '.n-tool')) {
        // Clicking/tapping outside of a fold/tooltip element...
        forEach('.n-fold.n-fold--mobile, .n-tool', function (el) {
          // ... closes all burger nav menus and tooltips
          el.removeAttribute(aria_expanded);
        });
      } // Focus on clicked slider

      /*
      	if (q('.n-slider-wrap.active')) {
      		
      		removeClass(q('.n-slider-wrap.active'), 'active')
      		
      	}
      	
      	if (closest(el, '.slider')) {
      		
      		addClass(closest(el, '.n-slider-wrap'), 'active');
      		
      	}
      */


      if (closest(el, '.n-slider')) {
        current_slider = closest(el, '.n-slider');
      }
    }

    function initFold(host) {
      forEach(host.querySelectorAll('.n-fold:not([data-ready]) > .n-fold--label'), function (el) {
        el.onclick = toggleAccordion;
        el.setAttribute('tabindex', 0);

        el.onkeyup = function (e) {
          if (e.key === 'Enter') {
            toggleAccordion(e);
          }
        };

        el = el.parentNode;
        var content = el.querySelector('.n-fold--content');

        if (hasClass(el, 'n-fold--horizontal')) {
          el.setAttribute('data-init', true);
          content.style.setProperty('--width', content.scrollWidth + 'px');
          content.style.height = 'auto';
          el.removeAttribute('data-init');
          setTimeout(function () {
            content.style.transition = 'width .2s ease-in-out';
          }, 100);
        }

        content.style.setProperty('--max-height', content.scrollHeight + 'px');

        if (el.querySelector('input.trigger')) {
          // Remove CSS-only triggers
          el.querySelector('input.trigger').outerHTML = '';
        }

        if (!hasClass(el, 'n-fold--mobile')) {
          // Keep the accordion content clickable
          content.onclick = function (e) {
            stopEvent(e);
          };
        }

        makeReady(el);
      });
    }

    window.addEventListener('click', function (e) {
      // Close all Fold elements when clicking outside of them
      closeFoldClickOutside(e);
    });
    window.addEventListener('touchend', function (e) {
      // Close all Fold elements when clicking outside of them
      closeFoldClickOutside(e);
    });
    window.addEventListener('scroll', function () {
      // Close fixed n-ovrl if its scrolling becomes a window scroll. Idea by a Google mobile nav.
      if (q('.fixed-mobile .n-fold.n-fold--mobile[aria-expanded]')) {
        q('.fixed-mobile .n-fold.n-fold--mobile[aria-expanded]').removeAttribute(aria_expanded);
      }
    });
    /* Fold – end */

    registerComponent('fold', initFold);
  })(); // Component Fold – end


  ; // Component Form – start

  (function () {
    /* Form – start */
    function submitForm(e) {
      var el = e.target;
      var ready_to_submit = true;
      forEach(el.querySelectorAll('.n-form--mandatory'), function (el) {
        if (closest(el, '[disabled]')) {
          // Ignore disabled conditional fields
          return;
        }

        if (el.querySelector('input, select, textarea') && !el.querySelector('input, select, textarea').value || el.querySelector('input[type=checkbox]') && !el.querySelector('input[type=checkbox]').checked || el.querySelector('input[type=email]') && !RegExp(/^([a-z0-9_\.-]+)@([\da-z\.-]+)\.([a-z\.]{2,6})$/).test(el.querySelector('input[type=email]').value) || el.querySelector('input[type=url]') && !RegExp(/^(https?:\/\/)?([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \.-]*)*\/?$/).test(el.querySelector('input[type=url]').value) || el.querySelector('input[type=number]') && !RegExp(/^\d+$/).test(el.querySelector('input[type=number]').value) || el.querySelector('input[type=number][data-digits]') && el.querySelector('input[type=number]').value.length != el.querySelector('input[type=number]').getAttribute('data-digits') || el.querySelector('input[type=radio]') && !el.querySelector('input[type=radio]').checked) {
          ready_to_submit = false;
          el.querySelector('input').focus();
          addClass(el, 'n-form--alert');
          return;
        } else {
          removeClass(el, 'n-form--alert');
        }
      });

      if (!ready_to_submit) {
        return false;
      }

      if (!hasClass(el, 'n-form--dynamic') || !new XMLHttpRequest().upload || !php_support) {
        // Browser unable to submit dynamically.
        return true;
      }

      el.insertAdjacentHTML('beforeend', '<input name=targetformurl type=hidden value=' + encodeURIComponent(el.method === 'get' ? el.action.replace(/\/?(\?|#|$)/, '/$1') : el.action) + '>');
      request = new XMLHttpRequest();
      request.open('POST', scripts_location + 'request.php', true);

      request.onreadystatechange = function () {
        if (request.readyState != 4 || request.status != 200) {
          // php script unreachable, submit form normally
          return true;
        }

        if (!request.responseText || !php_support) {
          // php script unreachable, submit form normally
          el.onsubmit = function () {};

          el.constructor.prototype.submit.call(el); // el.submit();

          return true;
        } // strip id's from response HTML


        if (request.responseText.indexOf('---error---') != -1) {
          // Error
          document.getElementById('formresult').innerHTML = 'Error submitting form.';
          return;
        } else {
          // Success
          var loaded_html = parseHTML(request.responseText);
          document.getElementById('formresult').innerHTML = loaded_html.innerHTML;
        }
      };

      componentModal.openFullWindow('<div id=formresult>Submitting form...</div>');
      request.send(new FormData(el));
      return false;
    }

    function updateFileInput(e) {
      var el = e.target;
      el.parentNode.querySelector('span').innerHTML = el.value.substring(el.value.lastIndexOf('\\') + 1);
    }

    if (q('.n-form--language')) {
      // To do: make it universal .submitonchange and for more than 1 form
      q('.n-form--language select').onchange = function (e) {
        q('.n-form--language').submit();
      };
    }

    function toggleConditionalFieldset(e) {
      var el = e.target;
      var fieldset = closest(el, '.n-form--condition').nextElementSibling;
      var attribute = 'disabled';

      if (el.checked) {
        fieldset.removeAttribute(attribute);
      } else {
        fieldset.setAttribute(attribute, 'disabled');
      }
    }
    /* Form – end */


    var init = function init(host) {
      forEach(host.querySelectorAll('form.n-form'), function (el, i) {
        el.onsubmit = el.onsubmit || submitForm;
        forEach(el.querySelectorAll('input[type=file]'), function (el, i) {
          el.onchange = updateFileInput;
        }); // 	Conditional form fieldsets

        forEach(el.querySelectorAll('.n-form--check.n-form--condition input'), function (el, i) {
          el.onchange = toggleConditionalFieldset;
        }); // Auto textarea height.

        forEach(el.querySelectorAll('textarea[data-auto]'), function (el) {
          el.onkeyup = function (e) {
            el = e.target;

            while (el.rows > 1 && el.scrollHeight < el.offsetHeight) {
              el.rows--;
            }

            while (el.scrollHeight > el.offsetHeight) {
              if (el.rows > 20) {
                break;
              }

              el.rows++;
            }

            el.rows++;
          };
        });
        makeReady(el);
      });
    };

    registerComponent('form', init);
  })(); // Component Form – end


  ; // Component Grid with inline popups – start

  (function () {
    /* Grid with inline popups – start */
    function initGridInlinePopups(host) {
      // Limitation: each row must have equal width columns.
      forEach(host.querySelectorAll('.grid-inline-popup:not([data-ready])'), function (el) {
        var id = 'id' + new Date().getTime(); // Unique id

        el.id = el.id || id;
        var cells = el.querySelectorAll('#' + el.id + ' > div:not(.popup)');
        var popups = el.querySelectorAll('#' + el.id + ' > .popup');

        if (el.id === id) {
          el.removeAttribute('id');
        }

        forEach(cells, function (el) {
          function openNewItem(e, current_popup) {
            var cell = closest(e.target, '.grid-inline-popup > div');
            var columns = Math.round(cell.parentElement.scrollWidth / cell.scrollWidth);
            var el = cell.nextElementSibling;

            if (el === current_popup) {
              return;
            }

            var index = Array.prototype.indexOf.call(popups, el); // Rewind index to start of row (when cell horizontal offest === parent horizontal offset)

            var index_row = index;

            while (index_row >= columns && cells[index_row].offsetLeft > cells[index_row].previousElementSibling.previousElementSibling.offsetLeft) {
              index_row--;
            }

            if (index_row < columns) {
              index_row = 0;
            }

            index -= index_row;
            var i = 0;

            while (i < index_row) {
              cells[i++].style.order = -1;
            } // Set order = -1 until index_row and subtract index_row from index


            index -= index % columns; // compensate with remainder

            i = index_row;

            while (i < cells.length) {
              cells[i].style.order = i - index_row < index - index_row ? -1 : 1;
              i++;
            }

            i = 0;

            while (i < columns) {
              cells[i + index_row].style.order = -1;
              i++;
            }

            el.setAttribute(aria_expanded, 'true');
            el.previousElementSibling.setAttribute(aria_expanded, 'true');
            var height = el.scrollHeight;
            el.style.maxHeight = 0;
            el.style.overflow = 'hidden';
            animate(el, '100% { max-height: ' + height + 'px; }', .2, function () {
              el.style.cssText = '';
            });
          }

          function openCell(e) {
            var current_popup = closest(e.target, '.grid-inline-popup').querySelector('.popup[aria-expanded]');

            if (current_popup) {
              current_popup.style.maxHeight = current_popup.scrollHeight + 'px';
              current_popup.style.overflow = 'hidden';
              animate(current_popup, '100% { max-height: 0; }', .2, function () {
                current_popup.removeAttribute(aria_expanded);
                current_popup.previousElementSibling.removeAttribute(aria_expanded);
                current_popup.style.cssText = '';
                openNewItem(e, current_popup);
              });
            } else {
              openNewItem(e);
            }
          }

          el.setAttribute('tabindex', 0);
          el.addEventListener('click', openCell);
          el.addEventListener('touchend', openCell);
          el.addEventListener('keyup', function (e) {
            if (e.key === 'Enter') {
              openCell(e);
            }
          });
        });
        makeReady(el);
      });
    }
    /* Grid with inline popups – end */


    var init = function init(host) {
      initGridInlinePopups(host);
    };

    registerComponent('grid-inline-popups', init);
  })(); // Component Grid with inline popups – end


  ;

  var componentLightbox = function () {
    /* Lightbox – start */
    function populateLightboxItem(slider, i) {
      var img = slider.children[typeof i === 'undefined' ? 0 : i].querySelector('img');

      if (img && !img.src) {
        img.src = img.getAttribute('data-src');

        img.onload = function (e) {
          addClass(e.target.parentNode, 'loaded');
        };

        img.onclick = function (e) {
          // Zoom and scan
          // transformY = -50% + (poxY/sizeY)*overflowY
          if (!q('.n-ovrl .n-slider-wrap')) {
            return;
          }

          var el = e.target;
          toggleClass(el, 'zoom');
          el.style.cssText = '';
          el.style.setProperty('--x', '-50%');
          el.style.setProperty('--y', '-50%');

          el.onmousemove = function (e) {
            var width = q('.n-ovrl:last-of-type .n-slider-wrap').offsetWidth;
            var height = q('.n-ovrl:last-of-type .n-slider-wrap').offsetHeight;
            var el = e.target;
            var overflowX = el.width - width;
            var overflowY = el.height - height;

            if (overflowX > 0) {
              el.style.setProperty('--x', -1 * overflowX * e.x / width + 'px');
              el.style.left = 0;
              el.style.right = 'auto';
            }

            if (overflowY > 0) {
              el.style.setProperty('--y', -1 * overflowY * e.y / height + 'px');
              el.style.top = 0;
              el.style.bottom = 'auto';
            }
          };
        };

        return false;
      }
    }

    function populateLightbox(slider, i) {
      populateLightboxItem(slider, i);
      populateLightboxItem(slider, i > 0 ? i - 1 : slider.children.length - 1);
      populateLightboxItem(slider, i < slider.children.length - 1 ? i + 1 : 0);
    }

    function openLightbox(e) {
      // To do: create all content in an unattached element and call openFullWindow(el), which will take over
      if (typeof componentSlider.makeSlider !== 'function') {
        // slider JS not present
        return;
      }

      observerOff();
      var el = e.target;

      if (el.length === 0) {
        el = e;
      }

      var lightbox = closest(el, '.n-lightbox');
      var animation = lightbox.getAttribute('data-anim');
      var lightbox_target = document.createElement('div');
      var inline_static = lightbox.matches('.inline:not(.n-slider)');
      addClass(lightbox_target, 'slider');
      addClass(lightbox_target, 'n-lightbox');
      addClass(lightbox_target, 'inline');
      transferClass(lightbox, lightbox_target, 'thumbnails');
      transferClass(lightbox, lightbox_target, 'top');
      transferClass(lightbox, lightbox_target, 'fade');

      if (inline_static) {
        // If it's inline, it must become a slider/lightbox to replace the original lightbox element
        // Replace the lightbox by a slider lightbox. Generate the new slider/lightbox in place of the original one
        // 		lightbox_target.classList = 'slider lightbox inline'; // Not working in Edge
        lightbox_target.id = lightbox.id ? lightbox.id : '';
        var parent = lightbox.parentNode;
        var next_sibling = lightbox.nextElementSibling;
        lightbox.outerHTML = ''; // Remove from DOM, but still existing as a variable
      } else {
        // else it's an existing lightbox and the new one should be separate and full screen
        //		openFullWindow('<div class="slider lightbox full-window' + (hasClass(lightbox, 'full-screen') ? ' full-screen' : '') + '"></div>', animation); // openFullWindow to be moved at the end
        // 		lightbox_target.classList = 'slider lightbox inline' + (hasClass(lightbox, 'full-screen') ? ' full-screen' : ''); // Not working in Edge
        if (hasClass(lightbox, 'full-screen')) {
          addClass(lightbox_target, 'full-screen');
        }
      }

      transferClass(lightbox, lightbox_target, 'vertical');
      transferClass(lightbox, lightbox_target, 'right');

      if (lightbox.getAttribute('data-peek')) {
        lightbox_target.setAttribute('data-peek', lightbox.getAttribute('data-peek'));
      }
      /* Add any <a><img> siblings with description to a .n-slider and initialise its controls */


      var images = '';
      var thumbnails = [];
      forEach(lightbox.children, function (el) {
        // To do: facilitate a[href] extraction also from within div slides, if lightbox is existing and needs to be recreated for full screen. Get them in an array item[i].link, item[i].img
        if (!el.href && !hasClass(lightbox, 'slider')) {
          // Ignore non-links in regular lightboxes
          return;
        }

        el.setAttribute('tabindex', 0);
        thumbnails.push(el.querySelector('img') ? el.querySelector('img').getAttribute('data-src') || el.querySelector('img').src : '#');

        if (hasClass(el, 'video') || el.querySelector('video')) {
          // video poster = the anchor's img child, if it exists
          if (hasClass(lightbox, 'slider')) {
            // Secondary lightbox
            images += '<div>' + el.querySelector('video').outerHTML + '</div>';
          } else {
            images += '<div><video poster=' + (el.querySelector('img') ? el.querySelector('img').src : '#') + ' controls=controls preload=none> <source type=video/mp4 src=' + el.href + '> </video></div>';
          }

          return;
        }

        if (hasClass(el, 'iframe')) {
          images += '<div><iframe src=' + el.href + '></iframe></div>';
          return;
        }

        var slide_link;

        if (hasClass(lightbox, 'slider') || !el.href) {
          slide_link = '';
        } else {
          slide_link = document.location.href.split('#')[0].split('?')[0] + '?image=' + el.href.split('/').pop() + '#' + lightbox.getAttribute('id');
        }

        var link_element = hasClass(lightbox, 'inline') || !lightbox.getAttribute('id') ? '' : '<a class="button copy" href=' + slide_link + '></a>';
        var url = hasClass(lightbox, 'slider') ? el.querySelector('img') ? el.querySelector('img').getAttribute('data-src') : '' : el.href;
        var caption = el.title ? el.title : el.querySelector('img') ? el.querySelector('img').title : '';
        images += '<div><img data-src="' + url + '" title="' + caption + '" data-link="' + slide_link + '">' + (caption ? '<p>' + caption + '</p>' : '') + link_element + '</div>'; // Attach onload event to each image to display it only when fully loaded and avoid top-to-bottom reveal?
      });
      lightbox_target.innerHTML = images;

      if (inline_static) {
        // It's an inline lightbox and needs to become full window/screen when clicked
        lightbox_target.onclick = function (e) {
          if (e.target.tagName === 'IMG') {
            openLightbox(e);
          }
        };
      } // If secondary, openFullWindow(lightbox_target)
      // If normal, attach lightbox_target on the former place of the lightbox and init(their_parent)


      var anchor = el;

      if (anchor.href) {
        // If it's a standard lightbox with a[href], not a secondary full screen lightbox from an inline one
        while (typeof anchor.href !== 'string') {
          anchor = anchor.parentNode;
        } // Load the images in the current slide and its neighbours


        while (anchor.tagName !== 'A') {
          anchor = anchor.parentNode;
        }
      } // To do: after closing an URI-invoked lightbox and opening a lightbox again, the index is incorrect


      var this_index = 0;

      if (hasClass(lightbox, 'inline')) {
        // Secondary lightbox
        this_index = Array.prototype.indexOf.call(lightbox.children, anchor.parentNode); // Ignore non-anchor children of the lightbox container
      } else {
        this_index = Array.prototype.indexOf.call(lightbox.querySelectorAll('[href]'), closest(anchor, '[href]')); // Ignore non-anchor children of the lightbox container
      }

      if (location.href.indexOf('#' + lightbox.id) > -1 && hasClass(lightbox, 'uri-target')) {
        removeClass(lightbox, 'uri-target'); // Open URI-specified index only once, because subsequent lightbox instances would have incorrect index

        if (typeof getURLParameters()['slide'] != 'undefined') {
          this_index = getURLParameters()['slide'].split('#')[0] - 1;
        }

        if (typeof getURLParameters()['image'] != 'undefined') {
          var target_image = lightbox_target.querySelector('[data-src*="' + getURLParameters()['image'].split('#')[0] + '"]');

          if (target_image) {
            this_index = thisIndex(target_image.parentNode);
          }
        }
      }

      if (this_index > lightbox_target.children.length - 1 || this_index < 1) {
        // To do: fix this_index for a secondary full screen lightbox
        this_index = 0;
      }

      populateLightbox(lightbox_target, this_index);
      var slider = componentSlider.makeSlider(lightbox_target, this_index); // attach lightbox_target to the DOM

      if (inline_static) {
        if (!next_sibling) {
          parent.appendChild(slider);
        } else {
          parent.insertBefore(slider, next_sibling);
        }
      } else {
        // OpenFullWindow() and attach the slider to it
        addClass(slider, 'overlay');
        addClass(slider.querySelector('.n-slider'), 'overlay');
        componentModal.openFullWindow(slider); // To do: fix layout, add .overlay
      }

      transferClass(anchor.parentNode, lightbox_target.parentNode, 'outside');

      if (hasClass(lightbox, 'thumbnails')) {
        transferClass(lightbox, lightbox_target.parentNode, 'thumbnails');
        var i = 0; // 	        var nav = closest(lightbox_target, '.n-slider-wrap').querySelector('.slider-nav');

        var nav = componentSlider.getSliderNav(closest(lightbox_target, '.n-slider-wrap'));

        if (nav) {
          // Multiple slides?
          transferClass(lightbox, nav, 'thumbnails');
          forEach(thumbnails, function (el) {
            if (nav.children[i]) {
              nav.children[i].style.backgroundImage = 'url(' + thumbnails[i] + ')';
            }

            i++;
          });
        }
      }

      if (!hasClass(lightbox, 'inline')) {
        // Don't block global keyboard if the lightbox is inline
        window.addEventListener('keydown', arrow_keys_handler, false);
      }

      observerOn();
      return false;
    } // Automatically open a lightbox specified in the URI


    setTimeout(function () {
      if (q('.n-lightbox:target:not(.inline)')) {
        addClass(q('.n-lightbox:target'), 'uri-target');
        openLightbox(q('.n-lightbox:target > a[href]'));
      }

      if (q('.modal:target')) {
        q('.modal:target').click();
      }
    }, 1);

    var init = function init(host) {
      forEach(host.querySelectorAll('.n-lightbox:not([data-ready])'), function (el) {
        // Abort on IE, because of IE bug on dynamic img.src change
        if (navigator.userAgent.indexOf('MSIE') != -1 || navigator.userAgent.indexOf('Trident') != -1 || hasClass(el.parentNode, 'n-slider-wrap')) {
          return;
        }

        if (hasClass(el, 'inline')) {
          openLightbox(el.querySelector('a'));
        } else {
          forEach(el.querySelectorAll('a'), function (el) {
            el.setAttribute('tabindex', 0);
            el.onclick = openLightbox;
          });
        }

        makeReady(el);
      });
    };

    registerComponent('lightbox', init);
    /* Lightbox – end */

    return {
      populateLightbox: populateLightbox
    };
  }();

  ;

  var componentModal = function () {
    /* Modal – start */

    /**
     * This is a function where type checking is disabled.
     * @suppress {misplacedTypeAnnotation}
     */
    var disableBodyScroll = function () {
      // Thanks Thijs Huijssoon https://gist.github.com/thuijssoon

      /**
       * Private variables
       */
      var _selector = false,
          _element = false,
          _clientY;
      /**
       * Prevent default unless within _selector
       * 
       * @param  event object event
       * @return void
       */


      var preventBodyScroll = function preventBodyScroll(event) {
        if (!_element || typeof event.target.closest === 'undefined' || !event.target.closest(_selector)) {
          event.preventDefault();
        }
      };
      /**
       * Cache the clientY co-ordinates for
       * comparison
       * 
       * @param  event object event
       * @return void
       */


      var captureClientY = function captureClientY(event) {
        // only respond to a single touch
        if (event.targetTouches.length === 1) {
          _clientY = event.targetTouches[0].clientY;
        }
      };
      /**
       * Detect whether the element is at the top
       * or the bottom of their scroll and prevent
       * the user from scrolling beyond
       * 
       * @param  event object event
       * @return void
       */


      var preventOverscroll = function preventOverscroll(event) {
        // only respond to a single touch
        if (event.targetTouches.length !== 1 || closest(event.target, '.slider-nav')) {
          // also if trying to swipe slider/lightbox nav
          return;
        }

        var clientY = event.targetTouches[0].clientY - _clientY; // The element at the top of its scroll,
        // and the user scrolls down

        if (_element.scrollTop === 0 && clientY > 0) {
          event.preventDefault();
        } // The element at the bottom of its scroll,
        // and the user scrolls up
        // https://developer.mozilla.org/en-US/docs/Web/API/Element/scrollHeight#Problems_and_solutions


        if (_element.scrollHeight - _element.scrollTop <= _element.clientHeight && clientY < 0) {
          event.preventDefault();
        }
      };
      /**
       * Disable body scroll. Scrolling with the selector is
       * allowed if a selector is provided.
       * 
       * @param  boolean allow
       * @param  string selector Selector to element to change scroll permission
       * @return void
       */


      return function (allow, selector) {
        if (typeof selector !== "undefined") {
          _selector = selector;
          _element = document.querySelector(selector);
        }

        if (true === allow) {
          if (false !== _element) {
            _element.addEventListener('touchstart', captureClientY, {
              passive: false
            });

            _element.addEventListener('touchmove', preventOverscroll, {
              passive: false
            });
          }

          document.body.addEventListener("touchmove", preventBodyScroll, {
            passive: false
          });
        } else {
          if (false !== _element) {
            _element.removeEventListener('touchstart', captureClientY, {
              passive: false
            });

            _element.removeEventListener('touchmove', preventOverscroll, {
              passive: false
            });
          }

          document.body.removeEventListener("touchmove", preventBodyScroll, {
            passive: false
          });
        }
      };
    }();

    function adjustModal(e) {
      var modal = q('.n-ovrl');
      var previous_overlay_top = parseInt(document.body.style.getPropertyValue('--overlay-top'));
      var actual_viewport = window.innerHeight;
      var offset_y = modal.getBoundingClientRect().y;

      if (previous_overlay_top + '' === 'NaN') {
        previous_overlay_top = 0;
      }

      document.body.style.setProperty('--overlay-top', 0);
      document.body.style.setProperty('--overlay-bottom', 0);
      var screen_height = modal.scrollHeight;

      if (!navigator.userAgent.match(/(iPod|iPhone)/i) || Math.abs(window.orientation) !== 90 || actual_viewport === screen_height) {
        // Only for mobile Safari in landscape mode
        return;
      }

      if (typeof e !== 'undefined') {
        // On resize event (toolbars have appeared by tapping at the top or bottom area
        bodyElement.style.setProperty('--overlay-top', previous_overlay_top - offset_y + 'px');
        bodyElement.style.setProperty('--overlay-bottom', screen_height - actual_viewport + offset_y + 'px');
      } else {
        if (qa('.n-ovrl').length > 1) {
          // Multiple modals: offset has been set, no need to do anything
          return;
        }

        if (actual_viewport <= screen_height) {
          // modal is cropped, adjust its top/bottom
          if (bodyElement.scrollHeight + bodyElement.getBoundingClientRect().y === actual_viewport) {
            // page scrolled at the bottom
            bodyElement.style.setProperty('--overlay-bottom', 0);
            bodyElement.style.setProperty('--overlay-top', screen_height - actual_viewport + 'px');
          } else {
            bodyElement.style.setProperty('--overlay-top', 0);
            bodyElement.style.setProperty('--overlay-bottom', screen_height - actual_viewport + 'px');
          }
        }

        if (modal.getBoundingClientRect().y !== 0) {
          // A little off
          bodyElement.style.setProperty('--overlay-top', parseInt(bodyElement.style.getPropertyValue('--overlay-top')) - modal.getBoundingClientRect().y + 'px');
          bodyElement.style.setProperty('--overlay-bottom', parseInt(bodyElement.style.getPropertyValue('--overlay-bottom')) + modal.getBoundingClientRect().y + 'px');
        }

        if (actual_viewport + parseInt(bodyElement.style.getPropertyValue('--overlay-top')) + parseInt(bodyElement.style.getPropertyValue('--overlay-bottom')) > screen_height) {
          // Extra bug when scrolled near the bottom
          bodyElement.style.setProperty('--overlay-bottom', screen_height - actual_viewport - parseInt(bodyElement.style.getPropertyValue('--overlay-top')) + 'px');
        }
      }
    }

    function keyUpClose(e) {
      if ((e || window.event).keyCode === 27) {
        // Esc
        closeFullWindow();
      }
    }

    var previousScrollX = 0;
    var previousScrollY = 0;

    function closeFullWindow() {
      var full_window = q('.n-ovrl:last-of-type');

      if (full_window) {
        window.scrollTo(previousScrollX, previousScrollY);
        var animation = full_window.querySelector('.n-ovrl--content > div').getAttribute('data-anim'); // Custom animation?

        if (animation.length < 11) {
          // '', 'null' or 'undefined'?
          animation = '0% { transform: translate3d(0,0,0) } 100% { transform: translate3d(0,-100%,0) }'; // 100% instead of 100vh, bc IE fails
        } else {
          full_window.style.cssText = 'animation-direction: reverse;';
        }

        animate(full_window, animation, .2, function (e) {
          disableBodyScroll(false, '.n-ovrl:last-of-type .n-ovrl--content'); // Turn off and restore page scroll

          full_window.parentNode.removeChild(full_window);
          full_window_content = null;

          if (!q('.n-ovrl')) {
            // A single overlay is gone, leaving no overlays on the page
            window.removeEventListener('resize', adjustModal);
            window.removeEventListener('keydown', arrow_keys_handler); // To do: unglobal this and apply only to modal

            window.removeEventListener('keyup', keyUpClose);
            removeClass(q('html'), 'no-scroll');

            if (!q('.n-slider')) {
              // No sliders on the page to control with arrow keys
              window.removeEventListener('keydown', arrow_keys_handler, false);
            }
          } else {
            disableBodyScroll(true, '.n-ovrl:last-of-type .n-ovrl--content');
            adjustModal();
          }

          if (previouslyFocused) {
            previouslyFocused.focus();
          }
        });
      }
    }

    function openFullWindow(el, animation) {
      // el is an HTML string
      previouslyFocused = document.activeElement;
      full_window_content = document.createElement('div');

      if (typeof el === 'string') {
        full_window_content.innerHTML = el;
      } else {
        full_window_content.appendChild(el);
      }

      full_window_content.setAttribute('data-anim', animation);
      var wrapper = document.createElement('div');
      addClass(wrapper, 'n-ovrl');
      wrapper.insertAdjacentHTML('beforeend', '<div class=n-ovrl--content tabindex=0></div><div class=overlay-bg></div>');
      wrapper.firstChild.appendChild(full_window_content);
      full_window_content = wrapper;
      full_window_content.insertAdjacentHTML('afterbegin', '<div class=n-ovrl--close> ← ' + document.title + '</div>');
      full_window_content.querySelector('.overlay-bg').onclick = full_window_content.querySelector('.n-ovrl--close').onclick = closeFullWindow;
      full_window_content.querySelector('.n-ovrl--close').addEventListener("touchmove", function (e) {
        e.preventDefault();
      }, {
        passive: false
      });
      full_window_content.querySelector('.overlay-bg').addEventListener("touchmove", function (e) {
        e.preventDefault();
      }, {
        passive: false
      });
      window.addEventListener('keyup', keyUpClose);
      bodyElement.appendChild(full_window_content);
      full_window_content.querySelector('.n-ovrl--content').focus();
      disableBodyScroll(true, '.n-ovrl:last-of-type .n-ovrl--content'); // Turn on and block page scroll

      if (qa('.n-ovrl').length === 1) {
        // Sole (first) modal
        addClass(q('html'), 'no-scroll');
        previousScrollX = window.scrollX;
        previousScrollY = window.scrollY;
        window.addEventListener('resize', adjustModal);
        adjustModal();
      }

      if (full_window_content.querySelector('.full-screen')) {
        if (full_window_content.webkitRequestFullScreen) {
          full_window_content.webkitRequestFullScreen();
        }

        if (full_window_content.mozRequestFullScreen) {
          full_window_content.mozRequestFullScreen();
        }

        if (full_window_content.requestFullScreen) {
          full_window_content.requestFullScreen();
        }
      } else {
        animate(full_window_content, typeof animation === 'string' ? animation : '0% { transform: translate3d(0,-100%,0) } 100% { transform: translate3d(0,0,0) }', .2);
      }

      return false;
    }

    function modalWindow(e) {
      // Modal window of an external file content
      var el = e.target;
      var link = closest(el, '.n-modal').href;
      var animation = closest(el, '.n-modal').getAttribute('data-anim');

      if (!php_support && external.test(link) || !new XMLHttpRequest().upload) {
        // No PHP or XHR?
        window.open(link, '_blank');
        return false;
      }

      var request = new XMLHttpRequest();
      request.open('GET', external.test(link) ? scripts_location + 'request.php?targetformurl=' + link.split('#')[0] : link.split('#')[0], true);

      request.onload = function () {
        if (request.status >= 200 && request.status < 400) {
          // Success
          if (!request.responseText) {
            // No PHP?
            closeFullWindow();
            window.open(link, 'Modal');
            return false;
          }

          var container = typeof link.split('#')[1] != 'undefined' ? '#' + link.split('#')[1] : 0;
          var parsed = request.responseText;

          if (container) {
            parsed = parseHTML(request.responseText);

            if (!parsed.querySelector(container)) {
              closeFullWindow();
              return false;
            }

            parsed = parsed.querySelector(container).innerHTML;
          }

          openFullWindow(parsed, animation); // To do: If .modal[data-animation], pass it to openFullWindow() as second parameter. Also in openLightbox().

          transferClass(closest(el, '.n-modal'), q('.n-ovrl'), 'n-modal--limited');
        } else {
          // Error
          closeFullWindow();
        }
      };

      request.onerror = function () {
        // Error
        closeFullWindow();
      };

      request.send();
      return false;
    }

    var init = function init(host) {
      // Modal window: open a link's target inside it
      forEach(host.querySelectorAll('a.n-modal[href]:not([data-ready])'), function (el) {
        if (el.href !== location.href.split('#')[0] + '#') {
          // Is it an empty anchor?
          el.onclick = modalWindow;
        }

        if (!el.getAttribute('rel')) {
          el.setAttribute('rel', 'prefetch');
        }

        makeReady(el);
      });
    };

    registerComponent('modal', init);
    return {
      closeFullWindow: closeFullWindow,
      openFullWindow: openFullWindow
    };
    /* Modal – end */
  }(); // To do: √ adjust multiple modals – if a prior modal exists, don't re-adjust, use the current offsets
  // To do: √ When second modal triggers a resize (toolbars appear), it should call adjustModal()
  // To do: √ allow scrolling in modal content, don't let a slider inside the modal block modal's vertical swipe scroll 
  // To do: disable page scroll by arrow keys
  // To do: √ after closing the second modal, page is scrollable


  ; // Component Nav – start

  (function () {
    /* Nav – start */
    function closeDropNavClickedOutside(e) {
      // Close the nav when clicking outside
      if (!closest(e.target, 'nav li')) {
        forEach('nav ul', function (el) {
          el.removeAttribute(aria_expanded);
        });

        if (q('nav :focus')) {
          q('nav :focus').blur();
        }
      }
    }

    function dropNavBlur(e) {
      var this_nav = closest(e.target, 'nav');

      if (!closest(e.relatedTarget, this_nav)) {
        // if e.relatedTarget is not a child of this_nav, then the next focused item is elsewhere
        forEach(this_nav.querySelectorAll('ul'), function (el) {
          el.removeAttribute(aria_expanded);
        });
        return;
      } // Close neighboring parent nav's sub navs.


      var el = e.target;
      var target_parent = closest(el, '[aria-haspopup]');

      if (target_parent) {
        // Skip if it's a top-level-only item
        forEach(target_parent.querySelectorAll('ul[aria-expanded]'), function (el) {
          // Disable active grandchildren
          el.removeAttribute(aria_expanded);
        });
      }

      el = e.target.parentNode;

      if (!el.nextElementSibling && // last item
      el.parentNode.parentNode.nodeName === 'LI' && // of third-level nav
      !el.parentNode.parentNode.nextElementSibling) {
        el.parentNode.parentNode.parentNode.removeAttribute(aria_expanded);
      }
    }

    function dropNavFocus(e) {
      // Close focused third level child when focus moves to another top-level item
      var el = closest(e.target, 'nav > ul > li');
      forEach(el.parentNode.childNodes, function (a) {
        if (a.nodeName === 'LI' && a !== el) {
          forEach(a.querySelectorAll('[aria-expanded]'), function (el) {
            el.removeAttribute(aria_expanded);
          });
        }
      });
      el = e.target;
      el.parentNode.parentNode.setAttribute(aria_expanded, true);

      if (el.parentNode.querySelector('ul')) {
        el.parentNode.querySelector('ul').setAttribute(aria_expanded, true);
      }

      var current_item = e.target.parentNode;
      forEach(current_item.parentNode.parentNode.childNodes, function (el) {
        if (el !== current_item && el.nodeName === 'LI' && el.querySelector('ul')) {
          el.querySelector('ul').removeAttribute(aria_expanded);
        }
      });
    }

    var closeDropNavClickedOutsideEnabled = false;

    function initNav(el) {
      // Delete all trigger inputs, add tabindex=0 to each li
      forEach(el.querySelectorAll('input'), function (el) {
        el.outerHTML = '';
      });
      el.setAttribute('role', 'menubar');
      forEach(el.querySelectorAll('li > a'), function (el) {
        el.setAttribute('tabindex', 0);
      });

      if (!closest(el, 'nav.n-drop')) {
        // The rest is for drop nav only
        return;
      }

      if (!closeDropNavClickedOutsideEnabled) {
        window.addEventListener('touchend', closeDropNavClickedOutside);
        closeDropNavClickedOutsideEnabled = true;
      }

      el.addEventListener('keyup', function (e) {
        // Check for sibling or children to expand on control keys Left/Right/etc
        if (e.key === 'Escape') {
          forEach(closest(e.target, 'nav').querySelectorAll('ul'), function (el) {
            el.removeAttribute(aria_expanded);
          });
          document.activeElement.blur();
        }
      });
      forEach(el.querySelectorAll('li'), function (el) {
        if (el.querySelector('ul')) {
          el.setAttribute('aria-haspopup', true);

          if (el.children[0].nodeName === 'UL') {
            el.insertBefore(el.children[1], el.children[0]); // Swap 'a' with 'ul'
          }
        }

        el.addEventListener('touchend', function (e) {
          var el = e.target;

          if (draggingNow || typeof el.href === 'string') {
            return;
          }

          e.preventDefault();
          e.stopPropagation();

          if (el.nodeName === 'LI') {
            el = el.querySelector('a');
          }

          if (el === document.activeElement) {
            el.blur();
          } else {
            el.focus();
          }
        });
        var anchor = el.querySelector('a');
        anchor.addEventListener('focus', dropNavFocus);
        anchor.addEventListener('blur', dropNavBlur);
      });
      draggingNow = false;
    }
    /* Nav – end */


    var init = function init(host) {
      forEach(host.querySelectorAll('nav:not([data-ready]) > ul:not([role])'), function (el) {
        initNav(el);
        makeReady(closest(el, 'nav'));
      });
    };

    registerComponent('nav', init);
  })(); // Component Nav – end


  ; // Component Notification bar – start

  var componentNotify = function () {
    function notifyClose(el) {
      el.parentNode.removeChild(el);
    }

    function notifyCloseEvent() {
      if (q('.n-notify')) {
        q('.n-notify').onclick = function (e) {
          notifyClose(e.target);
        };
      }
    }

    function notify(content, option) {
      bodyElement.insertAdjacentHTML('afterbegin', '<div class="n-notify' + (option && option.indexOf('fixed') !== -1 ? ' fixed' : '') + '">' + content + '</div>');
      notifyCloseEvent();

      if (option && option.indexOf('timeout') !== -1) {
        setTimeout(function () {
          notifyClose(q('.n-notify'));
        }, 2000);
      }
    }

    var init = function init(host) {
      /* Tooltip */
      forEach(host.querySelectorAll('.n-notify:not([data-ready])'), function (el, i) {
        notifyCloseEvent();
        makeReady(el);
      });
    };

    registerComponent('notify', init);
    return {
      notify: notify
    };
  }(); // Component Notification bar – end


  ; // Component Slider – start

  var componentSlider = function () {
    /* natUIve Slider */
    var last_slide_time = 14045017000;
    var slide_duration = .5;

    function sliderElement(e) {
      // Get the active slider instance
      if (closest(document.activeElement, 'n-slider-wrap') === focusWithin('.n-slider-wrap')) {
        return focusWithin('.n-slider-wrap').querySelector('.n-slider');
      }

      var el = e.target;

      if (hasClass(el, 'n-slider-wrap')) {
        return el.querySelector('.n-slider');
      } else {
        var container = closest(el, '.n-slider-wrap');
        return container && container.querySelector('.n-slider');
      }
    }

    function getSliderNav(slider_wrap) {
      // Select either a child slider-nav or the one specified by the slider id, if it exists
      var slider = slider_wrap.querySelector('.n-slider');
      var slider_nav;

      if (slider.id && (slider_nav = q('.slider-nav[data-for=' + slider.id + ']'))) {
        // Detached nav
        return slider_nav;
      } else {
        return slider_wrap.querySelectorAll('.slider-nav')[slider_wrap.querySelectorAll('.slider-nav').length - 1]; // With a simple query, it would get the nav of an eventual nested slider, instead of the current one. Current nav is either a direct child or a .pad direct child, taken as the last one of all.
      }
    }
    /* Thanks to Pete & Eike Send for the swipe events – http://www.thepetedesign.com/demos/purejs_onepage_scroll_demo.html */


    function swipeEvents(el) {
      var startX, startY;
      el.addEventListener('touchstart', touchStart);

      function touchStart(e) {
        var touches = e.touches;

        if (touches && touches.length) {
          startX = touches[0].pageX;
          startY = touches[0].pageY;
          el.addEventListener('touchmove', touchMove);
        }
      }

      function touchMove(e) {
        var touches = e.touches;

        if (touches && touches.length && !(hasClass(el, 'vertical') && !closest(el, '.n-ovrl'))) {
          // Don't slide vertically if not full window
          var deltaX = startX - touches[0].pageX;
          var deltaY = startY - touches[0].pageY;
          var delta = Math.abs(deltaX) > Math.abs(deltaY) ? deltaX : deltaY;
          var overlay_content = closest(el, '.n-ovrl') ? closest(el, '.n-ovrl').querySelector('.n-ovrl--content') : null; // Allow vertical page scroll by swiping over the slider. Also when parent modal is scrollable vertically

          if ((hasClass(el, 'vertical') ? Math.abs(deltaY) < Math.abs(deltaX) : Math.abs(deltaX) < Math.abs(deltaY)) && !q('.n-ovrl .n-slider-wrap') || overlay_content && overlay_content.scrollHeight > overlay_content.offsetHeight && Math.abs(deltaX) < Math.abs(deltaY) || e.target.nodeName === 'INPUT' && e.target.type === 'range' || hasClass(e.target.parentNode, 'slider-nav') || hasClass(e.target, 'slider-nav')) {
            return;
          }

          e.preventDefault();

          if (Math.abs(delta) > 50) {
            var event = new Event(delta >= 50 ? 'swipeLeft' : 'swipeRight');
            el.dispatchEvent(event);
            el.removeEventListener('touchmove', touchMove);
          }
        }
      }
    }

    function initScroll(e, delta) {
      // Scroll happens
      var timeNow = new Date().getTime(); // Cancel scroll if currently animating or within quiet period – don't slide again automatically after a slide

      if (timeNow - last_slide_time < slide_duration * 2000
      /* || hasClass(q('html'), 'sliding_now') */
      ) {
          stopEvent(e);
          return;
        }

      last_slide_time = timeNow;
      slide(sliderElement(e), delta < 0 ? 'right' : 'left');
    }

    function mouseWheelHandler(e) {
      var el = e.target;

      if (closest(el, '.slider-nav')) {
        // Allow scrolling the nav bar
        return;
      }

      var deltaX = e.deltaX * -10 || e.wheelDeltaX || -e.detail; // Firefox provides 'detail' with opposite value

      var deltaY = e.deltaY * -10 || e.wheelDeltaY || -e.detail;
      /* To do: stop generating events while sliding */

      if (
      /* !hasClass(q('html'), 'sliding_now') && */
      Math.abs(hasClass(sliderElement(e), 'vertical') ? deltaY : deltaX) > 50) {
        e.preventDefault();
        initScroll(e, Math.abs(deltaX) > Math.abs(deltaY) ? deltaX : deltaY);
      }
    }

    function mouseEvents(el, toggle) {
      if (!('onwheel' in window) || hasClass(el, 'vertical') && !closest(el, '.n-ovrl')) {
        // Check for mouse wheel and don't slide vertically if not full window
        return;
      }

      var slider_wrap = closest(el, '.n-slider-wrap');

      if (toggle === 'off') {
        slider_wrap.removeEventListener('wheel', mouseWheelHandler);
      } else {
        slider_wrap.addEventListener('wheel', mouseWheelHandler);
        /*
        	        if (getSliderNav(slider_wrap)) {
        	
        		        getSliderNav(slider_wrap).addEventListener('wheel', function (e) {
        		
        			        // Scroll as usual instead of sliding
        		
        		        });
        	        
        	        }
        */
      }
    }

    function endSlide(slider, index, old_index) {
      if (hasClass(slider, 'n-lightbox')) {
        componentLightbox.populateLightbox(slider, index);
      }

      var slider_wrap = closest(slider, '.n-slider-wrap');

      if (getSliderNav(slider_wrap)) {
        // Multiple slides? // To do: get the proper slider nav, if it's detached
        getSliderNav(slider_wrap).children[index].setAttribute('data-active', true);
      }

      slider.children[index].setAttribute('data-active', true);

      if (!hasClass(slider, 'vertical')) {
        slider.style.marginLeft = -100 * index + '%';
      }

      slider.style.pointerEvents = '';
      window.addEventListener('keyup', sliderKeyboard);
      setTimeout(function () {
        // 	    removeClass(q('html'), 'sliding_now');
        mouseEvents(slider); // Make this slider active

        if (slider.children[index].id) {
          // Scroll page to slide hash. To do: restore focus
          scrollToAnimated(getCumulativeOffset(slider.children[index]).y, .2, function () {
            var focused = document.activeElement;
            window.location.hash = slider.children[index].id;
            focused.focus();
          });
        } else {
          // If previous slide id is in URI, remove URI hash
          if (typeof old_index !== 'undefined' && location.hash === '#' + slider.children[old_index].id) {
            removeHash();
          }
        }
      }, slide_duration / 2);
    }

    function slide(el, method, index_number) {
      /*
      	if (hasClass(q('html'), 'sliding_now')) {
      		
      		return;
      	
      	}
      */
      var slider_wrap = closest(el, '.n-slider-wrap');
      var slider = slider_wrap.querySelector('.n-slider');

      if (slider.children.length < 2) {
        endSlide(el, 0);
        return el;
      }

      mouseEvents(slider_wrap, 'off');
      slider.style.pointerEvents = 'none'; // Speed up animation

      mouseEvents(el, 'off');
      window.removeEventListener('keyup', sliderKeyboard);
      clearTimeout(slider.getAttribute('data-timeout'));
      var index;
      var old_index;
      var slider_nav = getSliderNav(slider_wrap);
      var active_nav_item = slider_nav.querySelector('a[data-active]');

      if (!active_nav_item) {
        return;
      }

      index = old_index = thisIndex(active_nav_item);

      if (method === 'index') {
        if (typeof index_number === 'undefined' || index_number === index || !slider.querySelector('[data-active]')) {
          /* Don't slide to current slide */
          endSlide(slider, index_number);
          return;
        }

        index = index_number;
      }

      if (method === 'right') {
        if (index === slider.children.length - 1) {
          index = 0;
        } else {
          index++;
        }
      }

      if (method === 'left') {
        if (index === 0) {
          index = slider.children.length - 1;
        } else {
          index--;
        }
      }

      var offset_sign = -1; // Slider offset depending on direction. -1 for LTR or 1 for RTL. Vertical is always '-'

      var computed_height;
      var computed_height_old;
      var target_slide = slider.children[index];
      var height_change = '';
      var height_current = '';

      if (hasClass(slider, 'auto-height')) {
        height_change = 'height: ' + target_slide.scrollHeight + 'px';
        height_current = 'height: ' + slider.scrollHeight + 'px';
      }

      var next_slide_image = target_slide.querySelector('img');

      if (hasClass(slider, 'vertical') && hasClass(slider, 'inline') && !hasClass(slider, 'overlay') && next_slide_image && !hasClass(slider_wrap.parentNode, 'aspect')) {
        // To do: integrate aspect with n-slider-wrap
        var height_change_number = slider.clientWidth * next_slide_image.naturalHeight / next_slide_image.naturalWidth;

        if (slider.clientWidth >= next_slide_image.naturalWidth) {
          height_change_number = next_slide_image.naturalHeight;
        }

        height_change = 'height: ' + height_change_number + 'px';
        height_current = 'height: ' + slider.scrollHeight + 'px';
      }

      if (hasClass(slider, 'vertical')) {
        target_slide.style.cssText = 'display: block'; // Temporarily display the target slide to get its height

        computed_height = getComputedStyle(target_slide).height;
        target_slide.style.cssText = '';
        computed_height_old = getComputedStyle(slider.children[old_index]).height;
      } else {
        computed_height = getComputedStyle(slider).height;

        if (slider.getAttribute('dir') === 'rtl') {
          offset_sign = 1;
        }
      }

      slider.style.height = computed_height;

      if (slider_nav.querySelector('[data-active]')) {
        slider_nav.querySelector('[data-active]').removeAttribute('data-active');
      }

      var duration = slider.getAttribute('data-duration') || slide_duration;
      target_slide.setAttribute('data-active', true);
      var translate_from, translate_to;

      if (hasClass(slider, 'vertical')) {
        var next_height = hasClass(slider, 'vertical') && hasClass(slider, 'inline') && !hasClass(slider, 'overlay') && next_slide_image && !hasClass(slider_wrap.parentNode, 'aspect') ? '-' + height_change_number + 'px' : '-100%';
        translate_from = 'translate3d(0,' + (index < old_index ? next_height : '0') + ',0)';
        computed_height = parseInt(computed_height, 10);
        computed_height_old = parseInt(computed_height_old, 10);
        var difference = Math.abs(computed_height - computed_height_old);

        if (computed_height > computed_height_old) {
          // Shortened statement results in larger Closure Compiler file, let it optimise
          difference = Math.max(computed_height, computed_height_old) - difference;
        } else {
          difference = Math.min(computed_height, computed_height_old) + difference;
        }

        translate_to = 'translate3d(0,' + (index < old_index ? '0' : '-' + difference + 'px') + ',0)';
        slider.children[old_index].style.transition = 'opacity ' + duration / 2 + 's linear';
        slider.children[old_index].style.opacity = 0;
      } else {
        if (slider.getAttribute('data-peek')) {
          translate_from = 'translate3d(0,0,0)';
          translate_to = 'translate3d(' + offset_sign * (index - old_index) + '00%,0,0)';
        } else {
          translate_from = 'translate3d(' + offset_sign * (index < old_index ? 1 : 0) + '00%,0,0)';
          translate_to = 'translate3d(' + offset_sign * (index < old_index ? 0 : 1) + '00%,0,0)';
        }
      }

      slider_wrap.setAttribute('data-sliding', true);

      if (!slider.getAttribute('data-peek')) {
        slider.style.margin = 0;
      }

      function slideEndHandler(e) {
        // On slide end
        slider.children[index].style.cssText = slider.children[old_index].style.cssText = '';
        slider_wrap.removeAttribute('data-sliding');
        slider.children[old_index].removeAttribute('data-active');
        slider.children[old_index].style.transition = slider.children[old_index].style.opacity = slider.style.height = '';
        current_slider = slider;
        endSlide(slider, index, old_index);
      }

      if (hasClass(slider, 'fade-overlap')) {
        // fade slides in/out directly. Overlap new and old slides.
        slider.children[index].style.opacity = '0';
        slider.children[index > old_index ? index : old_index].style.marginLeft = '-100%';
        slider.children[old_index].style.opacity = '1'; // Animate both simultaneously

        animate(slider.children[index], '0% { opacity: 0; } 100% { opacity: 1; }', duration, slideEndHandler);
        animate(slider.children[old_index], '0% { opacity: 1; } 100% { opacity: 0; }', duration);
      } else {
        var animation_code;

        if (hasClass(slider, 'fade')) {
          // fade out to a color and fade in to the new slide
          animation_code = '0% { opacity: 1; transform: ' + translate_from + '; ' + height_current + '} 49% { transform: ' + translate_from + ' } 51% { opacity: 0; transform:' + translate_to + ' } 100% {' + height_change + '; opacity: 1; transform:' + translate_to + ' }';
        } else {
          animation_code = '0% { transform: ' + translate_from + '; ' + height_current + '} 100% { ' + height_change + '; transform: ' + translate_to + '; }';
        }

        animate(slider, animation_code, duration, slideEndHandler);
      }
    }

    function shouldNotSlideVertically(el) {
      if (q('.n-ovrl')) {
        return false;
      }

      return !hasClass(el, 'vertical') || window.innerHeight < bodyElement.scrollHeight;
    }

    function sliderKeyboard(e) {
      if (typeof e === 'undefined' || //     	hasClass(q('html'), 'sliding_now') || 
      q('.n-slider-wrap[data-sliding]') || q('.n-ovrl') && !q('.n-ovrl .n-slider-wrap') // There is an overlay open and it doesn't have a slider in it
      ) {
          return;
        }

      var el = e.target;

      if (!closest(el, '.n-slider-wrap') && q('.n-slider-wrap')) {
        // Focused element is outside of any slider
        // 		current_slider = q('.n-slider-wrap').querySelector('.slider');
        var scrollable = el; // Don't slide when current element is scrollable. Check all parent nodes for scrollability – cheak each parent until body.

        while (scrollable.nodeName !== 'BODY') {
          if (scrollable.scrollWidth > scrollable.clientWidth || scrollable.scrollHeight > scrollable.clientHeight) {
            return;
          }

          scrollable = scrollable.parentElement;
        }
      } else {
        current_slider = closest(el, '.n-slider-wrap') ? closest(el, '.n-slider-wrap').querySelector('.n-slider') : null;
      }

      if (focusWithin('.n-slider')) {
        current_slider = focusWithin('.n-slider');
      }

      if (el.tagName !== 'INPUT' && el.tagName !== 'TEXTAREA' && ( // 		(document.activeElement === el ? (el.scrollWidth <= el.clientWidth) : true) &&
      // 		(!closest(document.activeElement, '.n-slider-wrap.active') && (el.scrollWidth <= el.clientWidth) ) &&
      el = q('.n-ovrl .n-slider') || current_slider || q('.n-slider'))) {
        // Priority: full window slider, active slider, first slider
        switch (e.which) {
          case 38:
            if (shouldNotSlideVertically(el)) {
              // Page can be scrolled by the arrow key so don't slide
              return;
            }

          case 37:
            slide(el, 'left');
            break;

          case 40:
            if (shouldNotSlideVertically(el)) {
              return;
            }

          case 39:
            slide(el, 'right');

          default:
            return;
        }
      }
    }

    function cancelTouchEvent(el) {
      el.addEventListener('touchstart', function (e) {
        e.stopPropagation();
        return false;
      });
    }

    function makeSlider(el, current_slide) {
      if (el.getAttribute('data-ready')) {
        // Already created
        return;
      }

      observerOff();
      addClass(el, 'n-slider');
      makeReady(el);

      if (hasClass(el, 'full-window')) {
        addClass(el, 'overlay');
        componentModal.openFullWindow(el.outerHTML);
      }

      var container = el.parentNode;

      if (!container || !hasClass(container, 'n-slider-wrap')) {
        container = wrap(el);
        addClass(container, 'n-slider-wrap');

        if (container.parentNode && hasClass(container.parentNode, 'aspect')) {
          addClass(container, 'inside-aspect');
        }

        el = container.querySelector('.n-slider');

        if (hasClass(el, 'pad')) {
          container = wrap(el);
          addClass(container, 'pad');
          container = container.parentNode;
          el = container.querySelector('.n-slider');
        }

        transferClass(el, container, 'vertical');
        transferClass(el, container, 'wrap');
        transferClass(el, container, 'top');
        transferClass(el, container, 'right');
        transferClass(el, container, 'overlay');
        var peek = el.getAttribute('data-peek');

        if (peek) {
          addClass(container, 'peek');

          if (hasClass(el, 'vertical')) {
            container.style.padding = peek + ' 0';
          } else {
            container.style.padding = '0 ' + peek;
          }
        }
      }

      if (el.children.length > 1) {
        // Add controls only to a slider with multiple slides
        var slider_nav;

        if (el.id && (slider_nav = q('.slider-nav[data-for=' + el.id + ']'))) {
          // Detached nav
          addClass(container, 'detached-nav');
          addClass(el, 'detached-nav');
        } else {
          container.insertAdjacentHTML(hasClass(container, 'top') ? 'afterbegin' : 'beforeend', '<div class=slider-nav></div>');
          slider_nav = container.querySelector('.slider-nav:not([data-for])'); // Not data-for to avoid nested detached nav for nested sliders
        }

        container.insertAdjacentHTML('beforeend', '<a class="slider-arrow left" tabindex=0></a><a class="slider-arrow right" tabindex=0></a>'); // Generate controls

        for (var i = 0; i < el.children.length; i++) {
          if (hasClass(el, 'tabs')) {
            addClass(container, 'tabs');
            addClass(slider_nav, 'row');
            addClass(slider_nav, 'tabs');
            transferClass(container, slider_nav, 'wrap');
            transferClass(el, container, 'vertical');
            var tab_title = el.children[i].getAttribute('data-tab_title') || (el.children[i].querySelector('.tab-title') ? el.children[i].querySelector('.tab-title').innerHTML : i + 1);
            slider_nav.insertAdjacentHTML('beforeend', '<a tabindex="0">' + tab_title + '</a>');
          } else {
            slider_nav.insertAdjacentHTML('beforeend', '<a tabindex=0>' + (i + 1) + '</a>');
          }

          slider_nav.lastChild.onclick = slider_nav.lastChild.onkeyup = function (e) {
            if (e.type === 'keyup' && e.keyCode !== 13) {
              // Slide on Enter key
              return;
            }

            slide( // Select slider either through id or as a parent
            slider_nav.getAttribute('data-for') ? q('.n-slider#' + slider_nav.getAttribute('data-for')) : e.target, 'index', thisIndex(e.target));
          };

          cancelTouchEvent(slider_nav.lastChild);
        }

        container.querySelector('.slider-arrow').onclick = container.querySelector('.slider-arrow').onkeyup = function (e) {
          if (e.type === 'keyup' && e.keyCode !== 13) {
            // Slide on Enter key
            return;
          }

          slide(e.target, 'left');
        };

        cancelTouchEvent(container.querySelector('.slider-arrow'));

        container.querySelector('.slider-arrow.right').onclick = container.querySelector('.slider-arrow.right').onkeyup = function (e) {
          if (e.type === 'keyup' && e.keyCode !== 13) {
            // Slide on Enter key
            return;
          }

          slide(e.target, 'right');
        };

        cancelTouchEvent(container.querySelector('.slider-arrow.right'));
        mouseEvents(el);
        swipeEvents(container);
        container.addEventListener('swipeLeft', function (e) {
          var el = sliderElement(e);
          slide(el, 'right');
        });
        container.addEventListener('swipeRight', function (e) {
          var el = sliderElement(e);
          slide(el, 'left');
        });
        container.addEventListener('mouseover', function (e) {
          clearTimeout(el.getAttribute('data-timeout'));
        }); // Don't slide when using a range input in a form in a slider

        if (el.querySelector('input[type=range]')) {
          forEach(el.querySelector('input[type=range]'), function (el) {
            el.ontouchmove = function (e) {
              e.stopPropagation(); // 					removeClass(q('html'), 'sliding_now');
            };
          });
        }

        if (el.getAttribute('data-autoslide')) {
          // auto slide
          var delay = el.getAttribute('data-autoslide');
          delay = delay.length > 0 ? 1000 * delay : 4000;

          var autoSlide = function autoSlide() {
            slide(el, 'right');
            el.setAttribute('data-timeout', setTimeout(autoSlide, delay));
          };

          setTimeout(autoSlide, delay);
        }

        var _current_slide = current_slide; // If URI #id matches a slide #id, go to that slide and scroll the page to the slider.

        if (!current_slide && window.location.hash && el.querySelector(window.location.hash)) {
          _current_slide = thisIndex(el.querySelector(window.location.hash));
          current_slider = container;
        }

        endSlide(el, _current_slide || 0); // Start from (other than) the first slide
      } else {
        el.children[0].setAttribute('data-active', true);
      } // Detect text direction


      el.setAttribute('dir', getComputedStyle(el, null).getPropertyValue('direction'));
      window.addEventListener('keyup', sliderKeyboard);
      observerOn();
      return container;
    }

    var init = function init(host) {
      forEach(host.querySelectorAll('.n-slider:not([data-ready])'), function (el) {
        makeSlider(el);
      });
    };

    registerComponent('slider', init);
    return {
      makeSlider: makeSlider,
      getSliderNav: getSliderNav
    };
  }(); // Component Fold – end


  ; // Component Table – start

  (function () {
    /* Sort parent table's rows by matching column number alternatively desc/asc on click */
    function sortTable(table, column, f) {
      var rows = Array.prototype.slice.call(table.querySelectorAll('tbody tr'), 0);
      ;
      rows.sort(function (a, b) {
        var A = a.querySelectorAll('td')[column].textContent.toUpperCase();
        var B = b.querySelectorAll('td')[column].textContent.toUpperCase();

        if (A < B) {
          return 1 * f;
        }

        if (A > B) {
          return -1 * f;
        }

        return 0;
      }); // 	observerOff();

      for (var i = 0; i < rows.length; i++) {
        table.querySelector('tbody').appendChild(rows[i]);
      } // 	observerOn();

    }

    var init = function init(host) {
      forEach(host.querySelectorAll('table:not([data-ready])'), function (el) {
        addClass(wrap(el), 'n-tbl');
        makeReady(el);
        el.parentNode.setAttribute('tabindex', 0);
      });

      if (typeof bodyElement.dataset !== 'undefined') {
        // el.dataset.sort not supported by IE10
        forEach(host.querySelectorAll('td[data-sort]'), function (el) {
          // To do: work only on tables that aren't ready
          // asc or desc
          if (el.dataset.sort !== 'asc' && el.dataset.sort !== 'desc') {
            el.dataset.sort = 'desc';
          }

          function sortTableEvent(e) {
            stopEvent(e);
            var el = e.target;
            var cell = el.type === 'td' ? el : closest(el, 'td');
            var f; // Ascending

            if (cell.dataset.sort === 'desc') {
              f = -1;
              cell.dataset.sort = 'asc';
            } else {
              f = 1;
              cell.dataset.sort = 'desc';
            }

            sortTable(closest(el, 'table'), thisIndex(cell), f);
          }

          el.onclick = el.ontouchend = sortTableEvent;
        });
      }
    };

    registerComponent('table', init);
  })(); // Component Table – end


  ; // Component Tooltip – start

  (function () {
    var init = function init(host) {
      /* Tooltip */
      forEach(host.querySelectorAll('.n-tool:not([data-ready])'), function (el, i) {
        el.onclick = function (e) {
          toggleAttribute(closest(e.target, '.n-tool'), aria_expanded);
        };

        var t = el.querySelector('.n-tool--tip');
        if (!t) return;
        el.style.position = 'static'; // dangerous with absolutely-positioned containers, which should be avoided anyway

        el.parentNode.style.position = 'relative'; // dangerous with absolutely-positioned containers, which should be avoided anyway

        /*
        	    t.style.top = (t.parentNode.offsetTop + t.parentNode.offsetHeight) + 'px';
        	    t.style.width = '100%';
        */

        var label = el.querySelector('.n-tool--label');

        if (label) {
          label.setAttribute('tabindex', 0);

          label.onkeyup = function (e) {
            if (e.key === 'Enter') {
              toggleAttribute(closest(e.target, '.n-tool'), aria_expanded);
            }
          };

          label.onblur = function (e) {
            closest(e.target, '.n-tool').removeAttribute(aria_expanded);
          };
        }

        makeReady(el);
      });
    };

    registerComponent('tooltip', init);
  })(); // Component Fold – end


  initComponents();
  return {
    initComponents: initComponents,
    animate: animate,
    copyButton: copyButton,
    componentNotify: componentNotify,
    addComponent: addComponent
  };
}();
//# sourceMappingURL=natuive.babel.js.map