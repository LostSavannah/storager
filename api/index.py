from core.jsonfile import JsonFile
from core.models import CreateStorageRequest
from core.storage import StorageProvider, Storage
from core.storage_types.local import LocalStorage
from core.storage_types.memory import MemoryStorage
from core.storage_types.ftp import FtpStorage
from core.http import configure_cors, SPAStaticFiles
from fastapi import FastAPI, UploadFile
from fastapi.responses import StreamingResponse
from io import BytesIO
import os
import uvicorn

json_file_location = os.environ["STORAGE_CONFIGURATION_FILE_LOCATION"]
port:int = int(os.environ["STORAGE_PORT"])
host:str = os.environ["STORAGE_HOST"]

storage_provider = StorageProvider()
storage_provider.include({
    "local": LocalStorage,
    "memory": MemoryStorage,
    "ftp": FtpStorage
})

app = configure_cors(FastAPI())


@app.get("/storages")
def get_storages():
    with JsonFile(json_file_location) as data:
        return([name for name in data])

@app.post("/storage")
def create_storage(storage:CreateStorageRequest):
    with JsonFile(json_file_location) as data:
        data[storage.name] = {
            "kind": storage.kind,
            "params": storage.params
        }
        return(data[storage.name])

@app.post("/storages/{name}/{location:path}")
async def upload_file(name:str, location:str, file:UploadFile):
    with JsonFile(json_file_location) as data:
        storage:Storage = storage_provider.get_storage(**data[name])
        storage.upload_file(location, await file.read())
        return {
            "location": location
        }

@app.get("/storages/{name}/download:{location:path}")
def download_file(name:str, location:str):
    with JsonFile(json_file_location) as data:
        storage:Storage = storage_provider.get_storage(**data[name])
        file, filename = storage.download_file(location)
        return StreamingResponse(
            BytesIO(file), headers={
                "Content-Disposition": f'attachment; filename="{filename}"'
            }
        )

@app.get("/storages/{name}/{location:path}")
def get_directories(name:str, location:str):
    with JsonFile(json_file_location) as data:
        storage:Storage = storage_provider.get_storage(**data[name])
        return storage.get_directories(location)
    
@app.delete("/storages/{name}/{location:path}")
def remove_directory(name:str, location:str):
    with JsonFile(json_file_location) as data:
        storage:Storage = storage_provider.get_storage(**data[name])
        storage.remove_directory(location)
        return {
            "result": "Ok"
        }

#app.mount(
#    "/",
#    SPAStaticFiles(
#        directory="/app/frontend",
#        html=True
#    ),
#    name="static"
#)

uvicorn.run(app, host=host, port=port)