import { Skeleton } from "@/components/ui/skeleton";
import { TableCell, TableRow } from "@/components/ui/table";

/**
 *
 * @example
 * <Table>
 *  <TableBody>
 *    { isLoding 
 *      ? <SkeletonTable numberOfRows={10} numberOfCols={5}/> 
 *      : <TableRow/>
 *    }
 *  </TableBody>
 * </Table>
 */
export function SkeletonTable({
  numberOfRows,
  numberOfCols,
}: {
  numberOfRows: number;
  numberOfCols: number;
}) {
  return Array.from(Array(numberOfRows)).map((_, i) => (
    <TableRow key={i}>
      {Array.from(Array(numberOfCols)).map((_, j) => (
        <TableCell key={j}>
          <Skeleton className="h-5 w-full" />
        </TableCell>
      ))}
    </TableRow>
  ));
}
