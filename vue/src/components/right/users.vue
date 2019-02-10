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
          <el-button type="success" plain @click="addlog">添加按钮</el-button>
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
          <el-button type="primary" icon="el-icon-edit" size="mini" @click="edit(scope.row.id)"></el-button>
          <el-button type="success" icon="el-icon-check" size="mini" @click="check(scope.row.id)"></el-button>
          <el-button type="danger" icon="el-icon-delete" size="mini" @click="del(scope.row.id)"></el-button>
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
    <!-- 添加用户 -->
    <el-dialog title="收货地址" :visible.sync="addLog">
      <el-form :model="addObj">
        <el-form-item label="用户名" label-width="120px">
          <el-input v-model="addObj.username" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="密码" label-width="120px">
          <el-input v-model="addObj.password" autocomplete="off" type="password"></el-input>
        </el-form-item>
        <el-form-item label="邮箱" label-width="120px">
          <el-input v-model="addObj.email" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="电话" label-width="120px">
          <el-input v-model="addObj.mobile" autocomplete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="addLog = false">取 消</el-button>
        <el-button type="primary" @click="add">确 定</el-button>
      </div>
    </el-dialog>
    <!-- 编辑用户面板 -->
    <el-dialog title="收货地址" :visible.sync="editdialog">
      <el-form :model="editObj">
        <el-form-item label="用户名" label-width="120px">
          <el-input v-model="editObj.username" autocomplete="off" disabled="true"></el-input>
        </el-form-item>
        <el-form-item label="邮箱" label-width="120px">
          <el-input v-model="editObj.email" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="电话" label-width="120px">
          <el-input v-model="editObj.mobile" autocomplete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="editdialog = false">取 消</el-button>
        <el-button type="primary" @click="edi(editObj.id)">确 定</el-button>
      </div>
    </el-dialog>
    <!-- 选择角色面板 -->
    <el-dialog title="分配角色" :visible.sync="cosplay">
      <el-form :model="cosObj">
        <el-form-item label="当前用户" label-width="120px">
          <el-input v-model="cosObj.username" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="请分配角色" label-width="120px">
          <el-select  v-model="cosObj.rid" placeholder="请选择活动区域">
            <el-option :disabled="true" label="请选择角色" :value="-1"></el-option>
            <el-option :label="item.roleName" v-for="item in seleed" :key="item.id"></el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="cosplay = false">取 消</el-button>
        <el-button type="primary" @click="cosplay = false">确 定</el-button>
      </div>
    </el-dialog>
  </el-card>
</template>

<script>
export default {
  data () {
    return {
      list: [],
      total: 0,
      pagenum: 1,
      pagesize: 5,
      search: '',
      addObj: {
        username: '',
        password: '',
        email: '',
        mobile: ''
      },
      addLog: false,
      editObj: {
        username: '',
        email: '',
        mobile: '',
        id: 0
      },
      editdialog: false,
      cosplay: false,
      cosObj: [],
      seleed: []
    }
  },
  methods: {
    // 打开角色面板
    async check (id) {
      this.cosplay = true
      var res = await this.$http.request({
        url: `users/${id}`,
        method: 'get',
        headers: {
          Authorization: window.localStorage.getItem('token')
        }
      })
      var { meta, data } = res.data
      if (meta.status === 200) {
        this.cosObj = data
        this.sele()
      } else {
        this.$message.error(meta.status)
      }
    },
    async sele () {
      var res = await this.$http.request({
        url: `roles`,
        method: 'get',
        headers: {
          Authorization: window.localStorage.getItem('token')
        }
      })
      var {meta, data} = res.data
      if (meta.status == 200) {
        this.seleed = data
      } else {
        this.$message.error(meta.status)
      }
    },
    // 删除
    del (id) {
      this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(async () => {
          var res = await this.$http.request({
            url: `users/${id}`,
            method: 'delete',
            headers: {
              Authorization: window.localStorage.getItem('token')
            }
          })
          var { meta, data } = res.data
          if (meta.status === 200) {
            this.$message({
              message: meta.msg,
              type: 'success'
            })
            this.getAllList()
          } else {
            this.$message.error(meta.msg)
          }
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          })
        })
    },
    // 编辑用户
    async edit (id) {
      // console.log(id)
      this.editdialog = true
      var res = await this.$http.request({
        url: `users/${id}`,
        method: 'get',
        headers: {
          Authorization: window.localStorage.getItem('token')
        }
      })
      var { meta, data } = res.data
      if (meta.status === 200) {
        this.editObj = data
      } else {
        this.$message.error(meta.status)
      }
    },
    // 编辑用户提交
    async edi (id) {
      var res = await this.$http.request({
        url: `users/${id}`,
        method: 'put',
        headers: {
          Authorization: window.localStorage.getItem('token')
        },
        data: {
          email: this.editObj.email,
          mobile: this.editObj.mobile
        }
      })
      var { meta, data } = res.data
      if (meta.status === 200) {
        this.$message({
          message: meta.msg,
          type: 'success'
        })
        this.getAllList()
        this.editdialog = false
      } else {
        this.$message.error(meta.msg)
        this.editdialog = false
      }
    },
    // 打开新增用户按钮
    addlog () {
      this.addLog = true
    },
    // 添加用户
    async add () {
      var res = await this.$http.request({
        url: `users`,
        method: 'post',
        data: this.addObj,
        headers: {
          Authorization: window.localStorage.getItem('token')
        }
      })
      var { meta, data } = res.data
      if (meta.status === 201) {
        this.$message({
          message: meta.msg,
          type: 'success'
        })
        this.addLog = false
      } else {
        this.$message.error(meta.msg)
      }
    },
    handleSizeChange (val) {
      this.pagesize = val
      this.getAllList()
    },
    handleCurrentChange (val) {
      this.pagenum = val
      this.getAllList()
    },
    async getAllList () {
      var res = await this.$http.request({
        method: 'get',
        url: `users?query=${this.search}&pagenum=${this.pagenum}&pagesize=${
          this.pagesize
        }`,
        headers: {
          Authorization: window.localStorage.getItem('token')
        }
      })
      var { meta, data } = res.data
      if (meta.status === 200) {
        this.list = data.users
        this.total = data.total
      }
    },
    seach () {
      this.getAllList()
    }
  },
  mounted () {
    this.getAllList()
  }
}
</script>

<style>
.el-table__body {
  height: 100%;
}
</style>
