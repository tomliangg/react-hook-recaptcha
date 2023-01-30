/**
 * @vitest-environment jsdom
 */
import { render, screen, cleanup } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { useRecaptcha, RECAPTCHA_SCRIPT_SRC_URL } from './useRecaptcha';

const successCallback = vi.fn();
const sitekey = '6LeIxAcTAAAAAJcZVRqyHh71UMIEGNQ_MXjiZKhI';

const containerId = 'test-recaptcha-widget-id';
function createReCaptchaMock() {
  return {
    render: vi.fn(function (ele, options) {
      this._verify = options.callback;
      this._expire = options['expired-callback'];
      return containerId;
    }),
    execute: vi.fn(function () {
      this._verify();
    }),
    reset: vi.fn(),
  };
}

window.grecaptcha = createReCaptchaMock();

const TestInvisibleRecaptcha = () => {
  const { recaptchaLoaded, recaptchaWidget } = useRecaptcha({
    containerId,
    successCallback,
    size: 'invisible',
    sitekey,
  });

  const executeCaptcha = (e) => {
    e.preventDefault();
    if (recaptchaWidget !== null) {
      window.grecaptcha.reset(recaptchaWidget);
      window.grecaptcha.execute(recaptchaWidget);
    }
  };

  return (
    <form onSubmit={executeCaptcha}>
      <span>invisible Recaptcha testing form</span>
      <button disabled={!recaptchaLoaded} type="submit">
        Submit form
      </button>
      <div id={containerId} />
    </form>
  );
};

const TestInvisibleRecaptchaResultMethods = () => {
  const { recaptchaLoaded, execute, reset } = useRecaptcha({
    containerId,
    successCallback,
    size: 'invisible',
    sitekey,
  });

  const executeCaptcha = (e) => {
    e.preventDefault();
    reset();
    execute();
  };

  return (
    <form onSubmit={executeCaptcha}>
      <span>invisible Recaptcha testing form</span>
      <button disabled={!recaptchaLoaded} type="submit">
        Submit form
      </button>
      <div id={containerId} />
    </form>
  );
};

describe('useRecaptcha hook - invisible recaptcha', () => {
  afterEach(() => {
    cleanup();
    vi.clearAllMocks();
  });

  it('should append a script tag with recaptcha source', () => {
    expect(document.querySelectorAll('script').length).toBe(0);
    render(<TestInvisibleRecaptcha />);

    const script = document.querySelector('script');
    expect(script).not.toBeNull();
    expect(script.src).toBe(RECAPTCHA_SCRIPT_SRC_URL);
  });

  it('should execute successCallback when submits a successful response', async () => {
    render(<TestInvisibleRecaptcha />);
    expect(window.grecaptcha.execute).not.toBeCalled();
    expect(successCallback).not.toBeCalled();

    await userEvent.click(screen.getByRole('button'));
    expect(window.grecaptcha.execute).toHaveBeenCalledTimes(1);
    expect(successCallback).toHaveBeenCalledTimes(1);
  });

  it('execute method should fallback to window.grecaptcha execute method', async () => {
    render(<TestInvisibleRecaptchaResultMethods />);
    expect(window.grecaptcha.execute).not.toBeCalled();
    expect(window.grecaptcha.reset).not.toBeCalled();
    expect(successCallback).not.toBeCalled();

    await userEvent.click(screen.getByRole('button'));
    expect(window.grecaptcha.execute).toHaveBeenCalledTimes(1);
    expect(window.grecaptcha.reset).toHaveBeenCalledTimes(1);
    expect(successCallback).toHaveBeenCalledTimes(1);
  });
});
