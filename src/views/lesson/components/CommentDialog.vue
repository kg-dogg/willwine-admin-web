<template>
    <el-dialog
        center
        modal
        title="添加评语"
        :visible.sync="showDialog.showComment"
        width="45%"
        @close="close">
        <el-rate
            class='rate'
            v-model="rate"
            show-text
            :texts='rateTexts'>
        </el-rate>
        <textarea name="message" cols="30"  
            placeholder="请输入10 ~ 1000字评价内容"
            maxlength="1000"
            v-model="text">
        </textarea>
        <el-button type="primary" @click="sendMessage" class='submit' >提交</el-button>
        <div class='teacherComment'>
            <h6>课堂表现评价</h6>
            <p>From 老师：Alice Black
                <span class='study-state'>Study State：Successed</span>
            </p>
            <p class='comment'>
                Donec accumsan porttitor velit non venenatis. Praesent vehicula convallis nisl non aliquet. Curabitur viverra nulla nec pulvinar volutpat. Etiam quis nisl augue. Sed fermentum mattis malesuada. Praesent congue blandit metus non blandit. Vivamus ante nisl, egestas quis ultricies eget, sollicitudin nec mauris. Donec molestie est dui, ac tincidunt tellus placerat ac. Nulla quam turpis, tincidunt non lorem at, varius hendrerit diam. Ut neque erat, elementum ac molestie in, mattis non massa. Vivamus lorem sapien, posuere vel justo vel, condimentum tempus libero. Sed vulputate orci magna, sed aliquam ex lacinia in. Nullam quis tortor velit. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse erat augue, convallis lacinia erat sed, ullamcorper imperdiet lectus. Donec dapibus, leo nec lobortis accumsan, lacus est suscipit nibh, sit amet convallis erat est et arcu.

            </p>
        </div>

    </el-dialog>
</template>
<script>
    export default {
        props:['showDialog'],
        data(){
            return {
                rate: '',
                rateTexts: ['要加油啦！', '要加油啦！', '表现很好！', '表现很好！', '表现优秀！'],
                text:''
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
<style scoped>
.rate{
    padding-left: 245px;
    margin-bottom: 30px;
}
textarea{
    width: 100%;
    border: 1px solid #eee;
    outline: none;
    height: 100px;   
}
.submit{
    display: block;
    margin: 0 auto;
}
.teacherComment{
    border-top: 1px solid #ddd;
    margin-top: 10px;
    padding: 15px 0;
}
.study-state{
    float: right;
}
.comment{
    overflow-y: auto;
    max-height: 100px;
}
</style>
