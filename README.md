# Description

Visit https://raduz.pythonanywhere.com to see a demo launch of the
application.

The project aims to support the persons who study ancient greek to learn 
in a game-based fashion.

The program provides various types of exercises grouped in lessons.

The administrator is the one who creates and fills the lessons with
exercises using his available interface.

Currently, the database is rather filled with dummy data, altough it contains
real words, and it's not yet suitable for a real case learning, but you can use
the program easily.

# How to run the app locally

Make sure you have installed python 3 on your computer.  
After cloning the repository, navigate in _django-backend/_ using the terminal.

### Create a virtual environemnt [optional step, but a good practice]

- From _django-backend/_ directory, create the environment: `python -m venv venv`
- And then activate it:
  - `venv\Scripts\activate` on Windows
  - `source env/bin/activate` on Linux/MacOS

## Run the server

From the same _django-backend/_ folder, run: `py manage.py runserver 8000`

> Important: don't use another port, as the frontend build files use above 8000 port
> for communication

Now you may navigate to http://localhost:8000/ in the browser and use the app.


## Run with docker

From _django-backend/_, create the image for the program:  

`docker build -t ancient-greek-app .`  

Then you can start a container with the app:

`docker container run -p 8000:8000 ancient-greek-app`

## Develop the frontend

You can also navigate to _react-frontend/_ and execute `npm run dev` to turn on
the development Vite server and see the client code project.  

After making a new version for the frontend, in order to serve the files from the
django server, please execute `npm run build` in _react-frontend/_ and copy the
generated _build/_ directory into _django-backend_ - overriding the previous one.




