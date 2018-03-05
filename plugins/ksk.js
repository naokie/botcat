module.exports = controller => {
  controller.hears(["^ksk"], ["direct_mention"], (bot, message) => {
    bot.api.channels.history({ channel: message.channel }, (err, res) => {
      var first = res.messages.find(i => i.user === bot.identity.id);

      bot.api.chat.delete({ channel: message.channel, ts: first.ts }, err => {
        if (err) {
          console.error(err);
        }
      });
    });
  });
};
