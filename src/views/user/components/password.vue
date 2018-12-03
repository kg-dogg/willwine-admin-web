<template>
    <div class="">
        <el-form ref="formBasic" :rules="rules" :model="form" label-width="100px" >
            <el-form-item label="输入新密码:" prop="new_password">
                <el-input v-model="form.new_password" placeholder='' type="password" style="width:50%"></el-input>
            </el-form-item>

            <el-form-item label="确认新密码:" prop="new_password_confirmation">
                <el-input v-model="form.new_password_confirmation" placeholder='' type="password" style="width:50%"></el-input>
            </el-form-item>

            <el-form-item>
                <el-button type="primary" @click="onSubmit" :loading="loading">更新密码</el-button>
            </el-form-item>
        </el-form>


    </div>
</template>


<script>
import { updateUserPassword } from "@/api/api";
export default {
    data() {
        var validatePass2 = (rule, value, callback) => {
            if (value === '') {
                callback(new Error('请再次输入密码'));
            } else if (value !== this.form.new_password) {
                callback(new Error('两次输入密码不一致!'));
            } else {
                callback();
            }
        };
        return {
            loading: false,
            form: {
                new_password: '',
                new_password_confirmation: ''
            },
            rules: {
                new_password: [
                    {required: true, message: '请输入密码', trigger: 'blur'},
                    {min:6, max:12, message: '长度在 6 到 12 个字符', trigger: 'blur'},
                ],
                new_password_confirmation: [
                    { validator: validatePass2, trigger: 'blur' }
                ],
            }
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

    // 方法集合
    methods: {
        onSubmit() {
            this.$refs['formBasic'].validate((valid) => {
                if (valid) {
                    this.confirmSubmit();
                } else {
                    return false;
                }
            });
        },
        confirmSubmit() {
            this.loading = true;
            updateUserPassword(this.user.id, this.form).then((res) => {
                this.loading = false;
                helper.message('success', res.message);
            }).catch((error) => {
                this.loading = false;
                helper.message('error', error);
            });
        }
    },
}
</script>


<style scoped>

</style>

