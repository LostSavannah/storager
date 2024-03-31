import { useState } from "react";
import { StorageNode } from "../../types/Common";
import NavigationBar from "../NavigationBar/NavigationBar";
import NodeView from "../NodeView/NodeView";
import SearchBar from "../SearchBar/SearchBar";
import LoadingComponent from "../LoadingComponent/LoadingComponent";
import EmptyComponent from "../EmptyComponent/EmptyComponent";

export interface StorageViewProps{
    storage:string;
    storageNodes:StorageNode[];
    navigateTo: (folder:string) => void;
    linkTo: (name:string) => string;
    location: string,
    moveUp: () => void,
    uploadFile: (file:File) => void,
    isLoading: boolean,
    deleteFile: (filename:string) => void
}

export default function StorageView({
    storage,
    storageNodes,
    navigateTo,
    linkTo,
    location,
    moveUp,
    uploadFile,
    isLoading,
    deleteFile
}:StorageViewProps) {
    const [searchTerm, setSearchTerm] = useState("");
  function handleDrop(e:React.DragEvent<HTMLDivElement>){
    e.preventDefault();
    if(e.dataTransfer.items){
        [...e.dataTransfer.items].filter(i => i.kind === "file").forEach(f => {
            const file = f.getAsFile();
            if(file)uploadFile(file);
        });
    }
  }

  const nodes = storageNodes.filter(s => searchTerm == "" || s.name.includes(searchTerm))
  console.log(nodes);

  return (
    <div 
        onDragOver={e => e.preventDefault()}
        onDrop={handleDrop}
        className="container">
        <div className="row">
            <div className="col-12">
                <h4>Current storage: {storage}</h4>
            </div>
        </div>
        <div className="row">
            <div className="col-8">
                <NavigationBar moveUp={moveUp} location={location}/>
            </div>
            <div className="col-4">
                <SearchBar onSearchChanged={setSearchTerm}/>
            </div>
        </div>
        <div className="row">
            {
            isLoading? 
            <LoadingComponent/>:
            <div className="col-12">
                <table className="table">
                    <thead>
                        <tr>
                            <th>Name</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {nodes.map(node => <NodeView key={node.name} node={node} navigateTo={navigateTo} linkTo={linkTo} deleteFile={deleteFile}/>)}
                    </tbody>
                </table>
            </div>
            }
            {
                !isLoading && nodes.length == 0? <EmptyComponent/>:<></>
            }
        </div>
    </div>
)
}
