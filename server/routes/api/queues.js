const { client, distube } = require('../../../bot')
const auth = require('../../middlewares/auth')

const router = require('express').Router()

router.use(auth)

router.get('/', async (req, res, next) => {
    try {
        res.status(200).json({
            queueIds: distube.queues.collection.map((_, k) => k),
            size: distube.queues.collection.size,
        })
    } catch (error) {
        res.status(error?.status || 500).json(error || error?.message)
    }
})

router.get('/:guildId', async (req, res, next) => {
    try {
        // Get guild id param
        const guildId = req.params['guildId']

        const queue = distube.getQueue(guildId)

        if (!queue) return res.status(404).send('Queue not found!')

        const {
            id,
            autoplay,
            beginTime,
            currentTime,
            formattedCurrentTime,
            formattedDuration,
            repeatMode,
            textChannel,
            voiceChannel,
            volume,
            duration,
            filters,
            songs,
            playing,
            paused,
            previousSongs,
            ...props
        } = queue

        const result = {
            id,
            autoplay,
            beginTime,
            currentTime,
            formattedCurrentTime,
            formattedDuration,
            repeatMode,
            volume,
            duration,
            songs,
            playing,
            paused,
            previousSongs,
            filters: filters.names,
            textChannel: textChannel.id,
            voiceChannel: voiceChannel.id,
        }

        res.status(200).json(result)
    } catch (error) {
        res.status(error?.status || 500).json(error || error?.message)
    }
})

router.post('/:guildId/:name', async (req, res, next) => {
    try {
        // Get params
        const commandName = req.params['name']
        const guildId = req.params['guildId']
        // Get command and queue
        const command =
            require(`../../interactions/slash/music/${commandName}.js`)?.server
        // const guild = await client.guilds.fetch(guildId);
        const queue = distube.getQueue(guildId)

        if (!queue) return res.status(404).send('Queue not found!')

        const panel = await queue.textChannel.messages.fetch(queue.panelId)

        const result = command(queue)

        const Embed = require('../../../constants/embeds/playPanel')(
            queue.songs[0],
            queue,
            client
        )

        const components = require('../../../constants/components/playPanel')(
            false,
            queue,
            client
        )

        await panel.edit({
            embeds: Embed,
            components: components,
        })

        return res.status(200).json(result)
    } catch (error) {
        res.status(error.status || 500).json(error)
    }
})

module.exports = router
