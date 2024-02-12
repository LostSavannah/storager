export interface StorageListItemProps{
    storage:string,
    setStorage: (storage:string) => void
}

export default function StorageListItem({storage, setStorage}:StorageListItemProps) {
  return (
    <a
        className="text-primary"
        onClick={() => setStorage(storage)}>
        🖴 {storage}
    </a>
    
  )
}
