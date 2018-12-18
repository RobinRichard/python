from django.urls import path
from . import views

urlpatterns = [
    path('', views.login, name='loginpage'),
    path('login', views.login, name='login'),
    path('admin', views.admin, name='admin'),
    path('user', views.user, name='user'),
    path('game', views.quizgame, name='game'),
    path('manageuser', views.manageUser, name='manageuser'),
    path('tournament', views.tournament, name='tournament'),
    path('logout', views.logout, name='logout'),

    path('ajax/checklogin', views.checkLogin, name='checklogin'),
    path('ajax/addtournament', views.addTournament, name='addtournament'),
    path('ajax/gettournament', views.getTournament, name='gettournament'),
    path('ajax/deletetournament', views.deleteTournament, name='deletetournament'),
    path('ajax/adduser', views.addUser, name='adduser'),
    path('ajax/getuser', views.getUser, name='getuser'),
    path('ajax/deleteuser', views.deleteUser, name='deleteuser'),
    path('ajax/addgame', views.addGame, name='addgame'),
    path('ajax/getgame', views.getGame, name='getgame'),
    path('ajax/sendemail', views.sendMail, name='sendemail'),
    path('ajax/checkemail', views.checkEmail, name='checkemail'), 
    path('ajax/getcount', views.getCount, name='getcount'), 
     
]