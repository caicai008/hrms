<template>
  <div class="dashboard-container">
    <div class="app-container">
      <!-- 卡片组件 -->
      <el-card class="box-card">
        <el-tabs v-model="activeName">
          <!-- 用户管理 -->
          <el-tab-pane label="用户管理" name="first" class="tab-pane">

            <!-- 新增角色按钮 -->
            <el-row style="height:60px">
              <el-button type="primary" icon="el-icon-plus" size="mini" @click="addRoles">新增角色</el-button>
            </el-row>

            <!-- 使用 Table 组件实现用户角色的渲染 -->
            <el-table border style="width: 100%" :data="rolesList">
              <el-table-column type="index" label="序号" width="120" />
              <el-table-column prop="name" label="角色名" width="240" />
              <el-table-column prop="description" label="描述" />
              <el-table-column label="操作">
                <template slot-scope="scope">
                  <el-button type="success" size="small" @click="assignRow(scope.row.id)">分配权限</el-button>
                  <el-button type="primary" size="small" @click="editRole(scope.row)">编辑</el-button>
                  <el-button type="danger" size="small" @click="deleteRole(scope.row)">删除</el-button>
                </template>
              </el-table-column>
            </el-table>

            <!-- 分页区域 -->
            <el-pagination
              :current-page="query.page"
              :page-sizes="[10, 15, 20, 25]"
              :page-size="query.pagesize"
              layout="total, sizes, prev, pager, next, jumper"
              :total="total"
              @size-change="handleSizeChange"
              @current-change="handleCurrentChange"
            />
          </el-tab-pane>
          <!-- 公司信息 -->
          <el-tab-pane label="配置管理" name="second" class="tab-pane">
            <!-- 提示信息 -->
            <el-alert
              title="对公司名称、公司地址、营业执照、公司地区的更新，将使得公司资料被重新审核，请谨慎修改"
              type="info"
              show-icon
            />
            <!-- 公司表单 -->
            <el-form :model="formData" style="margin-top:50px" label-width="120px">
              <el-form-item label="公司名称">
                <el-input v-model="formData.name" disabled style="width:400px" />
              </el-form-item>
              <el-form-item label="公司地址">
                <el-input v-model="formData.companyAddress" disabled style="width:400px" />
              </el-form-item>
              <el-form-item label="邮箱">
                <el-input v-model="formData.mailbox" disabled style="width:400px" />
              </el-form-item>
              <el-form-item label="备注">
                <el-input v-model="formData.remarks" type="textarea" :rows="3" disabled style="width:400px" />
              </el-form-item>
            </el-form>
          </el-tab-pane>
        </el-tabs>
      </el-card>

      <!-- 编辑弹出层 -->
      <el-dialog
        :title="isEdit ? '编辑角色' : '添加角色'"
        :close-on-click-modal="false"
        :close-on-press-escape="false"
        :visible.sync="dialogFormVisible"
        @close="closeRoleDialog"
      >
        <el-form ref="roleForm" :model="roleForm" :rules="roleRules" label-width="100px">
          <el-form-item label="角色名称" prop="name">
            <el-input v-model="roleForm.name" />
          </el-form-item>
          <el-form-item label="角色描述" prop="description">
            <el-input v-model="roleForm.description" />
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="dialogFormVisible = false">取 消</el-button>
          <el-button type="primary" @click="roleSubmit">确 定</el-button>
        </div>
      </el-dialog>

      <!-- 分配权限弹出层 -->
      <el-dialog
        title="分配权限"
        :visible.sync="showAssign"
        width="50%"
      >
        <assign-permission
          :show-assign.sync="showAssign"
          :role-id="roleId"
          :permission-list="permissionList"
          :role-ids-list="roleIdsList"
          @confirm="confirmFn"
        />
      </el-dialog>
    </div>
  </div>
</template>

<script>
import { getRolesAPI, getCompanyInfoAPI, addRoleAPI, getRoleIdAPI, updateRoleAPI, deleteRoleAPI, getPermissionListAPI, assignPermAPI } from '@/api'
import { mapGetters } from 'vuex'
import assignPermission from './assignPermission.vue'
import { transTree } from '@/utils'
export default {
  components: { assignPermission },
  data() {
    return {
      activeName: 'first',
      query: {
        page: 1, // 当前页面
        pagesize: 10 // 页面显示的条数
      },
      permissionList: [], // 权限列表
      roleIdsList: [], // 某个角色的权限点数组
      rolesList: [], // 角色列表
      total: 0, // 角色数据总条数
      formData: {}, // 公司信息
      dialogFormVisible: false, // 展示弹窗
      showAssign: false, // 分配权限弹出层
      roleId: '', // 分配权限id
      // 添加角色
      roleForm: {
        name: '',
        description: ''
      },
      isEdit: false, // 编辑状态
      // 添加角色验证
      roleRules: {
        name: [
          { required: true, message: '角色名称不能为空', trigger: 'blur' }
        ],
        description: [
          { required: true, message: '角色描述不能为空', trigger: 'blur' }
        ]
      }
    }
  },
  computed: {
    ...mapGetters(['companyId'])
  },
  created() {
    // 调用获取角色信息方法
    this.getRolesInfo()
    this.getCompanyInfo()
  },
  methods: {
    // 分配权限
    async assignRow(id) {
      // 解决数据闪现问题
      this.roleIdsList = []
      this.showAssign = true
      this.roleId = id
      const res = await getPermissionListAPI()
      this.permissionList = transTree(res.data, '0')

      // 获取当前角色的权限，回显
      const res1 = await getRoleIdAPI(id)
      // console.log(res1)
      this.roleIdsList = res1.data.permIds
    },

    // 每页显示的条数发生改变时触发
    handleSizeChange(newSize) {
      this.query.pagesize = newSize
      this.getRolesInfo()
    },

    // 当前页面发生改变时触发
    handleCurrentChange(newPage) {
      this.query.page = newPage
      this.getRolesInfo()
    },

    // 获取所有角色信息
    async getRolesInfo() {
      const res = await getRolesAPI(this.query)
      // console.log(res)
      if (!res.success) return this.$message.error(res.message)
      this.rolesList = res.data.rows
      this.total = res.data.total
    },

    // 获取公司信息
    async getCompanyInfo() {
      const res = await getCompanyInfoAPI(this.companyId)
      // console.log(res)
      if (!res.success) return this.$message.error(res.message)
      this.formData = res.data
    },

    // 新增角色按钮
    addRoles() {
      this.isEdit = false
      this.roleForm = {}
      this.dialogFormVisible = true
    },

    // 角色弹框-> 确定按钮
    roleSubmit() {
      // 表单兜底校验
      this.$refs.roleForm.validate(async(valid) => {
        if (valid) {
          if (!this.isEdit) {
          // 调用新增角色的 API
            const res = await addRoleAPI(this.roleForm)
            // 根据状态码判断请求成功与否
            if (!res.success) return this.$message.error(res.message)
            // 添加成功，给用户进行提示
            this.$message.success(res.message)
          } else {
          // 调用编辑角色的 API
            const res = await updateRoleAPI(this.roleForm)
            // 根据状态码判断请求成功与否
            if (!res.success) return this.$message.error(res.message)
            // 编辑成功，给用户进行提示
            this.$message.success(res.message)
          }
          // 重新获取权限列表数据
          this.getRolesInfo()
          // 隐藏弹框
          this.dialogFormVisible = false
        }
      })
    },

    // 编辑角色
    async editRole(formObj) {
      this.isEdit = true
      const res = await getRoleIdAPI(formObj.id)
      if (!res.success) return this.$message.error(res.message)
      this.roleForm = res.data
      // 让弹框展示
      this.dialogFormVisible = true
    },

    // 关闭弹出层清空表单
    closeRoleDialog() {
      this.$refs.roleForm.resetFields()
      this.dialogFormVisible = false
    },

    // 删除角色
    deleteRole(dataObj) {
      this.$confirm('此操作将永久删除该角色，是否继续？', '警告', {
        confirmButtonText: '确认',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async() => {
        const res = await deleteRoleAPI(dataObj.id)
        // 错误提示
        if (!res.success) return this.$message.error(res.message)
        this.$message({
          type: 'success',
          message: '删除成功！'
        })
        // 判断当前页面数据是不是最后一条，是的话，删除后页面跳转到前一页
        if (this.rolesList.length === 1) {
          this.query.page--
          // 如果已经是第一页且是最后一条了，就显示第一页
          if (this.query.page === 1) {
            this.query.page = 1
          }
        }
        this.getRolesInfo()
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除！'
        })
      })
    },

    // 确认分配权限按钮
    async confirmFn(obj) {
      const res = await assignPermAPI(obj)
      // console.log(res)
      if (res.success) this.$message.success(res.message)
      this.dialogVisible = false
      this.getRolesInfo()
    }
  }
}
</script>

<style lang="scss" scoped>
.box-card {
  padding: 10px 30px;
}

.tab-pane {
  padding: 20px;
}
</style>
