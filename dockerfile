FROM ubuntu:latest

WORKDIR /app

ENV STORAGE_CONFIGURATION_FILE_LOCATION=/app/api/config/storage_configuration.json
ENV STORAGE_PORT=45334
ENV STORAGE_HOST=0.0.0.0

RUN apt-get update
RUN apt-get install -y python3.11 python3-venv python3-pip

COPY ./requirements.txt .
RUN pip install -r ./requirements.txt

COPY ./api ./api

RUN mkdir /storage
RUN chmod 777 /storage
RUN echo example > /storage/file.txt

COPY ./frontend/dist ./frontend 

CMD ["python3", "/app/api/index.py"]