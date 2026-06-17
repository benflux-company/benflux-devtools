import { renderHook, act } from '@testing-library/react';
import { useCopyToClipboard } from '../useCopyToClipboard';

// Mock the clipboard API
Object.defineProperty(navigator, 'clipboard', {
  value: {
    writeText: jest.fn(),
  },
  configurable: true,
});

describe('useCopyToClipboard', () => {
  beforeEach(() => {
    jest.useFakeTimers();
    (navigator.clipboard.writeText as jest.Mock).mockResolvedValue(undefined);
  });

  afterEach(() => {
    jest.useRealTimers();
    jest.clearAllMocks();
  });

  it('starts with copied = false', () => {
    const { result } = renderHook(() => useCopyToClipboard());
    expect(result.current.copied).toBe(false);
  });

  it('sets copied = true after copying', async () => {
    const { result } = renderHook(() => useCopyToClipboard());
    await act(async () => {
      await result.current.copy('hello');
    });
    expect(result.current.copied).toBe(true);
  });

  it('calls clipboard.writeText with the correct text', async () => {
    const { result } = renderHook(() => useCopyToClipboard());
    await act(async () => {
      await result.current.copy('test text');
    });
    expect(navigator.clipboard.writeText).toHaveBeenCalledWith('test text');
  });

  it('resets copied to false after 2 seconds', async () => {
    const { result } = renderHook(() => useCopyToClipboard());
    await act(async () => {
      await result.current.copy('hello');
    });
    expect(result.current.copied).toBe(true);
    act(() => {
      jest.advanceTimersByTime(2000);
    });
    expect(result.current.copied).toBe(false);
  });
});
