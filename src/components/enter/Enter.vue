<template>
    <div class="enter">
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
            <div class="title" v-if="isShow">
              <h3 style="float:left;margin-left: 20px;">确认入库</h3>
              <div class="pi-button">
                <el-button @click="pisure" type="primary" size="medium" >批量确认</el-button>
                <el-button @click="piWMS" type="primary" size="medium">批量推送到WMS</el-button>
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
                  <el-button :disabled="scope.row.FSTATUS == '已入库'" style="float: left;" @click="handleClick(scope.row)" type="primary" size="medium">确认入库</el-button>
                  <el-button :disabled="scope.row.FISWMS == '是'" @click="handleClick2(scope.row)" type="primary" style="float:left;margin-left:5px;padding: 10px 10px;" size="medium">推送WMS</el-button>
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


      <!--确认入库超时弹窗开始-->
      <el-dialog title="确认入库" :close-on-click-modal="false" :visible.sync="dialogOverTime" width="90%" >
        <el-form :model="ruleReason" ref="ruleReason" :rules="rules">
          <el-form-item label="超时原因:" prop="reason">
            <el-input type="textarea" v-model="ruleReason.reason" placeholder="请输入超时原因"   style="width: 100%;"></el-input>
          </el-form-item>
        </el-form>


        <div slot="footer" class="dialog-footer">
          <el-button @click="resetReason" size="medium">重 置</el-button>
          <el-button type="primary" v-if="Dsure" @click="commitEnter('ruleReason')" size="medium" >单个确 定</el-button>
          <el-button type="primary" v-if="Psure" @click="commitEnterpi('ruleReason')" size="medium">批量确 定</el-button>
        </div>
      </el-dialog>
      <!--确认入库超时弹窗结束-->

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
            multipleSelection:[],
            dialogOverTime:false,
            isOvertime:false,
            ruleReason:{
              reason:''
            },
            rules:{
              reason:[
                {required: true, message: '请输入超时原因', trigger: 'blur'},
              ],
            },
            Dsure:false,
            Psure:false,
            checkRow:{},

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
        commitEnter(formName){
          this.$refs[formName].validate((valid) => {
            if (valid) {
              this.subEnterReason()
            } else {
              console.log('error submit!!');
              return false;
            }
          });
        },
        commitEnterpi(formName){
          this.$refs[formName].validate((valid) => {
            if (valid) {
              this.subEnterReasonpi()
            } else {
              console.log('error submit!!');
              return false;
            }
          });
        },
        subEnterReasonpi(){
          const loading = this.$loading({
            lock: true,
            text: '数据提交中',
            spinner: 'el-icon-loading',
            background: 'rgba(0, 0, 0, 0.7)'
          });
          this.EnterData=[]
          for(var s = 0;s<this.multipleSelection.length;s++){
            this.EnterData.push({
              'fid': this.multipleSelection[s].FID,
              'freason':this.ruleReason.reason
            })
          }
          // console.log(this.EnterData)
          // console.log('this.EnterData')
          this.$axios.post(this.GLOBAL.baseURL + '/confirmPurInWare',this.EnterData,{
            headers:{"Authorization":"Bearer" + " " + this.GLOBAL.token}
          }).then((response) => {
            if(response.data.success == true){
              //入库成功,刷新入库清单数据
              this.GetEnter(this.saoEnter)
              loading.close();
              this.$message.success("入库成功");
            }else {
              loading.close();
              this.$message.error(response.data.result);
            }

          }).catch((err) => {
            console.log(err)
            loading.close();
          })

          this.dialogOverTime = false

        },
        subEnterReason(){
          const loading = this.$loading({
            lock: true,
            text: '数据提交中',
            spinner: 'el-icon-loading',
            background: 'rgba(0, 0, 0, 0.7)'
          });
          this.EnterData=[]

          this.EnterData.push({
            'fid':this.checkRow.FID,
            'freason':this.ruleReason.reason
          })

          this.$axios.post(this.GLOBAL.baseURL + '/confirmPurInWare',this.EnterData,{
            headers:{"Authorization":"Bearer" + " " + this.GLOBAL.token}
          }).then((response) => {
            if(response.data.success == true){
              //入库成功,刷新入库清单数据
              this.GetEnter(this.saoEnter)
              loading.close();
              this.$message.success("入库成功");
            }else {
              loading.close();
              this.$message.error(response.data.result);

            }

          }).catch((err) => {
            console.log(err)
            loading.close();
          })

          this.dialogOverTime = false

        },
        resetReason(){
          this.ruleReason.reason = ''
          },
        handleSelectionChange(val) {
          this.multipleSelection = val;
          //console.log(this.multipleSelection)
        },
        //批量推送WMS
        piWMS(){

          this.EnterData =[]
          if(this.multipleSelection.length>0){

            for(var x=0;x<this.multipleSelection.length;x++){
              if(this.multipleSelection[x].FISWMS == '是'){
                this.$message.warning('请去掉已推送过的物料后在提交');
                return;
              }
            }

            const loading = this.$loading({
              lock: true,
              text: '数据提交中',
              spinner: 'el-icon-loading',
              background: 'rgba(0, 0, 0, 0.7)'
            });
            for (var c = 0;c<this.multipleSelection.length;c++){
              this.EnterData.push({
                'fid':this.multipleSelection[c].FID
              })
            }
            console.log('this.EnterData')
            console.log(this.EnterData)

            this.$axios.post(this.GLOBAL.baseURL + '/purInWareToWMS',this.EnterData).then((response) => {
              console.log(response.data)
              if(response.data.success == true){
                //入库成功,刷新入库清单数据
                this.dialogStore = false
                this.GetEnter(this.saoEnter)
                loading.close();
                this.$message.success("操作成功");
              }else {
                loading.close();
                this.$message.error(response.data.result);
              }

            }).catch((err) => {
              console.log(err)
              loading.close();
            })

            this.$refs.multipleTable.clearSelection();

          }else{
            this.$message.warning('请勾选物料');
          }
        },
        //批量确认
        pisure(){
          this.EnterData =[]
          if(this.multipleSelection.length>0){
            for(var h =0;h<this.multipleSelection.length;h++){
              if(this.multipleSelection[h].FSTATUS == '已入库'){
                this.$message.warning('请去掉已入库的物料后在提交');
                return;
              }
            }
            this.ruleReason.reason = ''

            //请求判断是否超时
            let OTpidata =[]
            for(var b =0;b<this.multipleSelection.length;b++){
              OTpidata.push({
                'fid':this.multipleSelection[b].FID
              })
            }
            this.overTime(OTpidata).then(res => {
              if(res.data.FISOVERTIME == '是'){ //超时
                this.dialogOverTime = true
                this.Dsure = false
                this.Psure = true
                // alert('超时')
              }else {
                //alert("没超时")
                const loading = this.$loading({
                  lock: true,
                  text: '数据提交中',
                  spinner: 'el-icon-loading',
                  background: 'rgba(0, 0, 0, 0.7)'
                });
                this.EnterData=[]
                for(var s = 0;s<this.multipleSelection.length;s++){
                  this.EnterData.push({
                    'fid': this.multipleSelection[s].FID,
                    'freason':this.ruleReason.reason
                  })
                }
                console.log(this.EnterData)
                console.log('this.EnterData')
                this.$axios.post(this.GLOBAL.baseURL + '/confirmPurInWare',this.EnterData,{
                  headers:{"Authorization":"Bearer" + " " + this.GLOBAL.token}
                }).then((response) => {
                  if(response.data.success == true){
                    //入库成功,刷新入库清单数据
                    this.GetEnter(this.saoEnter)
                    loading.close();
                    this.$message.success("入库成功");
                  }else {
                    loading.close();
                    this.$message.error(response.data.result);
                  }

                }).catch((err) => {
                  console.log(err)
                  loading.close();
                })
                this.$refs.multipleTable.clearSelection();

              }
            })

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
         //this.GetEnter('FH_000075050')
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
          this.ruleReason.reason = ''
          this.checkRow = row
          //请求判断是否超时
          let TimeData = []
          TimeData.push({
            'fid':row.FID
          })

          this.overTime(TimeData).then(res => {
            if(res.data.FISOVERTIME == '是') { //超时
              this.dialogOverTime = true
              this.Dsure = true
              this.Psure = false

            }else { //没超时直接请求数据
              //alert("没超时")
              const loading = this.$loading({
                lock: true,
                text: '数据提交中',
                spinner: 'el-icon-loading',
                background: 'rgba(0, 0, 0, 0.7)'
              });
              this.EnterData=[]

              this.EnterData.push({
                'fid':row.FID,
                'freason':this.ruleReason.reason
              })
              this.$axios.post(this.GLOBAL.baseURL + '/confirmPurInWare',this.EnterData,{
                headers:{"Authorization":"Bearer" + " " + this.GLOBAL.token}
              }).then((response) => {
                if(response.data.success == true){
                  //入库成功,刷新入库清单数据
                  this.GetEnter(this.saoEnter)
                  loading.close();
                  this.$message.success("入库成功");
                }else {
                  loading.close();
                  this.$message.error(response.data.result);
                }

              }).catch((err) => {
                console.log(err)
                loading.close();
              })
            }
          })

        },
        //判断是否超时请求方法
        async overTime(fid){
          let res
          await this.$axios.post(this.GLOBAL.baseURL + '/isOverTime',fid).then((response) => {
            console.log(response.data.FISOVERTIME)
            res = response
          }).catch((err) => {
            console.log(err)
          })
          return res
        },

        //推送到WMS
        handleClick2(row) {
          //console.log(row)
          const loading = this.$loading({
            lock: true,
            text: '数据提交中',
            spinner: 'el-icon-loading',
            background: 'rgba(0, 0, 0, 0.7)'
          });
          this.EnterData=[]

          this.EnterData.push({
            'fid':row.FID
          })
          console.log('this.EnterData')
          console.log(this.EnterData)
          this.$axios.post(this.GLOBAL.baseURL + '/purInWareToWMS',this.EnterData,).then((response) => {
            console.log(response.data)
            if(response.data.success == true){
              //推送WMS成功,刷新入库清单数据
              this.GetEnter(this.saoEnter)
              loading.close();
              this.$message.success("操作成功");

            }else {
              loading.close();
              this.$message.error(response.data.result);
            }

          }).catch((err) => {
            console.log(err)
            loading.close();
          })
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
