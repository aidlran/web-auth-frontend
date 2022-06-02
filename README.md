This is a static website for logging in or creating an account.
It is intended to be paired with my [node-auth-api](https://github.com/Defunk-t/node-auth-api) module.

This site requires a static file server to work properly for a few reasons:

- It uses `type="module"` JavaScript.
- The links don't include full file extensions (`href="login"` instead of `href="login.html"`)

The forms attempt to POST data to the same URL, so make sure that these static files and the POST handler are routed to the same URL. For example:

`GET /auth/login` serves `login.html`  
`POST /auth/login` handles form data.
