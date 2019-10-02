#!/bin/sh

if [ "$1" = "--help" ] || [ $# -eq 1 ] || [ $# -gt 3 ] ; then
    echo "usage: startManCenter.sh"
    echo "usage: startManCenter.sh [port] [path]"
    echo "usage: startManCenter.sh [port] [path] [classpath]"
    exit;
fi

mkdir -p "`dirname $0`/work"

if [ $# -eq 3 ] ; then
    java -cp "mancenter-3.8.4.war:$3" Launcher "$1" "$2"
elif [ $# -eq 2 ] ; then
	java -cp mancenter-3.8.4.war Launcher "$1" "$2"
else 
	java -cp mancenter-3.8.4.war Launcher
fi