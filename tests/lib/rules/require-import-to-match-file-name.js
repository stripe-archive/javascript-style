var assert = require('chai').assert;
var JSCS = require('jscs');
var RequireImportToMatchFileName = require('../../../lib/rules/require-import-to-match-file-name');

describe('require-import-to-watch-file-name', function() {
  var checker;
  before(function() {
    checker = new JSCS();
    checker.configure({
      additionalRules: [new RequireImportToMatchFileName()],
      requireImportToMatchFileName: {
        allow: [],
        requireSuffix: {
        }
      },
    });
  });

  it('works on a correctly named default import', function() {
    assert(checker.checkString('import FooBar from \'foo-bar\';').isEmpty());
    assert(checker.checkString('import fooBar from \'foo-bar\';').isEmpty());
  });

  it('shows valid names for an incorrect import', function() {
    var errorList = checker.checkString('import asdf from \'foo-bar\';').getErrorList();
    assert.equal(errorList.length, 1);
    assert.match(errorList[0].message, /accepted name\(s\) are: fooBar, FooBar/);
  });

  it('reports an error for an incorrectly named ipmort', function() {
    assert(checker.checkString('import asdf from \'foo-bar\';').getErrorList().length > 0);
  });

  it('works with non-default imports', function() {
    assert(checker.checkString('import {anything} from \'foo-bar\';').getErrorList());
  });

  it('works with more whitespace', function() {
    assert(checker.checkString('  import  FooBar  from  \'foo-bar\'  ;').isEmpty());
  });

  it('works with multiple correctly named imports', function() {
    var source =
      'import FooBar from \'foo-bar\';\n' +
      'import BooFar from \'boo-far\';';
    assert(checker.checkString(source).isEmpty());
  });

  it('reports errors with multiple imports', function() {
    var source =
      'import a from \'b\';\n' +
      'import c from \'d\';';
    assert.equal(checker.checkString(source).getErrorList().length, 2);
  });
});
