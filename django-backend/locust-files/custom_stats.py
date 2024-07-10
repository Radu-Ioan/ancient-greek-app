import locust.stats
from locust.stats import RequestStats
import numpy as np


# Extend the RequestStats class to add median calculation
class CustomRequestStats(RequestStats):
    def __init__(self):
        super().__init__()

    @property
    def median_response_time(self):
        if len(self.response_times) == 0:
            return 0
        return np.median(self.response_times)


# Override the request stats instance with our custom one
locust.stats.request_stats = CustomRequestStats()
