from rest_framework import serializers
from .models import (
    Lesson, Exercise, OrderWordsExercise, WordPiece,
    CompleteExercise, JoinWordsExercise,
    ChooseRightAnswer, AnswerExercise
)
from django.contrib.auth.models import User
from random import shuffle


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username', 'email']


class WordPieceSerializer(serializers.ModelSerializer):
    class Meta:
        model = WordPiece
        fields = '__all__'


class ExerciseSerializer(serializers.ModelSerializer):
    class Meta:
        model = Exercise
        fields = '__all__'

    # return list(filter(lambda s: not s.startswith('_'), dir(obj)))


class OrderWordsExerciseSerializer(serializers.ModelSerializer):
    wordpieces = serializers.SerializerMethodField()

    class Meta:
        model = OrderWordsExercise
        fields = '__all__'

    def get_wordpieces(self, obj):
        if obj.type != OrderWordsExercise.__name__:
            return []

        arrangeword_ex = obj.orderwordsexercise
        return [w.content for w in arrangeword_ex.wordpiece_set.all()]


class JoinWordsExerciseSerializer(serializers.ModelSerializer):
    joinpairs = serializers.SerializerMethodField()

    class Meta:
        model = JoinWordsExercise
        fields = '__all__'

    def get_joinpairs(self, obj):
        if obj.type != JoinWordsExercise.__name__:
            return []

        joinwordsexercise = obj.joinwordsexercise

        first = [{'text': pair.first, 'index': index}
                 for index, pair in enumerate(joinwordsexercise.joinpair_set.all())]
        second = [{'text': pair.second, 'index': index}
                 for index, pair in enumerate(joinwordsexercise.joinpair_set.all())]

        shuffle(first)
        shuffle(second)

        return {'columnOne': first, 'columnTwo': second}


class CompleteExerciseSerializer(serializers.ModelSerializer):
    text_items = serializers.SerializerMethodField()

    class Meta:
        model = CompleteExercise
        fields = '__all__'

    def get_text_items(self, obj):
        complete_exercise = obj.completeexercise

        return [{'text': item.content, 'hidden': item.hidden}
                for item in complete_exercise.sentencepiece_set.all()]


class ChooseRightAnswerSerializer(serializers.ModelSerializer):
    answer_choices = serializers.SerializerMethodField()
    multi_choice = serializers.SerializerMethodField()

    class Meta:
        model = ChooseRightAnswer
        fields = '__all__'

    def get_answer_choices(self, obj):
        exercise = obj.chooserightanswer
        choices = [{'text': choice.content, 'isCorrect': choice.is_correct}
                   for choice in exercise.answerchoice_set.all()]
        shuffle(choices)
        return choices

    def get_multi_choice(self, obj):
        correct_answers = filter(lambda choice: choice.is_correct, obj.chooserightanswer.answerchoice_set.all())
        count = 0
        for _ in correct_answers:
            count += 1
            if count > 1:
                return True
        return False


class AnswerExerciseSerializer(serializers.ModelSerializer):
    class Meta:
        model = AnswerExercise
        fields = '__all__'


class LessonSoftSerializer(serializers.ModelSerializer):
    completed = serializers.SerializerMethodField()

    class Meta:
        model = Lesson
        exclude = ['completed_by', ]

    def get_completed(self, obj):
        user = self.context.get('user')

        if user and user.is_authenticated:
            return obj.completed_by.filter(pk=user.pk).exists()

        return False


class LessonDeepSerializer(serializers.ModelSerializer):
    exercises = serializers.SerializerMethodField()
    completed = serializers.SerializerMethodField()

    class Meta:
        model = Lesson
        exclude = ['completed_by']

    def get_exercises(self, obj):
        exercise_list = []

        for e in obj.exercises.all():
            exercise_serializer = None

            if e.type == OrderWordsExercise.__name__:
                exercise_serializer = OrderWordsExerciseSerializer(e.orderwordsexercise)
            elif e.type == JoinWordsExercise.__name__:
                exercise_serializer = JoinWordsExerciseSerializer(e.joinwordsexercise)
            elif e.type == CompleteExercise.__name__:
                exercise_serializer = CompleteExerciseSerializer(e.completeexercise)
            elif e.type == ChooseRightAnswer.__name__:
                exercise_serializer = ChooseRightAnswerSerializer(e.chooserightanswer)
            elif e.type == AnswerExercise.__name__:
                exercise_serializer = AnswerExerciseSerializer(e.answerexercise)

            if exercise_serializer:
                exercise_list.append(exercise_serializer.data)

        return exercise_list

    def get_completed(self, obj):
        user = self.context.get('user')

        if user and user.is_authenticated:
            return obj.completed_by.filter(pk=user.pk).exists()

        return False


class LessonSerializer(serializers.ModelSerializer):
    completed = serializers.SerializerMethodField()

    class Meta:
        model = Lesson
        # fields = '__all__'
        exclude = ['completed_by']

    def get_completed(self, obj):
        user = self.context.get('user')

        if user and user.is_authenticated:
            return obj.completed_by.filter(pk=user.pk).exists()

        return False
