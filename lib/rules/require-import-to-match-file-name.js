/**
 * Requires that naming of "default" ES6 imports matches the file name.
 * This does not affect imports that are modules.
 *
 * Type: `Boolean`
 * Values: `true`, `"allow": ["$", "_" ... ], "requireSuffix": {"mixins": "Mixin"}`
 *
 * requireSuffix allows you to specify a mapping of folder name to a required suffix
 * for the variable name.
 *
 * #### Example
 *
 * ```js
 * "requireImportToMatchFileName": true
 * ```
 *
 * OR
 *
 * ```js
 * "requireImportToMatchFileName": {
 *   "allow": ["$", "_", "DS"]
 * }
 * ```
 *
 * ##### Valid with "allows": ['DS', '_']
 *
 * ```js
 * import someHelper from '../helpers/some-helper';
 * import someOtherHelper from './some-other-helper';
 * import FooComponent from './components/foo-component';
 *
 * import {someNonDefaultHelper} from '../helpers/some-helper';
 * import DS from 'ember-data';
 * import _ from 'lodash';
 * ```
 *
 * ##### Invalid
 *
 * ```js
 * import some_helper from '../helpers/some-helper';
 * import foocomponent from './components/foo-component';
 * import FooComponent from './components/foo-bar-component';
 * ```
 *
 * ##### Valid with "requireSuffix": {"mixins": "Mixin"}
 *
 * ```js
 * import CustomRouteMixin from './mixins/custom-route';
 * import CustomRoute from './custom-route';
 * import OtherCustomRouteMixin from '../foo/mixins/other-custom-route';
 * ```
 *
 * ##### Invalid with "requireSuffix": {"mixins": "Mixin"}
 *
 * ```js
 * import CustomRoute from './mixins/custom-route';
 * import CustomRouteMixin from './custom-route';
 * ```
 */

var assert = require('assert');
var IMPORT_TOKEN = 'import';
var getAcceptedNamesForFilename = require('../get-accepted-names-for-file-name');

function Rule() {};

Rule.prototype = {
  getOptionName: function() {
    return 'requireImportToMatchFileName';
  },

  configure: function(options) {
    assert(options === true || typeof options === 'object',
      'requireImportToMatchFileName rule requires `true` or object value.');
    this._allowedNames = options.allow || [];
    this._requiredSuffixes = options.requireSuffix || {};
  },

  check: function(file, errors) {
    var allowedNames = this._allowedNames;
    var requiredSuffixes = this._requiredSuffixes;
    file.iterateTokenByValue(IMPORT_TOKEN, function(token, index, fullTokens) {
      var tokens = fullTokens.slice(index);

      var identifierOrBrace = (tokens[2] || {});
      if (identifierOrBrace.value !== '{') {
        // Expected:
        // [0] import [1] whitespace [2] identifier [3] whitespace [4] from [5] filename [6] ;
        var identifierToken = (tokens[2] || {});
        var identifier = identifierToken.value;
        var fileName = (tokens[6] || {}).value;
        var fileNameParts = fileName.replace(/['"]/g, '').split('/');

        if (allowedNames.indexOf(identifier) === -1) {
          var acceptedNames = getAcceptedNamesForFilename(requiredSuffixes, fileNameParts);

          if (acceptedNames.indexOf(identifier) === -1) {
            errors.add('Be sure to name your imports consistently with the module/file name. ' +
                       'You are importing from ' + fileName + ', so accepted name(s) are: ' +
                       acceptedNames.join(', ') + '. You named your import \'' + identifier + '\'.',
            ((identifierToken || {}).loc || {}).start);
          }
        }
      }
    });
  }
}

module.exports = Rule;
