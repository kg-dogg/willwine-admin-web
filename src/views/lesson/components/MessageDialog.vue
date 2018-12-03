<template>
    <el-dialog
        center
        modal
        title="留言"
        :visible.sync="showDialog.showMessage"
        width="45%"
        @close="close">
        <p>TO 老师：</p>
        <p>学生的下一节课在<b>{{time}}</b>开课，外教老师会在进入教室前收到此信息！</p>
        内容：
        <textarea name="message" cols="30"
            placeholder="请在此输入发给老师的内容，字数限制在1000字符。注意发给外教的话请输入英文。"
            maxlength="1000"
            v-model="text">
        </textarea>
        <span slot="footer" class="dialog-footer">
            <el-button type="primary" @click="sendMessage" :loading="loading" >发送</el-button>
        </span>
    </el-dialog>
</template>
<script>
    import { addMessageToTeacher } from "@/api/api";
    export default {
        props:['showDialog', 'data'],
        data(){
            return {
                loading: false,
                text:'',
            }
        },
        // 计算属性
        computed: {
            time() {
                return moment(this.data.recent_time).format('YYYY年MM月DD日 HH:mm')
            }
        },
        methods:{
            sendMessage() {
                if (this.text == '') {
                    helper.message('error', "请输入留言内容");
                    return;
                }
                this.loading = true;
                addMessageToTeacher(this.text,this.data.sid, this.data.cid).then(res => {
                    helper.message('success', "给老师留言成功!~");
                    this.loading = false
                    this.close();
                    this.showDialog.showMessage = false;
                }).catch(error => {
                    this.loading = false
                })
            },
            close(){
                this.text = '';
            },
        }
    }
</script>
<style>
textarea{
    width: 100%;
    border: 1px solid #eee;
    outline: none;
    height: 100px;

}
</style>


