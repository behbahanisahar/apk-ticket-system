from rest_framework import permissions

from .models import Ticket


class IsOwnerAndOpen(permissions.BasePermission):
    def has_object_permission(self, request, view, obj):
        return obj.user == request.user and obj.status == Ticket.STATUS_OPEN


class IsOwnerAndOpenOrAdmin(permissions.BasePermission):
    def has_object_permission(self, request, view, obj):
        if request.user.is_staff:
            return True
        return obj.user == request.user and obj.status == Ticket.STATUS_OPEN


class IsOwnerOrAdmin(permissions.BasePermission):
    def has_object_permission(self, request, view, obj):
        if request.user.is_staff:
            return True
        return obj.user == request.user
