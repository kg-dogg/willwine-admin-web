<template>
    <div >
        <el-form ref="formBasic" :rules="rules" :model="form" label-width="100px" >
            <el-form-item label="英文名:" prop="name_en">
                <el-input v-model="form.name_en" placeholder='请输入英文名'></el-input>
            </el-form-item>
            <el-form-item label="邮箱地址:" prop="email">
                <el-input v-model="form.email" placeholder='请输入员工邮箱'></el-input>
            </el-form-item>

            <el-form-item label="性别:" prop="gender">
                <el-radio-group v-model="form.gender" size="small">
                    <el-radio-button v-for='(item,index) in genderList' :key='item.value' :label="item.value">{{item.label}}</el-radio-button>
                </el-radio-group>
            </el-form-item>

            <el-form-item label="业务品牌:" v-if="user.profile" prop="brand">
                <el-radio-group v-model="form.profile.brand" size="small">
                    <el-radio-button v-for='(item,index) in brands' :key='item.value' :label="item.value">{{item.label}}</el-radio-button>
                </el-radio-group>
            </el-form-item>

            <!-- <el-form-item   label="重置密码:" prop="password">
                <el-input v-model="form.password" placeholder='' type="password"></el-input>
            </el-form-item> -->

            <el-form-item   label="角色权限:" prop="role">
              <el-select placeholder='请选择所属角色' v-model='form.role' >
                <el-option v-for='(item, index) in roles' :key='index' :value='item.id' :label="item.description" :disabled="roleCanSelect(item)"></el-option>
              </el-select>
            </el-form-item>

            <el-form-item   label="状态:" prop="status">
              <el-switch :disabled="user.status == 'banned'"  v-model="form.status" active-value="activated" inactive-value="banned"></el-switch>
            </el-form-item>

            <el-form-item>
                <el-button type="primary" @click="onSubmit" :loading="loading">修改</el-button>
                <el-button @click="returnEmployee">返回</el-button>
            </el-form-item>

        </el-form>
    </div>
</template>


<script>
import { roleList, getUserInfo, updateUserBaseInfo } from "@/api/api";

export default {
    data() {
        return {
            loading: false,
            roles:[],
            genderList: [{ label: '男', value: 'male' }, { label: '女', value: 'female' }],
            brands: [{ label: '总部', value: 'rise' }, { label: 'Cantalk', value: 'cantalk' }, { label: 'Riseup', value: 'riseup' }],
            form: {},
            rules: {
                email: [
                    {required:true, message:'请输入邮箱', trigger:'blur'},
                    {type: 'email', message: '请输入正确的邮箱格式', trigger:'blur'}
                ],
                role: [{required:true, message: '请选择角色', trigger:'blur'}],
                password: [{min: 6, max: 12, message: '长度在 6 到 12 个字符', trigger: 'blur'}]
            }
        }
    },

    created: function() {
        this.fetchPreRequisites();
        this.resetUser();
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
        // 获取角色列表
         fetchPreRequisites() {
            roleList().then(res => {
                this.roles = res
            }).catch(e => {})
        },

        // 配置user数据
        resetUser() {
            let formTemp = {
                email: this.user.email,
                name_en: this.user.name_en,
                gender: this.user.gender || 'male',
                brand: this.user.profile.brand || 'rise',
                //mobile: this.user.mobile,
                name: this.user.name,
                status: this.user.status,
                profile: {
                    ...this.user.profile
                }
                //password: ''
            }
            if (this.user.roles && this.user.roles.length > 0) {
                formTemp.role = this.user.roles[0]['id']
            } else {
                formTemp.role = ''
            }
            this.form = {
                ...formTemp
            };
        },

        onSubmit() {
             this.$refs['formBasic'].validate((valid) => {
                if (valid) {
                    this.submit();
                } else {
                    return false;
                }
            });
        },
        submit() {

            if (this.form.role != '') {
                this.form.role_id = [this.form.role];
            }
            this.loading = true;
            updateUserBaseInfo(this.user.id, this.form).then(res => {
                this.loading = false;
                 this.$emit('change');
                helper.message('success', '更新成功!');
            }).catch(e => {
                this.loading = false;
            })
        },

        roleCanSelect(item) {
            return item.name == 'student' || item.name == 'parent';
        },

        // 带着之前的搜索条件,返回到列表去
        returnEmployee() {
            this.$router.push({name: 'userLists'});
        }
    },
}
</script>





