<template>
  <node-view-wrapper class="editor-block" @mouseleave="mouseleaveHandler">
    <div class="controls">
      <div @click="addContent('<p></p>')" class="editor-block-button"
           contenteditable="false">
        <i class="fa-solid fa-plus"/>
      </div>

      <div @click="openBlockMenu" class="editor-block-button menu"
           contenteditable="false"
           draggable="true"
           data-drag-handle>
        <IconGripDotsVertical/>
      </div>

      <div v-if="visible" class="block-menu-container">
        <el-button @click="addContent('<h3></h3>')" :class="{ 'is-active': isNodeActive('heading') }">
          <i class="fa-solid fa-heading"></i>
        </el-button>
        <el-button @click="addContent('<ul><li></li></ul>')" :class="{ 'is-active': isNodeActive('bulletList') }">
          <i class="fa-solid fa-list-ul"></i>
        </el-button>
        <el-button @click="addContent('<ol><li></li></ol>')" :class="{ 'is-active': isNodeActive('orderedList') }">
          <i class="fa-solid fa-list-ol"></i>
        </el-button>
        <el-button @click="addContent('<blockquote></blockquote>')" :class="{ 'is-active': isNodeActive('blockquote') }">
          <i class="fa-solid fa-quote-left"></i>
        </el-button>
        <el-button @click="addContent(helpComment)" :class="{ 'is-active': isNodeActive('help-comment') }">
          <i class="fa-solid fa-info"></i>
        </el-button>
        <el-button @click="addContent(editorComment)" :class="{ 'is-active': isNodeActive('editor-comment') }">
          <i class="fa-solid fa-pen"></i>
        </el-button>
        <el-button @click="addContent(table)" :class="{ 'is-active': isNodeActive('table') }">
          <i class="fa-solid fa-table"></i>
        </el-button>
      </div>
    </div>
    <node-view-content class="content" />
  </node-view-wrapper>
</template>

<script>
import { NodeViewContent, nodeViewProps, NodeViewWrapper } from '@tiptap/vue-3'
import IconGripDotsVertical from "@/views/components/icons/IconGripDotsVertical.vue";

export default {
  props: nodeViewProps,
  data() {
    return {
      visible: false,
      helpComment: '<p class="help-comment"></p>',
      editorComment: '<p class="editor-comment"></p>',
      table: '<table><tbody><tr><th></th><th colspan="3"></th></tr><tr><td></td><td></td><td></td><td></td></tr></tbody></table>'
    }
  },
  components: {
    NodeViewWrapper,
    NodeViewContent,
    IconGripDotsVertical
  },
  computed: {},
  mounted() {
  },
  methods: {
    mouseleaveHandler() {
      this.visible = false;
    },
    addContent(html) {
      this.editor.commands.insertContentAt(
          this.getPos() + this.node.nodeSize,
          html,
          {
            updateSelection: true,
          }
      );
    },
    selectEditorBlockContent() {
      const editorBlock = this.editor.$pos(this.getPos() + 1);
      const editorBlockContent = editorBlock.firstChild;
      this.editor.commands.setTextSelection(editorBlockContent.pos);
    },
    openBlockMenu() {
      this.selectEditorBlockContent();
      this.visible = !this.visible;
    },
    isNodeActive(typeName) {
      return this.editor.isActive(typeName);
    },
  },
}
</script>

<style lang="scss" scoped>
.editor-block {
  display: flex;
  margin: 0.5rem 0;
  border-radius: 0.5rem;
  background: white;
  position: relative;

  &:before {
    content: '';
    position: absolute;
    width: calc(100% + 100px + 10px);
    height: calc(100% + 20px);
    //background-color: #2c3e50;
    right: -10px;
    top: -10px;
    z-index: 0;
  }

  .controls {
    display: none;
    //display: flex;
    position: absolute;
    left: -90px;

    .editor-block-button {
      display: flex;
      align-items: center;
      justify-content: center;

      flex: 0 0 auto;
      width: 37px;
      height: 23px;
      cursor: grab;

      border-radius: 4px;
      color: rgb(96, 98, 102);

      &:hover {
        color: #409eff;
        background-color: #ecf5ff;
      }
    }

    .menu {
      z-index: 5;
    }
  }

  &:hover {
    .controls {
      display: flex;
    }
  }

  .content {
    flex: 1 1 auto;
    z-index: 1;
  }

  .block-menu-container {
    display: flex;
    flex-direction: column;

    width: 45px;
    position: absolute;
    background-color: white;
    border: 2px solid #dcdfe6;
    border-radius: 0.5rem;

    z-index: 4;
    left: -15px;

    &:before {
      content: '';
      position: absolute;
      //background-color: #2c3e50;
      width: calc(100% + 100px);
      height: calc(100% + 50px);
      right: -50px;
      top: -25px;
      z-index: -1;
    }

    .el-button {
      border: none;
    }

    .el-button + .el-button {
      margin-left: 0;
    }
  }
}
</style>