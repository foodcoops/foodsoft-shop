Foodsoft Webshop
================

This is an EXPERIMENTAL webshop component for [Foodsoft](https://github.com/foodcoops/foodsoft).

Based on [React](http://facebook.github.io/react/) and [redux-saga](http://redux-saga.js.org/),
it may replace the existing [rails](http://www.rubyonrails.org/)-based webshop component at some point.

It functions together with Foodsoft's future API from
[this branch](https://github.com/wvengen/foodsoft/tree/feature/rest-for-shop), which is waiting for
this webshop to be completed.


The hope is that this brings [foodcoop-adam/foodsoft#163](https://github.com/foodcoop-adam/foodsoft/issues/163)'s
_Revamped member ordering pages_ to the main Foodsoft repository in a clean way.


![screenshot](screenshot.png)


## Getting started

Though this software is not fully finished, you could try running it if you're interested.

1. Install the [API-fork](https://github.com/wvengen/foodsoft/tree/feature/rest-for-shop) of Foodsoft for development.
   For full instructions, see [the instructions](https://github.com/wvengen/foodsoft/blob/feature/rest-for-shop/doc/SETUP_DEVELOPMENT.md),
   but if you already have MySQL and Ruby on Rails running, this may be enough:

   ```sh
   $ git clone https://github.com/wvengen/foodsoft -b feature/rest-for-shop
   $ cd foodsoft
   $ bundle install
   $ rake foodsoft:setup-development
   $ bundle exec rails s
   ```

   In case you have an existing Foodsoft installation, the following would be more suitable:

   ```sh
   $ git remote add wvengen https://github.com/wvengen/foodsoft.git
   $ git fetch wvengen
   $ git checkout feature/rest-for-shop
   $ bundle install
   $ rake db:migrate
   $ bundle exec rails s
   ```

2. Obtain an application secret.

  * Log into Foodsoft as an admin
  * Go to _Administration_ &gt; _Configuration_ &gt; _Apps_ (right of screen)
  * Press the button _New Application_
  * Fill in any name, and put `http://localhost:8080/` in _Redirect URI_, then _Submit_.
  * Click the application name, and take note of the _Application Id_, this is the OAuth client id.

2. Install this app. You'll need [node.js](https://nodejs.org/), since this is a Javascript application,
   and [yarn](https://yarnpkg.com/) for installing dependencies:

   ```sh
   $ git clone https://github.com/foodcoops/foodsoft-shop.git
   $ cd foodsoft-shop
   $ yarn install
   ```

3. Create the file `local.js` in the foodsoft-shop directory with contents:

   ```javascript
   window.foodsoftClientId = '1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef';
   ```

   Replace `12345...` with the OAuth client id you obtained before. And if you happen to run Foodsoft
   on a different port or url, you can set `window.foodsoftUrl` to the url (incl. foodcoop scope).

4. Start the app

   ```sh
   $ yarn start
   ```

   and open [http://localhost:8080/](http://localhost:8080/)


## Notes

* To change the language, modify it in `index.html`'s `<html lang="en">` tag ([webpack plugin](https://github.com/chrome/webpack-rails-i18n-js-plugin)).
* If you want to skip the (initial) OAuth dance, you can set `window.foodsoftAccessToken` directly.


## License

GPL version 3 or later, please see [LICENSE](LICENSE.md) for the full text.

Thanks to [Icons8](http://icons8.com/) for letting us use their icons.
