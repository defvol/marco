#!/bin/bash

set -e -u

usage() {
  echo "Usage: data.sh [-d directory] [-t directory] [-h]"
  echo
  echo "-d - Download administrative boundaries from INEGI into directory"
  echo "-t - Transform INEGI into GeoJSON."
  echo "-h - This help text."
  echo
}

parse_options() {
  set -- "$@"

  if [ "$#" -eq 0 ]; then
    usage
    exit 0
  fi

  while [ "$#" -ne 0 ]
  do
    case $1 in
      -d) echo "Downloading data from INEGI to $2 directory"
          mkdir -p $2
          cd $2
          download
          cd ..
          shift 1
      ;;
      -t) echo "Transforming data into GeoJSON"
          cd $2
          transform
          cd ..
          shift 1
      ;;
      -h) usage
          exit 0
      ;;
      ?*) echo "ERROR: Unknown option."
          usage
          exit 0
      ;;
    esac
    shift 1
  done
}

download() {
  wget -O - http://mapserver.inegi.org.mx/MGN/mge2014v6_2.zip > s.zip
  wget -O - http://mapserver.inegi.org.mx/MGN/mgm2014v6_2.zip > m.zip
  unzip s.zip
  unzip m.zip
}

transform() {
  rm -f states.json municipalities.json
  ogr2ogr -f GeoJSON states.json mge2015v6_2.shp -progress
  ogr2ogr -f GeoJSON municipalities.json mgm2015v6_2.shp -progress
}

parse_options "$@"

# vi: expandtab sw=2 ts=2
