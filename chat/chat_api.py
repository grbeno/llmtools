# chat/chat_api.py

from openai import OpenAI
from environs import Env
import redis
import json
from config import settings

# Load the environment variables
env = Env()
env.read_env()

client = OpenAI()
client.api_key=env.str("OPENAI_API_KEY")

class AiChat():

    if settings.DEBUG:
        ## In-Memory Channel Layer
        _channels = {}
    else:
        ## Redis Channel Layer
        _redis_client = redis.Redis(host='redis', port=6379, db=0) 
    
    _role = "You are helpful and friendly assistant. Be short but concise as you can!"

    def __init__(self, prompt: str, model: str, channel: str) -> None:
        self.prompt = prompt
        self.model = model
        self.channel = channel
        
        if settings.DEBUG:
            ## In-Memory Channel Layer
            if self.channel not in AiChat._channels:
                AiChat._channels[self.channel] = [
                    {"role": "user", "content": AiChat._role},
                ]
            self.conversation = AiChat._channels[self.channel]
        else:
            ## Redis Channel Layer
            # Check if the channel exists in Redis
            if not self._redis_client.exists(channel):
                initial_data = [{"role": "system", "content": self._role}]
                self._redis_client.set(channel, json.dumps(initial_data))
            # Retrieve the conversation from Redis
            conversation_data = self._redis_client.get(channel)
            self.conversation = json.loads(conversation_data) if conversation_data else initial_data
        
    def chat(self) -> str:
        if self.prompt:
            # The conversation is going on ...
            # Adding prompt to chat history
            self.conversation.append({"role": "user", "content": self.prompt})
            
            if settings.DEBUG is False:
                ## Redis Channel Layer
                self._redis_client.set(self.channel, json.dumps(self.conversation))
            
            # The OpenAI's chat completion generates answers to your prompts.
            completion = client.chat.completions.create(
                model=self.model,
                messages=self.conversation
            )
            answer = completion.choices[0].message.content
            # Adding answer to chat history
            self.conversation.append({"role": "assistant", "content": answer})
            
            if settings.DEBUG is False:
                ## Redis Channel Layer
                self._redis_client.set(self.channel, json.dumps(self.conversation))
            
            return answer