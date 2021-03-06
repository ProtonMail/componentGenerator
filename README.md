# Component Generator

CLI to create new components: [Angular Front-End for ProtonMail](https://github.com/ProtonMail/WebClient).

## Requirements

- node.js >= **v8**

## How to install

1. Clone and cd into the directory
2. `$ npm install`
3. Add alias to your terminal `$ npm run bind:bash or bind:zsh`
> With MacOS default setup if you didn't move to bash should be zsh
4. Run `$ source ~/.zshrc` or `$ source ~/.bashrc` to load the alias

```sh
$ appComponent
```

> It's possible to define the component's name via an argument `$ appComponent <name:String>`

### Create a test

You must run the command with the flag `--test`


## Usage without an alias

```sh
$ .<path-diretory>/index.js
```

!['demo'](doc/output.gif)
