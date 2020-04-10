/*!
* express-flash-notification
* Copyright(c) 2015-2017 Carlos Ascari Gutierrez Hermosillo
* MIT License
*/

const { format, isArray } = require('util');
const async = require('async');

/**
* Default value used when calling the `req.flash` method withouth specifying 
* the redirect argument.
* @property REDIRECT
* @type {Boolean|String}
* @final
*/
const REDIRECT = true;

/**
* Default middleware options
* @type {Object}
* @private
*/
const DEFAULT_OPTIONS = {
  sessionName: 'flash',
  utilityName: 'flash',
  localsName: 'flash',
  viewName: 'flash',
  beforeSingleRender: function(item, callback) {
    callback(null, item);
  },
  afterAllRender: function(htmlFragments, callback) {
    callback(null, htmlFragments.join('\n'));
  },
};

/**
* Utility used to check whether an argument is a Native Object
* @return {Boolean}
* @private
*/
const isObject = (sample) => sample && typeof sample === 'object' && !isArray(sample);

/**
* Function used to expose express instance and configuration options. 
* The actual middleware is returned.
* @param {Express} app
* @param {Object} options
*/
function Module (app, options=DEFAULT_OPTIONS) {
  const sessionName        = options.sessionName        || options.session_name        || DEFAULT_OPTIONS.sessionName;
  const utilityName        = options.utilityName        || options.utility_name        || DEFAULT_OPTIONS.utilityName;
  const localsName         = options.localsName         || options.locals_name         || DEFAULT_OPTIONS.localsName;
  const viewName           = options.viewName           || options.view_name           || DEFAULT_OPTIONS.viewName;
  const beforeSingleRender = options.beforeSingleRender || options.beforeSingleRender  || DEFAULT_OPTIONS.beforeSingleRender;
  const afterAllRender     = options.afterAllRender     || options.afterAllRender      || DEFAULT_OPTIONS.afterAllRender;

  /**
  * Render notifications in queue.
  * @private
  */
  function render(req, res, next)  {
    if (!req.session[sessionName].length) {
      next();
    } else {
      const resultHTML = [];
      async.each(
        req.session[sessionName],
        function(item, next) {
          beforeSingleRender(item, function(error, item) {
            if (error) return next(error);
            app.render(viewName, item, function(error, html) {
              if (error) return next(error);
              resultHTML.push(html);
              next(null);
            })
          })
        },
        function(error) {
          if (error) return next(error);
          req.session[sessionName].length = 0;
          afterAllRender(resultHTML, function(error, html) {
            if (error) return next(error);
            res.locals[localsName] = html;
            next();
          })
        }
      )
    }
  }

  /**
  * Adds flash method to req object and renders all notifications found in
  * req.session
  * @param {ReadStream} req
  * @param {WriteStream} res
  * @param {Function} next
  */
  function FlashMiddleware(req, res, next) {
    if (!isObject(req.session)) throw new Error('express-session is required. (npm i express-session)');
    if (!req.session[sessionName] || !isArray(req.session[sessionName])) req.session[sessionName] = [];

    /**
    * Utility used to programmatically add flash notifications
    * @method Flash Utility
    */
    req[utilityName] = function() {
      const argc = arguments.length;
      let notification;
      let redirect = REDIRECT;

      // Parse arguments
      if (argc) {
        if (argc === 1) {
          const arg = arguments[0];
          if (isObject(arg)) {
            notification = arg;
            redirect = (arg.redirect === undefined) ? redirect : arg.redirect;
          } else {
            notification = {
              message: '' + arg
            };
          }
        } else {
          notification = {
            type: '' + arguments[0],
            message: '' + arguments[1]
          };
          redirect = (arguments[2] === undefined) ? redirect : arguments[2];
        }
      }

      // Queue Notification
      if (notification && req.session[sessionName]) {
        req.session[sessionName].push(notification);
      }

      // If redirect is set, refresh or redirect, accordingly. Otherwise, render the
      // notifications now since it's on this request where they will be displayed.
      if (redirect) {
        const redirectUrl = (typeof redirect === 'string') ? redirect : req.originalUrl;
        res.redirect(redirectUrl);
      } else {
        /**
        * When there is no redirect, notifications must be rendered now and since
        * rendering is async (and this method is sync), a *promise* like function is returned.
        * The function can be called with a callback that will be called after all notifcations
        * are rendered, otherwise, rendering will be done during the next request.
        */
        return function ManualRender(callback) {
          render(req, res, callback);
        }
      }
    }

    /**
    * Process Queued Notifications
    */
    render(req, res, next);
  } 

  return FlashMiddleware;
}

module.exports = Module;