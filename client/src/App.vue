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
        <el-menu-item index="/new">
          <RouterLink to="/new">
            <el-icon><Memo /></el-icon>
            <template #title>List</template>
          </RouterLink>
        </el-menu-item>
        <el-menu-item index="/">
          <RouterLink to="/">
            <el-icon><Memo /></el-icon>
            <template #title>List</template>
          </RouterLink>
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

    <el-container>
      <el-header v-if="isAuthenticated">
        <Header/>
      </el-header>

      <el-main>
        <el-row justify="center">
          <el-col :span="22">
            <router-view />
          </el-col>
        </el-row>
      </el-main>
    </el-container>
  </el-container>
</template>

<script setup>
import {ref, shallowRef, computed, onMounted} from 'vue'
import Header from '@/views/components/Header.vue'
import { useStore } from 'vuex';
const store = useStore();
import { useRouter, useRoute } from 'vue-router'
const router = useRouter();
const route = useRoute();

const isCollapse = ref(true)
const activeLink = shallowRef('')
const isAuthenticated = computed(() => store.getters.isAuthenticated);
const userToken = computed(() => store.getters.token);

const handleSelectItem = async (item) => {
  if (item === 'toggle')
      return;

  if (item === 'logout')
    await store.dispatch('logout');

  await router.push({ name: item });
}

onMounted(async () => {
  if (userToken.value)
    await store.dispatch('getUserData', userToken.value);
})
</script>

<style lang="scss" scoped>
.main-container, .el-aside, .menu {
  min-height: 100vh;
}

.el-main {
  //padding-top: 80px;

  &.login {
    padding-top: unset;
  }
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

.el-header {
  padding: 0;
}
</style>
