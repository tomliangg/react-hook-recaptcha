import { FormEvent, useState } from 'react';
import { useRecaptcha } from '../useRecaptcha';

const containerId = 'test-recaptcha';
const sitekey = '6LeIxAcTAAAAAJcZVRqyHh71UMIEGNQ_MXjiZKhI';

export default function CheckboxCaptcha() {
  const [captchaResponse, setCaptchaResponse] = useState<string | null>(null);
  const successCallback = (response: string) => {
    setCaptchaResponse(response);
  };
  const expiredCallback = () => setCaptchaResponse(null);

  useRecaptcha({
    containerId,
    successCallback,
    expiredCallback,
    size: 'normal',
    sitekey,
  });

  const submitHandler = (e: FormEvent) => {
    e.preventDefault();
    const inputNameValue = (document.querySelector('#name') as HTMLInputElement).value;
    alert(`Hello ${inputNameValue} \n Recaptcha Response is: ${captchaResponse}`);
  };

  return (
    <form onSubmit={submitHandler}>
      <h3>Enter a name and hit submit</h3>
      <label htmlFor="name">name:</label>
      <input type="text" id="name" name="name" style={{ marginRight: '10px' }} />
      <button disabled={!captchaResponse} type="submit">
        Submit
      </button>
      <p>This form is protected by Invisible Recaptcha</p>
      <div id={containerId} className="g-recaptcha" />
    </form>
  );
}
