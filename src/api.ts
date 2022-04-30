import { useMemo, useState } from "react"

const SHEET_API_URL = "https://sheets.googleapis.com/v4/spreadsheets/"

export interface SheetProperties {
  sheets: Array<{
    properties: {
      title: string
    }
  }>
}

export interface Sheet {
  range?: string
  majorDimension: string
  values: Array<Array<string>>
}

export interface SheetResponse {
  spreadsheetId?: string
  valueRanges: Array<Sheet>
}

export type HookState = { data: SheetResponse; loading: boolean }

export function useFetchGoogleSheets({
  sheetId,
  apiKey,
}: {
  sheetId: string
  apiKey: string
}): HookState {
  const [loading, setLoading] = useState(false)
  const [data, setData] = useState<SheetResponse>({ valueRanges: [] })
  const [sheets, setSheets] = useState<SheetProperties | undefined>(undefined)

  useMemo(() => {
    if (sheets === undefined) {
      console.log("fetch sheets")
      setLoading(true)
      fetch(
        `${SHEET_API_URL}${sheetId}?` +
          new URLSearchParams({
            fields: "sheets/properties/title",
            key: apiKey,
          })
      )
        .then((response) => response.json())
        .then((jsonResponse: SheetProperties) => setSheets(jsonResponse))
    }
  }, [sheets, sheetId, apiKey])

  useMemo(() => {
    if (sheets !== undefined && data.valueRanges.length === 0) {
      console.log("fetch data")
      const params = new URLSearchParams({ key: apiKey })
      sheets.sheets.forEach((sheet) =>
        params.append("ranges", sheet.properties.title)
      )
      fetch(`${SHEET_API_URL}${sheetId}/values:batchGet?` + params)
        .then((response) => response.json())
        .then((data) => setData(data))
        .finally(() => setLoading(false))
    }
  }, [apiKey, data.valueRanges.length, sheetId, sheets])

  return { data, loading }
}
