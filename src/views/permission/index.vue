<template>
  <div class="dashboard-container">
    <div class="app-container">
      <el-card>
        <div class="button">
          <el-button type="primary" size="small" @click="addPerBtn(1, '0')">添加权限</el-button>
        </div>

        <el-table border :data="permissionList" row-key="id">
          <el-table-column label="名称" prop="name" />
          <el-table-column label="标识" prop="code" />
          <el-table-column label="描述" prop="description" />
          <el-table-column label="操作">
            <template #default="{ row }">
              <el-button v-if="row.type === 1" type="text" @click="addPerBtn(2, row.id)">添加</el-button>
              <el-button type="text">编辑</el-button>
              <el-button type="text">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-card>

      <!-- 添加按钮组件 -->
      <per-dialog ref="perDialog" :show-dialog.sync="showDialog" :type="type" :pid="pid" @confirm="confirmFn" />
    </div>
  </div>
</template>

<script>
import { getPermissionListAPI, addPermissionAPI } from '@/api'
import { transTree } from '@/utils'
import perDialog from './components/perDialog.vue'
export default {
  components: { perDialog },
  data() {
    return {
      permissionList: [], // 权限列表
      showDialog: false,
      type: '',
      pid: ''
    }
  },
  created() {
    this.getPermissionList()
  },
  methods: {
    // 获取权限列表
    async getPermissionList() {
      const res = await getPermissionListAPI().catch(err => err)
      // console.log(res)
      this.permissionList = transTree(res.data, '0')
    },
    addPerBtn(type, pid) {
      this.showDialog = true
      this.type = type
      this.pid = pid
    },
    async confirmFn(formData) {
      const res = await addPermissionAPI(formData)
      if (!res.success) return this.$message.error(res.message)
      // 重新获取页面数据
      this.getPermissionList()
      this.$message.success(res.message)
      this.$refs.perDialog.$refs.perForm.resetFields()
      this.showDialog = false
    }
  }
}
</script>

<style lang="scss" scoped>
.button {
  text-align: right;
  margin-bottom: 20px;
}
</style>
