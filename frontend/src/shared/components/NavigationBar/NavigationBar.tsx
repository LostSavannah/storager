export interface NavigationBarProps{
  location:string,
  moveUp: () => void
}

export default function NavigationBar({location, moveUp}:NavigationBarProps) {
  return (
    <>
    <div className="container">
      <div className="row">
        <div className="col-1">
          <button 
            className="btn btn-primary"
            onClick={moveUp}>^</button>
        </div>
        <div className="col-11">
          <input 
            className="w-100"
            type="text" 
            value={location}
          />
        </div>
      </div>
    </div>
    </>
  )
}
