/*
 * utils.js - Important utility functions
 */

const fs = require('fs-extra'),
    tar = require('tar');

let utils = {
    dir: `${process.env.HOME}/.dotswitcher`,
    readRecursive: (directory,depth) => {
        const type = utils.type(),
            files = utils.whitelist();

		if(depth < 3){
        	let tmp = fs.readdirSync(directory),
				out = [];
        	tmp.forEach((e) => {
        	    try {
        	        if (fs.statSync(`${directory}/${e}`).isDirectory()) {
        	            out.push({
        	                name: e,
        	                type: 'dir',
        	                files: utils.readRecursive(`${directory}/${e}`,depth+1)
        	            });
        	        } else {
        	            out.push({
        	                name: e,
        	                type: 'file'
        	            });
        	        }
        	    } catch (e) { /* Don't have permission, ignoring */ }
    	    });
	        return out;
		}
		return [];
    },
    relativeToAbsolute: (arr, parent, o, append) => {
        const type = utils.type(),
            files = utils.whitelist();
        let out = [];
        arr.forEach((e) => {
            if (e.type === 'file') {
                if (o) {
                    o.push(append ? `${parent}/${e.name}` : e.name);
                } else {
                    out.push(append ? `${parent}/${e.name}` : e.name);
                }
            } else {
                utils.relativeToAbsolute(e.files, append ? `${parent}/${e.name}` : e.name, o || out, true);
            }
        });
        return out;
    },
    determineIncludes: () => {
        const type = utils.type(),
            list = utils.whitelist();

        let tree = utils.readRecursive(process.env.HOME,0),
            files = utils.relativeToAbsolute(tree, process.env.HOME),
            includes = [];
        files.forEach((e) => {
            list.forEach((el) => {
                if (e.split('')[0] === '.' && e.indexOf('.dotswitcher') === -1 && (type ? e.indexOf(el) > -1 : e.indexOf(el) === -1)) {
                    includes.push(e);
                }
            });
        });
        return includes;
    },
    save: (name) => {
        if (!fs.existsSync(`${utils.dir}/configs/${name}.tgz`)) {
            let includes = utils.determineIncludes();
            tar.c({
                gzip: true,
                sync: true,
                cwd: process.env.HOME,
                file: `${utils.dir}/configs/${name}.tgz`
            }, includes);
            return 0;
        } else {
            return 1;
        }
        return 0;
    },
    load: (name) => {
        if (fs.existsSync(`${utils.dir}/configs/${name}.tgz`)) {
            tar.x({
                cwd: process.env.HOME,
                file: `${utils.dir}/configs/${name}.tgz`
            });
        } else {
            return 1;
        }
        return 0;
    },
    list: () => {
        return fs.readdirSync(`${utils.dir}/configs`);
    },
    type: () => {
        return JSON.parse(fs.readFileSync(`${utils.dir}/list`).toString()).type === 'whitelist';
    },
    whitelist: () => {
        return JSON.parse(fs.readFileSync(`${utils.dir}/list`).toString()).files;
    }
};

module.exports = utils;

