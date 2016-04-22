#!/bin/bash

set -e -u

usage() {
  echo "Usage: data.sh [-d directory] [-h]"
  echo
  echo "-d - Download administrative boundaries from INEGI into directory"
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

parse_options "$@"

# vi: expandtab sw=2 ts=2
