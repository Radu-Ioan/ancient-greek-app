from django.urls import path, re_path
from django.views.generic import TemplateView
from . import views
from .constants import *


urlpatterns = [
    path('api/lessons/', views.lesson_list),
    path('api/lessons/<int:lesson_id>/', views.lesson_detail),
    path('learning/admin/lessons/add/', views.custom_lesson_add, name=LESSON_ADD_VIEW),
    path('learning/admin/lessons/<int:lesson_id>/change/', views.custom_lesson_change,
         name=LESSON_CHANGE_VIEW),

    path('learning/admin/exercise/<int:exercise_id>/delete/',
         views.handle_delete_view, name="custom_exercise_delete"),

    path('learning/admin/lesson/<int:lesson_id>/answerexercise/add/',
         views.custom_answer_add,
         name=ANSWER_EXERCISE_ADD_VIEW),
    path('learning/admin/answerexercise/<int:exercise_id>/change/',
         views.custom_answer_change,
         name=ANSWER_EXERCISE_CHANGE_VIEW),

    path('learning/admin/lesson/<int:lesson_id>/chooserightanswer/add/',
         views.custom_chooserightanswer_add,
         name=CHOOSE_RIGHT_ANSWER_ADD_VIEW),
    path('learning/admin/chooserightanswer/<int:exercise_id>/change/',
         views.custom_chooserightanswer_change,
         name=CHOOSE_RIGHT_ANSWER_CHANGE_VIEW),

    path('learning/admin/lesson/<int:lesson_id>/completeexercise/add/',
         views.custom_complete_add,
         name=COMPLETE_EXERCISE_ADD_VIEW),
    path('learning/admin/completeexercise/<int:exercise_id>/change/',
         views.custom_complete_change,
         name=COMPLETE_EXERCISE_CHANGE_VIEW),

    path('learning/admin/lesson/<int:lesson_id>/joinwordsexercise/add/',
         views.custom_joinwords_add,
         name=JOIN_WORDS_ADD_VIEW),
    path('learning/admin/joinwordsexercise/<int:exercise_id>/change/',
         views.custom_joinwords_change,
         name=JOIN_WORDS_CHANGE_VIEW),

    path('learning/admin/lesson/<int:lesson_id>/orderwordsexercise/add/',
         views.custom_orderwords_add,
         name=ORDER_WORDS_EXERCISE_ADD_VIEW),
    path('learning/admin/orderwordsexercise/<int:exercise_id>/change/',
         views.custom_orderwords_change,
         name=ORDER_WORDS_EXERCISE_CHANGE_VIEW),

    path('learning/admin/lesson/<int:lesson_id>/tipexercise/add/',
         views.custom_tip_text_add,
         name=TIP_TEXT_EXERCISE_ADD_VIEW),
    path('learning/admin/tipexercise/<int:exercise_id>/change',
         views.custom_tip_text_change,
         name=TIP_TEXT_EXERCISE_CHANGE_VIEW),

    path('', TemplateView.as_view(template_name="index.html")),
]
