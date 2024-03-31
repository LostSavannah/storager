FROM node:latest as build

WORKDIR /app
COPY ./frontend .
RUN npm i
RUN npm run build

FROM python:latest

WORKDIR /app

COPY ./requirements.txt .
RUN pip install -r ./requirements.txt

RUN mkdir /storage
RUN chmod 777 /storage
RUN echo example > /storage/file.txt

ENV STORAGE_CONFIGURATION_FILE_LOCATION=/app/api/config/storage_configuration.json
ENV STORAGE_PORT=45334
ENV STORAGE_HOST=0.0.0.0

COPY --from=build /app/dist ./frontend 

COPY ./api ./api

CMD ["python3", "/app/api/index.py"]