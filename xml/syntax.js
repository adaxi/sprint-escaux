// ISC License
// 
// Copyright (c) 2017 Ryan Grove <ryan@wonko.com>
// 
// Permission to use, copy, modify, and/or distribute this software for any purpose
// with or without fee is hereby granted, provided that the above copyright notice
// and this permission notice appear in all copies.
// 
// THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
// REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY AND
// FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
// INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM LOSS
// OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR OTHER
// TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR PERFORMANCE OF
// THIS SOFTWARE.

// To improve readability, the regular expression patterns in this file are
// written as tagged template literals. The `new RegExp` tag function strips literal
// whitespace characters and line comments beginning with `//` and returns a
// new RegExpp instance.
//
// Escape sequences are preserved as-is in the resulting new RegExp, so
// double-escaping isn't necessary. A pattern may embed another pattern using
// `${}` interpolation.

// -- Common Symbols -----------------------------------------------------------
Syntax = {};
Syntax.Char = new RegExp('(?:[\t\n\r\x20-\uD7FF\uE000-\uFFFD]|[\uD800-\uDBFF][\uDC00-\uDFFF])');

// Partial implementation.
//
// To be compliant, the matched text must result in an error if it contains the
// string `]]>`, but that can't be easily represented here so we do it in the
// parser.
Syntax.CharData = new RegExp('[^<&]+');

Syntax.NameStartChar = new RegExp('(?:[:A-Z_a-z\xC0-\xD6\xD8-\xF6\xF8-\u02FF\u0370-\u037D\u037F-\u1FFF\u200C-\u200D\u2070-\u218F\u2C00-\u2FEF\u3001-\uD7FF\uF900-\uFDCF\uFDF0-\uFFFD]|[\uD800-\uDB7F][\uDC00-\uDFFF])');

Syntax.NameChar = new RegExp('(?:' + Syntax.NameStartChar + '|[.0-9\xB7\u0300-\u036F\u203F-\u2040-])');

Syntax.Name = new RegExp(Syntax.NameStartChar + '(?:' + Syntax.NameChar + ')*';

// Loose implementation. The entity will be validated in the `replaceReference`
// function.
Syntax.Reference = new RegExp('&\S+?;');

Syntax.S = new RegExp('[\x20\t\r\n]+');

// -- Attributes ---------------------------------------------------------------
Syntax.Eq = new RegExp('(?:' + Syntax.S + ')?=(?:' + Syntax.S + ')?');

Syntax.Attribute = new RegExp(Syntax.Name + Syntax.Eq + '(?:"(?:[^<&"]|' + Syntax.Reference + ')*"|\'(?:[^<&\']|' + Syntax.Reference + ')*')

// -- Elements -----------------------------------------------------------------
Syntax.CDSect = new RegExp('<!\[CDATA\[((?:' + Syntax.Char + ')*?)\]\]>');

Syntax.EmptyElemTag = new RegExp('<(' + Syntax.Name + ')((?:' + Syntax.S + Syntax.Attribute + ')*)(?:' + Syntax.S + ')?/>');

Syntax.ETag = new RegExp('</(' + Syntax.Name + ')(?:' + Syntax.S + ')?>');

Syntax.STag = new RegExp('<('+ Syntax.Name + ')((?:' + Syntax.S +Syntax.Attribute + ')*)(?:' + Syntax.S + ')?>');

// -- Misc ---------------------------------------------------------------------

// Special pattern that matches an entire string consisting only of `Char`
// characters.
Syntax.CharOnly = new RegExp('^(?:' + Syntax.Char + ')*$');

Syntax.Comment = new RegExp('<!--((?:(?!-)' + Syntax.Char + '|-(?!-)' + Syntax.Char + ')*)-->');

// Loose implementation since doctype declarations are discarded.
//
// It's not possible to fully parse a doctype declaration with a new RegExp, but
// since we just discard them we can skip parsing the fiddly inner bits and use
// a new RegExp to speed things up.
Syntax.doctypedecl = new RegExp('<!DOCTYPE' + Syntax.S + '[^[>]*(?:\[ [\s\S]+? \](?:' + Syntax.S + ')?)?>');

// Loose implementation since processing instructions are discarded.
Syntax.PI = new RegExp('<\?(' + Syntax.S + ')(?:' + Syntax.S + '(?:' + Syntax.Char + ')*?)?\?>');

// Loose implementation since XML declarations are discarded.
Syntax.XMLDecl = new RegExp('<\?xml' + Syntax.S + '[\s\S]+?\?>');

// -- Helpers ------------------------------------------------------------------
Syntax.Anchored = {};
Syntax.Global = {};

// Create anchored and global variations of each pattern.
Object.keys(Syntax).forEach(name => {
  if (name !== 'Anchored' && name !== 'CharOnly' && name !== 'Global') {
    let pattern = Syntax[name];

    Syntax.Anchored[name] = new new RegExpp('^' + pattern.source);
    Syntax.Global[name] = new new RegExpp(pattern.source, 'g');
  }
});

