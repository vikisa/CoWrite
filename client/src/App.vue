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
<!--        <el-menu-item index="/material/try">
          <i class="fa-solid fa-bolt"></i>
          <span slot="title">try</span>
        </el-menu-item>-->

        <el-menu-item index="/material/new">
          <i class="fa-solid fa-plus"></i>
          <span slot="title">Добавить материал</span>
        </el-menu-item>

        <el-menu-item index="/list">
          <i class="fa-solid fa-list"></i>
          <span slot="title">Список</span>
        </el-menu-item>

        <li class="el-menu-item" tabindex="-1" @click="isCollapse = !isCollapse">
          <i :class="['fa-solid', {'fa-arrow-right': isCollapse, 'fa-arrow-left': !isCollapse}]" aria-hidden="true"/>
        </li>

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
        <el-row justify="center" style="height: 100%">
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
  if (item === 'logout') {
    await store.dispatch('logout');
    return;
  }

  await router.push({ path: item });
  activeLink.value = item;
}

onMounted(async () => {
  if (userToken.value)
    await store.dispatch('getUserData', userToken.value);

  await store.dispatch('socketConnect');
  await router.isReady();
  activeLink.value = route.path;
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
