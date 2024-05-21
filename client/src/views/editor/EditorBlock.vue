<template>
  <node-view-wrapper class="editor-block" @mouseleave="mouseleaveHandler">
    <div class="controls">
      <div @click="addParagraph" class="editor-block-button"
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
        <el-button @click="toggleParagraph" :class="{ 'is-active': isNodeActive('paragraph') }">
          <i class="fa-solid fa-paragraph"></i>
        </el-button>
        <el-button @click="toggleHeading" :class="{ 'is-active': isNodeActive('heading') }">
          <i class="fa-solid fa-heading"></i>
        </el-button>
        <el-button @click="toggleBulletList" :class="{ 'is-active': isNodeActive('bulletList') }">
          <i class="fa-solid fa-list-ul"></i>
        </el-button>
        <el-button @click="toggleOrderedList" :class="{ 'is-active': isNodeActive('orderedList') }">
          <i class="fa-solid fa-list-ol"></i>
        </el-button>
        <el-button @click="toggleBlockquote(isNodeActive('blockquote'))" :class="{ 'is-active': isNodeActive('blockquote') }">
          <i class="fa-solid fa-quote-left"></i>
        </el-button>
        <el-button @click="toggleHelpComment" :class="{ 'is-active': isNodeActive('help-comment') }">
          <i class="fa-solid fa-info"></i>
        </el-button>
        <el-button @click="toggleEditorComment" :class="{ 'is-active': isNodeActive('editor-comment') }">
          <i class="fa-solid fa-pen"></i>
        </el-button>
        <el-button @click="toggleTable" :class="{ 'is-active': isNodeActive('table') }">
          <i class="fa-solid fa-table"></i>
        </el-button>
      </div>
    </div>
    <node-view-content class="content" />
  </node-view-wrapper>
</template>

<script>
import { NodeViewContent, nodeViewProps, NodeViewWrapper } from '@tiptap/vue-3'
import IconGripDotsVertical from "@/components/icons/IconGripDotsVertical.vue";

export default {
  props: nodeViewProps,
  data() {
    return {
      visible: false
    }
  },
  components: {
    NodeViewWrapper,
    NodeViewContent,
    IconGripDotsVertical
  },
  computed: {},
  methods: {
    mouseleaveHandler() {
      this.visible = false;
    },
    addParagraph() {
      this.editor.commands.insertContentAt(
          1,
          '<p></p>',
          {
            updateSelection: true,
          }
      );
    },
    selectEditorBlockContent() {
      const editorBlock = this.editor.$pos(this.getPos() + 1);
      const editorBlockContent = editorBlock.firstChild;
      this.editor.commands.setTextSelection(editorBlockContent.pos);
      console.log(
          'selectedNode',
          this.editor.$pos(editorBlockContent.pos).node.type.name,
          this.editor.$pos(editorBlockContent.pos).node
      )
    },
    openBlockMenu() {
      this.selectEditorBlockContent();

      this.visible = !this.visible;

      /*this.editor.commands.setTextSelection(this.getPos() + 1)

      this.editor.commands.insertContentAt(
          1,
          '<p>Followed by a fancy draggable item.</p>'
      );*/

      /*this.editor.commands.insertContentAt(
          1,
        {
          type: 'editorBlock',
          content: [
            {
              type: 'paragraph',
              content: [
                {
                  type: 'text',
                  text: 'First paragraph',
                },
              ],
            }
          ],
        },
        {
          updateSelection: true,
        }
      )*/
    },
    isNodeActive(typeName) {
      return this.editor.isActive(typeName);
    },
    toggleParagraph() {
      this.editor.commands.clearNodes();
      this.selectEditorBlockContent();
    },
    toggleHeading() {
      this.editor.commands.toggleHeading({ level: 3 });
      this.selectEditorBlockContent();
    },
    toggleBulletList() {
      this.editor.commands.toggleBulletList();
    },
    toggleOrderedList() {
      this.editor.commands.toggleNode('paragraph', 'orderedList')
      //this.editor.commands.toggleOrderedList();
    },
    toggleNode() {
      this.editor.commands.toggleNode('paragraph', 'orderedList')
    },
    toggleBlockquote(isBlockquote) {
      console.log('isBlockquote',isBlockquote)
      console.log('this.editor.isActive(\'blockquote\')',this.editor.isActive('blockquote'))
      return;
      if (this.editor.isActive('blockquote')) {
        console.log('blockquote')
        this.editor.commands.clearNodes();
        this.selectEditorBlockContent();
      }
      else {
        this.editor.commands.setBlockquote();
        this.selectEditorBlockContent();
      }
    },
    toggleHelpComment() {
      if (this.isNodeActive('help-comment'))
        this.editor.commands.setParagraph();
      else
        this.editor.commands.setHelpComment();

      //this.editor.commands.clearNodes();
      //console.log('toggleHelpComment', this.node.firstChild)
    },
    toggleEditorComment() {
      this.editor.commands.toggleEditorComment();
    },
    toggleTable() {
      if (this.isNodeActive('table'))
        this.editor.commands.deleteTable();
      else
        this.editor.commands.insertTable({ rows: 3, cols: 3, withHeaderRow: true })

    }
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
      height: 32px;
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