const axios = require('axios');
const cheerio = require('cheerio');

// Simple in-memory cache (for serverless functions, this resets on each cold start)
let cache = {
  data: null,
  timestamp: null,
  duration: 30 * 60 * 1000, // 30 minutes
};

exports.main = async (context) => {
  try {
    const YOUNGLA_URL = process.env.YOUNGLA_URL || 'https://youngla.com';

    // Check cache first
    const now = Date.now();
    if (
      cache.data &&
      cache.timestamp &&
      now - cache.timestamp < cache.duration
    ) {
      console.log('Serving cached Instagram data');
      return {
        statusCode: 200,
        body: {
          success: true,
          cached: true,
          ...cache.data,
        },
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'GET',
          'Access-Control-Allow-Headers': 'Content-Type',
          'Cache-Control': 'public, max-age=1800', // 30 minutes
        },
      };
    }

    console.log('Scraping fresh YoungLA Instagram data from:', YOUNGLA_URL);

    // Scrape the YoungLA website
    const response = await axios.get(YOUNGLA_URL, {
      headers: {
        'User-Agent':
          'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
        Accept:
          'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
        'Accept-Language': 'en-US,en;q=0.5',
        'Accept-Encoding': 'gzip, deflate',
        Connection: 'keep-alive',
      },
      timeout: 10000, // 10 second timeout
    });

    const $ = cheerio.load(response.data);
    const instagramImages = [];

    // Target the specific covet-pics-gallery-item elements
    $('covet-pics-gallery-item').each((index, element) => {
      const $item = $(element);

      // Extract data from the custom element attributes
      const imageUrl = $item.attr('image-url');
      const imageHighResUrl = $item.attr('image-high-resolution-url');
      const itemId = $item.attr('item-id');
      const itemSource = $item.attr('item-source');
      const itemType = $item.attr('item-type');
      const itemIndex = $item.attr('item-index');
      const userName = $item.attr('user-name');
      const createdTime = $item.attr('created-time');
      const altTag = $item.attr('alt-tag');

      // Also get the img element data for additional info
      const $img = $item.find('img.bg');
      const imgSrc = $img.attr('src');
      const imgSrcset = $img.attr('srcset');
      const imgAlt = $img.attr('alt');

      // Only process Instagram items with valid image URLs
      if (imageUrl && itemSource === 'instagram' && userName === 'youngla') {
        instagramImages.push({
          id: itemId,
          imageUrl: imageUrl,
          highResUrl: imageHighResUrl,
          type: itemType,
          index: parseInt(itemIndex) || 0,
          username: userName,
          createdTime: createdTime,
          caption: altTag || imgAlt || '',
          scrapedAt: new Date().toISOString(),
        });
      }
    });

    // Sort by index to maintain order
    instagramImages.sort((a, b) => a.index - b.index);

    console.log(
      `Found ${instagramImages.length} Instagram images from YoungLA`,
    );

    const responseData = {
      imagesFound: instagramImages.length,
      images: instagramImages,
      scrapedAt: new Date().toISOString(),
      message:
        instagramImages.length > 0
          ? `Successfully scraped ${instagramImages.length} YoungLA Instagram images`
          : 'No Instagram images found on the YoungLA page',
    };

    // Update cache
    cache.data = responseData;
    cache.timestamp = now;

    // Return success response
    return {
      statusCode: 200,
      body: {
        success: true,
        cached: false,
        ...responseData,
      },
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Cache-Control': 'public, max-age=1800', // 30 minutes
      },
    };
  } catch (error) {
    console.error('Error scraping YoungLA Instagram images:', error.message);

    let errorMessage = 'Failed to scrape YoungLA Instagram images';
    let statusCode = 500;

    if (error.response) {
      statusCode = error.response.status;
      errorMessage = error.response.data?.message || errorMessage;
    } else if (error.code === 'ECONNABORTED') {
      errorMessage = 'Request timeout - YoungLA site may be slow';
    }

    return {
      statusCode: statusCode,
      body: {
        success: false,
        error: errorMessage,
        imagesFound: 0,
      },
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
      },
    };
  }
};
