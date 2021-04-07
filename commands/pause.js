module.exports = {
    name: 'pause',
    description: "pause ou resume the sound",
    cooldown: 5,
    execute(message,client){
        
        const queue = client.distube.getQueue(message);
        if (!queue) return message.channel.send(`There is nothing in the queue right now!`);
        if (queue.pause) {
            client.distube.resume(message);
            return message.channel.send("Resumed the song for you!");
        }
        client.distube.pause(message);
        message.channel.send("Paused the song for you write ***.pause*** to resume!");
    }
}