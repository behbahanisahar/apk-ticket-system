from rest_framework.throttling import AnonRateThrottle


class AuthRateThrottle(AnonRateThrottle):
    """
    Rate limiting for authentication endpoints (login, register).
    Protects against brute force attacks.
    """
    scope = "auth"
