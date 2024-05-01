import {
  Table,
  TableBody,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { cn } from "@/lib/utils";
import { memo } from "react";
import { Handle, Position } from "reactflow";

function TableNode({ data, selected }: any) {
  return (
    <div
      className={cn(
        "px-4 py-2 shadow-md rounded-md bg-white border-2 border-stone-400",
        selected && "border-blue-800"
      )}
    >
      <div className="flex flex-col">
        <div className="font-bold">Table: {data.name}</div>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[100px]">Field Name</TableHead>
              <TableHead>Value Type</TableHead>
              <TableHead>Data Type</TableHead>
              <TableHead>Value</TableHead>
              <TableHead>Length</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.columns!.map((row: any) => (
              <TableRow key={row.column}>
                <TableCell className="font-medium">{row.fieldName}</TableCell>
                <TableCell>{row.valueType}</TableCell>
                <TableCell>{row.dataType}</TableCell>
                <TableCell>{row.value}</TableCell>
                <TableCell>{row.length}</TableCell>
              </TableRow>
            ))}
          </TableBody>
          <TableFooter>
            <TableRow>
              <TableCell colSpan={5}>Relationship: xxx table</TableCell>
            </TableRow>
          </TableFooter>
        </Table>
      </div>

      <Handle
        type="target"
        position={Position.Left}
        className="!bg-teal-500"
        style={{
          height: "50px",
          borderRadius: "0",
        }}
      />
      <Handle
        type="source"
        position={Position.Right}
        className="!bg-teal-500"
        style={{
          height: "50px",
          borderRadius: "0",
        }}
      />
    </div>
  );
}

export default memo(TableNode);
