<template>
  <el-row justify="center" class="row">
    <el-col :span="10">
      <div class="card-container">
        <el-card>
          <el-form
              ref="ruleFormRef"
              :model="form"
              :rules="rules"
              label-width="auto"
              class="demo-ruleForm"
              status-icon
              label-position="top"
          >
            <el-form-item label="Имя" prop="firstname">
              <el-input v-model="form.firstname" />
            </el-form-item>

            <el-form-item label="Фамилия" prop="lastname">
              <el-input v-model="form.lastname" />
            </el-form-item>

            <el-form-item label="Логин" prop="username">
              <el-input v-model="form.username" />
            </el-form-item>

            <el-form-item label="Адрес электронной почты" prop="email">
              <el-input v-model="form.email" />
            </el-form-item>

            <el-form-item label="Пароль" prop="password">
              <el-input v-model="form.password" type="password" autocomplete="off" show-password />
            </el-form-item>
            <el-form-item label="Повторите пароль" prop="repeatPassword">
              <el-input
                  v-model="form.repeatPassword"
                  type="password"
                  autocomplete="off"
                  show-password
              />
            </el-form-item>

            <el-form-item label="Роль" prop="role">
              <el-select v-model="form.role"
              >
                <el-option
                    v-for="item in roles"
                    :key="item.id"
                    :label="item.roleTitle"
                    :value="item.id"
                />
              </el-select>
            </el-form-item>
          </el-form>

          <div class="button">
            <el-button type="primary" @click="submit()">
              Зарегестрироваться
            </el-button>
          </div>
        </el-card>

        <div class="register-link-container">
          Уже есть аккаунт?
          <RouterLink class="register-link" to="/login">Войти</RouterLink>
        </div>
      </div>
    </el-col>
  </el-row>
</template>

<script>
export default {
  data() {
    return {
      form: {
        firstname: '',
        lastname: '',
        username: '',
        password: '',
        repeatPassword: '',
        email: '',
        role: 2,
      },
      rules: {
        firstname: [{ required: true, message: 'Пожалуйста, введите имя', trigger: 'blur' }],
        lastname: [{ required: true, message: 'Пожалуйста, введите фамилию', trigger: 'blur' }],
        username: [{ required: true, message: 'Пожалуйста, введите логин', trigger: 'blur' }],
        password: [{ required: true, validator: this.validatePass, trigger: 'blur' }],
        repeatPassword: [{ required: true, validator: this.validatePass2, trigger: 'blur' }],
        email: [{ required: true, message: 'Пожалуйста, введите email', trigger: 'blur' }],
        role: [{ required: true, message: 'Пожалуйста, выберете роль', trigger: 'blur' }],
      },
      roles: []
    }
  },
  async mounted() {
    const response = await fetch(`${process.env.APP_ROOT_API}user/roles`, {
      method: 'GET',
      headers: {'Content-Type': 'application/json'}
    });
    if (response.ok) {
      this.roles = await response.json();
    } else {
      console.error(response.status);
    }
  },
  methods: {
    async submit() {
      const body = this.form;
      delete body.repeatPassword;

      await fetch(`${process.env.APP_ROOT_API}auth/register`, {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(body)
      });

      await this.$router.push('/login');
    },
    validatePass(rule, value, callback) {
      if (value === '') {
        callback(new Error('Пожалуйста, введите пароль'))
      } else {
        callback()
      }
    },
    validatePass2(rule, value, callback) {
      if (value === '') {
        callback(new Error('Пожалуйста, повторите пароль'))
      } else if (this.form.password !== value) {
        callback(new Error('Пароли не совпадают'))
      } else {
        callback()
      }
    }
  },
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