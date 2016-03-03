module.exports = function(controller) {
    controller.hears(['(ggr|ggrks) (.*)'], ['direct_message', 'direct_mention', 'mention', 'ambient'], function(bot, message) {
        var matches = message.text.match(/ggr (.*)/i);
        var name = matches[1];
        var res = matches[1].replace(' ', '+');

        bot.reply(message, 'っ [ https://www.google.co.jp/search?q=' + res + ' ]');
    });
};
