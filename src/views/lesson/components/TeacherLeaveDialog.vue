<template>
    <el-dialog
    center
    modal
    title="老师请假"
    :visible.sync="showDialog.showLeave"
    width="45%"
    @close="close">
        <p>老师因个人原因申请请假</p>
        <p>请假原因请假原因请假原因请假原因</p>
        <p>申请请假时间： 北京时间 2018/05/08  19:49</p>
    </el-dialog>
</template>
<script>
    export default {
        props:['showDialog'],
        data(){
            return {
                text:'',
            }
        },
        methods:{
            sendMessage() {
                console.log('sent');
            },
            close(){
                this.text = '';
            },
        }
    }
</script>
