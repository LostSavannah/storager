from typing import Callable

class StorageNode:
    def __init__(self, name:str, is_folder:bool = False) -> None:
        self.name = name
        self.is_folder = is_folder

class Storage:
    def __init__(self, params:dict[str, str]) -> None:
        self.params:dict[str, str] = dict()
        self.on_configure(params)

    def on_get_default_params(self) -> dict[str, str]:
        return {
            "BasePath": "."
        }
    
    def on_configure(self, params:dict[str, str]):
        default_params = self.on_get_default_params()
        default_params.update(params)
        self.params = default_params

    def upload_file(self, path:str, data:bytes):
        raise NotImplementedError()

    def download_file(self, path:str) -> tuple[bytes, str]:
        raise NotImplementedError()
    
    def get_directories(self, path) -> list[StorageNode]:
        raise NotImplementedError()
    
    def remove_directory(self, path):
        raise NotImplementedError()

StorageInstantiator = Callable[[dict[str, str],], Storage]

class StorageProvider:
    def __init__(self) -> None:
        self.catalog: dict[str, StorageInstantiator] = dict()

    def include(self, storages) -> "StorageProvider":
        self.catalog.update(storages)
        return self

    def get_storage(self, kind:str, params:dict[str, str]) -> Storage:
        return self.catalog[kind](params)