const { pluralize } = require("numeralize-ru");
const url = require("../functions/url.js");
module.exports = {
  names: ["disks", "диски"],
  run: async ({ bot, message, args }) => {
    let settings = bot.getSettings.get();
    let emojiDisks = message.guild.emojis.find(e => e.name == "disk");
    emojiDisks = emojiDisks ? emojiDisks : "";
    if (!settings.status) return;
    if (
      message.channel.id == settings.channelGet ||
      ((message.member.roles.has(settings.roleMP) ||
        message.member.hasPermission("ADMINISTRATOR")) &&
        message.channel.id == settings.channelGive &&
        !args[0])
    ) {
      let disks = bot.getScore.get(message.author.id);
      disks = disks ? disks.disksN : 0;
      let place =
        bot.getTop.all().findIndex(m => m.id == message.author.id) + 1;
      place =
        place == 0
          ? "#∞"
          : place == 1
          ? "🥇 1-е"
          : place == 2
          ? "🥈 2-е"
          : place == 3
          ? "🥉 3-е"
          : `${place}-е`;
      let disksStr = `${disks} ${pluralize(disks, "диск", "диска", "дисков")}`;
      let embed = new (require("discord.js")).RichEmbed()
        .setColor(0x2e2efe)
        .setDescription(
          `${message.member.displayName}, на твоём счету ${disksStr} ${emojiDisks}.`
        )
        .setFooter(`${place} место в таблице лидеров`);
      await message.channel.send(embed);
      return;
    }
    if (
      (!message.member.roles.has(settings.roleMP) &&
        !message.member.hasPermission("ADMINISTRATOR")) ||
      message.channel.id != settings.channelGive
    )
      return;
    if (!args[1]) return message.reply("укажи количество дисков.");
    if (args[1].replace(/-?[0-9]+/i, ""))
      return message.reply("правильно укажи число.");
    let member = message.guild.members.get(args[0]);
    if (!member) return message.reply("правильно укажи ID пользователя.");
    let disks = bot.getScore.get(member.id);
    disks = !disks ? { id: member.id, disksN: 0 } : disks;
    if (args[1].includes("-") && disks.disksN < Number(args[1].slice(1)))
      return message.reply(
        "у пользователя недостаточно дисков " + disks.disksN
      );
    let neg;
    if (args[1].includes("-")) {
      neg = true;
      disks.disksN -= Number(args[1].slice(1));
    } else disks.disksN += Number(args[1]);
    let disksChange = neg ? args[1].slice(1) : args[1];
    message.reply(
      `${member.displayName} ${
        neg ? "снято" : "выдано"
      } ${disksChange} ${pluralize(
        disksChange,
        "диск",
        "диска",
        "дисков"
      )}. Всего на счету ${disks.disksN} ${pluralize(
        disks.disksN,
        "диск",
        "диска",
        "дисков"
      )}.`
    );
    bot.setScore.run(disks);
  }
};
