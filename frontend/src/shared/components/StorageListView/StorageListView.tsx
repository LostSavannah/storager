import { useState } from "react";
import StorageListItem from "../StorageListItem/StorageListItem";

export interface StorageListViewProps{
    storages:string[],
    setStorage:(storage:string) => void
}

export default function StorageListView({
    storages, setStorage
}:StorageListViewProps) {
    const [filter, setFilter] = useState("");
  return (
  <div className="container">
  <div className="row">
      <div className="col-12">
          <h4>Storages</h4>
      </div>
  </div>
    <div className="row">
        <div className="col-12">
            <input
                placeholder="Filter..."
                className="w-100"
                onChange={e => setFilter(e.target.value)} 
                type="text" 
                value={filter}
                />
        </div>
    </div>
    <div className="row">
        {storages.filter(storage => filter == "" || storage.includes(filter)).map(storage => 
            <div className="col-12">
                <StorageListItem key={storage} storage={storage} setStorage={setStorage}/>
            </div>
        )}
    </div>
  </div>
  )
}
