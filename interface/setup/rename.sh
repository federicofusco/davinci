#!/bin/bash
gzip --best --recursive --name *
find . -name '*.gz' -type f | while read NAME ; do mv "${NAME}" "${NAME%.gz}" ; done
