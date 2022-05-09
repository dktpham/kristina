import React, { Dispatch, SetStateAction, useContext, useEffect } from 'react'
import { TypingTestContext } from './Type'
import { getWords } from '../utils'
import Delayed from './Delayed'

interface ScreenReaderAlertState {
  alerts: string[]
  setAlerts: Dispatch<SetStateAction<string[]>>
}

export const ScreenReaderAlertContext = React.createContext<ScreenReaderAlertState>({
  alerts: [],
  setAlerts: () => [],
})

export function ScreenReaderAlert() {
  const { testtext, states } = useContext(TypingTestContext)
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
      <Alert text={getWords(testtext, (states?.currIndex || 0) + 1, 2)} />
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
