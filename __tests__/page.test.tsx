import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import Home from '../app/page'

describe('Angular Component Analyzer', () => {

  test('renders the header correctly', () => {
    render(<Home />)
    expect(screen.getByText('Analyzer')).toBeInTheDocument()
  })

  test('shows error when textarea is empty', async () => {
    render(<Home />)
    fireEvent.click(screen.getByText('Generate Documentation'))
    expect(await screen.findByText('Please paste your Angular component code first!')).toBeInTheDocument()
  })

  test('shows error when code is not an Angular component', async () => {
    render(<Home />)
    fireEvent.change(screen.getByPlaceholderText(/@Component/), {
      target: { value: 'const x = 1;' }
    })
    fireEvent.click(screen.getByText('Generate Documentation'))
    expect(await screen.findByText(/doesn't look like an Angular component/)).toBeInTheDocument()
  })

  test('shows error when export class is missing', async () => {
    render(<Home />)
    fireEvent.change(screen.getByPlaceholderText(/@Component/), {
      target: { value: '@Component({})' }
    })
    fireEvent.click(screen.getByText('Generate Documentation'))
    expect(await screen.findByText(/Missing 'export class'/)).toBeInTheDocument()
  })

  test('Try an example fills the textarea', () => {
    render(<Home />)
    fireEvent.click(screen.getByText('Try an example'))
    expect(screen.getByDisplayValue(/StatusBadgeComponent/)).toBeInTheDocument()
  })

  test('Clear button resets everything', () => {
    render(<Home />)
    fireEvent.click(screen.getByText('Try an example'))
    fireEvent.click(screen.getByText('Clear ✕'))
    expect(screen.queryByDisplayValue(/StatusBadgeComponent/)).not.toBeInTheDocument()
  })

})
