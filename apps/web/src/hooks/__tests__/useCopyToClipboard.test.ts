import { renderHook, act } from "@testing-library/react";
import { useCopyToClipboard } from "../useCopyToClipboard";

Object.defineProperty(navigator, "clipboard", {
  value: {
    writeText: jest.fn(),
  },
  configurable: true,
});

describe("useCopyToClipboard", () => {
  beforeEach(() => {
    jest.useFakeTimers();
    (navigator.clipboard.writeText as jest.Mock).mockResolvedValue(undefined);
  });

  afterEach(() => {
    jest.useRealTimers();
    jest.clearAllMocks();
  });

  it("starts with copied = false", () => {
    const { result } = renderHook(() => useCopyToClipboard());
    expect(result.current.copied).toBe(false);
  });

  it("sets copied = true after copying", async () => {
    const { result } = renderHook(() => useCopyToClipboard());
    await act(async () => {
      await result.current.copy("hello");
    });
    expect(result.current.copied).toBe(true);
  });

  it("calls clipboard.writeText with the correct text", async () => {
    const { result } = renderHook(() => useCopyToClipboard());
    await act(async () => {
      await result.current.copy("test text");
    });
    expect(navigator.clipboard.writeText).toHaveBeenCalledWith("test text");
  });

  it("resets copied to false after 2 seconds", async () => {
    const { result } = renderHook(() => useCopyToClipboard());
    await act(async () => {
      await result.current.copy("hello");
    });
    expect(result.current.copied).toBe(true);
    act(() => {
      jest.advanceTimersByTime(2000);
    });
    expect(result.current.copied).toBe(false);
  });

  it("does not error when unmounted before the reset timer fires", async () => {
    const { result, unmount } = renderHook(() => useCopyToClipboard());
    await act(async () => {
      await result.current.copy("hello");
    });
    unmount();
    expect(() => jest.advanceTimersByTime(2000)).not.toThrow();
  });

  it("clears the previous timer when copy is called again quickly", async () => {
    const { result } = renderHook(() => useCopyToClipboard());
    await act(async () => {
      await result.current.copy("first");
    });
    act(() => {
      jest.advanceTimersByTime(1000);
    });
    await act(async () => {
      await result.current.copy("second");
    });
    act(() => {
      jest.advanceTimersByTime(1000);
    });
    // Only 1s has passed since the second copy; still true because the
    // first timer must not have fired and flipped this back to false early.
    expect(result.current.copied).toBe(true);
  });
});
