// this component is used as an entry point for vite
// intended for dev testing
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import InvisibleCaptcha from './InvisibleCaptcha';
// import CheckboxCaptcha from './CheckboxCaptcha';

const rootElement = document.getElementById('root') as HTMLDivElement;
const root = createRoot(rootElement);

root.render(
  <StrictMode>
    <InvisibleCaptcha />
  </StrictMode>,
);
