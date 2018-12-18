from django.db import models


class Levels(models.Model):
    level = models.CharField(max_length=20)

    def __str__(self):
        return self.level

class Choises(models.Model):
    Choise = models.CharField(max_length=20)
    ChoiseDrool= models.CharField(max_length=20)

    def __str__(self):
        return self.Choise


class Sizes(models.Model):
    Size = models.CharField(max_length=20)

    def __str__(self):
        return self.Size

class Lengths(models.Model):
    Length = models.CharField(max_length=20)

    def __str__(self):
        return self.Length

class Dogbreeds(models.Model):
    Breed_Type = models.CharField(max_length=100)
    Activity = models.ForeignKey(Levels, on_delete=models.CASCADE, related_name="Activity_Level")
    Shedding = models.ForeignKey(Levels, on_delete=models.CASCADE, related_name="Shedding_Level")
    Grooming = models.ForeignKey(Levels, on_delete=models.CASCADE, related_name="Grooming_Demand")
    Intelligence = models.ForeignKey(Levels, on_delete=models.CASCADE, related_name="Intelligences")
    GoodWithChildren = models.ForeignKey(Choises, on_delete=models.CASCADE, related_name="Good_With_Children")
    Drools = models.ForeignKey(Choises, on_delete=models.CASCADE, related_name="Drool")
    Coatlength = models.ForeignKey(Lengths, on_delete=models.CASCADE, related_name="Coat_length")
    Size = models.ForeignKey(Sizes, on_delete=models.CASCADE, related_name="Sizes")
    DogImage= models.CharField(max_length=100)

    def __str__(self):
        return self.Breed_Type