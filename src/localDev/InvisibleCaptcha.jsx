import React from 'react';
import { useRecaptcha } from '../useRecaptcha';

const sitekey = '6LeIxAcTAAAAAJcZVRqyHh71UMIEGNQ_MXjiZKhI';
const containerId = 'test-recaptcha';

export default function InvisibleCaptcha() {
  const successCallback = (response) => {
    const inputNameValue = document.querySelector('#name').value;
    alert(`Hello ${inputNameValue} \n Recaptcha Response is: ${response}`);
  };

  const { recaptchaLoaded, recaptchaWidget } = useRecaptcha({
    containerId,
    successCallback,
    sitekey,
    size: 'invisible',
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
      <h3>Enter a name and hit submit</h3>
      <label htmlFor="name">name:</label>
      <input type="text" id="name" name="name" style={{ marginRight: '10px' }} />
      <button disabled={!recaptchaLoaded} type="submit">
        Submit
      </button>
      <p>This form is protected by Invisible Recaptcha</p>
      <div id={containerId} />
    </form>
  );
}
