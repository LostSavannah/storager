import { StorageNode } from "../types/Common";
import BaseHttpService from "./BaseHttpService";

export class StorageService extends BaseHttpService{
    getStorages(){
        return this.get<string[]>("storages");
    }

    getNodes(name:string, location:string){
        return this.get<StorageNode[]>(`storages/${name}/${location}`);
    }

    uploadFile(name:string, location:string, file:File){
        return this.postFile<string>(`storages/${name}/${location}`, file);
    }

    deleteNode(name:string, location:string){
        return this.delete<{[key:string]:string}>(`storages/${name}/${location}`);
    }
}