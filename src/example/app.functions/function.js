const axios = require('axios');

exports.main = async (context, sendResponse) => {
  const baseUrl = 'https://picsum.photos/300/200';
  const urls = [
    `${baseUrl}`,
    `${baseUrl}?grayscale`,
    `${baseUrl}`,
    `${baseUrl}?grayscale&random=1`,
    `${baseUrl}?random=1`,
    `${baseUrl}?grayscale&random=2`,
    `${baseUrl}?blur&random=3`,
    `${baseUrl}?grayscale&random=4`,
    `${baseUrl}?random=5`,
    `${baseUrl}?grayscale&random=6`,
    `${baseUrl}?blur&random=7`,
    `${baseUrl}?grayscale&random=8`,
  ];

  // Make requests and follow redirects to get final image URLs
  const requests = urls.map((url) =>
    axios
      .get(url, {
        maxRedirects: 0,
        validateStatus: (status) => status === 302,
      })
      .then((res) => res.headers.location)
      .catch(() => null),
  );

  const images = await Promise.all(requests);

  return {
    statusCode: 200,
    body: {
      images: images.filter(Boolean), // filter out any failed requests
    },
  };
};
