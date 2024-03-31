FROM node:latest as build

ARG API_URL=http://localhost:45334
ARG BASE_NAME=/

WORKDIR /app
COPY ./frontend .
RUN npm i
RUN echo VITE_API_URL=${API_URL} > .env
RUN echo VITE_BASE_NAME=${BASE_NAME} >> .env
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
ENV STORAGE_STATIC=/app/static

COPY --from=build /app/dist ./static 

COPY ./api ./api

CMD ["python3", "/app/api/index.py"]