# widgets.py

from django.forms.widgets import TextInput
from django.template import loader


class CustomKeyboardWidget(TextInput):
    template_name = 'learning/greek-keyboard.html'

    def render(self, name, value, attrs=None, renderer=None):
        template = loader.get_template(self.template_name)
        context = {'name': name, 'value': value, 'attrs': attrs}
        return template.render(context)
