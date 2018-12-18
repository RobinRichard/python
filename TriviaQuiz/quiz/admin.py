from django.contrib import admin


from .models import Role,User,Tournament,game

admin.site.register(Role)
admin.site.register(User)
admin.site.register(Tournament)
admin.site.register(game)
