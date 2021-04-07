#!/bin/bash

#maybee change the port if is not working

docker build -t bot_discord  .
docker run -p 3000:3000 bot_discord
