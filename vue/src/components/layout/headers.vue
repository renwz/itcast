<template>
      <el-row>
        <el-col :span="4">
          <div class="grid-content bg-purple-dark">
              <img src="@/assets/images/logo.png" alt="">
          </div>
        </el-col>
        <el-col :span="18">
         <div class="title">电商后台管理系统</div>
        </el-col>
         <el-col :span="2">
            <div class="logout">
                <a href="#" @click.prevent="">退出</a>
            </div>
        </el-col>
      </el-row>
</template>

<script>
export default {

}
</script>

<style>
.title{
    text-align: center;
    font-weight: 700;
}
.logout a {
    text-decoration: none;
    color: rgb(255, 0, 0)
}
</style>
