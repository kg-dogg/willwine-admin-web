<template>
  <el-card>
    <div class="filter-container">
      <el-row type="flex" class="row-bg">
        <el-col :span="12">
          <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>品牌列表</el-breadcrumb-item>
          </el-breadcrumb>
        </el-col>
        <el-col :span="2" :offset="10">
          <el-button type="text" icon='el-icon-plus' @click='add()'>创建</el-button>
        </el-col>
      </el-row>
    </div>
    <el-table :data="data">
      <el-table-column prop="name" label="品牌" />
      <el-table-column prop="list_pic_url" label="列表图">
        <template slot-scope="scope">
          <div
            class="img-in-table"
            v-bind:style="{ backgroundImage: `url(${scope.row.list_pic_url})` }"
          />
        </template>
      </el-table-column>
      <el-table-column prop="pic_url" label="展示图">
        <template slot-scope="scope">
          <div
            class="img-in-table"
            v-bind:style="{ backgroundImage: `url(${scope.row.pic_url})` }"
          />
        </template>
      </el-table-column>
      <el-table-column prop="simple_desc" label="简介">
        <template slot-scope="scope">
          <el-tooltip class="item" effect="dark" v-bind:content="scope.row.simple_desc" placement="bottom-start">
            <el-button>{{scope.row.simple_desc.substr(0, 2)}}...</el-button>
          </el-tooltip>
        </template>
      </el-table-column>
      <el-table-column prop="sort_order" label="顺序" />
      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-button
              @click.native.prevent="editRow(scope)"
              type="text"
              size="small">
              编辑
            </el-button>
            <el-button
              @click.native.prevent="deleteRow(scope)"
              type="text"
              size="small">
              移除
            </el-button>
        </template>
      </el-table-column>
    </el-table>
    <Edit
      v-model="editVisible"
      @submit-brand="submitBrand"
      :edit-id="editId"
    />
  </el-card>
</template>

<script>
  import { goodsBrand } from '@/api';
  import Edit from "./components/edit";
  export default {
    components: {
      Edit,
    },
    data() {
      return {
        form: {
          name: '',
        },
        data: [],
        editVisible: false,
        editId: 0,
      }
    },
    created() {
      this.getList();
    },
    methods: {
      add() {
        this.editId = 0;
        this.editVisible = true;
      },
      async getList() {
        this.editVisible = false;
        const { code, data } = await goodsBrand.list();
        code === 200 && (this.data = data);
      },
      async deleteRow({ row }) {
        const { id } = row;
        const { code } = await goodsBrand.del({ id });
        (code === 200)
          ? this.getList()
          : this.$message.error(msg);
      },
      async editRow({ row }) {
        const { id } = row;
        this.editId = id;
        this.editVisible = true;
        // const { code, msg } = await goodsBrand.put({ id, name });
        // (code === 200)
        //   ? this.getList()
        //   : this.$message.error(msg);
      },
      async submitBrand(form) {
        const { code, msg } = form.id
          ? await goodsBrand.put(form)
          : await goodsBrand.create(form);
        (code === 200)
          ? this.getList()
          : this.$message.error(msg.sql);
      }
    },
  }
</script>

<style>
.img-in-table {
  width: 50px;
  height: 50px;
  border: 1px solid #ccc;
  background-size: contain;
  background-position: center;
  background-repeat: no-repeat;
}
</style>
