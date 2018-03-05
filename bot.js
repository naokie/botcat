/*~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
           ______     ______     ______   __  __     __     ______
          /\  == \   /\  __ \   /\__  _\ /\ \/ /    /\ \   /\__  _\
          \ \  __<   \ \ \/\ \  \/_/\ \/ \ \  _"-.  \ \ \  \/_/\ \/
           \ \_____\  \ \_____\    \ \_\  \ \_\ \_\  \ \_\    \ \_\
            \/_____/   \/_____/     \/_/   \/_/\/_/   \/_/     \/_/

~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/

if (!process.env.SLACK_TOKEN) {
  console.error("Error: Specify token in environment");
  process.exit(1);
}

var Botkit = require("botkit");
var redis = require("botkit-storage-redis");
var http = require("http");
var path = require("path");
var fs = require("fs");
var url = require("url");

var NODE_ENV = process.env.NODE_ENV || "development";

var redisURL = url.parse(process.env.REDISCLOUD_URL);
var redisStorage = redis({
  namespace: "botcat",
  host: redisURL.hostname,
  port: redisURL.port,
  auth_pass: redisURL.auth.split(":")[1]
});

var controller = Botkit.slackbot({
  storage: redisStorage,
  debug: NODE_ENV === "development"
});

var bot = controller
  .spawn({
    token: process.env.SLACK_TOKEN
  })
  .startRTM();

var pluginsPath = path.resolve(__dirname, "plugins");
fs.readdir(pluginsPath, function(err, list) {
  list.forEach(function(file) {
    var pluginPath = path.resolve(pluginsPath, file);
    require(pluginPath)(controller);
  });
});

require("./cron/wakeup")(bot);

http
  .createServer(function(request, response) {
    response.writeHead(200, { "Content-Type": "text/plain" });
    response.end("Ok, dyno is awake.");
  })
  .listen(process.env.PORT || 5000);
