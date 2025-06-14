// Signature generation service using the provided signature module
const API_CONFIG = {
  BASE_URL: 'https://onlinesignatures.net/api/get-signatures-data',
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

async function fetchSignatureData({ firstName, lastName, styles = getRandomInt(API_CONFIG.MIN_STYLE, API_CONFIG.MAX_STYLE) }) {
  if (!firstName || !lastName) {
    throw new Error('First name and last name are required');
  }

  const apiUrl = buildApiUrl({ 'first-name': firstName, 'last-name': lastName, styles });

  try {
    const response = await fetch(apiUrl);

    if (!response.ok) {
      throw new Error(`API request failed: HTTP ${response.status} ${response.statusText}`);
    }

    const data = await response.json();

    if (!data.data) {
      throw new Error('Invalid API response: missing data field');
    }

    return { ...data, usedStyle: styles };
  } catch (error) {
    throw new Error(`Failed to fetch signature data: ${error.message}`);
  }
}

export async function generateSignature(firstName, lastName) {
  try {
    console.log(`Generating signature for: ${firstName} ${lastName}`);
    
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