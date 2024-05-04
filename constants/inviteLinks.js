const {
    OAuth2Scopes,
    PermissionFlagsBits,
    ApplicationCommandType,
} = require('discord-api-types/v10')
const { client } = require('../bot')

const scopes = [OAuth2Scopes.ApplicationsCommands, OAuth2Scopes.Bot]

const adminPermissions = [PermissionFlagsBits.Administrator]

const normalPermissions = [
    PermissionFlagsBits.ManageRoles,
    PermissionFlagsBits.ManageChannels,
    PermissionFlagsBits.CreateInstantInvite,
    PermissionFlagsBits.ChangeNickname,
    PermissionFlagsBits.ReadMessageHistory,
    PermissionFlagsBits.SendMessages,
    PermissionFlagsBits.SendMessagesInThreads,
    PermissionFlagsBits.CreatePrivateThreads,
    PermissionFlagsBits.CreatePublicThreads,
    PermissionFlagsBits.AttachFiles,
    PermissionFlagsBits.ManageMessages,
    PermissionFlagsBits.ManageThreads,
    PermissionFlagsBits.EmbedLinks,
    PermissionFlagsBits.AddReactions,
    PermissionFlagsBits.UseExternalEmojis,
    PermissionFlagsBits.UseExternalStickers,
    PermissionFlagsBits.Connect,
    PermissionFlagsBits.Speak,
    PermissionFlagsBits.MuteMembers,
    PermissionFlagsBits.DeafenMembers,
    PermissionFlagsBits.MoveMembers,
    PermissionFlagsBits.UseVAD,
    PermissionFlagsBits.PrioritySpeaker,
    PermissionFlagsBits.RequestToSpeak,
    PermissionFlagsBits.ViewChannel,
]


/**
 * Generates invite links for a Discord bot with different permissions.
 *
 * @param {import('discord.js').Client} client - The Discord.js client instance.
 * @return {Object} An object containing the default and admin invite links.
 */
function getInviteLinks(client) {
    const defaultInviteLink = client.generateInvite({
        scopes,
        permissions: normalPermissions,
    })

    const adminInviteLink = client.generateInvite({
        scopes,
        permissions: adminPermissions,
    })

    return { defaultInviteLink, adminInviteLink }
}

module.exports = {
    getInviteLinks,
    scopes,
    adminPermissions,
    normalPermissions,
}
