from django import forms
from django.db.models import Max
from django.core.exceptions import ValidationError
from django.forms import inlineformset_factory
from .models import (
    Lesson, Exercise, OrderWordsExercise, TipText, WordPiece,
    JoinWordsExercise, JoinPair, CompleteExercise, SentencePiece,
    ChooseRightAnswer, AnswerChoice, AnswerExercise,
)
from .widgets import CustomFileInput


CONTROLLED_INPUT_CLASSNAME = "controlled-input"
CONTROLLED_INPUT_SELECTOR = f'.{CONTROLLED_INPUT_CLASSNAME}'
CSS_INPUT_STYLE = "form-control"
CSS_SELECT_STYLE = "form-select"

ExerciseFormset = inlineformset_factory(Lesson, Exercise, fields=['order', ],
                                        extra=0)


class LessonForm(forms.ModelForm):
    class Meta:
        model = Lesson
        fields = ['order', 'title', 'description', ]

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self.fields['title'].widget.attrs.update({
            'class': f'{CONTROLLED_INPUT_CLASSNAME} {CSS_INPUT_STYLE}'
        })
        self.fields['description'].widget.attrs.update({
            'class': f'{CONTROLLED_INPUT_CLASSNAME} {CSS_INPUT_STYLE}'
        })
        self.fields['order'].widget.attrs.update({
            'class': f'{CSS_INPUT_STYLE}'
        })

        max_order = Lesson.objects.aggregate(Max('order'))['order__max']

        if max_order is None:
            max_order = 0

        self.fields['order'].initial = max_order + 1

    def clean_order(self):
        data = self.cleaned_data.get("order", None)

        if data is None:
            raise ValidationError("No order given")

        order = int(data)

        if order < 1:
            raise ValidationError("Order should be greater than 0")

        max_order_query = Lesson.objects.aggregate(Max('order'))
        max_order = max_order_query['order__max'] if max_order_query['order__max'] is not None else 0

        if self.instance and self.instance.pk:
            # Editing an existing lesson
            if order > max_order:
                raise ValidationError(f"Order should be between 1 and {max_order}")
        else:
            # Adding a new lesson
            if order > max_order + 1:
                raise ValidationError(f"Order should be between 1 and {max_order + 1}")

        return order


def set_initial_order_for_exercise_forms(fields, kwargs):
    # Determine the lesson either from instance or from form data
    lesson = None
    if 'instance' in kwargs and kwargs['instance']:
        lesson = kwargs['instance'].lesson
    elif 'initial' in kwargs and 'lesson' in kwargs['initial']:
        try:
            lesson = kwargs['initial']['lesson']
        except (ValueError, Lesson.DoesNotExist):
            pass

    # If a lesson is determined, calculate the max order
    if lesson:
        results = Exercise.objects.filter(lesson=lesson).aggregate(Max('order'))
        current_order = results['order__max']
        if current_order is None:
            current_order = 0
        fields['order'].initial = current_order + 1


class WordPieceFormSet(inlineformset_factory(OrderWordsExercise, WordPiece,
                                             fields=['content'], extra=3)):
    def __init__(self, *args, **kwargs):
        super(WordPieceFormSet, self).__init__(*args, **kwargs)

        for form in self.forms:
            form.fields['content'].widget.attrs.update(
                {'class': ' '.join([CONTROLLED_INPUT_CLASSNAME,
                                    CSS_INPUT_STYLE])}
            )


class OrderWordsExerciseForm(forms.ModelForm):
    class Meta:
        model = OrderWordsExercise
        fields = '__all__'

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self.fields['lesson'].widget.attrs.update({'class': f'{CSS_SELECT_STYLE}'})
        self.fields['order'].widget.attrs.update({'class': f'{CSS_INPUT_STYLE}'})
        self.fields['query'].widget.attrs.update({
            'class': f'{CONTROLLED_INPUT_CLASSNAME} {CSS_INPUT_STYLE}'
        })

        set_initial_order_for_exercise_forms(self.fields, kwargs)


class JoinPairFormset(inlineformset_factory(JoinWordsExercise, JoinPair,
                                            fields='__all__', extra=3)):
    def __init__(self, *args, **kwargs):
        super(JoinPairFormset, self).__init__(*args, **kwargs)

        for form in self.forms:
            form.fields['first'].widget.attrs.update(
                {'class': ' '.join([CONTROLLED_INPUT_CLASSNAME, CSS_INPUT_STYLE])}
            )
            form.fields['second'].widget.attrs.update(
                {'class': ' '.join([CONTROLLED_INPUT_CLASSNAME, CSS_INPUT_STYLE])}
            )


class JoinWordsExerciseForm(forms.ModelForm):
    class Meta:
        model = JoinWordsExercise
        fields = '__all__'
        widgets = {
            'image': CustomFileInput(),
            'audio': CustomFileInput(),
        }


    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self.fields['lesson'].widget.attrs.update({'class': f'{CSS_SELECT_STYLE}'})
        self.fields['order'].widget.attrs.update({'class': f'{CSS_INPUT_STYLE}'})
        self.fields['query'].widget.attrs.update({
            'class': f'{CONTROLLED_INPUT_CLASSNAME} {CSS_INPUT_STYLE}'
        })

        set_initial_order_for_exercise_forms(self.fields, kwargs)


class SentencePieceFormset(inlineformset_factory(CompleteExercise, SentencePiece,
                                                 fields='__all__', extra=3)):
    def __init__(self, *args, **kwargs):
        super(SentencePieceFormset, self).__init__(*args, **kwargs)

        for form in self.forms:
            form.fields['content'].widget.attrs.update(
                {'class': ' '.join([CONTROLLED_INPUT_CLASSNAME, CSS_INPUT_STYLE])}
            )


class CompleteExerciseForm(forms.ModelForm):
    class Meta:
        model = CompleteExercise
        fields = '__all__'
        widgets = {
            'image': CustomFileInput(),
            'audio': CustomFileInput(),
        }


    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self.fields['lesson'].widget.attrs.update({'class': f'{CSS_SELECT_STYLE}'})
        self.fields['order'].widget.attrs.update({'class': f'{CSS_INPUT_STYLE}'})
        self.fields['query'].widget.attrs.update({
            'class': f'{CONTROLLED_INPUT_CLASSNAME} {CSS_INPUT_STYLE}'
        })

        set_initial_order_for_exercise_forms(self.fields, kwargs)


class AnswerChoiceFormset(inlineformset_factory(ChooseRightAnswer, AnswerChoice,
                                                fields='__all__', extra=3)):
    def __init__(self, *args, **kwargs):
        super(AnswerChoiceFormset, self).__init__(*args, **kwargs)

        for form in self.forms:
            form.fields['content'].widget.attrs.update(
                {'class': ' '.join([CONTROLLED_INPUT_CLASSNAME, CSS_INPUT_STYLE])}
            )


class ChooseRightAnswerForm(forms.ModelForm):
    class Meta:
        model = ChooseRightAnswer
        fields = '__all__'
        widgets = {
            'image': CustomFileInput(),
            'audio': CustomFileInput(),
        }


    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self.fields['lesson'].widget.attrs.update({'class': f'{CSS_SELECT_STYLE}'})
        self.fields['order'].widget.attrs.update({'class': f'{CSS_INPUT_STYLE}'})
        self.fields['question'].widget.attrs.update({
            'class': f'{CONTROLLED_INPUT_CLASSNAME} {CSS_INPUT_STYLE}'
        })

        set_initial_order_for_exercise_forms(self.fields, kwargs)


class AnswerExerciseForm(forms.ModelForm):
    class Meta:
        model = AnswerExercise
        fields = '__all__'
        widgets = {
            'image': CustomFileInput(),
            'audio': CustomFileInput(),
        }


    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self.fields['lesson'].widget.attrs.update({'class': f'{CSS_SELECT_STYLE}'})
        self.fields['order'].widget.attrs.update({'class': f'{CSS_INPUT_STYLE}'})
        self.fields['question'].widget.attrs.update({
            'class': f'{CONTROLLED_INPUT_CLASSNAME} {CSS_INPUT_STYLE}'
        })
        self.fields['answer'].widget.attrs.update({
            'class': f'{CONTROLLED_INPUT_CLASSNAME} {CSS_INPUT_STYLE}'
        })

        set_initial_order_for_exercise_forms(self.fields, kwargs)


class TipTextForm(forms.ModelForm):
    class Meta:
        model = TipText
        fields = '__all__'
        widgets = {
            'image': CustomFileInput(),
            'audio': CustomFileInput(),
        }

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self.fields['lesson'].widget.attrs.update({'class': f'{CSS_SELECT_STYLE}'})
        self.fields['order'].widget.attrs.update({'class': f'{CSS_INPUT_STYLE}'})
        self.fields['text'].widget.attrs.update({
            'class': f'{CONTROLLED_INPUT_CLASSNAME} {CSS_INPUT_STYLE}'
        })

        set_initial_order_for_exercise_forms(self.fields, kwargs)
