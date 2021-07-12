//全局缓存的请求
let requests=[]
//全局请求链接
function xhr(loading,_this){
    let baseApi='https://os.cntytz.com'
    let _requestUrl;
    this.setBaseApi=(apiUrl)=>{
        baseApi=apiUrl
    }
    let oxhr=new XMLHttpRequest()
    let method='GET'
    let _param
    this.get=(requestUrl,param)=>{
        _param=param
        _requestUrl=requestUrl
        return this.send()
    }
    this.post=(requestUrl,param)=>{
        _param=param
        _requestUrl=requestUrl
        method='POST'
        return this.send()
    }
    //默认超时时间
    oxhr.timeout=10*1000
    this.setTimeout=(time=0,minute=false)=>{
        oxhr.timeout=minute?minute*time:time
        return this
    }
    this.removeRequest=(req)=>{
        requests=requests.filter(item=>item!==req)
    }
    this.send=()=>{
        if(_requestUrl.substring(0,1)!=='/'){
            _requestUrl='/'+_requestUrl
        }
        let sendUrl=baseApi+_requestUrl
        if(requests.indexOf(sendUrl)!==-1){
            console.log('取消加载')
            return
        }
        requests.push(sendUrl)
        if(_this&&loading){
            _this[loading]=true
        }
        return new Promise((resolve,reject)=>{
            oxhr.addEventListener("error",   oEvent=> {
                if(_this&&loading){
                    _this[loading]=false
                }
                console.log('断网了')
                console.log(oEvent)
                this.removeRequest(sendUrl)
                reject(oEvent)
            });
            oxhr.addEventListener("abort",  oEvent=> {
                if(_this&&loading){
                    _this[loading]=false
                }
                console.log('取消了')
                console.log(oEvent)
                this.removeRequest(sendUrl)
                reject(oEvent)

            });
            oxhr.addEventListener("readystatechange",  oEvent=>{
                if ( oxhr.readyState == 4 ) {
                    this.removeRequest(sendUrl)
                    if(_this&&loading){
                        _this[loading]=false
                    }
                    if ( oxhr.status == 200 ) {
                        // console.log(oxhr.responseText)
                        let result=JSON.parse(oxhr.responseText)
                        if(result.errorCode=='002'){
                            //判断是否可以自动登录
                            let saveAccount=cache('saveAccount')
                            let account=cache('account')
                            if(account&&saveAccount){
                                _app.$message({
                                    message: '正在为您自动登录...'
                                })
                                login(account).then(res=>{
                                    _app.$message({
                                        message: '登录成功'
                                    })
                                    _app.init()
                                })
                            }else{
                                //跳转至登录页面
                                _this.$message({
                                    message: result.msg,
                                    type: 'warning'
                                })
                                _app.$router.replace('/login')
                            }
                        }
                        resolve(result)
                    } else {
                        console.log(oxhr.status)
                        reject(oEvent)
                    }

                }
            });
            oxhr.addEventListener("timeout",  oEvent=>{
                if(_this&&loading){
                    _this[loading]=false
                }
                console.log('timeout')
                console.log(oEvent)
                this.removeRequest(sendUrl)
                reject(oEvent)
            });
            let getUrl=[]
            for(let key in _param){
                getUrl.push(encodeURIComponent(key)+'='+encodeURIComponent(_param[key]))
            }
            getUrl=getUrl.join('&').replace(/%20/g,'+')

            console.log(sendUrl)

            if (method.toLowerCase() == 'get') {
                oxhr.open(method,sendUrl+'?'+getUrl);
                oxhr.send();
            } else {
                oxhr.open(method,sendUrl);
                oxhr.setRequestHeader('content-type', 'application/x-www-form-urlencoded');
                // oxhr.setRequestHeader('content-type', 'application/json');
                console.log(sendUrl)
                console.log(getUrl)
                if(_param.type=='file'){
                    let formData=new FormData
                    delete _param.type
                    for(let key in _param){
                        formData.append(key,_param[key])
                    }
                    oxhr.send(formData);
                }else{
                    oxhr.send(getUrl);
                }

            }
        })
    }
}
//get方法
async function get(url,param,loading,_this,method='get'){
    //判断又没有公钥
    if(!cache('pubRsaKey')){
        let pubRsaKey=await new xhr().get('rsa/weaver.rsa.GetRsaInfo')
        cache('pubRsaKey',JSON.stringify(pubRsaKey))
    }
    if(isString(param)){
        _this=loading
        loading=param
        param= {}
    }
    if(url=='api/hrm/login/checkLogin'){
        param.loginid = rsaDataEncrypt(param.loginid)
        param.userpassword = rsaDataEncrypt(param.userpassword)
    }
    if(method.toLowerCase()=='get'){
        return new xhr(loading,_this).get(url,param)
    }
    if(method.toLowerCase()=='post'){
        return new xhr(loading,_this).post(url,param)
    }
}
//post
function post(url,param,loading,_this){
   return get(url,param,loading,_this,'post')
}
//登录
function  login(param,loading,_this){
    let _param={
        islanguid: 7,
        loginid: param.userName,
        userpassword: param.userpassword,
        dynamicPassword: '',
        tokenAuthKey: '',
        validatecode: '',
        validateCodeKey: '',
        logintype: 1,
        messages: '',
        isie: false,
    }
    return post('api/hrm/login/checkLogin',_param,loading,_this)
}
//获取账户
function getAccountList(param,loading,_this){
    return get('api/hrm/login/getAccountList',param,loading,_this)
}
//获取个人信息
function getUserInfo(userId,loading,_this){
    let param={
        operation: 'getResourceBaseView',
        id: userId
    }
    return get('api/hrm/resource/getResourceCard',param,loading,_this)
}
//上传头像
function getUserInfo(param,loading,_this){
    param={
        name: '头像',
        secretLevel: '',
        ...param,
        type:"file"
    }
    return post('api/doc/upload/uploadFile',param,loading,_this)
}


//看日志模块
//获取左边树
function getLeftMenu(param,loading,_this){
    param={
        method: 'all',
        offical:'',
        officalType:' -1',
        hideNoDataTab: false,
        viewScope: 'done',
        complete: 2,
        date2during: 0,
        menuIds: '1,90',
        menuPathIds: '1,90',
        actiontype: 'baseinfo'
    }
    return post('api/workflow/reqlist/doneBaseInfo',param,loading,_this)
}
//获取左边树的统计
function getLeftMenuOfCount(param,loading,_this){
    param={
        method: 'all',
        offical:'',
        officalType:' -1',
        hideNoDataTab: false,
        viewScope: 'done',
        complete: 2,
        date2during: 0,
        menuIds: '1,90',
        menuPathIds: '1,90',
        actiontype: 'countinfo'
    }
    return post('api/workflow/reqlist/doneCountInfo',param,loading,_this)
}
//获取日志总量
function getWriteCount(dataKey,loading,_this){
    return post('api/ec/dev/table/counts', {dataKey:dataKey},loading,_this)
}
//设置分页
function setPageSize(param,loading,_this){
    return post('api/ec/dev/table/pageSize', param,loading,_this)
}
//获取请求数据的key
function splitPageKey(param,loading,_this){
    param={
        method: 'all',
        offical:'',
        officalType: -1,
        hideNoDataTab: false,
        viewScope: 'done',
        complete: 2,
        date2during: 0,
        viewcondition: 10,
        defaultTabVal: 10,
        menuIds: '1,90',
        menuPathIds: '1,90',
        loadDefTab: true,
        actiontype: 'splitpage'
    }
    return post('api/workflow/reqlist/splitPageKey',param,loading,_this)
}
//获取日志列表
function getViewList(param,loading,_this){
    param={
        dataKey: '',
        current: 1,
        sortParams: [],
        ...param
    }
    return post('api/ec/dev/table/datas',param,loading,_this)
}
//获取日志详情
function getViewInfo(param,loading,_this){
    param={
        preloadkey: 1625999828720,
        requestid: 342625,
        timestamp: 1625999828720,
        ...param
    }
    return post('api/workflow/reqform/loadForm',param,loading,_this)
}