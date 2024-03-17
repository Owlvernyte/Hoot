const fs = require('fs')
const path = require('path')
const router = require('express').Router()

const Files = fs
    .readdirSync(path.join(__dirname))
    .filter((file) => file.endsWith('.js'))

for (const file of Files) {
    const route = require(`./${file}`)
    const filePath = file.split('.')[0]
    console.log(`[SERVER] Found ${path.join(__dirname, filePath)}`)
    if (filePath === 'index') continue
    router.use(`/${filePath}`, route)
}

module.exports = router
