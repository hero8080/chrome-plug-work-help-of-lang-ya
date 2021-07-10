if(localStorage.getItem('hello')){

}else{
	localStorage.setItem('hello','hello')
}
document.getElementById('box').innerHTML=localStorage.getItem('hello')