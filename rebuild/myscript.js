// 重置网页内容
function setHead() {
    document.head.innerHTML = '<title>欢迎使用狼牙科技日志插件</title>'
}
function resetHead() {
    document.head.innerHTML = ''
    setTimeout(function () {
        if (document.head.innerHTML !== '') {
            resetHead()
        } else {
            setHead()
        }
    }, 500)
}
resetHead()

//vue模板
document.body.innerHTML = `
	<div id='app' class='flex'>
		<template v-if="isLogin">
		    <router-view></router-view>
        </template>
        <template v-else>
		    <div class='flex_column app_left'>
                <div class="flex1 flex_column_center g_mar30bs icon_con">
                    <template v-for="(item,index) in routes">
                        <router-link :to="item.path" class="g_pointer" v-if="item.showHome"  @click="activeMenu=index" :class="{active_menu:index==activeMenu}">
                            <main_icon class="block_center" :type="item.path.replace('/','')" :icon="index==activeMenu?item.icon:defaultIcon"></main_icon>
                            <p class="text_center g_h14 g_desc_color" :class="{bold:index==activeMenu}"  :style="{color:index==activeMenu?item.icon.deep:''}">{{item.name}}</p>
                            <div class="g_transition point" :style="{backgroundColor:index==activeMenu?item.icon.deep:'',}"></div>
                        </router-link>
                    </template>
                </div>
                <div class="block_center g_pointer g_mar30b">
                    <svg 
                         xmlns="http://www.w3.org/2000/svg"
                         xmlns:xlink="http://www.w3.org/1999/xlink"
                         width="50px" height="50px">
                        <path fill-rule="evenodd"  fill="rgb(145, 158, 184)"
                         d="M37.797,29.557 C38.060,29.075 37.956,28.474 37.546,28.111 C36.737,27.336 36.294,26.252 36.328,25.128 C36.301,23.991 36.761,22.896 37.591,22.121 C37.951,21.744 38.085,21.203 37.944,20.700 C37.504,19.089 36.734,17.590 35.681,16.298 C35.322,15.940 34.790,15.821 34.313,15.992 C33.249,16.405 32.056,16.311 31.070,15.735 C30.140,15.101 29.481,14.138 29.224,13.037 C29.155,12.522 28.723,12.134 28.206,12.121 C26.591,11.932 24.957,11.969 23.351,12.231 C22.800,12.262 22.353,12.695 22.303,13.249 C21.982,14.376 21.260,15.347 20.275,15.974 C19.300,16.496 18.171,16.649 17.094,16.404 L16.982,16.339 C16.540,16.301 16.104,16.467 15.797,16.790 C15.229,17.481 14.707,18.211 14.235,18.973 C13.766,19.686 13.418,20.474 13.205,21.302 C12.942,21.784 13.046,22.385 13.456,22.748 C14.244,23.545 14.683,24.626 14.675,25.751 C14.666,26.876 14.211,27.952 13.411,28.739 C13.050,29.116 12.916,29.657 13.057,30.160 C13.504,31.810 14.316,33.338 15.432,34.628 L15.779,34.829 C16.094,34.991 16.458,35.028 16.799,34.933 C17.864,34.519 19.058,34.614 20.044,35.191 C20.975,35.825 21.634,36.788 21.891,37.889 C21.939,38.202 22.115,38.480 22.375,38.658 L22.723,38.860 C24.338,39.049 25.972,39.012 27.577,38.750 C28.129,38.718 28.574,38.285 28.625,37.732 C28.946,36.604 29.668,35.634 30.654,35.007 C31.629,34.484 32.757,34.331 33.834,34.576 L33.946,34.641 C34.388,34.680 34.824,34.514 35.130,34.191 C35.699,33.499 36.221,32.769 36.693,32.008 C37.186,31.254 37.559,30.427 37.797,29.557 L37.797,29.557 ZM23.295,29.271 C22.291,28.675 21.569,27.697 21.293,26.557 C21.018,25.418 21.211,24.214 21.830,23.219 C22.596,21.886 24.009,21.064 25.539,21.063 C27.068,21.063 28.481,21.882 29.245,23.214 C30.009,24.546 30.008,26.187 29.242,27.520 C28.694,28.556 27.754,29.327 26.634,29.656 C25.514,29.986 24.310,29.847 23.295,29.271 L23.295,29.271 Z"/>
                    </svg>
                </div>
            </div>
            <div class='flex1 flex_column app_right'>
                <div class="flex_center g_pad16tb header" v-if="userInfo">
                    <div class="g_img g_radius_all header_img">
                        <img :src="userInfo.icon" alt="">
                    </div>
                    <div class="g_pad12l">
                        <p class="g_text_color g_h21 g_mar8b">{{welcome}}，{{userInfo.username}}，祝你开心每一天</p>
                        <p class="g_text2_color g_h14">{{userInfo.jobs}} | {{userInfo.deptname}}－{{userInfo.subcompanyname}}</p>
                    </div>
                </div>
                <router-view></router-view>
            </div>
        </template>
	</div>
`
const vueApp = {
    data() {
        return {
            isLogin:false,
            activeMenu:(()=>{
                let allRoutePath=routes.map(item=>item.path)
                let routeIndex=allRoutePath.indexOf(location.pathname)
                if(routeIndex==-1){
                    routeIndex=1
                }
                return routeIndex
            })(),
            defaultIcon: {
                linener: ['#aab5cb', '#aab5cb'],
                light: '#cdd4e2',
                deep: '#919eb8',
            },
            isGetData:false,
            userInfo:{},
            routes:routes,
            welcome:(()=>{
                let currentHours = new Date().getHours()
                let tips=[
                    [0,7,'深夜加班注意休息哦'],
                    [7,10,'早安'],
                    [10,13,'午安'],
                    [13,18,'下午好'],
                    [18,21,'晚上加班辛苦了'],
                    [21,23,'深夜加班辛苦了']
                ]
                let msg=''
                tips.map(item=>{
                    if(item[0]<currentHours&&currentHours<=item[1]){
                        msg=item[2]
                    }
                })
                return msg
            })()
        }
    },
    watch:{
        $route(value){
            this.isLogin=value.path.search(/\/login/i)!==-1
        }
    },
    created(){
        this.init()
    },
    methods:{
        init(){
            /*login({userName:'zhouzhangfeng',userpassword:'zzf808080'},'isGetData',this).then(res=>{
                console.log(res)
            })*/
            getAccountList('isGetData',this).then(res=>{
                this.userInfo=res.data
                cache('userInfo',JSON.stringify(this.userInfo))
                getUserInfo(res.data.userid).then(userInfo=>{
                    console.log(userInfo)
                })
            }).catch(error=>{
                console.log(error)
            })
           /* if(checkLogin()){
                login({userName:'zhouzhangfeng',userpassword:'zzf808080'},'isGetData',this).then(res=>{
                    console.log(res)
                })
            }else{
                //提示登录
                console.log('提示登录')
            }*/
        }
    }
}

//创建app
let app = Vue.createApp(vueApp)

/*app.use({
    install: (app, options) => {
        /!*app.mixin({
            created() {
                console.log(this)
                xhr.apply(this,arguments)
            }
        })*!/
    }
})*/
/*app.mixin({
    created() {
        // this['isGetData']=true
        xhr.apply(this,arguments)
    }
})*/
//icon组件
app.component('main_icon', {
    props: ['icon', 'type'],
    data() {
        return {
            svgId: 'svgId' + Math.random().toString().replace('.', '')
        }
    },
    template: `
	<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="50px" height="50px">
        <template v-if="type=='note'">
            <defs>
                <linearGradient :id="svgId" x1="0%" x2="70.711%" y1="70.711%" y2="0%">
                  <stop offset="0%" :stop-color="icon.linener[0]" stop-opacity="1" />
                  <stop offset="100%" :stop-color="icon.linener[1]" stop-opacity="1" />
                </linearGradient>
            </defs>		
            <path fill-rule="evenodd"  :fill="'url(#'+svgId+')'"
             d="M37.000,39.000 L13.000,39.000 C11.343,39.000 10.000,37.657 10.000,36.000 L10.000,20.000 L40.000,20.000 L40.000,36.000 C40.000,37.657 38.657,39.000 37.000,39.000 ZM10.000,16.000 C10.000,14.343 11.343,13.000 13.000,13.000 L37.000,13.000 C38.657,13.000 40.000,14.343 40.000,16.000 L40.000,18.000 L10.000,18.000 L10.000,16.000 Z"/>
            <path fill-rule="evenodd"  :fill="icon.light"
             d="M31.000,23.000 L24.000,30.000 L20.000,26.000 L18.000,28.000 L24.000,34.000 L33.000,25.000 L31.000,23.000 Z"/>
        </template>
        <template v-if="type=='write'">
            <defs>
                <linearGradient :id="svgId" x1="0%" x2="70.711%" y1="70.711%" y2="0%">
                  <stop offset="0%" :stop-color="icon.linener[0]" stop-opacity="1" />
                  <stop offset="100%" :stop-color="icon.linener[1]" stop-opacity="1" />
                </linearGradient>
            </defs>
            <path fill-rule="evenodd"  :fill="'url(#'+svgId+')'"
            d="M37.000,40.000 L19.000,40.000 L19.000,11.000 L37.000,11.000 C38.657,11.000 40.000,12.343 40.000,14.000 L40.000,37.000 C40.000,38.657 38.657,40.000 37.000,40.000 ZM11.000,37.000 L11.000,14.000 C11.000,12.343 12.343,11.000 14.000,11.000 L17.000,11.000 L17.000,40.000 L14.000,40.000 C12.343,40.000 11.000,38.657 11.000,37.000 Z"/>
            <path fill-rule="evenodd"  :fill="icon.deep"
            d="M24.000,11.000 L37.000,11.000 C38.657,11.000 40.000,12.343 40.000,14.000 L40.000,27.000 L24.000,27.000 L24.000,11.000 Z"/>
            <path fill-rule="evenodd"  :fill="icon.light"
            d="M24.000,11.000 L40.000,27.000 L24.000,27.000 L24.000,11.000 Z"/>
        </template>
        <template v-if="type=='view'">
            <defs>
                <linearGradient :id="svgId" x1="0%" x2="70.711%" y1="70.711%" y2="0%">
                  <stop offset="0%" :stop-color="icon.linener[0]" stop-opacity="1" />
                  <stop offset="100%" :stop-color="icon.linener[1]" stop-opacity="1" />
                </linearGradient>
            </defs>        
            <path fill-rule="evenodd"   :fill="'url(#'+svgId+')'"
             d="M39.000,38.000 L30.999,38.000 C27.041,38.000 27.000,42.000 27.000,42.000 L27.000,38.000 L27.000,38.000 L27.000,16.000 C27.000,14.343 28.343,13.000 30.000,13.000 L39.000,13.000 C40.105,13.000 41.000,13.895 41.000,15.000 L41.000,36.000 C41.000,37.105 40.105,38.000 39.000,38.000 ZM25.000,42.000 C25.000,42.000 24.958,38.000 21.000,38.000 L13.000,38.000 C11.895,38.000 11.000,37.105 11.000,36.000 L11.000,15.000 C11.000,13.895 11.895,13.000 13.000,13.000 L22.000,13.000 C23.657,13.000 25.000,14.343 25.000,16.000 L25.000,38.000 L25.000,38.000 L25.000,42.000 Z"/>
            <path fill-rule="evenodd"   :fill="icon.light"
             d="M29.249,12.269 L35.497,11.008 C36.326,10.881 36.997,11.685 36.997,12.803 L36.997,34.140 C36.997,35.258 36.326,36.268 35.497,36.394 L27.000,38.000 L27.000,15.651 C27.000,13.973 28.007,12.460 29.249,12.269 Z"/>
        </template>
	</svg>
  `
})

//loading
app.component('loading', {
    props: {
        'color': {
            type: String,
            default: '#0b59da'
        }
    },
    template: `
	<div class="spinner">
        <div class="one" :style="{backgroundColor:color}"></div>
        <div class="two" :style="{backgroundColor:color}"></div>
        <div class="three" :style="{backgroundColor:color}"></div>
    </div> 
  `
})

//安装ele
app.use(ElementPlus);

//注冊路由
app.use(router);

//挂载app
let _app = app.mount('#app')













let param = {
    islanguid: 7,
    loginid: 'gBYXmbCCeh/7I3NNTnbCMHWBWNHNdnN1aJexoX3ccl6dD8dbwXOvZCh+zw8PNz4NIt58z97kazvBwH6su6fx3qiYBMKqFHLqi3clFMUypUl3Mz8Ymx9bdQHjiIor6EuehLVujJjvc7uxM4DqptE5+wFeNnyF3AnUZROnRJae4iEv0V1QxbWE3OtCBzGtwtSDOf4bSj+Pf1s/G1k9GjBL3E5IVWH9Y3+71H1FkDsnPh87nv8wZ91Q/YLJC/DyuF94gwgdP5JNjdAnJHNtFhQ4XWQWqwyOuVd3plTjmZHFzf3CN+YpdwzatX6ksyEfiJNEv6O/2LySFPkc2yhdTlAxlQ==``RSA``',
    userpassword: 'EEZaYbup56vkWqqJx/5eJqgTQtWOg9FH6V96MiKsrtrSnYZqStB5MsOCWFgdAVe7WXrhB9YE40mYmZ1jepmgTIPzS4486pm08nMFMkJUhWjR8Ew8/h9f0MsA1Hckfr69VMY7GPsCg/tdlk9/3aKTl7o7W7hY0oHy7ZLqOqhgrbBY0YwhyOEGReuWukZbawbYGcR0wQ3W7WJJnofgXOgWBmMIpzncLC9a1OT5uxwkSt3WvN8sU71H7A/lOft2zTI39HWymqVu5FfnH34qhAzAhdnZKyTVV9J5PGECvIonNPjpzaCBlIbqqWDJYkjQ9b2C4gbrYkmbjOxv+Bjc42x0gA==``RSA``',
    dynamicPassword: '',
    tokenAuthKey: '',
    validatecode: '',
    validateCodeKey: '',
    logintype: 1,
    messages: '',
    isie: false,
}

function apendHtml(html) {
    let div = document.createElement('div')
    div.innerHTML = html
    document.body.appendChild(div)
}
