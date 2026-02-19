from django.contrib import admin
from .models import Ticket, TicketResponse


class TicketResponseInline(admin.TabularInline):
    model = TicketResponse
    extra = 0


@admin.register(Ticket)
class TicketAdmin(admin.ModelAdmin):
    list_display = ["title", "user", "status", "priority", "created_at"]
    list_filter = ["status", "priority"]
    search_fields = ["title", "description"]
    inlines = [TicketResponseInline]


@admin.register(TicketResponse)
class TicketResponseAdmin(admin.ModelAdmin):
    list_display = ["ticket", "user", "created_at"]
