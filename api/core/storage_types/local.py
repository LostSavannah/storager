import os
import shutil
from ..storage import StorageNode
from ..storage import Storage

class LocalStorage(Storage):
    def __init__(self, params: dict[str, str]) -> None:
        super().__init__(params)

    def normalize_path(self, path:str) -> str:
        return path.replace("/", os.sep).replace("\\", os.sep)

    def get_directories(self, path) -> list[StorageNode]:
        path = self.normalize_path(path)
        full_path = os.sep.join([self.params["BasePath"], path])
        if not os.path.isdir(full_path):
            return []
        return [
            StorageNode(
                i, 
                os.path.isdir(os.sep.join([full_path, i]))) 
            for i in os.listdir(full_path)]
    
    def upload_file(self, path: str, data: bytes):
        path = self.normalize_path(path)
        full_path = os.sep.join([self.params["BasePath"], path])
        directory:str = os.sep.join(full_path.split(os.sep)[:-1])
        os.makedirs(directory, 777, True)
        with open(full_path, 'wb') as fo:
            fo.write(data)
    
    def download_file(self, path: str) -> tuple[bytes, str]:
        path = self.normalize_path(path)
        full_path = os.sep.join([self.params["BasePath"], path])
        filename:str = full_path.split(os.sep)[-1]
        with open(full_path, 'rb') as fi:
            return fi.read(), filename

    def remove_directory(self, path):
        path = self.normalize_path(path)
        full_path = os.sep.join([self.params["BasePath"], path])
        if os.path.isfile(full_path):
            os.remove(full_path)
        else:
            shutil.rmtree(full_path)