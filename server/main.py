import socket
import threading
import configparser as cf
import re
from spotify_api import Spotify
import sys


def handle_query(query):
	
	size = len(query.split(' '))

	p_pattern = r"https://open.spotify.com/playlist/([0-9a-zA-Z_?=])"
	a_pattern = r"https://open.spotify.com/album/([0-9a-zA-Z_?=])"
	
	if "!" in query and len(query.split('!')) == 3:
		album_name = query.split('!')[1]
		artiste_name = query.split('!')[2]
		s = Spotify()
		return s.query(3,album_name,artiste_name)
	
	elif size == 1 and ( re.match(p_pattern, query) or re.match(a_pattern, query)) :
		
		url = query

		if 'playlist' in url:
			
			s = Spotify()
			return s.query(1,url)
			
		if 'album' in url:

			s = Spotify()
			return s.query(2,url)

	elif ('spotify' not in query) or ('!' not in query) :
		s = Spotify()
		return s.query(4,query)
	
	else:
		return r'{"return_label": "FAILED" }'

def main():
	print(handle_query(sys.argv[1]))

if __name__ == "__main__":
    main()