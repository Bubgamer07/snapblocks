Make pictures of Snap<i>!</i> blocks from text.

[![Screenshot](https://scratchblocks.github.io/screenshot.png)](https://scratchblocks.github.io/#when%20flag%20clicked%0Aclear%0Aforever%0Apen%20down%0Aif%20%3C%3Cmouse%20down%3F%3E%20and%20%3Ctouching%20%5Bmouse-pointer%20v%5D%3F%3E%3E%20then%0Aswitch%20costume%20to%20%5Bbutton%20v%5D%0Aelse%0Aadd%20(x%20position)%20to%20%5Blist%20v%5D%0Aend%0Amove%20(foo)%20steps%0Aturn%20ccw%20(9)%20degrees)

**[Try it out!](https://ego-lay-atman-bay.github.io/snapblocks)**

---

**snapblocks** is a fork of **scratchblocks** which aims to be more catered towards Snap<i>!</i>. These changes include, adding Snap<i>!</i> blocks, inputs, icons, and eventually a way to convert to Snap<i>!</i> xml.

Since Snap<i>!</i> is more advanced than scratch, scratchblocks has to be modified to add support for Snap<i>!</i> exclusive features. Scratchblocks does already have a bit of Snap<i>!</i> support, with the grey rings and `@list` icon, but there are still many features in Snap<i>!</i> that require modification. These include, multiline blocks / inputs, more input types (which can be represented by icons), and regular snap icons.

The define block also has to be changed, specifically because Snap<i>!</i> does not have the same representation as Scratch. Most notably, Snap<i>!</i> uses a regular control hat block with the colored block in the hat block. Ok, the word "define" isn't even used in the custom block definition, it's just the block.

Oh yeah, I also fixed the grey ring rendering because tjvr is not doing anything about it.

Since snapblocks is a fork of scratchblocks, it will keep the scratch 2 and 3 styles, and add a new snap style. The snap style is just modified scratch 2 to make it look more like snap, with the snap category colors (and events is the same color as control, since the events category is not in snap). I do also kind of want to add the snap flat design, much like scratch 3's high contrast style.
---

**snapblocks** is used to write Snap scripts:

- in [Snap Forum](https://forum.snap.berkeley.edu/) posts
- in [Snap Wiki](https://snapwiki.miraheze.org/) articles

These currently use the original scratchblocks, but I have a feeling when snapblocks is ready they'll transition to using snapblocks (as soon as it's integrated into the plugins anyway).

It's MIT licensed, so you can use it in your projects.
(But do send me a link [on Twitter](https://twitter.com/blob8108)!)

For the full guide to the syntax, see [the wiki](https://en.scratch-wiki.info/wiki/Block_Plugin/Syntax) (hopefully when this is finished, we can make a snapblocks syntax article on the snap wiki).

# Usage

All of these, except html, currently do not have a snapblocks version, but it shouldn't be too hard to modify them to add snapblocks support.

## MediaWiki

Use [the MediaWiki plugin](https://github.com/InternationalScratchWiki/mw-ScratchBlocks4).
(This is what the [Scratch Wiki](https://en.scratch-wiki.info/wiki/Block_Plugin) uses.)

## WordPress

I found [a WordPress plugin](https://github.com/tkc49/scratchblocks-for-wp).
It might work for you; I haven't tried it.

## Pandoc

Code Club use their own [lesson_format](https://github.com/CodeClub/lesson_format) tool to generate the PDF versions of their project guides.
It uses the [pandoc_scratchblocks](https://github.com/CodeClub/pandoc_scratchblocks) plugin they wrote to make pictures of Scratch scripts.

This would probably be a good way to write a Scratch book.

## HTML

You'll need to include a copy of the snapblocks JS file on your webpage.
There are a few ways of getting one:

* Download it from the <https://github.com/ego-lay-atman-bay/snapblocks/releases> page
* If you have a fancy JS build system, you might like to include the `snapblocksblocks` package from NPM (when it's on NPM)
* You could clone this repository and build it yourself using Node 16.14.0+ (`npm run build`).

```html
<script src="snapblocks-min.js"></script>
```

The convention is to write snapblocks inside `pre` tags with the class `blocks`:
```html
<pre class="blocks">
when flag clicked
move (10) steps
</pre>
```

You then need to call `scratchblocks.renderMatching` after the page has loaded.
Make sure this appears at the end of the page (just before the closing `</body>` tag):
```js
<script>
scratchblocks.renderMatching('pre.blocks', {
  style:     'snap',       // Optional, defaults to 'scratch2'.
  languages: ['en', 'de'], // Optional, defaults to ['en'].
  scale: 1,                // Optional, defaults to 1
});
</script>
```
Note: this does use `scratchblocks` so it's easier to migrate from scratchblocks to snapblocks.
The `renderMatching()` function takes a CSS-style selector for the elements that contain snapblocks code: we use `pre.blocks` to target `pre` tags with the class `blocks`.

The `style` option controls how the blocks appear, either the Scratch 2 or Scratch 3 style is supported.

### Inline blocks

You might also want to use blocks "inline", inside a paragraph:
```html
I'm rather fond of the <code class="b">stamp</code> block in Scratch.
```

To allow this, make a second call to `renderMatching` using the `inline` argument.
```js
<script>
scratchblocks.renderMatching("pre.blocks", ...)

scratchblocks.renderMatching("code.b", {
  inline: true,
  // Repeat `style` and `languages` options here.
});
</script>
```
This time we use `code.b` to target `code` blocks with the class `b`.

### Translations

If you want to use languages other than English, you'll need to include a second JS file that contains translations.
The releases page includes two options; you can pick one:

* `translations.js` includes a limited set of languages, as seen on the Scratch Forums
* `translations-all.js` includes every language that Scratch supports.

The translations files are hundreds of kilobytes in size, so to keep your page bundle size down you might like to build your own file with just the languages you need.

For example, a translations file that just loads the German language (ISO code `de`) would look something like this:
```js
window.scratchblocks.loadLanguages({
    de: <contents of locales/de.json>
})
```

If you're using a JavaScript bundler you should be able to build your own translations file by calling `require()` with the path to the locale JSON file.
This requires your bundler to allow importing JSON files as JavaScript.
```js
window.scratchblocks.loadLanguages({
    de: require('snapblocks/locales/de.json'),
})
```

## NPM

The `snapblocks` package will be published on NPM, and you can use it with browserify and other bundlers, if you're into that sort of thing.

Once you've got browserify set up to build a client-side bundle from your app
code, you can just add `snapblocks` to your dependencies, and everything
should Just Work™.

```js
var scratchblocks = require('snapblocks');
scratchblocks.renderMatching('pre.blocks');
```

## ESM Support
Since version 3.6.0, scratchblocks (and subsequently snapblocks) can be properly loaded as an ESM module. The ESM version, instead of defining `window.scratchblocks`, default-exports the `scratchblocks` object. Similarly, the JavaScript translation files default-exports a function to load the translations.

```js
import scratchblocks from "./snapblocks-es-min.js";
import loadTranslations from "./translations-all-es.js";
loadTranslations(scratchblocks);

// window.scratchblocks is NOT available!
```

# Languages

To update the translations:
```sh
npm upgrade scratch-l10n
npm run locales
```

## Adding a language

Each language **requires** some [additional words](https://github.com/ego-lay-atman-bay/snapblocks/blob/master/locales-src/extra_aliases.js) which aren't in Scratch itself (mainly the words used for the flag and arrow images).
I'd be happy to accept pull requests for those! You'll need to rebuild the translations with `npm run locales` after editing the aliases.

# Development

This should set you up and start a http-server for development:

```
npm install
npm start
```

Then open <http://localhost:8000/> :-)

For more details, see [`CONTRIBUTING.md`](https://github.com/ego-lay-atman-bay/snapblocks/blob/master/.github/CONTRIBUTING.md).


# Credits

Many, many thanks to the [contributors](https://github.com/ego-lay-atman-bay/snapblocks/graphs/contributors)!

* Maintained by [ego-lay-atman-bay](https://github.com/ego-lay-atman-bay)
* This is a fork of [scratchblocks](https://github.com/scratchblocks/scratchblocks), so all the credit there still applies here.
* Original scratchblocks by [tjvr](https://github.com/tjvr)
* Icons derived from [Scratch Blocks](https://github.com/scratchfoundation/scratch-blocks) (Apache License 2.0) and [Snap<i>!</i>](https://github.com/jmoenig/Snap/blob/master/src/symbols.js)
* Scratch 2 SVG proof-of-concept, shapes & filters by [as-com](https://github.com/as-com)
* Anna helped with a formula, and pointed out that tjvr can't read graphs
* JSO designed the syntax and wrote the original [Block Plugin](https://en.scratch-wiki.info/wiki/Block_Plugin_\(1.4\))
* Help with translation code from [joooni](https://scratch.mit.edu/users/joooni/)
* Block translations from the [scratch-l10n repository](https://github.com/scratchfoundation/scratch-l10n/)
* Ported to node by [arve0](https://github.com/arve0)
