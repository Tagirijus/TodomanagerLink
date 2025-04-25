# Todomanager Link

With this plugin I will have a link to my _todomanager_ API (private project). So basically this repository is just for convenience for myself and nobody else might be able to use it (yet), really. Sorry.

I keep this README as well, since below I have a cheat sheet on how to build the plugin.

## Build
To build this plug, make sure you have [SilverBullet installed with Deno](https://silverbullet.md/Install/Deno). Then, build the plug with:

```shell
deno task build
```

Or to watch for changes and rebuild automatically

```shell
deno task watch
```

Then, copy the resulting `.plug.js` file into your space's `_plug` folder. Or build and copy in one command:

```shell
deno task build && cp *.plug.js /my/space/_plug/
```

SilverBullet will automatically sync and load the new version of the plug, just watch the logs (browser and server) to see when this happens.

## Installation
If you would like to install this plug straight from Github, make sure you have the `.js` file committed to the repo and simply add

```
- github:Tagirijus/TodomanagerLink/todomanagerlink.plug.js
```

to your `PLUGS` file, run `Plugs: Update` command and off you go!
