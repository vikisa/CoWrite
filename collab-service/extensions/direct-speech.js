import { Mark, mergeAttributes } from '@tiptap/core';

export default Mark.create({
  name: 'direct-speech',
  addOptions: {
    HTMLAttributes: {
      class: 'direct-speech',
    },
  },
  parseHTML() {
    return [
      {
        tag: 'span',
        getAttrs: (node) => node.classList.contains('direct-speech'),
      },
    ];
  },
  renderHTML({ HTMLAttributes }) {
    return ['span', mergeAttributes(this.options.HTMLAttributes, HTMLAttributes), 0];
  },
  addCommands() {
    return {
      toggleDirectSpeech: () => ({ commands }) => {
        return commands.toggleMark('direct-speech');
      },
    };
  },
});
