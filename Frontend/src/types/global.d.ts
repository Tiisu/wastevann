interface Window {
  ethereum?: {
    isMetaMask?: boolean;
    request: (request: { method: string; params?: any[] }) => Promise<any>;
    on: (event: string, callback: (...args: any[]) => void) => void;
    removeListener: (event: string, callback: (...args: any[]) => void) => void;
    selectedAddress?: string;
  };
}

interface ImportMeta {
  env: {
    VITE_WASTE_VAN_TOKEN_ADDRESS?: string;
    VITE_WASTE_VAN_ADDRESS?: string;
    VITE_PINATA_API_KEY?: string;
    VITE_PINATA_API_SECRET?: string;
    VITE_PINATA_JWT?: string;
    [key: string]: string | undefined;
  };
}
