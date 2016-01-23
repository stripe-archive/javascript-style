/**
 * Requires that the names of default ES6 exports match the file name and,
 * depending on the value of `requireSuffix` in your JSCS config, the path.
 * This does not affect non-default exports or exports that are modules.
 *
 * See require-import-to-match-file-name as the usage and behaviour matches that.
 *
 * ##### Valid in 'example.js'
 *
 * ```js
 * import Ember from 'ember';
 *
 * let Test = Ember.Object.extend({
 * });
 * export default Test;
 * ```
 *
 * ```js
 * function Test() {
 * }
 * export default Test;
 * ```
 *
 * ```js
 * export default function Test() {
 * }
 * ```
 *
 * ##### Invalid
 *
 * ```js
 * export function() {
 * }
 * ```
 *
 * ```js
 * import Ember from 'ember';
 *
 * export default Ember.Object.extend({
 * });
 * ```
 *
 */

var assert = require('assert');
var path = require('path');
var getAcceptedNamesForFileName = require('../get-accepted-names-for-file-name');

function Rule() {};

Rule.prototype = {
  getOptionName: function() {
    return 'requireDefaultExportToMatchFileName';
  },

  configure: function(options) {
    assert(options === true || typeof options === 'object',
      'requireDefaultExportToMatchFileName rule requires `true` or object value.');
    this._allowedNames = options.allow || [];
    this._requiredSuffixes = options.requireSuffix || {};
  },

  check: function(file, errors) {
    var allowedNames = this._allowedNames;
    var requiredSuffixes = this._requiredSuffixes;
    file.iterateNodesByType("ExportDefaultDeclaration", function(token, index, tokens) {
      // The first allows for direct exports, the second allows for exports of named functions.
      var name = token.declaration.id ? token.declaration.id.name : token.declaration.name;

      if (allowedNames.indexOf(name) !== -1) {
        return;
      }

      var relativePath = path.normalize(file._filename);
      var fileNameParts = relativePath.replace(/\.[a-zA-Z0-9]+$/, '').replace(/['"]/g, '').split('/');

      var acceptedNames = getAcceptedNamesForFileName(requiredSuffixes, fileNameParts);

      if (acceptedNames.indexOf(name) === -1) {
        var problemHint;
        var oldNameHint;
        if (name) {
          problemHint = 'Default exports must be named consistently with the filename and path.';
          oldNameHint = 'The default export is incorrectly named \'' + name + '\'.';
        } else {
          problemHint = 'Anonymous default exports are not allowed.';
          oldNameHint = 'The default export in this file does not have a name.';
        }
        errors.add(problemHint + ' ' +
          'The file in question was found at ' + relativePath + ', so accepted name(s) are: ' +
          acceptedNames.join(', ') + '. ' + oldNameHint, token.loc.start);
      }
    });
  }
}

module.exports = Rule;
