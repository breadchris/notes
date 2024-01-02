#!/bin/sh
./node_modules/.bin/logseq-to-markdown -v -d -p -o content notes && hugo -d ../docs
