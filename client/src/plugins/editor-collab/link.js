import { Node, mergeAttributes } from '@tiptap/core';

export default Node.create({
  name: 'link',
  group: 'inline',
  content: 'text*',
  inline: true,
  draggable: false,
  atom: true,
  marks: '',
  isolating: true,
  selectable: true,
  addAttributes() {
    return {
      href: {
        default: null,
        renderHTML: (attributes) => {
          if (attributes.href)
            return {
              href: attributes.href,
            };
        },
        parseHTML: (element) => element.href,
      },
      target: {
        default: '_blank',
      },
      class: {
        default: '',
        renderHTML: (attributes) => {
          if (attributes.class)
            return {
              class: attributes.class,
            };
        },
        parseHTML: (element) => element.classList.value,
      },
    };
  },
  parseHTML() {
    return [
      {
        tag: 'a[href]'
      },
    ];
  },
  renderHTML({ HTMLAttributes }) {
    return ['a', HTMLAttributes, 0];
  },
  addCommands() {
    return {
      insertLink: () => ({ chain }) => {
        const cursorStartPos = this.editor.state.selection.$from.pos;
        const linkText = document.getSelection().toString()
          ? document.getSelection().toString()
          : ' ';

        return chain()
          .deleteSelection()
          .insertContent(
            `<a href="http://default" target="_blank">${linkText}</a>`
          )
          .setNodeSelection(cursorStartPos);
      },
    };
  },
  addKeyboardShortcuts() {
    return {
      'Mod-K': () => this.editor.commands.insertLink(),
    };
  },
});
