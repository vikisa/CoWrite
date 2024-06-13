<template>
  <div class="editor-container">
    <LinkMenu v-if="editor" :editor="editor" />
    <InlineMenu v-if="editor" :editor="editor" />
    <EditorContent v-if="editor" :editor="editor" />
  </div>
</template>

<script>
import * as Y from 'yjs';
import { EditorContent, Editor} from "@tiptap/vue-3";
import { Extensions } from '@/plugins/editor-collab';
import Collaboration from "@tiptap/extension-collaboration";
import CollaborationCursor from "@tiptap/extension-collaboration-cursor";
import { mapGetters, mapState } from "vuex";
import { HocuspocusProvider } from "@hocuspocus/provider";
import InlineMenu from "@/views/components/editor-collab/InlineMenu.vue";
import LinkMenu from "@/views/components/editor-collab/LinkMenu.vue";

export default {
  components: {
    EditorContent,
    InlineMenu,
    LinkMenu
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
      url: process.env.APP_COLLAB_API,
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
      name: this.userFullName,
      color: this.getColour,
    });

    this.editor = new Editor({
      extensions: [
        ...Extensions,
        Collaboration.configure({
          document: ydoc,
        }),
        CollaborationCursor.configure({
          provider: this.provider,
          user: {
            name: this.userFullName,
            color: this.getColour
          }
        }),
      ],
      editorProps: {
        handleDOMEvents: {
          drop: () => {
            const myNodePos = this.editor.$pos(this.editor.state.selection.anchor + 1);
            this.$nextTick(() => {
              this.editor.commands.setTextSelection(this.editor.state.selection.anchor + myNodePos.node.nodeSize - 1)
            });
          },
        }
      }
    });
    this.editor.commands.setContent(this.materialData.text);
  },
  beforeUnmount() {
    this.editor.destroy();
    this.provider.destroy();
  },
}
</script>

<style lang="scss" scoped>
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