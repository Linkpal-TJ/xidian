<template>
    <div class="enter">
      <div  class="index">
        <div class="left" ref="left">
          <div class="logo" v-if="!this.GLOBAL.isState"><img src="../../assets/imgs/logo.png" alt=""></div>

          <!--<div class="tab">-->
            <!--<div class="tab-item">-->
              <!--<router-link :to="{ path:'/index/received'}"><i class="el-icon-edit"></i>&nbsp;&nbsp;收货</router-link>-->
            <!--</div>-->
            <!--<div class="tab-item">-->
              <!--<router-link :to="{ path:'/index/checkout'}"><i class="el-icon-s-check"></i>&nbsp;&nbsp;检验</router-link>-->
            <!--</div>-->
            <!--<div class="tab-item">-->
              <!--<router-link :to="{ path:'/index/enter'}"><i class="el-icon-s-claim"></i>&nbsp;&nbsp;入库</router-link>-->
            <!--</div>-->
          <!--</div>-->

          <el-menu background-color="#303030" active-text-color="#FFD04B" text-color="#fff" :default-active="$route.path"  @select="jihuo"  :collapse-transition="false" :router="true" class="el-menu-vertical-demo" mode="vertical" :collapse="this.GLOBAL.isState">
            <el-menu-item index="/index/received">
              <i class="el-icon-edit"></i>
              <span slot="title">收货</span>
            </el-menu-item>
            <el-menu-item index="/index/checkout">
              <i class="el-icon-s-check"></i>
              <span slot="title">检验</span>
            </el-menu-item>
            <el-menu-item index="/index/enter" @click.native="tests">
              <i class="el-icon-s-claim"></i>
              <span slot="title">入库</span>
            </el-menu-item>
            <el-menu-item index="/index/platform">
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
<!--            <h3 v-if="isShow">确认入库</h3>-->
            <div class="title" v-if="isShow">
              <h3 style="float:left;margin-left: 20px;">确认入库</h3>
              <div class="pi-button">
                <el-button @click="pisure" type="primary" size="medium" >批量确认</el-button>
              </div>
            </div>
            <h3 v-if="!isShow">扫码入库</h3>

            <el-table
              ref="multipleTable"
              v-loading="loading"
              :max-height="this.GLOBAL.isheight"
              v-if="isShow"
              :data="tableData"
              @selection-change="handleSelectionChange"
              stripe
              style="width: 100%">
              <el-table-column
                type="selection"
                fixed="left"
                width="55">
              </el-table-column>
              <af-table-column
                prop="FSEQ"
                label="序号"
              >
              </af-table-column>
              <af-table-column
                prop="FMANAME"
                label="物料名称"
              >
              </af-table-column>
              <af-table-column
                prop="FORDERQTY"
                label="订单数">
              </af-table-column>
              <af-table-column
                prop="FQTY"
                label="送货数">
              </af-table-column>
              <af-table-column
                prop="FQUALIFIEDQTY"
                label="合格数">
              </af-table-column>
              <af-table-column
                prop="FUNQUALIFIEDQTY"
                label="不合格数">
              </af-table-column>
              <af-table-column
                prop="FSTATUS"
                label="当前状态">
                <template slot-scope="scope">
                  <div :class="{'wite':scope.row.FSTATUS=='已检验待入库'}">{{scope.row.FSTATUS}}</div>
                </template>
              </af-table-column>
              <af-table-column
                prop="FMODEL"
                label="规格型号">
              </af-table-column>
              <af-table-column
                prop="FUNIT"
                label="计量单位">
              </af-table-column>
              <af-table-column
                prop="FMANO"
                label="物料编码">
              </af-table-column>
              <af-table-column
                prop="FCONTRACTNO"
                label="合同号">
              </af-table-column>
              <af-table-column
                prop="FSUPPLIER"
                label="供应商">
              </af-table-column>
              <el-table-column
                align="center"
                fixed="right"
                label="操作"
                width="205">
                <template slot-scope="scope">
<!--                  <el-button @click="handleClick(scope.row)" type="primary" size="medium">确认入库</el-button>-->
                  <el-button :disabled="scope.row.FSTATUS == '已入库'" style="float: left;" @click="handleClick(scope.row)" type="primary" size="medium">确认入库</el-button>
                  <el-button @click="handleClick2(scope.row)" type="primary" style="float:left;margin-left:5px;padding: 10px 10px;" size="medium">推送WMS</el-button>

                </template>
              </el-table-column>
            </el-table>

            <button @click="qrcodeCheckout" class="sao" v-if="!isShow"></button>

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
        name: "Enter",
      data(){
          return{
            loading: true,
            activeIndex:'',
            isOpen:true,
            isCollapse: true,//控制侧边拦展开收起
            dialogVisible: false,
            isShow:false,
            saoEnter:'',
            tableData: [],
            EnterData:[],
            multipleSelection:[]

          }
      },
      created(){
        window.enter = this.enter;
      },
      mounted() {

      },
      watch:{
        $route(){
          this.jihuo(this.activeIndex)
        }
      },
      methods:{
        handleSelectionChange(val) {
          this.multipleSelection = val;
          //console.log(this.multipleSelection)
        },
        //批量确认
        pisure(){
          this.EnterData =[]
          if(this.multipleSelection.length>0){
            for (var c = 0;c<this.multipleSelection.length;c++){
              this.EnterData.push({
                'fid':this.multipleSelection[c].FID
              })
            }
            console.log('this.EnterData')
            console.log(this.EnterData)

            this.$axios.post(this.GLOBAL.baseURL + '/confirmPurInWare',this.EnterData,{
              headers:{"Authorization":"Bearer" + " " + this.GLOBAL.token}
            }).then((response) => {
              console.log(response.data)
              if(response.data.success == true){
                //入库成功,刷新入库清单数据
                this.dialogStore = false
                this.$message.success("入库成功");
                this.GetEnter(this.saoEnter)


              }else {
                this.$message.error(response.data.result);

              }

            }).catch((err) => {
              console.log(err)
            })
            this.$refs.multipleTable.clearSelection();

          }else{
            this.$message.warning('请勾选物料');
          }
        },
        tests(){
          if(this.isShow = false){
            this.isShow = true
          }
        },
        jihuo(index){
          // alert(index)
          this.activeIndex = index
        },
        qie(){

          this.isOpen = !this.isOpen
          this.GLOBAL.isState = !this.GLOBAL.isState

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
        handleCommand(command){

          if(command == 'loginout'){
            this.dialogVisible = true
            this.$refs.dropdown.hide()
          }
        },
        enter(result) {
          this.saoEnter = result
          this.GetEnter(this.saoEnter)
        },
        qrcodeCheckout(){
          //网页测试
         //this.GetEnter('FH_000073015')
         //this.GetEnter('FH_000074092')
          AndroidJs.scan('enter');

        },
        GetEnter(data){
          this.isShow = true
          this.$axios.get(this.GLOBAL.baseURL + '/stockBill/'+data).then((response) => {
            console.log(response.data)
            this.tableData = response.data
            this.loading = false
          }).catch((err) => {
            console.log(err)
            this.loading = false
          })
        },
        //确认入库提交
        handleClick(row) {
          console.log(row)
          this.EnterDat=[]

          this.EnterData.push({
            'fid':row.FID
          })
         console.log('this.EnterData')
         console.log(this.EnterData)

          this.$axios.post(this.GLOBAL.baseURL + '/confirmPurInWare',this.EnterData,{
            headers:{"Authorization":"Bearer" + " " + this.GLOBAL.token}
          }).then((response) => {
            console.log(response.data)
            if(response.data.success == true){
              //入库成功,刷新入库清单数据
              this.dialogStore = false
              this.$message.success("入库成功");
              this.GetEnter(this.saoEnter)


            }else {
              this.$message.error(response.data.result);

            }

          }).catch((err) => {
            console.log(err)
          })
          this.isDisable = false

        },
      }
    }
</script>

<style scoped>
.enter{height: 100%;}
.sao{background: url("../../assets/imgs/sao.png") no-repeat;border: none;width: 165px;height: 165px;margin-left: 50%;transform: translateX(-50%);margin-top: 200px;}
.wite{color: red;}
.pi-button{float: right;margin-right: 20px;margin-top: 5px;}
</style>
