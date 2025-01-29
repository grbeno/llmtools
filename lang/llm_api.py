import openai
from environs import Env
from rest_framework.response import Response

from .serializers import LanguageSerializer

env = Env()
env.read_env()


class Assistant:

    def __init__(self, request):
        self.request = request
        self.prompt = request.data['prompt']
        self.model = 'gpt-4o-mini'
        self.role = """Your response should be the correction of the given prompt. 
        If the prompt is already correct, respond with 'Your english is correct'."""
        self.key = env.str("OPENAI_API_KEY")


    def llm_response(self):
        if self.key:
            openai.api_key = self.key
            response = openai.chat.completions.create(
                model=self.model,
                messages=[
                    {"role": "system", "content": self.role},
                    {"role": "user", "content": self.prompt}
                ],
                temperature=0.6, # 0-1
                max_tokens=512,
            )
            return response.choices[0].message.content
        else:
            return f"@Thank you for the prompt! Possible problem with API key. We are working on it."

    
    def get_data(self):
        correction = self.llm_response()
        self.role="""Anyanyelvi szintű magyarul beszélő vagy és az a feladatod, hogy a szövegeket, amiket a felhasználó ad, 
        magyarra fordíts! Ha magyarul kapod a feladatot, akkor ugyanazt a szöveget válaszold vissza!"""
        translation = self.llm_response()
        data = { 'prompt': self.prompt, 'correction': correction, 'translation': translation }
        
        # run on server
        serializer = LanguageSerializer(data=data, context={'request': self.request})

        if serializer.is_valid(raise_exception=True):
            serializer.save()
            return Response(serializer.data)