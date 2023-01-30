import { FormEvent } from 'react';
import { useRecaptcha } from '../useRecaptcha';

const containerId = 'test-recaptcha';
const sitekey = '6LeIxAcTAAAAAJcZVRqyHh71UMIEGNQ_MXjiZKhI';

export default function InvisibleCaptcha() {
  const successCallback = (response: string) => {
    const inputNameValue = (document.querySelector('#name') as HTMLInputElement).value;
    alert(`Hello ${inputNameValue} \n Recaptcha Response is: ${response}`);
  };

  const { recaptchaLoaded, execute, reset } = useRecaptcha({
    containerId,
    successCallback,
    sitekey,
    size: 'invisible',
  });

  const executeCaptcha = (e: FormEvent) => {
    e.preventDefault();
    reset();
    execute();
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
