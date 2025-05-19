import React, { useState } from 'react';
import { useContract } from '../context/ContractContext';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '../components/ui/card';
import { Loader2, UserPlus } from 'lucide-react';
import { toast } from 'sonner';

const UserRegistration: React.FC = () => {
  const { account, registerUser, isUser } = useContract();
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!account) {
      toast.error('Please connect your wallet first');
      return;
    }

    if (!username || !email) {
      setError('Please fill in all fields');
      return;
    }

    // Simple email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError('Please enter a valid email address');
      return;
    }

    try {
      setIsLoading(true);
      setError('');

      await registerUser(username, email);

      toast.success('Registration successful!');

      // Reset form
      setUsername('');
      setEmail('');
    } catch (error) {
      console.error('Error registering user:', error);
      setError('Failed to register. Please try again.');
      toast.error('Registration failed');
    } finally {
      setIsLoading(false);
    }
  };

  // If user is already registered, don't show the form
  if (isUser) {
    return null;
  }

  return (
    <div className="max-w-md mx-auto my-8 px-4">
      <Card>
        <CardHeader>
          <CardTitle className="text-waste-700 dark:text-waste-300">Register Your Account</CardTitle>
          <CardDescription>
            Register to start reporting waste and earning tokens
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit}>
            <div className="grid gap-4">
              <div className="space-y-2">
                <Label htmlFor="username">Username</Label>
                <Input
                  id="username"
                  placeholder="Enter your username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>

              {error && (
                <div className="text-red-600 text-sm">{error}</div>
              )}

              <Button
                type="submit"
                disabled={isLoading || !account}
                className="w-full bg-waste-600 hover:bg-waste-700 text-white"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Registering...
                  </>
                ) : (
                  <>
                    <UserPlus className="mr-2 h-4 w-4" />
                    Register
                  </>
                )}
              </Button>
            </div>
          </form>
        </CardContent>
        <CardFooter className="flex justify-center text-sm text-gray-500">
          Your wallet address will be linked to this account
        </CardFooter>
      </Card>
    </div>
  );
};

export default UserRegistration;
