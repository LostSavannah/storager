import { useEffect, useState } from "react";
import { StorageService } from "../services/StorageService";
import { StorageNode } from "../types/Common";

export function useStorage(){
    const [storages, setStorages] = useState<string[]>([]);
    const [storage, setStorage] = useState<string>();
    const [location, setLocation] = useState<string>("/");
    const [nodes, setNodes] = useState<StorageNode[]>([]);
    const [lastUpload, setLastUpload] = useState<string>("");
    const [isLoading, setIsLoading] = useState(false);

    useEffect(()=>{
        new StorageService()
            .getStorages()
            .then(setStorages);
    }, []);

    useEffect(() => {
        if(location && storage){
            setIsLoading(true);
            new StorageService()
                .getNodes(storage, location)
                .then(nodes => {
                    setNodes(nodes);
                    setIsLoading(false);
                });
        }
    }, [storage, location, lastUpload]);

    useEffect(()=>{
        setLocation("/");
    }, [storage]);

    const navigateTo = (folder:string) => {
        const path = location.split("/").filter(p => p.length > 0);
        path.push(folder);
        setLocation(path.join("/") || "/");
    }

    const linkTo = (name:string) => {
        const baseUrl = new StorageService().getBaseUrl();
        return `${baseUrl}/storages/${storage}/download:${location}/${name}`;
    }

    const moveUp = () => {
        const path = location.split("/").filter(p => p.length > 0);
        path.pop();
        setLocation(path.join("/") || "/");
    }

    const uploadFile = (file:File) => {
        if(storage){
            setIsLoading(true);
            const path = location.split("/");
            path.push(file.name)
            const fullPath = path.filter(p => p.length > 0).join("/")
            new StorageService()
                .uploadFile(storage, fullPath, file)
                .then(l => {
                    setLastUpload(l);
                    setIsLoading(false);
                });
        }
    }

    return {
        storages,
        storage,
        setStorage,
        location,
        setLocation,
        navigateTo,
        linkTo,
        nodes,
        moveUp,
        uploadFile,
        isLoading
    }
}