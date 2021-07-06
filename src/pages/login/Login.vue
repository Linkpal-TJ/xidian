<template>
    <div class="login">
      <div style="width: 100%;height: 100px;"></div>
      <div class="title">宝鸡电气移动业务平台</div>
        <div class="forms">
          <el-form :model="SubForm" ref="ruleForm" :rules="rulesForm">
              <el-form-item label="用户名：" prop="UserName" class="subLabel">
                <el-input v-model="SubForm.UserName" placeholder="请输入用户名"></el-input>
              </el-form-item>
            <el-form-item label="密码：" prop="PassWord" class="subLabel">
              <el-input type="password" v-model="SubForm.PassWord" placeholder="请输入密码"></el-input>
            </el-form-item>
            <!--<el-checkbox v-model="checked" style="margin-bottom: 20px;" @change="select">记住密码</el-checkbox>-->

            <el-button class="btn-sub" type="primary" @click="submitForm('ruleForm')" >登录</el-button>

          </el-form>
        </div>
    </div>
</template>

<script>
    export default {
        name: "Login",
      data() {
        return{
          SubForm: {
            UserName:'',
            PassWord:'',
            // isDisable:false,//控制登陆多次提交数据
          },
          rulesForm: {
            UserName: [{required: true, message: '请输入用户名', trigger: 'blur'},],
            PassWord: [{required: true, message: '请输入密码', trigger: 'blur'},],
          },
          checked:false
        }
      },
      created(){

      },
      mounted() {

      },
      methods:{
        //表单验证
        submitForm(formName) {
          this.$refs[formName].validate((valid) => {
            if (valid) {
              // this.isDisable = true
              this.submintData();
            } else {
              console.log('error submit!!');
              return false;
            }
          });
        },
        //登录方法
        submintData(){
          // console.log(this.SubForm)
          let datas = {
            'userName':this.SubForm.UserName,
            'password':this.SubForm.PassWord
          }

          this.$axios.post(this.GLOBAL.baseURL + '/login',datas).then((response) => {
            console.log(response.data)
            if(response.data.success == true){
              //登录成功

              //console.log(response.data)
              this.GLOBAL.token = response.data.result
              // localStorage.setItem("user",JSON.stringify(this.SubForm))
              this.GLOBAL.userData = this.SubForm

              this.$router.push('/index/received')

            }else {
              this.$message.error(response.data.result);
            }


          }).catch((err) => {
            console.log("err")
            console.log(err)
          })
          // this.isDisable = false



        },
        //点击记住密码方法
        select(aa){
          alert(aa)
        }
      }
    }
</script>

<style scoped>
  .login{ height: 100%; min-height:728px; width:100%;background: url("../../assets/imgs/bag.jpg") 100%; }
  .forms{width: 50%;margin-left: 25%;margin-right: 25%;}
  .btn-sub{width: 100%;margin-top: 30px;font-size: 18px;}
  .title{width: 100%;text-align: center;color: #FFF;font-weight: bold;font-size: 25px;padding: 30px;letter-spacing: 10px;box-sizing: border-box;}
</style>
