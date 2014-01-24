/*
 * JQuery progressButton
 * Author: @stefanocurtoni
 * 
 * init progress bar:
 * var progressBtn = $('.progress-button').progressButton();  
 * 
 * set and start progress to val
 * progressBtn.progressButton("progressSet", val);
 * 
 * finish progress:
 * progressBtn.progressButton("progressFinish", 2);
 */
/*!
 * jQuery UI Widget-factory plugin boilerplate (for 1.8/9+)
 * Author: @addyosmani
 * Further changes: @peolanha
 * Licensed under the MIT license
 */

/*based on :
 * http://tutorialzine.com/2013/10/buttons-built-in-progress-meters/
 */


;(function ( $, window, document, undefined ) {

    // define your widget under a namespace of your choice
    //  with additional parameters e.g. 
    // $.widget( "namespace.widgetname", (optional) - an 
    // existing widget prototype to inherit from, an object 
    // literal to become the widget's prototype ); 

    $.widget( "om.progressButton", {

        //Options to be used as defaults
        options: {
            someValue: null
        },

        //Setup widget (eg. element creation, apply theming
        // , bind events etc.)
        _create: function () {

          // This function creates the necessary markup for the progress meter
          // and sets up a few event listeners.

          // Loop through all the buttons:

              var $button =  this.element,
                  progress = 0;

              // Extract the data attributes into the options object.
              // If they are missing, they will receive default values.

              var options = $.extend({
                  type:'background-horizontal',
                  loading: 'Loading..',
                  finished: 'Done!'
              }, $button.data());

              // Add the data attributes if they are missing from the element.
              // They are used by our CSS code to show the messages
              $button.attr({'data-loading': options.loading, 'data-finished': options.finished});

              // Add the needed markup for the progress bar to the button
              
              
              var bar = $("<span class='tz-bar " + options.type + "'>").appendTo($button);


              // The progress event tells the button to update the progress bar
              $button.on('progress', function(e, val, absolute, finish){

                  if(!$button.hasClass('in-progress')){

                      // This is the first progress event for the button (or the
                      // first after it has finished in a previous run). Re-initialize
                      // the progress and remove some classes that may be left.

                      bar.show();
                      progress = 0;
                      $button.removeClass('finished').addClass('in-progress')
                  }

                  // val, absolute and finish are event data passed by the progressIncrement
                  // and progressSet methods that you can see near the end of this file.

                  if(absolute){
                      progress = val;
                  }
                  else{
                      progress += val;
                  }
                  
                  if(progress >= 100){
                      progress = 100;
                  }

                  if(finish){
                    
                    setTimeout(function(){

                        $button.removeClass('in-progress').addClass('finished');
                          
                        // Trigger the custom progress-finish event
                          $button.trigger('progress-finish');
                          bar.fadeOut(function(){
                            setProgress(0);                              
                          });
                          setTimeout(function(){                          
                            $button.removeClass("finished");
                          },2000); 
                      }, 500);

                  }

                  setProgress(progress);
              });

              function setProgress(percentage){
                
                console.log("val: " + percentage)
                
                  bar.filter('.background-horizontal,.background-bar').width(percentage+'%');
                  bar.filter('.background-vertical').height(percentage+'%');
              }

//          });
        },

        // Destroy an instantiated plugin and clean up 
        // modifications the widget has made to the DOM
        destroy: function () {

            // this.element.removeStuff();
            // For UI 1.8, destroy must be invoked from the 
            // base widget
            $.Widget.prototype.destroy.call(this);
            // For UI 1.9, define _destroy instead and don't 
            // worry about 
            // calling the base widget
        },

        methodB: function ( event ) {
            //_trigger dispatches callbacks the plugin user 
            // can subscribe to
            // signature: _trigger( "callbackName" , [eventObject], 
            // [uiObject] )
            // eg. this._trigger( "hover", e /*where e.type == 
            // "mouseenter"*/, { hovered: $(e.target)});
            this._trigger('methodA', event, {
                key: value
            });
        },

        methodA: function ( event ) {
            this._trigger('dataChanged', event, {
                key: value
            });
        },
        
        
        
        // progressStart simulates activity on the progress meter. Call it first,
        // if the progress is going to take a long time to finish.

        progressStart: function(){

            var $button = this.element,
                last_progress = new Date().getTime();

            if($button.hasClass('in-progress')){
                // Don't start it a second time!
                return this;
            }

            $button.on('progress', function(){
                last_progress = new Date().getTime();
            });

            // Every half a second check whether the progress
            // has been incremented in the last two seconds

            var interval = window.setInterval(function(){

                if( new Date().getTime() > 2000+last_progress){

                    // There has been no activity for two seconds. Increment the progress
                    // bar a little bit to show that something is happening

                    this.progressIncrement(5);
                }

            }, 500);

            $button.on('progress-finish',function(){
                window.clearInterval(interval);
            });

            return this.progressIncrement(10);
        },

        progressFinish: function(){
          return this.progressSet(100);
        },

        progressIncrement: function(val){

            val = val || 10;

            var $button = this.element;;

            $button.trigger('progress',[val])

            return this;
        },

        progressSet: function(val){
          
            var val = val || 10;

            var finish = val >= 100;

            return this.element.trigger('progress',[val, true, finish]);
        },

        // This function creates a progress meter that
        // finishes in a specified amount of time.

        progressTimed: function(seconds, cb){

            var $button = this.element;
            var bar = $button.find('.tz-bar');

            if($button.is('.in-progress')){
                return this;
            }

            // Set a transition declaration for the duration of the meter.
            // CSS will do the job of animating the progress bar for us.

            bar.css('transition', seconds+'s linear');
            $button.progressSet(99);

            window.setTimeout(function(){
                bar.css('transition','');
                $button.progressFinish();

                if($.isFunction(cb)){
                    cb();
                }

            }, seconds*1000);
        },
        

        // Respond to any changes the user makes to the 
        // option method
        _setOption: function ( key, value ) {
            switch (key) {
            case "someValue":
                //this.options.someValue = doSomethingWith( value );
                break;
            default:
                //this.options[ key ] = value;
                break;
            }

            // For UI 1.8, _setOption must be manually invoked 
            // from the base widget
            $.Widget.prototype._setOption.apply( this, arguments );
            // For UI 1.9 the _super method can be used instead
            // this._super( "_setOption", key, value );
        }
    });

})( jQuery, window, document );