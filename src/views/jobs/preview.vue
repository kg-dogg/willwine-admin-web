<template>
    <div class="app-container">
        <el-tabs tab-position="top" style="height:auto;">
            <el-tab-pane label="课程基本信息">


                <el-form :model="ruleForm" label-position="left" label-width="180px"
                         style='width: 600px; margin-left:50px;'>

                    <!--中文课程名称-->
                    <el-form-item label="课程名称(中文版)" prop="title">
                        <el-input disabled v-model="ruleForm.title"></el-input>
                    </el-form-item>
                    <!--英文课程名称-->
                    <el-form-item label="课程名称(英文版)">
                        <el-input disabled v-model="ruleForm.title_en"></el-input>
                    </el-form-item>
                    <!--授课方式-->
                    <el-form-item label="授课方式" prop="teaching_method">
                        <el-select disabled v-model="ruleForm.teaching_method" placeholder="请选择授课方式">
                            <el-option :label="curriculum.teaching_method.LIVE" value="LIVE"></el-option>
                            <el-option :label="curriculum.teaching_method.VIDEO" value="VIDEO"></el-option>
                            <el-option :label="curriculum.teaching_method.OFFLINE" value="OFFLINE"></el-option>
                            <el-option :label="curriculum.teaching_method.OFFLINE_LINK" value="OFFLINE_LINK"></el-option>
                        </el-select>
                    </el-form-item>
                    <!--每节课时长-->
                    <el-form-item label="每节课时长" prop="duration">
                        <!--<el-input-number  :min="0" v-model="ruleForm.course_duration"></el-input-number>-->
                        <el-input disabled class="course_duration_number" type="number" :min="0"
                                  v-model.number="ruleForm.duration"></el-input>
                    </el-form-item>
                    <!--课时数-->
                    <!--<el-form-item label="课时数" prop="course_num" >-->
                    <!--<el-input-number :min="0" v-model="ruleForm.course_num"></el-input-number>-->
                    <!--</el-form-item>-->
                    <!--学习周期-->
                    <el-form-item label="学习周期">
                        <el-input-number disabled :min="0" v-model="ruleForm.span"></el-input-number>
                        个月
                    </el-form-item>
                    <!--课程类型-->
                    <el-form-item label="课程类型" prop="category">
                        <el-select disabled v-model="ruleForm.category" placeholder="请选择课程类型">
                            <el-option :label="curriculum.course_type.NORMAL" value="NORMAL"></el-option>
                            <el-option :label="curriculum.course_type.EXAM" value="TRIAL"></el-option>
                        </el-select>
                    </el-form-item>
                    <!--课程分类-->
                    <!--<el-form-item label="课程分类">-->
                        <!--<el-select  disabled v-model="ruleForm.course_class" placeholder="请选择课程分类" >-->
                            <!--&lt;!&ndash;<el-option label="Cantalk" value="Cantalk"></el-option>&ndash;&gt;-->
                            <!--&lt;!&ndash;<el-option label="Riseup" value="Riseup"></el-option>&ndash;&gt;-->
                            <!--&lt;!&ndash;<el-option label="RiseStart" value="RiseStart"></el-option>&ndash;&gt;-->
                            <!--&lt;!&ndash;<el-option label="Riseon" value="Riseon"></el-option>  &ndash;&gt;-->
                            <!--<el-option-->
                                    <!--v-for="item in curriculum.class"-->
                                    <!--:key="item"-->
                                    <!--:label="item"-->
                                    <!--:value="item">-->
                            <!--</el-option>-->


                        <!--</el-select>-->
                    <!--</el-form-item>-->
                    <!--设置作业内容类型-->
                    <!--<el-form-item label="设置作业内容类型" prop="homework_type">-->
                    <!--<el-checkbox-group v-model="ruleForm.homework_type">-->
                    <!--<el-checkbox label="课前预习" name="setcontenttype"></el-checkbox>-->
                    <!--<el-checkbox label="课后作业" name="setcontenttype"></el-checkbox>-->
                    <!--</el-checkbox-group>-->
                    <!--</el-form-item>-->
                    <!--直播教室人数上限-->
                    <el-form-item label="直播教室人数上限">
                        <el-input-number disabled :min="0" v-model="ruleForm.capacity"></el-input-number>
                        人
                    </el-form-item>
                    <!--适合人群-->
                    <el-form-item label="适合人群">
                        <el-input disabled v-model="ruleForm.teaching_object	"></el-input>
                    </el-form-item>
                    <!--课程目标-->
                    <el-form-item label="课程目标">
                        <el-input disabled type="textarea" v-model="ruleForm.purpose"></el-input>
                    </el-form-item>
                    <!--课程缩略图-->
                    <el-form-item label="* 课程缩略图" prop="images">
                        <!--<el-dialog :visible.sync="ruleForm.dialogVisible">-->
                        <el-upload
                                :action="upload_url"
                                list-type="picture-card"
                                :limit=1
                                disabled
                                :file-list="fileList">
                            <i class="el-icon-plus"></i>
                        </el-upload>
                        <!--</el-dialog>-->
                    </el-form-item>

                    <!--课程介绍（中文版）-->
                    <el-form-item label="课程介绍(中文版)">
                        <!--<el-input disabled type="textarea" v-model="ruleForm.description"></el-input>-->
                        <div class="view_description" ref="description"></div>

                    </el-form-item>
                    <!--课程介绍(英文版)-->
                    <el-form-item label="课程介绍(英文版)">
                        <!--<el-input disabled type="textarea" v-model="ruleForm.description_en"></el-input>-->
                        <div class="view_description_en" ref="description_en"></div>
                    </el-form-item>
                </el-form>


            </el-tab-pane>
            <el-tab-pane label="课时信息">
                <el-tree :data="setTree" :props="defaultProps"></el-tree>
            </el-tab-pane>
            <el-tab-pane label="课件作业资源">3333</el-tab-pane>

        </el-tabs>
    </div>


</template>
