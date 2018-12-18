
//shuffle the answer options
function shuffle(arra1) {
var ctr = arra1.length, temp, index;

// While there are elements in the array
    while (ctr > 0) {
// Pick a random index
        index = Math.floor(Math.random() * ctr);
// Decrease ctr by 1
        ctr--;
// And swap the last element with it
        temp = arra1[ctr];
        arra1[ctr] = arra1[index];
        arra1[index] = temp;
    }
    return arra1;
}

//To Decode special characters
function decodeString(encodedString) {
var textArea = document.createElement('textarea');
textArea.innerHTML = encodedString;
return textArea.value;
}


 $('#wrapper').on('keyup','.rmValErr', function(){
        if($(this).parent('div').hasClass('has-error')){
                 $(this).parent('div').removeClass('has-error')
        }   
 });

 $('#wrapper').on('click','.userprofile', function(){
         var id = $(this).attr('data-id');
         $('#upemail').prop("disabled", true);
            $.ajax({
                type: "POST",
                url: 'ajax/getuser',
                data: {
                    'user_id' : id ,'csrfmiddlewaretoken' : $('input[name="csrfmiddlewaretoken"]').val()
                },
                dataType: 'json',
                success: function (data) {
                    if(data.flag == 0)
                        alert(data.result)
                    if(data.flag == 1){
                     var object = JSON.parse(data.result)
                        $('#upid').val(id);
                        $('#uptype').val(object[0]['fields'].user_role);
                        $('#upname').val(object[0]['fields'].user_name);
                        $('#upemail').val(object[0]['fields'].user_mail);
                        $('#uppassword').val(object[0]['fields'].user_password);
                        $('#upphone').val(object[0]['fields'].user_phone);
                        $('#profileModal').modal({backdrop: 'static', keyboard: false});
                    }
                },
                error: function (jqXHR, exception) {
                 alert("Ajax loading Error");
                }
         });           
 });
 
 

  $('#wrapper').on('click','#userProfileSave', function(){
        var user_id = $('#upid').val();
        var user_name = $('#upname').val();
        var user_mail = $('#upemail').val();
        var user_password = $('#uppassword').val();
        var user_phone = $('#upphone').val();
        var user_role = $('#uptype').val();
        var validation = '0';
        if(user_name == "")
            validation = '1';
        if(user_mail == "")
            validation = '1';
        if(user_password == "")
            validation = '1';
        if(user_phone == "")
            validation = '1';
        if(user_role == "")
           user_role = '1';

        if(validation=='0'){
           $.ajax({
                type: "POST",
                url: 'ajax/adduser',
                data: {
                        'id' : user_id,
                        'user_name' : user_name ,
                        'user_mail' : user_mail ,
                        'user_password' : user_password ,
                        'user_phone' : user_phone ,
                        'user_role' : user_role ,
                        'csrfmiddlewaretoken' : $('input[name="csrfmiddlewaretoken"]').val()
                },
                dataType: 'json',
                success: function (data) {
                        if(data.flag == 0)
                                 alert(data.result)
                                 location.reload();
                        if(data.flag == 1){
                                alert(data.result)
                                $('#profileModal').modal('hide');
                                location.reload();
                        }
                },
                error: function (jqXHR, exception) {
                alert("Ajax loading Error");
                }
                });
        }
        else{
        alert('Enter All Fields')
        }
    });


 $(document).ready(function() {
    var id = $('#upro').attr('data-id');
    $.ajax({
        type: "POST",
        url: 'ajax/getcount',
        data: {
            'user_id' : id ,'csrfmiddlewaretoken' : $('input[name="csrfmiddlewaretoken"]').val()
        },
        dataType: 'json',
        success: function (data) {
            if(data.flag == 0)
                console.log(data.result)
            if(data.flag == 1){
                $('#ucount').html(data.user)
                $('#tcount').html(data.tournament)
            }
        },
        error: function (jqXHR, exception) {
            alert("Ajax loading Error");
        }
    });  
 });