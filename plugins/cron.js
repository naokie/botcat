var cron = require('cron').CronJob;

module.exports = function(bot) {
    new cron('0 0 10 * * 1-5', function() {
        bot.say({
            text: 'ﾈﾑｲ(´･ωゞ)',
            channel: 'shibuya'
        });
    }, null, true, 'Asia/Tokyo');
};
