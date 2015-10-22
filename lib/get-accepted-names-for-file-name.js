var STARTS_WITH_NUMBER = /^[0-9]/;

/**
 * Returns accepted names for an import or export given a list of
 * suffixes and a path split on seperators.
 *
 * @param requiredSuffixes {[key: string]: string} A map from elements in the
 *   path to required suffixes. If a key in requiredSuffixes is present in the
 *   path array, the import or export must end with requiredSuffixes[key].
 * 
 * @param fileNameParts {string[]} A path split on '/'.
 */
function getAcceptedNameForFileName(requiredSuffixes, fileNameParts) {
  var fileName = fileNameParts.pop();

  var suffixes = Object.keys(requiredSuffixes);
  var requiredSuffixKey = suffixes.filter(function(suffix) {
    return fileNameParts.indexOf(suffix) !== -1;
  })[0];
  var requiredSuffix = requiredSuffixes[requiredSuffixKey];

  if (requiredSuffix) {
    // routes/coupon/index should be named CouponIndexRoute
    fileName = fileNameParts.slice(fileNameParts.indexOf(requiredSuffixKey) + 1)
      .concat(fileName)
      .join('-');
  }

  if (requiredSuffix && (fileName.toLowerCase().indexOf(requiredSuffix.toLowerCase()) === -1 ||
      fileName.toLowerCase().indexOf(requiredSuffix.toLowerCase()) !== fileName.length - requiredSuffix.length)) {
    fileName += '-' + requiredSuffix.toLowerCase();
  }

  var acceptedNames = [];

  var prefix = '';
  if (fileName.match(STARTS_WITH_NUMBER)) {
    prefix = '_';
  }

  var camelizedName = prefix + camelize(fileName);
  var classifiedName = prefix + classify(fileName);

  if (camelizedName === classifiedName) {
    acceptedNames.push(camelizedName);
  } else {
    acceptedNames.push(camelizedName, classifiedName);
  }

  return acceptedNames;
}

function camelize(str) {
  return str.toLowerCase().replace(/[-_](.)/g, function(_, group) {
    return group.toUpperCase();
  });
}

function capitalize(str) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

function classify(str) {
  return capitalize(camelize(str));
}

module.exports = getAcceptedNameForFileName;
