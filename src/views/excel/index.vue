<template>
  <div class="app-container">
    <upload-excel-component :on-success="handleSuccess" :before-upload="beforeUpload" />
    <el-table :data="tableData" border highlight-current-row style="width: 100%;margin-top:20px;">
      <el-table-column v-for="item of tableHeader" :key="item" :prop="item" :label="item" />
    </el-table>
  </div>
</template>

<script>
import UploadExcelComponent from '@/components/UploadExcel/index.vue'
import { formatExcelDate, parseTime } from '@/utils'
import { importEmployeeAPI } from '@/api'

export default {
  name: 'UploadExcel',
  components: { UploadExcelComponent },
  data() {
    return {
      tableData: [],
      tableHeader: []
    }
  },
  methods: {
    beforeUpload(file) {
      const isLt1M = file.size / 1024 / 1024 < 1

      if (isLt1M) {
        return true
      }

      this.$message({
        message: '请不要上传超过1M的文件',
        type: 'warning'
      })
      return false
    },
    // 将表格中的数据进行格式化
    transExcel(results) {
      const userRelations = {
        '入职日期': 'timeOfEntry',
        '手机号': 'mobile',
        '姓名': 'username',
        '转正日期': 'correctionTime',
        '工号': 'workNumber',
        '部门': 'departmentName',
        '聘用形式': 'formOfEmployment'
      }
      // 遍历results中的每一个对象
      return results.map(obj => {
        const newObj = {}
        // 拿到每一个中文key
        const zhKey = Object.keys(obj)
        // 遍历中文key，替换为英文 => userRelations 的value值
        zhKey.forEach(item => {
          // userRelations[obj] 是 userRelations 的每一项value
          const enKey = userRelations[item]
          // 处理时间
          if (enKey === 'timeOfEntry' || enKey === 'correctionTime') {
            const transDate = new Date(formatExcelDate(obj[item]))
            newObj[enKey] = parseTime(transDate, '{yyyy}-{mm}-{dd}')
          } else {
            newObj[enKey] = obj[item]
          }
        })
        return newObj
      })
    },
    // 导入成功以后的回调函数
    async handleSuccess({ results, header }) {
      const arr = this.transExcel(results)
      const res = await importEmployeeAPI(arr).catch(err => err)
      if (!res.success) return this.$message.error(res.message)
      this.$router.back()
      this.$message.success('操作成功')
    }
  }
}
</script>
