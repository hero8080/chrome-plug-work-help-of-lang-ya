if(localStorage.getItem('hello')){

}else{
	localStorage.setItem('hello','hello')
}
try{
	document.getElementById('box').innerHTML=localStorage.getItem('hello')
}catch (e){}