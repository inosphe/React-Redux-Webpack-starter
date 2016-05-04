#!/bin/bash

TMUX="tmux"
MONGODB_SRC="/Users/inosphe/Documents/development/mongodb-osx-x86_64-3.2.1/bin"
MONGODB_DATA_SRC="./data/mongo/"

$TMUX new \; \
  split-window -h \; \
  split-window -v \; \
  split-window -v \; \
  select-pane -t 0 \; \
    split-window -v \; \
      select-pane -t 0 \; \
        send-keys "nodemon ./index.js" Enter \; \
      select-pane -t 1 \; \
        send-keys "$MONGODB_SRC/mongo" Enter \; \
  select-pane -t 2 \; \
    send-keys "git status" Enter \; \
  select-pane -t 3 \; \
    send-keys "$MONGODB_SRC/mongod --dbpath $MONGODB_DATA_SRC " Enter \; \
  select-pane -t 4 \; \
    send-keys "npm run webpack" Enter \; \
    