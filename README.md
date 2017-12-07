# Component Generator

CLI to create a new components: [Angular Front-End for ProtonMail](https://github.com/ProtonMail/Angular).

## Requirements

- node.js >= **v8**

## Usage with custom alias

To test you can add an alias to have a better command.

1. Clone and cd into the directory
2. `$ npm install`
3. Add alias to your terminal `$ echo "alias appComponent='$(pwd)/index.js'" >> ~/.bashrc`
> With MacOS `~/.bashrc` ~= `~/.zshrc`
4. Run `$ source ~/.zshrc` or `$ source ~/.bashrc` to load the alias

```sh
$ appComponent
```

> It's possible to define the component's name via an argument `$ appComponent <name:String>`


## Usage without an alias

```sh
$ .<path-diretory>/index.js
```
