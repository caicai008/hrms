<template>
  <div class="login-setting">
    <el-form
      ref="userForm"
      :model="userInfo"
      :rules="rules"
      label-width="120px"
      style="margin-left: 120px; margin-top: 30px"
    >
      <el-form-item label="姓名:" prop="username">
        <el-input v-model="userInfo.username" style="width:300px" />
      </el-form-item>

      <el-form-item label="密码:" prop="password">
        <el-input v-model="userInfo.password" type="password" style="width:300px" />
      </el-form-item>

      <el-form-item>
        <el-button type="primary" @click="update">更新</el-button>
        <el-button>取消</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import { getUserDetailByIdAPI, saveUserDetailByIdAPI } from '@/api'
export default {
  name: 'LoginSetting',
  data() {
    return {
      userInfo: {
        username: '',
        password: ''
      },
      rules: {
        username: [{ required: true, message: '用户名不能为空', trigger: 'blur' }],
        password: [{ required: true, message: '密码不能为空', trigger: 'blur' }]
      }
    }
  },
  created() {
    this.getUserDetail()
  },
  methods: {
    // 获取用户信息
    async getUserDetail() {
      const res = await getUserDetailByIdAPI(this.$route.query.id).catch(err => err)
      if (!res.success) return this.$message.error(res.message)
      this.userInfo = res.data
    },

    // 更新用户信息
    update() {
      this.$refs.userForm.validate(async valid => {
        if (!valid) return this.$message.error('检查用户名和密码')
        const res = await saveUserDetailByIdAPI(this.userInfo)
        this.getUserDetail()
        this.$message.success(res.message)
      })
    }
  }
}
</script>

<style lang="scss" scoped></style>
