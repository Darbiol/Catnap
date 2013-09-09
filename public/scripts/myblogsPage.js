$(document).ready(function(){

var isInside = false;

$('#confirm').hover(function(){ 
        mouse_is_inside=true; 
    }, function(){ 
        mouse_is_inside=false; 
    });

$("body").mouseup(function(){ 
    if(! isInside) $('#confirm').addClass('hidden');
});


	$('span').click(function(e){
		$(this).hide();
		if($(this).next().attr('id') == "password"){
			$(this).next().attr('type', 'password').show();
			$(this).next().val($(this).html());
			$(this).next().focus();
		}else{
			$(this).next().attr('type', 'text').show();
			$(this).next().val($(this).html());
			$(this).next().focus();
		}
		
	});

	$('.upProf').focusout(function(){
		var field = $(this).attr('id');
		var update = $(this).val();
		updateProf(field, update);
		$(this).hide();
		if($(this).attr('type') == "password"){
			$(this).prev().attr('type', 'hidden');
			$(this).prev().html("*******");
			$(this).prev().show();
		}else{
			$(this).prev().attr('type', 'hidden');
			$(this).prev().html($(this).val());
			$(this).prev().show();
		}
		
	});

	$('.clicked').click(function (){
		console.log("clicked")
		$('#confirm').removeClass('hidden');

		var h_ref=$(this).attr('id');
		$('#viewRef').attr('href', h_ref);
		var ref = h_ref.split('/').pop();
		$('#delButt').attr('placeholder', ref);

	});

	$('#delButt').click(function(){
		var thisId = $(this).attr('placeholder');
		deleteBlog(thisId);
	});

})





function updateProf(field, update){
	$.ajax({
	  type: "POST",
	  url: '/userUpdate' ,
	  data: {field: field, update: update},
	});
}

function deleteBlog(id){
	$.ajax({
	  type: "POST",
	  url: '/blogDelete' ,
	  data: {blogId: id},
	  complete: function (){
	  		window.location.reload();
	  }
	});
}