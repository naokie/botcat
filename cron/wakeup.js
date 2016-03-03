var CronJob = require('cron').CronJob;

module.exports = function(bot) {
    function random(items) {
        return items[Math.floor(Math.random() * items.length)];
    };

    new CronJob('0 0 10 * * 1-5', function() {
        var list = [
            'http://i.imgur.com/TaD84Sw.jpg',
            'http://i.imgur.com/M5tqTz0.jpg',
            'ﾈﾑｲ(´･ωゞ)',
            ':syuzo: :syuzo: :syuzo:'
        ];

        bot.say({
            text: random(list),
            channel: 'C02GLQNHR'
        });
    }, null, true, 'Asia/Tokyo');
};
