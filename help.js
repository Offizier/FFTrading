module.exports = {
  names: ["help"],
  run: async ({ bot, message, args }) => {
    if (!message.member.hasPermission("ADMINISTRATOR")) return;
    let embed = new (require("discord.js")).RichEmbed()
      .setAuthor(bot.user.username + " Команды", bot.user.avatarURL)
      .setFooter(
        "Created by Диз#7110",
        "https://cdn.discordapp.com/avatars/333248107980521474/00f81e7b2dc7f2fe9900c25d4a38ac67.png?size=2048"
      )
      .addField(
        "Для пользователей:",
        "`!disks`/`!диски` - проверка дисков;\n`!diskstop`/`!дискитоп` - топ 10 пользователей по дискам."
      )
      .addField(
        "Для организаторов мероприятий:",
        "`!disks <ID пользователя> <количество>`/`!диски <ID пользователя> <количество>` - выдача или снятие дисков определённому пользователю.\n(Для снятия дисков нужно указать минус перед количеством)."
      )
      .addField(
        "Для администрации:",
        "`!set <аргумент> <значение>` - управление настройками бота.\n**Аргументы команды:**\n`channelGet` - канал для проверки дисков (Значение: ID канала);\n`channelGive` - канал для выдачи/снятия дисков (Значение: ID канала);\n`roleMP` - роль для выдачи/снятия дисков (Значение: ID роли);\n`prefix` - префикс бота (до 6 символов);\n`status` - включение/выключение системы дисков (Значение: `+` для включения, `-` - выключения)."
      )
      .setColor(0xb40404);
    message.channel.send(embed);
  }
};
