import React, { Dispatch, SetStateAction, useContext, useEffect } from 'react'
import Delayed from './Delayed'
import { NewContext } from './Type'

interface ScreenReaderAlertState {
  alerts: string[]
  setAlerts: Dispatch<SetStateAction<string[]>>
}

export const ScreenReaderAlertContext = React.createContext<ScreenReaderAlertState>({
  alerts: [],
  setAlerts: () => [],
})

export function ScreenReaderAlert() {
  const { wordState } = useContext(NewContext)
  const { alerts, setAlerts } = useContext(ScreenReaderAlertContext)

  useEffect(() => {
    if (alerts.length === 1) {
      const timer = setTimeout(() => {
        setAlerts([''])
      }, 500)
      return () => clearTimeout(timer)
    }
  }, [alerts])

  return (
    <>
      <Alert
        text={[
          wordState[wordState.currentWordIndex]?.correctChars.join(''),
          wordState[wordState.currentWordIndex + 1]?.correctChars.join(''),
          wordState[wordState.currentWordIndex + 2]?.correctChars.join(''),
        ].join('')}
      />
      <Alert text={alerts[0]} />
    </>
  )
}

function Alert({ text }: { text: string }) {
  return (
    <div role={'alert'} style={{ position: 'absolute', color: 'rgba(0,0,0,0)' }} tabIndex={-1}>
      <Delayed waitBeforeShow={300}>
        <p>{text}</p>
      </Delayed>
    </div>
  )
}
