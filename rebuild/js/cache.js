//获取添加时间
function createTime(){
    return parseInt(new Date().getTime() / 1000)
}
//设置缓存主函数
function cache(key,value,expire=60*60*5){
    //默认5个小时
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
    localStorage.setItem(key, value)
    localStorage.setItem(key+'_expire', createTime()+expire)
}
//获取数据
function getLocalData(key){
    let oldexpire=localStorage.getItem(key+'_expire')
    if(!oldexpire||oldexpire==''){
        return false
    }
    let newexpire=createTime()
    console.log(oldexpire,newexpire,oldexpire-newexpire)
    if(oldexpire-newexpire<=0){
        //已过期
        localStorage.removeItem(key)
        localStorage.removeItem(key+'_expire')
        return false
    }else{
        //在有效期内
        let data=localStorage.getItem(key)
        try {
            return JSON.parse(data)
        }catch (_){
            return data
        }

    }
}