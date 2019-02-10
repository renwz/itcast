<template>
     <el-menu :router="true" default-active="3" class="mymenu el-menu-vertical-demo" :unique-opened="true">
          <el-submenu :index="'/'+item1.path" v-for="item1 in leftList" :key="item1.id">
            <template slot="title">
              <i class="el-icon-location"></i>
              <span>{{item1.authName}}</span>
            </template>
            <el-menu-item-group>
              <el-menu-item :index="'/'+item2.path" v-for="item2 in item1.children" :key="item2.id">
                <i class="el-icon-location"></i>
                <span>{{item2.authName}}</span>
              </el-menu-item>
            </el-menu-item-group>
          </el-submenu>
      </el-menu>
</template>

<script>
export default {
  data () {
    return {
      leftList: []
    }
  },
  methods: {
    async getAll () {
      var res = await this.$http.request({
        url: '/menus',
        method: 'get'
        // headers: {
        //   Authorization: window.localStorage.getItem('token')
        // }
      })
      var {meta, data} = res.data
      if (meta.status === 200) {
        this.leftList = data
      } else {
        this.$message.error(meta.msg)
      }
    }
  },
  mounted () {
    this.getAll()
  }
}
</script>

<style>
/* 侧边栏样式 */
.mymenu {
    height: 100%;
}
</style>
