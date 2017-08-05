## dotswitcher v0.0.1-testing

A simple terminal-based GUI to manage and switch between multiple sets of configuration files on one machine.

### Acquiring and Running

    > git clone https://github.com/Cubified/dotswitcher
	> cd dotswitcher/
    > npm install && npm start

### Screenshot

![Main Menu](https://github.com/Cubified/dotswitcher/blob/master/MainMenu.png)

### Packaging

Dotswitcher can be packaged into a single executable quickly and easily using [pkg](https://github.com/zeit/pkg).

    > npm install -g pkg
    > cd dotswitcher/
    > npm run build

### Planned Features

This is a project I put together in less than a day, so there's still some things I'd like to add, such as:

- Fix whitelist/blacklist functionality, as it's somewhat useless and broken right now
- Regex-based blacklisting/whitelisting
- A CLI (added!)
- Compression of saved configurations (added!)

### Syncing Across Multiple Systems

While dotswitcher does not support syncing natively, it is extremely easy to do this yourself with a git repo.

    > cd ~/.dotswitcher
	> git init
	> git add .
	> git commit -am "Add dotswitcher files"
	> git remote add origin "https://github.com/YourUsername/MyDotfiles"
	> git remote -v
	> git push origin master

From a second computer with dotswitcher already configured:

    > git clone "https://github.com/YourUsername/MyDotfiles" ~/.dotswitcher
	> ./path/to/dotswitcher

### Importing Dotfiles from an External Source

As with syncing functionality, dotswitcher does not natively support acquiring dotfiles from a remote location (such as another user's git repo), but it is very easy to do yourself:

    > git clone "https://github.com/AnotherUser/dotfiles" ~/.dotswitcher/configs/AnotherUser
	> tar -cf ~/.dotswitcher/configs/AnotherUser.tgz ~/.dotswitcher/configs/AnotherUser
	> rm -rf ~/.dotswitcher/configs/AnotherUser

### License

See [LICENSE](https://github.com/Cubified/dotswitcher/blob/master/LICENSE)
