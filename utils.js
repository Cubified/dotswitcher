/*
 * utils.js - Important utility functions
 */

const fs = require('fs-extra'),
	tar = require('tar');

let utils = {
	dir:`${process.env.HOME}/.dotswitcher`,
	save:(name)=>{
		if(!fs.existsSync(`${utils.dir}/configs/${name}.tgz`)){
			let type = utils.type(),
				files = utils.whitelist(),
				includes = [];
			fs.readdirSync(process.env.HOME).forEach((e)=>{
				if(e.split('')[0] === '.' && e !== '.dotswitcher' && (type ? files.indexOf(e) > -1 : files.indexOf(e) === -1)){
					includes.push(`${process.env.HOME}/${e}`);
				}
			});
			tar.c({gzip:true,sync:true,file:`${utils.dir}/configs/${name}.tgz`},includes);
			return 0;
		} else {
			return 1;
		}
		return 0;
	},
	load:(name)=>{
		if(fs.existsSync(`${utils.dir}/configs/${name}.tgz`)){
			tar.x({
				cwd:`${process.env.HOME}`,
				file:`${utils.dir}/configs/${name}.tgz`
			});
		} else {
			return 1;
		}
		return 0;
	},
	list:()=>{
		return fs.readdirSync(`${utils.dir}/configs`);
	},
	type:()=>{
		return JSON.parse(fs.readFileSync(`${utils.dir}/list`).toString()).type==='whitelist';
	},
	whitelist:()=>{
		return JSON.parse(fs.readFileSync(`${utils.dir}/list`).toString()).files;
	}
};

module.exports = utils;
