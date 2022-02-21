require("dotenv").config();
const fetch = require("node-fetch");
const { Telegraf } = require("telegraf");
const CronJob = require("cron").CronJob;

const bot = new Telegraf(process.env.BOT_TOKEN);

if (process.env.BOT_TOKEN === undefined) {
  throw new TypeError("BOT_TOKEN must be provided!");
}

bot.command("start", (ctx) => {
  bot.telegram.sendMessage(ctx.chat.id, "Test");

  const job = new CronJob("* 12 * * *", function () {
    bot.telegram.sendMessage(ctx.chat.id, "İlacını almaya unutma yenge");
  });

  // const reminderJob = new CronJob("* * * * *", function () {});

  job.start();
  // reminderJob.start();
});

bot.hears("asked", (ctx) => {
  let message = `İlaçlarını aldın mı bakim`;
  bot.telegram.sendMessage(ctx.chat.id, message, {
    reply_markup: {
      inline_keyboard: [
        [
          {
            text: "Aldımmmm",
            callback_data: "yes",
          },
          {
            text: "Almadım",
            callback_data: "no",
          },
        ],
      ],
    },
  });
});

bot.action("yes", (ctx) => {
  sendGif("welldone", ctx);
});

bot.action("no", (ctx) => {
  sendGif("sad", ctx);
});

async function sendGif(data, ctx) {
  try {
    const response = await fetch(`https://api.giphy.com/v1/gifs/search?api_key=${process.env.API_TOKEN}&q=${data}&limit=1`);
    const json = await response.json();
    bot.telegram.sendVideo(ctx.chat.id, `https://api.telegram.org/${process.env.BOT_TOKEN}/sendVideo?chat_id=${ctx.chat.id}&video=${json.data[0].url}.gif`);
  } catch (error) {
    console.error(error);
  }
 
}

// function sendLiveLocation (ctx) {
//   let lat = 42.0
//   let lon = 42.0
//   // @ts-ignore
//   ctx.replyWithLocation(lat, lon, { live_period: 60 }).then((message) => {
//     const timer = setInterval(() => {
//       lat += Math.random() * 0.001
//       lon += Math.random() * 0.001
//       ctx.telegram.editMessageLiveLocation(lat, lon, message.chat.id, message.message_id).catch(() => clearInterval(timer))
//     }, 1000)
//   })
// }

bot.launch();
