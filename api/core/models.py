from pydantic import BaseModel

class CreateStorageRequest(BaseModel):
    name: str
    kind: str
    params:dict[str, str]