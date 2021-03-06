const { Command } = require('discord.js-commando');
const {
    ihlManager, isMessageFromAdmin,
} = require('../../lib/ihlManager');
const {
    findUser,
} = require('../../lib/db');

module.exports = class QueueBanCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'queue-ban',
            aliases: ['qban', 'ban'],
            group: 'admin',
            memberName: 'queue-ban',
            guildOnly: true,
            description: 'Kick player from inhouse queue and tempban them.',
            examples: ['queue-ban @Ari* 5', 'queueban @Ari* 5', 'qban @Ari* 5', 'ban @Ari* 5'],
            args: [
                {
                    key: 'member',
                    prompt: 'Provide a user to ban.',
                    type: 'member',
                },
                {
                    key: 'timeout',
                    prompt: 'How many minutes to timeout the user?',
                    type: 'integer',
                    default: 0,
                },
            ],
        });
    }

    hasPermission(msg) {
        return isMessageFromAdmin(ihlManager.inhouseStates, msg);
    }

    async run(msg, { member, timeout }) {
        const discord_id = msg.author.id;
        const guild = msg.channel.guild;
        const [user, discord_user, result_type] = await findUser(guild)(member);

        if (user) {
            await ihlManager.banInhouseQueue(guild, user, timeout);
            await msg.say(`User kicked from queue and tempbanned for ${timeout} minutes.`);
        }
        else {
            await msg.say('User not found. (Has user registered with `!register`?)');
        }
    }
};
