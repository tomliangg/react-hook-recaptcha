import React, { useState } from 'react';
import InvisibleCaptcha from './InvisibleCaptcha';
import CheckboxCaptcha from './CheckboxCaptcha';

export default function Switch() {
  const [type, setType] = useState('invisible');

  return (
    <div>
      <p>Please select Recaptcha type:</p>
      <input type="radio" id="invisible" name="type" value="invisble" defaultChecked={type === 'invisible'} onClick={() => setType('invisible')} />
      <label htmlFor="invisble">invisible</label>
      <br />
      <input type="radio" id="checkbox" name="type" value="checkbox" defaultChecked={type === 'checkbox'} onClick={() => setType('checkbox')} />
      <label htmlFor="checkbox">checkbox</label>
      <br />
      <br />

      {type === 'invisible' ? <InvisibleCaptcha /> : <CheckboxCaptcha />}
    </div>
  )
}