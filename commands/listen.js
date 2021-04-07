const WitSpeech = require('node-witai-speech');
const config = require("../config/config.json");
const ytSearch = require('yt-search');
const  {Readable}  = require('stream');

module.exports = {
    name: 'listen',
    description: "this is a join!",
    cooldown: 5,
    async execute(message,client){
        
        if (!message.member.voice.channel) return message.channel.send('You must be in a voice channel to use this command.');
    
        const voiceChannel = message.member.voice.channel;

        if(!voiceChannel) return message.channel.send('Va dans un channel connard!');
        console.log(`Sliding into ${voiceChannel.name} ...`);
        message.reply(`Sliding into ${voiceChannel.name} ...`)
        const permissions = voiceChannel.permissionsFor(message.client.user);
        if(!permissions.has('CONNECT')) return message.channel.send('You don\'t have the good permision');
        if(!permissions.has('SPEAK')) return message.channel.send('You don\'t have the good permision');
        ////    args 0

        function sleep(ms) {
            return new Promise((resolve) => {
              setTimeout(resolve, ms);
            });
          }

        async function convert_audio(input) {
            try {
                // stereo to mono channel
                const data = new Int16Array(input)
                const ndata = new Int16Array(data.length/2)
                for (let i = 0, j = 0; i < data.length; i+=4) {
                    ndata[j++] = data[i]
                    ndata[j++] = data[i+1]
                }
                return Buffer.from(ndata);
            } catch (e) {
                console.log(e)
                console.log('convert_audio: ' + e)
                throw e;
            }
        }

        let lastcallTS = null;
        async function transcribe_witai(buffer) {
            try {
                
                if (lastcallTS != null) {
                    let now = Math.floor(new Date());    
                    while (now - lastcallTS < 1000) {
                        await sleep(1000);
                        now = Math.floor(new Date());
                    }
                }
            } catch (e) {
                console.log(e)
            }

            try {
                
                console.log('[bot] : transcribe');
                
                var stream = Readable.from(buffer);
                const content_type = "audio/raw;encoding=signed-integer;bits=16;rate=48k;endian=little";
                var API_KEY = config.WITAIAPI;
                
                var parseSpeech =  new Promise((ressolve, reject) => {
                    lastcallTS = Math.floor(new Date());
                    WitSpeech.extractSpeechIntent(API_KEY, stream, content_type, 
                    (err, res) => {
                        if (err) return reject(err);
                        ressolve(res);
                    });
                });

                parseSpeech.then(async (data) => {

                    if(data.text){

                        console.log('\x1b[36m%s\x1b[0m', data.text);
                        
                        if(data.text.startsWith('play music')){
                
                            var g = data.text.slice(0).trim().split(/ +/g);
                            g.shift();

                            const videoFinder = async (query) => {
                                const videoResult = await ytSearch(query);
                     
                                return (videoResult.videos.length > 1) ? videoResult.videos[0] : null;
                     
                            }
                            const video = await videoFinder(g.join(' ')+'audio');

                            
                    
                            client.distube.playCustomPlaylist(message,[video.url],{ name: video.title });
                            
                            

                        }else if(data.text == 'next song'){

                            const queue = client.distube.getQueue(message);
                            if (!queue) return message.channel.send(`There is nothing in the queue right now!`);
                            try {
                                client.distube.skip(message);
                                message.channel.send(`Skipped!`);
                            } catch (e) {
                                message.channel.send(`${e}`);
                            }

                        }else if(data.text == 'stop the music'){ 

                            const queue = client.distube.getQueue(message);
                            if (!queue) return message.channel.send(`There is nothing in the queue right now!`);
                            if (!queue.pause) {
                                client.distube.pause(message);
                                message.channel.send("Paused the song for you write ***.pause*** to resume!");
                            }
                            

                        }
                        else if(data.text == 'play the music'){ 

                            const queue = client.distube.getQueue(message);
                            if (!queue) return message.channel.send(`There is nothing in the queue right now!`);
                            if (queue.pause) {
                                client.distube.resume(message);
                                return message.channel.send("Resumed the song for you!");
                            } 

                        }        
                        else if(data.text == 'leave the channel'){
                            client.distube.stop(message);
                            message.channel.send(`***Sayonara!***`); 

                        }

                    }

                    stream.destroy();
                }).catch((err) => {
                    console.log(err);
                })
                
            } catch (e) { console.log('transcribe_witai 851:' + e); console.log(e) }
        }

        const  connection = await voiceChannel.join()
        .then(async connection => {

            console.log(`Joined ${voiceChannel.name}!\n\nREADY TO RECORD\n`);

            const receiver = connection.receiver;
            connection.on('speaking',async (user,speaking) => {

                if(speaking.bitfiel == 0 || user.bot){
                    return
                }
                console.log(`[bot] : I'm listening to ${user.username}`);
                const audioStream = receiver.createStream(user, { mode: 'pcm' , end: 'silence'});
                audioStream.on('error',  (e) => { 
                    console.log('audioStream: ' + e)
                });
                
                let buffer = [];
                audioStream.on('data', (data) => {
                    buffer.push(data);
                })

                audioStream.on('end', async () => {
                    buffer = Buffer.concat(buffer)
                    
                    const duration = buffer.length / 48000 / 4;
                    console.log("[bot] : duration: " + duration)
        
                    if (duration < 1.0 || duration > 5.0) {
                        console.log("[bot] : TOO SHORT / TOO LONG; SKIPPING")
                        return;
                    }

                    try{
                        
                        let new_buffer = await convert_audio(buffer);
                        await transcribe_witai(new_buffer);

                    }catch(e){
                        console.log('tmpraw rename: ' + e)
                    }
        
                })

            });
        }).catch(err => {throw err;});


    }
}