<template>
  <div>
    <!-- 渲染数据 -->
    <el-checkbox-group v-model="roleArr">
      <el-checkbox v-for="item in roleList" :key="item.id" :label="item.id">
        <span>{{ item.name }}</span>
      </el-checkbox>
    </el-checkbox-group>
    <!-- 按钮 -->
    <el-row class="footer" type="flex" justify="center">
      <el-col :span="6">
        <el-button type="primary" size="small" @click="confirmFn">确定</el-button>
        <el-button size="small" @click="cancelDialog">取消</el-button>
      </el-col>
    </el-row>
  </div>
</template>

<script>
export default {
  props: {
    userId: {
      type: String,
      default: null
    },
    roleList: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      roleArr: [] // 收集默认已有权限
    }
  },
  methods: {
    cancelDialog() {
      this.$emit('close')
    },
    confirmFn() {
      this.$emit('confirm', this.roleArr)
      // console.log(this.roleArr)
    }
  }
}
</script>

<style>
.footer {
  margin-top: 30px;
}
</style>
