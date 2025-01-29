from django.views.generic import TemplateView

class IndexView(TemplateView):
    template_name = 'index.html'

    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        
        # Check for forwarded protocol (for proxies like Railway)
        forwarded_proto = self.request.META.get('HTTP_X_FORWARDED_PROTO')
        is_secure = self.request.is_secure() or forwarded_proto == 'https'
        
        # Set WS/WSS protocol
        ws_protocol = 'wss://' if is_secure else 'ws://'
        context['WS_URL'] = f"{ws_protocol}{self.request.get_host()}"
        
        return context
