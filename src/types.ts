export {};

// ref: https://developers.google.com/recaptcha/docs/invisible#render_param
// ref: https://developers.google.com/recaptcha/docs/display#render_param
type RecaptchaRenderContainer = string | HTMLElement;

interface RecaptchaRenderParameters {
  sitekey: string;
  badge?: 'bottomright' | 'bottomleft' | 'inline';
  size?: 'normal' | 'compact' | 'invisible';
  theme?: 'dark' | 'light';
  callback?: (recaptchaResponse: string) => void;
  'expired-callback'?: (recaptchaResponse: string) => void;
  'error-callback'?: (recaptchaResponse: string) => void;
}

export interface UseRecaptchaProps {
  containerId: string;
  sitekey: RecaptchaRenderParameters['sitekey'];
  size?: RecaptchaRenderParameters['size'];
  theme?: RecaptchaRenderParameters['theme'];
  badge?: RecaptchaRenderParameters['badge'];
  successCallback?: RecaptchaRenderParameters['callback'];
  expiredCallback?: RecaptchaRenderParameters['expired-callback'];
  errorCallback?: RecaptchaRenderParameters['error-callback'];
}

declare global {
  interface Window {
    // ref: https://developers.google.com/recaptcha/docs/invisible#js_api
    grecaptcha?: {
      onload: VoidFunction;
      render: (container: RecaptchaRenderContainer, params: RecaptchaRenderParameters) => number;
      execute: (widgetId?: number) => void;
      reset: (widgetId?: number) => void;
      getResponse: (widgetId?: number) => void;
    };
  }
}
