#!/bin/bash

####################
#  dotswitcher.sh  #
#    12/31/2017    #
####################

VER="0.0.1"

OPTIND=1

log() {
	printf "=> $1\n"
}

help() {
	printf "Usage: dotswitcher.sh [options]\n\
  -s, --save <config>		save the current configuration\n\
  -l, --load <config>		load a saved configuration\n\
  -v, --view			view the blacklist/whitelist\n\
  -h, --help			display this help and exit\n"
}

setup() {
	if [[ (! -d ~/.dotswitcher) && (! -d ~/.dotswitcher/configs) && (! -f ~/.dotswitcher/list) ]]; then
		mkdir -p ~/.dotswitcher/configs
		printf "{\n\
	\"_info\":\"dotswitcher v$VER\",\n\
	\"_type\":\"whitelist or blacklist\",\n\
	\"type\":\"whitelist\",\n\
	\"_files\":\"list of dotfiles to include or exclude (no trailing \~ or /home/username)\",\n\
	\"files\":[\n\
		\".profile\"\n\
	]\n\
	\"_required\":\"the only required keys are 'type' and 'files'\"\n\
}" > ~/.dotswitcher/list
		log "(Config directory created at ~/.dotswitcher)"
	fi
}

save() {
	if [[ -f "~/.dotswitcher/configs/$1.tgz" ]]; then
		log "Error: a config with this name already exists"
		exit
	fi
	LIST=`jq '.files' ~/.dotswitcher/list -r -M | sed 's/\"//g' | sed 's/\[//' | sed 's/\]//' | xargs | sed 's/, / /g'`
	cd ~
	tar czf ".dotswitcher/configs/$1.tgz" $LIST
}

load() {
	if [[ ! -f "~/.dotswitcher/configs/$1.tgz" ]]; then
		log "Error: file \"$1.tgz\" does not exist in ~/.dotswitcher/configs"
		exit
	fi
	cd ~
	tar xzf ".dotswitcher/configs/$1.tgz" .
}

list() {
	if [[ $(jq -r '.type' ~/.dotswitcher/list) = "whitelist" ]]; then
		log "Whitelist:"
	else
		log "Blacklist:"
	fi
	jq '.files' ~/.dotswitcher/list -r -M | sed 's/\"//g' | sed 's/\[//' | sed 's/\]//' | xargs | sed 's/, /\n/g'
}

setup

log "dotswitcher v$VER"

OPTIONS=s:l:vh
LONGOPTIONS=save:,load:,view,help

if [[ "$1" = "" ]]; then
	help
fi

OPTIONS=`getopt -o "s:l:vh" -l "save:,load:,view,help" -n "dotswitcher" -- "$@"`

while true; do
	case "$1" in
		-s | --save)
			if [[ "$2" = "" ]]; then
				break
			else
				log "Saving config with name \"$2\"..."
				save $2
				log "Done!"
				shift 2
			fi
			;;
		-l | --load)
			if [[ "$2" = "" ]]; then
				break
			else
				log "Loading config with name \"$2\"..."
				load $2
				log "Done!"
				shift 2
			fi
			;;
		-v | --view)
			list
			shift
			;;
		-h | --help)
			help
			shift
			;;
		*)
			break
			;;
	esac
done
shift $((OPTIND-1))
[[ "$1" = "--" ]] && shift
