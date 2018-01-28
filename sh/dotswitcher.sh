#!/bin/bash

####################
#  dotswitcher.sh  #
#    01/27/2018    #
####################

VER="0.0.1"

OPTIND=1

log() {
	if [[ "a$2" = "a" ]]; then
		printf "=> $1\n"
	else
		prepend=""
		for((i=0;i<$2;i++)){
			prepend="$prepend="
		}
		printf "$prepend> $1\n"
	fi
}

help() {
	printf "Usage: dotswitcher.sh [options]\n\
  -s, --save <config>		save the current configuration\n\
  -l, --load <config>		load a saved configuration\n\
  -v, --view			view the blacklist/whitelist\n\
  -c, --configs			list saved configurations\n\
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
		log "(Config directory created at ~/.dotswitcher)" 2
	fi
}

save() {
	if [[ -f "~/.dotswitcher/configs/$1.tgz" ]]; then
		log "Error: a config with this name already exists" 2
		exit
	fi
	LIST=`jq '.files' ~/.dotswitcher/list -r -M | sed 's/\"//g' | sed 's/\[//' | sed 's/\]//' | xargs | sed 's/, / /g'`
	cd ~
	tar czf ".dotswitcher/configs/$1.tgz" $LIST
}

load() {
	cd ~
	if [[ ! -f ".dotswitcher/configs/$1.tgz" ]]; then
		log "Error: file \"$1.tgz\" does not exist in ~/.dotswitcher/configs" 2
		exit
	fi
	tar xzf ".dotswitcher/configs/$1.tgz"
}

list() {
	if [[ $(jq -r '.type' ~/.dotswitcher/list) = "whitelist" ]]; then
		log "Whitelist:" 2
	else
		log "Blacklist:" 2
	fi
	data=`jq '.files' ~/.dotswitcher/list -r -M | sed 's/\"//g' | sed 's/\[//' | sed 's/\]//' | xargs | sed 's/, /\n===> /g'`
	log "$data" 3
}

configs() {
	cd ~/.dotswitcher/configs
	log "Saved configurations:" 2
	for f in *.tgz; do
		log "${f%.tgz}" 3
	done
}

setup

log "dotswitcher v$VER"

OPTIONS=s:l:vh
LONGOPTIONS=save:,load:,view,help

if [[ "$1" = "" ]]; then
	help
fi

OPTIONS=`getopt -o "s:l:vch" -l "save:,load:,view,configs,help" -n "dotswitcher" -- "$@"`

while true; do
	case "$1" in
		-s | --save)
			if [[ "$2" = "" ]]; then
				break
			else
				log "Saving config with name \"$2\"..." 2
				save $2
				log "Done!" 2
				shift 2
			fi
			;;
		-l | --load)
			if [[ "$2" = "" ]]; then
				break
			else
				log "Loading config with name \"$2\"..." 2
				load $2
				log "Done!" 2
				shift 2
			fi
			;;
		-v | --view)
			list
			shift
			;;
		-c | --configs)
			configs
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
