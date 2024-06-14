import { Node, mergeAttributes } from '@tiptap/core';

export default Node.create({
  name: 'blockquote',
  addOptions() {
    return {
      HTMLAttributes: {},
    }
  },
  content: 'inline*',
  group: 'block',
  defining: true,
  parseHTML() {
    return [
      { tag: 'blockquote' },
    ]
  },
  renderHTML({ HTMLAttributes }) {
    return ['blockquote', mergeAttributes(this.options.HTMLAttributes, HTMLAttributes), 0]
  },
  addCommands() {
    return {
      setBlockquote: () => ({ commands }) => {
        return commands.wrapIn(this.name)
      },
      toggleBlockquote: () => ({ commands }) => {
        return commands.toggleWrap(this.name)
      },
      unsetBlockquote: () => ({ commands }) => {
        return commands.lift(this.name)
      },
    }
  },
  addKeyboardShortcuts() {
    return {
      'Mod-Shift-b': () => this.editor.commands.toggleBlockquote(),
    }
  },
})