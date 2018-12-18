from django.http import HttpResponse
from django.http import HttpResponseRedirect
from django.shortcuts import render

from .models import *
def index(request):
    choiselist = Choises.objects.all()
    lengthlist = Lengths.objects.all()
    levellist = Levels.objects.all()
    sizelist = Sizes.objects.all()

    Avtivities=[field.name for field in Dogbreeds._meta.get_fields()]

    SelectionList = ""
    SuggestionList = ""

    if request.method == 'POST':

        SelectionList = Dogbreeds.objects.all()
        SuggestionList = Dogbreeds.objects.all()

        GoodWithChildren = request.POST.get('GoodWithChildren')
        if GoodWithChildren:
            SelectionList = SelectionList.filter(GoodWithChildren_id=GoodWithChildren)
            SuggestionList = SuggestionList.filter(GoodWithChildren_id=GoodWithChildren)

        Drools = request.POST.get('Drools')
        if Drools:
            SelectionList = SelectionList.filter(Drools_id=Drools)
            SuggestionList = SuggestionList.filter(Drools_id=Drools)

        Coatlength = request.POST.get('Coatlength')
        if Coatlength:
            SelectionList = SelectionList.filter(Coatlength_id=Coatlength)
            SuggestionList = SuggestionList.filter(Coatlength_id=Coatlength)

        ActivityLevel = request.POST.get('ActivityLevel')
        if ActivityLevel:
            if ActivityLevel!="":
                SelectionList = SelectionList.filter(Activity_id=ActivityLevel)

        SheddingLevel = request.POST.get('SheddingLevel')
        if SheddingLevel:
            if SheddingLevel!="":
                SelectionList = SelectionList.filter(Shedding_id=SheddingLevel)

        GroomingLevel = request.POST.get('GroomingLevel')
        if GroomingLevel:
            if GroomingLevel!="":
                SelectionList = SelectionList.filter(Grooming_id=GroomingLevel)

        IntelligenceLevel = request.POST.get('IntelligenceLevel')
        if IntelligenceLevel:
            if IntelligenceLevel != "":
                SelectionList = SelectionList.filter(Intelligence_id=IntelligenceLevel)

        Size = request.POST.get('Size')
        if Size:
            if Size != "0":
                SelectionList = SelectionList.filter(Size_id=Size)
                SuggestionList=SuggestionList.filter(Size_id=Size)


    context = {'choiselist': choiselist,'lengthlist': lengthlist,'levellist': levellist,'sizelist': sizelist,'Avtivities':Avtivities,'SelectionList':SelectionList,'SuggestionList':SuggestionList}
    return render(request, 'selector/index.html', context)
