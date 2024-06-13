<template>
  <el-row :gutter="40" v-if="!isLoading && isPageLoaded">
    <el-col :span="20">
      <el-input class="header" v-model="materialData.header"/>
      <editor />
    </el-col>
    <el-col :span="4">
      history
    </el-col>
  </el-row>
</template>

<script>
import Editor from '@/views/material/Try.vue'
import { customAlphabet } from 'nanoid';
import {mapGetters, mapMutations, mapState,mapActions} from "vuex";
const nanoid = customAlphabet('1234567890abcdef', 16)
export default {
  components: { Editor },
  data() {
    return {
      editingId: null,
      isPageLoaded: false
    }
  },
  computed: {
    ...mapState(['isLoading']),
    ...mapGetters(['userFullName','getColour','materialData','userData'])
  },
  async created() {
    this.setIsLoading(true);

    await this.$router.isReady();

    this.editingId = this.$route.params?.editingId || null;

    if (!this.editingId) {
      this.editingId = nanoid();
      const response = await fetch(`${process.env.APP_ROOT_API}material/create`, {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        credentials: 'include',
        body: JSON.stringify({
          createDate: 1,
          saveDate: 0,
          text: '<p></p>',
          header: '',
          creatorId: this.userData.id,
          editingId: this.editingId
        })
      });

      if (response.ok) {
        await this.$router.push({ path: `/material/edit/${this.editingId}` })
      } else {
        console.error(response.status);
      }
      this.setIsLoading(false);
      this.isPageLoaded = true;
    }
    else {
      await this.getMaterialData(this.editingId);
      console.log('materialData',this.materialData)
      this.setIsLoading(false);
      this.isPageLoaded = true;
    }
  },
  methods: {
    ...mapActions(['getMaterialData']),
    ...mapMutations(['setMaterial', 'setIsLoading'])
  }
}
</script>

<style lang="scss" scoped>
.header {
  margin-left: 72px;
  max-width: 100%;
  box-sizing: border-box;
  width: calc(100% - 72px);
  margin-bottom: 20px;
}
</style>