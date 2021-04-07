module.exports = {
    name: 'repeat',
    description: "change the mode of the queue",
    cooldown: 5,
    execute(message, client, args){
        
        if (!message.member.voice.channel) return message.channel.send('You must be in a voice channel to use this command.');
        if(args.length != 1) return message.channel.send('too many or too few args *** off , song , queue ***');
        
        const queue = client.distube.getQueue(message);
        if (!queue) return message.channel.send(`There is nothing playing!`);
        let mode = null;
        switch (args[0]) {
            case "off":
                mode = 0;
                break
            case "song":
                mode = 1;
                break
            case "queue":
                mode = 2;
                break
        }
        mode = client.distube.setRepeatMode(message, mode);
        mode = mode ? mode === 2 ? "Repeat queue" : "Repeat song" : "Off";
        message.channel.send(`Set repeat mode to \`${mode}\``);
    }
}