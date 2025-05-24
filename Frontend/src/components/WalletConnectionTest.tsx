import React, { useState } from 'react';
import { useContract } from '../context/ContractContext';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';

const WalletConnectionTest: React.FC = () => {
  const { account, connectWallet, needsRegistration, isUser, isAgent } = useContract();
  const [testResults, setTestResults] = useState<any>(null);

  const runTest = async () => {
    console.log('=== WALLET CONNECTION TEST ===');
    console.log('Current state:', { account, needsRegistration, isUser, isAgent });
    
    try {
      await connectWallet();
      
      // Wait a bit for state to update
      setTimeout(() => {
        const results = {
          account,
          needsRegistration,
          isUser,
          isAgent,
          timestamp: new Date().toISOString()
        };
        console.log('Test results:', results);
        setTestResults(results);
      }, 2000);
    } catch (error) {
      console.error('Test failed:', error);
      setTestResults({ error: error.message });
    }
  };

  return (
    <Card className="max-w-md mx-auto mt-8">
      <CardHeader>
        <CardTitle>Wallet Connection Test</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <strong>Current Account:</strong> {account || 'Not connected'}
        </div>
        <div>
          <strong>Needs Registration:</strong> {needsRegistration ? 'Yes' : 'No'}
        </div>
        <div>
          <strong>Is User:</strong> {isUser ? 'Yes' : 'No'}
        </div>
        <div>
          <strong>Is Agent:</strong> {isAgent ? 'Yes' : 'No'}
        </div>
        
        <Button onClick={runTest} className="w-full">
          Test Wallet Connection
        </Button>
        
        {testResults && (
          <div className="mt-4 p-4 bg-gray-100 rounded">
            <strong>Test Results:</strong>
            <pre className="text-xs mt-2 overflow-auto">
              {JSON.stringify(testResults, null, 2)}
            </pre>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default WalletConnectionTest;
