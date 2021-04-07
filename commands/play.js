let {PythonShell} = require('python-shell');

module.exports = {
    name: 'play',
    description: "this is a ping command",
    cooldown: 5,
    execute(message, args, client){

        var voiceChannel = message.member.voice.channel;

        if (!voiceChannel) return message.channel.send('You must be in a voice channel to use this command.');
        const permissions = voiceChannel.permissionsFor(message.client.user);
        if(!permissions.has('CONNECT')) return message.channel.send('You don\'t have the good permision');
        if(!permissions.has('SPEAK')) return message.channel.send('You don\'t have the good permision');
        if(args.length == 0) return message.channel.send('too many args *** .play <url> or <song_name> ***');
        if(message.content.includes('spotify') || message.content.includes('!')){

            
            let options = {
            mode: 'text',
            pythonPath: '/usr/bin/python3',
            pythonOptions: ['-u'], // get print results in real-time
            scriptPath: './test',
            args: [args.join(' ')]
            };

            PythonShell.run('main.py', options, function (err, results) {
                if (err) throw err;
                var obj = JSON.parse(results);
                if(obj.return_label == 'SUCCES'){
                    client.distube.playCustomPlaylist(message,obj.url,{ name: obj.name });
                }else{
                    message.reply('No result found')
                }
            });
        }else{
            client.distube.play(message, args.join(" "));
        }
    }
}