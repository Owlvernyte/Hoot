<br/>
<p align="center">
  <a href="https://github.com/Owlvernyte/Hoot">
    <img src="public/assets/Hoot_with_Bard.jpg" alt="Logo" width="80" height="80">
  </a>

  <h1 align="center">Hoot</h1>

  <p align="center">
    A Functional Discord Music Bot
    <br/>
    <br/>
    <a href="https://discord.com/oauth2/authorize?client_id=804616628359921684">Invite Hoot to your Discord Server</a>
    <br/>
    <a href="https://github.com/Owlvernyte/Hoot/issues">Report Bug</a>
    .
    <a href="https://github.com/Owlvernyte/Hoot/issues">Request Feature</a>
  </p>
</p>


<div style="text-align: center;">

![Contributors](https://img.shields.io/github/contributors/Owlvernyte/Hoot?color=dark-green) ![Forks](https://img.shields.io/github/forks/Owlvernyte/Hoot?style=social) ![Stargazers](https://img.shields.io/github/stars/Owlvernyte/Hoot?style=social) ![Issues](https://img.shields.io/github/issues/Owlvernyte/Hoot) ![License](https://img.shields.io/github/license/Owlvernyte/Hoot)[![Deploy](https://github.com/Owlvernyte/Hoot/actions/workflows/deploy.yml/badge.svg)](https://github.com/Owlvernyte/Hoot/actions/workflows/deploy.yml)[![CI](https://github.com/Owlvernyte/Hoot/actions/workflows/ci.yml/badge.svg)](https://github.com/Owlvernyte/Hoot/actions/workflows/ci.yml)

</div>

## How to use it?

### Prerequisite

```sh
npm install
```

### Define `.env`
Specify a secret file `src/.env` (support `src/.env.*`)

```
# Application node mode (put 'production' to make the bot goes production mode)
NODE_ENV=
# Your Discord Application Bot Token
DISCORD_TOKEN=abcAbc123
# Discord User ID(s) of owner(s) (separate by a comma)
OWNERS=0000000000000,111111111111111
# Your Discord Development Guild Id for development purpose
DEV_GUILD_ID=8888888888888888888
# Support Discord Server ID
SUPPORT_SERVER_ID=
```

### Development

This example can be run with `tsc-watch` to watch the files and automatically restart your bot.

```sh
npm run watch:start
```

### Production

You can also run the bot with `npm dev`, this will first build your code and then run `node ./dist/index.js`. But this is not the recommended way to run a bot in production.

## Acknowledgements

* [Sapphire]
* [Terms of Service][terms]
* [Privacy Policy][privacy]
* [License]
* [Discord Server][discord]

[sapphire]: https://github.com/sapphiredev/framework
[license]: https://github.com/Owlvernyte/Hoot/blob/master/LICENSE.md
[privacy]: https://github.com/Owlvernyte/Hoot/blob/master/PRIVACY_POLICY.md
[terms]: https://github.com/Owlvernyte/Hoot/blob/master/TERMS_OF_SERVICE.md
[discord]: https://discord.gg/F7ZK6ssMUm
[issues]: https://github.com/Owlvernyte/Hoot/issues
