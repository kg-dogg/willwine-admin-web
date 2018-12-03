<template>
    <div class="app-container">
        <el-form ref="form" :model="form" label-width="220px"    >
            <el-card>
                <div slot="header" class="clearfix">
                    <span>基本数据</span>
                    <!-- <el-button style="float: right; padding: 3px 0" type="text">操作按钮</el-button> -->
                </div>

                    <div style="max-width:80%">
                        <el-form-item label="Company Name:">
                            <el-input v-model="form.company_name" placeholder="请输入Company Name"><i slot="prefix" class="el-input__icon el-icon-document"></i></el-input>
                        </el-form-item>
                        <el-form-item label="Contact Person:">
                            <el-input v-model="form.contact_person" placeholder="请输入联系人"><i slot="prefix" class="el-input__icon el-icon-service"></i></el-input>
                        </el-form-item>
                    </div>
            </el-card>

            <el-card style="margin-top:20px">
                <div slot="header" class="clearfix"><span>联系信息</span></div>
                    <div style="max-width:80%">
                        <el-form-item label="Address:">
                            <el-input v-model="form.address_line_1" placeholder="请输入地址"><i slot="prefix" class="el-input__icon el-icon-location"></i></el-input>
                        </el-form-item>
                        <el-form-item label="Email:">
                            <el-input v-model="form.email" placeholder="请输入联系邮箱"><i slot="prefix" class="el-input__icon el-icon-message"></i></el-input>
                        </el-form-item>
                        <el-form-item label="Website:">
                            <el-input v-model="form.website" placeholder="请输入公司网站"><i slot="prefix" class="el-input__icon el-icon-menu"></i></el-input>
                        </el-form-item>
                        <el-form-item label="Phone:">
                            <el-input v-model="form.phone" placeholder="请输入联系电话"><i slot="prefix" class="el-input__icon el-icon-phone-outline"></i></el-input>
                        </el-form-item>
                        <el-form-item label="Fax:">
                            <el-input v-model="form.fax" placeholder="请输入传真号"><i slot="prefix" class="el-input__icon el-icon-printer"></i></el-input>
                        </el-form-item>
                    </div>
            </el-card>
<hr/>
            <el-form-item>
                        <el-button type="primary" @click="onSubmit" :loading="loading">提交</el-button>
                    </el-form-item>
        </el-form>
    </div>
</template>


<script>
import { saveConfiguration } from "@/api/api";
export default {
    data() {
        return {
            loading: false,
            form: {
                company_name:"",
                contact_person:"",
                address_line_1: '',
                city: '',
                state: '',
                zipcode: '',
                country: '',
                phone: '',
                fax: '',
                email: '',
                website: '',
                config_type: 'basic',
            }
        }
    },

    created: function() {
        this.init()
    },

    // 方法集合
    methods: {
        init() {
            axios.get('/configuration')
                .then(response => response.data)
                .then((response) => {
                    Object.keys(this.form).forEach((v) => {
                        this.form[v] = response[v];
                    })
                }).catch((error) => {

                });
        },
        onSubmit() {
            this.loading = true;
            this.form.config_type = 'basic';
            saveConfiguration(this.form).then(res => {
                this.loading = false
                helper.message('success', res.message || 'configuration edit success!');
                this.$store.dispatch('setConfig', this.form);

            }).catch((error) => {
                this.loading = false;
            });
        }
    },
};
</script>


<style scoped>
</style>


