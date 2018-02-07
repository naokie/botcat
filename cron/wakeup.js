var CronJob = require("cron").CronJob;

module.exports = function(bot) {
  function random(items) {
    return items[Math.floor(Math.random() * items.length)];
  }

  new CronJob(
    "0 0 10 * * 1-5",
    function() {
      var list = [
        "http://i.imgur.com/TaD84Sw.jpg",
        "http://i.imgur.com/M5tqTz0.jpg",
        "https://scontent-sea1-1.cdninstagram.com/t51.2885-15/e35/19436764_645907692286091_6621865046647504896_n.jpg",
        "https://i.pinimg.com/originals/53/a8/1c/53a81ce030957de6f3127c689956bc64.jpg",
        "ﾈﾑｲ(´･ωゞ)",
        ":syuzo: :syuzo: :syuzo:"
      ];

      bot.say({
        text: random(list),
        channel: "C02GLQNHR"
      });
    },
    null,
    true,
    "Asia/Tokyo"
  );
};
