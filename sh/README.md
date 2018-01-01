## dotswitcher.sh v0.0.1

dotswitcher rewritten in bash

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
	> ./path/to/dotswitcher.sh -l "MyConfig"

### Importing Dotfiles from an External Source

As with syncing functionality, dotswitcher does not natively support acquiring dotfiles from a remote location (such as another user's git repo), but it is very easy to do yourself:

    > git clone "https://github.com/AnotherUser/dotfiles" ~/.dotswitcher/configs/AnotherUser
	> tar -czf ~/.dotswitcher/configs/AnotherUser.tgz ~/.dotswitcher/configs/AnotherUser
	> rm -rf ~/.dotswitcher/configs/AnotherUser

### License

See [LICENSE](https://github.com/Cubified/dotswitcher/blob/master/LICENSE)
