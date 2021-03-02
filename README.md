# react-hook-recaptcha

> React hook for [google-recaptcha v2](https://developers.google.com/recaptcha/docs/display)

A tiny hook with less than 1KB bundle size (after minified + gzipped) as per https://bundlephobia.com/result?p=react-hook-recaptcha

## Install

```sh
// with npm
npm install react-hook-recaptcha

// with yarn
yarn add react-hook-recaptcha
```

## useRecaptcha hook parameters explanation
```javascript
 * @param {Object} config configuration of recaptcha
 * @param {string} config.containerId  ID of the container to render the recaptcha widget
 * @param {string} config.sitekey client-side sitekey
 * @param {string} config.size the size of the widget. Value can be either of "normal", "compact", "invisible"
 * @param {string} config.theme The color theme of the widget. Value can be either of "dark" or "light". This is only applicable to checkbox recaptcha
 * @param {string} config.badge Reposition the recaptcha badge. Value can be either of "bottomright", "bottomleft", 'inline'. 'inline' lets you position it with CSS. This is only applicable to invisible recaptcha
 * @param {Function} config.successCallback executed when the user submits a successful response and passes the challenge if it prompts up. The g-recaptcha-response token is passed to the callback.
 * @param {Function} config.expiredCallback executed when the recaptcha response expires and the user needs to re-verify.
 * @param {Function} config.errorCallback executed when recaptcha encounters an error (usually network connectivity) and cannot continue until connectivity is restored. If you specify a function here, you are responsible for informing the user that they should retry.
```

## Examples

### Example 1 - Checkbox/display reCAPTCHA
![checkbox recaptcha demo](https://github.com/tomliangg/react-hook-recaptcha/blob/main/demo/checkbox_recaptcha.gif)

Codesandbox demo: https://codesandbox.io/s/userecaptcha-example-checkbox-ogppw?file=/src/App.js

```jsx
import React, { useState } from "react";
import { useRecaptcha } from "react-hook-recaptcha";

const sitekey = "6LeIxAcTAAAAAJcZVRqyHh71UMIEGNQ_MXjiZKhI";  // change to your sitekey
const containerId = "test-recaptcha";  // this id can be customized

export default function CheckboxCaptcha() {
  const [captchaResponse, setCaptchaResponse] = useState(null);
  const successCallback = (response) => {
    setCaptchaResponse(response);
  };
  const expiredCallback = () => setCaptchaResponse(null);

  useRecaptcha({
    containerId,
    successCallback,
    expiredCallback,
    sitekey,
    size: "normal",
  });

  const submitHandler = (e) => {
    e.preventDefault();
    const inputNameValue = document.querySelector("#name").value;
    alert(
      `Hello ${inputNameValue} \n Recaptcha Response is: ${captchaResponse}`
    );
  };

  return (
    <form onSubmit={submitHandler}>
      <h3>Enter a name and hit submit</h3>
      <label htmlFor="name">name:</label>
      <input
        type="text"
        id="name"
        name="name"
        style={{ marginRight: "10px" }}
      />
      <button disabled={!captchaResponse} type="submit">
        Submit
      </button>
      <p>This form is protected by Invisible Recaptcha</p>
      <div id={containerId} className="g-recaptcha" />
    </form>
  );
}
```


### Example 2 - Invisible reCAPTCHA - Programmatically invoke the challenge
![invisible recaptcha demo](https://github.com/tomliangg/react-hook-recaptcha/blob/main/demo/invisible_recaptcha.gif)

Codesandbox demo: https://codesandbox.io/s/userecaptcha-example-invisible-tr32u?file=/src/App.js

It's more versatile to programmatically invoke the challenge. This way, you can control the flow of resetting and executing recaptcha. This example works well with form that requires validation. Whenever a form fails the validation, you can reset the recaptcha and get a new response in the new submit.
```jsx
import React from "react";
import { useRecaptcha } from "react-hook-recaptcha";

const sitekey = "6LeIxAcTAAAAAJcZVRqyHh71UMIEGNQ_MXjiZKhI"; // change to your site key
const containerId = "test-recaptcha"; // this id can be customized

export default function InvisibleCaptcha() {
  const successCallback = (response) => {
    const inputNameValue = document.querySelector("#name").value;
    alert(`Hello ${inputNameValue} \n Recaptcha Response is: ${response}`);
  };

  const { recaptchaLoaded, recaptchaWidget } = useRecaptcha({
    containerId,
    successCallback,
    sitekey,
    size: "invisible"
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
      <input
        type="text"
        id="name"
        name="name"
        style={{ marginRight: "10px" }}
      />
      <button disabled={!recaptchaLoaded} type="submit">
        Submit
      </button>
      <p>This form is protected by Invisible Recaptcha</p>
      <div id={containerId} />
    </form>
  );
}
```


### Example 3 - Invisible reCAPTCHA - Automatically bind the challenge to a button

Codesandbox demo: https://codesandbox.io/s/userecaptcha-example-bind-challenge-to-a-button-jxyjf?file=/src/App.js

It's very much like Example 2 but a bit simpler. The downside of automatically binding the challenge is that it doesn't work well if the form requires validation because this approach will have a problem resubmitting.
```jsx
import React from "react";
import { useRecaptcha } from "react-hook-recaptcha";

const sitekey = "6LeIxAcTAAAAAJcZVRqyHh71UMIEGNQ_MXjiZKhI"; // change to your site key
const containerId = "test-recaptcha"; // this id can be customized

export default function InvisibleCaptcha() {
  const successCallback = (response) => {
    const inputNameValue = document.querySelector("#name").value;
    alert(`Hello ${inputNameValue} \n Recaptcha Response is: ${response}`);
  };

  const { recaptchaLoaded } = useRecaptcha({
    containerId,
    successCallback,
    sitekey,
    size: "invisible"
  });

  return (
    <form>
      <h3>Enter a name and hit submit</h3>
      <label htmlFor="name">name:</label>
      <input
        type="text"
        id="name"
        name="name"
        style={{ marginBottom: "20px" }}
      />
      <button disabled={!recaptchaLoaded} type="submit" id={containerId}>
        Submit
      </button>
      <p>This form is protected by Invisible Recaptcha</p>
    </form>
  );
}
```


### Example 4 - useRecaptcha hook with a form library
![using with react-hook-form demo](https://github.com/tomliangg/react-hook-recaptcha/blob/main/demo/use_with_form_lib.gif)

Codesandbox demo: https://codesandbox.io/s/userecaptcha-example-using-with-react-hook-form-wyk4g?file=/src/App.js

useRecaptcha hook can work with any form libraries. Using react-hook-form for an example:
```jsx
import React from "react";
import { useRecaptcha } from "react-hook-recaptcha";
import { useForm } from "react-hook-form";

const sitekey = "6LeIxAcTAAAAAJcZVRqyHh71UMIEGNQ_MXjiZKhI"; // change to your site key
const containerId = "test-recaptcha"; // this id can be customized

export default function Form() {
  const { register, handleSubmit, errors } = useForm();
  const onSubmit = (data) => {
    let outputMsg = "";
    Object.keys(data).forEach((key) => {
      outputMsg += `${key}: ${data[key]} \n`;
    });
    alert(outputMsg);
  };

  const successCallback = (response) =>
    handleSubmit((data) => onSubmit({ ...data, catchaResponse: response }))();

  const { recaptchaLoaded, recaptchaWidget } = useRecaptcha({
    containerId,
    successCallback,
    sitekey,
    size: "invisible"
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
      <input
        type="text"
        placeholder="Name"
        name="Name"
        ref={register({
          required: true,
          maxLength: 80
        })}
      />
      {errors.Name && <p>This field is required</p>}
      <input
        type="text"
        placeholder="Email"
        name="Email"
        ref={register({
          required: "This field is required",
          pattern: {
            value: /^\S+@\S+$/i,
            message: "invalid email format"
          }
        })}
      />
      {errors.Email && <p>{errors.Email.message}</p>}

      <input type="submit" disabled={!recaptchaLoaded} />
      <div id={containerId} />
    </form>
  );
}
```
