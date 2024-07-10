from django.contrib import admin
from django import forms
from django.shortcuts import redirect
from django.utils.html import format_html

from .constants import *
from .models import (
    Lesson, Exercise, OrderWordsExercise, WordPiece,
    JoinWordsExercise, JoinPair, CompleteExercise, SentencePiece,
    ChooseRightAnswer, AnswerChoice, AnswerExercise
)


class ExerciseInline(admin.TabularInline):
    template = "learning/edit.html"
    model = Exercise
    readonly_fields = ('id', 'type',)
    extra = 0


class LessonAdmin(admin.ModelAdmin):
    ordering = ['order']
    list_display = ['lesson_link', 'sort_field', 'id']

    def sort_field(self, obj):
        return format_html("<span>{}</span>", obj.order)

    sort_field.short_description = "order"

    def lesson_link(self, obj):
        return format_html("<a href={}>{}</a>", obj.get_absolute_url(), str(obj))

    lesson_link.short_description = "title"

    def add_view(self, request, form_url="", extra_context=None):
        return redirect(LESSON_ADD_VIEW)

    def delete_queryset(self, request, queryset):
        # Call the original delete_queryset method to perform the delete action
        super().delete_queryset(request, queryset)

        # Execute custom logic after delete action
        # Reset order field for remaining lessons
        remaining_lessons = Lesson.objects.all().order_by('order')
        count = 1
        for lesson in remaining_lessons:
            lesson.order = count
            lesson.save()
            count += 1


class ExerciseAdmin(admin.ModelAdmin):
    readonly_fields = ('id', 'type',)
    change_form_template = "learning/exercise_edit.html"

    def add_view(self, request, form_url="", extra_context=None):
        extra_context = extra_context or {}
        type_list = [cls.__name__ for cls in Exercise.__subclasses__()]
        extra_context["type_list"] = type_list

        return super().add_view(request, form_url, extra_context)

    def change_view(self, request, object_id, form_url="", extra_context=None):
        extra_context = extra_context or {}

        exercise = Exercise.objects.get(pk=object_id)
        extra_context["exercise"] = exercise

        return super().change_view(
            request,
            object_id,
            form_url,
            extra_context=extra_context,
        )


class WordPieceInline(admin.TabularInline):
    model = WordPiece
    extra = 5


class OrderWordsExerciseAdmin(admin.ModelAdmin):
    change_form_template = "learning/orderwordsexercise_edit.html"
    inlines = [WordPieceInline]
    readonly_fields = ['id', 'type']


class JoinPairInline(admin.TabularInline):
    model = JoinPair
    extra = 1


class JoinWordsExerciseAdmin(admin.ModelAdmin):
    change_form_template = "learning/joinwordsexercise_edit.html"
    inlines = [JoinPairInline]
    readonly_fields = ['id', 'type']


class SentencePieceInline(admin.TabularInline):
    model = SentencePiece
    extra = 4


class CompleteExerciseAdmin(admin.ModelAdmin):
    change_form_template = "learning/completeexercise_edit.html"
    inlines = [SentencePieceInline]
    readonly_fields = ['id', 'type']


class AnswerChoiceInlineFormset(forms.models.BaseInlineFormSet):
    def clean(self):
        super(AnswerChoiceInlineFormset, self).clean()

        count = 0
        for form in self.forms:
            try:
                print("form: ", form)

                if form.clean_data:
                    count += 1
                print("form.clean_data:", form.clean_data)

            except AttributeError:
                count += 1
                pass

        if count < 1:
            raise forms.ValidationError("At least 2 answer choices are required.")


class AnswerChoiceInline(admin.TabularInline):
    model = AnswerChoice
    extra = 3
    formset = AnswerChoiceInlineFormset


class ChooseRightAnswerAdmin(admin.ModelAdmin):
    change_form_template = "learning/chooserightanswer_edit.html"
    inlines = [AnswerChoiceInline]
    readonly_fields = ['id', 'type']


class AnswerExerciseAdmin(admin.ModelAdmin):
    change_form_template = "learning/answerexercise_edit.html"
    readonly_fields = ['id', 'type']


custom_admin = False


def setup():
    if custom_admin:
        ...
    else:
        admin.site.register(Lesson, LessonAdmin)
        admin.site.register(Exercise, ExerciseAdmin)
        admin.site.register(OrderWordsExercise, OrderWordsExerciseAdmin)
        admin.site.register(JoinWordsExercise, JoinWordsExerciseAdmin)
        admin.site.register(CompleteExercise, CompleteExerciseAdmin)
        admin.site.register(ChooseRightAnswer, ChooseRightAnswerAdmin)
        admin.site.register(AnswerExercise, AnswerExerciseAdmin)

        admin.site.site_header = "Learning material management"


setup()
