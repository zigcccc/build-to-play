import { initBotId } from 'botid/client/core';

// Server actions POST to the page they're rendered on; the booking flow can open on any page.
initBotId({
  protect: [
    { path: '/', method: 'POST' },
    { path: '/*', method: 'POST' },
    { path: '/*/*', method: 'POST' },
    { path: '/*/*/*', method: 'POST' },
  ],
});
