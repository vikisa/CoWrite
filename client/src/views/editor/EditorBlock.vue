<template>
  <node-view-wrapper class="editor-block">
    <div class="controls">
      <div class="editor-block-button"
           contenteditable="false">
        <i class="fa-solid fa-plus"/>
      </div>

      <div class="editor-block-button"
           contenteditable="false"
           draggable="true"
           data-drag-handle>
        <IconGripDotsVertical/>
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

  components: {
    NodeViewWrapper,
    NodeViewContent,
    IconGripDotsVertical
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
}
</style>