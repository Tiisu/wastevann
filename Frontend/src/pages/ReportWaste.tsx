
import React, { useState, useCallback } from 'react';
import { useForm } from 'react-hook-form';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../components/ui/form"
import { PlasticType } from '../utils/web3Utils';
import WasteTypeSelector from '../components/WasteTypeSelector';
import QRCodeGenerator from '../components/QRCodeGenerator';
import { toast } from 'sonner';
import Footer from '../components/Footer';
import { uploadToIPFS, getIPFSGatewayUrl, mockIPFSUpload } from '../utils/ipfsUtils';
import * as contracts from '../utils/contracts';
import { Image, Upload, X } from 'lucide-react';

interface WasteFormValues {
  plasticType: PlasticType;
  quantity: number;
  location: string;
  image: File | null;
}



const ReportWaste: React.FC = () => {
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [qrCodeValue, setQrCodeValue] = useState('');
  const [estimatedReward, setEstimatedReward] = useState(0);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [ipfsHash, setIpfsHash] = useState<string | null>(null);

  const form = useForm<WasteFormValues>({
    defaultValues: {
      plasticType: PlasticType.PET,
      quantity: 1,
      location: '',
      image: null,
    },
  });

  const getUserLocation = async () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          form.setValue('location', `${latitude.toFixed(6)}, ${longitude.toFixed(6)}`);
        },
        (error) => {
          console.error("Error getting location:", error);
          toast.error("Could not get your location. Please enter it manually.");
        }
      );
    } else {
      toast.error("Geolocation is not supported by your browser");
    }
  };

  const handleImageChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Check if the file is an image
      if (!file.type.startsWith('image/')) {
        toast.error('Please upload an image file');
        return;
      }

      // Check file size (limit to 5MB)
      if (file.size > 5 * 1024 * 1024) {
        toast.error('Image size should be less than 5MB');
        return;
      }

      // Set the file in the form
      form.setValue('image', file);

      // Create a preview URL
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  }, [form]);

  const removeImage = useCallback(() => {
    form.setValue('image', null);
    setImagePreview(null);
  }, [form]);

  const onSubmit = async (data: WasteFormValues) => {
    try {
      // Validate that an image is uploaded
      const imageFile = form.getValues('image');
      if (!imageFile) {
        toast.error("Please upload an image of the waste");
        return;
      }

      setIsUploading(true);

      // Upload image to IPFS
      let hash: string;
      try {
        // Use the real IPFS upload function
        hash = await uploadToIPFS(imageFile);
      } catch (error) {
        console.error("Error uploading to IPFS:", error);
        // Fall back to mock upload if real upload fails
        toast.warning("IPFS upload failed, using mock data instead");
        hash = await mockIPFSUpload();
      }

      setIpfsHash(hash);

      // Calculate estimated reward
      const reward = calculateEstimatedReward(data.plasticType, data.quantity);

      // Create QR code data with IPFS hash
      const qrData = JSON.stringify({
        ipfsHash: hash,
        plasticType: data.plasticType,
        quantity: data.quantity,
        location: data.location,
        timestamp: new Date().toISOString(),
      });

      // Call the smart contract to report waste
      try {
        // Convert plastic type to string for the contract
        const wasteTypeString = PlasticType[data.plasticType];

        // Submit the waste report to the blockchain
        await contracts.reportWaste(hash, data.quantity, wasteTypeString);
      } catch (error) {
        console.error("Error submitting to blockchain:", error);
        toast.error("Failed to submit to blockchain. Your report is saved locally.");
      }

      // Update state
      setQrCodeValue(qrData);
      setEstimatedReward(reward);
      setIsSubmitted(true);
      setIsUploading(false);
      toast.success("Waste report submitted successfully!");
    } catch (error) {
      console.error("Error submitting waste report:", error);
      toast.error("Failed to submit waste report. Please try again.");
      setIsUploading(false);
    }
  };

  const calculateEstimatedReward = (plasticType: PlasticType, quantity: number): number => {
    // This would be calculated based on the smart contract logic
    const baseRates: Record<PlasticType, number> = {
      [PlasticType.PET]: 2.5,
      [PlasticType.HDPE]: 2.0,
      [PlasticType.PVC]: 1.5,
      [PlasticType.LDPE]: 1.8,
      [PlasticType.PP]: 2.2,
      [PlasticType.PS]: 1.7,
      [PlasticType.OTHER]: 1.0,
    };

    return Math.round(baseRates[plasticType] * quantity);
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:py-16 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white sm:text-4xl">
            Report Plastic Waste
          </h1>
          <p className="mt-3 max-w-2xl mx-auto text-xl text-gray-500 dark:text-gray-400">
            Help us clean the environment and earn rewards by reporting your plastic waste.
          </p>
        </div>

        {!isSubmitted ? (
          <div className="max-w-md mx-auto bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden p-6">
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <FormField
                  control={form.control}
                  name="plasticType"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Plastic Type</FormLabel>
                      <FormControl>
                        <WasteTypeSelector
                          value={field.value}
                          onValueChange={field.onChange}
                        />
                      </FormControl>
                      <FormDescription>
                        Select the type of plastic you are reporting.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="quantity"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Quantity (kg)</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          min="0.1"
                          step="0.1"
                          {...field}
                          onChange={e => field.onChange(parseFloat(e.target.value))}
                        />
                      </FormControl>
                      <FormDescription>
                        Enter the approximate weight in kilograms.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="location"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Location</FormLabel>
                      <div className="flex gap-2">
                        <FormControl>
                          <Input {...field} placeholder="Latitude, Longitude" />
                        </FormControl>
                        <Button
                          type="button"
                          variant="outline"
                          onClick={getUserLocation}
                          className="flex-shrink-0"
                        >
                          Get Location
                        </Button>
                      </div>
                      <FormDescription>
                        Use current location or enter coordinates manually.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="image"
                  render={({ field: { value, onChange, ...field } }) => (
                    <FormItem>
                      <FormLabel>Waste Image</FormLabel>
                      <FormControl>
                        <div className="space-y-4">
                          {/* Image upload area */}
                          {!imagePreview ? (
                            <div
                              className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-6 text-center cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                              onClick={() => document.getElementById('image-upload')?.click()}
                            >
                              <Upload className="h-8 w-8 mx-auto text-gray-400 dark:text-gray-500 mb-2" />
                              <p className="text-sm text-gray-500 dark:text-gray-400">
                                Click to upload or drag and drop
                              </p>
                              <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">
                                PNG, JPG or WEBP (max. 5MB)
                              </p>
                              <Input
                                id="image-upload"
                                type="file"
                                accept="image/*"
                                className="hidden"
                                onChange={handleImageChange}
                                {...field}
                              />
                            </div>
                          ) : (
                            <div className="relative">
                              <img
                                src={imagePreview}
                                alt="Waste preview"
                                className="w-full h-auto rounded-lg object-cover max-h-64"
                              />
                              <Button
                                type="button"
                                variant="destructive"
                                size="icon"
                                className="absolute top-2 right-2 h-8 w-8 rounded-full"
                                onClick={removeImage}
                              >
                                <X className="h-4 w-4" />
                              </Button>
                            </div>
                          )}
                        </div>
                      </FormControl>
                      <FormDescription>
                        Upload a clear image of the waste you are reporting.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <Button
                  type="submit"
                  className="w-full bg-waste-600 hover:bg-waste-700 text-white"
                  disabled={isUploading}
                >
                  {isUploading ? 'Uploading...' : 'Submit Waste Report'}
                </Button>
              </form>
            </Form>
          </div>
        ) : (
          <div className="max-w-md mx-auto">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden p-6 mb-6">
              <h2 className="text-2xl font-bold text-center mb-4 text-gray-900 dark:text-white">
                Report Submitted!
              </h2>
              <p className="text-gray-600 dark:text-gray-300 mb-6 text-center">
                Thank you for your contribution to a cleaner environment.
              </p>

              {/* Display the uploaded image */}
              {imagePreview && (
                <div className="mb-6">
                  <h3 className="font-medium text-gray-900 dark:text-white mb-2">Uploaded Image:</h3>
                  <div className="relative rounded-lg overflow-hidden">
                    <img
                      src={imagePreview}
                      alt="Waste image"
                      className="w-full h-auto object-cover max-h-64"
                    />
                  </div>
                  {ipfsHash && (
                    <div className="mt-2 text-center">
                      <a
                        href={getIPFSGatewayUrl(ipfsHash)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs text-waste-600 dark:text-waste-400 hover:underline"
                      >
                        View on IPFS: {ipfsHash.substring(0, 8)}...{ipfsHash.substring(ipfsHash.length - 8)}
                      </a>
                    </div>
                  )}
                </div>
              )}

              <div className="bg-waste-50 dark:bg-waste-900 p-4 rounded-lg mb-6">
                <h3 className="font-medium text-gray-900 dark:text-white">Estimated Reward:</h3>
                <div className="text-2xl font-bold text-waste-600 dark:text-waste-400 text-center">
                  {estimatedReward} WVT
                </div>
                <p className="text-sm text-gray-500 dark:text-gray-400 text-center mt-2">
                  (WasteVan Tokens)
                </p>
              </div>
            </div>

            <QRCodeGenerator value={qrCodeValue} />

            <div className="mt-6 text-center">
              <Button
                onClick={() => setIsSubmitted(false)}
                variant="outline"
                className="text-waste-600 border-waste-600 hover:bg-waste-50"
              >
                Submit Another Report
              </Button>
            </div>
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
};




// Removed duplicate setIpfsHash function definition

export default ReportWaste;

