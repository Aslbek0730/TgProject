from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from .models import TelegramUser
from .serializers import TelegramUserSerializer

class TelegramUserAuth(APIView):
    def post(self, request):
        telegram_id = request.data.get('telegram_id')
        username = request.data.get('username')
        first_name = request.data.get('first_name')
        last_name = request.data.get('last_name')
        language_code = request.data.get('language_code')

        if not telegram_id:
            return Response(
                {'error': 'telegram_id is required'},
                status=status.HTTP_400_BAD_REQUEST
            )

        user, created = TelegramUser.objects.get_or_create(
            telegram_id=telegram_id,
            defaults={
                'username': username,
                'first_name': first_name,
                'last_name': last_name,
                'language_code': language_code
            }
        )

        if not created:
            # Update user data if it already exists
            user.username = username
            user.first_name = first_name
            user.last_name = last_name
            user.language_code = language_code
            user.save()

        serializer = TelegramUserSerializer(user)
        return Response(serializer.data) 