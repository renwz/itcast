<template>
  <div class="login">
    <div class="box">
      <h2>用户登录</h2>
      <el-form
        label-position="top"
        :model="loginObj"
        status-icon
        label-width="100px"
        class="demo-ruleForm"
      >
        <el-form-item label="用户名" prop="username">
          <el-input type="text" v-model="loginObj.username" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input type="password" v-model="loginObj.password" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="login">提交</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      loginObj: {
        password: "",
        username: "",
      }
    };
  },
  methods: {
      login(){
          this.$http.post('/login',this.loginObj)
          .then(data=>{
              var {meta,data} = data.data
              if(meta.status===200){
                  this.$message({
                      type:'success',
                      message:meta.msg
                  })
              }else{
                  this.$message.error(meta.msg)
              }
          })
      }
  }
};
</script>

<style>
.login {
  background-color: #2c3742;
  width: 100%;
  height: 100%;
  position: relative;
}
.login .box {
  width: 500px;
  padding: 40px;
  background: #fff;
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
}
.login .box h2 {
  margin-bottom: 20px;
}
.el-button {
  width: 100%;
}
</style>
