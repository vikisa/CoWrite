<template>
  <bubble-menu
      v-if="editor"
      :editor="editor"
      :update-delay="0"
      :tippy-options="{ duration: 100 }"
      :should-show="shouldShow"
  >
    <div class="link-menu-container">
      <el-input v-model="href" placeholder="URL">
        <template #append>
          <el-button :disabled="!href.length" @click="updateLink">
            <i class="fa-solid fa-check"></i>
          </el-button>
        </template>
      </el-input>
    </div>
  </bubble-menu>
</template>

<script>
import { BubbleMenu } from '@tiptap/vue-3';
import {isNodeActive} from "@tiptap/core";
export default {
  components: { BubbleMenu },
  props: ['editor'],
  data() {
    return {
      href: ''
    }
  },
  methods: {
    shouldShow({ editor }) {
      return isNodeActive(editor.view.state, 'link');
    },
    updateLink() {
      const myNodePos = this.editor.$pos(this.editor.state.selection.anchor + 1);
      myNodePos.setAttribute({ href: this.href });
      this.href = '';
    }
  }
}
</script>

<style lang="scss" scoped>
.link-menu-container {
  background-color: white;
  border: 2px solid #dcdfe6;
  border-radius: 0.5rem;
}
</style>