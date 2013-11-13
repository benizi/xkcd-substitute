// based on cloud-to-butt:
// https://github.com/panicsteve/cloud-to-butt/blob/7f2fca934f74fe5cc1a218a176916a97838766b9/Source/content_script.js

function walk(node) {
  // I stole this function from here:
  // http://is.gd/mwZp7E

  var child, next;

  switch (node.nodeType) {
    case 1: // Element
    case 9: // Document
    case 11: // Document fragment
      child = node.firstChild;
      while (child) {
        next = child.nextSibling;
        walk(child);
        child = next;
      }
      break;
    case 3: // Text node
      handleText(node);
      break;
  }
}

// Format: ['search word', 'replacement text']
// Search word will be found globally, case-insensitively, only on word boundaries
// Replacement text will attempt to match capitalization
var replacements = [
  ['witnesses', 'these dudes I know'],
  ['allegedly', 'kinda probably'],
  ['new study', 'tumblr post'],
  ['rebuild', 'avenge'],
  ['space', 'spaaace'],
  ['google glass', 'virtual boy'],
  ['smart(?:|-|\\s)phone', 'Pok\u00e9dex'],
  ['electric', 'atomic'],
  ['senator', 'elf-lord'],
  ['car', 'cat'],
  ['election', 'eating contest'],
  ['congressional leaders', 'river spirits'],
  ['homeland security', 'Homestar Runner'],
  ['could not be reached for comment', 'is guilty and everyone knows it'],
];

// Attempt to match capitalization:
// replacement='virtual boy'
// match='GOOGLE GLASS' -> 'VIRTUAL BOY'
// match='Google Glass' -> 'Virtual Boy'
// match='google glass' -> 'virtual boy'
// match='GoOgLe GlAsS' -> 'Virtual Boy'
function preserveCase(replacement) {
  return function(match) {
    // if all uppercase, also upcase the replacement
    if (match == match.toUpperCase()) {
      return replacement.toUpperCase();
    }

    // if anything is uppercase, assume it's title-cased
    if (match.match(/[A-Z]/)) {
      var words = replacement.split(/\s|-/);
      var ret = [];
      for (var i = 0; i < words.length; i++) {
        ret.push(words[i].charAt(0).toUpperCase() + words[i].substring(1));
      }
      return ret.join(' ');
    }

    // otherwise return the natural case of the replacement
    return replacement;
  };
}

for (var i = 0; i < replacements.length; i++) {
  replacements[i][0] = new RegExp("\\b" + replacements[i][0] + "\\b", 'gi');
  replacements[i][1] = preserveCase(replacements[i][1]);
}

function handleText(textNode) {
  var txt = textNode.nodeValue;
  for (var i = 0; i < replacements.length; i++) {
    txt = String.prototype.replace.apply(txt, replacements[i]);
  }
  textNode.nodeValue = txt;
}

walk(document.body);
