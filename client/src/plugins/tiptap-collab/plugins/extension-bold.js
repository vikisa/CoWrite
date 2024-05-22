import { Mark, mergeAttributes } from '@tiptap/core';

export default Mark.create({
  name: 'bold',
  addOptions: {
    HTMLAttributes: {},
  },
  parseHTML() {
    return [
      {
        tag: 'strong',
        getAttrs: (node) => !node.hasAttribute('contenteditable') && !node.hasAttribute('style')
      },
      {
        tag: 'b',
      },
    ];
  },
  renderHTML({ HTMLAttributes }) {
    return ['strong', mergeAttributes(this.options.HTMLAttributes, HTMLAttributes), 0];
  },
  addCommands() {
    return {
      setBold: () => ({ commands }) => {
        return commands.setMark('bold');
      },
      toggleBold: () => ({ commands }) => {
        return commands.toggleMark('bold');
      },
      unsetBold: () => ({ commands }) => {
        return commands.unsetMark('bold');
      },
    };
  },
  addKeyboardShortcuts() {
    return {
      'Mod-b': () => this.editor.commands.toggleBold(),
    };
  },
});
