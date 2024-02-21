# DUNAuthorizer
Bulk de-authorize Discord apps from your account.

## Y?
Discords application management interface is not very good to say the least. It's a pain to de-authorize a lot of apps at once. This tool aims to make that process easier.

## How?
Very simple! Just run `npx dunauthorizer` and follow the instructions.

## I ain't giving you my token!
This is unfortunately a necessary evil. The token is used to authenticate with Discord's API. The token is not stored anywhere, and is only used to make requests to Discord's API. If you're still not comfortable with this, you can always inspect the source code and/or compile the tool yourself.

### Alright, but how do I get my token?
1. Open Discord in your browser.
2. Press `F12` to open the developer console.
3. Go to the `Console` tab.
4. Paste `(webpackChunkdiscord_app.push([[''],{},e=>{m=[];for(let c in e.c)m.push(e.c[c])}]),m).find(m=>m?.exports?.default?.getToken!==void 0).exports.default.getToken()` and press `Enter`.
5. Copy the token that is printed to the console.
> **Note:** Do not share your token with anyone! It can be used to access your account.

> **Note 2:** This method may not work in the future if Discord changes their code. Please google how to get your token if this method doesn't work.