
module.exports = {
    name: 'queue',
    description: "show the current queue",
    cooldown: 5,
    execute(message, client){
        const queue = client.distube.getQueue(message)
        if (!queue) return message.channel.send(`There is nothing playing!`);
        var l = queue.songs.map((song, id) =>
            `**${id + 1}**. ${song.name} - \`${song.formattedDuration}\``
        ).length;
        message.channel.send('Current queue:\n' + queue.songs.map((song, id) =>
            `**${id + 1}**. ${song.name} - \`${song.formattedDuration}\``
        ).slice(0, 10).join("\n"));
        message.channel.send(`***Queue size : ${l}***`); 
    }
}