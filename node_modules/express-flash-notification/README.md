# [express-flash-notification]()

This module provides a way to set one-time notifications to be displayed during or after processing a request. 
Notifications are stored in session and are removed once they have been rendered.

**Key Points**

- **Template engine agnostic**, works with any engine you are using (logic/logicless).
- Supports for **multiple notifications** to be sent.
- **Auto refreshes or redirects** the page to display the notification.
- Allows you to manipulate the notification output **before and after** it has been created.
  This allows you to control the presentation of all notifications with custom html/js.
- **No need to refresh or redirect**, notifications can be rendered on the same request.

If you want to see it in action: [express-flash-notification-example](https://github.com/carlosascari/express-flash-notification-example)

### Why?

I realized [connect-flash](https://github.com/jaredhanson/connect-flash) required a template engine with conditional logic to test wether or not to show content. 
Implementation felt akward when applying this middleware to a logic-less tempalte engine like Mustache. 
So I wrote a flash notification that can be used in any template engine.

## Install
```
npm i express-flash-notification --save
```
## Usage

Flash notifications are stored in a `session`. 
You will need the `cookieParser` middleware and the `session` middleware installed. 
Depending on your express version it may be bundled in express or for newer releases you will have to `npm install` them as seperate modules. 
 - Using express 4.x in the following examples.
 - Using Mustache template engine in the following examples.

You must pass the express application instance as the first argument in  the `flash()` middleware so the middleware can take advantage of the `app.render` method in order to create your notification using your own template engine and `views` directory.

```javascript
const flash = require('express-flash-notification');
const cookieParser = require('cookie-parser');
const session = require('express-session');

const app = express();

// setup views directory, view engine, etc...

app.use(cookieParser());
app.use(session({...}}));
app.use(flash(app));
```

##### In your Layout

Wherever you place the local variable `flash`, it will be populated with the notifications if there are any. Make sure it does not escape, as the output *may* be HTML.

```html5
<!DOCTYPE html>
<html>
<head>
  <title></title>
</head>
<body>
  {{{flash}}}
</body>
</html>
```

**NOTICE**: If you are using the `ejs` template engine, please keep in mind that variables are stored in a locals objects. 
So in the above template you would use: `<%- locals.flash %>` for unescaped html and `<%= locals.message %>` for escaped html.

##### In your Views

**By default, a view named `flash` in your `views` directory will be retrieved and used as the default template for your notifications.**

The local variables `type` and `message` will be set, depending on the type and message passed when calling **req.render**

*flash.html*

```html
<div class="alert flash">
  <button type="button" class="close">×</button>
  <i class="fa sign"></i><strong>{{type}}</strong> 
  <span>{{message}}</span>
</div>
```

### req.flash API

There are several ways to trigger a flash notification:

**Note** A `notification` is a *Object* with properties that become local view variables when rendering, using the express rendering engine of your choice.

- **req.flash**(*String* message)
  Sets local variable `message` to the string provided.
  Sets local variable `type` to a empty string. 
  Will refresh the current page.

- **req.flash**(*String* type, *String* message)
  First string is the `type` local variable, the second is the `message` local variable. 
  Will refresh the current page.

- **req.flash**(*String* type, *String* message, *String* redirectUrl)
  Last argument as a *String* defines which page to redirect to.

- **req.flash**(*String* type, *String* message, *Boolean* renderInThisRequest)
  Third argument as a *Boolean* determines whether or not to refresh the page.
  **NOTE** If set to `false`, notifications will not be rendered until the next request.
  If you still want the notification to be rendered on the current request, you can use a function that is returned by `req.flash`
  Call the function with a callback, the callback will be executed once rendering is complete.
  **example**
  ```
  app.all(function SampleExpressRoute(req, res) {
    const manualRender = req.flash('warn', 'tell them now!', false);
    manualRender(function(error) {
      if (error) throw error
      res.render('layouts/internal');
    })
  })
  ```

- **req.flash**(*Object* notification)
  You can pass an object as the first argument, the object's properties will be exposed as local variables when rendering the notification template.
  The property `redirect` is reserved and functions just as you'd expect; a *Boolean* determines if it will refresh, or as a *String* you specify where to redirect to.
  ```javascript
  req.flash('info', 'if cats ruled the world', false)
  ``` 
  is treated exactly the same as:
  ```javascript
  req.flash({
    type: 'info',
    message: 'if cats rules the world',
    redirect: false
  })
  ```

### Usage Example

With the `flash` middleware in place, all requests will have a `req.flash()` method to send out flash notifications.

```javascript
app.use('/login', function loginProcessor(req, res, next) {
  if (req.method !== 'POST') return next();
  if (!req.body) return next(new Error('no data was sent to the server, please try again'));
  
  const user = req.body.user;
  const pass = req.body.pass;

  if (user && pass) {
    if (user === 'root' && pass === 'toor') {
      res.redirect('/dashboard');
    } else {
      req.flash('info', 'invalid username or password');
    }
  } else {
    req.flash('info', 'you must enter your username and password to login');
  }
});

app.use('/login', function loginErrorHandler(error, req, res, next) {
  if (error.message) {
    req.flash('error', error.message);
  } else {
    console.log('there was a nasty login error: %s', error.stack);
    next();
  }
});

app.get('/login', function loginRenderer(req, res, next) {
  res.render('external', {
    partials: {
      content: 'external/login'
    }
  });
});
```

###### Pitfalls 

By default, **req.flash** will redirect to the current url, effectively refreshing the page so to display the flash notification. 
It is important that your logic uses `return` when using flash or some form of conditioning so you don't get the *headers have already been sent* error. 

For example below, if 2 + 2 ever equals 'fish' the `req.flash` method will send out the redirect headers, and execution will continue until the `next` function is called, the `next` call will also try to set the response headers.

```javascript
app.use('/get-busy', function(req, res, next) {
  if (2 + 2 === 'fish') {
    req.flash('error', 'fairies!');
  }
  
  // ... other logics go here
  next();
})
```

Keeping in mind the case above, and in case you want to send multiple notifications you can disable the redirect by setting the third parameter to `false`.

```javascript
app.use('/get-busy', function(req, res, next) {
  if (2 + 2 === 'fish') {
    return req.flash('error', 'fairies!', '/impossible');
  }
  
  // ... other logics go here

  // headers are not set, so calling next is safe
  req.flash('success', 'logics are done', false); 

  next();
})
```

----------------

## Advance Configuration

When setting the flash middleware, the second parameter accepts an object for configuration.
Below is an example with all the options set to their defaults.

```javascript
app.use(flash(app, {
  sessionName: 'flash',
  utilityName: 'flash',
  localsName: 'flash',
  viewName: 'flash',
  beforeSingleRender: function(item, callback){ callback(null, item) },
  afterAllRender: function(htmlFragments, callback){ callback(null, htmlFragments.join('\n')) }
}));
```

- **sessionName** Is the key used to store the notifications in session: `req.session[sessionName]`

- **utilityName** Is the name of the function that is exposed in the `req` object, the one used to add new notifications: `req[utilityName]('info', 'hello')`

- **localsName** Is the `locals` variable name where all your notifications will be placed, make sure it does not escape HTML: `{{{localsName}}}`

- **viewName** Is the name of the view that will be used as the template for all notifications: `app/views/viewName.html`

- **beforeSingleRender** Is called right before each notification is rendered, allowing you to add/remove or modify the local variables passed to the renderer.
The first argument is an object with all the locals variables set, typically you will find `item.type` and `item.message` here. The second argument is a callback that must be called with `null` or an `Error` for the first parameter, and an object with the locals used to render on the second parameter.

- **afterAllRender** Is called after all notifications have been compiled. Allowing you to append anything like extra HTML to the output.
The first argument, is an array with each rendered notification. The second argument is a callback that must be called with `null` or an `Error` for the first parameter, and the resulting notifications output **not as an Array but as a String** (Array.join)

-----------------

## Advance Usage

Heres an example where custom notifications will be rendered, `beforeSingleRender` is used to add class names depending on the `type` of notification so the resulting notification looks different depending on its type. Also, `afterAllRender` will be used to append some javascript so notification don't just appear, they slide into view.

**NOTE** `{{{flash}}}` is placed in my layout, not shown here

This is my `flash.html` view template.
`alert_class` and `icon_class` will be populated inside of `beforeSingleRender`
`style="display: none"` is set so the appended javascript uses jQuery's `slideDown` method to animate its presentation

```html
<div class="alert flash {{alert_class}}" style="display:none">
  <button type="button" class="close">×</button>
  <i class="fa {{icon_class}} sign"></i><strong>{{type}}</strong> 
  <span>{{{message}}}</span>
</div>
```

This is the setup

```javascript

app.use(require('express-flash-notification')(app, {
  viewName:    'elements/flash',
  beforeSingleRender: function(notification, callback) {
    if (notification.type) {
      switch(notification.type) {
        case 'error':
          notification.alert_class = 'alert-danger'
          notification.icon_class = 'fa-times-circle'
        break;
        case 'alert':
          notification.alert_class = 'alert-warning'
          notification.icon_class = 'fa-times-circle'
        break;
        case 'info':
          notification.alert_class = 'alert-info'
          notification.icon_class = 'fa-times-circle'
        break;
        case 'success':
          notification.alert_class = 'alert-success'
          notification.icon_class = 'fa-check'
        break;
        case 'ok':
          notification.alert_class = 'alert-primary'
          notification.icon_class = 'fa-check'
        break;
      }
    }
    callback(null, notification)
  },
  afterAllRender: function(htmlFragments, callback) {
    // Naive JS is appened, waits a while expecting for the DOM to finish loading,
    // The timeout can be removed if jOuery is loaded before this is called, or if you're using vanilla js.
    htmlFragments.push([
      '<script type="text/javascript">',
      ' var timer = setInterval(function(){',
      '      if (window.jOuery){',
      '            clearInterval(timer)',
      '            $(".alert.flash").slideDown().find(".close").on("click", function(){$(this).parent().slideUp()})',
      '      }',
      ' }, 200)',
      '</script>',
    ].join(''))
    callback(null, htmlFragments.join(''))
  },
}))
```

**And this is how you'd use it**

```javascript
app.use('/bleh/:ok', function(req, res, next) {
  if (req.params.ok) {
    req.flash('ok', 'Everything is A-O-K');
  } else {
    req.flash('warn', 'Quick! everybody panic!');
  }
});
```

## License

[The MIT License](http://opensource.org/licenses/MIT)