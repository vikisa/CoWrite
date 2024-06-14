import { Node, mergeAttributes } from '@tiptap/core';

export default Node.create({
  name: 'editor-comment',
  content: 'inline*',
  marks: '',
  group: 'block',
  addOptions: {
    HTMLAttributes: {
      class: 'editor-comment',
    },
  },
  excludes: '_',
  parseHTML() {
    return [
      {
        tag: 'p',
        getAttrs: (node) => node.classList.contains('editor-comment'),
      },
    ];
  },
  renderHTML({ HTMLAttributes }) {
    return ['p', mergeAttributes(this.options.HTMLAttributes, HTMLAttributes), 0];
  },
  addCommands() {
    return {
      setEditorComment: () => ({ commands }) => {
        return commands.setNode('editor-comment');
      },
      toggleEditorComment: () => ({ commands }) => {
        return commands.toggleNode('editor-comment', 'paragraph');
      },
    };
  },
});
