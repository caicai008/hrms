<template>
  <div>
    <div class="employees-container">
      <div class="app-container">
        <el-card>
          <el-tabs>
            <el-tab-pane label="登录账户设置">
              <login-setting />
            </el-tab-pane>

            <el-tab-pane label="个人详情">
              <user-info />
            </el-tab-pane>

            <el-tab-pane label="岗位信息">
              <job-info />
            </el-tab-pane>
          </el-tabs>
        </el-card>
      </div>
    </div>
  </div>
</template>

<script>
import JobInfo from './detail/job-info.vue'
import LoginSetting from './detail/login-setting.vue'
import userInfo from './detail/user-info.vue'
export default {
  components: { userInfo, JobInfo, LoginSetting }

}
</script>

<style>

</style>

LoginSetting
