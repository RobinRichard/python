from django.db import models
import datetime

class Role(models.Model):
    user_role = models.CharField(max_length=20)

    def __str__(self):
        return self.user_role

class User(models.Model):
    user_name = models.CharField(max_length=50)
    user_mail = models.CharField(max_length=50)
    user_password = models.CharField(max_length=50)
    user_phone = models.IntegerField(default=0)
    user_role = models.ForeignKey(Role, on_delete=models.CASCADE)

    def __str__(self):
        return self.user_name



class Tournament(models.Model):
    tournament_name = models.CharField(max_length=50)
    tournament_start_date = models.DateField('start date', default=datetime.date.today)
    tournament_end_date = models.DateField('end date', default=datetime.date.today)
    tournament_category = models.CharField(max_length=100,null=True, blank=True)
    tournament_difficulty = models.CharField(max_length=50,null=True, blank=True)
    tournament_question = models.TextField()
    tournament_high_score= models.IntegerField(default=0)

    def __str__(self):
        return self.tournament_name


class game(models.Model):
    game_tournament=models.ForeignKey(Tournament, on_delete=models.CASCADE)
    game_user = models.ForeignKey(User, on_delete=models.CASCADE)
    game_answer = models.TextField()
    game_score = models.IntegerField(default=0)
