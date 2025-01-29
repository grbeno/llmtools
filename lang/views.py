from rest_framework.views import APIView
from rest_framework.response import Response

from .models import Language
from .serializers import LanguageSerializer
from .llm_api import Assistant


class LangAI(APIView):
	
	serializer_class = LanguageSerializer

	def get(self, request):
		detail = Language.objects.all()
		serializer = LanguageSerializer(detail, many=True)
		return Response(serializer.data)
	
	def post(self, request):
		return Assistant(request).get_data()
		
	def delete(self, request):
		try:
			detail = Language.objects.all()
			detail.delete()
			return Response({'message': 'Item deleted successfully.'})
		except Language.DoesNotExist:
			return Response({'error': 'Item not found.'})
