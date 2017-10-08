#!/bin/bash

TMUX="tmux"

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
    send-keys "./run_mongo.sh" Enter \; \
  select-pane -t 4 \; \
    send-keys "npm run webpack" Enter \; \
    