var _ = require("lodash");
var request = require("request");

var ERROR_MSG = "へんじがないただのしかばねのようだ";

var misawa = function(bot, message, keyword) {
  request.get("http://horesase.github.io/horesase-boys/meigens.json", function(
    error,
    response,
    body
  ) {
    if (!error && response.statusCode == 200) {
      var phrases = JSON.parse(body);

      bot.reply(message, _.sample(phrases).image);
    } else {
      bot.reply(message, ERROR_MSG);
    }
  });
};

module.exports = function(controller) {
  controller.hears(
    ["!misawa( +(.*))?"],
    ["direct_message", "ambient"],
    function(bot, message) {
      var matches = message.text.match(/!misawa( +(.*))?/i);
      var keyword = matches[2];

      misawa(bot, message, keyword);
    }
  );
};
