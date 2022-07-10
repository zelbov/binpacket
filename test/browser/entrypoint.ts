const req = require.context('../unit', true, /\.test\.ts$/)
req.keys().forEach(req);