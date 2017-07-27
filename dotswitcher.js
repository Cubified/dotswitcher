/*
 * dotswitcher.js - Preparation and initialization
 */

const blessed = require('blessed');
const views = require('./views.js');
const utils = require('./utils.js');
const fs = require('fs');

if(!fs.existsSync(utils.dir)){
	fs.mkdirSync(utils.dir);
}
if(!fs.existsSync(`${utils.dir}/configs`)){
	fs.mkdirSync(`${utils.dir}/configs`);
}
if(!fs.existsSync(`${utils.dir}/list`)){
	fs.writeFileSync(`${utils.dir}/list`,fs.readFileSync(`${utils.dir}/list.default`).toString());
}

views.mainMenu();
