var _ = require('lodash');

var uuid = function() {
    var uuid = '', i, random;

    for (i = 0; i < 32; i++) {
        random = Math.random() * 16 | 0;

        if (i == 8 || i == 12 || i == 16 || i == 20) {
            uuid += '-';
        }
        uuid += (i == 12 ? 4 : (i == 16 ? (random & 3 | 8) : random)).toString(16);
    }

    return uuid;
};

module.exports = function(controller) {
    controller.hears(['^neko push (http(s)?:\/\/.+)?'], ['direct_message', 'ambient'], function(bot, message) {
        var matches = message.text.match(/(http(s)?:\/\/.+\/.+(jpg|jpeg|png|gif))/i);
        var url = matches[1];
        var cat = {
            id: uuid(),
            channel: message.channel,
            cat: {
                url: url,
            },
        };

        controller.storage.channels.save(cat, function(err) {
            if (!err) {
                bot.reply(message, '(ΦωΦ) ニャン (ID: ' + cat.id + ')');
            } else {
                console.log(err);
            }
        });
    });

    controller.hears(['^neko pull'], ['direct_message', 'ambient'], function(bot, message) {
        controller.storage.channels.all(function(err, res) {
            if (!err) {
                var pickedRecord = _.sample(_.filter(res, function(o) {
                    return (!!o.cat);
                }));

                if (pickedRecord && pickedRecord.cat) {
                    bot.reply(message, pickedRecord.cat.url);
                } else {
                    bot.reply(message, '(ΦωΦ) 猫いない');
                }
            } else {
                console.log(err);
            }
        });
    });
};
