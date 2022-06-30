# web-auth-frontend

This static website is a web authentication frontend that allows a user to log in or create an account.
It works with or without JavaScript enabled, but of course the best user experience is had with JS.
I use it on my server and as a starting point or reference in other projects.

## Installation

There's a few ways to go about it. If you're just using this as a starting point, you can simply download the project and copy the contents of `src` to your website's public/static folder.

On the other hand, I'm using this as yet another "module" on my server and want to be able to pull in updates. The server uses Node.js, so what I've done is add this as a module in the `package.json`, then symlinked the `src` directory instead:

```sh
npm i aidlran/web-auth-frontend#main
cd public
ln -s ../node_modules/web-auth-frontend/src auth
```

A similar thing could probably be done with other package managers that support GitHub repos, or with Git submodules.

## Usage

This site requires a static file server to work properly for a few reasons:

- It uses `type="module"` JavaScript, so you'll run into CORS problems if you try to load the pages locally with `file://`. (see: [MDN](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Modules))

- The links on the page don't include full file extensions (i.e. `href="login"` instead of `href="login.html"`), so you'll also need to configure your server to automatically check for a file with a `.html` extension.

### Handling POST requests

You'll need to pair this frontend with a backend to receive and handle the form data.

The forms will attempt to POST the data to the same URL, so make sure you set up the POST handler on the right route. There's a `login` and a `create` URL.

Your handler should expect simple urlencoded data in the request body with the following self-explanatory fields:

|   Key  |   Login  |  Create  |
|:------:|:--------:|:--------:|
| `user` | &#10004; | &#10004; |
| `pass` | &#10004; | &#10004; |
| `confirm-pass` |  | &#10004; |

#### Response

The form works with or without JavaScript, so the following should be applied for the most compatible experience.

- A `Refresh` header should be included to redirect non-JS users back to the form in the event of an error - e.g. `Refresh: 2; url=back`. This will simply be ignored if JS is enabled.

- The response body can contain text (an error message or otherwise) to show to the user. Combined with the `Refresh` header, this allows for messages to be flashed rather un-elegantly for any non-JS users. With JS, the message is shown more elegantly on the form.

- The HTTP response code is used to control the client behaviour:
  - `200`: Success. With JS, message appears in normal colour.
  - `303`: Redirect. Use this on success and make sure to include a location header. JS will follow it.
  - `400`: User error, e.g. failed input validation. With JS, message appears in error colour.
  - `403`: Forbidden, e.g. wrong password. With JS, message appears in error colour.
  - `404`: Not found. As in, you haven't implemented a response yet. With JS, the error message "Not yet implemented" will show.
  - `500`: Server error, e.g. database offline. With JS, message appears in error colour.
  - **other**: With JS, an error is thrown and a generic error message is shown to the user.
