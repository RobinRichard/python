
$(document).ready(function() {
//User Tournament scripts

    $.ajax({
            type: "POST",
            url: 'ajax/gettournament',
            data: {
                'tournament_id' : '' ,'csrfmiddlewaretoken' : $('input[name="csrfmiddlewaretoken"]').val()
            },
            dataType: 'json',
            success: function (data) {
                if(data.flag == 0){
                    $.confirm({
                                title: 'Warning',
                                content: data.result,
                                buttons: {
                                    Ok: function () {
                                    }
                                }
                            });
                }
                if(data.flag == 1){
                 var object = JSON.parse(data.result)
                 var str = ''
                  $.each(object, function(i,element){
                    str += '<tr class="odd gradeX"><td>'+element['fields'].tournament_name+'</td>';
                    str += '<td>'+element['fields'].tournament_start_date+'</td>';
                    str += '<td>'+element['fields'].tournament_end_date +'</td>';
                    str += '<td>'+element['fields'].tournament_high_score+'</td>';
                    str += '<td><div class="text-center"><a  class="btn btn-social-icon btn-facebook play" data-id="'+element['pk']+'"><i class="fa fa-play"></i></a></div></td></tr>';
                    });
                     $('#gametable').append(str);
                     $('#gametable').DataTable({
                        responsive: true
                     });
                }
            },
            error: function (jqXHR, exception) {
             alert("Ajax loading Error");
            }
     });

    $('#wrapper').on('click','.play', function(){

         var tournament_id = $(this).attr('data-id');
         $('#quiz_close').hide();
         $( "#score" ).html("")
         var qobject=null;
         var qans=null;
         var qus=null;
         var qindex=0;
         var mark=0;
         var useranswers=[];

             $.ajax({
                type: "POST",
                url: 'ajax/getgame',
                data: {
                    'tournament_id' : tournament_id,'user_id': $('#gameuser').val() ,'csrfmiddlewaretoken' : $('input[name="csrfmiddlewaretoken"]').val()
                },
                dataType: 'json',
                success: function (data) {
                    if(data.flag == 0){
                         $.confirm({
                                title: 'Warning',
                                content: data.result,
                                buttons: {
                                    Ok: function () {
                                    }
                                }
                            });
                    }
                    if(data.flag == 1){
                      var object = JSON.parse(data.result);
                      var questions = object[0]['fields'].tournament_question;
                      var qstr = questions.replace(/'/g, '"');
                      qobject = JSON.parse(qstr);
                      $('#gameModal').modal({backdrop: 'static', keyboard: false});
                      loadquestion();
                     }
                     if(data.flag == 2){
                       $('#gameModal').modal({backdrop: 'static', keyboard: false});
                       loadpastresult(data.result,data.score)
                     }
                     if(data.flag == 3){
                           $.confirm({
                                title: 'Warning',
                                content: data.result,
                                type: 'dark',
                                typeAnimated: true,
                                buttons: {
                                    Ok: function () {
                                    }
                                }
                            });
                     }
                },
                error: function (jqXHR, exception) {
                 alert("Ajax loading Error");
                }
            });


              var loading = $('#loadbar').hide();
                $(document)
                .ajaxStart(function () {
                    loading.show();
                }).ajaxStop(function () {
                    loading.hide();
                });

            $('#wrapper').on('click','label.btn', function(){
                var choice = $(this).find('input:radio').val();
                $('#loadbar').show();
                $('#quiz').fadeOut();
                var obj = {}
                obj['question'] = qus;
                obj['answer'] = qans
                obj['useranswer'] = choice
                useranswers.push(obj);
                setTimeout(function(){
                   $( "#answer" ).html("Previous Answer : "+$(this).checking(choice));
                   $( "#score" ).html("Your Score : "+mark+" / "+"10");
                   if(qindex<9){
                        qindex = qindex+1;
                        loadquestion()
                   }
                   else{
                        loadresult()
                   }

                   /* something else */
                }, 1500);
            });


            $.fn.checking = function(ck) {
                if (ck != qans)
                    return 'INCORRECT';
                else{
                    mark++;
                    return 'CORRECT';
                }
            };

        function loadquestion(){
         $('#qes').text(decodeString(qobject[qindex].question))
         $('#qid').text((qindex+1))
         qus=decodeString(qobject[qindex].question)
         qans=decodeString(qobject[qindex].correct_answer)
         var options = qobject[qindex].incorrect_answers
         options.push(qobject[qindex].correct_answer)
         options = shuffle(options);
         var str=''
         $.each(options, function( index, value ) {
          str += '<label class="element-animation1 btn btn-lg btn-primary btn-block"><span class="btn-label"><i class="glyphicon glyphicon-chevron-right"></i></span> <input type="radio" name="q_answer" value="'+ decodeString(value)+'">'+ decodeString(value)+'</label>'
        });
        $('#quiz').html(str);
        $('#quiz').show();
        $('#loadbar').fadeOut();
        }

        function loadresult(){
            $.ajax({
            type: "POST",
            url: 'ajax/addgame',
            data: {
                'game_tournament' : tournament_id ,
                'game_user' : $('#gameuser').val() ,
                'game_answer' : JSON.stringify(useranswers) ,
                'game_score' : mark ,
                'csrfmiddlewaretoken' : $('input[name="csrfmiddlewaretoken"]').val()
            },
            dataType: 'json',
            success: function (data) {
                if(data.flag == 0){
                      $.confirm({
                                title: 'Warning',
                                content: data.result,
                                type: 'dark',
                                typeAnimated: true,
                                buttons: {
                                    Ok: function () {
                                    }
                                }
                            });
                }
                if(data.flag == 1){
                    $('#qes').text("Result");
                    $('#qid').text("");
                    var str='<h4>you successfully finished this Tournament</h4><br><span>Your score :'+mark+'</span>';
                    $('#quiz').html(str);
                    $('#quiz_close').show();
                    $( "#answer" ).html("");
                    $( "#score" ).html("")
                    $('#quiz').show();
                    $('#loadbar').fadeOut();
                }
                if(data.flag == 2){
                    $('#qes').text("congratulation");
                    $('#qid').text("");
                    var str='<h4>you got high score in this Tournament</h4><br><span>Your score :'+mark+'</span>';
                    $('#quiz').html(str);
                    $('#quiz_close').show();
                    $( "#answer" ).html("");
                    $( "#score" ).html("")
                    $('#quiz').show();
                    $('#loadbar').fadeOut();
                }
            },
            error: function (jqXHR, exception) {
             alert("Ajax loading Error");
            }
          });
        }

        function loadpastresult(answer,score){
            console.log(score)
            var obj = JSON.parse(answer)
            console.log(obj)
            $('#qes').text("Already Participated");
            $('#qid').text("");
            var str='<div class="panel-body"><h4>Your Answers :</h4>';
            var i=1;
            obj.forEach(function(element) {
                str += '<h5>'+(i++) +' . '+decodeString(element.question)+'</h5>';
                str += ' <ul class="list-inline"><li>Correc Answer : '+element.answer+'</li> ';
                str += ' <li class="ml-1 mr-1">Your Answer : '+element.useranswer+'</li> ';
                if(element.answer == element.useranswer)
                    str += ' <li>Result :<span class="text-success"> <p class="fa fa-check"></p></span></li></ul>';
                else
                     str += ' <li>Result :<span class="text-danger"> <p class="fa fa-times"></p></span></li></ul>'; 
            });
            str += '</div>'
            $('#quiz').html(str);
            $('#quiz_close').show();
            $( "#answer" ).html("");
            $( "#score" ).html("Your Score : "+score)
            $('#quiz').show();
            $('#loadbar').fadeOut();
        }


    });

     $('#wrapper').on('click','#quiz_close', function(){
          $('#gameModal').modal('hide');
          window.location='game';
     });
});
    