import ftplib
from ..storage import StorageNode
from ..storage import Storage
from io import BytesIO

class FtpStorage(Storage):
    def __init__(self, params: dict[str, str]) -> None:
        super().__init__(params)
        
    def hostname(self):
        return self.params.get("Hostname", ".")
    
    def username(self):
        return self.params.get("Username", "anonymous")
    
    def password(self):
        return self.params.get("Password", "")

    def get_directory_info(self, raw:str) -> tuple[dict[str, str], str]:
        *params, file = raw.split(";")
        params_dict = dict()
        for p in [pc for pc in params if "=" in pc]:
            key, value = p.split("=", 1)
            params_dict[key] = value
        return params_dict, file[1:]

    def get_directories(self, path) -> list[StorageNode]:
        with ftplib.FTP(self.hostname(), self.username(), self.password()) as ftp:
            ftp.login()
            data:list[str] = []
            ftp.retrlines(f"MLSD {path}", data.append)
        return [
            StorageNode(
                i[1],
                i[0]['type'].lower() == 'dir'
            )
            for i in [
                self.get_directory_info(info) for info in data
            ]
        ]
    
    def download_file(self, path: str) -> tuple[bytes, str]:
        with ftplib.FTP(self.hostname(), self.username(), self.password()) as ftp:
            ftp.login()
            b = bytearray()
            ftp.retrbinary(f"RETR {path}", b.extend)
            return bytes(b), path.split("/")[-1]
        
    def remove_directory(self, path):
        with ftplib.FTP(self.hostname(), self.username(), self.password()) as ftp:
            ftp.login()
            try:
                ftp.sendcmd(f"DELE {path}")
            except Exception as e:
                print(e)
                ftp.sendcmd(f"RMD {path}")

    def upload_file(self, path: str, data: bytes):
        with ftplib.FTP(self.hostname(), self.username(), self.password()) as ftp:
            *folder_path, filename = path.split("/")
            folder_path = [i for i in folder_path if len(i)]
            for i in range(len(folder_path)):
                folder = "/".join(folder_path[:i+1])
                try:
                    ftp.sendcmd(f"MKD {folder}")
                except Exception as e:
                    print(e)
            with BytesIO(data) as bdata:
                ftp.storbinary(f"STOR {path}", bdata)