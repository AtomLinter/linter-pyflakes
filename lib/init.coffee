module.exports =
  config:
    pyflakesExecutablePath:
      type: 'string'
      default: ''

  activate: ->
    console.log 'activate linter-pyflakes'
