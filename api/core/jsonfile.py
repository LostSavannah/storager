from typing import Any, Union
import json
import os

Node = Union[list["Node"], dict[str, Union[str, int, float, bool, "Node"]]]

class JsonFile:
    def __init__(self, location:str) -> None:
        self.location = location
        self.data:Node = dict()

    def __enter__(self) -> "Node":
        if os.path.exists(self.location):
            with open(self.location, 'r') as fi:
                self.data = json.load(fi)
        return self.data

    def __exit__(self, a, b, c):
        with open(self.location, 'w') as fo:
            json.dump(self.data, fo, indent='\t')