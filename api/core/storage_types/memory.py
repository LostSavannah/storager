from ..storage import StorageNode
from ..storage import Storage
from typing import Union
import time

Tree = dict[str, Union[bytes, "Tree"]]

class MemoryStorage(Storage):
    storages:dict[str, Tree] = dict()
    @staticmethod
    def get_tree(id:str) -> Tree:
        if id not in MemoryStorage.storages:
            MemoryStorage.storages[id] = dict()
            MemoryStorage.storages[id]["manifest.txt"] = f"{time.time()}".encode()
        return MemoryStorage.storages[id]

    def __init__(self, params: dict[str, str]) -> None:
        super().__init__(params)
        self.tree:Tree = MemoryStorage.get_tree(self.params["TreeId"])

    def get_node(self, path:list[str]) -> Union[Tree, bytes]:
        result:Tree = self.tree
        for level in path:
            if level == '':
                continue
            result = result[level]
        return result
    
    def ensure_node(self, path:list[str]) -> Tree:
        result:Tree = self.tree
        for level in path:
            if level == '':
                continue
            if level not in result:
                result[level] = dict()
            result = result[level]
        return result

    def upload_file(self, path: str, data: bytes):
        *steps, name = path.split("/")
        self.ensure_node(steps)[name] = data

    def get_directories(self, path:str) -> list[StorageNode]:
        tree:Tree = self.get_node(path.split("/"))
        return [
            StorageNode(i, not isinstance(tree[i], bytes))
            for i in tree
        ]
    
    def download_file(self, path: str) -> tuple[bytes, str]:
        *steps, name = path.split("/")
        return self.get_node(steps)[name], name
    
    def remove_directory(self, path):        
        *steps, name = path.split("/")
        del self.get_node(steps)[name]