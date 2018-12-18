from django.test import TestCase
from django.urls import reverse
from django.test import Client
from .models import *
from datetime import date
import json
from django.core import serializers
import requests
from django.utils.crypto import get_random_string
from django.core.mail import EmailMessage
class QuizTests(TestCase):
    @classmethod
    def setUp(self):
        role = Role.objects.create(user_role="user")

        user = User.objects.create(user_name="testuser",user_mail="test@testmail.com",user_password="123",user_phone=1245,user_role_id=role.id)
        
        question = "[{'category': 'General Knowledge', 'type': 'multiple', 'difficulty': 'hard', 'question': 'Electronic music producer Kygo&#039;s popularity skyrocketed after a certain remix. Which song did he remix?', 'correct_answer': 'Ed Sheeran - I See Fire', 'incorrect_answers': ['Marvin Gaye - Sexual Healing', 'Coldplay - Midnight', 'a-ha - Take On Me']}, {'category': 'Entertainment: Video Games', 'type': 'multiple', 'difficulty': 'hard', 'question': 'In the game &quot;The Sims&quot;, how many Simoleons does each family start with?', 'correct_answer': '20,000', 'incorrect_answers': ['10,000', '15,000', '25,000']}]"
        
        answer = '[{"question":"Electronic music producer Kygo&#039;s popularity skyrocketed after a certain remix. Which song did he remix?","answer":"Ed Sheeran - I See Fire","useranswer":"Marvin Gaye - Sexual Healing"},{"question":"In the game \"The Sims\", how many Simoleons does each family start with?","answer":"20,000","useranswer":"20,000"}]'
        
        tournament = Tournament.objects.create(tournament_name="testtournament",tournament_start_date=date.today(),tournament_end_date=date(2018,7,15),
                                               tournament_category="any",tournament_difficulty="any",tournament_question=question,tournament_high_score=0)

        gme = game.objects.create(game_tournament_id=tournament.id,game_user_id=user.id,game_answer=answer,game_score=1)

        self.client = Client()
        pass

    def tearDown(self):
        pass
    
    def test_user_select(self):
        u = User.objects.get(user_name="testuser")
        self.assertEqual(u.user_name, 'testuser')
    
    def test_tournament_select(self):
        t = Tournament.objects.get(tournament_name="testtournament")
        self.assertEqual(t.tournament_name, 'testtournament')

    def test_user_login(self):
        url = reverse('checklogin')
        data = { 'username':'test@testmail.com' , 'password': '123' }
        user=User.objects.get(user_mail="test@testmail.com",user_password="123")
        response = self.client.post(url, data)
        json_string = response.content
        data = json.loads(json_string)
        self.assertEqual(response.status_code, 200)
        self.assertEqual(data['result'], user.user_role_id)

    def test_view_login(self):
        url = reverse('login')
        response = self.client.get(url)
        self.assertEqual(response.status_code, 200)

    def test_get_user(self):
        url = reverse('getuser')
        data = { 'user_id' : 1 }
        users = User.objects.all().filter(id=1)
        actualdata=serializers.serialize('json', users)
        response = self.client.post(url, data)
        json_string = response.content
        data = json.loads(json_string)
        self.assertEqual(response.status_code, 200)

    def test_get_tournament(self):
        url = reverse('gettournament')
        data = { 'tournament_id' : 1 }
        tournament = Tournament.objects.all().filter(id=1)
        actualdata=serializers.serialize('json', tournament)
        response = self.client.post(url, data)
        json_string = response.content
        data = json.loads(json_string)
        self.assertEqual(response.status_code, 200)

    def test_mail_exist(self):
        url = reverse('checkemail')
        data = { 'email':'test@testmail.com'}
        response = self.client.post(url, data)
        json_string = response.content
        data = json.loads(json_string)

        actualresult = ''
        try:
            u = User.objects.get(user_mail='test@testmail.com')
            actualresult = "mail already exist"
        except User.DoesNotExist:
            actualresult = "Unique email"
        self.assertEqual(response.status_code, 200)
        self.assertEqual(actualresult, data['result'])

    def test_add_Tournament(self):
        url = reverse('addtournament')
        data= {
                    'id' : '',
                    'tournament_name' : 'testtournament2' ,
                    'tournament_start_date' : date.today() ,
                    'tournament_end_date' : date(2018,7,15) ,
                    'tournament_category' : "any" ,
                    'tournament_difficulty' : "any" ,
                }
        response = self.client.post(url, data)
        json_string = response.content
        expecteddata = json.loads(json_string)

        actualresult = ''
        url="https://opentdb.com/api.php?amount=10"
        tournament_name = 'testtournament2'
        tournament_start_date = date.today()
        tournament_end_date = date(2018,7,15)
        tournament_category = "any"
        tournament_difficulty = "any"
        tournament_high_score=0
        if (tournament_category != "any"):
            url = url + "&category=" + tournament_category
        if (tournament_difficulty != "any"):
            url = url + "&difficulty=" + tournament_difficulty
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
            actualresult = "Tournament Addes Successfully"
        except:
            actualresult = "Failed to save"

        self.assertEqual(actualresult, expecteddata['result'])

    def  test_send_Mail(self):
        url = reverse('sendemail')
        data = {'email' : 'robrichard4@gmail.com' }
        response = self.client.post(url, data)
        json_string = response.content
        expecteddata = json.loads(json_string)
        actualresult = ''
        usermail = 'robrichard4@gmail.com'
        unique_id = get_random_string(length=6)
        try:
            email = EmailMessage('Trivia Quiz', 'Welcome User plase enter the code ( ' + unique_id + ' ) to complete your registration.', to=[usermail])
            email.send()
            actualresult = "1"
        except:
            actualresult = "0"

        self.assertEqual(actualresult, expecteddata['flag'])


    def  test_get_count(self):
        url = reverse('getcount')
        data = {'user_id' : 1 }
        response = self.client.post(url, data)
        json_string = response.content
        expecteddata = json.loads(json_string)
        tournamentcount = ''
        usercount = ''
        u = User.objects.all().count()
        t = Tournament.objects.all().count()
        try:
            u = User.objects.all().count()
            t = Tournament.objects.all().count()
            usercount =  u
            tournamentcount =  t
        except User.DoesNotExist:
            usercount = 0
        except Tournament.DoesNotExist:
            tournamentcount = 0
        self.assertEqual(usercount, expecteddata['user'])
        self.assertEqual(tournamentcount, expecteddata['tournament'])

        
    