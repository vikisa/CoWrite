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
        <el-menu-item index="toggle-menu" @click="isCollapse = !isCollapse">
          <i :class="['fa-solid', {'fa-arrow-right': isCollapse, 'fa-arrow-left': !isCollapse}]"></i>
        </el-menu-item>
        <el-menu-item index="logout">
          <i class="fa-solid fa-power-off"></i>
          <span slot="title">Выход</span>
        </el-menu-item>
      </el-menu>
    </el-aside>

    <el-container>
      <Header v-if="isAuthenticated"/>

      <el-main>
        <router-view />
      </el-main>
    </el-container>
  </el-container>
</template>

<script setup>
import {ref, shallowRef} from 'vue'
import {store} from "@/store/index.js";
import Header from '@/views/components/Header.vue'

const isCollapse = ref(true)
const activeLink = shallowRef('')
const isAuthenticated = store.getters.isAuthenticated;

const handleSelectItem = (item) => {
  console.log('item',item)
}
</script>

<style lang="scss" scoped>
.main-container, .el-aside, .menu {
  min-height: 100vh;
}

.el-main {
  padding-top: 80px;
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
