import { mergeAttributes, Node } from '@tiptap/core'

export default Node.create({
  name: 'paragraph',
  group: 'block',
  content: 'inline*',
  addOptions() {
    return {
      HTMLAttributes: {},
    }
  },
  parseHTML() {
    return [
      {
        tag: 'p',
        getAttrs: (node) => node.classList.length === 0
      },
    ]
  },
  renderHTML({ HTMLAttributes }) {
    return ['p', mergeAttributes(this.options.HTMLAttributes, HTMLAttributes), 0]
  },
  addCommands() {
    return {
      setParagraph: () => ({ commands }) => {
        return commands.setNode(this.name)
      },
    }
  },
  addKeyboardShortcuts() {
    return {
      'Mod-Alt-0': () => this.editor.commands.setParagraph(),
      'Enter': () => {
        //console.log('enter');
        //this.editor.commands.addEditorBlock();
      }
    }
  },
})