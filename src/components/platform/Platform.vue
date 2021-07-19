<template>
    <div class="platform">
      <div  class="index">
        <div class="left" ref="left">
          <div class="logo" v-if="!this.GLOBAL.isState"><img src="../../assets/imgs/logo.png" alt=""></div>

          <el-menu background-color="#303030" active-text-color="#FFD04B" text-color="#fff" :default-active="$route.path"  @select="jihuo"  :collapse-transition="false" :router="true" class="el-menu-vertical-demo" mode="vertical" :collapse="this.GLOBAL.isState">
            <el-menu-item index="/index/received">
              <i class="el-icon-edit"></i>
              <span slot="title">收货</span>
            </el-menu-item>
            <el-menu-item index="/index/checkout">
              <i class="el-icon-s-check"></i>
              <span slot="title">检验</span>
            </el-menu-item>
            <el-menu-item index="/index/enter" >
              <i class="el-icon-s-claim"></i>
              <span slot="title">入库</span>
            </el-menu-item>
            <el-menu-item index="/index/platform" >
              <i class="el-icon-s-platform"></i>
              <span slot="title">发料平台</span>
            </el-menu-item>
          </el-menu>


        </div>

        <div class="right" ref="right">
          <div class="right-top">
            <div class="user">
              <el-dropdown @command="handleCommand" ref="dropdown">
                  <span class="el-dropdown-link">
                    用户：{{this.GLOBAL.userData.UserName}}<i class="el-icon-arrow-down el-icon--right"></i>
                  </span>
                <el-dropdown-menu slot="dropdown">
                  <el-dropdown-item command="loginout">退出登录</el-dropdown-item>
                </el-dropdown-menu>
              </el-dropdown>
            </div>
            <h2>宝鸡电气移动业务平台</h2>
            <!--侧边栏按钮开始-->
            <el-radio-group v-model="isCollapse" @change="qie" style="position: absolute;margin-left:-20px;z-index: 88;">
              <el-radio-button :label="!isOpen" class="but-qie" v-if="!this.GLOBAL.isState"><i class="el-icon-d-arrow-left"></i></el-radio-button>
              <el-radio-button :label="!isOpen" class="but-qie" v-if="this.GLOBAL.isState"><i class="el-icon-d-arrow-right"></i></el-radio-button>
            </el-radio-group>
            <!--侧边栏按钮结束-->
          </div>
          <div class="right-main">
              <div style="width: 94%;float: left;margin-left: 3%;margin-top: 10px;">
                <el-input
                  class="search"
                  v-model="SearchFcontractno"
                  placeholder="请输合同号搜索"
                ></el-input>
              </div>
            <el-table
              ref="multipleTable"
              v-loading="loading"
              :max-height="this.GLOBAL.isheight"
              :data="tableData.filter(data => !SearchFcontractno || data.FCONTRACTNO.toLowerCase().includes(SearchFcontractno.toLowerCase()))"
              stripe
              style="width: 94%;top: 10px;left: 3%;">
              <af-table-column
                prop="FCONTRACTNO"
                label="合同号"
              >
              </af-table-column>
<!--              <af-table-column-->
<!--                prop="FENTRYID"-->
<!--                label="项目名称"-->
<!--              >-->
<!--              </af-table-column>-->

              <el-table-column
                align="center"
                fixed="right"
                label="操作"
                width="120">
                <template slot-scope="scope">
                  <el-button style="float: left;" @click="selectClick(scope.row)" type="primary" size="medium">选择发料</el-button>
                </template>
              </el-table-column>
            </el-table>



          </div>
        </div>
      </div>
      <el-dialog
        title="提示"
        :visible.sync="dialogVisible"
        :close-on-click-modal="false"
        width="40%"
      >
        <span>是否退出登录</span>
        <span slot="footer" class="dialog-footer">
          <el-button @click="dialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="LogOut">确 定</el-button>
        </span>
      </el-dialog>
    </div>
</template>

<script>
    export default {
        name: "Platform",
      data(){
          return{
            activeIndex:'',
            dialogVisible: false,
            isCollapse: true,//控制侧边拦展开收起
            isOpen:true,
            SearchFcontractno:'',
            loading: true,
            tableData:[]
          }
      },
      mounted() {
          this.getContract()
      },
      watch:{
        $route(){
          this.jihuo(this.activeIndex)
        }
      },

      methods:{
        getContract(){
          this.$axios.get(this.GLOBAL.baseURL + '/contract').then((response) => {
            console.log(response.data)
            this.tableData = response.data
            this.loading = false
          }).catch((err) => {
            console.log(err)
            this.loading = false
          })
        },
        jihuo(index){
          // alert(index)
          this.activeIndex = index
        },
        handleCommand(command){
          if(command == 'loginout'){
            this.dialogVisible = true
            this.$refs.dropdown.hide()
          }
        },
        //退出登录并清空用户数据
        LogOut(){
          // this.GLOBAL.userData={}
          // localStorage.clear()
          // this.GLOBAL.token = ''
          // this.$router.push('/login')
          // this.dialogVisible = false
          // BSL.SetJsClose()
          AndroidJs.exit();

        },
        qie(){
          this.isOpen = !this.isOpen
          this.GLOBAL.isState = !this.GLOBAL.isState
        },
        selectClick(row){
          this.$router.push({
            path:'/index/platform/detail',
            query:{
              FCONTRACTNO:row.FCONTRACTNO
            }
          })
        }
      }
    }
</script>

<style scoped>
  .platform{height: 100%;}
</style>
