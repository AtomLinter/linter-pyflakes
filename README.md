# linter-pyflakes

This linter plugin for [Linter][] provides an interface to
[pyflakes](https://launchpad.net/pyflakes). It will be used with python files.

## Installation

Linter package must be installed in order to use this plugin. If Linter is not
installed, please follow the instructions [here][linter].

### pyflakes installation

Before using this plugin, you must ensure that `pyflakes` is installed on your
system. To install `pyflakes`, do the following:

1.  Install [pyflakes](https://launchpad.net/pyflakes) by typing the following
    in a terminal:

    ```ShellSession
    pip install pyflakes
    ```

Now you can proceed to install the linter-pyflakes plugin.

### Plugin installation

```ShellSession
apm install linter-pyflakes
```

## Settings

You can configure linter-pyflakes by editing `~/.atom/config.cson`
(choose Open Your Config in Atom menu):

```coffeescript
"linter-pyflakes":
  "pyflakesExecutablePath": null #scss-lint path. run 'which scss-lint' to find the path
```

[linter]: https://github.com/AtomLinter/Linter "Linter"
