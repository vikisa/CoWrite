<template>
  <div class="comments">
    <div v-for="(comment, i) in comments" :key="i" class="comment-item">
      <div class="header">
        <span class="editor">{{ comment.userData.name }}</span>
        <span class="time" :title="getDate(comment.timestamp)">{{ getHours(comment.timestamp) }}</span>
      </div>
      <div class="text" v-html="comment.text"></div>
      <el-divider />
    </div>
    <AddComment :block-id="blockId"/>
  </div>
</template>

<script>
import dayjs from 'dayjs';
import AddComment from '@/views/components/editor-collab/AddComment.vue';
export default {
  props: ['blockId', 'comments'],
  components: { AddComment },
  data() {
    return {

    }
  },
  methods: {
    getHours(timestamp) {
      return dayjs.unix(timestamp).format('h:mm');
    },
    getDate(timestamp) {
      return dayjs.unix(timestamp).format('MM.DD.YYYY');
    }
  }
}
</script>

<style lang="scss" scoped>
.comments {
  padding: 5px;
}

.comment-item:last-of-type {
  .el-divider {
    display: none;
  }
}

.header {
  display: flex;
  align-items: flex-end;
  gap: 10px;

  .editor {
    font-weight: bold;
  }

  .time {
    opacity: 0.8;
    font-size: 12px;
  }
}

.text {
  margin-top: 10px;

  &:deep(.mention) {
    background-color: rgba(88, 5, 255, .05);
    border-radius: 0.4rem;
    box-decoration-break: clone;
    color: #6A00F5;
    padding: 0.1rem 0.3rem;
  }
}

.el-divider {
  margin: 15px 0;
}
</style>