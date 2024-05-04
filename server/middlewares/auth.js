const { api_key } = require('../../config.json')

/**
 *
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 * @param {import('express').NextFunction} next
 */
async function auth(req, res, next) {
    const providedApiKey = req.query.api_key
    if (!providedApiKey) {
        res.status(400).json({
            success: false,
            message: 'Missing api key',
        })
        return
    }

    if (providedApiKey != api_key) {
        res.status(401).json({
            success: false,
            message: 'Wrong api key',
        })
        return
    }

    next()
}

module.exports = auth
