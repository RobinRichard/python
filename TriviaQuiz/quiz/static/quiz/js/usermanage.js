$(document).ready(function() {

    //User Management Scripts
    $('#wrapper').on('click','.adduser', function(){
        $('#uid').val("")
        $('#uname').val("");
        $('#uemail').val("");
        $('#upassword').val("");
        $('#uphone').val("");
        $('#utype').val("");
        $('#userModal').modal({backdrop: 'static', keyboard: false});
    });


    $.ajax({
            type: "POST",
            url: 'ajax/getuser',
            data: {
                'user_id' : '' ,'csrfmiddlewaretoken' : $('input[name="csrfmiddlewaretoken"]').val()
            },
            dataType: 'json',
            success: function (data) {
                if(data.flag == 0)
                    alert(data.result)
                if(data.flag == 1){
                 var object = JSON.parse(data.result)
                 var str = ''
                  $.each(object, function(i,element){
                    var role = element['fields'].user_role=='1'?"admin":"user";
                    str += '<tr class="odd gradeX"><td>'+element['fields'].user_name+'</td>';
                    str += '<td>'+element['fields'].user_mail+'</td>';
                    str += '<td>'+element['fields'].user_phone +'</td>';
                    str += '<td>'+role+'</td>';
                    str += '<td><div class="text-center"><a  class="btn btn-social-icon btn-facebook edituser" data-id="'+element['pk']+'"><i class="fa fa-pencil"></i></a><a class="btn btn-social-icon btn-pinterest deleteuser" data-name="'+element['fields'].user_name+'" data-id="'+element['pk']+'"><i class="fa fa-trash-o"></i></a></div></td></tr>';
                    });
                     $('#usertable').append(str);
                     $('#usertable').DataTable({
                        responsive: true
                     });
                }
            },
            error: function (jqXHR, exception) {
             alert("Ajax loading Error");
            }
     });

    $('#wrapper').on('click','#userSave', function(){
        var user_id = $('#uid').val();
        var user_name = $('#uname').val();
        var user_mail = $('#uemail').val();
        var user_password = $('#upassword').val();
        var user_phone = $('#uphone').val();
        var user_role = $('#utype').val();
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
                url: 'ajax/checkemail',
                data: {
                    'email' : user_mail , 'csrfmiddlewaretoken' : $('input[name="csrfmiddlewaretoken"]').val()
                },
                dataType: 'json',
                success: function (data) {
                    if(data.flag == 0){
                        $('#uemail').parent('div').addClass('has-error')
                        alert("Email already Exist")
                    }
                    if(data.flag == 1){
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
                            if(data.flag == 1){
                                alert(data.result)
                                $('#userModal').modal('hide');
                                window.location='manageuser';
                            }
                        },
                        error: function (jqXHR, exception) {
                        alert("Ajax loading Error");
                        }
                    });
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

     $('#wrapper').on('click','.edituser', function(){
         var id = $(this).attr('data-id');
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
                        $('#uid').val(id);
                        $('#uname').val(object[0]['fields'].user_name);
                        $('#uemail').val(object[0]['fields'].user_mail);
                        $('#upassword').val(object[0]['fields'].user_password);
                        $('#uphone').val(object[0]['fields'].user_phone);
                        $('#utype').val(object[0]['fields'].user_role);
                        $('#userModal').modal({backdrop: 'static', keyboard: false});
                    }
                },
                error: function (jqXHR, exception) {
                 alert("Ajax loading Error");
                }
         });
        });

//delete user
    $('#wrapper').on('click','.deleteuser', function(){
     var id = $(this).attr('data-id');
     var name = $(this).attr('data-name');
     $.confirm({
        title: 'Sure!',
        content: 'You want to delete user "'+name+'"',
        type: 'dark',
        typeAnimated: true,
        buttons: {
            tryAgain: {
                text: 'Delete',
                btnClass: 'btn-red',
                action: function(){
                      $.ajax({
                        type: "POST",
                        url: 'ajax/deleteuser',
                        data: {
                            'user_id' : id ,'csrfmiddlewaretoken' : $('input[name="csrfmiddlewaretoken"]').val()
                        },
                        dataType: 'json',
                        success: function (data) {
                            if(data.flag == 0)
                            $.confirm({
                            title: 'Warning!',
                            content: data.result,
                            buttons: {
                                Ok: function () {
                                }
                            }
                            });
                            if(data.flag == 1){
                                $.confirm({
                                title: 'Success',
                                content: 'User "' +name+'" deleted',
                                buttons: {
                                    Ok: function () {
                                        window.location='manageuser';
                                    }
                                }
                            });
                            }
                        },
                        error: function (jqXHR, exception) {
                        alert("Ajax loading Error");
                        }
                });
                }
            },
            close: function () {
            }
        }
    });
});
});