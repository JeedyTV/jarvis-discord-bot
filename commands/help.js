module.exports = {
    name: 'help',
    description: "show every command available",
    cooldown: 2,
    execute(message, client, Discord){
        var embed = new Discord.MessageEmbed()
            .setTitle("Commands")
            .setDescription('***supported command in text mode***')
            .setColor('#9979FF')
            .addFields(
                {name: '.listen', value: 'Enter in listen mode'},
                {name: '.jump', value: 'jump **<number song in the queue>**'},
                {name: '.pause', value: 'pause the song if one playin\''},
                {name: '.ping', value: 'ping command'},
                {name: '.play', value: 'play music or playlist or album from spotify,youtube,souncloud.\nUSE !album_name !artist_name to get album'},
                {name: '.queue', value: 'show the queue'},
                {name: '.repeat', value: 'repeat song , queue , off'},
                {name: '.skip', value: 'skip the song'},
                {name: '.stop', value: 'quit the channel and delete the queue'}
            )
            .setTimestamp()
        message.channel.send(embed);
        embed = new Discord.MessageEmbed()
            .setTitle("Commands")
            .setDescription('***supported command in listen command***')
            .setColor('#9979FF')
            .addFields(
                {name: 'play music', value: 'play the sound requested'},
                {name: 'next song', value: 'skip the song'},
                {name: 'stop the music', value: 'pause the music'},
                {name: 'play the music', value: 'resume the music'},
                {name: 'leave the channel', value: 'quit the channel and delete the queue'}
            )
            .setTimestamp()
        message.channel.send(embed);
    }
}