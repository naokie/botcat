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
          console.error(err);
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
          bot.reply(message, {
            text: pickedRecord.cat.url,
            attachments: [
              {
                callback_id: "delete_callback",
                attachment_type: "default",
                actions: [
                  {
                    name: "delete",
                    value: pickedRecord.cat.id,
                    text: "delete",
                    type: "button"
                  }
                ]
              }
            ]
          });
        } else {
          bot.reply(message, "(ΦωΦ) 猫いない");
        }
      } else {
        console.error(err);
      }
    });
  });

  controller.on("interactive_message_callback", function(bot, message) {
    if (message.callback_id === "delete_callback") {
      var catId = message.actions[0].value;
      controller.storage.channels.remove(catId, function(err) {
        if (!err) {
          bot.reply(message, ":cat2: 削除したニャン");
        } else {
          console.error(err);
        }
      });
    }
  });

  controller.hears(["^neko count"], ["direct_message", "ambient"], function(
    bot,
    message
  ) {
    controller.storage.channels.all(function(err, res) {
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
        var removeCat = function(cat) {
          controller.storage.channels.remove(cat.id, function(err) {
            if (!err) {
              bot.reply(
                message,
                ":cat2: " + cat.cat.url + "\nを削除したニャン"
              );
            } else {
              console.error(err);
            }
          });
        };
        var checkCat = function(cat) {
          request.get(cat.cat.url, function(err, res) {
            if (!err && res.statusCode === 200) return;
            removeCat(cat);
          });
        };

        catList.forEach(checkCat);
      } else {
        console.error(err);
      }
    });
  });
};
