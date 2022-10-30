<template>
  <div>
    <!-- 权限点数据展示 -->
    <el-tree
      ref="tree"
      :data="permissionList"
      :props="{ label: 'name' }"
      node-key="id"
      show-checkbox
      default-expand-all
      :check-strictly="true"
    />
    <el-row class="footer" type="flex" justify="center">
      <el-col :span="6">
        <el-button size="small" @click="cancelButton">取 消</el-button>
        <el-button size="small" type="primary" @click="setRolesBtn">确 定</el-button>
      </el-col>
    </el-row>
  </div>
</template>

<script>
export default {
  props: {
    showAssign: {
      type: Boolean,
      default: false
    },
    roleId: {
      type: [Number, String],
      require: true,
      default: ''
    },
    permissionList: {
      type: Array,
      default: () => []
    },
    roleIdsList: {
      type: Array,
      default: () => {}
    }
  },
  data() {
    return {

    }
  },
  watch: {
    roleIdsList() {
      this.$refs.tree.setCheckedKeys(this.roleIdsList)
    }
  },
  methods: {
    cancelButton() {
      this.$emit('update:showAssign', false)
    },
    // 确认
    setRolesBtn() {
      const permIds = this.$refs.tree.getCheckedKeys()
      this.$emit('confirm', { id: this.roleId, permIds: permIds })
      this.$emit('update:showAssign', false)
    }
  }
}
</script>

<style>
.footer {
  margin-top: 30px;
}
</style>
