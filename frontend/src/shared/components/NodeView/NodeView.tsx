import { StorageNode } from "../../types/Common"

export interface NodeViewProps{
  node:StorageNode,
  navigateTo: (folder:string) => void;
  linkTo: (name:string) => string;
  deleteFile: (filename:string) => void;
}

export default function NodeView({
  node,
  navigateTo,
  linkTo,
  deleteFile
}:NodeViewProps) {
  return (
    <tr className="container">
            <td>
              {
                node.is_folder ? 
                <a onClick={() => navigateTo(node.name)}>🗀 {node.name}</a>:
                <a href={linkTo(node.name)}>{node.name}</a>
              }
            </td>
            <td>
              <button className="btn btn-danger" onClick={() => deleteFile(node.name)}>x</button>
            </td>
    </tr>
  )
}
