<template>
  <div class="list">
    <template v-for="material in materials">
      <router-link :to="`/material/edit/${material.editingId}`">
        <el-card shadow="hover">
          <div :class="['header', {'empty-header': isEmptyHeader(material.header)}]">
            {{ isEmptyHeader(material.header) ? 'Без названия' : material.header }}
          </div>
          <div class="info">
            создан: {{ getDate(material.createDate) }}
          </div>
          <div class="info">
            создатель: {{ material.creator.lastname }} {{ material.creator.firstname }}
          </div>
        </el-card>
      </router-link>
    </template>
  </div>
</template>

<script>
import dayjs from 'dayjs';
const todayDate = dayjs().format('MM.DD.YYYY');
export default {
  data() {
    return {
      materials: []
    }
  },
  async mounted() {
    const response = await fetch(`${process.env.APP_ROOT_API}material/get`, {
      headers: {'Content-Type': 'application/json'}
    });
    if (response.ok) {
      this.materials = await response.json();
    } else {
      console.error(response.status);
    }
  },
  methods: {
    isEmptyHeader(header) {
      return header.length === 0
    },
    getDate(timestamp) {
      const date = dayjs.unix(timestamp).format('MM.DD.YYYY');
      const time = dayjs.unix(timestamp).format('hh:mm');

      return `${todayDate === date ? 'сегодня' : date} ${time}`;
    }
  }
}
</script>

<style lang="scss" scoped>
.list {
  display: flex;
  flex-direction: column;
  gap: 5px;

  .el-card {
    &:deep(.el-card__body) {
      display: flex;
      flex-direction: column;
      gap: 5px;
    }

    .header {
      font-size: 23px;
      margin-bottom: 8px;

      &.empty-header {
        opacity: 0.4;
      }
    }
  }
}
</style>