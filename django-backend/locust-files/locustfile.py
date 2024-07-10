import random
from locust import HttpUser, TaskSet, task, between
import custom_stats


class UserBehavior(TaskSet):
    def on_start(self):
        self.login()

    def login(self):
        response = self.client.post("/account/api/token/", json={
            "username": "radu",
            "password": "student"
        }, timeout=10)
        json_data = response.json()
        self.token = json_data.get("access")
        self.client.headers.update({"Authorization": f"Bearer {self.token}"})

    @task(1)
    def get_lessons(self):
        self.client.get("/api/lessons/")

    @task(2)
    def get_lesson_detail(self):
        lesson_id = random.choice([2, 7, 4, 3, 35])
        self.client.get(f"/api/lessons/{lesson_id}/")


class WebsiteUser(HttpUser):
    tasks = [UserBehavior]
    wait_time = between(1, 5)

    def on_start(self):
        self.client.headers.update({"Content-Type": "application/json"})

    def on_stop(self):
        self.client.headers.pop("Authorization", None)
