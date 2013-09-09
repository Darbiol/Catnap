$(document).ready(function(){

	$('#username').change(function (event){
		var uname = document.signup.uname.value;
		$.post('/checkUser', {uname: uname },function (res){
			if(res.result==0){//ok to submit
				console.log("username is available to use")
			}else{//already exist
				alert("Username already Exist!");
				$('#username').focus();
				$('#username').val('');
			}
		});
	});
});