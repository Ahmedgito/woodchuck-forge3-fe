import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import SettingsActionBar from './index'

const push = vi.fn()

vi.mock('next/navigation', () => ({
  useRouter: () => ({ push }),
}))

describe('SettingsActionBar', () => {
  beforeEach(() => {
    push.mockClear()
  })

  it('[AC-1] renders a "Home page" button immediately before the save changes button, even with no unsaved changes', () => {
    render(<SettingsActionBar saveDisabled onSave={() => {}} />)

    const buttons = screen.getAllByRole('button')
    expect(buttons).toHaveLength(2)
    expect(buttons[0]).toHaveTextContent('Home page')
    expect(buttons[1]).toHaveTextContent(/save changes/i)
    expect(buttons[0].parentElement?.parentElement).toBe(
      buttons[1].parentElement?.parentElement
    )
    expect(
      buttons[0].compareDocumentPosition(buttons[1]) &
        Node.DOCUMENT_POSITION_FOLLOWING
    ).toBeTruthy()
  })

  it('[AC-2] clicking "Home page" with no unsaved changes navigates to /', () => {
    render(<SettingsActionBar saveDisabled onSave={() => {}} />)

    fireEvent.click(screen.getByRole('button', { name: 'Home page' }))

    expect(push).toHaveBeenCalledTimes(1)
    expect(push).toHaveBeenCalledWith('/')
  })
})
