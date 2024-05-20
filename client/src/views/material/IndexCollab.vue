<template>
  <el-row :gutter="40">
    <el-col :span="20">
      <editor/>
    </el-col>
    <el-col :span="4">
      history
    </el-col>
  </el-row>
</template>

<script>
import Editor from '@/views/material/Try2.vue'
export default {
  components: { Editor },
  data() {
    return {

    }
  }
}
</script>

<style scoped>

</style>