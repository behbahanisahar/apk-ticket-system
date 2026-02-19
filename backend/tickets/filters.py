from django_filters import rest_framework as filters
from .models import Ticket


class TicketFilter(filters.FilterSet):
    status = filters.CharFilter(lookup_expr="iexact")
    priority = filters.CharFilter(lookup_expr="iexact")
    search = filters.CharFilter(method="filter_search")

    class Meta:
        model = Ticket
        fields = ["status", "priority"]

    def filter_search(self, queryset, name, value):
        if not value:
            return queryset
        from django.db.models import Q
        return queryset.filter(
            Q(title__icontains=value)
            | Q(description__icontains=value)
            | Q(ticket_number__icontains=value)
        )
