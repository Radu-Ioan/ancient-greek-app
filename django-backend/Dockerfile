FROM alpine:3.15
RUN apk add --update py3-pip
RUN python3 -m venv /venv
ENV PATH="/venv/bin/:$PATH"

# Set work directory
WORKDIR /usr/src/ancient-greek-learning-app
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY . .

EXPOSE 8000

CMD ["python3", "/usr/src/ancient-greek-learning-app/manage.py", "runserver", "0.0.0.0:8000"]

