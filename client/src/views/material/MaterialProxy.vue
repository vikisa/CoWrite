<template>
  <teleport v-if="authenticated" to=".header-container">
    <div class="editor-info-container">
      <div class="editor-name">{{ userFullName }}</div>
      <div class="editor-mode">Режим редактирования</div>
    </div>
  </teleport>

  <el-button @click="qwe">test</el-button>
  <el-button @click="rty">yjs</el-button>

  <el-row :gutter="40" v-if="!isLoading && isPageLoaded">
    <el-col :span="18">
      <el-input class="header" v-model="materialData.header"/>
      <div class="editor-container" v-if="editorLoaded">
        <LinkMenu v-if="editor" :editor="editor" />
        <InlineMenu v-if="editor" :editor="editor" />
        <EditorContent v-if="editor" :editor="editor" />
      </div>
    </el-col>
    <el-col :span="6">
      <!--      history1-->
    </el-col>
  </el-row>
</template>

<script>
import * as Y from "yjs";
import { customAlphabet } from 'nanoid';
import {IndexeddbPersistence} from "y-indexeddb";
import {HocuspocusProvider} from "@hocuspocus/provider";
import {mapGetters, mapState} from "vuex";
const nanoid = customAlphabet('1234567890abcdef', 16);
import { store } from '@/store';
import {Editor, EditorContent} from "@tiptap/vue-3";
import {Extensions} from "@/plugins/editor-collab/index.js";
import Collaboration from "@tiptap/extension-collaboration";
import CollaborationCursor from "@tiptap/extension-collaboration-cursor";
import dayjs from "dayjs";
const ydoc = new Y.Doc();
import InlineMenu from "@/views/components/editor-collab/InlineMenu.vue";
import LinkMenu from "@/views/components/editor-collab/LinkMenu.vue";

export default {
  data() {
    return {
      //ydoc: ydoc,
      editingId: null,
      editor: null,
      isPageLoaded: false,
      editorLoaded: false
    }
  },
  components: { EditorContent, InlineMenu, LinkMenu },
  computed: {
    ...mapState(['isLoading']),
    ...mapGetters([
        'editorToken', 'showNotification', 'authenticated', 'userData', 'userFullName', 'getColour', 'docStore', 'loaded', 'materialData']),
  },
  created() {
    this.ydoc = new Y.Doc();
  },
  async mounted() {
    // получаем или создаем id
    await this.$router.isReady();
    let editingId = this.$route.params?.editingId || null;

    if (!editingId) {
      editingId = nanoid();
      await this.$router.push({ path: `/material/edit/${editingId}` })
    }
    this.editingId = editingId;

    // получаем или создаем текст материала
    await this.initProvider();

    // получаем или создаем материал
    const response = await fetch(`${process.env.APP_ROOT_API}material/getOrCreate`, {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      credentials: 'include',
      body: JSON.stringify({
        createDate: dayjs().unix(),
        saveDate: 0,
        text: '',
        header: '',
        creatorId: this.userData.id,
        editingId: this.editingId
      })
    });

    if (response.ok) {
      const responseMaterial = await response.json();
      console.log('responseMaterial',responseMaterial)
      this.showNotification(responseMaterial.message, null, 0, {});
      this.$store.commit('setMaterial', responseMaterial.material);
    }
    else {
      this.showNotification('Ошибка при загрузке материала', 'error', 0, {});
    }

    // получаем количество редакторов

    // получаем количество подключенных редакторов

    // получаем комментарии
    await this.$store.dispatch('getComments', this.editingId);

    this.isPageLoaded = true;
  },
  methods: {
    qwe() {
      console.log(this.editor.getJSON())
      console.log(JSON.stringify(this.editor.getJSON()))
    },
    rty() {
      console.log('ydoc', this.ydoc)
      console.log('ydoc', this.ydoc.getMap())
    },
    async initProvider() {
      this.ydoc = new Y.Doc();

      //new IndexeddbPersistence(this.editingId, this.ydoc);

      this.provider = new HocuspocusProvider({
        url: process.env.APP_COLLAB_API,
        name: this.editingId,
        document: this.ydoc,
        token: this.editorToken,
        onAuthenticated() {
          store.commit('setAuthenticated', true);
        },
        onAuthenticationFailed: ({ reason }) => {
          this.showNotification(reason, 'error', 0, {});
        },
        onOutgoingMessage({ message }) {
          //console.log('onOutgoingMessage',message)
        },
        onSynced({ state }) {
          store.commit('setLoaded', true);
        }
      });

      this.editor = new Editor({
        extensions: [
          ...Extensions,
          Collaboration.configure({
            document: this.ydoc,
          }),
          /*CollaborationCursor.configure({
            provider: this.provider,
            user: {
              name: this.userFullName,
              color: this.getColour
            }
          }),*/
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

      this.editorLoaded = true;
    }
  },
  beforeUnmount() {
    this.editor.destroy();
    this.provider.destroy();
  }
}
</script>

<style lang="scss" scoped>
.header {
  margin-left: 72px;
  max-width: 100%;
  box-sizing: border-box;
  width: calc(100% - 72px);
  margin-bottom: 20px;
}

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