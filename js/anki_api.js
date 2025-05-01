// --- Anki JS API ---
// requires Anki JS API Add-on

// API Setup (mobile only)

/* disabled for now, until officially supported on Android, and AnkiMobile is supported */

// var api;
// if (isMobile) {
//   var jsApiContract = {
//     version: '0.0.3',
//     developer: 'your-email@example.com' /* your email here */,
//   };
//   api = new AnkiDroidJS(jsApiContract);
// }

// async function ankiCall(method, apiFallback = false) {
//   if (isMobile && !apiFallback) {
//     const response = await api[method]();
//     if (response && response.success) {
//       return response.value;
//     } else {
//       if (response && response.error) {
//         throw new Error(
//           `AnkiDroid API call ${method} failed. Error: ${response.error}`,
//         );
//       } else {
//         throw new Error(`AnkiDroid API call ${method} failed.`);
//       }
//     }
//   } else {
//     const response = await new Promise((resolve) =>
//       pycmd(`AnkiJS.${method}()`, resolve),
//     );

//     // Handle NaN and other cases if needed
//     const number = isNaN(Number(response)) ? 0 : Number(response);
//     return number;
//   }
// }

async function ankiCall(method) {
  const response = await new Promise((resolve) =>
    pycmd(`AnkiJS.${method}()`, resolve),
  );

  // Handle NaN and other cases if needed
  const number = isNaN(Number(response)) ? 0 : Number(response);
  return number;
}
