const Discord = require('discord.js');
DisTube = require('distube');
const config = require("./config/config.json");
client = new Discord.Client();

const fs = require('fs');

client.commands = new Discord.Collection();

const commandFiles = fs.readdirSync('./commands/').filter(file => file.endsWith('.js'));

for(const file of commandFiles){
    const command = require(`./commands/${file}`);
    client.commands.set(command.name,command);
}

client.distube = new DisTube(client, { searchSongs: true, emitNewSongOnly: true });


const status = (queue) => `Loop: \`${queue.repeatMode ? queue.repeatMode == 2 ? "All Queue" : "This Song" : "Off"}\` | Autoplay: \`${queue.autoplay ? "On" : "Off"}\``;

client.distube
    .on("playSong", (message, queue, song) => {
        message.channel.send(
        `Playing \`${song.name}\` - \`${song.formattedDuration}\`\nRequested by: ${song.user}\n${status(queue)}`);
    })
    .on("addSong", (message, queue, song) => message.channel.send(
        `Added ${song.name} - \`${song.formattedDuration}\` to the queue by ${song.user}`
    ))
    .on("playList", (message, queue, playlist, song) => { 
        message.channel.send(
        `play \`${playlist.name}\` (${playlist.songs.length} songs).\n Now playing \`${song.name}\` - \`${song.formattedDuration}\`\n${status(queue)}`);

    })
    .on("addList", (message, queue, playlist) => message.channel.send(
        `Added \`${playlist.name}\` playlist (${playlist.songs.length} songs) to queue\n${status(queue)}`
    ))
    .on("searchResult", (message, result) => {
        let i = 0;
        message.channel.send(`**Choose an option from below**\n${result.map(song => `**${++i}**. ${song.name} - \`${song.formattedDuration}\``).join("\n")}\n*Enter anything else or wait 60 seconds to cancel*`);
    })
    .on("searchCancel", (message) => message.channel.send(`Searching canceled`))
    .on("error", (message, e) => {
        console.error(e)
        message.channel.send("An error encountered: " + e);
    });

client.on('ready', () => {
    console.log(`Logged in as ${client.user.tag}!`);
});

const cooldowns = new Map();
client.on("message", async (message) => {
    
    if(!message.content.startsWith(config.prefix) || message.author.bot) return ;
    const args = message.content.slice(config.prefix.length).split(/ +/);
    const cmd = args.shift().toLowerCase();

    const command = client.commands.get(cmd);

    var currentTime;
    var timeStamps;
    var cooldownAmount;
    
    try {
        
        if(!cooldowns.has(command.name)){
            cooldowns.set(command.name, new Discord.Collection());
        }
        currentTime = Date.now();
        timeStamps = cooldowns.get(command.name);
        cooldownAmount = (command.cooldown) * 1000;

    }catch(err){
         message.reply("This command ***doesn't exist!***");
         return;
    }

    if(timeStamps.has(message.author.id)){
        
        const expirationTime = timeStamps.get(message.author.id) + cooldownAmount;

        if(currentTime < expirationTime){
            const timeLeft = (expirationTime - currentTime) / 1000;
            return message.reply(`Stop spamming ${timeLeft.toFixed(1)} left!`);
        }
    }

    timeStamps.set(message.author.id, currentTime);
    setTimeout(() => timeStamps.delete(message.author.id), cooldownAmount); 

    try{
        
        if(cmd == 'ping'){
            client.commands.get('ping').execute(message);
        }
        else if (cmd == "play"){
            client.commands.get('play').execute(message, args, client); 
        }
        else if (cmd == 'pause'){
            client.commands.get('pause').execute(message,client);

        }
        else if(cmd == 'help'){
            client.commands.get('help').execute(message, client, Discord);
        }
        else if(cmd == 'stop'){
            client.commands.get('stop').execute(message, client);
        }
        else if(cmd == 'repeat'){
            client.commands.get('repeat').execute(message, client, args);
        }
        else if(cmd == 'queue'){
            client.commands.get('queue').execute(message, client);
        }
        else if(cmd == 'skip'){
            client.commands.get('skip').execute(message, client);
        }
        else if(cmd == 'jump'){
            client.commands.get('jump').execute(message, client, args);
        }
        else if(cmd == 'listen'){
            client.commands.get('listen').execute(message, client);
        }
        else if(cmd == 'playvoice'){
            client.commands.get('playvoice').execute(message);
        }

        

    } catch(err){
        message.reply("This command ***doesn't exist!***");
        console.log(err);
    }

});

client.login(config.BOT_TOKEN);