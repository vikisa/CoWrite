<template>
  <div class="editor-container" v-if="editorLoaded">
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
import { IndexeddbPersistence } from 'y-indexeddb';

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
      editorLoaded: false
    }
  },
  computed: {
    ...mapState([]),
    ...mapGetters(['userFullName','getColour','materialData','userData'])
  },
  mounted() {
    const ydoc = new Y.Doc();

    new IndexeddbPersistence('example-document', ydoc);

    this.provider = new HocuspocusProvider({
      url: process.env.APP_COLLAB_API,
      name: this.materialData.editingId,
      document: ydoc,
      token: process.env.EDITOR_TOKEN,
      onOpen() {
        //console.log('open')
      },
      onConnect() {
        //console.log('connect')
      },
      onSynced() {
        //console.log('synced', ydoc)

        if( !ydoc.getMap('config').get('initialContentLoaded') && this.editor ){
          ydoc.getMap('config').set('initialContentLoaded', true);
          //console.log('initialContentLoaded')

          this.editor.commands.setContent(this.materialData.text)
        }
      },
      onAuthenticated() {
        //console.log('onAuthenticate')
      },
      onMessage() {
        //console.log("New message received.");
      }
    });

    this.provider.on('status', event => {
      this.status = event.status
    })

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
        /*Collaboration.configure({
          fragment: ydoc.getXmlFragment('editorBlock'),
        })*/
      ],
      editorProps: {
        handleDOMEvents: {
          drop: () => {
            const myNodePos = this.editor.$pos(this.editor.state.selection.anchor + 1);
            this.$nextTick(() => {
              this.editor.commands.setTextSelection(this.editor.state.selection.anchor + myNodePos.node.nodeSize - 1);
            });
          },
        }
      }
    });
    //this.editor.commands.setContent(this.materialData.text);

    this.$store.commit('setEditors', [{ id: 1, name: 'Lastname Firstname' }]);
    this.editorLoaded = true;
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
    .collaboration-cursor__caret {
      position: relative;
      margin-left: -1px;
      margin-right: -1px;
      border-left: 1px solid #0D0D0D;
      border-right: 1px solid #0D0D0D;
      word-break: normal;
      pointer-events: none;
    }

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
  }
}
</style>