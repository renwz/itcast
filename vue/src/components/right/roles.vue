<template>
  <el-card>
    <myNav class="mynav" firstNav="权限管理" lastNav="角色列表"/>
    <el-button plain>添加按钮</el-button>
    <el-table :data="rolesList" border style="width: 100%">
      <!-- {{rolesList}} -->
      <el-table-column type="expand">
        <template slot-scope="scope">
          <el-row v-for="item1 in scope.row.children" :key="item1.id">
            <el-col :span="4">
              <div class="grid-content bg-purple">
                <!-- 一級 -->
                <!-- {{scope.row}} -->
                <el-tag
                  closable
                  @close="del(scope.row.id,item1.id,scope.row)"
                >{{item1.authName}}---{{item1.id}}</el-tag>
                <i class="el-icon-arrow-right"></i>
              </div>
            </el-col>
            <el-col :span="20">
              <el-row v-for="item2 in item1.children" :key="item2.id">
                <div class="grid-content bg-purple-light">
                  <el-col :span="4">
                    <div class="grid-content bg-purple">
                      <!-- 二級 -->
                      <el-tag
                        type="success"
                        closable
                        @close="del(scope.row.id,item2.id,scope.row)"
                      >{{item2.authName}}---{{item2.id}}</el-tag>
                      <i class="el-icon-arrow-right"></i>
                    </div>
                  </el-col>
                  <el-col :span="20">
                    <div class="grid-content bg-purple-light">
                      <!-- 三級 -->
                      <el-tag
                        type="danger"
                        closable
                        v-for="item3 in item2.children"
                        :key="item3.id"
                        @close="del(scope.row.id,item3.id,scope.row)"
                      >{{item3.authName}}---{{item3.id}}</el-tag>
                    </div>
                  </el-col>
                </div>
              </el-row>
            </el-col>
          </el-row>
          <el-row v-if="scope.row.children.length===0">暫無更多數據</el-row>
        </template>
      </el-table-column>
      <el-table-column type="index"></el-table-column>
      <el-table-column prop="roleName" label="角色名称"></el-table-column>
      <el-table-column prop="roleDesc" label="角色描述"></el-table-column>
      <el-table-column prop="level" label="操作">
        <template slot-scope="scope">
          <!-- {{scope.row}} -->
          <el-button type="primary" plain size="mini" icon="el-icon-edit"></el-button>
          <el-button type="danger" plain size="mini" icon="el-icon-delete"></el-button>
          <el-button
            type="success"
            plain
            size="mini"
            icon="el-icon-check"
            @click.prevent="openDilog(scope.row.children,scope.row.id)"
          ></el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-dialog title="权限分配" :visible.sync="opendialog" width="30%">
      <el-tree
        ref="mytree"
        :data="treeData"
        show-checkbox
        node-key="id"
        :default-expanded-keys="defaultexpanded"
        :default-checked-keys="defaultchecked"
        :props="defaultProps"
        :default-expand-all="true"
      ></el-tree>

      <span slot="footer" class="dialog-footer">
        <el-button @click="opendialog = false">取 消</el-button>
        <el-button type="primary" @click="setRight">确 定</el-button>
      </span>
    </el-dialog>
  </el-card>
</template>

<script>
export default {
  data () {
    return {
      rolesList: [],
      opendialog: false,
      treeData: [],
      defaultProps: {
        children: 'children',
        label: 'authName'
      },
      defaultexpanded: [],
      defaultchecked: [],
      rolesId: ''
    }
  },
  methods: {
    async getAllUser () {
      var res = await this.$http.request({
        url: '/roles',
        method: 'get',
        headers: {
          Authorization: window.localStorage.getItem('token')
        }
      })
      var { meta, data } = res.data
      if (meta.status === 200) {
        this.rolesList = data
      } else {
        this.$message.error(meta.status)
      }
    },
    async del (roleid, rightId, rightData) {
      // console.log(roleid,id)
      var res = await this.$http.request({
        url: `roles/${roleid}/rights/${rightId}`,
        method: 'delete',
        headers: {
          Authorization: window.localStorage.getItem('token')
        }
      })
      var { meta, data } = res.data
      if (meta.status === 200) {
        rightData.children = data
        this.$message({
          message: meta.msg,
          type: 'success'
        })
      } else {
        this.$message.error(meta.msg)
      }
    },
    openDilog (rights, id) {
      this.opendialog = true
      this.getALLTree()
      this.rolesId = id
      this.defaultchecked = []
      //   console.log(rights);
      rights.forEach(item1 => {
        item1.children.forEach(item2 => {
          item2.children.forEach(item3 => {
            this.defaultchecked.push(item3.id)
          })
        })
      })
    //   console.log(this.defaultchecked);
    },
    async getALLTree () {
      var res = await this.$http.request({
        url: 'rights/tree',
        method: 'get',
        headers: {
          Authorization: window.localStorage.getItem('token')
        }
      })
      var { meta, data } = res.data
      if (meta.status === 200) {
        this.treeData = data
        // console.log(data)
      } else {
        this.$message.error(meta.msg)
      }
    },
    async setRight () {
      var arr = this.$refs.mytree.getCheckedKeys()
      var arr1 = this.$refs.mytree.getHalfCheckedKeys()
      var newarr = arr.concat(arr1)
      var str = newarr.join(',')
      var roleId = this.rolesId
      var res = await this.$http.request({
        url: `roles/${roleId}/rights`,
        method: 'post',
        data: {
          rids: str
        },
        headers: {
          Authorization: window.localStorage.getItem('token')
        }
      })
      var {meta} = res.data
      if (meta.status === 200) {
        this.$message({
          message: meta.msg,
          type: 'success'
        })
      } else {
        this.$message.error(meta.msg)
      }
      this.opendialog = false
      this.getAllUser()
    }
  },
  mounted () {
    this.getAllUser()
  }
}
</script>

<style>
.mynav {
  margin-bottom: 10px;
}
.el-tag {
  margin-top: 10px;
  margin-right: 10px;
}
</style>
