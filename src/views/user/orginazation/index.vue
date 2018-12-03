<template>
    <div class="app-container">
        <el-row :gutter="20">
            <el-col :span="14">
                <el-card>
                    <div slot="header" class="clearfix">组织结构列表</div>
                    <el-tree :data="orgs" :props="treeProps" :default-expanded-keys="['1']" node-key="id" >
                        <span class="custom-tree-node" slot-scope="{ node, data }">
                            <span>{{ node.label }} - {{data.org_code}} </span>
                            <span class="tree_associate">
                                <el-tag size="mini" v-if="data.org_associate == '10'" type="success">直营</el-tag>
                                <el-tag size="mini" v-if="data.org_associate == '20'" type="warning">合作</el-tag>
                                <el-tag size="mini" v-if="data.org_associate == '30'" type="danger">品牌</el-tag>

                            </span>
                        </span>
                    </el-tree>
                </el-card>
            </el-col>

            <el-col :span="10">
                <el-card>
                    <div slot="header" class="clearfix">岗位列表</div>
                    <el-table :data="positions" element-loading-text="loading"  highlight-current-row v-loading="loadingPos" empty-text="暂无数据" style="width: 100%">
                        <el-table-column  prop="id" label="ID"  ></el-table-column>
                        <el-table-column  prop="positions" label="岗位名称"  ></el-table-column>
                    </el-table>

                    <div class="pagination" >
                        <el-pagination background layout="prev, pager, next" :page-size="pagination.per_page" :current-page = "pagination.current_page"  @current-change ="page" :total="pagination.total"></el-pagination>
                    </div>
                </el-card>
            </el-col>
        </el-row>


    </div>
</template>


<script>
import { getCosOrginazations, getPositions } from "@/api/api";
export default {
    data() {
        return {
            loadingOrg: false,
            loadingPos: false,
            orgs: [],
            positions: [],
            pagination: {per_page:10, current_page:0, total: 0},
            treeProps: {
                label: 'org_name',
                children: 'children',
                isLeaf: 'leaf'
            },
        }
    },

    created: function() {
        this.initOrg();
        this.initPos();
    },

    // 方法集合
    methods: {
        // 初始化获取组织结构顶层结构
        initOrg() {
            getCosOrginazations().then(res => {
                // 处理数据
                this.orgs = this.transDate(res.data, 'cos_id', 'org_parent');
                console.log(this.orgs)
            })
        },

        // 初始化获取岗位列表
        initPos() {
            this.loadingPos = true;
            getPositions(this.pagination.current_page).then(res => {
                this.positions = res.data;
                this.pagination.current_page = res.current_page;
                this.pagination.total = res.total;
                this.loadingPos = false;
            }).catch(e => {this.loadingPos = false})
        },

        transDate(list,idstr,pidstr){
			var result = [],temp = {};
			for(var i = 0; i < list.length; i++){
				temp[list[i][idstr]]=list[i];//将nodes数组转成对象类型
			}
			for(var j=0; j<list.length; j++){
				var tempVp = temp[list[j][pidstr]]; //获取每一个子对象的父对象
				if(tempVp){//判断父对象是否存在，如果不存在直接将对象放到第一层
					if(!tempVp["children"]) tempVp["children"] = [];//如果父元素的nodes对象不存在，则创建数组
					tempVp["children"].push(list[j]);//将本对象压入父对象的nodes数组
				}else{
					result.push(list[j]);//将不存在父对象的对象直接放入一级目录
				}
			}
			return result;
        },

        page(currPage) {
            this.pagination.current_page = currPage;
            this.initPos();
        }

    },
}
</script>

<style scoped>
.tree_associate {
    color: #ff7733;
    font-style: 'italic';
    margin-left: 20px;
}
</style>


