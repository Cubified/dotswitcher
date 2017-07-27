/*
 * views.js - The heart of the GUI
 */

const blessed = require('blessed'),
    dotswitcher = require('./utils.js');

let views = {
    mainMenu: () => { 
        let screen = blessed.screen({
            smartCSR: true
        });

        screen.title = 'dotswitcher';

        let box = blessed.box({
            parent: screen,
            width: '50%',
            height: '50%',
            bg: '#888888',
            left: 'center',
            top: 'center'
        });
        let hello = blessed.text({
            parent: box,
            left: 'center',
            top: 1,
            tags: true,
            bg: '#888888',
            content: '{center}dotswitcher v0.0.1-testing{/center}'
        });
        let optionsList = blessed.list({
            parent: box,
            mouse: true,
            keys: true,
            width: '50%',
            height: '50%',
            left: 'center',
            top: 'center',
            border: {
                type: 'line'
            },
            style: {
                selected: {
                    bg: 'blue'
                }
            }
        });
        optionsList.add('Save the current configuration');
        optionsList.add('Load a saved configuration');
        optionsList.add('------------------------------');
        optionsList.add('View blacklist/whitelist');
        optionsList.add('------------------------------');
        optionsList.add('Exit');

        optionsList.on('select', (data) => {
            switch (data.getContent()) {
                case 'Exit':
                    process.exit(0);
                    break;
                case 'Save the current configuration':
                    views.createNewConfig();
                    screen.destroy();
                    break;
                case 'Load a saved configuration':
                    views.listConfigs();
                    screen.destroy();
                    break;
                case 'View blacklist/whitelist':
                    views.editWhitelist();
                    screen.destroy();
                    break;
            }
        });

        optionsList.focus();

        screen.key(['escape', 'q', 'C-c'], (ch, key) => {
            return process.exit(0);
        });

        screen.render();
    },
    createNewConfig: () => {
		let screen = blessed.screen({
            smartCSR: true
        });

        screen.title = 'dotswitcher';

        let form = blessed.form({
            parent: screen,
            keys: true,
            left: 'center',
            top: 'center',
            width: '50%',
            height: '50%',
            bg: '#888888'
        });
        let box = blessed.box({
            parent: form,
            width: '35%',
            height: '25%',
            left: 'center',
            top: 'center',
            tags: 'true',
            border: {
                type: 'line'
            },
            content: '{center}Create a new dotfile configuration:{/center}'
        });
        form.append(box);
        let submit = blessed.button({
            parent: box,
            mouse: true,
            keys: true,
            shrink: true,
            padding: {
                left: 1,
                right: 1
            },
            left: 'center',
            top: 4,
            name: 'submit',
            content: 'submit',
            style: {
                bg: '#555555',
                focus: {
                    bg: '#999999'
                },
                hover: {
                    bg: '#999999'
                }
            }
        });
        let input = blessed.textbox({
            parent: box,
            mouse: true,
            keys: true,
            shrink: true,
            padding: {
                left: 1,
                right: 1
            },
            top: 2,
            width: '50%',
            left: 'center',
            name: 'input',
            style: {
                bg: '#555555'
            }
        });

        submit.on('press', () => {
            form.submit();
        });
        input.on('focus', () => {
            input.readInput();
        });
        input.on('press', () => {
            input.focus();
        });
        input.key('enter', () => {
            form.submit();
        });

        input.focus();

        form.on('submit', (data) => {
            if (input.getValue().trim() !== '') {
                box.tags = true;
                let val = dotswitcher.save(input.getValue().trim());
                switch (val) {
                    case 0:
                        box.setContent(`{center}Saved dotfile configuration as "${input.getValue().trim()}"{/center}`);
                        break;
                    case 1:
                        box.setContent(`{center}A dotfile configuration already exists with this name{/center}`);
                        break;
                }
                screen.render();
            } else {
                box.setContent(`{center}The dotfile configuration name is invalid{/center}`);
                screen.render();
            }
        });

        screen.key(['escape', 'q', 'C-c'], (ch, key) => {
            views.mainMenu();
            screen.destroy();
        });

        screen.render();
    },
	listConfigs: () => {
        let screen = blessed.screen({
            smartCSR: true
        });

        screen.title = 'dotswitcher';

        let box = blessed.box({
            parent: screen,
            width: '50%',
            height: '50%',
            left: 'center',
            top: 'center',
            style: {
                bg: '#888888'
            }
        });

        let hello = blessed.text({
            parent: box,
            left: 'center',
            top: 1,
            tags: true,
            bg: '#888888',
            content: '{center}dotswitcher v0.0.1-testing{/center}'
        });
        let optionsList = blessed.list({
            parent: box,
            mouse: true,
            keys: true,
            width: '50%',
            height: '50%',
            left: 'center',
            top: 'center',
            border: {
                type: 'line'
            },
            style: {
                selected: {
                    bg: 'blue'
                }
            }
        });
        dotswitcher.list().forEach((e) => {
            optionsList.add(e);
        });
        optionsList.add('--------------------');
        optionsList.add('Return to main menu');

        optionsList.on('select', (data) => {
            switch (data.getContent()) {
                case 'Return to main menu':
                    views.mainMenu();
                    screen.destroy();
                    break;
				case '--------------------':
					break;
				default:
					if(!dotswitcher.load(data.getContent())){
						hello.setContent('{center}Done!{/center}');
					} else {
						hello.setContent('{center}Failed to restore configuration.{/center}');
					}
					break;
            }
        });

        optionsList.focus();

        screen.key(['escape', 'q', 'C-c'], (ch, key) => {
            views.mainMenu();
            screen.destroy();
        });

        screen.render();
    },
    editWhitelist: () => {
        let screen = blessed.screen({
            smartCSR: true
        });

        screen.title = 'dotswitcher';

        let box = blessed.box({
            parent: screen,
            width: '50%',
            height: '50%',
            left: 'center',
            top: 'center',
            style: {
                bg: '#888888'
            }
        });
        screen.append(box);
        let hello = blessed.text({
            parent: box,
            left: 'center',
            top: 1,
            tags: true,
            bg: '#888888',
            content: `{center}${dotswitcher.type()?'Whitelist':'Blacklist'} (${dotswitcher.dir}/list){/center}`
        });
        let whitelist = blessed.list({
            parent: box,
            mouse: true,
            keys: true,
            width: '50%',
            height: '50%',
            left: 'center',
            top: 'center',
            border: {
                type: 'line'
            },
            style: {
                selected: {
                    bg: 'blue'
                }
            }
        });
		for(let key in dotswitcher.whitelist()){
			whitelist.add(dotswitcher.whitelist()[key]);
		}
        whitelist.add('--------------------');
		whitelist.add('Return to main menu');

        whitelist.on('select', (data) => {
            switch (data.getContent()) {
                case 'Return to main menu':
                    views.mainMenu();
                    screen.destroy();
                    break;
            }
        });

		whitelist.focus();

        screen.key(['escape', 'q', 'C-c'], (ch, key) => {
            views.mainMenu();
            screen.destroy();
        });

        screen.render();
    }
};

module.exports = views;

