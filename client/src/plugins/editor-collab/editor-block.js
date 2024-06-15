import { mergeAttributes, Node } from '@tiptap/core'
import { VueNodeViewRenderer } from '@tiptap/vue-3'
import { Plugin } from '@tiptap/pm/state';
import { customAlphabet } from 'nanoid';
const nanoid = customAlphabet('1234567890abcdef', 10)
import Component from '@/views/components/editor-collab/EditorBlock.vue'

const types = {
  ['editorBlock']: true,
}

export default Node.create({
  name: 'editorBlock',
  group: 'block',
  content: 'block',
  draggable: true,
  selectable: true,
  addAttributes() {
    return {
      number: {
        default: 0,
      },
    }
  },
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
        return chain()
          .selectParentNode()
          .selectParentNode()
          .createParagraphNear()
          .run();
      },
    }
  },
  addGlobalAttributes() {
    return [
      {
        types: Object.keys(types),
        attributes: {
          blockId: {
            default: null,
            rendered: true,
            keepOnSplit: false,
          },
        },
      },
    ]
  },
  addProseMirrorPlugins() {
    const { editor } = this;

    return [
      new Plugin({
        appendTransaction: (_transactions, oldState, newState) => {
          if (newState.doc === oldState.doc) {
            return
          }
          const tr = newState.tr

          newState.doc.descendants((node, pos, parent) => {
            if (
              node.isBlock &&
              parent === newState.doc &&
              !node.attrs.blockId &&
              types[node.type.name]
            ) {
              tr.setNodeMarkup(pos, undefined, {
                ...node.attrs,
                blockId: nanoid(),
              })
            }
          })

          return tr
        },
      }),
    ]
  },
})