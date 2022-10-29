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
          <el-button type="danger" size="small" @click="uploadExcelBtnFn">导入excel</el-button>
          <el-button type="success" size="small" @click="downloadExcel">导出excel</el-button>
          <el-button type="primary" size="small" @click="addRole">新增员工</el-button>
        </template>
      </PageTools>

      <!-- 员工表格区域 -->
      <el-card style="margin-top: 10px;">
        <el-table border :data="employeesList" :default-sort="{prop: 'workNumber'}">
          <el-table-column label="序号" type="index" />
          <el-table-column label="姓名" prop="username" />
          <el-table-column label="头像" prop="">
            <template slot-scope="scope">
              <image-holder class="staffPhoto" :src="scope.row.staffPhoto" />
            </template>
          </el-table-column>
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
              <el-button type="text" size="small" @click="$router.push('/employees/detail?id=' + row.id)">查看</el-button>
              <el-button type="text" size="small" @click="setEmp(row.id)">分配角色</el-button>
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

    <!-- 分配角色对话框 -->
    <el-dialog title="分配角色" :visible="showRoleDialog" @close="showRoleDialog = false">
      <assign-role-dialog
        ref="assignRole"
        :user-id="userId"
        :role-list="roleList"
        @close="showRoleDialog = false"
        @confirm="addRoleFn"
      />
    </el-dialog>
  </div>
</template>

<script>
import { getEmployeeListAPI, departmentsListAPI, addEmployeeAPI, delEmployeeAPI, getRolesAPI, getUserDetailByIdAPI, assignRolesAPI } from '@/api'
import { transTree } from '@/utils'
import empDialog from './components/empDialog.vue'
import dayjs from 'dayjs'
import AssignRoleDialog from './components/assignRoleDialog.vue'
export default {
  components: { empDialog, AssignRoleDialog },
  data() {
    return {
      query: {
        page: 1, // 页码
        size: 10 // 每页条数
      },
      employeesList: [], // 员工列表
      departmentsList: [], // 部门列表
      total: 0, // 数据总条数
      dialogVisible: false, // 新增员工
      showRoleDialog: false, // 分配角色
      userId: '', // 用户ID
      roleList: [], // 角色列表
      clickId: '' // 点击id
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
    },

    // 导入Excel
    uploadExcelBtnFn() {
      this.$router.push('/excel')
    },

    // 导出Excel数据处理
    transData(rows) {
      // const map = {
      //   'id': '编号',
      //   'password': '密码',
      //   'mobile': '手机号',
      //   'username': '姓名',
      //   'timeOfEntry': '入职日期',
      //   'formOfEmployment': '聘用形式',
      //   'correctionTime': '转正日期',
      //   'workNumber': '工号',
      //   'departmentName': '部门',
      //   'staffPhoto': '头像地址'
      // }
      // const headerKeys = Object.keys(rows[0])
      // // console.log(headerKeys)
      // const header = headerKeys.map(item => {
      //   return map[item]
      // })
      // // console.log(header)
      // const data = rows.map(obj => {
      //   return Object.values(obj)
      // })
      // return { header, data }

      // 考虑顺序 (页面上列保持一致顺序)
      // 准备一个列表头中文数组 (8个)
      const headerArr = ['序号', '姓名', '头像', '手机号', '工号', '聘用形式', '部门', '入职时间']
      const myObj = {
        // 序号可以等遍历的时候直接用索引值, 而不是来自于英文对象里
        '姓名': 'username',
        '头像': 'staffPhoto',
        '手机号': 'mobile',
        '工号': 'workNumber',
        '聘用形式': 'formOfEmployment',
        '部门': 'departmentName',
        '入职时间': 'timeOfEntry'
      }
      const resultArr = rows.map((item, index) => {
        const valueArr = [] // 值小数组
        headerArr.forEach(zhKey => {
          if (zhKey === '序号') {
            valueArr.push(index + 1)
          } else {
            const enKey = myObj[zhKey]
            valueArr.push(item[enKey])
          }
        })
        return valueArr
      })
      return { header: headerArr, data: resultArr }
    },

    // 导出Excel
    async downloadExcel() {
      const res = await getEmployeeListAPI()
      const res2 = await getEmployeeListAPI({
        page: 1,
        size: res.data.total // 导出所有
      })
      // console.log(res)
      const excelObj = this.transData(res2.data.rows)
      import('@/vendor/Export2Excel').then(excel => {
        // excel表示导入的模块对象
        excel.export_json_to_excel({
          header: excelObj.header, // 表头 必填
          data: excelObj.data, // 具体数据 必填
          filename: '员工列表', // 文件名称
          autoWidth: true, // 宽度是否自适应
          bookType: 'xlsx' // 生成的文件类型
        })
      })
    },

    // 分配角色按钮
    async setEmp(id) {
      this.userId = id
      this.clickId = id
      this.showRoleDialog = true
      const res = await getRolesAPI()
      // console.log(res)
      this.roleList = res.data.rows

      const infoRes = await getUserDetailByIdAPI(id)
      // console.log(infoRes)
      if (!infoRes.success) return this.$message.error(infoRes.message)

      this.$nextTick(() => {
        this.$refs.assignRole.roleArr = infoRes.data.roleIds
      })
    },

    // 角色分配确认
    async addRoleFn(obj) {
      const res = await assignRolesAPI({
        id: this.userId,
        roleIds: obj
      })
      if (!res.success) return this.$message.error(res.message)

      // 员工分配成功，给用户提示
      this.$message.success(res.message)
      // 关闭弹框
      this.showRoleDialog = false
      // 重新获取当前当前列表数据
      this.getEmployeeList()
    }
  }
}
</script>

<style lang="scss" scoped>
.staffPhoto {
  width: 100px;
  height: 100px;
  border-radius: 50%;
}
</style>
