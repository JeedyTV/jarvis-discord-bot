import tekore as tk
import json
from youtubesearchpython import VideosSearch

class Spotify:

    def __init__(self):
        
        client_id, client_secret, _ = tk.config_from_file("/bot/server/conf.ini",section='SPOTIFY')
        app_token = tk.request_client_token(client_id, client_secret)
        self.spotify = tk.Spotify(app_token)

    def query(self,*args):

        query_type = args[0]

        try:
            
            #playlist
            if query_type == 1:

                url = args[1]
                id_playlist = url.split("/")[-1]
                response = {}

                playlist = self.spotify.playlist(id_playlist)
                
                response['return_label'] = 'SUCCES'
                response['img'] = playlist.images[0].url
                response['name'] = playlist.name
                response['url'] = []

                for each in playlist.tracks.items:

                    videosSearch = VideosSearch('{} {} audio'.format(each.track.name,each.track.artists[0].name), limit = 1)
                    response['url'].append(videosSearch.result()['result'][0]['link'])
                
                return json.dumps(response)
            
            #album
            if query_type == 2 or query_type == 3:
                
                id_album = None
                
                #album with url
                if(query_type == 2):
                    url = args[1]
                    id_album = url.split("/")[-1]
                
                #album with out url
                if(query_type == 3):
                    album_name = args[1]
                    artiste_name = args[2]
                     
                    result = self.spotify.search('album:{} artist:{}'.format(album_name, artiste_name), types=('album',))
                   
                    try:
                        id_album = result[0].items[0].id
                    except IndexError:
                        return r'{"return_label": "FAILED" }'
                
                response = {}

                album = self.spotify.album(id_album)
                
                response['return_label'] = 'SUCCES'
                response['img'] = album.images[0].url
                response['name'] = album.name
                response['url'] = []

                for each in album.tracks.items:
                    videosSearch = VideosSearch('{} {} audio'.format(each.name,each.artists[0].name), limit = 1)
                    response['url'].append(videosSearch.result()['result'][0]['link'])
                
                return json.dumps(response)

        except Exception as inst:
            return r'{"return_label": "FAILED" }'