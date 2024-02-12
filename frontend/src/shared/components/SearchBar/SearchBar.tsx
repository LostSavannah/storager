import { useState } from "react"

export interface SearchBarProps{
  onSearchChanged: (search:string) => void
}

export default function SearchBar({onSearchChanged}:SearchBarProps) {
  const [search, setSearch] = useState<string>("");
  return (
    <div className="container">
      <div className="row">
        <div className="col-12">
          <input 
            onChange={(e) => {
              setSearch(e.target.value);
              onSearchChanged(e.target.value);
            }}
            className="w-100"
            type="text"
            value={search}
            placeholder="search..."
            />
        </div>
      </div>
    </div>
  )
}
