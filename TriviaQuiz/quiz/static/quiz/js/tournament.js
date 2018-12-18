$(document).ready(function() {

    //Tournament Scripts
    $('#wrapper').on('click','.addtournament', function(){
        $('#tid').val("");
        $('#tname').val("");
        $('#tsdate').val("");
        $('#tedate').val("");
        $('#tcategory').val("any");
        $('#tdifficulty').val("any");
        $('input').prop("disabled", false);
        $('select').prop("disabled", false);
        $('#tournamentModal').modal({backdrop: 'static', keyboard: false});
    });

    $('#wrapper').on('click','#tornamentSave', function(){
        tournament_id = $('#tid').val();
        tournament_name = $('#tname').val();
        tournament_start_date = $('#tsdate').val();
        tournament_end_date = $('#tedate').val();
        tournament_category = $('#tcategory').val();
        tournament_difficulty = $('#tdifficulty').val();
        var validation = '0';
        if(tournament_name=="")
            validation = '1';
        if(tournament_start_date=="")
            validation= '1';
        if(tournament_end_date=="")
            validation= '1';

        if(validation=='0'){

            $.ajax({
            type: "POST",
            url: 'ajax/addtournament',
            data: {
                'id' : tournament_id,
                'tournament_name' : tournament_name ,
                'tournament_start_date' : tournament_start_date ,
                'tournament_end_date' : tournament_end_date ,
                'tournament_category' : tournament_category ,
                'tournament_difficulty' : tournament_difficulty ,
                'csrfmiddlewaretoken' : $('input[name="csrfmiddlewaretoken"]').val()
            },
            dataType: 'json',
            success: function (data) {
                console.log(data)
                if(data.flag == 0)
                    alert(data.result)
                if(data.flag == 1){
                    alert(data.result)
                    $('#tournamentModal').modal('hide');
                    window.location='tournament';
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

    $.ajax({
            type: "POST",
            url: 'ajax/gettournament',
            data: {
                'tournament_id' : '' ,'csrfmiddlewaretoken' : $('input[name="csrfmiddlewaretoken"]').val()
            },
            dataType: 'json',
            success: function (data) {
                if(data.flag == 0)
                    alert(data.result)
                if(data.flag == 1){
                 var object = JSON.parse(data.result)
                 var str = ''
                  $.each(object, function(i,element){
                    str += '<tr class="odd gradeX"><td>'+element['fields'].tournament_name+'</td>';
                    str += '<td>'+element['fields'].tournament_start_date+'</td>';
                    str += '<td>'+element['fields'].tournament_end_date +'</td>';
                    str += '<td>'+element['fields'].tournament_high_score+'</td>';
                    str += '<td><div class="text-center"><a  class="btn btn-social-icon btn-facebook edittournament" data-id="'+element['pk']+'"><i class="fa fa-pencil"></i></a><a class="btn btn-social-icon btn-pinterest deletetournament" data-name="'+element['fields'].tournament_name+'" data-id="'+element['pk']+'"><i class="fa fa-trash-o"></i></a></div></td></tr>';
                    });
                     $('#tournamenttable').append(str);
                     $('#tournamenttable').DataTable({
                        responsive: true
                     });
                }
               
            },
            error: function (jqXHR, exception) {
             alert("Ajax loading Error");
            }
     });

    $('#wrapper').on('click','.edittournament', function(){
     var id = $(this).attr('data-id');
     $('input').prop("disabled", false);
     $('select').prop("disabled", false);
     $.ajax({
            type: "POST",
            url: 'ajax/gettournament',
            data: {
                'tournament_id' : id ,'csrfmiddlewaretoken' : $('input[name="csrfmiddlewaretoken"]').val()
            },
            dataType: 'json',
            success: function (data) {
                if(data.flag == 0)
                    alert(data.result)
                if(data.flag == 1){
                    var object = JSON.parse(data.result)
                    $('#tid').val(id);
                    $('#tname').val(object[0]['fields'].tournament_name);
                    $('#tsdate').val(object[0]['fields'].tournament_start_date);
                    $('#tedate').val(object[0]['fields'].tournament_end_date);
                    $('#tcategory').val(object[0]['fields'].tournament_category);
                    $('#tdifficulty').val(object[0]['fields'].tournament_difficulty);
                    $('#tournamentModal').modal({backdrop: 'static', keyboard: false});
                }
                 if(data.flag == 2){
                    var object = JSON.parse(data.result)
                    $('#tid').val(id);
                    $('#tname').val(object[0]['fields'].tournament_name);
                    $('#tsdate').val(object[0]['fields'].tournament_start_date);
                    $('#tedate').val(object[0]['fields'].tournament_end_date);
                    $('#tcategory').val(object[0]['fields'].tournament_category);
                    $('#tdifficulty').val(object[0]['fields'].tournament_difficulty);
                    $('#tsdate').attr('disabled', 'disabled');
                    $('#tcategory').attr('disabled', 'disabled');
                    $('#tdifficulty').attr('disabled', 'disabled');
                    $('#tournamentModal').modal({backdrop: 'static', keyboard: false});
                }
            },
            error: function (jqXHR, exception) {
             alert("Ajax loading Error");
            }
     });
    });

    //delete tournament
    $('#wrapper').on('click','.deletetournament', function(){
     var id = $(this).attr('data-id');
     var name = $(this).attr('data-name');
     $.confirm({
        title: 'Sure!',
        content: 'You want to delete tournament "'+name+'"',
        type: 'dark',
        typeAnimated: true,
        buttons: {
            tryAgain: {
                text: 'Delete',
                btnClass: 'btn-red',
                action: function(){
                      $.ajax({
                        type: "POST",
                        url: 'ajax/deletetournament',
                        data: {
                            'tournament_id' : id ,'csrfmiddlewaretoken' : $('input[name="csrfmiddlewaretoken"]').val()
                        },
                        dataType: 'json',
                        success: function (data) {
                            if(data.flag == 0){
                                $.confirm({
                                title: 'Warning!',
                                content: data.result,
                                buttons: {
                                    Ok: function () {
                                    }
                                }
                                });
                            }
                            if(data.flag == 1){
                                $.confirm({
                                title: 'Success',
                                content: 'Tournament "' +name+'" deleted',
                                buttons: {
                                    Ok: function () {
                                        window.location='tournament';
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
    // get all categories
    $.ajax({
        type: "GET",
        url: 'https://opentdb.com/api_category.php',
        dataType: 'json',
        success: function (data) {
          var str = ''
          $.each(data.trivia_categories, function(i,element){
            console.log();
            str += '<option value="'+ element.id+'">'+ element.name+'</option>'
          });
          $('#tcategory').append(str)
        },
        error: function (jqXHR, exception) {
         alert("Ajax loading Error");
        }
    });

});

