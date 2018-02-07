module.exports = function(controller) {
  controller.hears(
    ["(っぽい|だろう|かも|そうそう)"],
    ["direct_message", "ambient"],
    function(bot, message) {
      var p = parseFloat("0.3");
      if (Math.random() < p) return;

      bot.reply(message, "(´・ω・｀) そっかー");
    }
  );

  controller.hears(["忙し"], ["direct_message", "ambient"], function(
    bot,
    message
  ) {
    bot.reply(message, "(つ∀｀*)　気のせいだったらいいのに～！");
  });

  controller.hears(["ぐへへ"], ["direct_message", "ambient"], function(
    bot,
    message
  ) {
    bot.reply(message, "(〃ﾉωﾉ)ｲﾔﾝ");
  });

  controller.hears(["たい$"], ["direct_message", "ambient"], function(
    bot,
    message
  ) {
    var p = parseFloat(process.env.DOCOMO_DIALOGUE_P || "0.5");
    if (Math.random() < p) return;

    bot.reply(message, "d(´ー｀*) だねぇ");
  });

  controller.hears(["(眠|ねむ)い"], ["direct_message", "ambient"], function(
    bot,
    message
  ) {
    bot.reply(message, ":monster: 三");
  });
};
