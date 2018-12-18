from django.contrib import admin

# Register your models here.
from .models import *

admin.site.register(Lengths)
admin.site.register(Levels)
admin.site.register(Sizes)
admin.site.register(Choises)
admin.site.register(Dogbreeds)

