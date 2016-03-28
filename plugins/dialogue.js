var request = require('request');

module.exports = function(controller) {
    controller.hears(['.+'], ['direct_message', 'direct_mention', 'mention'], function(bot, message) {
        if (!process.env.DOCOMO_DIALOGUE_API_KEY) return;

        var p = parseFloat(process.env.DOCOMO_DIALOGUE_P || '0.3');
        if (Math.random() < p) {
            bot.reply(message, 'ニャン');
            return;
        }

        var matches = message.text.match(/(.+)/i);

        bot.api.users.info({
            user: message.user
        }, function(error, response) {
            if (error) {
                console.log(error);
            } else {
                var payload = {
                    utt: matches[0],
                    nickname: response.user.name
                };

                request.post({
                    url: 'https://api.apigw.smt.docomo.ne.jp/dialogue/v1/dialogue',
                    qs: {
                        APIKEY: process.env.DOCOMO_DIALOGUE_API_KEY,
                    },
                    json: payload,
                }, function(error, response, body) {
                    if (!error && response.statusCode == 200) {
                        bot.reply(message, body.utt);
                    } else {
                        console.log(error);
                    }
                });
            }
        });
    });
};
