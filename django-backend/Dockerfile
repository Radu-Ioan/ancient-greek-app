FROM python:3.10-slim

# Set work directory
WORKDIR /usr/src/ancient-greek-learning-app

# Copy and install dependencies
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy the rest of the application code
COPY . .

EXPOSE 8000

# Run the Django development server
CMD ["python", "/usr/src/ancient-greek-learning-app/manage.py", "runserver", "0.0.0.0:8000"]
