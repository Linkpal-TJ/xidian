<template>
  <div id="app">
    <router-view></router-view>
  </div>
</template>

<script>
export default {
  name: 'App',
  data(){
    return{
    }
  },
  mounted() {
    // var Us = localStorage.getItem('user')
    // this.GLOBAL.userData = JSON.parse(Us)
    //alert(window.screen.availHeight)
    this.GLOBAL.isheight = window.screen.availHeight - 120

  },
  destroyed(){

  },
  methods:{


  },
  // beforeRouteLeave (to, from, next) {
  //   // 导航守卫===》导航离开该组件的对应路由时调用
  //   /* to:即将要进入的目标 路由对象
  //      from: 当前导航正要离开的路由
  //      next:执行的效果，next(false): 中断当前的导航  next({ path: '/' }): 跳转到一个不同的地址
  //    */
  //   if(to.fullPath == '/1' || to.fullPath == '/2'|| to.fullPath == '/3'){
  //     next();
  //   }else{
  //     MessageBox({
  //       title: '提示',
  //       message: '您确定要返回吗?',
  //       showCancelButton: true,
  //       closeOnClickModal:true
  //     }).then(action => {
  //       if(action == 'confirm'){
  //         next();
  //       }else{
  //         next(false);
  //       }
  //     })
  //   }
  // }
  //





}
</script>

<style>


</style>
