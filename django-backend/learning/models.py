from django.db import models, transaction
from django.db.models import F, Max
from django.contrib.auth.models import User
from django.urls import reverse

from .constants import (
    ANSWER_EXERCISE_CHANGE_VIEW,
    COMPLETE_EXERCISE_CHANGE_VIEW,
    CHOOSE_RIGHT_ANSWER_CHANGE_VIEW,
    JOIN_WORDS_CHANGE_VIEW,
    ORDER_WORDS_EXERCISE_CHANGE_VIEW
)


class LessonManager(models.Manager):
    def move(self, obj, new_order):
        qs = self.get_queryset().order_by('order')

        with transaction.atomic():
            if obj.order > int(new_order):
                qs.filter(
                    order__lt=obj.order,
                    order__gte=new_order,
                ).exclude(
                    pk=obj.pk
                ).update(
                    order=F('order') + 1,
                )
            else:
                qs.filter(
                    order__lte=new_order,
                    order__gt=obj.order,
                ).exclude(
                    pk=obj.pk,
                ).update(
                    order=F('order') - 1,
                )

            obj.order = new_order
            obj.save()

    def create(self, **kwargs):
        instance = self.model(**kwargs)

        with transaction.atomic():
            # Get our current max order number
            results = self.aggregate(
                Max('order')
            )

            # Increment and use it for our new object
            current_order = results['order__max']
            if current_order is None:
                current_order = 0

            value = current_order + 1
            instance.order = value
            instance.save()

            return instance


class Lesson(models.Model):
    title = models.CharField(max_length=100)
    description = models.TextField(max_length=300, default='')
    completed_by = models.ManyToManyField(User, related_name='completed_by',
                                          blank=True)
    order = models.IntegerField(default=1)
    objects = LessonManager()

    def __str__(self):
        return self.title

    def get_absolute_url(self):
        view_name = "custom_lesson_change"
        return reverse(view_name, kwargs={'lesson_id': self.pk})

    def delete(self, *args, **kwargs):
        # Custom delete logic
        with transaction.atomic():
            # Shift orders of other lessons
            Lesson.objects.filter(order__gt=self.order).update(order=F('order') - 1)
            super(Lesson, self).delete(*args, **kwargs)


class ExerciseManager(models.Manager):
    """ Manager to encapsulate bits of business logic """

    def move(self, obj, new_order):
        """ Move an object to a new order position """

        qs = self.get_queryset()

        with transaction.atomic():
            if obj.order > int(new_order):
                qs.filter(
                    lesson=obj.lesson,
                    order__lt=obj.order,
                    order__gte=new_order,
                ).exclude(
                    pk=obj.pk
                ).update(
                    order=F('order') + 1,
                )
            else:
                qs.filter(
                    lesson=obj.lesson,
                    order__lte=new_order,
                    order__gt=obj.order,
                ).exclude(
                    pk=obj.pk,
                ).update(
                    order=F('order') - 1,
                )

            obj.order = new_order
            obj.save()

    def create(self, **kwargs):
        instance = self.model(**kwargs)

        with transaction.atomic():
            # Get our current max order number
            results = Exercise.objects.filter(
                lesson=instance.lesson
            ).aggregate(
                Max('order')
            )

            # Increment and use it for our new object
            current_order = results['order__max']
            if current_order is None:
                current_order = 0

            value = current_order + 1
            instance.order = value
            instance.save()

            return instance

    def custom_delete(self, obj):
        """Makes a deletion and update the orders"""
        qs = self.get_queryset()

        with transaction.atomic():
            qs.filter(
                lesson=obj.lesson,
                order__gt=obj.order,
            ).exclude(
                pk=obj.pk,
            ).update(
                order=F('order') - 1,
            )

            obj.delete()


class Exercise(models.Model):
    type = models.CharField(max_length=30, choices=[], default='', editable=False)
    lesson = models.ForeignKey(
        Lesson,
        models.CASCADE,
        related_name='exercises'
    )
    order = models.IntegerField(default=1)
    image = models.ImageField(upload_to="exercises_images", null=True, blank=True)
    audio = models.FileField(upload_to="exercises_audios", null=True, blank=True)
    scored = models.BooleanField(default=True)
    objects = ExerciseManager()

    class Meta:
        index_together = ('lesson', 'order')

    def __str__(self):
        return f'{self.type} id={self.id}'

    def save(self, *args, **kwargs):
        if not self.type:
            self.type = self.__class__.__name__
        super().save(*args, **kwargs)

    def get_absolute_url(self):
        from django.urls import reverse
        view_names_map = {
            AnswerExercise.__name__: ANSWER_EXERCISE_CHANGE_VIEW,
            ChooseRightAnswer.__name__: CHOOSE_RIGHT_ANSWER_CHANGE_VIEW,
            CompleteExercise.__name__: COMPLETE_EXERCISE_CHANGE_VIEW,
            JoinWordsExercise.__name__: JOIN_WORDS_CHANGE_VIEW,
            OrderWordsExercise.__name__: ORDER_WORDS_EXERCISE_CHANGE_VIEW,
        }
        view_name = view_names_map.get(self.type, None)

        if view_name is None:
            return "#"

        return reverse(view_name, kwargs={'exercise_id': self.pk})

    def get_display(self):
        # Create a dictionary to map exercise types to their respective model classes
        exercise_classes = {
            AnswerExercise.__name__: AnswerExercise,
            ChooseRightAnswer.__name__: ChooseRightAnswer,
            CompleteExercise.__name__: CompleteExercise,
            JoinWordsExercise.__name__: JoinWordsExercise,
            OrderWordsExercise.__name__: OrderWordsExercise,
        }

        # Get the model class based on the type
        model_class = exercise_classes.get(self.type, None)

        # If the model class is found, get the instance and return its string representation
        if model_class:
            # Ensure we catch exceptions in case the instance is not found
            try:
                instance = model_class.objects.get(pk=self.pk)
                return str(instance)
            except model_class.DoesNotExist:
                return f"Instance of type {self.type} with pk={self.pk} does not exist."

        # If no model class is found, return a default string
        return f"Unknown exercise type: {self.type}"


class OrderWordsExercise(Exercise):
    query = models.CharField(max_length=60, default="Put the words in order")

    def __str__(self):
        return ' '.join(wordpiece.content for wordpiece in self.wordpiece_set.all())


class WordPiece(models.Model):
    content = models.CharField(max_length=50)
    sentence = models.ForeignKey(OrderWordsExercise, on_delete=models.CASCADE)

    def __str__(self):
        return self.content


class JoinWordsExercise(Exercise):
    query = models.CharField(max_length=60, default="Match the pairs")

    def __str__(self):
        return ", ".join(str(pair) for pair in self.joinpair_set.all())


class JoinPair(models.Model):
    first = models.CharField(max_length=70)
    second = models.CharField(max_length=70)
    exercise = models.ForeignKey(JoinWordsExercise, on_delete=models.CASCADE)

    def __str__(self):
        return self.first + " <-> " + self.second


class CompleteExercise(Exercise):
    query = models.CharField(max_length=60, default="Complete the sentence")

    def __str__(self):
        return " ".join(str(piece) for piece in self.sentencepiece_set.all())


class SentencePiece(models.Model):
    content = models.CharField(max_length=500)
    # indicates whether the user should complete
    hidden = models.BooleanField(default=False)
    sentence = models.ForeignKey(CompleteExercise,
                                 on_delete=models.CASCADE)

    def __str__(self):
        return f"[{self.content}]" if self.hidden else self.content


class ChooseRightAnswer(Exercise):
    question = models.CharField(max_length=300)

    def __str__(self):
        display = (f"({answer.content})" for answer in self.answerchoice_set.all())
        return self.question + ' ? ' + ' '.join(display)


class AnswerChoice(models.Model):
    content = models.CharField(max_length=80)
    is_correct = models.BooleanField(default=False)
    exercise = models.ForeignKey(ChooseRightAnswer, on_delete=models.CASCADE)

    def __str__(self):
        return self.content


class AnswerExercise(Exercise):
    question = models.CharField(max_length=500)
    answer = models.CharField(max_length=50)

    def __str__(self):
        return "Q: [{}], A: [{}]".format(self.question, self.answer)


class TipText(Exercise):
    # markdown
    text = models.TextField()

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self.scored = False


class WordFlashcard(Exercise):
    original_word = models.CharField(max_length=100)
    translated_word = models.CharField(max_length=100)

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self.scored = False
