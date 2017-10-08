'use strict';

// To improve readability, the regular expression patterns in this file are
// written as tagged template literals. The `regex` tag function strips literal
// whitespace characters and line comments beginning with `//` and returns a
// RegExp instance.
//
// Escape sequences are preserved as-is in the resulting regex, so
// double-escaping isn't necessary. A pattern may embed another pattern using
// `${}` interpolation.

// -- Common Symbols -----------------------------------------------------------

var _templateObject = _taggedTemplateLiteralLoose(['\n  (?:\n    [\n      \t\n      \n\n      \r\n       -\uD7FF\n      \uE000-\uFFFD\n    ]\n\n    |\n\n    [\uD800-\uDBFF][\uDC00-\uDFFF]\n  )\n'], ['\n  (?:\n    [\n      \\t\n      \\n\n      \\r\n      \\x20-\\uD7FF\n      \\uE000-\\uFFFD\n    ]\n\n    |\n\n    [\\uD800-\\uDBFF][\\uDC00-\\uDFFF]\n  )\n']),
    _templateObject2 = _taggedTemplateLiteralLoose(['\n  [^<&]+\n'], ['\n  [^<&]+\n']),
    _templateObject3 = _taggedTemplateLiteralLoose(['\n  (?:\n    [\n      :\n      A-Z\n      _\n      a-z\n      \xC0-\xD6\n      \xD8-\xF6\n      \xF8-\u02FF\n      \u0370-\u037D\n      \u037F-\u1FFF\n      \u200C-\u200D\n      \u2070-\u218F\n      \u2C00-\u2FEF\n      \u3001-\uD7FF\n      \uF900-\uFDCF\n      \uFDF0-\uFFFD\n    ]\n\n    |\n\n    [\uD800-\uDB7F][\uDC00-\uDFFF]\n  )\n'], ['\n  (?:\n    [\n      :\n      A-Z\n      _\n      a-z\n      \\xC0-\\xD6\n      \\xD8-\\xF6\n      \\xF8-\\u02FF\n      \\u0370-\\u037D\n      \\u037F-\\u1FFF\n      \\u200C-\\u200D\n      \\u2070-\\u218F\n      \\u2C00-\\u2FEF\n      \\u3001-\\uD7FF\n      \\uF900-\\uFDCF\n      \\uFDF0-\\uFFFD\n    ]\n\n    |\n\n    [\\uD800-\\uDB7F][\\uDC00-\\uDFFF]\n  )\n']),
    _templateObject4 = _taggedTemplateLiteralLoose(['\n  (?:\n    ', '\n\n    |\n\n    [\n      .\n      0-9\n      \xB7\n      \u0300-\u036F\n      \u203F-\u2040\n      -\n    ]\n  )\n'], ['\n  (?:\n    ', '\n\n    |\n\n    [\n      .\n      0-9\n      \\xB7\n      \\u0300-\\u036F\n      \\u203F-\\u2040\n      -\n    ]\n  )\n']),
    _templateObject5 = _taggedTemplateLiteralLoose(['\n  ', '\n  (?:', ')*\n'], ['\n  ', '\n  (?:', ')*\n']),
    _templateObject6 = _taggedTemplateLiteralLoose(['\n  &S+?;\n'], ['\n  &\\S+?;\n']),
    _templateObject7 = _taggedTemplateLiteralLoose(['\n  [ \t\r\n]+\n'], ['\n  [\\x20\\t\\r\\n]+\n']),
    _templateObject8 = _taggedTemplateLiteralLoose(['\n  (?:', ')?\n  =\n  (?:', ')?\n'], ['\n  (?:', ')?\n  =\n  (?:', ')?\n']),
    _templateObject9 = _taggedTemplateLiteralLoose(['\n  ', '\n  ', '\n\n  (?:\n    "(?:\n      [^<&"] | ', '\n    )*"\n\n    |\n\n    \'(?:\n      [^<&\'] | ', '\n    )*\'\n  )\n'], ['\n  ', '\n  ', '\n\n  (?:\n    "(?:\n      [^<&"] | ', '\n    )*"\n\n    |\n\n    \'(?:\n      [^<&\'] | ', '\n    )*\'\n  )\n']),
    _templateObject10 = _taggedTemplateLiteralLoose(['\n  <![CDATA[\n    // Group 1: CData text content (optional)\n    (\n      (?:', ')*?\n    )\n  ]]>\n'], ['\n  <!\\[CDATA\\[\n    // Group 1: CData text content (optional)\n    (\n      (?:', ')*?\n    )\n  \\]\\]>\n']),
    _templateObject11 = _taggedTemplateLiteralLoose(['\n  <\n    // Group 1: Element name\n    (', ')\n\n    // Group 2: Attributes (optional)\n    (\n      (?:\n        ', '\n        ', '\n      )*\n    )\n\n    (?:', ')?\n  />\n'], ['\n  <\n    // Group 1: Element name\n    (', ')\n\n    // Group 2: Attributes (optional)\n    (\n      (?:\n        ', '\n        ', '\n      )*\n    )\n\n    (?:', ')?\n  />\n']),
    _templateObject12 = _taggedTemplateLiteralLoose(['\n  </\n    // Group 1: End tag name\n    (', ')\n    (?:', ')?\n  >\n'], ['\n  </\n    // Group 1: End tag name\n    (', ')\n    (?:', ')?\n  >\n']),
    _templateObject13 = _taggedTemplateLiteralLoose(['\n  <\n    // Group 1: Start tag name\n    (', ')\n\n    // Group 2: Attributes (optional)\n    (\n      (?:\n        ', '\n        ', '\n      )*\n    )\n\n    (?:', ')?\n  >\n'], ['\n  <\n    // Group 1: Start tag name\n    (', ')\n\n    // Group 2: Attributes (optional)\n    (\n      (?:\n        ', '\n        ', '\n      )*\n    )\n\n    (?:', ')?\n  >\n']),
    _templateObject14 = _taggedTemplateLiteralLoose(['\n  ^(?:', ')*$\n'], ['\n  ^(?:', ')*$\n']),
    _templateObject15 = _taggedTemplateLiteralLoose(['\n  <!--\n    // Group 1: Comment text (optional)\n    (\n      (?:\n        (?!-) ', '\n        | - (?!-) ', '\n      )*\n    )\n  -->\n'], ['\n  <!--\n    // Group 1: Comment text (optional)\n    (\n      (?:\n        (?!-) ', '\n        | - (?!-) ', '\n      )*\n    )\n  -->\n']),
    _templateObject16 = _taggedTemplateLiteralLoose(['\n  <!DOCTYPE\n    ', '\n\n    [^[>]*\n\n    (?:\n      [ [sS]+? ]\n      (?:', ')?\n    )?\n  >\n'], ['\n  <!DOCTYPE\n    ', '\n\n    [^[>]*\n\n    (?:\n      \\[ [\\s\\S]+? \\]\n      (?:', ')?\n    )?\n  >\n']),
    _templateObject17 = _taggedTemplateLiteralLoose(['\n  <?\n    // Group 1: PITarget\n    (\n      ', '\n    )\n\n    (?:\n      ', '\n      (?:', ')*?\n    )?\n  ?>\n'], ['\n  <\\?\n    // Group 1: PITarget\n    (\n      ', '\n    )\n\n    (?:\n      ', '\n      (?:', ')*?\n    )?\n  \\?>\n']),
    _templateObject18 = _taggedTemplateLiteralLoose(['\n  <?xml\n    ', '\n    [sS]+?\n  ?>\n'], ['\n  <\\?xml\n    ', '\n    [\\s\\S]+?\n  \\?>\n']);

function _taggedTemplateLiteralLoose(strings, raw) { strings.raw = raw; return strings; }

const Syntax = {};
Syntax.Char = regex(_templateObject);

// Partial implementation.
//
// To be compliant, the matched text must result in an error if it contains the
// string `]]>`, but that can't be easily represented here so we do it in the
// parser.
Syntax.CharData = regex(_templateObject2);

Syntax.NameStartChar = regex(_templateObject3);

Syntax.NameChar = regex(_templateObject4, Syntax.NameStartChar);

Syntax.Name = regex(_templateObject5, Syntax.NameStartChar, Syntax.NameChar);

// Loose implementation. The entity will be validated in the `replaceReference`
// function.
Syntax.Reference = regex(_templateObject6);

Syntax.S = regex(_templateObject7);

// -- Attributes ---------------------------------------------------------------
Syntax.Eq = regex(_templateObject8, Syntax.S, Syntax.S);

Syntax.Attribute = regex(_templateObject9, Syntax.Name, Syntax.Eq, Syntax.Reference, Syntax.Reference);

// -- Elements -----------------------------------------------------------------
Syntax.CDSect = regex(_templateObject10, Syntax.Char);

Syntax.EmptyElemTag = regex(_templateObject11, Syntax.Name, Syntax.S, Syntax.Attribute, Syntax.S);

Syntax.ETag = regex(_templateObject12, Syntax.Name, Syntax.S);

Syntax.STag = regex(_templateObject13, Syntax.Name, Syntax.S, Syntax.Attribute, Syntax.S);

// -- Misc ---------------------------------------------------------------------

// Special pattern that matches an entire string consisting only of `Char`
// characters.
Syntax.CharOnly = regex(_templateObject14, Syntax.Char);

Syntax.Comment = regex(_templateObject15, Syntax.Char, Syntax.Char);

// Loose implementation since doctype declarations are discarded.
//
// It's not possible to fully parse a doctype declaration with a regex, but
// since we just discard them we can skip parsing the fiddly inner bits and use
// a regex to speed things up.
Syntax.doctypedecl = regex(_templateObject16, Syntax.S, Syntax.S);

// Loose implementation since processing instructions are discarded.
Syntax.PI = regex(_templateObject17, Syntax.Name, Syntax.S, Syntax.Char);

// Loose implementation since XML declarations are discarded.
Syntax.XMLDecl = regex(_templateObject18, Syntax.S);

// -- Helpers ------------------------------------------------------------------
Syntax.Anchored = {};
Syntax.Global = {};

// Create anchored and global variations of each pattern.
Object.keys(Syntax).forEach(name => {
  if (name !== 'Anchored' && name !== 'CharOnly' && name !== 'Global') {
    let pattern = Syntax[name];

    Syntax.Anchored[name] = new RegExp('^' + pattern.source);
    Syntax.Global[name] = new RegExp(pattern.source, 'g');
  }
});

function regex(strings, ...embeddedPatterns) {
  let { length, raw } = strings;
  let lastIndex = length - 1;
  let pattern = '';

  for (let i = 0; i < length; ++i) {
    pattern += raw[i].replace(/(^|[^\\])\/\/.*$/gm, '$1') // remove end-of-line comments
    .replace(/\s+/g, ''); // remove all whitespace

    if (i < lastIndex) {
      pattern += embeddedPatterns[i].source;
    }
  }

  return new RegExp(pattern);
}

