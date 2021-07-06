<template>
    <div class="checkout">
      <div  class="index">
        <div class="left" ref="left">
          <div class="logo" v-if="!this.GLOBAL.isState"><img src="../../assets/imgs/logo.png" alt=""></div>


          <!--<div class="tab">-->
            <!--<div class="tab-item">-->
              <!--<router-link :to="{ path:'/index/received'}"><i class="el-icon-edit"></i>&nbsp;&nbsp;收货</router-link>-->
            <!--</div>-->
            <!--<div class="tab-item">-->
              <!--<router-link :to="{ path:'/index/checkout'}" @click.native="testsCheck"><i class="el-icon-s-check"></i>&nbsp;&nbsp;检验</router-link>-->
            <!--</div>-->
            <!--<div class="tab-item">-->
              <!--<router-link :to="{ path:'/index/enter'}"><i class="el-icon-s-claim"></i>&nbsp;&nbsp;入库</router-link>-->
            <!--</div>-->
          <!--</div>-->

          <el-menu  background-color="#303030" active-text-color="#FFD04B" text-color="#fff" :default-active="$route.path"  @select="jihuo"  :collapse-transition="false" :router="true" class="el-menu-vertical-demo" mode="vertical" :collapse="this.GLOBAL.isState">
            <el-menu-item index="/index/received">
              <i class="el-icon-edit"></i>
              <span slot="title">收货</span>
            </el-menu-item>
            <el-menu-item index="/index/checkout" @click.native="tests">
              <i class="el-icon-s-check"></i>
              <span slot="title">检验</span>
            </el-menu-item>
            <el-menu-item index="/index/enter">
              <i class="el-icon-s-claim"></i>
              <span slot="title">入库</span>
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
            <!--<h3 v-if="isShow">检验清单</h3>-->
            <h3 v-if="!isShow">扫码检验</h3>

            <div class="title" v-if="isShow">
              <h3 style="float:left;margin-left: 20px;">检验清单</h3>
              <div class="pi-button">
                <el-button @click="piCheckout" type="primary" size="medium" >批量检验</el-button>
              </div>
            </div>

            <el-table
              ref="multipleTable"
              :max-height="this.GLOBAL.isheight"
              v-loading="loading"
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
                  <div :class="{'wite':scope.row.FSTATUS=='已收货待检验'}">{{scope.row.FSTATUS}}</div>
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
                width="120">
                <template slot-scope="scope">
                  <el-button @click="handleClick(scope.row)" type="primary" size="medium" :disabled="scope.row.FQUALIFIEDQTY >= scope.row.FQTY">提交检验</el-button>
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


      <!--提交检验结果弹窗开始-->
      <el-dialog title="合格数量" :close-on-click-modal="false" :visible.sync="dialogCheck" width="90%" >
        <!--<el-form :model="ruleCheckNum" :rules="rules" ref="ruleCheckNum">-->
        <el-form :model="ruleCheckNum" ref="ruleCheckNum">
          <el-form-item prop="checkNum">
            <el-input v-model="ruleCheckNum.checkNum" placeholder="请输入合格数量"   style="width: 100%;"></el-input>
          </el-form-item>
        </el-form>


        <div slot="footer" class="dialog-footer">
          <el-button @click="resetCheckNum" size="medium">重 置</el-button>
          <el-button type="primary" @click="commitCheck('ruleCheckNum')" size="medium" :disabled="isDisable">确 定</el-button>
        </div>
      </el-dialog>
      <!--提交检验结果弹窗结束-->


    </div>
</template>

<script>
    export default {
      name: "Checkout",
      data() {
        return {
          loading: true,
          activeIndex:'',
          isOpen:true,
          isCollapse: true,//控制侧边拦展开收起
          dialogVisible: false,
          isDisable:false,//控制收货多次提交数据
          isShow:false,
          saoCheckout:'',
          tableData: [],
          ruleCheckNum:{
            checkNum:''//提交检验结果合格数量
          },
          dialogCheck:false,//提交检验结果弹窗控制
          checkRow:[],
          multipleSelection:[]
        }
      },
      mounted() {
      },
      watch:{
        $route(){
          this.jihuo(this.activeIndex)
        }
      },
      created(){
        window.cc = this.cc;
      },
      methods: {
        piCheckout(){
          if(this.multipleSelection.length>0){
            this.checkData=[]
            for(var k = 0;k<this.multipleSelection.length;k++){
              this.checkData.push({
                fuser: this.GLOBAL.userData.UserName,
                fid: this.multipleSelection[k].FID,
                fentryid: this.multipleSelection[k].FENTRYID,
                fqty:this.multipleSelection[k].FQTY
              })
            }

            console.log(this.checkData)
            this.$axios.post(this.GLOBAL.baseURL + '/QCReport', this.checkData,{
              headers:{"Authorization":"Bearer" + " " + this.GLOBAL.token}
            }).then((response) => {
              // console.log(response.data)
              if(response.data.success == true){
                //送检成功,刷新收货清单数据
                console.log(response.data)
                this.$message.success('操作成功');
                this.GetReceived(this.saoCheckout)

              }else {
                this.$message.error(response.data.result);
              }

            }).catch((err) => {
              console.log(err)
            })

          }else {
            this.$message.warning('请勾选相应的物料');
          }


        },
        handleSelectionChange(val) {
          this.multipleSelection = val;
          //console.log(this.multipleSelection)
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
        testsCheck(){
          if(this.isShow = false){
            this.isShow = true
          }
        },
        handleClick(row) {
          this.dialogCheck = true
          this.checkRow = row
          this.ruleCheckNum.checkNum = ''
        },
        resetCheckNum(){
          this.ruleCheckNum.checkNum = ''
        },
        //送检提交
        commitCheck(formName){
          this.$refs[formName].validate((valid) => {
            // alert(valid)
            if (valid) {
              if (this.ruleCheckNum.checkNum > (this.checkRow.FQTY - this.checkRow.FQUALIFIEDQTY)) {
                this.$message.error('可填报合格数量最大为' + (this.checkRow.FQTY - this.checkRow.FQUALIFIEDQTY));
              } else {
                this.isDisable = true
                this.dialogCheck = false

                this.subCheckNum();
              }

            } else {
              console.log('error submit!!');
              return false;
            }
          });
        },
        //送检请求数据
        subCheckNum(){
          this.checkData=[]
          this.checkData.push({
            fuser: this.GLOBAL.userData.UserName,
            fid: this.checkRow.FID,
            fentryid: this.checkRow.FENTRYID,
            fqty:this.ruleCheckNum.checkNum
          })
          //console.log(this.checkData)
          this.$axios.post(this.GLOBAL.baseURL + '/QCReport', this.checkData,{
            headers:{"Authorization":"Bearer" + " " + this.GLOBAL.token}
          }).then((response) => {
            console.log(response.data)
            if(response.data.success == true){
              //送检成功,刷新收货清单数据
              console.log(response.data)
              this.$message.success('操作成功');
              this.GetReceived(this.saoCheckout)


            }else {
              this.$message.error(response.data.result);
            }

          }).catch((err) => {
            console.log(err)
          })
          this.isDisable = false
        },
        //退出登录并清空用户数据
        LogOut(){
          // this.GLOBAL.userData={}
          // localStorage.clear()
          // this.GLOBAL.token = ''
          // this.$router.push('/login')
          // this.dialogVisible = false
          //退出登录方法
          // BSL.SetJsClose()
          AndroidJs.exit();

        },
        handleCommand(command){

          if(command == 'loginout'){
            this.dialogVisible = true
            this.$refs.dropdown.hide()
          }
        },
        cc(result) {
          this.saoCheckout = result
          this.GetCheckout(this.saoCheckout)
        },
        qrcodeCheckout(){
          //网页测试
          //this.GetCheckout('FH_000073015')
          //this.GetCheckout('FH_000074090')
          //this.GetCheckout('FH_000074092')

          // BSL.Qcode('0','cc')
          AndroidJs.scan('cc');


        },
        //请求扫码检验单
        GetCheckout(data){
          this.isShow = true
          this.$axios.get(this.GLOBAL.baseURL + '/checkBill/'+data).then((response) => {
            console.log(response.data)
            this.tableData = response.data
            this.loading = false
          }).catch((err) => {
            console.log(err)
            this.loading = false
          })
        },
        },

    }
</script>

<style scoped>
.checkout{height: 100%;}
.sao{background: url("../../assets/imgs/sao.png") no-repeat;border: none;width: 165px;height: 165px;margin-left: 50%;transform: translateX(-50%);margin-top: 200px;}
.wite{color: red;}
.pi-button{float: right;margin-right: 20px;margin-top: 5px;}
</style>
