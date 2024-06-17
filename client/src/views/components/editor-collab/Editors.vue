<template>
  <el-popover
      placement="top"
      :width="270"
      trigger="click"
  >
    <template #reference>
      <el-button class="editors-info">
        <i class="fa-solid fa-users"></i>
      </el-button>
    </template>
    <template #default>
      <div class="editors-list">
        <el-divider content-position="left">
          Редакторов: {{ editors.length }}
        </el-divider>
        <div class="editor" v-for="editor in editorsWithStatus">
          <span class="name">{{ editor.userFullName }}</span>
          <span class="icon">
            <i :class="['fa-solid', 'fa-circle', { 'connected': editor.online }]">
            </i>
          </span>
        </div>
        <el-divider style="margin-top: 20px;" content-position="left">
          Пользователей онлайн: {{ online.length }}
        </el-divider>
        <div class="editor" v-for="editor in online">
          <span class="name">{{ editor.name }}</span>
          <i :class="['fa-solid', 'fa-circle', 'connected']"></i>
        </div>
      </div>
    </template>
  </el-popover>
</template>

<script>
import { mapGetters, mapState } from "vuex";
import _ from 'lodash';

export default {
  props: ['online'],
  data() {
    return {}
  },
  computed: {
    ...mapGetters(['editors']),
    readOnlyList() {
      return _.filter(this.online, editorOnline => {
        !_.find(this.editors, editor => {
          return editor.id === editorOnline.id
        });
      });
    },
    editorsWithStatus() {
      return _.forEach(this.editors, editor => {
        editor.online = _.find(this.online, editorOnline => {
          return editor.userId === editorOnline.id
        });
      });
    }
  },
}
</script>

<style lang="scss" scoped>
.editors-info {
  display: flex;
  flex-direction: column;
  gap: 3px;
  font-size: 13px;
  border: none;

  &:hover {
    cursor: pointer;
  }
}

.editors-list {
  .editor {
    display: flex;
    justify-content: space-between;

    &:last-of-type {
      margin-top: 20px;
    }

    i {
      font-size: 11px;
      color: #E6A23C;

      &.connected {
        color: #67C23A;
      }
    }
  }

  .editor + .editor {
    margin-top: 3px;
  }

  .el-divider {
    margin: 10px 0 20px;
  }
}
</style>