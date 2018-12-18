$(document).ready(function() {
    //login scripts
    $('#wrapper').on('click','#btnLogin', function() {
        var uname = $('#inputEmail').val();
        var password = $('#inputPassword').val();
        var validation = '0';
        if(uname=="")
            validation = '1';
        if(password=="")
            validation= '1';

        if(validation=='0'){
            $.ajax({
            type: "POST",
            url: 'ajax/checklogin',
            data: {
                'username' : uname , 'password' : password , 'csrfmiddlewaretoken' : $('input[name="csrfmiddlewaretoken"]').val()
            },
            dataType: 'json',
            success: function (data) {
               
                if(data.flag == 1){
                    if(data.result==1)
                        window.location='admin'
                    if(data.result==2)
                        window.location='user'
                }
             if(data.flag == 0){
                    $('#lbllogchk').text("Invalid uers credentials")
                }
            },
            error: function (jqXHR, exception) {
             alert("Ajax loading Error");
            }
          });
        }
        else{
        return false;
        }
    });
    var capcha = "";
    $('#wrapper').on('click','#btnNext', function(){
        
        capcha ="";
        var user_id = $('#uid').val();
        var user_name = $('#uname').val();
        var user_mail = $('#uemail').val();
        var user_password = $('#upassword').val();
        var user_cpassword = $('#ucpassword').val();
        var user_phone = $('#uphone').val();
        var user_role = 2
        var validation = '0';
        if(user_name == ""){
            $('#uname').parent('div').addClass('has-error')
            validation = '1';
        }
        if(user_mail == ""){
            $('#uemail').parent('div').addClass('has-error')
            validation = '1';
        }
        if(user_password == ""){
            $('#upassword').parent('div').addClass('has-error')
            validation = '1';
        }
        if(user_cpassword == ""){
            $('#ucpassword').parent('div').addClass('has-error')
            validation = '1';
        }
        if(user_password != user_cpassword){
              $('#upassword').parent('div').addClass('has-error')
              $('#ucpassword').parent('div').addClass('has-error')
              validation = '1';
        }
        if(user_phone == ""){
            $('#uphone').parent('div').addClass('has-error')
            validation = '1';
        }
        if(validation=='0'){
            $('#btnNext').hide();
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
                        $('#btnNext').show();
                    }
                    if(data.flag == 1){
                        $.ajax({
                        type: "POST",
                        url: 'ajax/sendemail',
                        data: {
                            'email' : user_mail , 'csrfmiddlewaretoken' : $('input[name="csrfmiddlewaretoken"]').val()
                        },
                        dataType: 'json',
                        success: function (data) {
                            if(data.flag == 0){
                                $('#uemail').parent('div').addClass('has-error')
                                alert("Ivalid Email")
                                $('#btnNext').show();
                            }
                            if(data.flag == 1){
                                capcha=data.result;
                                $('#detaildiv').slideUp();
                                $('#codediv').show();
                                $('#btnRegister').show();
                                $('#btnBack').show();
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
            return false;
        }

    });

     $('#wrapper').on('click','#btnBack', function(){
        capcha ="";
        $('#detaildiv').slideDown();
        $('#codediv').hide();
        $('#btnRegister').hide();
        $('#btnNext').show();
        $('#btnBack').hide();
     });

    $('#wrapper').on('click','#btnRegister', function(){
        var user_id = $('#uid').val();
        var user_name = $('#uname').val();
        var user_mail = $('#uemail').val();
        var user_password = $('#upassword').val();
        var user_cpassword = $('#ucpassword').val();
        var user_phone = $('#uphone').val();
        var user_role = 2
        var ucode = $('#ucode').val();
        if(ucode == ""){
            alert("Enter code")
            return false;
        }
        if(ucode == capcha)
           {
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
                        window.location='login';
                    }
                },
                error: function (jqXHR, exception) {
                    alert("Ajax loading Error");
                }
                });
           }
        else{
         alert("Captcha Error")
        }
    });
 });