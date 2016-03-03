var request = require('request');

var misawa = function(bot, message, q) {
    request.get('http://horesase.github.io/horesase-boys/meigens.json', function(error, response, body) {
        if (!error && response.statusCode == 200) {
            var meigens = JSON.parse(body);
            console.log(meigens);
        }
    });
    // message.http('http://horesase.github.io/horesase-boys/meigens.json').get()(function(err, res, body) {
    //     var meigens;
    //     if (err) {
    //         bot.reply(message, ERROR_MESSAGE);
    //     } else {
    //         meigens = JSON.parse(body);
    //         bot.reply(message, misawaN(message, q, meigens));
    //     }
    // });
};

module.exports = function(controller) {
    controller.hears(['!misawa( +(.*))?'], ['direct_message'], function(bot, message) {
        var matches = message.text.match(/!misawa( +(.*))?/i);
        var q = matches[2];

        misawa(bot, message, q);
        // return misawa(message, q, 1);
    });
};
