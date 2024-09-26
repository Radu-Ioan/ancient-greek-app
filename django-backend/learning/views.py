from rest_framework.decorators import api_view, authentication_classes, permission_classes
from rest_framework.response import Response
from rest_framework import status
from rest_framework_simplejwt.authentication import JWTAuthentication
from rest_framework.permissions import IsAuthenticated

from .models import (
    Lesson, Exercise, OrderWordsExercise, TipText, User, JoinWordsExercise,
    CompleteExercise, AnswerExercise, ChooseRightAnswer,
)
from .serializers import LessonDeepSerializer, LessonSoftSerializer

from django.core.exceptions import PermissionDenied
from django.shortcuts import render, redirect, get_object_or_404
from django.urls import reverse

from .forms import (
    LessonForm,
    JoinWordsExerciseForm, JoinPairFormset,
    OrderWordsExerciseForm, WordPieceFormSet,
    CompleteExerciseForm, SentencePieceFormset,
    ChooseRightAnswerForm, AnswerChoiceFormset,
    AnswerExerciseForm,
    TipTextForm,
)

from .constants import (
    LESSON_CHANGE_VIEW, ANSWER_EXERCISE_ADD_VIEW,
    CHOOSE_RIGHT_ANSWER_ADD_VIEW,
    COMPLETE_EXERCISE_ADD_VIEW, JOIN_WORDS_ADD_VIEW,
    ORDER_WORDS_EXERCISE_ADD_VIEW, TIP_TEXT_EXERCISE_ADD_VIEW
)

import logging

logger = logging.getLogger(__name__)


@api_view(['GET'])
@authentication_classes([JWTAuthentication])
@permission_classes([IsAuthenticated])
def lesson_list(request):
    all_lessons = Lesson.objects.all()
    context = {'user': request.user}
    all_lessons_serializer = LessonSoftSerializer(all_lessons, many=True,
                                                  context=context)

    response_data = all_lessons_serializer.data

    return Response(response_data)


@api_view(['GET', 'POST'])
@authentication_classes([JWTAuthentication])
@permission_classes([IsAuthenticated])
def lesson_detail(request, lesson_id: int):
    lesson = Lesson.objects.get(pk=lesson_id)

    if request.method == 'POST':
        print("request.data:", request.data)

        if request.data.get('completed'):
            user_obj = User.objects.get(username=request.user)
            lesson.completed_by.add(user_obj)
            lesson.save()
            response_data = {'info': f"Lesson {lesson.id} marked completed by user {request.user}"}
        else:
            response_data = {'info': "'completed' attribute was not found in the post data"}

        return Response(response_data)

    context = {'user': request.user}
    lesson_serializer = LessonDeepSerializer(lesson, context=context)
    response_data = lesson_serializer.data

    return Response(response_data)


def admin_authorization(view):
    def inner(*args, **kwargs):
        request = args[0]

        if not request.user.is_staff:
            raise PermissionDenied()

        return view(*args, **kwargs)

    return inner


@api_view(['POST', ])
@admin_authorization
def move_lesson(request, lesson_id):
    obj = Lesson.objects.get(pk=lesson_id)
    new_order = request.data.get('order', None)

    if new_order is None:
        return Response(
            data={'error': "No order given"},
            status=status.HTTP_400_BAD_REQUEST
        )

    if int(new_order) < 1:
        return Response(
            data={'error': "Order cannot be zero or below"},
            status=status.HTTP_400_BAD_REQUEST
        )

    Lesson.objects.move(obj, new_order)

    return Response({'success': True, 'order': new_order})


add_view_descriptions = {
    ANSWER_EXERCISE_ADD_VIEW: "Answer",
    COMPLETE_EXERCISE_ADD_VIEW: "Complete",
    CHOOSE_RIGHT_ANSWER_ADD_VIEW: "Choose right answer",
    JOIN_WORDS_ADD_VIEW: "Join words",
    ORDER_WORDS_EXERCISE_ADD_VIEW: "Order words",
    TIP_TEXT_EXERCISE_ADD_VIEW: "Tip text",
}


@admin_authorization
def custom_lesson_add(request):
    if request.method == 'POST':
        form = LessonForm(request.POST)

        if form.is_valid():
            # this create method will place the lesson at the end regardless of
            # the order entered by the user
            lesson = Lesson.objects.create(**form.cleaned_data)
            # and here, we place it into the correct spot
            Lesson.objects.move(lesson, form.cleaned_data['order'])

            view_name = request.POST.get('exercise_type')

            if view_name:
                if view_name not in add_view_descriptions:
                    return redirect(request.path)

                next_url = reverse(view_name, args=(lesson.pk,))
                return redirect(next_url)

            return redirect("admin:learning_lesson_changelist")
    else:
        form = LessonForm()

    exercises = []

    context = {
        'form': form,
        'exercises': exercises,
        'add_view_names': add_view_descriptions
    }

    return render(request, "learning/custom_admin/lesson/add.html", context)


@admin_authorization
def custom_lesson_change(request, lesson_id):
    lesson = get_object_or_404(Lesson, pk=lesson_id)

    if request.method == 'POST':
        current_order = lesson.order
        form = LessonForm(request.POST, instance=lesson)

        if form.is_valid():
            lesson.order = current_order
            Lesson.objects.move(lesson, form.cleaned_data['order'])
            form.save()

            view_name = request.POST.get('exercise_type')

            if view_name:
                if view_name not in add_view_descriptions:
                    return redirect(request.path)

                next_url = reverse(view_name, args=(lesson.pk,))
                return redirect(next_url)

            return redirect("admin:learning_lesson_changelist")
    else:
        form = LessonForm(instance=lesson)

    exercises = Exercise.objects.filter(lesson=lesson).order_by('order')

    context = {
        'form': form,
        'exercises': exercises,
        'lesson_id': lesson_id,
        'add_view_names': add_view_descriptions
    }

    return render(request, "learning/custom_admin/lesson/change.html", context)


def handle_add_request(request, lesson_id, FormClass, FormsetClass, prefix, template_filepath):
    lesson = get_object_or_404(Lesson, pk=lesson_id)

    if request.method == 'POST':
        form = FormClass(request.POST, request.FILES)
        formset = FormsetClass(request.POST, request.FILES, prefix=prefix)

        if form.is_valid() and formset.is_valid():
            model_class = FormClass.Meta.model
            exercise = model_class.objects.create(**form.cleaned_data)
            Exercise.objects.move(exercise, form.cleaned_data['order'])

            # exercise = form.save()
            formset.instance = exercise
            formset.save()

            lesson_id = exercise.lesson.pk
            next_url = reverse(LESSON_CHANGE_VIEW, args=(lesson_id,))
            return redirect(next_url)
    else:
        form = FormClass(initial={'lesson': lesson})
        formset = FormsetClass(prefix=prefix)

    context = {
        'form': form,
        'formset': formset,
        'formset_form': formset.form,
        'lesson_id': str(lesson_id),
        'prefix': prefix
    }

    return render(request, template_filepath, context)


def handle_change_request(request, exercise_id, ExerciseModel, FormClass,
                          FormsetClass, prefix, template_filepath):
    exercise = get_object_or_404(ExerciseModel, pk=exercise_id)

    if request.method == 'POST':
        current_order = exercise.order
        form = FormClass(request.POST, request.FILES, instance=exercise)
        formset = FormsetClass(request.POST, request.FILES, instance=exercise,
                               prefix=prefix)

        if form.is_valid() and formset.is_valid():
            exercise.order = current_order
            Exercise.objects.move(exercise, form.cleaned_data['order'])
            exercise = form.save()
            formset.instance = exercise
            formset.save()

            lesson_id = exercise.lesson.pk
            next_url = reverse(LESSON_CHANGE_VIEW, args=(lesson_id,))
            return redirect(next_url)
    else:
        form = FormClass(instance=exercise)
        formset = FormsetClass(instance=exercise, prefix=prefix)

    context = {
        'form': form,
        'formset': formset,
        'formset_form': formset.form,
        'lesson_id': str(exercise.lesson.pk),
        'prefix': prefix
    }

    return render(request, template_filepath, context)


@admin_authorization
def handle_delete_view(request, exercise_id):
    if request.method != 'POST':
        return redirect(request.path)

    to_delete = Exercise.objects.get(pk=exercise_id)
    next_url = reverse(LESSON_CHANGE_VIEW, args=(to_delete.lesson.pk, ))
    Exercise.objects.custom_delete(to_delete)
    return redirect(next_url)


@admin_authorization
def custom_answer_add(request, lesson_id):
    lesson = get_object_or_404(Lesson, pk=lesson_id)

    if request.method == 'POST':
        form = AnswerExerciseForm(request.POST, request.FILES)

        if form.is_valid():
            exercise = AnswerExercise.objects.create(**form.cleaned_data)
            Exercise.objects.move(exercise, form.cleaned_data['order'])

            # exercise = form.save()
            lesson_id = exercise.lesson.pk
            next_url = reverse(LESSON_CHANGE_VIEW, args=(lesson_id,))
            return redirect(next_url)
    else:
        form = AnswerExerciseForm(initial={'lesson': lesson})

    context = {
        'form': form,
        'lesson_id': lesson_id
    }

    return render(request, "learning/custom_admin/answerexercise/add.html", context)


@admin_authorization
def custom_answer_change(request, exercise_id):
    exercise = get_object_or_404(AnswerExercise, pk=exercise_id)

    if request.method == 'POST':
        current_order = exercise.order
        form = AnswerExerciseForm(request.POST, request.FILES, instance=exercise)

        if form.is_valid():
            exercise.order = current_order
            Exercise.objects.move(exercise, form.cleaned_data['order'])
            exercise = form.save()

            lesson_id = exercise.lesson.pk
            next_url = reverse(LESSON_CHANGE_VIEW, args=(lesson_id,))
            return redirect(next_url)
    else:
        form = AnswerExerciseForm(instance=exercise)

    context = {
        'form': form,
        'lesson_id': str(exercise.lesson.pk),
    }

    return render(request, "learning/custom_admin/answerexercise/change.html", context)


@admin_authorization
def custom_chooserightanswer_add(request, lesson_id):
    return handle_add_request(
        request, lesson_id, ChooseRightAnswerForm, AnswerChoiceFormset,
        'answerchoice', "learning/custom_admin/chooserightanswer/add.html"
    )


@admin_authorization
def custom_chooserightanswer_change(request, exercise_id):
    return handle_change_request(
        request, exercise_id,
        ChooseRightAnswer, ChooseRightAnswerForm, AnswerChoiceFormset,
        'answerchoice', "learning/custom_admin/chooserightanswer/change.html"
    )


@admin_authorization
def custom_complete_add(request, lesson_id):
    return handle_add_request(
        request, lesson_id,
        CompleteExerciseForm, SentencePieceFormset,
        'sentencepiece', "learning/custom_admin/completeexercise/add.html"
    )


@admin_authorization
def custom_complete_change(request, exercise_id):
    return handle_change_request(
        request, exercise_id,
        CompleteExercise, CompleteExerciseForm, SentencePieceFormset,
        'sentencepiece', "learning/custom_admin/completeexercise/change.html"
    )


@admin_authorization
def custom_joinwords_add(request, lesson_id):
    return handle_add_request(
        request, lesson_id, JoinWordsExerciseForm, JoinPairFormset,
        'joinpair', "learning/custom_admin/joinwordsexercise/add.html"
    )


@admin_authorization
def custom_joinwords_change(request, exercise_id):
    return handle_change_request(
        request, exercise_id,
        JoinWordsExercise, JoinWordsExerciseForm, JoinPairFormset,
         'joinpair', "learning/custom_admin/joinwordsexercise/change.html"
    )


@admin_authorization
def custom_orderwords_add(request, lesson_id):
    return handle_add_request(
        request, lesson_id, OrderWordsExerciseForm, WordPieceFormSet,
        'wordpiece', "learning/custom_admin/orderwordsexercise/add.html"
    )


@admin_authorization
def custom_orderwords_change(request, exercise_id):
    return handle_change_request(
        request, exercise_id,
        OrderWordsExercise, OrderWordsExerciseForm, WordPieceFormSet,
        'wordpiece', "learning/custom_admin/orderwordsexercise/change.html"
    )


@admin_authorization
def custom_tip_text_add(request, lesson_id):
    lesson = get_object_or_404(Lesson, pk=lesson_id)

    if request.method == 'POST':
        form = TipTextForm(request.POST, request.FILES)

        if form.is_valid():
            exercise = TipText.objects.create(**form.cleaned_data)
            TipText.objects.move(exercise, form.cleaned_data['order'])

            # exercise = form.save()
            lesson_id = exercise.lesson.pk
            next_url = reverse(LESSON_CHANGE_VIEW, args=(lesson_id,))
            return redirect(next_url)
    else:
        form = TipTextForm(initial={'lesson': lesson})

    context = {
        'form': form,
        'lesson_id': lesson_id
    }

    return render(request, "learning/custom_admin/tipexercise/add.html", context)


@admin_authorization
def custom_tip_text_change(request, exercise_id):
    exercise = get_object_or_404(TipText, pk=exercise_id)

    if request.method == 'POST':
        current_order = exercise.order
        form = TipTextForm(request.POST, request.FILES, instance=exercise)

        if form.is_valid():
            exercise.order = current_order
            Exercise.objects.move(exercise, form.cleaned_data['order'])
            exercise = form.save()

            lesson_id = exercise.lesson.pk
            next_url = reverse(LESSON_CHANGE_VIEW, args=(lesson_id,))
            return redirect(next_url)
    else:
        form = TipTextForm(instance=exercise)

    context = {
        'form': form,
        'lesson_id': str(exercise.lesson.pk),
    }

    return render(request, "learning/custom_admin/tipexercise/change.html", context)
