import { toast } from 'sonner';
import axios from 'axios';

// Pinata configuration
const PINATA_API_KEY = import.meta.env.VITE_PINATA_API_KEY ;
const PINATA_API_SECRET = import.meta.env.VITE_PINATA_API_SECRET;
const PINATA_JWT = import.meta.env.VITE_PINATA_JWT;

// Pinata API endpoints
const PINATA_UPLOAD_URL = 'https://api.pinata.cloud/pinning/pinFileToIPFS';

/**
 * Uploads a file to IPFS using Pinata
 * @param file The file to upload
 * @returns The IPFS hash (CID) of the uploaded file
 */
export const uploadToIPFS = async (file: File): Promise<string> => {
  try {
    // Show loading toast
    const loadingToast = toast.loading('Uploading image to IPFS via Pinata...');

    // Create form data for the file upload
    const formData = new FormData();
    formData.append('file', file);

    // Add metadata
    const metadata = JSON.stringify({
      name: `waste-image-${Date.now()}`,
      keyvalues: {
        app: 'wastevan',
        timestamp: Date.now().toString(),
        type: 'waste-image'
      }
    });
    formData.append('pinataMetadata', metadata);

    // Configure options for faster pinning
    const options = JSON.stringify({
      cidVersion: 1,
    });
    formData.append('pinataOptions', options);

    // Upload to Pinata
    let response: { data: { IpfsHash: string } };

    // Try using JWT first (preferred method)
    if (PINATA_JWT) {
      response = await axios.post(PINATA_UPLOAD_URL, formData, {
        headers: {
          'Authorization': `Bearer ${PINATA_JWT}`,
        },
      });
    }
    // Fall back to API key/secret if JWT is not available
    else if (PINATA_API_KEY && PINATA_API_SECRET) {
      response = await axios.post(PINATA_UPLOAD_URL, formData, {
        headers: {
          'pinata_api_key': PINATA_API_KEY,
          'pinata_secret_api_key': PINATA_API_SECRET,
        },
      });
    } else {
      throw new Error('Pinata credentials not configured');
    }

    // Dismiss loading toast and show success
    toast.dismiss(loadingToast);
    toast.success('Image uploaded to IPFS successfully');

    // Return the IPFS hash (CID)
    return response.data.IpfsHash;
  } catch (error) {
    console.error('Error uploading to IPFS via Pinata:', error);
    toast.error('Failed to upload image to IPFS. Please try again.');
    throw new Error('Failed to upload to IPFS via Pinata');
  }
};

/**
 * Gets the IPFS gateway URL for a given hash
 * @param ipfsHash The IPFS hash (CID)
 * @returns The gateway URL
 */
export const getIPFSGatewayUrl = (ipfsHash: string): string => {
  // Using Pinata's gateway (if you have a dedicated gateway)
  // You can also use public gateways like ipfs.io or cloudflare-ipfs.com
  return `https://app.pinata.cloud/ipfs/${ipfsHash}`;
};

/**
 * Fallback function to use if IPFS upload fails
 * This is a mock function that simulates an IPFS upload
 * @returns A mock IPFS hash
 */
export const mockIPFSUpload = async (): Promise<string> => {
  // Simulate a delay
  await new Promise(resolve => setTimeout(resolve, 1500));

  // Return a mock IPFS hash
  return 'QmExampleHash' + Math.floor(Math.random() * 1000000);
};

