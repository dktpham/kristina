import React from 'react';
import {defaultTheme, Flex, ProgressCircle, Provider} from "@adobe/react-spectrum";
import useGoogleSheets from "use-google-sheets";
import {HookState} from "use-google-sheets/src/types";
import Table from "./Table";

export default function App() {
    return <Provider theme={defaultTheme} colorScheme={"light"}>
        <Flex direction={"column"}>
            <GoogleSheetDataProvider apiKey={process.env.REACT_APP_GOOGLE_API_KEY || ""} sheetId={process.env.REACT_APP_GOOGLE_SHEET_ID || ""}>
                {({data, loading, error}) => {

                    return <>
                        {loading && <ProgressCircle aria-label="Loading" value={50}/>}
                        {!loading && data.map((sheet, index) => <Table sheet={sheet} key={index}/>)}
                    </>
                }}
            </GoogleSheetDataProvider>
        </Flex>
    </Provider>;
}

function GoogleSheetDataProvider({apiKey, sheetId, children}: { apiKey: string, sheetId: string, children: (state: HookState) => JSX.Element }) {
    const state = useGoogleSheets({
        apiKey,
        sheetId,
    })
    return children(state)
}


