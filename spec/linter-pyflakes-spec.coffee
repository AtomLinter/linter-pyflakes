describe 'The pyflakes provider for Linter', ->
  lint = require('../lib/init').provideLinter().lint

  beforeEach ->
    atom.workspace.destroyActivePaneItem()
    waitsForPromise ->
      return atom.packages.activatePackage('linter-pyflakes')

  it 'should be in the packages list', ->
    return expect(atom.packages.isPackageLoaded('linter-pyflakes')).toBe true

  it 'should be an active package', ->
    return expect(atom.packages.isPackageActive('linter-pyflakes')).toBe true

  it 'finds nothing wrong with valid files', ->
    waitsForPromise ->
      return atom.workspace.open(__dirname + '/fixtures/valid.py').then (editor) ->
        return lint(editor).then (messages) ->
          expect(messages.length).toEqual 0

  it 'finds something wrong with invalid files', ->
    waitsForPromise ->
      return atom.workspace.open(__dirname + '/fixtures/invalid.py').then (editor) ->
        return lint(editor).then (messages) ->
          expect(messages.length).toEqual 2
          expect(messages[0].range[0][0]).toEqual 0
          expect(messages[0].range[0][1]).toEqual 0
          expect(messages[0].range[1][0]).toEqual 0
          expect(messages[0].range[1][1]).toEqual 9
          expect(messages[1].range[0][0]).toEqual 4
          expect(messages[1].range[0][1]).toEqual 4
          expect(messages[1].range[1][0]).toEqual 4
          expect(messages[1].range[1][1]).toEqual 22

  it 'finds something wrong with invalid syntax', ->
    waitsForPromise ->
      return atom.workspace.open(__dirname + '/fixtures/invalid_syntax.py').then (editor) ->
        return lint(editor).then (messages) ->
          expect(messages.length).toEqual 1
          expect(messages[0].range[0][0]).toEqual 0
          expect(messages[0].range[0][1]).toEqual 7
          expect(messages[0].range[1][0]).toEqual 0
          expect(messages[0].range[1][1]).toEqual 7