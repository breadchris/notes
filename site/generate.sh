#!/bin/sh
logseq-to-markdown -v -d -p -o content notes && hugo -d ../docs
