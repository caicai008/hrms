<template>
  <!-- 表单 -->
  <el-form ref="addForm" :model="formData" :rules="rules" label-width="120px">
    <el-form-item label="姓名" prop="username">
      <el-input v-model="formData.username" style="width:50%" placeholder="请输入姓名" />
    </el-form-item>
    <el-form-item label="手机" prop="mobile">
      <el-input v-model="formData.mobile" style="width:50%" placeholder="请输入手机号" />
    </el-form-item>
    <el-form-item label="入职时间" prop="timeOfEntry">
      <el-date-picker v-model="formData.timeOfEntry" style="width:50%" placeholder="请选择入职时间" />
    </el-form-item>
    <el-form-item label="聘用形式" prop="formOfEmployment">
      <el-select v-model="formData.formOfEmployment" style="width:50%" placeholder="请选择">
        <el-option
          v-for="item in hireType"
          :key="item.id"
          :label="item.value"
          :value="item.id"
        />
      </el-select>
    </el-form-item>
    <el-form-item label="工号" prop="workNumber">
      <el-input v-model="formData.workNumber" style="width:50%" placeholder="请输入工号" />
    </el-form-item>
    <el-form-item label="部门" prop="departmentName">
      <el-input
        v-model="formData.departmentName"
        style="width:50%"
        placeholder="请选择部门"
        @focus="departmentNameFocus"
      />
      <div v-if="showTree" class="tree-box">
        <el-tree :data="departmentsList" :props="{ label: 'name' }" @node-click="treeClick" />
      </div>
    </el-form-item>
    <el-form-item label="转正时间">
      <el-date-picker v-model="formData.correctionTime" style="width:50%" placeholder="请选择转正时间" />
    </el-form-item>
    <el-form-item>
      <el-button @click="cancel">取消</el-button>
      <el-button type="primary" @click="submit">确定</el-button>
    </el-form-item>
  </el-form>
</template>

<script>
export default {
  name: 'EmpDialog',
  props: {
    departmentsList: {
      type: Array,
      default: _ => []
    }
  },
  data() {
    return {
      // 添加表单字段
      formData: {
        username: '', // 用户名
        mobile: '', // 手机号
        formOfEmployment: '', // 聘用形式
        workNumber: '', // 工号
        departmentName: '', // 部门
        timeOfEntry: '', // 入职时间
        correctionTime: '' // 转正时间
      },
      // 聘用形式
      hireType: [
        {
          id: 1,
          value: '正式'
        },
        {
          id: 2,
          value: '非正式'
        }
      ],
      // 添加表单的校验字段
      rules: {
        username: [
          { required: true, message: '用户姓名不能为空', trigger: 'blur' },
          { min: 1, max: 4, message: '用户姓名为1-4位', trigger: 'blur' }
        ],
        mobile: [
          { required: true, message: '手机号不能为空', trigger: 'blur' },
          { pattern: /^1[3-9]\d{9}$/, message: '手机号格式不正确', trigger: 'blur' }
        ],
        formOfEmployment: [
          { required: true, message: '聘用形式不能为空', trigger: 'blur' }
        ],
        workNumber: [
          { required: true, message: '工号不能为空', trigger: 'blur' }
        ],
        departmentName: [
          { required: true, message: '部门不能为空', trigger: 'change' }
        ],
        timeOfEntry: [
          { required: true, message: '请选择入职时间', trigger: 'blur' }
        ]
      },
      // 显示部门列表
      showTree: false,
      clickDepartName: '' // 点击的部门名字
    }
  },
  watch: {
    // watch如何监听对象里某个属性, 值的变化呢?
    // 可以用字符串表达式的写法作为配置对象里的key
    'formData.departmentName'(newValue) {
      if (newValue !== this.clickDepartName) {
        this.formData.departmentName = this.clickDepartName
      }
    }
  },
  methods: {
    // 取消按钮
    cancel() {
      this.$emit('update:isDialog', false)
    },

    // 提交按钮
    submit() {
      this.$refs.addForm.validate(valid => {
        if (valid) { // 通过表单校验
          // 传值出去
          this.$emit('addEmpEV', { ...this.formData })

          // 关闭弹窗
          this.$emit('update:sDialog', false)
        }
      })
    },

    // 聚焦显示部门列表
    departmentNameFocus() {
      this.showTree = true
    },

    // 点击树形节点
    treeClick(data) {
      if (data && data.children) {
        return
      }
      this.formData.departmentName = data.name
      // 临时保存点击的部门名字
      this.clickDepartName = data.name
      this.showTree = false
    }
  }
}
</script>

<style lang="scss" scoped></style>
