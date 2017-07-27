/*
 * utils.js - Important utility functions
 */

const fs = require('fs-extra');

let utils = {
	dir:`${process.env.HOME}/.dotswitcher`,
	save:(name)=>{
		if(!fs.existsSync(`${utils.dir}/configs/${name}`)){
			let type = utils.type(),
				files = utils.whitelist();
			fs.mkdirSync(`${utils.dir}/configs/${name}`);
			fs.readdirSync(process.env.HOME).forEach((e)=>{
				if(e.split('')[0] === '.' && e !== '.dotswitcher' && (type ? files.indexOf(e) > -1 : files.indexOf(e) === -1)){
					fs.copySync(`${process.env.HOME}/${e}`,`${utils.dir}/configs/${name}/${e}`);
				}
			});
		} else {
			return 1;
		}
		return 0;
	},
	load:(name)=>{
		if(fs.existsSync(`${utils.dir}/configs/${name}`)){
			fs.readdirSync(`${utils.dir}/configs/${name}`).forEach((e)=>{
				fs.copySync(`${utils.dir}/configs/${name}/${e}`,`${process.env.HOME}/${e}`);
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
