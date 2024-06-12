<template>
  <EditorContent :editor="editor" />
</template>

<script>
import * as Y from 'yjs';
import { EditorContent, Editor} from "@tiptap/vue-3";
import Document from '@tiptap/extension-document'
import Paragraph from '@tiptap/extension-paragraph'
import Text from '@tiptap/extension-text'
import Collaboration from "@tiptap/extension-collaboration";
import CollaborationCursor from "@tiptap/extension-collaboration-cursor";
import InlineMenu from "@/views/editor/InlineMenu.vue";
import LinkMenu from "@/views/editor/LinkMenu.vue";
import {mapGetters, mapState} from "vuex";
import {HocuspocusProvider} from "@hocuspocus/provider";

export default {
  components: {
    EditorContent,
    InlineMenu,
    LinkMenu,
  },
  data() {
    return {
      materialId: null,
      provider: null,
      editor: null,
    }
  },
  computed: {
    ...mapState([]),
    ...mapGetters(['userFullName','getColour','materialData','userData'])
  },
  mounted() {
    const ydoc = new Y.Doc();

    this.provider = new HocuspocusProvider({
      url: "ws://127.0.0.1:1234/collaboration",
      name: "example-document",
      document: ydoc,
      onOpen() {
        console.log('open')
      },
      onConnect() {
        console.log('connect')
      },
    });

    this.provider.on('status', event => {
      this.status = event.status
    })

    this.provider.on("synced", () => {
      console.log('synced')
    });

    this.provider.setAwarenessField("user", {
      // Share any information you like
      name: this.userFullName,
      color: this.getColour,
    });

    this.editor = new Editor({
      cursorStartPos: 0,
      cursorEndPos: 0,
      onTransaction({ transaction }) {
        this.options.cursorStartPos = transaction.selection.$from.pos;
        this.options.cursorEndPos = transaction.selection.$to.pos;
      },
      extensions: [
        Document,
        Text,
        Paragraph,
        Collaboration.configure({
          document: ydoc,
        }),
        CollaborationCursor.configure({
          provider: this.provider,
          user: {
            name: this.userFullName,
            color: this.getColour
          }
        })
      ],
      /*editorProps: {
        handleDOMEvents: {
          drop: () => {
            const myNodePos = this.editor.$pos(this.editor.options.cursorStartPos + 1);
            this.$nextTick(() => {
              this.editor.commands.setTextSelection(this.editor.options.cursorStartPos + myNodePos.node.nodeSize - 1)
            });
          },
        }
      }*/
    });
    this.editor.commands.setContent(this.materialData.text);
    //this.editor.commands.setTextSelection(3);
  },
  beforeUnmount() {
    this.editor.destroy();
    this.provider.destroy();
  },
}
</script>

<style lang="scss">
.ProseMirror {
  font-size: 1.5rem;
  border-radius: 0.5rem;
  padding: 0.7rem;
  border: 2px solid #dcdfe6;
}

/* Give a remote user a caret */
.collaboration-cursor__caret {
  position: relative;
  margin-left: -1px;
  margin-right: -1px;
  border-left: 1px solid #0D0D0D;
  border-right: 1px solid #0D0D0D;
  word-break: normal;
  pointer-events: none;
}

/* Render the username above the caret */
.collaboration-cursor__label {
  position: absolute;
  top: -1.4em;
  left: -1px;
  font-size: 12px;
  font-style: normal;
  font-weight: 600;
  line-height: normal;
  user-select: none;
  color: #0D0D0D;
  padding: 0.1rem 0.3rem;
  border-radius: 3px 3px 3px 0;
  white-space: nowrap;
}
</style>