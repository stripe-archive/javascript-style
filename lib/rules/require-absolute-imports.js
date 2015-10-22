/**
 * Requires that imports are absolute. This rule is useful in ember-cli apps where
 * addons shadow the import namespace.
 *
 * Type: `Boolean`
 * Values: `true` or `false`
 *
 * #### Example
 *
 * ```js
 * "requireImportToMatchFileName": true
 * ```
 *
 * ##### Valid
 *
 * ```js
 * import Dispute from 'dashboard-ui/models/dispute'
 * ```
 *
 * ##### Invalid
 *
 * ```js
 * import Dispute from '../models/dispute'
 * ```
 */

var assert = require('assert');

function Rule() {};

var HAS_DOT = /\./;
var HAS_DOT_JS = /\.js/;

Rule.prototype = {
  getOptionName: function() {
    return 'requireAbsoluteImports';
  },

  configure: function(options) {
    // nothing to configure
  },

  check: function(file, errors) {
    file.iterateNodesByType("ImportDeclaration", function(token, index, tokens) {
      var importPath = token.source.value;
      if (importPath.match(HAS_DOT_JS)) {
        // The below error would be confusing if the path ends in '.js'.
        errors.add('Imports should not include \'.js\'', token.loc.start);
      } else if (importPath.match(HAS_DOT)) {
        errors.add('Imports must be absolute.', token.loc.start);
      }
    });
  }
}

module.exports = Rule;
