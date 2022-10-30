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
              <el-button type="text" @click="editBtn(row.id)">编辑</el-button>
              <el-button type="text" @click="deleteBtn(row.id)">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-card>

      <!-- 添加按钮组件 -->
      <per-dialog
        ref="perDialog"
        :show-dialog.sync="showDialog"
        :type="type"
        :pid="pid"
        :is-edit="isEdit"
        :origin-list="originList"
        @confirm="confirmFn"
      />
    </div>
  </div>
</template>

<script>
import { getPermissionListAPI, addPermissionAPI, getPermissionDetailAPI, updatePermissionAPI, delPermissionAPI } from '@/api'
import { transTree } from '@/utils'
import perDialog from './components/perDialog.vue'
export default {
  components: { perDialog },
  data() {
    return {
      permissionList: [], // 权限列表
      showDialog: false,
      type: '',
      pid: '',
      isEdit: false,
      originList: [] // 在做校验时需要用到的数据
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
      // 初始化 originList
      this.originList = res.data
      this.permissionList = transTree(res.data, '0')
    },
    // 添加权限
    addPerBtn(type, pid) {
      this.isEdit = false
      this.showDialog = true
      this.type = type
      this.pid = pid
    },
    // 确认添加-编辑/更新
    async confirmFn(formData) {
      if (this.isEdit) {
        // 编辑-调用更新接口
        const res = await updatePermissionAPI(formData).catch(err => err)
        if (!res.success) return this.$message.error(res.message)
        this.$message.success(res.message)
      } else {
        // 新增-调用新增接口
        const res = await addPermissionAPI(formData)
        if (!res.success) return this.$message.error(res.message)
        this.$message.success(res.message)
      }
      // 重新获取页面数据
      this.getPermissionList()
      this.$refs.perDialog.$refs.perForm.resetFields()
      this.showDialog = false
    },
    // 编辑按钮
    async editBtn(id) {
      this.isEdit = true
      this.showDialog = true
      // 数据回显
      const res = await getPermissionDetailAPI(id)
      // console.log(res)
      this.$refs.perDialog.formData = res.data
    },
    // 删除按钮
    async deleteBtn(id) {
      const confirmRes = await this.$confirm('此操作将永久删除权限，是否删除？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消'
      }).catch(err => err)
      if (confirmRes === 'cancel') return this.$message.info('您取消了删除')

      // 确认-调用接口
      const res = await delPermissionAPI(id)
      if (!res.success) return this.$message.error(res.message)
      this.$message.success(res.message)
      this.getPermissionList()
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
