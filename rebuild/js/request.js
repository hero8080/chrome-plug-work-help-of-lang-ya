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
        if(requests.indexOf(sendUrl)!==-1&&!_param.alowRequestManyTimes){
            delete _param.alowRequestManyTimes
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
let isAutoLoginIng=false
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
    let result=null
    if(method.toLowerCase()=='get'){
         result=new xhr(loading,_this).get(url,param)
    }
    if(method.toLowerCase()=='post'){
        result= new xhr(loading,_this).post(url,param)
    }
    return new Promise((resolve,reject)=>{
        result.then(res=>{
            if(res.errorCode=='002'){
                //判断是否可以自动登录
                let saveAccount=cache('saveAccount')
                let account=cache('account')
                if(account&&saveAccount&&!isAutoLoginIng){
                    isAutoLoginIng=true
                    _app.$message({
                        message: '正在为您自动登录...'
                    })
                    login(account).then(res=>{
                        isAutoLoginIng=false
                        _app.$message({
                            message: '登录成功'
                        })
                        _app.init(true)
                        if(location.pathname.search('^/login/')!==-1){
                            _app.$router.replace('/write')
                        }
                    })
                }else{
                    //跳转至登录页面
                    _this.$message({
                        message: result.msg,
                        type: 'warning'
                    })
                    _app.$router.replace('/login')
                }
            }else{
                resolve(res)
            }
        }).catch(error=>{
            reject(error)
        })
    })

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
function uploadFile(param,loading,_this){
    param={
        name: '头像',
        secretLevel: '',
        ...param,
        type:"file"
    }
    return post('api/doc/upload/uploadFile',param,loading,_this)
}


//写日志
//获取默认表单数据
function getDefaultForm(param,loading,_this){
    param={
        beagenter: 0,
        f_weaver_belongto_userid:'',
        f_weaver_belongto_usertype: 0,
        isagent: 0,
        iscreate: 1,
        menuIds: '1,12',
        menuPathIds: '1,12',
        workflowid: 123,
        ...param
    }
    return post('api/workflow/reqform/loadForm',param,loading,_this)
}
//获取项目
function getProject(param,loading,_this){
    param={
        pageSize: 999,
        current: 1,
        min: 1,
        max: 999,
        companyId: 1,
        type: 'browser.lykjxm_rb',
        fielddbtype: 'browser.lykjxm_rb',
        currenttime: 1626181573706,
        nodataloading: 0,
        requestid: -1,
        workflowid: 123,
        wfid: 123,
        billid: -110,
        isbill: 1,
        f_weaver_belongto_userid: 20064,
        f_weaver_belongto_usertype: 0,
        wf_isagent: 0,
        wf_beagenter: 0,
        wfTestStr:'',
        fieldid: 11406,
        viewtype: 1,
        fromModule: 'workflow',
        wfCreater: 20064,
        alowRequestManyTimes:true,
        ...param
    }
    return get('api/public/browser/data/161',param,loading,_this)
}
//获取日志配置
function getConfig(param,loading,_this){
    param={
        workflowid: 123,
        nodeid: 477,
        requestid: -1,
        src: 'submit',
        ...param
    }
    return post('api/workflow/secondauth/getSecondAuthConfig',param,loading,_this)
}
//提交日志
function write(param,loading,_this){
    let fiexd={
        "formid": -110,
        "isWorkflowDoc": false,
        "f_weaver_belongto_usertype": 0,
        "nodetype": 0,
        "method":"",
        "needoutprint":"",
        "src": "submit",
        "isMultiDoc":"",
        "topage":"",
        "workflowtype": 3,
        "iscreate": 1,
        "comemessage":"",
        "remindTypes":"",
        "rand":"",
        "requestid": -1,
        "htmlfieldids":"",
        "needwfback": 1,
        "nodeid": 477,
        "isbill": 1,
        "remark":"",
        "field-annexupload":"",
        "signdocids":"",
        "signworkflowids":"",
        "remarkLocation":"",
        "annexdocids":"",
        "annexdocinfos":"",
        "handWrittenSign":"",
        "isOdocRequest": 0,
        "enableIntervenor":"",
        "linkageUnFinishedKey":"",
        "remarkquote":"",
        "actiontype": "requestOperation",
        "isFirstSubmit":"",
        "requestlevel": 0,
        "field7671": 7,
        "field7672": 68,
        "field-10":"",
        "signatureAttributesStr": "YmVhZ2VudGVyPTB8Y29uZmlnaWQ9LTF8aXNhZ2VudD0wfA==",
        "signatureSecretKey": "481c0142389a9f3911d7c0326a64889b",
        "selectNextFlow": 0,
        "wfTestStr":""
    }
    let verify={
        "workflowid": 123,
        "lastloginuserid": 20064,
        "f_weaver_belongto_userid": 20064,
        "field7670": 20064,
        "20064_123_addrequest_submit_token": 1626276900395,
        "linkageUUID": "0FD9087674B6408A989B978F8B6FFA91",
        // "verifyRequiredRange": "field-9999,field7691_0,field7691_1,field7692_0,field7692_1,field7693_0,field7693_1,field7694_0,field7694_1,field7696_0,field7696_1,field11406_0,field11406_1",
        "verifyRequiredRange": "",
        // "existChangeRange": "field7703,field11406_0,field7705_0,field11407_0,field7691_0,field7692_0,field7693_0,field7694_0,field7703,field11406_1,field7705_1,field11407_1,field7691_1,field7692_1,field7693_1,field7694_1,field7703,field7696_0,field7696_1,field7697_0,field7697_1,field7698_1,field7698_0,field7695_1,field7695_0",
        "existChangeRange": "",

        "field7703": 9.0,
        "nodesnum0": 2,
        "indexnum0": 2,
        "submitdtlid0": "0,1",
        "deldtlid0":"",
        "nodesnum1": 2,
        "indexnum1": 2,
        "submitdtlid1": "0,1",
        "deldtlid1":"",
        "mainFieldUnEmptyCount": 5,
        "detailFieldUnEmptyCount": 22,
    }
    let myForm={
        "requestname": "工作日报与计划-周章锋-2021-07-16",
        "field7673": "2021-07-16",

        "field11407_0": "智慧工地",
        "field11406_0": 81,
        "field11406_0name": "数据决策子系统",
        "field7691_0": "开会讨论大屏设计，处理折线图组件",
        "field7692_0": 0,
        "field7693_0": 40,
        "field7694_0": 7.0,
        "field7695_0": "无备注",
        "field7705_0": 2411,

        /*"field11407_1": "智慧工地",
        "field11406_1": 71,
        "field11406_1name": "SaaS平台主站",
        "field7691_1":"主站图片调整和内容调整",
        "field7692_1": 0,
        "field7693_1": 90.0,
        "field7694_1": 2.0,
        "field7695_1": "无备注",
        "field7705_1": 2411,

        "field7696_0": "处理主站图片和内容修改",
        "field7697_0": "无",
        "field7698_0": "无备注",*/

        "field7696_1": "开发大屏页面",
        "field7697_1": "无",
        "field7698_1": "无备注",
    }

    param={
        ...fiexd,
        ...verify,
        ...myForm,
        ...param
    }
    return post('api/workflow/reqform/requestOperation',param,loading,_this)
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