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
        tag: 'p'
      },
    ]
  },
  renderHTML({ HTMLAttributes }) {
    return ['p', mergeAttributes(this.options.HTMLAttributes, HTMLAttributes), 0]
  },
})