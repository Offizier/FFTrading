const SQLite = require("better-sqlite3");
const sql = new SQLite("./sql/disks.sqlite");
const url = require("../functions/url.js");
const { pluralize } = require("numeralize-ru");
module.exports = {
  names: ["diskstop", "дискитоп"],
  run: async ({ bot, message, args }) => {
    let settings = bot.getSettings.get();
    let emojiDisks = message.guild.emojis.find(e => e.name == "disk");
    emojiDisks = emojiDisks ? emojiDisks : "";
    if (!settings.status) return;
    if (
      message.channel.id != settings.channelGet &&
      ((!message.member.roles.has(settings.roleMP) &&
        !message.member.hasPermission("ADMINISTRATOR")) ||
        message.channel.id != settings.channelGive)
    )
      return;

    let countTop = 10;
    let top1;

    let place = bot.getTop.all().findIndex(m => m.id == message.author.id) + 1;
    place = place == 0 ? Infinity : place;
    let disks = bot.getScore.get(message.author.id);
    disks = disks ? disks.disksN : 0;
    let top = sql
      .prepare(`SELECT * FROM disks ORDER BY disksN DESC LIMIT ${countTop};`)
      .all();
    if (!top.length) return message.reply("пользователи отсутствуют.");
    let embed = new (require("discord.js")).RichEmbed().setAuthor(
      "🏆 Лидеры сбора дисков"
    );
    let text = "";
    for (const data of top) {
      let member = message.guild.members.get(data.id);
      let index = top.indexOf(data) + 1;
      if (index == 1) {
        top1 = message.guild.members.get(data.id);
        top1 = top1 ? top1.user.avatarURL : "";
      }
      text += `${
        index == 1
          ? "🥇"
          : index == 2
          ? "🥈"
          : index == 3
          ? "🥉"
          : `  **${index}**.`
      } ${member ? member.displayName : "Unknown"} - ${data.disksN} ${pluralize(
        data.disksN,
        "диск",
        "диска",
        "дисков"
      )} ${emojiDisks}\n`;
    }
    embed.setThumbnail(top1);
    embed.setDescription(text);
    if (place > countTop)
      embed.setFooter(
        `${place == Infinity ? "∞" : place + "."} ${
          message.member.displayName
        } - ${disks} ${pluralize(disks, "диск", "диска", "дисков")}`
      );
    return message.channel.send(embed);
  }
};
