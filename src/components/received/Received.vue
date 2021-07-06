<template>
    <div class="received">
      <div  class="index">
        <div ref="left" class="left">
          <div class="logo" v-if="!this.GLOBAL.isState"><img src="../../assets/imgs/logo.png" alt=""></div>


          <!--<el-menu :collapse-transition="false" :router="true"  class="el-menu-vertical-demo" mode="vertical" :collapse="!isCollapse">-->
          <el-menu active-text-color="#FFD04B" background-color="#303030" text-color="#fff" :default-active="$route.path"  @select="jihuo" :collapse-transition="false" :router="true"  class="el-menu-vertical-demo" mode="vertical" :collapse="this.GLOBAL.isState">
                <el-menu-item index="/index/received" @click.native="tests">
                    <i class="el-icon-edit"></i>
                    <span slot="title">收货</span>
                </el-menu-item>
                <el-menu-item index="/index/checkout">
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
<!--            <h3 v-if="isShow">收货清单</h3>-->
            <h3 v-if="!isShow">扫码收货</h3>

            <div class="title" v-if="isShow">
              <h3 style="float:left;margin-left: 20px;">收货清单</h3>
              <div class="pi-button">
                <el-button @click="piCheck" type="primary" size="medium" >批量送检</el-button>
                <el-button @click="piEnter" type="primary" size="medium" >批量入库</el-button>
              </div>
            </div>


            <div class="received-main">
              <el-table
                :max-height="this.GLOBAL.isheight"
                ref="multipleTable"
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
                  label="序号">
                </af-table-column>

                <af-table-column
                  prop="FMANAME"
                  label="物料名称">
                </af-table-column>

                <af-table-column
                  prop="FDELIVERYQTY"
                  label="送货数">
                </af-table-column>
                <af-table-column
                  prop="FRECEIVEQTY"
                  label="收货数">
                </af-table-column>
                <af-table-column
                  prop="FTOTALRECEIVEQTY"
                  label="累计收货数">
                </af-table-column>


                <af-table-column
                  prop="FSTOCK"
                  label="仓库">
                </af-table-column>

                <af-table-column
                  prop="FORDERQTY"
                  label="订单数">
                </af-table-column>

<!--                <af-table-column-->
<!--                  prop="FISCHECK"-->
<!--                  label="是否检验">-->
<!--                </af-table-column>-->
<!--                -->
                <af-table-column
                  prop="FSTATUS"
                  label="当前状态">
                  <template slot-scope="scope">
                    <div :class="{'wite':scope.row.FSTATUS=='待收货' || scope.row.FSTATUS=='待入库'}">{{scope.row.FSTATUS}}</div>
                  </template>
                </af-table-column>
                <af-table-column
                  prop="FMODEL"
                  label="规格型号">
                </af-table-column>
                <af-table-column
                  prop="FUNIT"
                  label="单位">
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
                    <el-button v-if="scope.row.FISCHECK=='是'" @click="handleClick(scope.row)" type="primary" size="medium" :disabled="scope.row.FRECEIVEQTY >= scope.row.FDELIVERYQTY " >收货送检</el-button>
                    <el-button v-if="scope.row.FISCHECK=='否'"  @click="handleClick3(scope.row)" type="success" size="medium" :disabled="scope.row.FSTATUS == '已入库'">直接入库</el-button>
                  </template>
                </el-table-column>





              </el-table>

              <button @click="qrcode" class="sao" v-if="!isShow"></button>
            </div>
          </div>
        </div>
      </div>
    <!--退出登录弹窗开始-->
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
      <!--退出登录弹窗结束-->

      <!--单个收货送检弹窗开始-->
      <el-dialog title="收货送检" :close-on-click-modal="false" :visible.sync="dialogNum" width="90%">
        <el-table
          :data="receivedRow"
          border
          style="width: 100%">
          <el-table-column
            prop="FMANAME"
            label="物料名称">
          </el-table-column>
          <el-table-column
            prop="FMODEL"
            label="规格型号">
          </el-table-column>
          <el-table-column
            prop="FUNIT"
            label="单位">
          </el-table-column>
          <el-table-column
            prop="FDELIVERYQTY"
            label="送货数">
          </el-table-column>

        </el-table>
        <div style="width: 100%;height: 20px;"></div>
          <el-form :model="rulereceiveNum" :rules="rules" ref="rulereceiveNum" >

            <el-form-item label="选仓库:" prop="stock" >
              <el-select  v-model="rulereceiveNum.stock" clearable placeholder="请选择仓库" @change="DtypeSelect">
                <el-option
                  v-for="(item,index) in Dstock"
                  :key=index
                  :label="item.FNAME"
                  :value="index">
                </el-option>
              </el-select>
            </el-form-item>

            <el-form-item label="选库位:" prop="location">
              <el-select  v-model="rulereceiveNum.location" clearable placeholder="请选择库位" @change="DtypeSelect2">
                <el-option
                  v-for="(item,index) in Dlocation"
                  :key=index
                  :label="item.FNAME"
                  :value="index">
                </el-option>
              </el-select>
            </el-form-item>


            <el-form-item prop="receiveNum" label="收货数量" >
              <el-input  v-model="rulereceiveNum.receiveNum" placeholder="请输入收货数量"   style="width: 100%;"></el-input>
            </el-form-item>

          </el-form>

        <!--单个收货送检-->
        <div slot="footer" class="dialog-footer" v-if="showDCheck">
          <el-button @click="resetNum" size="medium">重 置</el-button>
          <el-button type="primary" @click="commits('rulereceiveNum')" size="medium" :disabled="isDisable">单个收货确 定</el-button>
        </div>
        <!--单个直接入库-->
        <div slot="footer" class="dialog-footer" v-if="showDEnter">
          <el-button @click="resetNum" size="medium">重 置</el-button>
          <el-button type="primary" @click="commitsEnter('rulereceiveNum')" size="medium" :disabled="isDisable">单个入库确 定</el-button>
        </div>

      </el-dialog>
      <!--单个收货送检弹窗结束-->


<!--    选仓库批量送检，入库弹窗开始-->
            <el-dialog title="批量送检/入库" :close-on-click-modal="false" :visible.sync="selectStore" width="90%" >

              <el-form :model="ruleStock" :rules="rules" ref="ruleStock">

                  <el-form-item label="选仓库:" prop="FStock" >
                    <el-select  v-model="ruleStock.FStock" clearable placeholder="请选择仓库" @change="typeSelect">
                      <el-option
                        v-for="(item,index) in Stock"
                        :key=index
                        :label="item.FNAME"
                        :value="index">
                      </el-option>
                    </el-select>
              </el-form-item>
                <el-form-item label="选库位:" prop="FLocation">
                  <el-select  v-model="ruleStock.FLocation" clearable placeholder="请选择库位" @change="typeSelect2">
                    <el-option
                      v-for="(item,index) in Location"
                      :key=index
                      :label="item.FNAME"
                      :value="index">
                    </el-option>
                  </el-select>
                </el-form-item>
<!--                <el-form-item label="收货数量" prop="FNum">-->
<!--                  <el-input  v-model="ruleStock.FNum" placeholder="请输入收货数量"   style="width: 100%;"></el-input>-->
<!--                </el-form-item>-->

              </el-form>

              <!--//批量送检-->
              <div slot="footer" class="dialog-footer" v-if="showCheck">
                <el-button @click="resetruleStock" size="medium">重 置</el-button>
                <el-button type="primary" @click="commitStock('ruleStock')" size="medium" :disabled="isDisable">确定送检</el-button>
              </div>
             <!--//批量入库-->
              <div slot="footer" class="dialog-footer" v-if="showEnter">
                <el-button @click="resetruleStock" size="medium">重 置</el-button>
                <el-button type="primary" @click="commitEnter('ruleStock')" size="medium" :disabled="isDisable">确定入库</el-button>
              </div>

            </el-dialog>
<!--      选仓库批量送检入库弹窗结束-->








      <!--入库数量弹窗开始-->
      <el-dialog title="直接入库" :close-on-click-modal="false" :visible.sync="dialogStore" width="90%" >
        <el-table
          :data="storeRow"
          border
          style="width: 100%">
          <el-table-column
            prop="FMANAME"
            label="物料名称">
          </el-table-column>
          <el-table-column
            prop="FMODEL"
            label="规格型号">
          </el-table-column>
          <el-table-column
            prop="FUNIT"
            label="单位">
          </el-table-column>
          <el-table-column
            prop="FDELIVERYQTY"
            label="送货数">
          </el-table-column>
        </el-table>
        <div style="width: 100%;height: 20px;"></div>


        <el-form :model="ruleStoreNum" :rules="rules" ref="ruleStoreNum">
          <el-form-item prop="storeNum" label="合格数量" class="store">
            <el-input v-model="ruleStoreNum.storeNum" placeholder="请输入合格数量"   style="width: 100%;"></el-input>
          </el-form-item>
        </el-form>


        <div slot="footer" class="dialog-footer">
          <el-button @click="resetStoreNum" size="medium">重 置</el-button>
          <el-button type="primary" @click="commit('ruleStoreNum')" size="medium" :disabled="isDisable">确 定</el-button>
        </div>
      </el-dialog>
      <!--入库数量弹窗结束-->


    </div>
</template>

<script>

    export default {
        name: "Received",
      data(){
          return{
            danCheckrow:{},
            showDCheck:false,
            showDEnter:false,
            showCheck:false,
            showEnter:false,
            loading: true,
            activeIndex:'',
            isOpen:true,
            isCollapse: true,//控制侧边拦展开收起
            dialogNum:false,//单个收货送检弹窗控制
            dialogStore:false,//入库弹窗控制
            selectStore:false,//批量送检弹窗开始
            piDisable:true,//控制批量送检，批量入库按钮是否可点（只有选了库位才可以点击批量送检和批量入库）
            dialogVisible: false,
            isShow:false,
            isDisable:false,//控制收货多次提交数据
            saoResult:'',//扫码结果
            ruleStock:{    //批量收货送检数据
              FStock:'',
              FLocation:'',
              FNum:''
            },
            rulereceiveNum:{   //单个收货送检数据
              receiveNum:'',
              stock:'',
              location:''
            },
            ruleStoreNum:{
              storeNum:'',//合格数量
            },
            rules:{
              receiveNum:[
                {required: true, message: '请输入收货数量', trigger: 'blur'},
                // { type: 'number', message: '格式不正确'}
              ],
              stock:[
                {required: true, message: '请选择仓库', trigger: 'blur'},
              ],
              location:[
                {required: true, message: '请选择库位', trigger: 'blur'},
              ],
              storeNum:[
                {required: true, message: '请输入合格数量', trigger: 'blur'},
                // { type: 'number', message: '格式不正确'}
              ],
              checkNum:[
                {required: true, message: '请输入合格数量', trigger: 'blur'},
                // { type: 'number', message: '格式不正确'}
              ],
              FStock:[
                {required: true, message: '请选择仓库', trigger: 'blur'},
              ],

              FLocation:[
               {required: true, message: '请选择库位', trigger: 'blur'},
             ],

              FNum:[
                {required: true, message: '请输入收货数量', trigger: 'blur'},
              ]

            },
            tableData: [],
            receivedRow:[],
            storeRow:[],
            checkRow:[],
            numData:[],//收货组装数据
            StoreData:[],//入库组装数据
            multipleSelection: [],
            Stock:[],//批量选仓库
            Location:[],//批量选库位
            Dstock:[],
            Dlocation:[],
            DataStock:{
              fstock:'',
              fstockid:'',
              flocation:'',
              flocationid:''
            },
            DataStock2:{
              fstock:'',
              fstockid:'',
              flocation:'',
              flocationid:''
            },
            piData:{}
          }
      },
      mounted() {
       this.activeIndex = ''

      },
      watch:{
          $route(){
            this.jihuo(this.activeIndex)
          }
      },
      created(){
        window.aa = this.aa;
        window.bb = this.bb;

      },
      methods:{
        typeSelect(input){
          this.getLocation(this.Stock[input].FID)
          this.DataStock.fstock = this.Stock[input].FNAME
          this.DataStock.fstockid = this.Stock[input].FID

          this.ruleStock.FLocation = ''
          console.log('this.DataStock')
          console.log(this.DataStock)
        },
        DtypeSelect(input){
          this.getLocation(this.Dstock[input].FID)
          this.DataStock2.fstock = this.Dstock[input].FNAME
          this.DataStock2.fstockid = this.Dstock[input].FID
          this.rulereceiveNum.location = ''

        },
        typeSelect2(input){
          //组装库位数据
          this.DataStock.flocation = this.Location[input].FNAME
          this.DataStock.flocationid = this.Location[input].FID
          // console.log('this.DataStock')
          // console.log(this.DataStock)
        },
        DtypeSelect2(input){
          this.DataStock2.flocation = this.Dlocation[input].FNAME
          this.DataStock2.flocationid = this.Dlocation[input].FID
        },
        //请求库位数据
        getLocation(stock){
         var laterStock = stock
          if(stock.indexOf('+') == -1){
            //alert('没有出现')
            laterStock = stock
          }else {
            //alert('出现')
            laterStock  = stock.replace(/\+/g,'%2b')
          }
          this.$axios.get(this.GLOBAL.baseURL + '/location'+'?stock='+laterStock).then((response) => {
            //console.log(response.data)
            this.Location = response.data
            this.Dlocation = response.data
            console.log(this.Location)
          }).catch((err) => {
            console.log(err)

          })
        },
        //请求仓库数据
        getStock(){
          this.$axios.get(this.GLOBAL.baseURL + '/stock').then((response) => {
            //console.log(response.data)
            this.Stock = response.data
            this.Dstock = response.data
            console.log(this.Stock)
          }).catch((err) => {
            console.log(err)

          })
        },
        //批量入库
        piEnter(){
          if(this.multipleSelection.length>0){
            this.showCheck = false
            this.showEnter = false

            for (var i =0;i<this.multipleSelection.length;i++){
              if(this.multipleSelection[i].FISCHECK == '是'){
                this.$message.warning('请去掉直接送检物料后在提交');
                this.$refs.multipleTable.clearSelection();
                return;
              }
            }

            this.showEnter = true
            this.selectStore = true
            this.Stock = []
            this.Location = []
            this.DataStock ={}
            //this.DataStock2 = {}
            this.ruleStock.FLocation = ''
            this.ruleStock.FStock = ''

            this.getStock()//请求仓库信息


            this.ruleStock.FStock = this.multipleSelection[0].FSTOCK  //给选仓库一个初始默认值
            this.getLocation(this.multipleSelection[0].FSTOCKID)//请求库位信息

            //如果仓库有默认值时
            if(this.ruleStock.FStock != ''){
              this.DataStock.fstock = this.multipleSelection[0].FSTOCK
              this.DataStock.fstockid = this.multipleSelection[0].FSTOCKID
            }

            // this.multipleSelection.some((item) => {
            //   if(item.FISCHECK == '否'){        //如果选择有要直接入库的则提示，去掉直接入库
            //     this.$message.warning('请去掉直接入库的物料后在提交');
            //     this.$refs.multipleTable.clearSelection();
            //     this.showCheck = false
            //     this.showEnter = false
            //   }else {   //否则打开弹窗
            //     this.showEnter = true
            //     this.selectStore = true
            //     this.Stock = []
            //     this.Location = []
            //     this.DataStock ={}
            //     //this.DataStock2 = {}
            //     this.ruleStock.FLocation = ''
            //     this.ruleStock.FStock = ''
            //
            //     this.getStock()//请求仓库信息
            //
            //
            //     this.ruleStock.FStock = this.multipleSelection[0].FSTOCK  //给选仓库一个初始默认值
            //     this.getLocation(this.multipleSelection[0].FSTOCKID)//请求库位信息
            //
            //     //如果仓库有默认值时
            //     if(this.ruleStock.FStock != ''){
            //       this.DataStock.fstock = this.multipleSelection[0].FSTOCK
            //       this.DataStock.fstockid = this.multipleSelection[0].FSTOCKID
            //     }
            //   }
            // })

          }else{
            this.$message.warning('请勾选需要入库的物料');
          }
        },
          //批量送检
        piCheck(){
          if(this.multipleSelection.length>0){
            this.showCheck = false
            this.showEnter = false

            for (var i =0;i<this.multipleSelection.length;i++){
              if(this.multipleSelection[i].FISCHECK == '否'){
                this.$message.warning('请去掉直接入库的物料后在提交');
                this.$refs.multipleTable.clearSelection();
                return;
              }
            }
                this.showCheck = true
                this.selectStore = true
                this.Stock = []
                this.Location = []
                this.DataStock ={}
                //this.DataStock2 = {}
                this.ruleStock.FLocation = ''
                this.ruleStock.FStock = ''

                this.getStock()//请求仓库信息


                this.ruleStock.FStock = this.multipleSelection[0].FSTOCK  //给选仓库一个初始默认值
                this.getLocation(this.multipleSelection[0].FSTOCKID)//请求库位信息

                //如果仓库有默认值时
                if(this.ruleStock.FStock != ''){
                  this.DataStock.fstock = this.multipleSelection[0].FSTOCK
                  this.DataStock.fstockid = this.multipleSelection[0].FSTOCKID
                }


            console.log('this.multipleSelection'+'aaa')
            console.log(this.multipleSelection)



            // this.multipleSelection.some((item) => {
            //
            //   if(item.FISCHECK == '否'){        //如果选择有要直接入库的则提示，去掉直接入库
            //
            //     this.$message.warning('请去掉直接入库的物料后在提交');
            //     this.$refs.multipleTable.clearSelection();
            //     this.showCheck = false
            //     this.selectStore = false
            //   }else {   //否则打开弹窗
            //     this.showCheck = true
            //     this.selectStore = true
            //     this.Stock = []
            //     this.Location = []
            //     this.DataStock ={}
            //     //this.DataStock2 = {}
            //     this.ruleStock.FLocation = ''
            //     this.ruleStock.FStock = ''
            //
            //     this.getStock()//请求仓库信息
            //
            //
            //     this.ruleStock.FStock = this.multipleSelection[0].FSTOCK  //给选仓库一个初始默认值
            //     this.getLocation(this.multipleSelection[0].FSTOCKID)//请求库位信息
            //
            //     //如果仓库有默认值时
            //     if(this.ruleStock.FStock != ''){
            //       this.DataStock.fstock = this.multipleSelection[0].FSTOCK
            //       this.DataStock.fstockid = this.multipleSelection[0].FSTOCKID
            //     }
            //   }
            // })

          }else{
            this.$message.warning('请勾选需要送检的物料');
          }

          //this.$refs.multipleTable.clearSelection();
        },
        //批量入库数据提交
        pienterData(){
          var data =[]
          for(var k = 0; k<this.multipleSelection.length;k++){
            data.push({
              fuser: this.GLOBAL.userData.UserName,
              fid: this.multipleSelection[k].FID,
              fentryid: this.multipleSelection[k].FENTRYID,
              //fqty:this.ruleStock.FNum ,
              fqty:this.multipleSelection[k].FDELIVERYQTY,
              fstockid:this.DataStock.fstockid,
              flocationid:this.DataStock.flocationid,
            })
          }
          console.log('data')
          console.log(data)

          this.$axios.post(this.GLOBAL.baseURL + '/DPurInWare',data,{
            headers:{"Authorization":"Bearer" + " " + this.GLOBAL.token}
          }).then((response) => {
            // console.log(response.data)
            if(response.data.success == true){
              //收货成功,刷新收货清单数据
              this.$message.success('操作成功');
              this.GetReceived(this.saoResult)

            }else {
              this.$message.error(response.data.result);
            }

          }).catch((err) => {
            console.log(err)
          })
          this.isDisable = false
          this.selectStore = false //关闭弹窗
          this.showEnter = false  //隐藏批量入库确定按钮
          this.$refs.multipleTable.clearSelection();
        },
        //批量送检数据提交
        picommitData(){
          var data =[]

          console.log("this.multipleSelection")
          console.log(this.multipleSelection)
          for(var k = 0; k<this.multipleSelection.length;k++){
            data.push({
                  fuser: this.GLOBAL.userData.UserName,
                  fid: this.multipleSelection[k].FID,
                  fentryid: this.multipleSelection[k].FENTRYID,
                  fqty:this.multipleSelection[k].FDELIVERYQTY ,
                  //fqty:this.ruleStock.FNum ,
                  fstockid:this.DataStock.fstockid,
                  flocationid:this.DataStock.flocationid,
                })
          }
     console.log("data")
     console.log(data)
          this.$axios.post(this.GLOBAL.baseURL + '/purReceival',data).then((response) => {
            // console.log(response.data)
            if(response.data.success == true){
              //收货成功,刷新收货清单数据
              this.$message.success('操作成功');
              this.GetReceived(this.saoResult)

            }else {
              this.$message.error(response.data.result);
            }

          }).catch((err) => {
            console.log(err)
          })
          this.isDisable = false
          this.selectStore = false //关闭弹窗
          this.showCheck = false  //隐藏批量送检确定按钮
          this.$refs.multipleTable.clearSelection();
        },

        handleSelectionChange(val) {
          this.multipleSelection = val;
          //console.log(this.multipleSelection)
        },
        qie(){
         this.isOpen = !this.isOpen
          this.GLOBAL.isState = !this.GLOBAL.isState
          // this.tests()

        },
        jihuo(index){
          this.activeIndex = index

        },
        tests(){
          if(this.isShow = false){
            this.isShow = true
          }
        },
        //单个收货送检
        handleClick(row) {

         //this.danCheckrow = row
          this.showDCheck = true
          this.dialogNum = true

          this.Dstock = []
          this.Dlocation = []
          this.receivedRow = []

          this.rulereceiveNum.stock = ''
          this.rulereceiveNum.location = ''
          this.DataStock2 ={}


          this.getStock()//请求仓库信息




          if(row.FSTOCK){
            this.rulereceiveNum.stock = row.FSTOCK  //给选仓库一个初始默认值
            this.getLocation(row.FSTOCKID)//请求库位信息
            //如果仓库有默认值时
            if(this.rulereceiveNum.stock != ''){
              this.DataStock2.fstock = row.FSTOCK
              this.DataStock2.fstockid = row.FSTOCKID
            }
          }


          this.receivedRow.push({
            'FMANAME':row.FMANAME,
            'FMODEL':row.FMODEL,
            'FUNIT':row.FUNIT,
            'FDELIVERYQTY':row.FDELIVERYQTY,//送货数量
            'FID':row.FID,
            'FENTRYID':row.FENTRYID,
            'FRECEIVEQTY':row.FRECEIVEQTY,//收货数量

          })
          this.rulereceiveNum.receiveNum = row.FDELIVERYQTY - row.FRECEIVEQTY
          console.log(this.receivedRow)

        },
        //单个入库
        handleClick3(row) {
          this.showDEnter = true
          this.dialogNum = true

          this.Dstock = []
          this.Dlocation = []
          this.receivedRow = []

          this.rulereceiveNum.stock = ''
          this.rulereceiveNum.location = ''
          this.DataStock2 ={}


          this.getStock()//请求仓库信息


          if(row.FSTOCK){
            this.rulereceiveNum.stock = row.FSTOCK  //给选仓库一个初始默认值
            this.getLocation(row.FSTOCKID)//请求库位信息
            //如果仓库有默认值时
            if(this.rulereceiveNum.stock != ''){
              this.DataStock2.fstock = row.FSTOCK
              this.DataStock2.fstockid = row.FSTOCKID
            }
          }


          this.receivedRow.push({
            FMANAME:row.FMANAME,
            FMODEL:row.FMODEL,
            FUNIT:row.FUNIT,
            FDELIVERYQTY:row.FDELIVERYQTY,//送货数量
            FID:row.FID,
            FENTRYID:row.FENTRYID,
            FRECEIVEQTY:row.FRECEIVEQTY,//收货数量

          })
          this.rulereceiveNum.receiveNum = row.FDELIVERYQTY - row.FRECEIVEQTY

        },
        //单个入库
        // handleClick3(row) {
        //   this.dialogStore = true
        //   this.storeRow = []
        //   this.storeRow.push({
        //     FMANAME:row.FMANAME,
        //     FMODEL:row.FMODEL,
        //     FUNIT:row.FUNIT,
        //     FDELIVERYQTY:row.FDELIVERYQTY,//送货数量
        //     FID:row.FID,
        //     FENTRYID:row.FENTRYID,
        //     FRECEIVEQTY:row.FRECEIVEQTY//收货数量
        //   })
        //   this.ruleStoreNum.storeNum=row.FDELIVERYQTY
        //
        //
        // },

        //单个收货送检提交
        commits(formName){
          this.$refs[formName].validate((valid) => {
            if (valid) {
              if (this.rulereceiveNum.receiveNum > (this.receivedRow[0].FDELIVERYQTY - this.receivedRow[0].FRECEIVEQTY)) {
                this.$message.error('可填报收货数量最大为' + (this.receivedRow[0].FDELIVERYQTY - this.receivedRow[0].FRECEIVEQTY));

              } else {
                this.isDisable = true
                this.dialogNum = false
                this.subNum();
              }

            } else {
              //this.showDCheck = false
              console.log('error submit!!');
              return false;
            }
          });
        },
        //单个入库提交
        commitsEnter(formName){
          this.$refs[formName].validate((valid) => {
            if (valid) {
              if (this.rulereceiveNum.receiveNum > (this.receivedRow[0].FDELIVERYQTY - this.receivedRow[0].FRECEIVEQTY)) {
                this.$message.error('可填报入库数量最大为' + (this.receivedRow[0].FDELIVERYQTY - this.receivedRow[0].FRECEIVEQTY));

              } else {
                this.isDisable = true
                this.dialogNum = false
                this.danEntersub()
              }

            } else {
              //this.showDCheck = false
              console.log('error submit!!');
              return false;
            }
          });
        },

        //入库提交
        // commit(formName){
        //   this.$refs[formName].validate((valid) => {
        //     // alert(valid)
        //     if (valid) {
        //       if (this.ruleStoreNum.storeNum > this.storeRow[0].FDELIVERYQTY) {
        //         this.$message.error('可填报合格数量最大为' + this.storeRow[0].FDELIVERYQTY);
        //
        //       } else {
        //         this.isDisable = true
        //         this.dialogStore = false
        //
        //         this.subStoreNum();
        //       }
        //
        //     } else {
        //       console.log('error submit!!');
        //       return false;
        //     }
        //   });
        // },
        //批量送检提交
        commitStock(formName){
          this.$refs[formName].validate((valid) => {
            if (valid) {
              this.picommitData()
            } else {
              //this.showCheck = false
              console.log('error submit!!');
              return false;
            }
          });
        },
//批量入库提交
        commitEnter(formName){
          this.$refs[formName].validate((valid) => {
            if (valid) {
              this.pienterData()
            } else {
              //this.showEnter = false
              console.log('error submit!!');
              return false;
            }
          });
        },

        // subStoreNum(){
        //   this.StoreData=[]
        //   this.StoreData.push({
        //     fuser: this.GLOBAL.userData.UserName,
        //     fid: this.storeRow[0].FID,
        //     fentryid: this.storeRow[0].FENTRYID,
        //     fqty: this.ruleStoreNum.storeNum
        //   })
        //
        //   this.$axios.post(this.GLOBAL.baseURL + '/DPurInWare',this.StoreData,{
        //     headers:{"Authorization":"Bearer" + " " + this.GLOBAL.token}
        //   }).then((response) => {
        //     console.log(response.data)
        //     if(response.data.success == true){
        //       //入库成功,刷新收货清单数据
        //       this.dialogStore = false
        //       this.$message.success("入库成功");
        //       this.GetReceived(this.saoResult)
        //
        //
        //     }else {
        //       this.$message.error(response.data.result);
        //
        //     }
        //
        //   }).catch((err) => {
        //     console.log(err)
        //   })
        //   this.isDisable = false
        // },
        danEntersub(){

          this.numData=[]


          this.numData.push({
            'fuser': this.GLOBAL.userData.UserName,
            'fid': this.receivedRow[0].FID,
            'fentryid': this.receivedRow[0].FENTRYID,
            'fqty': this.rulereceiveNum.receiveNum,
            'fstockid':this.DataStock2.fstockid,
            'flocationid':this.DataStock2.flocationid
          })

          this.$axios.post(this.GLOBAL.baseURL + '/DPurInWare',this.numData,{
            headers:{"Authorization":"Bearer" + " " + this.GLOBAL.token}
          }).then((response) => {
            // console.log(response.data)
            if(response.data.success == true){
              //收货成功,刷新收货清单数据
              this.$message.success('操作成功');
              this.GetReceived(this.saoResult)

            }else {
              this.$message.error(response.data.result);
            }

          }).catch((err) => {
            console.log(err)
          })
          this.dialogNum = false
          this.showDEnter = false
          this.isDisable = false
        },
        subNum(){
          this.numData=[]


            this.numData.push({
              fuser: this.GLOBAL.userData.UserName,
              fid: this.receivedRow[0].FID,
              fentryid: this.receivedRow[0].FENTRYID,
              fqty: this.rulereceiveNum.receiveNum,
              fstockid:this.DataStock2.fstockid,
              flocationid:this.DataStock2.flocationid
            })

            this.$axios.post(this.GLOBAL.baseURL + '/purReceival',this.numData).then((response) => {
              // console.log(response.data)
              if(response.data.success == true){
                //收货成功,刷新收货清单数据
                this.$message.success('操作成功');
                this.GetReceived(this.saoResult)

              }else {
                this.$message.error(response.data.result);
              }

            }).catch((err) => {
              console.log(err)
            })
          this.dialogNum = false
          this.showDCheck = false
          this.isDisable = false
        },
        resetNum(){
          this.rulereceiveNum.receiveNum = ''
          this.rulereceiveNum.location = ''
          this.rulereceiveNum.stock = ''
          this.DataStock2 ={}
        },
        resetStoreNum(){
          this.ruleStoreNum.storeNum = ''
        },
        // resetCheckNum(){
        //   this.ruleCheckNum.checkNum = ''
        // },
        resetruleStock(){
          this.ruleStock.FStock = ''
          this.ruleStock.FLocation = ''
          this.ruleStock.FNum = ''
          this.DataStock ={}
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
          // this.dialogVisible = false;
          AndroidJs.exit();
          // this.$router.push('/login')

          // BSL.SetJsClose()


          //退出登录后禁止浏览器后退
          // history.pushState(null,null,document.URL);
          // window.addEventListener("popstate",function (e) {
          //   history.pushState(null,null,document.URL)
          // },false)

        },
        //请求收货清单
        GetReceived(date){
          this.isShow = true
          this.$axios.get(this.GLOBAL.baseURL + '/deliveryBill/'+date).then((response) => {
            console.log(response.data)
            this.tableData = response.data
            this.loading = false
          }).catch((err) => {
            console.log(err)
            this.loading = false
          })
        },
        aa(result) {

          this.saoResult = result
          this.GetReceived(this.saoResult)


        },
        qrcode(){
          //网页调试
          //this.GetReceived('FH_000074090')
          //this.GetReceived('FH_000074092')

          // BSL.Qcode('0','aa')
          AndroidJs.scan('aa');

        },

      }
    }
</script>

<style scoped>
  .el-button--medium{padding: 10px 10px;}
  .received{height: 100%;}
  .sao{background: url("../../assets/imgs/sao.png") no-repeat;border: none;width: 165px;height: 165px;margin-left: 50%;transform: translateX(-50%);margin-top: 200px;}
  .wite{color: red;}
  .el-form-item__label{color: #180e0c !important;}
  .pi-button{float: right;margin-right: 20px;margin-top: 5px;}

</style>
