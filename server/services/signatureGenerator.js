// Signature generation service using the provided signature module
import axios from 'axios';

const API_CONFIG = {
  BASE_URL: process.env.SIGNATURE_API_URL || 'https://onlinesignatures.net/api/get-signatures-data',
  MIN_STYLE: 0,
  MAX_STYLE: 8,
  TYPOGRAPHY_KEYS: [
    'nikita Sobolev',
    'SNikita', 
    'Nsobolev',
    'Nikita',
    'Sobolev',
    'SANikita',
    'NASobolev'
  ]
};

function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function getRandomTypography() {
  const keys = API_CONFIG.TYPOGRAPHY_KEYS;
  return keys[getRandomInt(0, keys.length - 1)];
}

function buildApiUrl(params) {
  const url = new URL(API_CONFIG.BASE_URL);
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== '') {
      url.searchParams.append(key, value.toString());
    }
  });
  return url.toString();
}

// Different header configurations to try in production
function getHeaderConfigurations() {
  return [
    // Configuration 1: Minimal headers (most compatible)
    {
      name: 'minimal',
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Accept': 'application/json, text/plain, */*'
      }
    },
    // Configuration 2: Standard browser headers
    {
      name: 'standard',
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Accept': 'application/json, text/plain, */*',
        'Accept-Language': 'en-US,en;q=0.9',
        'Referer': 'https://onlinesignatures.net/',
        'Origin': 'https://onlinesignatures.net'
      }
    },
    // Configuration 3: With Accept-Encoding
    {
      name: 'with-encoding',
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Accept': 'application/json, text/plain, */*',
        'Accept-Language': 'en-US,en;q=0.9',
        'Accept-Encoding': 'gzip, deflate, br',
        'Referer': 'https://onlinesignatures.net/',
        'Origin': 'https://onlinesignatures.net'
      }
    }
  ];
}

async function fetchSignatureData({ firstName, lastName, styles = getRandomInt(API_CONFIG.MIN_STYLE, API_CONFIG.MAX_STYLE) }) {
  if (!firstName || !lastName) {
    throw new Error('First name and last name are required');
  }

  const apiUrl = buildApiUrl({ 'first-name': firstName, 'last-name': lastName, styles });
  const isProduction = process.env.NODE_ENV === 'production';
  
  // Log detailed information for debugging
  console.log(`Fetching signature data from: ${apiUrl}`);
  console.log(`Environment: ${isProduction ? 'production' : 'development'}`);

  // In production, try different header configurations if one fails
  const headerConfigs = isProduction ? getHeaderConfigurations() : [
    {
      name: 'development',
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Accept': 'application/json, text/plain, */*',
        'Accept-Language': 'en-US,en;q=0.9',
        'Referer': 'https://onlinesignatures.net/',
        'Origin': 'https://onlinesignatures.net'
      }
    }
  ];

  let lastError = null;

  for (const config of headerConfigs) {
    try {
      console.log(`Trying header configuration: ${config.name}`);
      console.log(`Headers:`, config.headers);

      let data;
      
      if (isProduction) {
        // Use axios in production as it handles TLS/SSL and headers better
        const response = await axios.get(apiUrl, {
          headers: config.headers,
          timeout: 30000, // 30 second timeout
          validateStatus: (status) => status < 500 // Don't throw on 4xx errors
        });
        
        if (response.status === 403) {
          const errorDetails = {
            status: response.status,
            statusText: response.statusText,
            url: apiUrl,
            responseHeaders: response.headers,
            environment: 'production',
            configName: config.name
          };
          console.error(`API request failed (403) with config '${config.name}':`, errorDetails);
          lastError = new Error(`API request failed: HTTP ${response.status} ${response.statusText}. The API may be blocking the request. URL: ${apiUrl}`);
          continue; // Try next configuration
        }
        
        if (response.status >= 400) {
          const errorDetails = {
            status: response.status,
            statusText: response.statusText,
            url: apiUrl,
            responseHeaders: response.headers,
            configName: config.name
          };
          console.error(`API request failed with config '${config.name}':`, errorDetails);
          throw new Error(`API request failed: HTTP ${response.status} ${response.statusText}. URL: ${apiUrl}`);
        }
        
        data = response.data;
      } else {
        // Use fetch in development (works fine locally)
        const response = await fetch(apiUrl, {
          method: 'GET',
          headers: config.headers
        });

        if (!response.ok) {
          const errorDetails = {
            status: response.status,
            statusText: response.statusText,
            url: apiUrl,
            headers: Object.fromEntries(response.headers.entries())
          };
          console.error('API request failed:', errorDetails);
          
          if (response.status === 403) {
            throw new Error(`API request failed: HTTP ${response.status} ${response.statusText}. The API may be blocking the request. URL: ${apiUrl}`);
          }
          throw new Error(`API request failed: HTTP ${response.status} ${response.statusText}. URL: ${apiUrl}`);
        }

        data = await response.json();
      }

      if (!data.data) {
        throw new Error('Invalid API response: missing data field');
      }

      console.log(`Success with header configuration: ${config.name}`);
      return { ...data, usedStyle: styles };
      
    } catch (error) {
      // If it's a 403 and we have more configs to try, continue
      if (error.message.includes('403') && config !== headerConfigs[headerConfigs.length - 1]) {
        lastError = error;
        console.log(`Config '${config.name}' failed with 403, trying next configuration...`);
        continue;
      }
      
      // For other errors or if this is the last config, throw
      console.error(`Error with config '${config.name}':`, {
        message: error.message,
        url: apiUrl,
        firstName,
        lastName,
        styles
      });
      throw error;
    }
  }

  // If we've tried all configurations and all failed with 403
  if (lastError) {
    throw lastError;
  }

  throw new Error('Failed to fetch signature data: All header configurations failed');
}

export async function generateSignature(firstName, lastName) {
  try {
    
    const apiData = await fetchSignatureData({ firstName, lastName });
    const providers = Object.keys(apiData.data);
    
    if (providers.length === 0) {
      throw new Error('No providers available in API response');
    }

    const randomProvider = providers[getRandomInt(0, providers.length - 1)];
    const signatures = apiData.data[randomProvider];
    const typographyKey = getRandomTypography();
    const signature = signatures[typographyKey];

    const selectedSignature = (signature && signature.image) ? signature : Object.values(signatures).find(sig => sig?.image);

    if (!selectedSignature) {
      throw new Error(`No valid signature found for provider '${randomProvider}'`);
    }

    // Download the signature image
    const imageResponse = await fetch(selectedSignature.image);
    if (!imageResponse.ok) {
      throw new Error(`Failed to download signature image: ${imageResponse.status}`);
    }

    const imageBuffer = await imageResponse.arrayBuffer();

    return {
      success: true,
      imageBuffer: Buffer.from(imageBuffer),
      imageUrl: selectedSignature.image,
      metadata: {
        firstName,
        lastName,
        provider: randomProvider,
        typographyKey,
        usedStyle: apiData.usedStyle,
        generatedAt: new Date().toISOString()
      }
    };

  } catch (error) {
    console.error('Error generating signature:', error);
    return {
      success: false,
      error: error.message
    };
  }
}