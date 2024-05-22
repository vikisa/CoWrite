<template>
  <div class="list">
    <template v-for="material in materials">
      <router-link :to="`/material/edit/${material.editingId}`">
       {{ `/material/edit/${material.editingId}` }}
      </router-link>
    </template>
  </div>
</template>

<script>
export default {
  data() {
    return {
      materials: []
    }
  },
  async mounted() {
    const response = await fetch('http://localhost:8000/api/material/get', {
      headers: {'Content-Type': 'application/json'}
    });
    if (response.ok) {
      this.materials = await response.json();
    } else {
      console.error(response.status);
    }
  }
}
</script>

<style lang="scss" scoped>
.list {
  display: flex;
  flex-direction: column;
  gap: 5px;
}
</style>