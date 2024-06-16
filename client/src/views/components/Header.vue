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

  &:deep(.editor-info-container) {
    padding: 0px 20px;
  }
}

.editor-info-container {

}
</style>