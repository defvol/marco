#!/bin/bash

set -e -u

echo "Downloading administrative boundaries from INEGI site"
mkdir -p data
cd data
wget -O - http://mapserver.inegi.org.mx/MGN/mge2014v6_2.zip > s.zip
wget -O - http://mapserver.inegi.org.mx/MGN/mgm2014v6_2.zip > m.zip
unzip s.zip
unzip m.zip
cd ..
