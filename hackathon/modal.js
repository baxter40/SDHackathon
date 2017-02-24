/*jslint browser:true, devel:true */
/*global window, global shopdirect */

// Event listener polyfill
this.Element&&Element.prototype.attachEvent&&!Element.prototype.addEventListener&&function(){function a(a,b){Window.prototype[a]=HTMLDocument.prototype[a]=Element.prototype[a]=b}function b(a){b.interval&&document.body&&(b.interval=clearInterval(b.interval),document.dispatchEvent(new CustomEvent("DOMContentLoaded")))}a("addEventListener",function(a,b){var c=this,d=c.addEventListener.listeners=c.addEventListener.listeners||{},e=d[a]=d[a]||[];e.length||c.attachEvent("on"+a,e.event=function(a){var b=c.document&&c.document.documentElement||c.documentElement||{scrollLeft:0,scrollTop:0};a.currentTarget=c,a.pageX=a.clientX+b.scrollLeft,a.pageY=a.clientY+b.scrollTop,a.preventDefault=function(){a.returnValue=!1},a.relatedTarget=a.fromElement||null,a.stopImmediatePropagation=function(){i=!1,a.cancelBubble=!0},a.stopPropagation=function(){a.cancelBubble=!0},a.target=a.srcElement||c,a.timeStamp=+new Date;var d={};for(var f in a)d[f]=a[f];for(var h,f=0,g=[].concat(e),i=!0;i&&(h=g[f]);++f)for(var k,j=0;k=e[j];++j)if(k==h){k.call(c,d);break}}),e.push(b)}),a("removeEventListener",function(a,b){for(var g,c=this,d=c.addEventListener.listeners=c.addEventListener.listeners||{},e=d[a]=d[a]||[],f=e.length-1;g=e[f];--f)if(g==b){e.splice(f,1);break}!e.length&&e.event&&c.detachEvent("on"+a,e.event)}),a("dispatchEvent",function(a){var b=this,c=a.type,d=b.addEventListener.listeners=b.addEventListener.listeners||{},e=d[c]=d[c]||[];try{return b.fireEvent("on"+c,a)}catch(b){return void(e.event&&e.event(a))}}),Object.defineProperty(Window.prototype,"CustomEvent",{get:function(){var a=this;return function(c,d){var f,e=a.document.createEventObject();e.type=c;for(f in d)"cancelable"==f?e.returnValue=!d.cancelable:"bubbles"==f?e.cancelBubble=!d.bubbles:"detail"==f&&(e.detail=d.detail);return e}}}),b.interval=setInterval(b,1),window.addEventListener("load",b)}(),(!this.CustomEvent||"object"==typeof this.CustomEvent)&&function(){this.CustomEvent=function(b,c){var d;c=c||{bubbles:!1,cancelable:!1,detail:void 0};try{d=document.createEvent("CustomEvent"),d.initCustomEvent(b,c.bubbles,c.cancelable,c.detail)}catch(a){d=document.createEvent("Event"),d.initEvent(b,c.bubbles,c.cancelable),d.detail=c.detail}return d}}();

(function() { 
  "use strict";

  // flags unsupported browser
  var polyfillBrowser = false;
  var IE8 = document.getElementsByTagName("html")[0].className.indexOf("oldie") > -1;

  // requestAnimationFrame polyfill
  var lastTime=0,vendors=["webkit","moz"],x;for(x=0;x<vendors.length&&!window.requestAnimationFrame;x+=1)window.requestAnimationFrame=window[vendors[x]+"RequestAnimationFrame"],window.cancelAnimationFrame=window[vendors[x]+"CancelAnimationFrame"]||window[vendors[x]+"CancelRequestAnimationFrame"];var requestAnimationFrame;window.requestAnimationFrame?requestAnimationFrame=window.requestAnimationFrame:(polyfillBrowser=!0,requestAnimationFrame=function(a){var b=Date.now(),c=Math.max(0,16-(b-lastTime)),d=window.setTimeout(function(){a(b+c)},c);return lastTime=b+c,d},window.cancelAnimationFrame||(window.cancelAnimationFrame=function(a){clearTimeout(a)}));

  if (!window.innerHeight) {
    window.innerHeight = document.documentElement.clientHeight;
  }
  if (!window.innerWidth) {
    window.innerWidth = document.documentElement.clientWidth;
  }
  var desktopModal = window.desktopModal || false;
  if (document.getElementsByTagName("html")[0].className.indexOf("desktop") > -1) {
    desktopModal = true;
  }

  var css = "body.activemodal { height: 100%; width: 100%; overflow: hidden; position: fixed}.modal-container { display: none; position: fixed; z-index: 99999; background: #FFF; font-family: Arial-MT, Arial, sans-serif; font-size: 12px; line-height: 17px; -webkit-backface-visibility: hidden;}.modal-container .modal-header { height: 50px; background-color: #ffffff; box-shadow: 0 2px 4px 0 rgba(0, 0, 0, 0.1);}.modal-container .modal-header .modal-title { display: block; color: #3a3a3a; font-weight: bold; line-height: 50px; font-size: 17px; padding-left: 20px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;margin:0;}.modal-container .modal-header .modal-close { position: relative; float: right; height: 14px; width: 14px; padding: 18px; -webkit-tap-highlight-color: rgba(0, 0, 0, 0); cursor: pointer; z-index: 2;}.modal-container .modal-content { padding: 10px 20px 5px 20px; overflow-y: scroll; -webkit-overflow-scrolling: touch;}.modal-container .modal-content .loading-wrapper { width: 100%; padding: 20px 0px 20px 0px;}.modal-container .modal-content .loading-wrapper img { display: block; width: 32px; height: 32px; margin: auto;}#modal-bg { display: none; opacity: 0; position: fixed; top: 0px; left: 0px; height: 100%; width: 100%; background: #000; z-index: 1002; -webkit-backface-visibility: hidden;}",
    head = document.head || document.getElementsByTagName('head')[0],
    style = document.createElement('style');

  style.type = 'text/css';
  if (style.styleSheet){
    style.styleSheet.cssText = css;
  } else {
    style.appendChild(document.createTextNode(css));
  }

  head.appendChild(style);

  window.shopdirect = window.shopdirect || {};
  shopdirect.ui = shopdirect.ui || {};

  /**
  * The modal object
  * @constructor
  * @param {object} settings - settings object for this modal instance
  */
  shopdirect.ui.modal = function(settings) {
    // keep a reference to the modal object
    var self = this;

    self.props = {};
    self.container = null;
    self.dim = null;

    // MODEL
    self.m = {
      init: function(settings) {
        self.m.updateProperties(settings); // extend the default properties with those given
        self.props['transitionEndEvent'] = self.m.setTransitionEvent();
        self.v.createModal(); // create modal with defined properties
      },
      show: function() {
        // ensure modal is not currently visible
        if (!self.props.active) {
          self.props.active = true;

          // show the "dim" (background)
          var dim = self.dim; 
          dim.style.display = "block";
          dim.style.transition = "opacity " + self.props.transitionTime + "s " + self.props.transitionCurve;
          
          var modal = self.container;

          if (desktopModal) {
            // fade in the modal if on desktop
            modal.style.opacity = 0;
            modal.style.transition = "opacity " + self.props.transitionTime + "s " + self.props.transitionCurve;
            requestAnimationFrame(function() {
              self.v.drawModal();
              modal.style.opacity = 1;
              dim.style.opacity = 0.5;   
              dim.style.filter = "alpha(opacity = 50)";
            });
          } else {  
            // else animate in using the "FLIP" technique
            modal.style.display = "block";
            modal.style.top = window.innerHeight + "px";
            var first = modal.getBoundingClientRect();
            self.v.drawModal();
            var last  = modal.getBoundingClientRect();

            if (self.props.beforeAnimation) {
              self.c.triggerEvent("beforeAnimation");
            }

            self.v.flipAnimateModal(first, last);
            dim.style.opacity = 0.5;
            dim.style.filter = "alpha(opacity = 50)";
          }
          self.v.disableScrolling();

          self.c.resetModal();

          if (self.props.beforeOpen) {
            self.c.triggerEvent("beforeOpen");
          }
          return true;
        } else { return false; }
      },
      hide: function() {
        // ensure modal is visible
        if (self.props.active) {
          // transition the "dim"s opacity down
          var dim = self.dim;
          dim.style.transition = "opacity " + self.props.transitionTime + "s " + self.props.transitionCurve;

          var modal = self.container;

          if (desktopModal) {
            // transition the modals opacity down if on desktop
            modal.style.transition = "opacity " + self.props.transitionTime + "s " + self.props.transitionCurve;
            requestAnimationFrame(function() {
              modal.style.opacity = 0;
              dim.style.opacity = 0;    
            });
          } else {
            // else animate the modal using the "FLIP" technique
            dim.style.opacity = 0;
            var first = modal.getBoundingClientRect();
            modal.style.top = window.innerHeight + "px";
            var last = modal.getBoundingClientRect();
            self.v.flipAnimateModal(first, last);
          }

          self.v.enableScrolling();
          
          self.c.resetModal();

          if (self.props.beforeClose) {
            self.c.triggerEvent("beforeClose");
          }

          self.props.active = false;

          return true;
        } else { return false; }
      },
      updateProperties: function(props) {
        props = props || {};
        // default properties
        var defaultProps = {
          title: null,  // title text of modal header
          footer: null, // footer content
          close: true,  // should the user be able to close the modal
          transitionTime: "0.35",
          transitionCurve: "cubic-bezier(0.4, 0.0, 0.2, 1)",
          width: null,  // optional: set the modals width in px (only available for desktop)
          beforeClose: true, // Should the beforeClose event fire
          afterClose: true,  // Should the afterClose event fire
          beforeOpen: true,  // Should the beforeOpen event fire
          afterOpen: true,   // Should the afterOpen event fire
          beforeAnimation: true,   // Should the beforeAnimation event fire
          top: null,     // private property 
          content: null, // private property 
          active: false  // private property
        };
        self.props = self.m.extendObjs(defaultProps, props);
      },
      // helper function to extend 2 (or more) objects
      extendObjs: function(obj, src) {
        for(var prop in src) {
          if(src.hasOwnProperty(prop)) {
              obj[prop] = src[prop];
          }
        }
        return obj;
      },
      insertDefaultModalContent: function() {
        var modal = self.container; // cache the modal object
        // create loading gif element
        var loadingWrapper = self.v.createElement("div", "loading-wrapper");
        var loadingGif = self.v.createElement("img");
        loadingGif.src = "/static/images/mobileapp/myaccount/loading.gif";
        loadingWrapper.appendChild(loadingGif);
        // append it to the modals content
        modal.querySelector(".modal-content").appendChild(loadingWrapper);      
      },
      insertCustomModalContent: function(content) {
        var modal = self.container; // cache the modal object
        modal.querySelector(".modal-content").innerHTML = content;

        if (self.props.active) {
          requestAnimationFrame(function() {
             var first = modal.getBoundingClientRect();
              self.v.drawModal();
              var last  = modal.getBoundingClientRect();

              if (self.props.beforeAnimation) {
                self.c.triggerEvent("beforeAnimation");
              }

              self.v.flipAnimateModal(first, last);
          });
        }
      },
      setTransitionEvent: function() {
        var t;
        var el = document.createElement('fakeelement');
        var transitions = {
          'transition':'transitionend',
          'OTransition':'oTransitionEnd',
          'MozTransition':'transitionend',
          'WebkitTransition':'webkitTransitionEnd'
        }

        for(t in transitions){
          if( el.style[t] !== undefined ){
            return transitions[t];
          }
        }
      },
      getContainer: function() {
        return self.container;
      }
    };
    // VIEW
    self.v = {
      scrollTop: 0,
      // helper function to create an element
      createElement: function(type, className, html, id) {
        var el = document.createElement(type);
        if (className !== undefined) {
          el.className = className;
        }
        if (id !== undefined) {
          el.id = id;
        }
        if (html !== undefined) { 
          el.innerHTML = html;
        }

        return el; //Return element
      },
      // creates/locates the "dim" element (modal background) in the DOM 
      createModalBackground: function() {
        var dim =  document.getElementById("modal-bg");
        if (dim === "undefined" || dim === null)
        {
          dim = self.v.createElement("div", "modal-bg disable-scrolling", "", "modal-bg");
          document.body.appendChild(dim);
        } 
        self.dim = dim; // store a reference to the dim object
      },
      // creates the modal header
      createHeader: function() {
        // ensure the modal header is required
        if ((self.props.close || ((self.props.title !== "") && (self.props.title !== null))) &&
            (self.container.querySelector(".modal-header") === null)) {
          // assemble the various parts of the header
          var modalHeader = this.createElement("div", "modal-header disable-scrolling");
          if (self.props.close) {
            var closeIcon;
            if (IE8) {
              closeIcon = "<img src='' height='14' width='14'></img>"
            } else {
              closeIcon = "<svg width='14' height='14' viewBox='0 0 14 14' xmlns='http://www.w3.org/2000/svg'><path d='M14 1.415L12.585 0 7 5.585 1.415 0 0 1.415 5.585 7 0 12.585 1.415 14 7 8.415 12.585 14 14 12.585 8.415 7 14 1.415z' fill='#333' fill-rule='evenodd'></path></svg>";
            }
            var close = this.createElement("div", "modal-close", closeIcon);
            modalHeader.appendChild(close);
          }
          if (self.props.title !== "") {
            var title = this.createElement("h2", "modal-title", self.props.title);
            modalHeader.appendChild(title);
          }
          // return generated header element
          return modalHeader;
        } else { return false; }
      },
      // create the modal footer
      createFooter: function() {
        // ensure the footer is required
        if ((self.props.footer !== "") && (self.props.footer !== null) &&
            (self.container.querySelector(".modal-footer") === null)) {
          // create the footer
          var modalFooter = this.createElement("div", "modal-footer disable-scrolling", self.props.footer);
          // return the generated element
          return modalFooter;
        } else { return false; }
      },
      // assembles the core modal element
      createModal: function () {
        var modal; // cache the modal object
        var opts = self.props; // cache the settings

        if (self.container === null) {
          // create the dim
          self.v.createModalBackground();
          // create the various required parts of the modal
          modal = self.v.createElement("div", "modal-container");
          self.container = modal;

          var modalHeader = self.v.createHeader();
          if (modalHeader) {
            modal.appendChild(modalHeader);
          }

          var modalContent = self.v.createElement("div", "modal-content");

          modal.appendChild(modalContent);

          var modalFooter = self.v.createFooter();
          if (modalFooter) {
            modal.appendChild(modalFooter);
          }
          // append the modal object to the DOM
          document.body.appendChild(modal);
          // insert content based off what user has defined
          if ((opts.content === null) || (opts.content === "undefined")) {
            self.m.insertDefaultModalContent();
          } else {
            self.m.insertCustomModalContent(opts.content);
          }
          self.c.addEvents();
        }
      },
      // calculates the modals height and width based off of it"s content
      drawModal: function() {
        var modal = self.container;
        var content = modal.querySelector(".modal-content");
        var header = modal.querySelector(".modal-header");
        var footer = modal.querySelector(".modal-footer");

        modal.style.display = "block";

        var offset = 0;
        if (header !== null) {
          offset += header.offsetHeight;
        }
        if (footer !== null) {
          offset += footer.offsetHeight;
        }

        if (desktopModal === true) {
          content.style.maxHeight = ((window.innerHeight - offset) / 2) + "px";
          if (self.props.width !== null) {
            modal.style.width = self.props.width + "px";
          } else {
            modal.style.maxWidth = (window.innerWidth / 1.5) + "px";
          }
        } else {
          modal.style.maxHeight = (window.innerHeight - 42) + "px";
          modal.style.width = (window.innerWidth) + "px";
          content.style.maxHeight = (window.innerHeight - 42 - offset) + "px";
        }

        self.v.layoutModal();
      },
      // calculates the modals position on screen based off of it"s content
      layoutModal: function() {
        var modal = self.container;

        if (desktopModal === true) {
          modal.style.top = ((window.innerHeight - modal.offsetHeight) / 2) + "px";
          modal.style.left = ((window.innerWidth - modal.offsetWidth) / 2) + "px";
        } else {
          modal.style.top = (window.innerHeight - modal.offsetHeight) + "px";
          modal.style.left = "0px";
        }
      },
      // animates the model based purely off the "transform" attr, which has the least performance impact
      flipAnimateModal: function(first, last) {
        var modal = self.container;
        var invert = first.top - last.top;

        modal.style.transform = "translateY("+invert+"px)";
        requestAnimationFrame(function() {
          modal.style.transition = "transform " + self.props.transitionTime + "s " + self.props.transitionCurve;
          modal.style.transform = "";
        });
      },
      disableScrolling: function() {
        var body = document.getElementsByTagName("body")[0];
        this.scrollTop = body.scrollTop;
        body.className += " activemodal";
        body.style.willChange = 'top';
        body.style.top = (-this.scrollTop + 'px');

        var modalContent = self.container.querySelector(".modal-content"),
            isTouchMoveAllowed = true, 
            totalScroll = modalContent.scrollHeight;

        document.ontouchmove = function ( event ) {
          isTouchMoveAllowed = true;
          var target = event.target;
          while ( target !== null ) {
            if ( target.classList && target.classList.contains( 'disable-scrolling' ) ) {
              isTouchMoveAllowed = false;
              break;
            }
            target = target.parentNode;
          }
          if ( !isTouchMoveAllowed ) {
              event.preventDefault();
          }
        };
        modalContent.addEventListener( "touchstart", function () {
          var top = modalContent.scrollTop, 
              currentScroll = top + modalContent.offsetHeight; 

          if ( top === 0 ) {
              modalContent.scrollTop = 1;
          } else if ( currentScroll === totalScroll ) {
              modalContent.scrollTop = top - 1;
          }
        });
      },
      enableScrolling: function() {
          var body = document.getElementsByTagName("body")[0];
          body.style.willChange = 'scroll-position top';
          body.className = body.className.replace(new RegExp("(^|\\b)activemodal(\\b|$)", "gi"), " "); 
          body.scrollTop = this.scrollTop;  
          body.style.top = '';
          body.style.willChange = '';
          document.ontouchmove = '';
      }
    };
    // CONTROLLER
    self.c = {
      xDown: null,
      yDown: null,
      addEvents: function () {
        var modal = self.container;
        if (self.props.close) {
          if (modal.querySelector(".modal-close")) {
            modal.querySelector(".modal-close").addEventListener("click", function() {
              self.m.hide();
            });
            document.querySelector("#modal-bg").addEventListener("click", function() {
              if (self.props.active) { self.m.hide(); }
            });
            if (modal.querySelector(".modal-header")) {
              modal.querySelector(".modal-header").addEventListener("touchstart", this.handleTouchStart, false);
              modal.querySelector(".modal-header").addEventListener("touchmove", this.handleTouchMove, false);
            }
          }
        }      
        window.addEventListener("resize",function() {
          if (self.props.active) { self.v.drawModal(); }
        },false);
        window.addEventListener("orientationchange",function() {
          if (self.props.active) { self.v.drawModal(); }
        },false);
    },
      handleTouchStart: function(evt) {
        this.xDown = evt.touches[0].clientX;
        this.yDown = evt.touches[0].clientY;
      },
      handleTouchMove: function(evt) {
          if ( ! this.xDown || ! this.yDown ) {
              return;
          }
          var xUp = evt.touches[0].clientX;
          var yUp = evt.touches[0].clientY;

          var xDiff = this.xDown - xUp;
          var yDiff = this.yDown - yUp;

          if ( Math.abs( yDiff ) > Math.abs( xDiff ) ) {
              if ( yDiff < 0 ) {
                if (yDiff < -10) {
                  self.m.hide(); // hide the modal on a "swipe-down" gesture (Doesn"t work with webview)
                }
              }
          }
          this.xDown = null;
          this.yDown = null;
      },
      // gets called after every transition
      resetModalTransitions: function() {
        self.container.style.transition = "";
        self.dim.style.transition = "";
      },
      // gets called only after end of show/hide transitions
      resetModal: function() {
        /* This is disgusting but we have to do it due to horrendous old browsers 
         * not supporting transition end, ideally we would use this - 
         * modal.addEventListener(self.props.transitionEndEvent, function() { ... });
         */
        setTimeout(function() {

          var modal = self.container;
          var active = self.props.active;
          var dim = self.dim;

          if (!active) {
            if (self.props.afterClose) {
              self.c.triggerEvent("afterClose");
            }
            dim.style.display = "none";
            modal.style.display = "none";
          } else {
            if (self.props.afterOpen) {
              self.c.triggerEvent("afterOpen");
            }
          }

          self.c.resetModalTransitions();

        }, (self.props.transitionTime * 1000));
      },
      triggerEvent: function(eventDesc) {
        var ev = new CustomEvent(eventDesc);
        self.container.dispatchEvent(ev);
      },
      onEvent: function(e, callback) {
        self.container.addEventListener(e, callback);
      }
    };

    this.m.init(settings);

    /**
      * Show the Modal.
      * @returns {boolean} whether function call was valid (i.e. will return false if modal is already shown)
      */
    this.show = function () { return self.m.show(); };

    /**
      * Hide the Modal.
      * @returns {boolean} whether function call was valid (i.e. will return false if modal is already hidden)
      */
    this.hide = function () { return self.m.hide(); };

    /**
      * Returns the Modal DOM element
      * @returns {HTMLElement}
      */
    this.getContainer = function() { return self.m.getContainer(); };

    /**
      * Update the content within the modal body
      * @param {string} content - the content to replace the current content in the modal body
      */
    this.updateContent = function(content) { return self.m.insertCustomModalContent(content); };
    
    /**
      * Attaches an event listener to this modal object 
      * @param {string} e - event name to listen for (one of 'beforeOpen', 'afterOpen', 'beforeClose', 'afterClose')
      * @param {function} callback - callback to run after event fires
      */ 
    this.on = function (e, callback) { return self.c.onEvent(e, callback); };
  }; // end of modal object

  if (window.shopdirect && shopdirect.event) {
    shopdirect.event.publish('modal/ready', {});
  }

}());
