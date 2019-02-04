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
      <el-table-column prop="username" label="姓名" width="180"></el-table-column>
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
          <!-- {{scope.row}} -->
          <el-button type="primary" icon="el-icon-edit" size="mini" @click="edit(scope.row.id)">
           
          </el-button>
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
    <!-- 编辑用户 -->
     <el-dialog title="修改用户" :visible.sync="openEdit">
              <el-form :model="editList">
                <el-form-item label="用户名" label-width="120px">
                  <el-input v-model="editList.username" autocomplete="off"></el-input>
                </el-form-item>
                 <el-form-item label="邮箱" label-width="120px">
                  <el-input v-model="editList.email" autocomplete="off"></el-input>
                </el-form-item>
                 <el-form-item label="电话" label-width="120px">
                  <el-input v-model="editList.mobile" autocomplete="off"></el-input>
                </el-form-item>
              
              </el-form>
              <div slot="footer" class="dialog-footer">
                <el-button @click="openEdit = false">取 消</el-button>
                <el-button type="primary" @click="openEdit = Edit(editList.id)">确 定</el-button>
              </div>
            </el-dialog>
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
      search: "",
      openEdit: false,
      editList:[]
    };
  },
  methods: {
    // 更改状态
    async switchchange(isTrue,id){
      // console.log(isTrue,id)
      var res = await this.$http.request({
        url: `users/${id}/state/${isTrue}`,
        method:'put',
        headers:{
          Authorization:window.localStorage.getItem('token')
        }
      })
      var {meta, data} = res.data
      if(meta.status===200){
        this.$message({
          message:meta.msg,
          type:'success'
        })  
      }else{
        this.$message.error(meta.msg)
      }
    },
    // 点击编辑按钮
    async edit(id){
      this.openEdit=true
      var res = await this.$http.request({
        url:`users/${id}`,
        method:'get',
        headers:{
          Authorization:window.localStorage.getItem('token')
        }
      })
      var {meta,data} = res.data
      if(meta.status===200){
        this.editList=data
      }else{
        this.$message.error(meta.mag)
      }
    },
    // 修改编辑按钮
    async Edit(id){
      var res = await this.$http.request({
        url:`users/${id}`,
        method:'put',
        data:{
          email:this.editList.email,
          mobile:this.editList.mobile
        },
        headers:{
          Authorization:window.localStorage.getItem('token')
        }
      })
      var {meta} = res.data
      if(meta.status===200){
        this.$message({
          message:meta.msg,
          type:'success'
        })
        this.getAllList()
        this.openEdit=false
      }else{
        this.$message.error(meta.msg)
      }
    },
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
