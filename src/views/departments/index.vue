<template>
  <div class="departments-container">
    <div class="app-container">
      <el-card class="box-card">
        <el-tabs v-model="activeName" @tab-click="handleClick">
          <el-tab-pane label="组织结构" name="first" class="tab-pane">
            <!-- 一行 -->
            <el-row type="flex" justify="space-between" align="middle">
              <!-- 第一列，占20份 -->
              <el-col :span="20">
                <i class="el-icon-s-home" />
                <span class="company">江苏传智播客教育科技股份有限公司</span>
              </el-col>
              <!-- 第二列，占4份 -->
              <el-col :span="4">
                <!-- 在容器范围里, 一行再分2列 -->
                <el-row type="flex" justify="end">
                  <el-col>负责人</el-col>
                  <el-col>
                    <!-- 下拉选项 -->
                    <el-dropdown trigger="click">
                      <!-- 下拉菜单文字 -->
                      <span class="el-dropdown-link">
                        操作<i class="el-icon-arrow-down el-icon--right" />
                      </span>
                      <!-- 下拉项 -->
                      <el-dropdown-menu slot="dropdown">
                        <el-dropdown-item @click.native="add()">添加子部门</el-dropdown-item>
                      </el-dropdown-menu>
                    </el-dropdown>
                  </el-col>
                </el-row>
              </el-col>
            </el-row>
            <!-- 树形控件 -->
            <el-tree class="departments-tree" :data="treeData" :props="defaultProps">
              <!-- 默认插槽  并且使用内部的数据进行自定义模板的渲染, scope.data 所以直接key解构赋值变量也是data(对应数据对象)-->
              <template #default="{ data }">
                <el-row
                  type="flex"
                  justify="space-between"
                  align="middle"
                  style="height: 40px; width: 100%;"
                >
                  <!-- 部门名字 -->
                  <el-col :span="20">
                    <span>{{ data.name }}</span>
                  </el-col>
                  <!-- 负责人、操作 -->
                  <el-col :span="4">
                    <el-row type="flex" justify="end">
                      <el-col>{{ data.manager }}</el-col>
                      <el-col>
                        <!-- 下拉选项 -->
                        <el-dropdown trigger="click">
                          <!-- 下拉菜单文字 -->
                          <span class="el-dropdown-link">
                            操作<i class="el-icon-arrow-down el-icon--right" />
                          </span>
                          <!-- 下拉项 -->
                          <el-dropdown-menu slot="dropdown">
                            <el-dropdown-item @click.native="add(data)">添加子部门</el-dropdown-item>
                            <el-dropdown-item @click.native="edit(data)">编辑部门</el-dropdown-item>
                            <el-dropdown-item v-if="data && !data.children" @click.native="del(data)">删除部门</el-dropdown-item>
                          </el-dropdown-menu>
                        </el-dropdown>
                      </el-col>
                    </el-row>
                  </el-col>
                </el-row>
              </template>
            </el-tree>
          </el-tab-pane>
        </el-tabs>
      </el-card>
    </div>
    <!-- 新增弹窗组件 -->
    <depart-dialog
      ref="departDialog"
      :dialog-visible.sync="showDepartDialog"
      :employees-list="employeesList"
      :origin-list="originList"
      :is-edit="isEdit"
      :parent-id="clickDepartId"
      @addDepartEV="addDepartmentsFn"
    />
  </div>
</template>

<script>
import { departmentsListAPI, getEmployeeSimpleAPI, addDepartmentsAPI, getDepartDetailAPI, updateDepartmentsAPI, deleteDepartmentsAPI } from '@/api'
import { transTree } from '@/utils/index'
import departDialog from './components/departDialog.vue'
export default {
  name: 'Departments',
  components: { departDialog },
  data() {
    return {
      activeName: 'first',
      // 树形控件数据
      treeData: [],
      // 定义结构显示
      defaultProps: {
        children: 'children',
        label: 'name'
      },
      showDepartDialog: false, // 展示操作对话框
      employeesList: [], // 员工列表
      clickDepartId: '', // 部门ID
      isEdit: false, // 是否编辑状态
      originList: [] // 用于弹窗内-校验部门code和name是否重复数据数组
    }
  },
  created() {
    this.getDepartMentsListFn()
    this.getEmployeesListFn()
  },
  methods: {
    handleClick() {

    },
    // 正文部分-右侧的添加子部门
    add(data) {
      this.isEdit = false
      if (data) { // 添加二级部门
        this.clickDepartId = data.id // 保存当前部门id
      } else { // 添加一级部门
        this.clickDepartId = ''
      }
      this.showDepartDialog = true
    },
    // 编辑子部分
    async edit(data) {
      this.isEdit = true
      this.clickDepartId = data.id
      this.showDepartDialog = true
      const res = await getDepartDetailAPI(data.id)
      // console.log(res)
      this.$refs.departDialog.form = res.data
    },
    // 删除部分
    del(data) {
      this.$confirm('此操作将永久删除该部门, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async() => {
        const res = await deleteDepartmentsAPI(data.id)
        if (!res.success) return this.$message.error(res.message)
        // 刷新列表
        this.getDepartMentsListFn()
        this.$message({
          type: 'success',
          message: '删除成功!'
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      })
    },
    // 获取部门列表
    async getDepartMentsListFn() {
      const res = await departmentsListAPI()
      // console.log(res)
      // 做校验时需要的数据相对简单，并不需要把部门列表数据全部传递给子组件，这里做一些映射处理
      this.originList = res.data.depts.map(item => ({
        id: item.id,
        code: item.code,
        name: item.name,
        pid: item.pid // 下面使用
      }))
      // console.log(this.originList)
      // 因为后台返回的字段是id和pid而且根是空字符串, 如果不是需要自己改变transTree里判断条件等
      this.treeData = transTree(res.data.depts, '')
    },
    // 获取负责人列表
    async getEmployeesListFn() {
      const res = await getEmployeeSimpleAPI()
      // console.log(res)
      this.employeesList = res.data
    },
    // 编辑-添加部门的方法
    async addDepartmentsFn(dataObj) {
      if (this.isEdit) { // 编辑状态
        dataObj.id = this.clickDepartId
        await updateDepartmentsAPI(dataObj)
      } else { // 新增状态
        dataObj.pid = this.clickDepartId
        await addDepartmentsAPI(dataObj)
        // console.log(res)
      }
      // 更新组织列表
      this.getDepartMentsListFn()
    }
  }
}
</script>

<style lang="scss" scoped>
.box-card {
  padding: 10px 30px;
}

.tab-pane {
  padding: 20px 80px;

  .company {
    margin-left: 12px;
    font-weight: bold;
    font-size: 14px;
  }

  .department-header {
    height: 50px;
    display: flex;
    align-items: center;
    border-bottom: 1px solid #ccc;
  }
}
</style>
