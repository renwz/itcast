<template>
  <el-card>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>用户管理</el-breadcrumb-item>
      <el-breadcrumb-item>用户列表</el-breadcrumb-item>
    </el-breadcrumb>
    <div style="margin-top: 15px;">
      <el-row>
        <el-col :span="8">
          <el-input placeholder="请输入内容" v-model="search" class="input-with-select">
            <el-button slot="append" icon="el-icon-search" @click="seach"></el-button>
          </el-input>
        </el-col>
        <el-col :span="2">
          <el-button type="success" plain>添加按钮</el-button>
        </el-col>
      </el-row>
    </div>
    <el-table :data="list" border style="width: 100%">
      <el-table-column type="index" width="50"></el-table-column>
      <el-table-column prop="email" label="姓名" width="180"></el-table-column>
      <el-table-column prop="email" label="郵箱" width="180"></el-table-column>
      <el-table-column prop="mobile" label="電話"></el-table-column>
      <el-table-column prop="address" label="用戶狀態">
        <template slot-scope="scope">
          <el-switch
            v-model="scope.row.mg_state"
            active-color="#13ce66"
            inactive-color="#ff4949"
            @change="switchchange(scope.row.mg_state,scope.row.id)"
          ></el-switch>
        </template>
      </el-table-column>
      <el-table-column label="狀態">
        <template slot-scope="scope">
          <el-button type="primary" icon="el-icon-edit" size="mini"></el-button>
          <el-button type="success" icon="el-icon-check" size="mini"></el-button>
          <el-button type="danger" icon="el-icon-delete" size="mini"></el-button>
        </template>
      </el-table-column>
    </el-table>
    <div class="block">
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="pagenum"
        :page-sizes="[5, 10, 50]"
        :page-size="pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      ></el-pagination>
    </div>
  </el-card>
</template>

<script>
export default {
  data() {
    return {
      list: [],
      total: 0,
      pagenum: 1,
      pagesize: 5,
      search: ""
    };
  },
  methods: {
    handleSizeChange(val) {
      this.pagesize = val;
      this.getAllList();
    },
    handleCurrentChange(val) {
      this.pagenum = val;
      this.getAllList();
    },
    async getAllList() {
      var res = await this.$http.request({
        method: "get",
        url: `users?query=${this.search}&pagenum=${this.pagenum}&pagesize=${
          this.pagesize
        }`,
        headers: {
          Authorization: window.localStorage.getItem("token")
        }
      });
      var { meta, data } = res.data;
      if (meta.status === 200) {
        this.list = data.users;
        this.total = data.total;
      }
    },
    seach() {
      this.getAllList();
    }
  },
  mounted() {
    this.getAllList();
  }
};
</script>

<style>
.el-table__body {
  height: 100%;
}
</style>
