const { Collection } = require("discord.js");
const { client } = require("../../bot");
const auth = require("../middlewares/auth");

const router = require("express").Router();

router.use(auth)

router.get("/", async (req, res, next) => {
  try {
    // Check if product mode is dev or not
    const devGuild =
      client.config.dev && client.config.dev === "on"
        ? await client.guilds.fetch(client.config.test_guild_id)
        : null;
    // Get all commands
    const commands =
      (await devGuild?.commands?.fetch()) ||
      (await client.application.commands.fetch());
    // Do some filter base on query
    let resultCommands = commands.filter((command) => {
      for (let queryKey in req.query) {
        if (
          command[queryKey] === undefined ||
          command[queryKey] != req.query[queryKey]
        )
          return false;
      }
      return true;
    });

    return res.status(200).json(resultCommands);
  } catch (error) {
    res.status(error?.status || 500).json(error || error?.message);
  }
});

router.get("/:id", async (req, res, next) => {
  try {
    // Get params
    const id = req.params["id"];
    // Check if product mode is dev or not
    const devGuild =
      client.config.dev && client.config.dev === "on"
        ? await client.guilds.fetch(client.config.test_guild_id)
        : null;
    // Get command by its id
    const command =
      (await devGuild?.commands?.fetch(id)) ||
      (await client.application.commands.fetch(id));

    return res.status(200).json(command);
  } catch (error) {
    res.status(error.status || 500).json(error);
  }
});

router.post("/:name/:guildId", async (req, res, next) => {
  try {
    // Get params
    const commandName = req.params["name"];
    const guildId = req.params["guildId"];
    // Get command and queue
    const command = require(`../../interactions/slash/music/${commandName}.js`)?.server;
    // const guild = await client.guilds.fetch(guildId);
    const queue = client.distube.getQueue(guildId);

    if (!queue) return res.status(404).send("Queue not found!");

    const panel = await queue.textChannel.messages.fetch(queue.panelId);

    const result = command(queue);

    const Embed = require("../../constants/embeds/playPanel")(
			queue.songs[0],
			queue,
			client
		);

		const components = require("../../constants/components/playPanel")(
			false,
			queue,
			client
		);

    await panel.edit({
      embeds: Embed,
			components: components,
    })

    return res.status(200).json(result);
  } catch (error) {
    res.status(error.status || 500).json(error);
  }
});

module.exports = router;
