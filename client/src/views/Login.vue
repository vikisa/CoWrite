<template>
  <el-row justify="center" class="row">
    <el-col :span="10">
      <div class="card-container">
        <el-card>
          <img
              style="width: 300px; padding: 0 20px;"
              src="/cat.gif"
              alt="logo"
          />

          <el-input v-model="username" placeholder="Логин" />

          <el-input
              v-model="password"
              type="password"
              placeholder="Пароль"
              show-password
          />

          <div class="button">
            <el-button type="primary" @click="submit">
              Войти
            </el-button>
          </div>
        </el-card>

        <div class="register-link-container">
          Нет аккаунта?
          <RouterLink class="register-link" to="/register">Регистрация</RouterLink>
        </div>
      </div>
    </el-col>
  </el-row>
</template>

<script>
import { mapActions } from 'vuex';

export default {
  data() {
    return {
      username: '',
      password: ''
    }
  },
  methods: {
    ...mapActions(['login','getUserData']),
    async submit() {
      const data = { username: this.username, password: this.password };
      await this.login(data);
    }
  }
}
</script>

<style lang="scss" scoped>
.row {
  height: 100%;
  display: flex;
  align-items: center;
}

.el-card {
  &:deep(.el-card__body) {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 10px;
    padding: 30px;

    .button {
      justify-content: center;
      display: flex;
      margin-top: 20px;
    }
  }
}

.register-link-container {
  display: flex;
  justify-content: center;
  margin-top: 10px;
  gap: 5px;
}
</style>