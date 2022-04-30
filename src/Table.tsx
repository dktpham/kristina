import {
  Cell,
  Column,
  Divider,
  Heading,
  Row,
  TableBody,
  TableHeader,
  TableView,
} from "@adobe/react-spectrum"
import { Sheet } from "./api"

export default function Table({ sheet }: { sheet: Sheet }): JSX.Element {
  const headers: Array<string> = sheet.values[0]
  const sheetTitle = sheet.range?.split("!")[0]

  return (
    <>
      <Heading level={3} marginStart={"size-250"} marginTop={"size-500"}>
        {sheetTitle}
      </Heading>
      <TableView aria-label={sheetTitle} key={sheetTitle} marginTop={"size-50"}>
        <TableHeader key={sheetTitle + "header"}>
          {headers.map((header) => (
            <Column key={`${sheetTitle}-${header}`}>{header}</Column>
          ))}
        </TableHeader>
        <TableBody key={sheetTitle + "body"}>
          {sheet.values.slice(1).map((row, index) => (
            <Row key={`${sheetTitle}-row-${index}`}>
              {createCells(headers.length, row, headers, index, sheetTitle)}
            </Row>
          ))}
        </TableBody>
      </TableView>
      <Divider />
    </>
  )
}

function createCells(
  columnCount: number,
  columns: Array<string>,
  headers: Array<string>,
  rowIndex: number,
  sheetTitle?: string
) {
  const countDifference = columnCount - columns.length
  const finalColumns =
    countDifference > 0
      ? columns.concat(new Array(countDifference).fill(""))
      : columns
  return finalColumns.map((column, index) => (
    <Cell key={`${sheetTitle}-row-${rowIndex}-cell-${headers[index]}`}>
      {column}
    </Cell>
  ))
}
