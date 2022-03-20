import {Cell, Column, Divider, Heading, Row, TableBody, TableHeader, TableView} from "@adobe/react-spectrum";
import {Sheet} from "use-google-sheets/src/types";

interface DataRow {
    [key: string]: string;
}

export default function Table({sheet}: { sheet: Sheet }): JSX.Element {
    const headers: Array<keyof DataRow> = Object.keys(sheet.data[0]) as unknown as Array<keyof DataRow>
    return <>
        <Heading level={3} marginStart={"size-250"} marginTop={"size-500"}>{sheet.id}</Heading>
        <TableView aria-label={sheet.id} key={sheet.id} marginTop={"size-50"}>
            <TableHeader key={sheet.id + "header"}>
                {
                    headers.map((header) => <Column key={`${sheet.id}-${header}`}>{header}</Column>)
                }
            </TableHeader>
            <TableBody key={sheet.id + "body"}>
                {
                    sheet.data.slice(1, -1).map((row, index) => <Row key={`${sheet.id}-row-${index}`}>{
                        headers.map((headerKey) =>
                            <Cell key={`${sheet.id}-row-${index}-cell-${headerKey}`}>{(row as DataRow)[headerKey]}</Cell>
                        )}
                    </Row>)
                }
            </TableBody>
        </TableView>
        <Divider/>
    </>
}