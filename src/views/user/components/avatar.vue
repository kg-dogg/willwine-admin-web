<template>
    <div>
         <el-upload
            ref="upload"
            class="avatar-uploader"
            :action="upload_url"
            :headers="myHeaders"
            :data="upLoadData"
            :show-file-list="false"
            :auto-upload="false"
            :on-success="handleAvatarSuccess"
            :before-upload="beforeAvatarUpload">
            <img v-if="user.avatar" :src="user.avatar | cdn_img" class="avatar">
            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
            <el-button slot="trigger" v-if="user.avatar" size="small" type="primary">选取文件</el-button>
        </el-upload>
        <el-button style="margin-top:20px" size="small" type="success" @click="submitUpload">上传到服务器</el-button>
    </div>
</template>


<script>
import { globalAvatarUrl } from '@/api/api';
export default {
    data() {
        return {
            imageUrl: '',
            upload_url: globalAvatarUrl(this.$route.params.id),
            upLoadData: {
                source: 'avatar',
            },
            myHeaders: {
                Authorization: `Bearer${lockr.get('auth_token')}`,
            },
        }
    },

    // 父组件传递进来的数据
    props: {
        user: {
            type: Object,
            required: true,
            default: function () {
                return {}
            }
        },
    },

    watch: {
        user(newVal) {
            this.user = newVal;
        },
    },

    // 方法集合
    methods: {
        submitUpload() {
             this.$refs.upload.submit();
        },
        handleAvatarSuccess(res, file) {
            this.imageUrl = URL.createObjectURL(file.raw);
            helper.message('success', '头像更新成功!');
            // console.log(res.avatar)
            this.user.avatar = res.avatar
            this.$emit('change');
        },
        beforeAvatarUpload(file) {
            const isJPG = file.type === 'image/jpeg';
            const isLt2M = file.size / 1024 / 1024 < 2;

            if (!isJPG) {
                this.$message.error('上传头像图片只能是 JPG 格式!');
            }
            if (!isLt2M) {
                this.$message.error('上传头像图片大小不能超过 2MB!');
            }
            return isJPG && isLt2M;
        },
    },
}
</script>

<style lang="scss" >
  .avatar-uploader {
    .el-upload {
        border: 1px dashed #d9d9d9;
        border-radius: 6px;
        cursor: pointer;
        position: relative;
        overflow: hidden;
    }
    .el-upload:hover {
        border-color: #409EFF;
    }

    .avatar-uploader-icon {
        font-size: 28px;
        color: #8c939d;
        width: 178px;
        height: 178px;
        line-height: 178px;
        text-align: center;
    }
    .avatar {
        width: 178px;
        height: 178px;
        display: block;
    }
}

</style>


