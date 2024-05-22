import { mergeAttributes, Node } from '@tiptap/core'
import { VueNodeViewRenderer } from '@tiptap/vue-3'

import Component from '@/views/editor/EditorBlock.vue'

export default Node.create({
  name: 'editorBlock',
  group: 'block',
  content: 'block',
  draggable: true,
  parseHTML() {
    return [
      {
        tag: 'div[data-type="editor-block"]',
      },
    ]
  },
  renderHTML({ HTMLAttributes }) {
    return ['div', mergeAttributes(HTMLAttributes, { 'data-type': 'editor-block' }), 0]
  },
  addNodeView() {
    return VueNodeViewRenderer(Component)
  },
  addCommands() {
    return {
      addEditorBlock: () => ({ chain }) => {
        /*console.log('this.editor',this.editor)
        return chain()
          .selectParentNode()
          .selectParentNode()
          .createParagraphNear()
          .run();*/

      },
    }
  },
})