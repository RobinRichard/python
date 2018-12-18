from django.test import TestCase
from django.urls import reverse
from django.test import Client
from .models import *

class SelectorViewTests(TestCase):

    @classmethod
    def setUp(self):
        Size=Sizes.objects.create(Size="Micro")
        Choise=Choises.objects.create(Choise="Yes")
        level=Levels.objects.create(level="Low")
        Length=Lengths.objects.create(Length="Medium")
        Dogbreeds.objects.create(Breed_Type = "Rajapalayam", Activity = level, Shedding = level,Grooming =level,Intelligence = level,GoodWithChildren = Choise,Drools =Choise , Coatlength =Length,Size = Size,DogImage="dog.jpg")

        self.choiselist = Choises.objects.all()
        self.levellist = Levels.objects.all()
        self.lengthlist = Lengths.objects.all()
        self.sizelist = Sizes.objects.all()
        self.Avtivities = [field.name for field in Dogbreeds._meta.get_fields()]
        self.SelectionList = Dogbreeds.objects.all()
        self.SuggestionList = Dogbreeds.objects.all()
        pass

    def tearDown(self):
        pass

    def test_string_representation(self):
        breed = Dogbreeds(Breed_Type="Breed Type Name")
        choise = Choises(Choise="YES")
        level = Levels(level="High")
        size = Sizes(Size="Giant")
        length = Lengths(Length="Long")
        self.assertEqual(str(breed), breed.Breed_Type)
        self.assertEqual(str(choise), choise.Choise)
        self.assertEqual(str(level), level.level)
        self.assertEqual(str(length), length.Length)
        self.assertEqual(str(size), size.Size)

    def test_PostIndexpage(self):
        context = {'choiselist': self.choiselist, 'lengthlist': self.lengthlist, 'levellist': self.levellist, 'sizelist': self.sizelist,
                   'Avtivities': self.Avtivities, 'SelectionList': self.SelectionList, 'SuggestionList': self.SuggestionList}
        response = self.client.post("",context)
        self.assertEquals(response.status_code,200)
        self.assertTemplateUsed(response, "selector/index.html")

    def test_SelectedBreed(self):
         SelectionList = Dogbreeds.objects.get(GoodWithChildren_id=1, Activity=1, Shedding=1, Grooming=1, Intelligence=1,
                                              Drools=1, Coatlength=1, Size=1)
         context = {'choiselist': self.choiselist, 'lengthlist': self.lengthlist, 'levellist': self.levellist, 'sizelist': self.sizelist,
                    'Avtivities': self.Avtivities, 'SelectionList': SelectionList, 'SuggestionList': self.SuggestionList}
         response = self.client.post("", context)
         self.assertEqual(response.context['SelectionList'][0],SelectionList)