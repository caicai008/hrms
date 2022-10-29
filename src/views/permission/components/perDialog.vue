<template>
  <!-- 放置一个弹层 用来编辑新增节点 -->
  <el-dialog title="新增权限点" :visible="showDialog" @close="btnCancel">
    <!-- 表单 -->
    <el-form ref="perForm" :model="formData" :rules="rules" label-width="120px">
      <el-form-item label="权限名称" prop="name">
        <el-input v-model="formData.name" style="width:90%" />
      </el-form-item>
      <el-form-item label="权限标识" prop="code">
        <el-input v-model="formData.code" style="width:90%" />
      </el-form-item>
      <el-form-item label="权限描述">
        <el-input v-model="formData.description" style="width:90%" />
      </el-form-item>
      <el-form-item label="开启">
        <el-switch
          v-model="formData.enVisible"
          active-value="1"
          inactive-value="0"
        />
      </el-form-item>
    </el-form>
    <el-row slot="footer" type="flex" justify="center">
      <el-col :span="6">
        <el-button size="small" type="primary" @click="btnConfirm">确定</el-button>
        <el-button size="small" @click="btnCancel">取消</el-button>
      </el-col>
    </el-row>
  </el-dialog>
</template>

<script>
export default {
  props: {
    showDialog: {
      type: Boolean,
      default: false
    },
    type: {
      type: [String, Number],
      default: ''
    },
    pid: {
      type: [String, Number],
      default: ''
    }
  },
  data() {
    return {
      permissionList: [], // 权限管理列表数据
      formData: {
        name: '', // 名称
        code: '', // 权限标识
        description: '', // 描述
        enVisible: '0', // 开启
        pid: '', // 添加到哪个节点下
        type: '' // 类型吖
      },
      rules: {
        name: [{ required: true, message: '权限名称不能为空', trigger: 'blur' }],
        code: [{ required: true, message: '权限标识不能为空', trigger: 'blur' }]
      }
    }
  },
  watch: {
    showDialog() {
      this.formData.type = this.type
      this.formData.pid = this.pid
    }
  },
  methods: {
    btnCancel() {
      this.$emit('update:showDialog', false)
    },
    btnConfirm() {
      // 有表单，所以需要兜底校验
      this.$refs.perForm.validate(async valid => {
        if (valid) {
          this.$emit('confirm', this.formData)
        }
      })
    }
  }
}
</script>

<style>

</style>
