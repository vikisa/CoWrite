import { Node, mergeAttributes } from '@tiptap/core';

export default Node.create({
  name: 'help-comment',
  content: 'inline*',
  marks: '',
  group: 'block',
  addOptions: {
    HTMLAttributes: {
      class: 'help-comment',
    },
  },
  excludes: '_',
  parseHTML() {
    return [
      {
        tag: 'p',
        getAttrs: (node) =>  node.classList.contains('help-comment'),
      },
    ];
  },
  renderHTML({ HTMLAttributes }) {
    return ['p', mergeAttributes(this.options.HTMLAttributes, HTMLAttributes), 0];
  },
  addCommands() {
    return {
      setHelpComment: () => ({ commands }) => {
        return commands.setNode('help-comment');
      },
      toggleHelpComment: () => ({ commands }) => {
        return commands.toggleNode('help-comment', 'paragraph');
      },
    };
  },
});
