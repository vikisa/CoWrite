<template>
  <template v-if="notExceedConnects">
    <teleport to=".header-container">
      <div class="material-header">
        <Editors v-if="editor" :online="editor.storage.collaborationCursor.users"/>
        <el-divider direction="vertical" />
        <div class="editor-info-container">
          <div class="editor-name">
            <span>{{ userFullName }}</span>
            <i :class="['fa-solid', 'fa-circle', { 'connected': authenticated && loaded }]"></i>
          </div>
          <div class="editor-mode">{{ readOnly ? 'Режим чтения' : 'Режим редактирования' }}</div>
        </div>
      </div>
    </teleport>

    <el-row :gutter="40" v-if="!isLoading && isPageLoaded">
      <el-col :span="16" class="material-container">
        <el-input :disabled="materialData.creatorId !== userData.id || readOnly"
                  class="header"
                  placeholder="Без названия"
                  v-model="materialData.header"
        >
          <template #append>
            <el-button @click="saveHeader"
                       :disabled="materialData.header.length < 2 || materialData.creatorId !== userData.id || readOnly">
              <i v-loading="isHeaderSaving" class="fa-regular fa-floppy-disk"/>
            </el-button>
          </template>
        </el-input>

        <div class="editor-container" v-if="editorLoaded">
          <LinkMenu v-if="editor" :editor="editor" />
          <InlineMenu v-if="editor" :editor="editor" />
          <EditorContent v-if="editor" :editor="editor" />
        </div>
      </el-col>
      <el-col :span="8">
        <!--      history1-->
      </el-col>
    </el-row>
  </template>
  <template v-else>
    <el-row justify="center">
      <el-col :span="12">
        <el-card style="max-width: 480px; text-align: center;" shadow="never">
          <template #header>
            Слишком много пользователей просматривает материал
          </template>
          <img
              src="https://www.pravilamag.ru/upload/img_cache/359/359d20e52304a5bd8d407133576edb2e_cropped_666x666.jpg"
              style="width: 100%"
          />
          <el-button @click="$router.push({ name: 'list' })">На ленту</el-button>
        </el-card>
      </el-col>
    </el-row>
  </template>
</template>

<script>
import * as Y from "yjs";
import { customAlphabet } from 'nanoid';
import {IndexeddbPersistence} from "y-indexeddb";
import {HocuspocusProvider} from "@hocuspocus/provider";
import {mapGetters, mapState} from "vuex";
const nanoid = customAlphabet('1234567890abcdef', 16);
import { store } from '@/store';
import router from '@/router';
import {Editor, EditorContent} from "@tiptap/vue-3";
import {Extensions} from "@/plugins/editor-collab/index.js";
import Collaboration from "@tiptap/extension-collaboration";
import CollaborationCursor from "@tiptap/extension-collaboration-cursor";
import dayjs from "dayjs";
import InlineMenu from "@/views/components/editor-collab/InlineMenu.vue";
import LinkMenu from "@/views/components/editor-collab/LinkMenu.vue";
import Editors from '@/views/components/editor-collab/Editors.vue';
import _ from 'lodash';

export default {
  data() {
    return {
      editingId: null,
      editor: null,
      isPageLoaded: false,
      editorLoaded: false,
      isHeaderSaving: false,
      notExceedConnects: true
    }
  },
  components: { EditorContent, InlineMenu, LinkMenu, Editors },
  computed: {
    ...mapState(['isLoading']),
    ...mapGetters([
      'editorToken',
      'showNotification',
      'authenticated',
      'userData',
      'userFullName',
      'getColour',
      'loaded',
      'materialData',
      'readOnly'
    ]),
  },
  created() {
    this.ydoc = new Y.Doc();
  },
  watch: {
    readOnly(value) {
      this.editor.setOptions({ editable: !value });
      const user = _.find(this.editor.storage.collaborationCursor.users, user =>
        user.clientId === this.ydoc.clientID
      );
      user.readOnly = value;
      this.editor.commands.updateUser(user);
    }
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
      this.$store.commit('setMaterial', responseMaterial.material);
    }
    else {
      this.showNotification('Ошибка при загрузке материала', 'error', 0, {});
    }

    // получаем количество редакторов и подключенных редакторов
    await this.$store.dispatch('getEditors', this.editingId);

    // получаем комментарии
    await this.$store.dispatch('getComments', this.editingId);

    this.isPageLoaded = true;
  },
  methods: {
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
          store.commit('setEditorMode', this.authorizedScope === 'read-only')
        },
        onAuthenticationFailed: ({ reason }) => {
          this.showNotification(reason, 'error', 0, {});
          router.push({ name: 'list' })
         },
        onSynced() { store.commit('setLoaded', true) },
        onDisconnect() { store.commit('setAuthenticated', false); }
      });

      this.editor = new Editor({
        editable: false,
        extensions: [
          ...Extensions,
          Collaboration.configure({
            document: this.ydoc,
          }),
          CollaborationCursor.configure({
            provider: this.provider,
            user: {
              id: this.userData.id,
              name: this.userFullName,
              color: this.getColour,
              readOnly: this.readOnly
            }
          }),
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

      if (_.filter(this.editor.storage.collaborationCursor.users, client => client.readOnly).length >= 10)
        this.notExceedConnects = false;

      this.editorLoaded = true;
    },
    async saveHeader() {
      this.isHeaderSaving = true;

      await fetch(`${process.env.APP_ROOT_API}material/saveHeader/${this.editingId}`, {
        method: 'PATCH',
        headers: {'Content-Type': 'application/json'},
        credentials: 'include',
        body: JSON.stringify({
          header: this.materialData.header,
        })
      }).then(() => {
        setTimeout(() => {
          this.isHeaderSaving = false;
        }, 1500)
      });
    }
  },
  async beforeUnmount() {
    this.$store.commit('unsetMaterialData');
    if (this.editor) this.editor.destroy();
    if (this.provider) this.provider.destroy();
  }
}
</script>

<style lang="scss" scoped>
.header {
  margin-left: 72px;
  max-width: 100%;
  box-sizing: border-box;
  width: calc(100% - 72px);
  font-size: large;

  &:deep(.el-button) {
    .el-loading-mask {
      top: -5px;
      left: -16px;
      width: 43px;

      .el-loading-spinner {
        top: unset;
        margin-top: unset;

        svg {
          height: 25px;
        }
      }
    }
  }
}

.material-container {
  display: flex;
  flex-direction: column;
  gap: 30px;
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