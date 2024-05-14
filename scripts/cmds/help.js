const fs = require("fs-extra");
const axios = require("axios");
const path = require("path");
const { getPrefix } = global.utils;
const { commands, aliases } = global.GoatBot;
const doNotDelete = "[ 🐥 | DÅËMÕÑ V2 ]"; // changing this wont change the goatbot V2 of list cmd it is just a decoyy

module.exports = {
  config: {
    name: "help",
    version: "1.17",
    author: "destruction", // original author Kshitiz 
    countDown: 5,
    role: 0,
    shortDescription: {
      en: "View command usage and list all commands directly",
    },
    longDescription: {
      en: "View command usage and list all commands directly",
    },
    category: "info",
    guide: {
      en: "{pn} / help cmdName ",
    },
    priority: 1,
  },

  onStart: async function ({ message, args, event, threadsData, role }) {
    const { threadID } = event;
    const threadData = await threadsData.get(threadID);
    const prefix = getPrefix(threadID);

    if (args.length === 0) {
      const categories = {};
      let msg = "";

      msg += `╔═══════ - ════════╗\n.❰✰...𝗛𝗔𝗠𝗘𝗗 𝗯𝗼𝘁 V2 🥀...✰❱.    \n╚═══════ - ════════╝`; // replace with your name 

      for (const [name, value] of commands) {
        if (value.config.role > 1 && role < value.config.role) continue;

        const category = value.config.category || "Uncategorized";
        categories[category] = categories[category] || { commands: [] };
        categories[category].commands.push(name);
      }

      Object.keys(categories).forEach((category) => {
        if (category !== "info") {
          msg += `\n█▀▀▀▀▀▀ʜᴀᴍᴇᴅ▀▀▀▀▀▀█..☄\n│ ➫『  ${category.toUpperCase()}  』`;


          const names = categories[category].commands.sort();
          for (let i = 0; i < names.length; i += 3) {
            const cmds = names.slice(i, i + 1).map((item) => `☘${item}☆`);
            msg += `\n│ ${cmds.join(" ".repeat(Math.max(1, 10 - cmds.join("").length)))}`;
          }

          msg += `\n█▄▄▄▄▄▄ʜᴀᴍᴇᴅ▄▄▄▄▄▄█..☄`;
        }
      });

      const totalCommands = commands.size;
      msg += `\n𝒋𝒆 𝒅𝒊𝒔𝒑𝒐𝒔𝒆 𝒅𝒆  ${totalCommands} 𝒄𝒐𝒎𝒎𝒂𝒏𝒅𝒆𝒔\n\n`;
      msg += ` 𝘄𝗿𝗶𝘁𝗲 ${prefix} 𝗵𝗲𝗹𝗽 + 𝒏𝒐𝒎 𝒅𝒆 𝒍𝒂 𝒄𝒐𝒎𝒎𝒂𝒏𝒅𝒆 𝒑𝒐𝒖𝒓 𝒆𝒏 𝒗𝒐𝒊𝒓 𝒍𝒆𝒔 𝒊𝒏𝒇𝒐𝒔\n\n`;
      msg += `📜|𝒋'𝒆𝒔𝒑𝒆̀𝒓𝒆 𝒒𝒖𝒆 𝒎𝒐𝒏 𝒑𝒐𝒕𝒆𝒏𝒕𝒊𝒆𝒍 𝒗𝒐𝒖𝒔 𝒆́𝒑𝒂𝒕𝒆 𝒄𝒂𝒔 𝒊𝒍 𝒏𝒆 𝒄𝒆𝒔𝒔𝒆𝒓𝒂 𝒑𝒂𝒔 𝒅𝒆 𝒍𝒆 𝒇𝒂𝒊𝒓𝒆 🥀  V3`; // its not decoy so change it if you want 

      const helpListImages = [
        "https://i.ibb.co/26yhwz1/image.jpg", // add image link here
                "https://i.ibb.co/G0Rm6d3/image.jpg",
        "https://i.ibb.co/0XmgfwY/image.jpg",
        // Add more image links as needed
      ];

      const helpListImage = helpListImages[Math.floor(Math.random() * helpListImages.length)];

      await message.reply({
        body: msg,
        attachment: await global.utils.getStreamFromURL(helpListImage),
      });
    } else {
      const commandName = args[0].toLowerCase();
      const command = commands.get(commandName) || commands.get(aliases.get(commandName));

      if (!command) {
        await message.reply(`Command "${commandName}" not found.`);
      } else {
        const configCommand = command.config;
        const roleText = roleTextToString(configCommand.role);
        const author = configCommand.author || "Unknown";

        const longDescription = configCommand.longDescription ? configCommand.longDescription.en || "No description" : "No description";

        const guideBody = configCommand.guide?.en || "No guide available.";
        const usage = guideBody.replace(/{p}/g, prefix).replace(/{n}/g, configCommand.name);

        const response = `╭── NOM ────⭓
  │ ${configCommand.name}
  ├── INFO
  │ Description: ${longDescription}
  │ Autres noms : ${configCommand.aliases ? configCommand.aliases.join(", ") : "Ne pas avoir"}
  │ Autres noms dans votre groupe : Je n'en ai pas
  │ Version: ${configCommand.version || "1.0"}
  │ Rôle : \n${roleText}
  │ Time per command: ${configCommand.countDown || 1}s
  │ Author: \n${author}
  ├── utilisation
  │ ${usage}
  ├── Notes
  │ The content inside <XXXXX> can be changed
  │ The content inside [a|b|c] is A or B or C
  ╰━━━━━━━❖`;

        await message.reply(response);
      }
    }
  },
};

function roleTextToString(roleText) {
  switch (roleText) {
    case 0:
      return "0 (All users)";
    case 1:
      return "1 (Group administrators)";
    case 2:
      return "2 (Admin bot)";
    default:
      return "Unknown role";
  }
        }
