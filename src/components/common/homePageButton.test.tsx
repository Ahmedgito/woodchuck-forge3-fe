import { describe, expect, it, vi, beforeEach } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import HomePageButton from './homePageButton'

const mocks = vi.hoisted(() => ({ push: vi.fn() }))

vi.mock('next/navigation', () => ({
  useRouter: () => ({ push: mocks.push }),
}))

describe('HomePageButton', () => {
  beforeEach(() => {
    mocks.push.mockClear()
  })

  it('[AC-5] renders a secondary type=button control that navigates client-side to /', async () => {
    const user = userEvent.setup()
    render(<HomePageButton dirty={false} />)
    const button = screen.getByRole('button', { name: 'Home page' })
    expect(button).toHaveAttribute('type', 'button')
    expect(button).toHaveClass('secondary')
    expect(button).not.toHaveClass('ant-btn-primary')
    await user.click(button)
    expect(mocks.push).toHaveBeenCalledTimes(1)
    expect(mocks.push).toHaveBeenCalledWith('/')
  })

  it('navigates to / immediately when the form has no unsaved changes', async () => {
    const user = userEvent.setup()
    render(<HomePageButton dirty={false} />)
    await user.click(screen.getByRole('button', { name: 'Home page' }))
    expect(mocks.push).toHaveBeenCalledWith('/')
    expect(screen.queryByText('Unsaved changes')).not.toBeInTheDocument()
  })

  it('[AC-4] asks for confirmation when the form is dirty and leaves only on confirm', async () => {
    const user = userEvent.setup()
    render(<HomePageButton dirty />)
    await user.click(screen.getByRole('button', { name: 'Home page' }))
    expect(await screen.findByText('Unsaved changes')).toBeInTheDocument()
    expect(mocks.push).not.toHaveBeenCalled()

    await user.click(screen.getByRole('button', { name: 'Leave' }))
    await waitFor(() => expect(mocks.push).toHaveBeenCalledWith('/'))
  })

  it('[AC-4] stays on the page, keeping edits, when the user cancels the confirmation', async () => {
    const user = userEvent.setup()
    render(<HomePageButton dirty />)
    await user.click(screen.getByRole('button', { name: 'Home page' }))
    await user.click(await screen.findByRole('button', { name: 'Stay' }))
    await waitFor(() =>
      expect(screen.queryByText('Unsaved changes')).not.toBeInTheDocument()
    )
    expect(mocks.push).not.toHaveBeenCalled()
  })
})
