<template>
  <el-container class="main-container">
    <el-aside v-if="isAuthenticated">
      <el-menu
          class="menu"
          :router="false"
          :collapse="isCollapse"
          :default-active="activeLink"
          @select="handleSelectItem"
      >
        <el-menu-item index="list">
          <el-icon><Memo /></el-icon>
          <template #title>List</template>
        </el-menu-item>
        <el-menu-item index="toggle-menu" @click="isCollapse = !isCollapse">
          <i :class="['fa-solid', {'fa-arrow-right': isCollapse, 'fa-arrow-left': !isCollapse}]"></i>
        </el-menu-item>
        <el-menu-item index="logout">
          <i class="fa-solid fa-power-off"></i>
          <span slot="title">Выход</span>
        </el-menu-item>
      </el-menu>
    </el-aside>
    <el-main>
      <router-view />
    </el-main>
  </el-container>
</template>

<script setup>
import {ref, shallowRef} from 'vue'

const isCollapse = ref(true)
const activeLink = shallowRef('')
const isAuthenticated = ref(true);

const handleSelectItem = (item) => {
  console.log('item',item)
}
</script>

<style lang="scss" scoped>
.main-container, .el-aside, .menu {
  min-height: 100vh;
}

.el-aside {
  width: unset;
}

.el-menu-item {
  gap: 10px;
}

.el-menu--collapse {
  .el-menu-item {
    justify-content: center;
    gap: 0;
  }
}
</style>
