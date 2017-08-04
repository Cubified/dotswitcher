/*
 * utils.js - Important utility functions
 */

const fs = require('fs-extra'),
    tar = require('tar');

let utils = {
    dir: `${process.env.HOME}/.dotswitcher`,
    readRecursive: (directory, useList) => {
        const type = utils.type(),
            files = utils.whitelist();

        let tmp = fs.readdirSync(directory),
            out = [];
        tmp.forEach((e) => {
            try {
                if ((useList ? (e.split('')[0] === '.' && e !== '.dotswitcher' && (type ? files.indexOf(e) > -1 : files.indexOf(e) === -1)) : true)) {
                    if (fs.statSync(`${directory}/${e}`).isDirectory()) {
                        out.push({
                            name: e,
                            type: 'dir',
                            files: utils.readRecursive(`${directory}/${e}`, false)
                        });
                    } else {
                        out.push({
                            name: e,
                            type: 'file'
                        });
                    }
                }
            } catch (e) { /* Don't have permission, ignoring */ }
        });
        return out;
    },
    relativeToAbsolute: (arr, parent, o) => {
        const type = utils.type(),
            files = utils.whitelist();
        let out = [];
        arr.forEach((e) => {
            if (type ? files.indexOf(e.name) > -1 : files.indexOf(e.name) === -1) {
                if (e.type === 'file') {
                    if (o) {
                        o.push(`${parent}/${e.name}`);
                    } else {
                        out.push(`${parent}/${e.name}`);
                    }
                } else {
                    utils.relativeToAbsolute(e.files, `${parent}/${e.name}`, o || out);
                }
            }
        });
        return out;
    },
    save: (name) => {
        if (!fs.existsSync(`${utils.dir}/configs/${name}.tgz`)) {
            let type = utils.type(),
                files = utils.whitelist(),
                includes = utils.relativeToAbsolute(utils.readRecursive(process.env.HOME, true), process.env.HOME);
            tar.c({
                gzip: true,
                sync: true,
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
                cwd: `${process.env.HOME}`,
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

