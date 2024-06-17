<template>
  <div class="header-container">
    <img
        style="width: 100px; padding: 0 20px;"
        src="/cat.gif"
        alt="logo"
    />

  </div>
</template>

<script>
export default {
  data() {
    return {

    }
  }
}
</script>

<style lang="scss" scoped>
.header-container {
  border-bottom: solid 1px var(--el-menu-border-color);
  display: flex;
  align-items: center;
  justify-content: space-between;

  &:deep(.material-header) {
    display: flex;
    flex-direction: row;
    align-items: stretch;

    .el-divider {
      height: unset;
    }
  }

  &:deep(.editors-info) {
    margin-right: 20px;
  }

  &:deep(.editor-info-container) {
    display: flex;
    flex-direction: column;
    gap: 3px;
    padding: 0 20px;

    .editor-name {
      display: flex;
      gap: 10px;
      align-items: baseline;
      font-weight: bold;

      i {
        font-size: 11px;
        color: #E6A23C;

        &.connected {
          color: #67C23A;
        }
      }
    }

    .editor-mode {
      opacity: 0.6;
      font-size: 12px;
    }
  }
}
</style>