module.exports = {
    name: 'ping',
    description: "this is a ping command",
    cooldown: 5,
    execute(message){
        const timeTaken = Date.now() - message.createdTimestamp;
        message.reply(` Pong! This message had a latency of ${timeTaken}ms.`);
    }
}