const fs = require('fs');
const utils = require('../utils.js');

if(!fs.existsSync(utils.dir)){
	fs.mkdirSync(utils.dir);
}
if(!fs.existsSync(`${utils.dir}/configs`)){
	fs.mkdirSync(`${utils.dir}/configs`);
}
if(!fs.existsSync(`${utils.dir}/list`)){
	fs.writeFileSync(`${utils.dir}/list`,fs.readFileSync(`list.default`).toString());
}

let program = require('commander');

program
	.version('0.5.0')
	.option('-s, --save [name]', 'save the current dotfile configuration')
	.option('-l, --load [name]', 'load a saved dotfile configuration')
	.option('-v, --view', 'view the whitelist/blacklist')
	.parse(process.argv);

if(!program.save && !program.load && !program.view){
	program.help();
}

if(typeof program.save === 'string'){
	utils.save(program.save);
} else if(!program.save === undefined){
	program.help();
}

if(typeof program.load === 'string'){
	utils.load(program.load);
} else if(!program.load === undefined){
	program.help();
}

if(program.view){
	console.log(utils.type?'Whitelist:':'Blacklist:');
	console.log(utils.whitelist().join('\n'));
}
