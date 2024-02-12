import { StorageNode } from "../../types/Common"

export interface NodeViewProps{
  node:StorageNode,
  navigateTo: (folder:string) => void;
  linkTo: (name:string) => string;
}

export default function NodeView({
  node,
  navigateTo,
  linkTo
}:NodeViewProps) {
  return (
    <div className="container">
        <div className="row">
            <div className="col-12">
              {
                node.is_folder ? 
                <a onClick={() => navigateTo(node.name)}>🗀 {node.name}</a>:
                <a href={linkTo(node.name)}>{node.name}</a>
              }
            </div>
        </div>
    </div>
  )
}
