import { useState, useEffect } from 'react';
import { useScript } from './useScript';

export const RECAPTCHA_SCRIPT_SRC_URL =
  'https://www.google.com/recaptcha/api.js?render=explicit';

let timer;

/**
 * a hook integrates google-recaptcha v2 into react function components
 * @param {Object} config configuration of recaptcha
 * @param {string} config.containerId  ID of the container to render the recaptcha widget
 * @param {string} config.sitekey client-side sitekey
 * @param {string} config.size the size of the widget. Value can be either of "normal", "compact", "invisible"
 * @param {string} config.theme The color theme of the widget. Value can be either of "dark" or "light". This is only applicable to checkbox recaptcha
 * @param {string} config.badge Reposition the recaptcha badge. Value can be either of "bottomright", "bottomleft", 'inline'. 'inline' lets you position it with CSS. This is only applicable to invisible recaptcha
 * @param {Function} config.successCallback executed when the user submits a successful response and passes the challenge if it prompts up. The g-recaptcha-response token is passed to the callback.
 * @param {Function} config.expiredCallback executed when the recaptcha response expires and the user needs to re-verify.
 * @param {Function} config.errorCallback executed when recaptcha encounters an error (usually network connectivity) and cannot continue until connectivity is restored. If you specify a function here, you are responsible for informing the user that they should retry.
 * @return {Object}
 */
export function useRecaptcha({
  containerId,
  sitekey,
  size,
  theme,
  successCallback,
  expiredCallback,
  errorCallback,
  }) {
  // https://stackoverflow.com/questions/45240833/what-are-the-benefits-of-explicitly-rendering-recaptcha-widget-as-opposed-to-aut
  // explicit rendering is needed because the view template of applicatio may not be loaded yet when recaptcha is loaded
  useScript(RECAPTCHA_SCRIPT_SRC_URL);

  const [recaptchaLoaded, setRecaptchaLoaded] = useState(
    window?.grecaptcha?.render ? true : false,
  );
  const [recaptchaWidget, setRecaptchaWidget] = useState(null);

  useEffect(() => {
    timer = window.setInterval(() => {
      if (window?.grecaptcha?.render) {
        setRecaptchaLoaded(true);
      }
    }, 500);

    return () => {
      clearInterval(timer);
    };
  }, []);

  useEffect(() => {
    if (recaptchaLoaded && recaptchaWidget === null) {
      clearInterval(timer);
      const widget = window.grecaptcha.render(containerId, {
        sitekey,
        size,
        theme,
        callback: successCallback,
        'expired-callback': expiredCallback,
        'error-callback': errorCallback,
      });
      setRecaptchaWidget(widget);
    }
  }, [recaptchaLoaded, successCallback, recaptchaWidget, containerId]);

  return {
    recaptchaLoaded,
    recaptchaWidget,
  };
}
