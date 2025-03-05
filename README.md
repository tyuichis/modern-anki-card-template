# About
This Anki card template is built to be easy to use, beautifully consistent and feature-complete. While there are many templates out there, not many, if any, tried to engineer in a UI/UX experience that feels natively built-in.

Here are some key features:
- Dark and Light Mode support
- System fonts for a native feel
- Furigana and Japanese text support (with correct typographic scale)
- Desktop UI buttons for common tasks
- Variable accent color based on subject names
- Optional code syntax highlighting[^1]
- Accent color matches native Anki flag colors
- Subtle animations for answer reveals
- Near 'native' styling where possible, e.g., Material 3 color palette for Android
  
This card template was mainly produced and used on Mac and Android (Pixel). For any design or functionality tweaks on other platforms, such as Windows or Unix, please let me know.

This setup also avoids the bloat of excessive add-ons, but encourages using select add-ons where they genuinely enhance the card creation experience. Essentially, a somewhat vanilla experience wrapped with a thoughtful framework.

# Quick Start
Download the `.apkg` file from the Releases page, and click to open & import the two card types (Q&A, Cloze types)

✅ This is all you need to start. Though, not all features will be enabled:

- the Undo and Flag status buttons won't work until you download the UI status buttons add-on.
- the remaining cards text won't update properly

So you'll need some add-ons to make it work.

To download all the add-ons at once (including the recommended add-ons below), copy and paste this into your Anki Add-on menu:

```
1490471827 511710206 1844938046 1960039667
```

For coders and programmers: to enable syntax highlighting, please add `_highlight.js` and `_github-dark.min.css` to your Anki's `collection.media` folder[^2]

## Recommended add-ons

### 1. UI Status Buttons

To use the UI buttons (Undo, Flag buttons) on Desktop, you'll need to download the add-on either from AnkiWeb, or within the Releases page.

### 2. Anki JavaScript API
addon: `1490471827` 

This is also a necessary add-on if you want to see how many remaining cards are in your deck during Card Review.

### 3. Editor Live Preview
addon: `1960039667` 

**This is the most recommended third-party addon.**

This card template was specially designed to reduce visual clutter and focus on the [Rule of Minimum Information](https://www.supermemo.com/en/blog/twenty-rules-of-formulating-knowledge#:~:text=cost%20you%20dearly!-,Stick%20to%20the%C2%A0minimum%20information%20principle,-The%20material%20you)[^3][^4]

### 4. Field AutoComplete
addon: `511710206` 

If you find yourself often creating cards for the same topic, this is a lifesaver.

Used alongside the native pin function, you save 1+ minute per card.

### 5. Markdown support for code blocks and inline code
addon: `1844938046` 

If you need to use code blocks repeatedly, get this. 

It enables you to use double ticks for inline-code, `, and triple ticks for multi-line code blocks ts  with optional language support, i.e. ts for typescript, rs for rust, etc.

Note: You'll need to write your code blocks within the [HTML editor of Anki](https://docs.ankiweb.net/editing.html#:~:text=The%20%3C/%3E%20button%20allows%20editing%20the%20underlying%20HTML%20of%20a%20field.) (click the <> button in the Card Field to expand).

As of March 4 2025, `<>` tags are not supported while writing code blocks using this extension. 

## FAQ
<details>
<summary> <h4>My subject label is grayed out. What gives?</h4></summary>
  
If your subject wasn't included in the defaults, you can manually add them.
The subjects included in the templates are starting points. In the HTML front and back side, you'll see:

```js
  var subjects = {
    algorithms: 'purple',
    python: 'turquoise',
    react: 'pink',
    kubernetes: 'green',
    rust: 'blue',
    'software testing': 'red',
    calculus: 'orange',
    grammar: 'green',
    'idioms and proverbs': 'pink',
    /* ... other subjects here */
  };
```

You can manually edit the key names to fit your subject names, but it's not recommended.

Instead, you can visit an AI chatbot and generate subject label colors this way.
Refer to the prompt located in [docs/generate-label-colors-prompt.txt](./docs/generate-label-colors-prompt.txt).

To do that with a chat bot, follow these steps:

1. Copy and paste the prompt and send.
2. Enter in the subjects you need to study. For example, in a Deck about Organic Chemistry:

```
nomenclature, reactions, mechanisms, stereochemistry, spectroscopy, synthesis, functional groups, reagents, acids and bases, resonance
```

3. You should get something like this structure back:
```js
var subjects = {
    "nomenclature": "purple",
    "reactions": "green",
    "mechanisms": "blue",
    "stereochemistry": "blue",
    "spectroscopy": "turquoise",
    "synthesis": "pink",
    "functional groups": "purple",
    "reagents": "turquoise",
    "acids and bases": "purple",
    "resonance": "blue"
}
```

4. Copy paste the new subject object (or part of it) into each of the card template's front and back side HTML. Ready to use!
</details>

<details>
<summary> <h4>Code highlighting doesn't seem to work</h4></summary>
  
Be sure to add `_highlight.js` and `_github-dark.min.css` to your Anki's `collection.media` folder.

For more details, see [https://docs.ankiweb.net/files.html#file-locations](https://docs.ankiweb.net/files.html#file-locations)
  
</details>

# License
This project is licensed under the MIT License - see the LICENSE file for details.

[^1]: The card template is already coded to use highlight.js if available. Please put `_highlight.js` and any theme (default, `_github-dark.min.css` in `collection.media` then restart Anki to use.
[^2]: Ibid, same as above footnote.
[^3]: The flashcard text content has a container to help immediately focus on the information. The flashcard is also positioned such that the contents are where your eyes typically are, slightly above center.
[^4]: Metadata is still important to embed in a flashcard. For example, **sources** give reminders on where you learnt your knowledge and the memory associated with learning it.
