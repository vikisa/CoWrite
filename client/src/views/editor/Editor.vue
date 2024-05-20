<template>
  <div class="editor-container">
    <bubble-menu :editor="editor" />
    <editor-content :editor="editor" />
    <pre><code>{{ output }}</code></pre>
    <pre><code>{{ outputHTML }}</code></pre>
  </div>
</template>

<script>
import { Editor, EditorContent } from '@tiptap/vue-3';
import  { Extensions } from '@/plugins/tiptap';
import BubbleMenu from "@/views/editor/BubbleMenu.vue";

import IconGripDotsVertical from "@/components/icons/IconGripDotsVertical.vue";
import { generateJSON, generateHTML } from '@tiptap/html'

export default {
  components: {
    EditorContent,
    IconGripDotsVertical,
    BubbleMenu
  },
  data() {
    return {
      editor: null,
      content: '<p>I’m running Tiptap with Vue.js. 🎉</p>' +
          '<p>I’m running 111111111111</p>' +
          '<p>Followed 2222222</p>' +
          '<p>I’m running Tiptap 3333333</p>'
    }
  },
  computed: {
    output() {
      return generateJSON(this.content, Extensions)
    },
    outputHTML() {
      return this.content
    }
  },
  mounted() {
    this.editor = new Editor({
      content: this.content,
      extensions: Extensions
    })
  },
  beforeUnmount() {
    this.editor.destroy()
  },
}
</script>

<style lang="scss" scoped>
.editor-container {
  &:deep(.ProseMirror) {
    outline: none !important;

    & > * {
      max-width: 42rem;

      margin: 20px auto;
    }

    p {
      line-height: 32px;
    }
  }
}


</style>