FROM python:3.9

WORKDIR /code

COPY ./requirements.txt /code/requirements.txt

RUN pip install --no-cache-dir --upgrade -r /code/requirements.txt

COPY ./ /code/app

ENV FLASK_APP=/code/app/api.py

CMD [ "python3", "-m" , "flask", "run", "--host=0.0.0.0", "--port=5001" ]