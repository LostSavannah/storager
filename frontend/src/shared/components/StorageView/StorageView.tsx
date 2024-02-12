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
    isLoading: boolean
}

export default function StorageView({
    storage,
    storageNodes,
    navigateTo,
    linkTo,
    location,
    moveUp,
    uploadFile,
    isLoading
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
                <h2>{storage}</h2>
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
            nodes.length == 0?
            <EmptyComponent/>:
            nodes.map(node => 
            <div className="col-12">
                <NodeView key={node.name} node={node} navigateTo={navigateTo} linkTo={linkTo}/>
            </div>
            )}
        </div>
    </div>
  )
}
