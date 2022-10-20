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
                        <el-dropdown-item>添加子部门</el-dropdown-item>
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
                            <el-dropdown-item @click.native="del(data)">删除部门</el-dropdown-item>
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
  </div>
</template>

<script>
import { departmentsListAPI } from '@/api/departments'
import { transTree } from '@/utils/index'
export default {
  name: 'Departments',
  data() {
    return {
      activeName: 'first',
      // 树形控件数据
      treeData: [],
      // 定义结构显示
      defaultProps: {
        children: 'children',
        label: 'name'
      }
    }
  },
  created() {
    this.getDepartMentsListFn()
  },
  methods: {
    handleClick() {

    },
    // 正文部分-右侧的添加子部门
    add(data) {

    },
    // 编辑子部分
    edit(data) {

    },
    // 删除部分
    del(data) {

    },
    // 获取部门列表
    async getDepartMentsListFn() {
      const res = await departmentsListAPI()
      // console.log(res)
      // 因为后台返回的字段是id和pid而且根是空字符串, 如果不是需要自己改变transTree里判断条件等
      this.treeData = transTree(res.data.depts, '')
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
