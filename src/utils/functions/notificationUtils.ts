export type TriggerNotification = (
  type: 'success' | 'info' | 'warning' | 'error',
  title: string,
  message: string,
  duration?: number
) => void
export const createTriggerNotification = (
  triggerNotification: TriggerNotification
) => {
  return (type: string, title: string, message: string) => {
    triggerNotification('error', title, message)
  }
}
