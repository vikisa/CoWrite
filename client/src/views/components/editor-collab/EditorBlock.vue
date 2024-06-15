<template>
  <node-view-wrapper class="editor-block" @mouseleave="mouseleaveHandler">
    <el-popover
        ref="popoverRef"
        trigger="click"
        title="With title"
        virtual-triggering
        persistent
    >
      <span> Some content </span>
    </el-popover>
    <div class="left-control">
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
    <div class="right-control">
      <el-popover
          :teleported="true"
          :visible="openedAddComment === node.attrs.blockId"
          placement="right-start"
          :width="250"
          :offset="48"
          :show-arrow="false"
      >
        <template #reference>
          <div @click="toggleAddComment(openedAddComment === node.attrs.blockId)" class="editor-block-button"
               contenteditable="false">
            <i class="fa-regular fa-comment"></i>
          </div>
        </template>
        <template #default>
          <AddComment :block-id="node.attrs.blockId"/>
        </template>
      </el-popover>
      <el-popover
          :teleported="true"
          :visible="openedComment === node.attrs.blockId"
          placement="right-start"
          :width="250"
          :show-arrow="false"
      >
        <template #reference>
          <div @click="toggleOpenedComment(openedComment === node.attrs.blockId)"
               :class="['editor-block-button', {'disable-button': !showShowCommentsButton}]"
               contenteditable="false">
            <i class="fa-regular fa-eye"></i>
          </div>
        </template>
        <template #default>
          <Comments :block-id="node.attrs.blockId" :comments="comments[node.attrs.blockId]"/>
        </template>
      </el-popover>
    </div>
    <node-view-content :class="['content', {'comment-content': commentContent}]" />
  </node-view-wrapper>
</template>

<script>
import { NodeViewContent, nodeViewProps, NodeViewWrapper } from '@tiptap/vue-3'
import IconGripDotsVertical from "@/views/components/icons/IconGripDotsVertical.vue";
import {mapState,mapGetters} from "vuex";
import AddComment from '@/views/components/editor-collab/AddComment.vue';
import Comments from '@/views/components/editor-collab/Comments.vue';

export default {
  node: {
    type: Object,
  },
  data() {
    return {
      visible: false,
      helpComment: '<p class="help-comment"></p>',
      editorComment: '<p class="editor-comment"></p>',
      table: '<table><tbody><tr><th></th><th colspan="3"></th></tr><tr><td></td><td></td><td></td><td></td></tr></tbody></table>',
      popoverRef: null,
      visibleAddComment: false,
      visibleComments: false,
    }
  },
  components: {
    NodeViewWrapper,
    NodeViewContent,
    IconGripDotsVertical,
    AddComment,
    Comments
  },
  computed: {
    ...mapGetters(['comments', 'openedAddComment', 'openedComment']),
    showShowCommentsButton() {
      return this.comments.hasOwnProperty(this.node.attrs.blockId)
    },
    commentContent() {
      return this.node.attrs.blockId === this.openedComment || this.node.attrs.blockId === this.openedAddComment;
    }
  },
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
    log() {
      console.log(this.node)
    },
    toggleAddComment(clear) {
      this.$store.commit('setOpenedAddComment', clear ? '' : this.node.attrs.blockId)

      if (this.openedAddComment === this.openedComment)
        this.$store.commit('setOpenedComment', '');

      if (!clear)
        this.$store.commit('setOpenedComment', '');
    },
    toggleOpenedComment(clear) {
      this.$store.commit('setOpenedComment', clear ? '' : this.node.attrs.blockId);

      if (this.openedAddComment === this.openedComment)
        this.$store.commit('setOpenedAddComment', '');

      if (!clear)
        this.$store.commit('setOpenedAddComment', '');
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
    width: calc(100% + 100px + 10px + 60px);
    //width: calc(100% + 100px + 10px + 400px);
    height: calc(100% + 20px);
    //background-color: #2c3e50;
    //right: -350px;
    right: -85px;
    top: -10px;
    z-index: 0;
  }

  .left-control, .right-control {
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
  }

  .right-control {
    position: absolute;
    right: -90px;
    display: none;
    //display: flex;

    .disable-button {
      visibility: hidden;
    }
  }

  .left-control {
    display: none;
    //display: flex;
    position: absolute;
    left: -90px;

    .menu {
      z-index: 5;
    }
  }

  &:hover {
    .left-control, .right-control {
      display: flex;
    }
  }

  .content {
    flex: 1 1 auto;
    z-index: 1;
  }

  .comment-content {
    position: relative;

    &:before {
      position: absolute;
      content: '';
      width: calc(100% + 22px);
      height: calc(100% + 1rem);
      background-color: rgb(88 5 255 / 8%);
      z-index: -1;
      top: -8px;
      left: -11px;
    }
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