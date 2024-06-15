<template>
  <div v-if="editor" class="editor-add-comment-container">
    <editor-content class="editor-add-comment" :editor="editor" />
    <el-button @click="addComment" :disabled="editor.isEmpty" size="small">
      <i class="fa-solid fa-circle-up"></i>
    </el-button>
  </div>
</template>

<script>
import { Editor, EditorContent } from '@tiptap/vue-3'
import { CommentExtensions } from '@/plugins/editor-comment';
import Mention from '@tiptap/extension-mention';
import suggestion from '@/plugins/editor-comment/suggestion';
import { mapState, mapGetters } from "vuex";
import dayjs from "dayjs";

export default {
  props: ['blockId'],
  components: { EditorContent },
  data() {
    return {
      editor: null,
      comment: '',
      suggestion: suggestion
    }
  },
  computed: {
    ...mapGetters(['editors', 'materialData', 'userData']),
  },
  mounted() {
    this.suggestion.items = () => {
      return this.editors
    };

    this.editor = new Editor({
      content: this.comment,
      extensions: [
        ...CommentExtensions,
        Mention.configure({
          HTMLAttributes: {
            class: 'mention',
          },
          suggestion
        })
      ]
    })
  },
  methods: {
    async addComment() {
      const comment = {
        editingId: this.materialData.editingId,
        blockId: this.blockId,
        userId: this.userData.id,
        timestamp: dayjs().unix(),
        text: this.editor.getHTML()
      }

      this.editor.commands.setContent('');

      await fetch(`${process.env.APP_ROOT_API}comment/comment`, {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        credentials: 'include',
        body: JSON.stringify(comment)
      });

      this.$store.commit('setOpenedAddComment', '')
    }
  },
  beforeUnmount() {
    this.editor.destroy()
  },
}
</script>

<style lang="scss" scoped>
.editor-add-comment-container {
  display: flex;
  gap: 10px;
}

.editor-add-comment {
  flex: 1 1 auto;

  &:deep(.tiptap) {
    outline: none;

    p.is-editor-empty:first-child::before {
      color: #adb5bd;
      content: attr(data-placeholder);
      float: left;
      height: 0;
      pointer-events: none;
    }

    .mention {
      background-color: rgba(88, 5, 255, .05);
      border-radius: 0.4rem;
      box-decoration-break: clone;
      color: #6A00F5;
      padding: 0.1rem 0.3rem;
    }
  }
}

.el-button {
  //border: none;
}
</style>