module.exports = {
    name: 'jump',
    description: "jump to the song number i",
    cooldown: 5,
    execute(message, client, args){
        if (!message.member.voice.channel) return message.channel.send('You must be in a voice channel to use this command.');
        if(args.length != 1) return message.channel.send('too many or too few args *** off , song , queue ***');
        const queue = client.distube.getQueue(message)
        if (!queue) return message.channel.send(`There is nothing in the queue right now!`)
        try {
            client.distube.jump(message, parseInt(args[0])-1);
            message.channel.send(`Jumped!`);
            const queue = client.distube.getQueue(message)
            if (!queue) return message.channel.send(`There is nothing playing!`);
            message.channel.send('Current queue:\n' + queue.songs.map((song, id) =>
                `**${id + 1}**. ${song.name} - \`${song.formattedDuration}\``
            ).slice(0, 10).join("\n"));
            
        } catch (e) {
            message.channel.send(`${e} check the queue ***.queue***`);
        }
    }
}
