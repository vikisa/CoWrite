<template>
  <div class="editor-container" v-if="editor">
    <BubbleMenu :editor="editor" />
    <LinkBubbleMenu :editor="editor" />
    <EditorContent :editor="editor" />
  </div>
</template>

<script>
import * as Y from 'yjs';
import { Editor, EditorContent } from "@tiptap/vue-3";
import Collaboration from "@tiptap/extension-collaboration";
import CollaborationCursor from "@tiptap/extension-collaboration-cursor";
import { WebrtcProvider } from "y-webrtc";
import {mapGetters} from "vuex";
import  { Extensions } from '@/plugins/tiptap-collab';
import BubbleMenu from "@/views/editor/BubbleMenu.vue";
import LinkBubbleMenu from "@/views/editor/LinkBubbleMenu.vue";

export default {
  components: {
    EditorContent,
    BubbleMenu,
    LinkBubbleMenu
  },
  data() {
    return {
      provider: null,
      editor: null,
    }
  },
  computed: {
    ...mapGetters(['userFullName','getColour'])
  },
  mounted() {
    const ydoc = new Y.Doc();
    this.provider = new WebrtcProvider("tiptap-test-1", ydoc);

    this.editor = new Editor({
      cursorStartPos: 0,
      cursorEndPos: 0,
      onTransaction({ transaction }) {
        this.options.cursorStartPos = transaction.selection.$from.pos;
        this.options.cursorEndPos = transaction.selection.$to.pos;
      },
      extensions: [
        ...Extensions,
        /*Collaboration.configure({
          document: ydoc,
        }),*/
        /*CollaborationCursor.configure({
          provider: this.provider,
          user: {
            name: this.userFullName,
            color: this.getColour
          }
        })*/
      ],
      editorProps: {
        handleDOMEvents: {
          dragend: (slice, move) => {
            this.editor.commands.setTextSelection(this.editor.options.cursorStartPos)
          }
        }
      }
    });
    this.editor.commands.setContent(
        '<p>I’m running Tiptap with Vue.js. 🎉</p>' +
        '<p>I’m running 111111111111</p>' +
        '<p>Followed 2222222</p>' +
        '<p>I’m running Tiptap 3333333</p>' +
        '<blockquote>Nothing is impossible, the word itself says “I’m possible!”</blockquote>' +
        '<h3>This is a 3rd level heading</h3>' +
        '<p class="help-comment">qwe</p>' +
        '<p class="editor-comment">qwe</p>' +
        '<ul><li>A list item</li><li>And another one</li></ul>' +
        '<ol><li>one</li><li>two</li></ol>' +
        '<table><tbody><tr><th>Name</th><th colspan="3">Description</th></tr><tr>' +
        '<td>Cyndi Lauper</td><td>singer</td><td>songwriter</td><td>actress</td></tr></tbody></table>'
    );
  },
  methods: {
  },
  beforeUnmount() {
    this.editor.destroy();
    this.provider.destroy();
  },
}
</script>

<style lang="scss" scoped>
.editor-container {
  &:deep(.ProseMirror) {
    outline: none !important;
    margin-left: 72px;
    border: 2px solid #dcdfe6;
    border-radius: 0.5rem;

    & > * {
      //max-width: 42rem;

      margin: 20px 10px;
    }

    p {
      line-height: 32px;
    }

    blockquote {
      padding-left: 1rem;
      border-left: 3px solid rgba(#0D0D0D, 0.1);
      margin-inline-start: 20px;
      margin-inline-end: 20px;
    }

    .help-comment,
    .editor-comment {
      padding: 10px 30px !important;
      margin: 10px 0 10px;
    }

    .help-comment {
      background-color: #fff0e2;
    }

    .editor-comment {
      background-color: #f0e8f9;
    }

    table {
      border-collapse: collapse;
      table-layout: fixed;
      width: 100%;
      margin: 0;
      overflow: hidden;

      td,
      th {
        min-width: 1em;
        border: 2px solid #ced4da;
        padding: 3px 5px;
        vertical-align: top;
        box-sizing: border-box;
        position: relative;

        > * {
          margin-bottom: 0;
        }
      }

      th {
        font-weight: bold;
        text-align: left;
        background-color: #f1f3f5;
      }

      .selectedCell:after {
        z-index: 2;
        position: absolute;
        content: "";
        left: 0; right: 0; top: 0; bottom: 0;
        background: rgba(200, 200, 255, 0.4);
        pointer-events: none;
      }

      .column-resize-handle {
        position: absolute;
        right: -2px;
        top: 0;
        bottom: -2px;
        width: 4px;
        background-color: #adf;
        pointer-events: none;
      }

      p {
        margin: 0;
      }
    }

    .tableWrapper {
      padding: 1rem 0;
      overflow-x: auto;
    }

    .resize-cursor {
      cursor: ew-resize;
      cursor: col-resize;
    }
  }
}

/*.ProseMirror {
  margin-left: 72px;
  border-radius: 0.5rem;
  padding: 0.7rem;
  border: 2px solid #dcdfe6;
}*/

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