from django.http import HttpResponse
from django.http import HttpResponseRedirect
from django.core import serializers
from django.shortcuts import render
from .models import *
from django.core.mail import EmailMessage
from datetime import date
from django.utils.crypto import get_random_string
import requests
import json

#Decorative to check admin access
def admin_access(function):
    def wrap(request, *args, **kwargs):
        admin = request.session['user_role']
        if admin is not None and admin == 1:
             return function(request, *args, **kwargs)
        else:
            return HttpResponseRedirect('login')
    return wrap

#Decorative to check User access
def user_access(function):
    def wrap(request, *args, **kwargs):
        user = request.session['user_role']
        if user is not None and user == 2:
             return function(request, *args, **kwargs)
        else:
            return HttpResponseRedirect('login')
    return wrap

def login(request):
    return render(request, 'quiz/login.html')

@admin_access
def admin(request):
    return render(request, 'quiz/adminhome.html')

@user_access
def user(request):
    return render(request, 'quiz/userhome.html')

@user_access
def quizgame(request):
    return render(request, 'quiz/game.html')
    
@admin_access
def tournament(request):
    return render(request, 'quiz/tournament.html')

@admin_access
def manageUser(request):
    return render(request, 'quiz/manageuser.html')

def logout(request):
    request.session['user_name'] = None
    request.session['user_id'] = None
    request.session['user_role'] = None
    return render(request, 'quiz/login.html')

def checkLogin(request):
    response_data = {}
    user = None
    if request.method == 'POST':
        username = request.POST.get('username')
        password = request.POST.get('password')
        try:
            u = User.objects.get(user_mail=username)
            if u.user_password == password:
                request.session['user_name'] = u.user_name
                request.session['user_id'] = u.id
                request.session['user_role'] = u.user_role_id
                response_data['flag'] = "1"
                response_data['result'] = u.user_role_id
            else:
                response_data['flag'] = "0"
                response_data['result'] = "Invalid User Id or Password"
        except User.DoesNotExist:
            response_data['flag'] = "0"
            response_data['result'] = "Invalid User Id or Password"
    return HttpResponse(json.dumps(response_data), content_type="application/json")


def addTournament(request):
    response_data = {}
    url="https://opentdb.com/api.php?amount=10"
    if request.method == 'POST':
        tournament_id = request.POST.get('id')
        tournament_name = request.POST.get('tournament_name')
        tournament_start_date = request.POST.get('tournament_start_date')
        tournament_end_date = request.POST.get('tournament_end_date')
        tournament_category = request.POST.get('tournament_category')
        tournament_difficulty = request.POST.get('tournament_difficulty')
        tournament_high_score=0
        if (tournament_category != "any"):
            url = url + "&category=" + tournament_category
        if (tournament_difficulty != "any"):
            url = url + "&difficulty=" + tournament_difficulty

        if tournament_id == "":
            try:
                QuestionsObject = requests.get(url)
                tournament_question=QuestionsObject.json()['results']
                tournament=Tournament.objects.create(tournament_name=tournament_name,
                                                     tournament_start_date=tournament_start_date,
                                                     tournament_end_date=tournament_end_date,
                                                     tournament_category=tournament_category,
                                                     tournament_difficulty=tournament_difficulty,
                                                     tournament_question=tournament_question,
                                                     tournament_high_score = tournament_high_score)
                response_data['flag'] = "1"
                response_data['result'] = "Tournament Addes Successfully"
            except:
                response_data['flag'] = "0"
                response_data['result'] = "Failed to save"
        else:
            try:
                g = game.objects.get(game_tournament_id=tournament_id)
                try:
                    Tournament.objects.filter(id=tournament_id).update(tournament_name=tournament_name,
                                                                   tournament_start_date=tournament_start_date)
                    response_data['flag'] = "1"
                    response_data['result'] = "Tournament Updated successfullty"
                except:
                    response_data['flag'] = "0"
                    response_data['result'] = "Failed to Update"
            except game.DoesNotExist:
                try:
                    QuestionsObject = requests.get(url)
                    tournament_question = QuestionsObject.json()['results']
                    Tournament.objects.filter(id=tournament_id).update(tournament_name=tournament_name,
                                                        tournament_start_date=tournament_start_date,
                                                        tournament_end_date=tournament_end_date,
                                                        tournament_category=tournament_category,
                                                        tournament_difficulty=tournament_difficulty,
                                                        tournament_question=tournament_question,
                                                        tournament_high_score = tournament_high_score
                                                        )
                    response_data['flag'] = "1"
                    response_data['result'] = "Tournament Updated successfullty"
                except:
                    response_data['flag'] = "0"
                    response_data['result'] = "Failed to Update"
    return HttpResponse(json.dumps(response_data), content_type="application/json")


def getTournament(request):
    response_data = {}
    tournament = None
    if request.method == 'POST':
        id = request.POST.get('tournament_id')
        if id == "":
            tournament = Tournament.objects.all()
            if tournament.count() == 0:
                 response_data['flag'] = "0"
                 response_data['result'] = 'No Tournament found'
            else:
                response_data['flag'] = "1"
                response_data['result'] = serializers.serialize('json', tournament)
        else:
            tournament = Tournament.objects.all().filter(id=id)
            if tournament.count() == 0:
                response_data['flag'] = "0"
                response_data['result'] = 'No Tournament found'
            else:
                try:
                    g = game.objects.get(game_tournament_id=id)
                    response_data['flag'] = "2"
                    response_data['result'] = serializers.serialize('json', tournament)
                except game.DoesNotExist:
                    response_data['flag'] = "1"
                    response_data['result'] = serializers.serialize('json', tournament)

    return HttpResponse(json.dumps(response_data), content_type="application/json")

def deleteTournament(request):
    response_data = {}
    if request.method == 'POST':
        id = request.POST.get('tournament_id')
        g = game.objects.all().filter(game_tournament_id=id)
        if g.count() == 0:
            try:
                Tournament.objects.all().filter(id=id).delete()
                response_data['flag'] = "1"
                response_data['result'] = "deleted successfully"
            except:
                response_data['flag'] = "0"
                response_data['result'] = "Failed to delete"
        else:
            response_data['flag'] = "0"
            response_data['result'] = "can't delete this Tournament"

    return HttpResponse(json.dumps(response_data), content_type="application/json")


def addUser(request):
    response_data = {}
    url="https://opentdb.com/api.php?amount=10"
    if request.method == 'POST':
        user_id = request.POST.get('id')
        user_name = request.POST.get('user_name')
        user_mail = request.POST.get('user_mail')
        user_password = request.POST.get('user_password')
        user_phone = request.POST.get('user_phone')
        user_role = request.POST.get('user_role')
        if user_id == "":
            try:
                user = User.objects.create(user_name = user_name,
                                           user_mail = user_mail,
                                           user_password = user_password,
                                           user_phone = user_phone,
                                           user_role_id = user_role)
                response_data['flag'] = "1"
                response_data['result'] = "User saved Successfully"
            except:
                response_data['flag'] = "0"
                response_data['result'] = "Failed to save"
        else:
            try:
                user = User.objects.filter(id=user_id).update(user_name=user_name,
                                           user_mail=user_mail,
                                           user_password=user_password,
                                           user_phone=user_phone,
                                           user_role_id=user_role)
                response_data['flag'] = "1"
                response_data['result'] = "User Updated Successfully"
            except:
                response_data['flag'] = "0"
                response_data['result'] = "Failed to Update"
    return HttpResponse(json.dumps(response_data), content_type="application/json")


def getUser(request):
    response_data = {}
    user = None
    if request.method == 'POST':
        id = request.POST.get('user_id')
        if id == "":
            user = User.objects.all()
        else:
            user = User.objects.all().filter(id=id)
        if user.count() == 0:
            response_data['flag'] = "0"
            response_data['result'] = 'No User found'
        else:
            response_data['flag'] = "1"
            response_data['result'] = serializers.serialize('json', user)

    return HttpResponse(json.dumps(response_data), content_type="application/json")


def deleteUser(request):
    response_data = {}
    if request.method == 'POST':
        id = request.POST.get('user_id')
        g = game.objects.all().filter(game_user_id=id)
        if g.count() == 0:
            try:
                User.objects.all().filter(id=id).delete()
                response_data['flag'] = "1"
                response_data['result'] = "deleted successfully"
            except:
                response_data['flag'] = "0"
                response_data['result'] = "Failed to delete"
        else:
            response_data['flag'] = "0"
            response_data['result'] = "can't delete this user"
    
    return HttpResponse(json.dumps(response_data), content_type="application/json")


def addGame(request):
    response_data = {}
    if request.method == 'POST':
        game_tournament = request.POST.get('game_tournament')
        game_user = request.POST.get('game_user')
        game_answer = request.POST.get('game_answer')
        game_score = request.POST.get('game_score')
        try:
            result = game.objects.create(game_tournament_id = game_tournament,
                                       game_user_id = game_user,
                                       game_answer = game_answer,
                                       game_score = game_score)
            u = Tournament.objects.get(id=game_tournament)
            if int(u.tournament_high_score) <= int(game_score):
                Tournament.objects.filter(pk=game_tournament).update(tournament_high_score=game_score)
                response_data['flag'] = "2"
                response_data['result'] = "Game saved Successfully New highscore"
            else:
                response_data['flag'] = "1"
                response_data['result'] = "Game saved Successfully"
        except:
            response_data['flag'] = "0"
            response_data['result'] = "Failed to save"
    return HttpResponse(json.dumps(response_data), content_type="application/json")

def getGame(request):
    response_data = {}
    if request.method == 'POST':
        tournament_id = request.POST.get('tournament_id')
        user_id = request.POST.get('user_id')
        try:
             g = game.objects.get(game_tournament_id=tournament_id,game_user_id=user_id)
             response_data['flag'] = "2"
             response_data['result'] = g.game_answer
             response_data['score'] = g.game_score
        except game.DoesNotExist:
            t=Tournament.objects.get(id=tournament_id)
            if t.tournament_start_date <= date.today():
                if t.tournament_end_date >= date.today():
                    tournament = Tournament.objects.all().filter(id=tournament_id)
                    if tournament.count() == 0:
                        response_data['flag'] = "0"
                        response_data['result'] = 'No Tournament found'
                    else:
                        response_data['flag'] = "1"
                        response_data['result'] = serializers.serialize('json', tournament)
                else:
                    response_data['flag'] = "3"
                    response_data['result'] = "Tournament already ended on "+str(t.tournament_end_date)
            else:
                response_data['flag'] = "3"
                response_data['result'] = "Tournament Not yet started stating date : "+str(t.tournament_start_date)       
    return HttpResponse(json.dumps(response_data), content_type="application/json")


def sendMail(request):
    response_data = {}
    if request.method == 'POST':
        usermail = request.POST.get('email')
        unique_id = get_random_string(length=6)
        try:
            email = EmailMessage('Trivia Quiz', 'Welcome User plase enter the code ( ' + unique_id + ' ) to complete your registration.', to=[usermail])
            email.send()
            response_data['flag'] = "1"
            response_data['result'] = unique_id
        except:
            response_data['flag'] = "0"
            response_data['result'] = 'Failed'
    return HttpResponse(json.dumps(response_data), content_type="application/json")

def checkEmail(request):
    response_data = {}
    if request.method == 'POST':
        email = request.POST.get('email')
        try:
             u = User.objects.get(user_mail=email)
             response_data['flag'] = "0"
             response_data['result'] = "mail already exist"
        except User.DoesNotExist:
                response_data['flag'] = "1"
                response_data['result'] = "Unique email"
    return HttpResponse(json.dumps(response_data), content_type="application/json") 

def getCount(request):
    response_data = {}
    if request.method == 'POST':
        id = request.POST.get('user_id')
        if id == '1':
            try:
                u = User.objects.all().count()
                t = Tournament.objects.all().count()
                response_data['flag'] = "1"
                response_data['user'] =  u
                response_data['tournament'] =  t
            except User.DoesNotExist:
                response_data['flag'] = "0"
        else:
            response_data['flag'] = "0"
            response_data['result'] = ""
    return HttpResponse(json.dumps(response_data), content_type="application/json")    
