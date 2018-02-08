var _ = require("lodash");
var request = require("request");

var uuid = function() {
  var uuid = "",
    i,
    random;

  for (i = 0; i < 32; i++) {
    random = (Math.random() * 16) | 0;

    if (i == 8 || i == 12 || i == 16 || i == 20) {
      uuid += "-";
    }
    uuid += (i == 12 ? 4 : i == 16 ? (random & 3) | 8 : random).toString(16);
  }

  return uuid;
};

module.exports = function(controller) {
  controller.hears(
    ["^neko push (http(s)?://.+)?"],
    ["direct_message", "ambient"],
    function(bot, message) {
      var matches = message.text.match(
        /(http(s)?:\/\/.+\/.+(jpg|jpeg|png|gif))/i
      );
      var url = matches[1];
      var cat = {
        id: uuid(),
        channel: message.channel,
        cat: {
          url: url
        }
      };

      controller.storage.channels.save(cat, function(err) {
        if (!err) {
          bot.reply(message, "(ΦωΦ) ニャン (ID: " + cat.id + ")");
        } else {
          console.log(err);
        }
      });
    }
  );

  controller.hears(["^neko pull"], ["direct_message", "ambient"], function(
    bot,
    message
  ) {
    controller.storage.channels.all(function(err, res) {
      if (!err) {
        var pickedRecord = _.sample(
          _.filter(res, function(o) {
            return !!o.cat;
          })
        );

        if (pickedRecord && pickedRecord.cat) {
          bot.reply(message, pickedRecord.cat.url);
        } else {
          bot.reply(message, "(ΦωΦ) 猫いない");
        }
      } else {
        console.error(err);
      }
    });
  });

  controller.hears(["^neko count"], ["direct_message", "ambient"], function(
    bot,
    message
  ) {
    controller.storage.channels.all(function(err, res) {
      console.log(res);
      if (!err) {
        var catList = _.filter(res, function(o) {
          return !!o.cat;
        });

        bot.reply(message, ":cat2: " + catList.length + "匹ニャ");
      } else {
        console.error(err);
      }
    });
  });

  controller.hears(["^neko all-dump"], ["direct_message", "ambient"], function(
    bot,
    message
  ) {
    controller.storage.channels.all(function(err, res) {
      if (!err) {
        var dump = "";
        dump = JSON.stringify(res, null, 2);

        bot.reply(message, ":cat2: ```" + dump + "```");
      } else {
        console.error(err);
      }
    });
  });

  controller.hears(["^neko remove"], ["direct_message", "ambient"], function(
    bot,
    message
  ) {
    controller.storage.channels.all(function(err, res) {
      if (!err) {
        var catList = _.filter(res, function(o) {
          return !!o.cat;
        });

        var deletedUrlList = "";
        _.each(catList, function(cat) {
          request
            .get(cat.url, function(error, response, body) {
              if (!_.isNull(error) || response.statusCode != 200) {
                controller.storage.channels.remove(cat, function(err, res) {
                  if (!err) {
                    message += cat.url + "\n";
                  } else {
                    console.error(err);
                  }
                });
              }
            })
            .on("error", function(e) {
              console.error(e.message);
            });
        });
        bot.reply(message, ":cat2: " + deletedUrlList + "\nを削除したニャン");
      } else {
        console.error(err);
      }
    });
  });
};
