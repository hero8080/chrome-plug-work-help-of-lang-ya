//全局缓存的请求
let requests=[]

//全局请求链接
function xhr(isGetData,_this){
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
        if(_this&&isGetData&&_this[isGetData]){
            _this[isGetData]=false
        }
        return new Promise((resolve,reject)=>{
            oxhr.addEventListener("error",   oEvent=> {
                if(_this&&isGetData){
                    _this[isGetData]=true
                }
                console.log('断网了')
                console.log(oEvent)
                this.removeRequest(sendUrl)
                reject(oEvent)
            });
            oxhr.addEventListener("abort",  oEvent=> {
                if(_this&&isGetData){
                    _this[isGetData]=true
                }
                console.log('取消了')
                console.log(oEvent)
                this.removeRequest(sendUrl)
                reject(oEvent)

            });
            oxhr.addEventListener("readystatechange",  oEvent=>{
                if ( oxhr.readyState == 4 ) {
                    this.removeRequest(sendUrl)
                    if(_this&&isGetData){
                        _this[isGetData]=true
                    }
                    if ( oxhr.status == 200 ) {
                        // console.log(oxhr.responseText)
                        let result=JSON.parse(oxhr.responseText)
                        if(result.errorCode=='002'){
                            _this.$message({
                                message: result.msg,
                                type: 'warning',
                                duration:3000
                            })
                        }
                        resolve(result)
                    } else {
                        console.log(oxhr.status)
                        reject(oEvent)
                    }

                }
            });
            oxhr.addEventListener("timeout",  oEvent=>{
                if(_this&&isGetData){
                    _this[isGetData]=true
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
            oxhr.open(method,sendUrl);
            if (method.toLowerCase() == 'get') {
                oxhr.send();
            } else {
                oxhr.setRequestHeader('content-type', 'application/x-www-form-urlencoded');
                // oxhr.setRequestHeader('content-type', 'application/json');
                console.log(sendUrl)
                console.log(getUrl)
                oxhr.send(getUrl);
            }
        })
    }
}

//get方法
async function get(url,param,isGetData,_this,method='get'){
    //判断又没有公钥
    if(!cache('pubRsaKey')){
        let pubRsaKey=await new xhr().get('rsa/weaver.rsa.GetRsaInfo')
        cache('pubRsaKey',JSON.stringify(pubRsaKey))
    }
    if(isString(param)){
        _this=isGetData
        isGetData=param
        param= {}
    }
    if(url=='api/hrm/login/checkLogin'){
        param.loginid = rsaDataEncrypt(param.loginid)
        param.userpassword = rsaDataEncrypt(param.userpassword)
    }
    if(method.toLowerCase()=='get'){
        return new xhr(isGetData,_this).get(url,param)
    }
    if(method.toLowerCase()=='post'){
        return new xhr(isGetData,_this).post(url,param)
    }
}

//post
function post(url,param,isGetData,_this){
   return get(url,param,isGetData,_this,'post')
}

//登录
function  login(param,isGetData,_this){
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
    return post('api/hrm/login/checkLogin',_param,isGetData,_this)
}

//获取账户
function getAccountList(param,isGetData,_this){
    return get('api/hrm/login/getAccountList',param,isGetData,_this)
}


