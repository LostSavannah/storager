import { useStorage } from "../../hooks/useStorage";
import StorageListView from "../StorageListView/StorageListView";
import StorageView from "../StorageView/StorageView";

export default function StorageComponent() {
    const {
        storages,
        storage,
        setStorage,
        nodes,
        navigateTo,
        linkTo,
        location,
        moveUp,
        uploadFile,
        isLoading,
        deleteFile
    } = useStorage();
  return (
    <div className="container">
        <div className="row">
            <div className="col-3">
                <StorageListView storages={storages} setStorage={setStorage}/>
            </div>
            <div className="col-9">
                {storage && <StorageView 
                    storage={storage} 
                    storageNodes={nodes} 
                    navigateTo={navigateTo}
                    linkTo={linkTo}
                    location={location}
                    moveUp={moveUp}
                    uploadFile={uploadFile}
                    isLoading={isLoading}
                    deleteFile={deleteFile}
                    />}
            </div>
        </div>
    </div>
  )
}
