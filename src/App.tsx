import {
  defaultTheme,
  Flex,
  ProgressCircle,
  Provider,
} from "@adobe/react-spectrum"
import Table from "./Table"
import { HookState, useFetchGoogleSheets } from "./api"

export default function App() {
  return (
    <Provider theme={defaultTheme} colorScheme={"light"}>
      <Flex direction={"column"}>
        <GoogleSheetDataProvider
          apiKey={process.env.REACT_APP_GOOGLE_API_KEY || ""}
          sheetId={process.env.REACT_APP_GOOGLE_SHEET_ID || ""}
        >
          {({ data, loading }) => {
            return (
              <>
                {loading && <ProgressCircle aria-label="Loading" value={50} />}
                {!loading &&
                  data.valueRanges.map((sheet, index) => (
                    <Table sheet={sheet} key={index} />
                  ))}
              </>
            )
          }}
        </GoogleSheetDataProvider>
      </Flex>
    </Provider>
  )
}

function GoogleSheetDataProvider({
  apiKey,
  sheetId,
  children,
}: {
  apiKey: string
  sheetId: string
  children: (state: HookState) => JSX.Element
}) {
  const state = useFetchGoogleSheets({ sheetId, apiKey })
  return children(state)
}
