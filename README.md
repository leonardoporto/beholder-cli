# Beholder

Ferramenta para listar os pull requests abertos.

## Instalação

```sh
$ npm i beholder-cli -g
```

## Configuração

Criar um arquivo .beholder em sua home:

```sh
$ touch ~/.beholder
```

Conteúdo do arquivo

```
GITHUB_TOKEN=
GITHUB_ORGANIZATION=
```

| atributo            | descrição                                                                                                     |
| ------------------- | ------------------------------------------------------------------------------------------------------------- |
| GITHUB_TOKEN        | deverá ser gerado em [Personal access token](https://github.com/settings/tokens) somente com permissão _repo_ |
| GITHUB_ORGANIZATION | indicará qual organização, que você tem acesso, você quer monitorar.                                          |

## Como utilizar

Para listar os PRs:

```sh
$ beholder
```

Mais opções:

```sh
$ beholder --help
Usage: beholder [options]

Options:
  -V, --version    output the version number
  -o, --org <org>  organization name (default: "<GITHUB_ORGANIZATION>")
  -b, --bot        list pr by bot (default: false)
  -w, --wip        list pr with status work in progress (default: false)
  -d, --debug      enable debug (default: false)
  -h, --help       display help for command
```
