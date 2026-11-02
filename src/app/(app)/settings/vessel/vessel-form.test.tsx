import { describe, expect, it, vi, beforeEach } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import VesselForm from './vessel-form'

const mocks = vi.hoisted(() => ({
  push: vi.fn(),
  saveVessel: vi.fn(),
}))

vi.mock('next/navigation', () => ({
  useRouter: () => ({ push: mocks.push }),
}))

vi.mock('@/src/services/global', () => ({
  getVessels: async () => ({
    data: { data: [{ id: 1, name: '', options: [{ id: 1, value: 10 }] }] },
  }),
  saveVessel: (...args: unknown[]) => mocks.saveVessel(...args),
}))

vi.mock('@/src/utils/context/loader-context', () => ({
  useLoader: () => ({ setLoading: () => undefined }),
}))

vi.mock('@/src/utils/context/notification-context', () => ({
  useTriggerNotification: () => () => undefined,
}))

describe('settings vessel form action row', () => {
  beforeEach(() => {
    mocks.push.mockClear()
    mocks.saveVessel.mockClear()
  })

  it('[AC-1] renders a button labelled "Home page"', async () => {
    render(<VesselForm />)
    const button = await screen.findByRole('button', { name: 'Home page' })
    expect(button).toBeInTheDocument()
    expect(button).toHaveTextContent('Home page')
  })

  it('[AC-2] places the Home page button immediately before the SAVE button in the same row', async () => {
    render(<VesselForm />)
    const home = await screen.findByRole('button', { name: 'Home page' })
    const save = screen.getByRole('button', { name: 'SAVE' })
    expect(home.parentElement).toBe(save.parentElement)
    expect(home.nextElementSibling).toBe(save)
    expect(
      home.compareDocumentPosition(save) & Node.DOCUMENT_POSITION_FOLLOWING
    ).toBeTruthy()
  })

  it('[AC-3] navigates to / when the form is pristine, without submitting the form', async () => {
    const user = userEvent.setup()
    render(<VesselForm />)
    const home = await screen.findByRole('button', { name: 'Home page' })
    expect(home).toHaveAttribute('type', 'button')

    await user.click(home)

    await waitFor(() => expect(mocks.push).toHaveBeenCalledWith('/'))
    expect(mocks.push).toHaveBeenCalledTimes(1)
    expect(mocks.saveVessel).not.toHaveBeenCalled()
  })

  it('[AC-4] stays visible with unsaved changes and asks to confirm before leaving', async () => {
    const user = userEvent.setup()
    render(<VesselForm />)
    const nameInput = await screen.findByPlaceholderText('Vessel Name')
    await user.type(nameInput, 'Boat')

    const home = screen.getByRole('button', { name: 'Home page' })
    expect(home).toBeVisible()
    await user.click(home)

    expect(await screen.findByText('Unsaved changes')).toBeInTheDocument()
    expect(mocks.push).not.toHaveBeenCalled()
    expect(mocks.saveVessel).not.toHaveBeenCalled()

    await user.click(screen.getByRole('button', { name: 'Leave' }))
    await waitFor(() => expect(mocks.push).toHaveBeenCalledWith('/'))
  })
})
