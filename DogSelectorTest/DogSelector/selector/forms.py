from django import forms

class SelectorForm(forms.Form):
    Activity = forms.CharField(label='ActivityLevel', max_length=100)
    Shedding = forms.CharField(label='SheddingLevel', max_length=100)
    Grooming = forms.CharField(label='GroomingLevel', max_length=100)
    Intelligence = forms.CharField(label='IntelligenceLevel', max_length=100)

    GoodWithChildren = forms.CharField(label='GoodWithChildren', max_length=100)
    Drools = forms.CharField(label='Drools', max_length=100)
    Coatlength = forms.CharField(label='Coatlength', max_length=100)
    Size = forms.CharField(label='Size', max_length=100)