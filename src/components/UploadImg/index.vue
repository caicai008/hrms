<template>
  <div>
    <el-upload
      class="avatar-uploader"
      action="#"
      :show-file-list="false"
      :on-success="handleAvatarSuccess"
      :before-upload="beforeAvatarUpload"
      :http-request="upload"
    >
      <img v-if="imageUrl" :src="imageUrl" class="avatar">
      <i v-else class="el-icon-plus avatar-uploader-icon" />
      <el-progress v-if="showProgress" type="circle" :percentage="100" class="progress" />
    </el-upload>
  </div>
</template>

<script>
// 导入 cos 模块
const COS = require('cos-js-sdk-v5')

// SECRETID 和 SECRETKEY请登录 https://console.cloud.tencent.com/cam/capi 进行查看和管理
var cos = new COS({
  SecretId: 'AKIDnPozwWszsWw73lEYeVWKwb6uXv5LNBk5',
  SecretKey: 'A5bFm9JF2jHgJpCOSekeqrgaMyNfooeH'
})
export default {
  name: 'UploadImg',
  data() {
    return {
      imageUrl: '',
      percent: 0, // 图片的上传进度
      showProgress: false // 是够显示上传进度
    }
  },
  methods: {
    handleAvatarSuccess(res, file) {
      this.imageUrl = URL.createObjectURL(file.raw)
    },
    beforeAvatarUpload(file) {
      const isJPG = ['image/jpeg', 'image/png', 'image/jpg', 'image/gif'].includes(file.type)
      const isLt2M = file.size / 1024 / 1024 < 2

      if (!isJPG) {
        this.$message.error('上传头像图片只能是 JPG 格式!')
      }
      if (!isLt2M) {
        this.$message.error('上传头像图片大小不能超过 2MB!')
      }
      return isJPG && isLt2M
    },
    // 自定义上传属性
    upload(res) {
      if (res.file) {
        // 显示进度条
        this.showProgress = true
        cos.putObject({
          Bucket: 'anan-1314586169', // 存储桶的名称，必须
          Region: 'ap-nanjing', // 存储桶所在地域，必须字段
          Key: res.file.name, // 文件名，必须
          StorageClass: 'STANDARD', // 上传模式, 标准模式
          Body: res.file, // 上传文件对象
          // 上传进度条
          onProgress: (progressData) => {
            // 控制进度条的进度
            this.percent = progressData.percent * 100
          }
        }, (err, data) => {
          if (err === null && data.statusCode === 200) {
            this.imageUrl = `https:${data.Location}`
            this.showProgress = false
          }
        })
      }
    }
  }
}
</script>

<style>
  .avatar-uploader .el-upload {
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
  }
  .avatar-uploader .el-upload:hover {
    border-color: #409EFF;
  }
  .avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 160px;
    height: 160px;
    line-height: 178px;
    text-align: center;
  }
  .avatar {
    width: 178px;
    height: 178px;
    display: block;
  }

  .progress {
  position: absolute;
  display: flex;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background: #e4e4e4;
  border-radius: 50%;
  opacity: 0.9;
}
</style>
