FROM python:3.7

RUN mkdir /srv/app
WORKDIR /srv/app
COPY . /srv/app

# install dependencies
RUN pip install -r requirements.txt
ENV FLASK_APP api/app.py
ENV FLASK_ENV development
CMD ["python", "api/app.py"]
