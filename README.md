## dotswitcher v0.0.1-testing

A simple terminal-based GUI to manage and switch between configuration files on one machine.

### Acquiring and setting up the code

    > git clone https://github.com/Cubified/dotswitcher
    > npm install && npm start

### Screenshot

![Main Menu](https://github.com/Cubified/dotswitcher/blob/master/MainMenu.png)

### Packaging

Dotswitcher can be packaged into a single executable quickly and easily using [pkg](https://github.com/zeit/pkg).

    > npm install -g pkg
    > cd dotswitcher/
    > mkdir bin/
    > pkg . --output bin/dotswitcher

### Planned Features

This is a project I put together in less than a day, so there's still some things I'd like to add, such as:

- Regex-based blacklisting/whitelisting
- A CLI
- Compression of saved configurations

### License

See [LICENSE](https://github.com/Cubified/dotswitcher/blob/master/LICENSE)
