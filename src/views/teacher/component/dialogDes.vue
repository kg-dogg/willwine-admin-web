<template>
    <div>
        <el-dialog title="添加介绍" center :visible.sync="showDialog.descDialogVisible">

            <el-form label-width="80px" label-position="top">
                <el-tabs type="border-card">
                    <el-tab-pane label="图片介绍">
                        <el-form-item label="">
                            <el-upload
                                :action="upload_url"
                                ref='uploadDes_img'
                                :limit="1"
                                :data="{source: 'forigenteacher'}"
                                :headers="myHeaders"
                                :on-success="onUploadSuccess_img"
                                :before-remove="beforeRemove"
                                :on-remove="handleRemove_img"
                                accept="image/*"
                                :file-list="description_img"
                                list-type="picture">
                                <el-button size="small" type="primary">选择文件</el-button>
                                <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div>
                            </el-upload>
                        </el-form-item>
                        <el-button type="primary" @click="save" :loading="loading">提交</el-button>
                    </el-tab-pane>
                    <el-tab-pane label="视频介绍">视频提交功能暂时关闭,尽请期待!</el-tab-pane>
                    <el-tab-pane label="文字介绍">
                        <el-form-item label="官方介绍">
                            <el-input  type="textarea" :rows="4" placeholder="请输入官方介绍,10到300字" v-model="teacher.introduce"></el-input>
                        </el-form-item>
                        <el-button type="primary" @click="save" :loading="loading">提交</el-button>
                    </el-tab-pane>
                </el-tabs>
            </el-form>

            <!-- <span slot="footer" class="dialog-footer">
                <el-button @click="cancelLeaving">取 消</el-button>
                <el-button type="primary" @click="confirmLeaving" :loading="leavingLoading">提交</el-button>
            </span> -->
        </el-dialog>
    </div>
</template>

<script>
import { globalUploadUrl, editTeacherIntroduce } from '@/api/api';
export default {
    data() {
        return {
            loading: false,
            form: {
                description: '',
                description_img: [],
                description_video: [],
            },

            // 上传
            upload_url: globalUploadUrl,
            myHeaders: {Authorization: `Bearer ${lockr.get('auth_token')}`},
        }
    },

    // 父组件传递进来的数据
    props: {
        teacher: {
            type: Object,
            required: true,
            default: function () {
                return {}
            }
        },
        showDialog: {
            type:Object
        },
    },

    // 计算属性
    computed: {
        description_img() {
            if (this.teacher.img_introduce != '') {
                return [{url: this.teacher.img_introduce, relative_resources_path: this.teacher.img_introduce}];
            } else {
                return [];
            }
        }
    },


    // 方法集合
    methods: {
        save() {
            let formData = {}
            if (this.teacher.introduce != '') {
                formData.introduce = this.teacher.introduce;
            }
            if (this.teacher.img_introduce != '') {
                formData.img_introduce = this.teacher.img_introduce;
            }
            if (this.teacher.video_introduce != '') {
                formData.video_introduce = this.teacher.video_introduce;
            }
            if (this.teacher.video_map != '') {
                formData.video_map = this.teacher.video_map;
            }
            if (Object.keys(formData).length > 0) {
                this.loading = true;
                editTeacherIntroduce(this.teacher.user_id, formData).then(res => {
                    this.loading = false
                    helper.message('success', '保存成功!');
                }).catch(e => this.loading = false)
            }
        },

        // 上传图片成功
        onUploadSuccess_img(response, file, fileList) {
            this.form.description_img = [{name:file.name, relative_resources_path:response.data.relative_resources_path}]
        },
        // 移除上传文件警告
        beforeRemove(file, fileList) {
            return this.$confirm(`确定移除 ${ file.name }？`);
        },
        handleRemove_img(file, fileList) {
            this.form.description_img = [];
        },
    },
}
</script>

<style scoped>

</style>


