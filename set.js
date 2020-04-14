const getPerms = require("../functions/perms.js");
module.exports = {
  names: ["set"],
  run: async ({ bot, message, args }) => {
    if (!message.member.hasPermission("ADMINISTRATOR")) return;
    let settings = bot.getSettings.get();
    args[1] = args[1].trim();
    if (!args[1]) return;
    if (args[0] == "channelGive") {
      let channel = checkChannel(message, args[1], bot);
      if (!channel) return;
      settings.channelGive = channel.id;
      bot.setSettings.run(settings);
      message.reply(`теперь выдавать/снимать диски можно только в ${channel}.`);
    } else if (args[0] == "channelGet") {
      let channel = checkChannel(message, args[1], bot);
      if (!channel) return;
      settings.channelGet = channel.id;
      bot.setSettings.run(settings);
      message.reply(`теперь проверять диски можно в ${channel}`);
    } else if (args[0] == "roleMP") {
      let role = message.guild.roles.get(args[1]);
      if (!role) return message.reply("правильно укажи ID роли.");
      settings.roleMP = role.id;
      bot.setSettings.run(settings);
      message.reply(`теперь диски могут выдавать участники с ролью ${role}`);
    } else if (args[0] == "prefix") {
      let prefix = args[1];
      if (prefix.length > 6)
        return message.reply("префикс должен быть длиной менее шести символов");
      settings.prefix = prefix;
      bot.setSettings.run(settings);
      message.reply(`префикс изменён на **${prefix}**`);
    } else if (args[0] == "status") {
      let statuses = { "+": 1, "-": 0 };
      let str = { "+": "**включёна**", "-": "**выключена**" };
      if (
        args[1].length > 1 ||
        (!args[1].includes("+") && !args[1].includes("-"))
      ) {
        message.reply(
          "для включения системы дисков введи `+`, для выключения - `-`"
        );
        return;
      }
      if (args[1] == "+") {
        let full = true;
        for (let key in settings) {
          if (!settings[key] && key != "status") {
            full = false;
            break;
          }
        }
        if (!full)
          return message.reply(
            "для включения системы дисков, нужно ввести все данные."
          );
      }
      settings.status = statuses[args[1]];
      bot.setSettings.run(settings);
      message.reply(`система дисков ${str[args[1]]}.`);
    }
  }
};

function checkChannel(message, id, bot) {
  let channel = message.guild.channels.get(id);
  let perms =
    !channel || channel.type != "text"
      ? ""
      : getPerms(channel.permissionsFor(bot.user).bitfield);
  if (
    !channel ||
    channel.type != "text" ||
    !perms.includes("SEND_MESSAGES") ||
    !perms.includes("EMBED_LINKS") ||
    !perms.includes("ATTACH_FILES")
  ) {
    message.reply("правильно укажи ID канала.");
    channel = undefined;
  }
  return channel;
}
