<template>
  <div class="dashboard-container">
    <div class="app-container">
      <!-- 封装的头部组件 -->
      <PageTools>
        <!-- 左侧插槽 -->
        <template #slot-left>
          <span>共19条记录</span>
        </template>

        <!-- 右侧插槽 -->
        <template #slot-right>
          <el-button type="danger" size="small">导入excel</el-button>
          <el-button type="success" size="small">导出excel</el-button>
          <el-button type="primary" size="small" @click="addRole">新增员工</el-button>
        </template>
      </PageTools>

      <!-- 员工表格区域 -->
      <el-card style="margin-top: 10px;">
        <el-table border :data="employeesList" :default-sort="{prop: 'workNumber'}">
          <el-table-column label="序号" type="index" />
          <el-table-column label="姓名" prop="username" />
          <el-table-column label="头像" prop="" />
          <el-table-column label="手机号" prop="mobile" />
          <el-table-column label="工号" prop="workNumber" sortable :sort-method="workNumberSortFn" />
          <el-table-column label="聘用形式" prop="formOfEmployment">
            <!-- 具名插槽判断聘用形式 -->
            <template v-slot="scope">
              {{ scope.row.formOfEmployment === 1 ? '正式' : '非正式' }}
            </template>
          </el-table-column>
          <el-table-column label="部门" prop="departmentName" />
          <el-table-column label="入职时间" prop="timeOfEntry">
            <template v-slot="scope">
              {{ formatTime(scope.row.timeOfEntry) }}
            </template>
          </el-table-column>
          <el-table-column label="操作" width="280">
            <template v-slot="{ row }">
              <el-button type="text" size="small">查看</el-button>
              <el-button type="text" size="small">分配角色</el-button>
              <el-button type="text" size="small" @click="delEmp(row.id)">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
        <!-- 分页组件 -->
        <el-row type="flex" justify="center" align="middle" style="height: 60px">
          <!-- 分页区域 -->
          <el-pagination
            :current-page="query.page"
            :page-sizes="[10, 15, 20, 25]"
            :page-size="query.size"
            layout="total, sizes, prev, pager, next, jumper"
            :total="total"
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
          />
        </el-row>
      </el-card>
    </div>

    <!-- 添加-对话框 -->
    <!-- 新增员工弹框组件 -->
    <el-dialog title="新增员工" :visible.sync="dialogVisible" @close="addEmpDialogCloseFn">
      <emp-dialog
        ref="addEmpDialog"
        :is-dialog.sync="dialogVisible"
        :departments-list="departmentsList"
        @addEmpEV="addEmpEVFn"
      />
    </el-dialog>
  </div>
</template>

<script>
import { getEmployeeListAPI, departmentsListAPI, addEmployeeAPI, delEmployeeAPI } from '@/api'
import { transTree } from '@/utils'
import empDialog from './components/empDialog.vue'
import dayjs from 'dayjs'
export default {
  components: { empDialog },
  data() {
    return {
      query: {
        page: 1, // 页码
        size: 10 // 每页条数
      },
      employeesList: [], // 员工列表
      departmentsList: [], // 部门列表
      total: 0, // 数据总条数
      dialogVisible: false
    }
  },
  created() {
    // 调用获取员工列表的方法
    this.getEmployeeList()
    // 调用获取部门列表的方法
    this.getDepartmentsList()
  },
  methods: {
    // 每页显示的条数发生改变时触发
    handleSizeChange(newSize) {
      this.query.size = newSize
      this.getEmployeeList()
    },

    // 当前页面发生改变时触发
    handleCurrentChange(newPage) {
      this.query.page = newPage
      this.getEmployeeList()
    },

    // 获取员工数据
    async getEmployeeList() {
      const res = await getEmployeeListAPI(this.query)
      // console.log(res)
      if (!res.success) return this.$message.error(res.message)
      this.employeesList = res.data.rows
      this.total = res.data.total
    },

    // 自定义排序
    workNumberSortFn(a, b) {
      // 打印a和b发现是表格数组里的对象
      // sort方法使用:
      // 如果return小于0, 那么 a 会被排列到 b 之前
      // 如果return等于0, 那么 a 和 b 位置不变
      // 如果return大于0, 那么 a 会被排列到 b 之后
      return parseInt(a.workNumber) - parseInt(b.workNumber)
    },

    // 添加新员工
    addRole() {
      this.dialogVisible = true
    },

    // 获取部门树形列表
    async getDepartmentsList() {
      const res = await departmentsListAPI()
      if (!res.success) return this.$message.error(res.message)
      this.departmentsList = transTree(res.data.depts, '')
    },

    // 添加员工
    async addEmpEVFn(obj) {
      const res = await addEmployeeAPI(obj)
      if (res.success) {
        this.$message.success(res.message)
        // 提示后, 重新请求列表
        this.getEmployeeList()
      } else {
        this.$message.error(res.message)
      }
      this.dialogVisible = false
    },

    // 关闭对话框重置表单
    addEmpDialogCloseFn() {
      // 第一个$refs获取到子组件对象的this,然后第二个$refs获取到子组件范围内的el-form组件对象
      this.$refs.addEmpDialog.$refs.addForm.resetFields()
    },

    // 格式化入职日期的方法
    formatTime(time) {
      return dayjs(time).format('YYYY-MM-DD')
    },

    // 删除员工
    async delEmp(id) {
    // 显示删除询问对话框
      const delRes = await this.$confirm('此操作将永久删除该角色, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).catch(err => err)

      // 用户点击了取消，给用户进行提示
      if (delRes === 'cancel') return this.$message.info('您取消了删除')

      const res = await delEmployeeAPI(id)
      if (!res.success) return this.$message.error(res.message)
      // 删除成功后的提示
      this.$message.success(res.message)
      // 判断是否是最后一条数据
      if (this.employeesList.length === 1) {
        this.query.page--
        if (this.query.page === 1) {
          this.query.page = 1
        }
      }
      // 重新获取数据
      this.getEmployeeList()
    }
  }
}
</script>

<style lang="scss" scoped>

</style>
