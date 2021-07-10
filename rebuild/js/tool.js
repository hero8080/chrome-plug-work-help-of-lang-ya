function isNumber(value){
    let new_value=parseFloat(value)
    return new_value==value&&(typeof new_value=='number')&&new_value.constructor==Number;
}
function isString(value){
    return (typeof value=='string')&&value.constructor==String;
}
function isArray(value){
    return (typeof value=='object')&&value.constructor==Array;
}
function isObject(value){
    return (typeof value=='object')&&value.constructor==Object
}
function empty(value){
    if(value==null||value===''||value==undefined||(isArray(value)&&value.length==0)||(isObject(value)&&Object.keys(value).length==0)||JSON.stringify(value)=='{}'){
        return true
    }else{
        return false
    }
}

function getCookie(key) {
    let cookie = document.cookie
    //  第一次分割
    let  items = cookie.split(";")
    let result=''
    items.map(item=>{
        //  第二次分割
        let kv = item.split('=');
        console.log(kv[0].trim()+':'+kv[1].trim())
        if(kv[0].trim()==key){
            result=kv[1].trim()
        }
    })
    return result
}