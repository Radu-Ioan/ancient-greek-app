from rest_framework.response import Response
from rest_framework.decorators import api_view
from .serializers import RegisterSerializer, UserSerializer


@api_view(['POST'])
def register(request):
    serializer = RegisterSerializer(data=request.data)

    if serializer.is_valid():
        user = serializer.save()

        return Response({
            'user': UserSerializer(user).data,
            'message': "User created successfully. Now you can perform Login"
                       "to get your token"
        })
    else:
        return Response({
            'data': serializer.data,
            'errors': serializer.errors,
            'message': "Invalid data"
        })
