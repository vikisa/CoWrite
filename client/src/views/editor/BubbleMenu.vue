<template>
  <bubble-menu
      v-if="editor"
      :editor="editor"
      :update-delay="0"
      :tippy-options="{ duration: 100 }"
      :should-show="shouldShow"
  >
    <div class="inline-menu-container">
      <el-button @click="editor.chain().focus().toggleBold().run()"
                 :class="{ 'is-active': editor.isActive('bold') }"
      >
        <i class="fa-solid fa-bold"/>
      </el-button>
      <el-button @click="editor.chain().focus().toggleItalic().run()"
                 :class="{ 'is-active': editor.isActive('italic') }"
      >
        <i class="fa-solid fa-italic"/>
      </el-button>
<!--      <el-button @click="editor.chain().focus().toggleDirectSpeech().run()"
                 :class="{ 'is-active': editor.isActive('strike') }"
      >
        <i class="fa-solid fa-angles-left"/>
      </el-button>-->
      <el-button @click="editor.chain().focus().insertLink().run()">
        <i class="fa-solid fa-link"></i>
      </el-button>
    </div>
  </bubble-menu>
</template>

<script>
import { BubbleMenu } from '@tiptap/vue-3'
export default {
  components: { BubbleMenu },
  props: ['editor'],
  methods: {
    shouldShow({ editor, view, state, oldState, from, to }) {
      return from !== to && !document.querySelector('a.ProseMirror-selectednode');
    }
  }
}
</script>

<style lang="scss" scoped>
.inline-menu-container {
  background-color: white;
  border: 2px solid #dcdfe6;
  border-radius: 0.5rem;

  .el-button {
    border: none;
  }

  .el-button + .el-button {
    margin-left: 0;
  }
}
</style>