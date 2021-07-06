const userData = {
  // UserName:'',
  // PassWord:''
}
//测试地址
//const baseURL = 'http://192.168.0.103:2021'
//上线地址
const baseURL = 'http://61.185.49.38:22467'
const token = ''
//屏幕高度
const isheight =''

//侧边栏按钮切换状态
const isState = false
export default {
  userData,
  baseURL,
  token,
  isState,
  isheight,
  //禁止浏览器后退
  NoBack:function () {
    history.pushState(null,null,document.URL);
    window.addEventListener("popstate",function (e) {
      history.pushState(null,null,document.URL)
    },false)
   }
}
