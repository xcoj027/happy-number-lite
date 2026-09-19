/*
 * Happy Number - Open Source Math Game
 *
 * This is an open-source project of https://math-hero.online and https://happy-number.online
 * The author of this project is TNQ MEDIA
 * GitHub: https://github.com/xcoj027/happy-number-lite
 *
 * You are free to clone, modify, contribute, fork, and build commercial products
 * from this project. All pull requests are welcome.
 * You can also open any issues or report bugs.

 */
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App.tsx';

function printCopyrightBanner() {
  const titleStyle =
    'font-size: 28px; font-weight: 800; color: #ffffff; background: #0f766e; padding: 6px 14px; border-radius: 8px;';

  console.log('%cHappy Number (LITE)', titleStyle);
  console.log(`
                               
▄▄▄▄▄▄▄▄▄ ▄▄▄    ▄▄▄   ▄▄▄▄▄   
▀▀▀███▀▀▀ ████▄  ███ ▄███████▄ 
   ███    ███▀██▄███ ███   ███ 
   ███    ███  ▀████ ███▄█▄███ 
   ███    ███    ███  ▀█████▀  
                           ▀▀  
                               
    `);
  console.log(
      'Official application: https://happy-number.cloud\n' +
      'Source code: https://github.com/xcoj027/happy-number-lite'
  );
}

printCopyrightBanner();

createRoot(document.getElementById('root')!).render(
  <App />
);
