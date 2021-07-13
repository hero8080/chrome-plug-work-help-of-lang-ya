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
    let body='url=https%3A%2F%2Fos.cntytz.com%2Fspa%2Fworkflow%2Fstatic4form%2Findex.html%3F_rdm%3D1623077433043%23%2Fmain%2Fworkflow%2Freq%3Fiscreate%3D1%26workflowid%3D123%26isagent%3D0%26beagenter%3D0%26f_weaver_belongto_userid%3D%26f_weaver_belongto_usertype%3D0%26menuIds%3D1%2C12%26menuPathIds%3D1%2C12%26_key%3Dau9md8&moduleType=6&clientType=Chrome&allTc=48176&param=%7B%22formid%22%3A-110%2C%22f_weaver_belongto_userid%22%3A%2220064%22%2C%22isWorkflowDoc%22%3Afalse%2C%22f_weaver_belongto_usertype%22%3A%220%22%2C%22nodetype%22%3A%220%22%2C%22method%22%3A%22%22%2C%22needoutprint%22%3A%22%22%2C%22src%22%3A%22submit%22%2C%22isMultiDoc%22%3A%22%22%2C%2220064_123_addrequest_submit_token%22%3A1626187617580%2C%22topage%22%3A%22%22%2C%22workflowtype%22%3A%223%22%2C%22iscreate%22%3A%221%22%2C%22comemessage%22%3A%22%22%2C%22remindTypes%22%3A%22%22%2C%22rand%22%3A%22%22%2C%22requestid%22%3A%22-1%22%2C%22linkageUUID%22%3A%229E190F044B9E451F8EA6B4E8F94F3A92%22%2C%22htmlfieldids%22%3A%22%22%2C%22needwfback%22%3A%221%22%2C%22lastloginuserid%22%3A20064%2C%22nodeid%22%3A477%2C%22workflowid%22%3A123%2C%22isbill%22%3A%221%22%2C%22remark%22%3A%22%22%2C%22field-annexupload%22%3A%22%22%2C%22signdocids%22%3A%22%22%2C%22signworkflowids%22%3A%22%22%2C%22remarkLocation%22%3A%22%22%2C%22annexdocids%22%3A%22%22%2C%22annexdocinfos%22%3A%5B%5D%2C%22isOdocRequest%22%3A%220%22%2C%22enableIntervenor%22%3A%22%22%2C%22verifyRequiredRange%22%3A%22field-9999%2Cfield7691_1%2Cfield7692_1%2Cfield7693_1%2Cfield7694_1%2Cfield7696_0%2Cfield11406_1%2C%22%2C%22linkageUnFinishedKey%22%3A%22%22%2C%22remarkquote%22%3A%22%22%2C%22actiontype%22%3A%22requestOperation%22%2C%22isFirstSubmit%22%3A%22%22%2C%22existChangeRange%22%3A%22field7703%2Cfield11406_0%2Cfield7705_0%2Cfield11407_0%2Cfield11406_1%2Cfield7705_1%2Cfield11407_1%2Cfield7691_1%2Cfield7696_0%2Cfield7692_1%2Cfield7693_1%2Cfield7694_1%2Cfield7703%22%2C%22requestname%22%3A%22%E5%B7%A5%E4%BD%9C%E6%97%A5%E6%8A%A5%E4%B8%8E%E8%AE%A1%E5%88%92-%E5%91%A8%E7%AB%A0%E9%94%8B-2021-07-13%22%2C%22requestlevel%22%3A%220%22%2C%22field7671%22%3A%227%22%2C%22field7670%22%3A%2220064%22%2C%22field7673%22%3A%222021-07-13%22%2C%22field7672%22%3A%2268%22%2C%22field-10%22%3A%22%22%2C%22field7703%22%3A%228.0%22%2C%22nodesnum0%22%3A1%2C%22indexnum0%22%3A2%2C%22submitdtlid0%22%3A%221%2C%22%2C%22deldtlid0%22%3A%22%22%2C%22nodesnum1%22%3A1%2C%22indexnum1%22%3A1%2C%22submitdtlid1%22%3A%220%2C%22%2C%22deldtlid1%22%3A%22%22%2C%22mainFieldUnEmptyCount%22%3A5%2C%22detailFieldUnEmptyCount%22%3A8%2C%22field7691_1%22%3A%22%E5%85%A8%E5%9B%BD%E5%9C%B0%E5%8C%BA%E7%82%B9%E5%B1%95%E7%A4%BA%E5%9C%B0%E5%9B%BE%E7%BB%84%E4%BB%B6%E5%B0%81%E8%A3%85%5Cn%E5%85%A8%E5%9B%BD%E5%9C%B0%E5%8C%BA%E7%9C%81%E5%88%86%E5%9C%B0%E5%9B%BE%E5%B1%95%E7%A4%BA%E7%BB%84%E4%BB%B6%E5%B0%81%E8%A3%85%5Cn%E6%9F%B1%E7%8A%B6%E5%9B%BE%E6%BB%9A%E5%8A%A8%E6%9D%A1%E5%B0%81%E8%A3%85%5Cn%22%2C%22field7692_1%22%3A%220%22%2C%22field7693_1%22%3A%2235.0%22%2C%22field7694_1%22%3A%228.0%22%2C%22field7695_1%22%3A%22%22%2C%22field7705_1%22%3A%222411%22%2C%22field11406_1%22%3A%2281%22%2C%22field11406_1name%22%3A%22%E6%95%B0%E6%8D%AE%E5%86%B3%E7%AD%96%E5%AD%90%E7%B3%BB%E7%BB%9F%22%2C%22field11407_1%22%3A%22%E6%99%BA%E6%85%A7%E5%B7%A5%E5%9C%B0%22%2C%22field7696_0%22%3A%22%E6%9F%B1%E7%8A%B6%E5%9B%BE%E6%BB%9A%E5%8A%A8%E6%9D%A1%E8%87%AA%E9%80%82%E5%BA%94%E5%A4%84%E7%90%86%22%2C%22field7697_0%22%3A%22%22%2C%22field7698_0%22%3A%22%22%2C%22signatureAttributesStr%22%3A%22YmVhZ2VudGVyPTB8Y29uZmlnaWQ9LTF8aXNhZ2VudD0wfA%3D%3D%22%2C%22signatureSecretKey%22%3A%22481c0142389a9f3911d7c0326a64889b%22%2C%22selectNextFlow%22%3A%220%22%2C%22wfTestStr%22%3A%22%22%7D&'
    param={
        "formid": -110,
        "f_weaver_belongto_userid": "20064",
        "isWorkflowDoc": false,
        "f_weaver_belongto_usertype": "0",
        "nodetype": "0",
        "method": "",
        "needoutprint": "",
        "src": "submit",
        "isMultiDoc": "",
        "20064_123_addrequest_submit_token": 1626187617580,
        "topage": "",
        "workflowtype": "3",
        "iscreate": "1",
        "comemessage": "",
        "remindTypes": "",
        "rand": "",
        "requestid": "-1",
        "linkageUUID": "9E190F044B9E451F8EA6B4E8F94F3A92",
        "htmlfieldids": "",
        "needwfback": "1",
        "lastloginuserid": 20064,
        "nodeid": 477,
        "workflowid": 123,
        "isbill": "1",
        "remark": "",
        "field-annexupload": "",
        "signdocids": "",
        "signworkflowids": "",
        "remarkLocation": "",
        "annexdocids": "",
        "annexdocinfos": [],
        "handWrittenSign":'',
        "isOdocRequest": "0",
        "enableIntervenor": "",
        "verifyRequiredRange": "field-9999,field7691_1,field7692_1,field7693_1,field7694_1,field7696_0,field11406_1,",
        "linkageUnFinishedKey": "",
        "remarkquote": "",
        "actiontype": "requestOperation",
        "isFirstSubmit": "",
        "existChangeRange": "field7703,field11406_0,field7705_0,field11407_0,field11406_1,field7705_1,field11407_1,field7691_1,field7696_0,field7692_1,field7693_1,field7694_1,field7703",
        "requestname": "工作日报与计划-周章锋-2021-07-13",
        "requestlevel": "0",
        "field7671": "7",
        "field7670": "20064",
        "field7673": "2021-07-13",
        "field7672": "68",
        "field-10": "",
        "field7703": "8.0",
        "nodesnum0": 1,
        "indexnum0": 2,
        "submitdtlid0": "1,",
        "deldtlid0": "",
        "nodesnum1": 1,
        "indexnum1": 1,
        "submitdtlid1": "0,",
        "deldtlid1": "",
        "mainFieldUnEmptyCount": 5,
        "detailFieldUnEmptyCount": 8,
        "field7691_1": "全国地区点展示地图组件封装\n全国地区省分地图展示组件封装\n柱状图滚动条封装\n",
        "field7692_1": "0",
        "field7693_1": "35.0",
        "field7694_1": "8.0",
        "field7695_1": "",
        "field7705_1": "2411",
        "field11406_1": "81",
        "field11406_1name": "数据决策子系统",
        "field11407_1": "智慧工地",
        "field7696_0": "柱状图滚动条自适应处理",
        "field7697_0": "",
        "field7698_0": "",
        "signatureAttributesStr": "YmVhZ2VudGVyPTB8Y29uZmlnaWQ9LTF8aXNhZ2VudD0wfA==",
        "signatureSecretKey": "481c0142389a9f3911d7c0326a64889b",
        "selectNextFlow": "0",
        "wfTestStr": "",
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