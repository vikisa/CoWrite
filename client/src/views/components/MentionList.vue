<template>
  <div class="dropdown-menu">
    <template v-if="items.length">
      <el-button
          :class="{ 'is-selected': index === selectedIndex }"
          v-for="(item, index) in items"
          :key="index"
          @click="selectItem(index)"
      >
        {{ item.name }}
      </el-button>
    </template>
    <div class="item" v-else>
      ...
    </div>
  </div>
</template>

<script>
export default {
  props: {
    items: {
      type: Array,
      required: true,
    },
    command: {
      type: Function,
      required: true,
    },
  },
  data() {
    return {
      selectedIndex: 0,
    }
  },
  watch: {
    items() {
      this.selectedIndex = 0
    },
  },
  methods: {
    onKeyDown({ event }) {
      if (event.key === 'ArrowUp') {
        this.upHandler()
        return true
      }
      if (event.key === 'ArrowDown') {
        this.downHandler()
        return true
      }
      if (event.key === 'Enter') {
        this.enterHandler()
        return true
      }
      return false
    },
    upHandler() {
      this.selectedIndex = ((this.selectedIndex + this.items.length) - 1) % this.items.length
    },
    downHandler() {
      this.selectedIndex = (this.selectedIndex + 1) % this.items.length
    },
    enterHandler() {
      this.selectItem(this.selectedIndex)
    },
    selectItem(index) {
      const item = this.items[index]

      if (item)
        this.command({ id: item.id, label: item.name })
    },
  },
}
</script>

<style lang="scss" scoped>
.dropdown-menu {
  display: flex;
  flex-direction: column;
  background-color: white;
  border: 2px solid #dcdfe6;
  border-radius: 0.5rem;

  .el-button {
    //border-top: none;
    border: none;
  }

  .el-button + .el-button {
    margin-left: 0;
  }
}
</style>