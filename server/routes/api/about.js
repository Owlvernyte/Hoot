const os = require('os')
const packageJSON = require('../../../package.json')
const Discord = require('discord.js')
const { client, distube } = require('../../../bot')

const router = require('express').Router()

router.get('/', async (req, res, next) => {
    try {
        const cpu = await os.cpus()
        const memTotal = await os.totalmem()
        const memFree = await os.freemem()
        const processHeapUsed = Math.round(
            process.memoryUsage().heapUsed / 1024 / 1024
        )
        const processHeapTotal = Math.round(
            process.memoryUsage().heapTotal / 1024 / 1024
        )

        const operatingSystemPlatform = `${os.platform()}`

        const guilds = client.guilds.cache.size
        const users = client.users.cache.size

        res.status(200).json({
            user: client?.user,
            system: {
                cpu,
                operatingSystemPlatform,
                memTotal,
                memFree,
                processHeapTotal,
                processHeapUsed,
            },
            version: {
                bot: packageJSON.version,
                nodejs: process.version,
                discordjs: Discord.version,
                distubejs: distube.version,
            },
            count: {
                guilds: guilds,
                shards: client.shard?.count || 0,
                users: users,
            },
            distube: {
                count: {
                    queues: distube.queues.size,
                    playing: distube.queues.collection.size,
                    voices: distube.voices.collection.size
                },
            },
        })
    } catch (error) {
        res.status(error?.status || 500).json(error || error?.message)
    }
})

module.exports = router
