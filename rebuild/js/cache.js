//获取添加时间
function createTime(){
    return parseInt(new Date().getTime() / 1000)
}
//设置缓存主函数
function cache(key,value,expire){
    //默认5个小时60*60*5
    if(value){
        //设置缓存
        setLocalData(key,value,expire)
    }else{
        //取缓存
        return getLocalData(key)
    }
}
//设置数据
function setLocalData(key,value,expire){
    window.localStorage.setItem(key, value)
    if(expire){
        window.localStorage.setItem(key+'_expire', createTime()+expire)
    }

}
//获取数据
function getLocalData(key){
    let oldexpire=window.localStorage.getItem(key+'_expire')
    let newexpire=createTime()
    if(oldexpire&&oldexpire-newexpire<0){
        //已过期
        window.localStorage.removeItem(key)
        window.localStorage.removeItem(key+'_expire')
        return false
    }else{
        //在有效期内
        let data=window.localStorage.getItem(key)
        try {
            return JSON.parse(data)
        }catch (_){
            return data
        }
    }
}