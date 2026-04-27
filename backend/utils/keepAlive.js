import https from 'https';

const startKeepAlive = () => {
  const pingInterval = 14 * 60 * 1000;
  setInterval(() => {
    if (!process.env.BACKEND_URL) return;
    
    https.get(process.env.BACKEND_URL, (response) => {
      if (response.statusCode === 200) {
        console.log('Keep-alive ping successful:', new Date().toISOString());
      } else {
        console.log('Keep-alive ping failed with status code:', response.statusCode);
      }
    }).on('error', (error) => {
      console.error('Keep-alive ping error:', error.message);
    });
  }, pingInterval);
};

export default startKeepAlive;
