module.exports = function(conf) {
  conf.registerRule(require('./rules/require-import-to-match-file-name.js'));
  conf.registerRule(require('./rules/require-default-export-to-match-file-name.js'));
  conf.registerRule(require('./rules/require-absolute-imports.js'));
  conf.registerPreset('stripe', require('../presets/stripe.json'));
};
