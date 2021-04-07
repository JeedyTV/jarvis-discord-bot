module.exports = {
    name: 'stop',
    description: "stop the bot",
    cooldown: 5,
    execute(message, client){
        if (!message.member.voice.channel) return message.channel.send('You must be in a voice channel to use this command.');
        const queue = client.distube.getQueue(message);
        if (!queue) return message.channel.send(`There is nothing in the queue right now!`);
        client.distube.stop(message);
        message.channel.send(`Stopped!`);   
    }
}