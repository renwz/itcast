<template>
     <el-breadcrumb separator-class="el-icon-arrow-right" class="nav">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>{{firstNav}}</el-breadcrumb-item>
      <el-breadcrumb-item>{{lastNav}}</el-breadcrumb-item>
    </el-breadcrumb>
</template>

<script>
export default {
  name: 'myNav',
  props: ['firstNav', 'lastNav']
}
</script>

<style>

</style>