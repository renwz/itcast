<template>
  <el-card>
   <myNav firstNav="权限管理" lastNav="权限列表" />
    <el-table :data="rightList" border style="width: 100%">
      <el-table-column type="index"></el-table-column>
      <el-table-column prop="authName" label="权限名称"></el-table-column>
      <el-table-column prop="path" label="路径"></el-table-column>
      <el-table-column prop="level" label="层级">
          <template slot-scope="scope">
          <span v-if="scope.row.level==='0'">一级</span>
          <span v-else-if="scope.row.level==='1'">二级</span>
          <span v-else>三级</span>
          </template>
      </el-table-column>
    </el-table>
    <el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="currentPage4"
      :page-sizes="[100, 200, 300, 400]"
      :page-size="100"
      layout="total, sizes, prev, pager, next, jumper"
      :total="400">
    </el-pagination>
  </el-card>
</template>

<script>
export default {
  data () {
    return {
      rightList: []
    }
  },
  methods: {
    async getAllList () {
      var res = await this.$http.request({
        url: '/rights/list',
        method: 'get',
        headers: {
          Authorization: window.localStorage.getItem('token')
        }
      })
      var { meta, data } = res.data
      if (meta.status === 200) {
        this.rightList = data
        // console.log(data)
      } else {
        this.$message.error(meta.msg)
      }
    }
  },
  mounted () {
    this.getAllList()
  }
}
</script>

<style>
.nav{
    margin-bottom: 10px;
}
</style>
