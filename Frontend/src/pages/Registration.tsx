import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useContract } from '../context/ContractContext';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '../components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { Loader2, UserPlus, Users } from 'lucide-react';
import { toast } from 'sonner';
import Footer from '../components/Footer';

const Registration: React.FC = () => {
  const navigate = useNavigate();
  const { account, isUser, isAgent, registerUser, registerAgent } = useContract();
  
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [isRegistering, setIsRegistering] = useState(false);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState('user');
  
  // Redirect if already registered or not connected
  useEffect(() => {
    if (!account) {
      toast.error('Please connect your wallet first');
      navigate('/');
      return;
    }
    
    if (isUser || isAgent) {
      toast.success('You are already registered');
      navigate('/');
    }
  }, [account, isUser, isAgent, navigate]);
  
  const validateEmail = (email: string) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  };
  
  const handleUserRegistration = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!account) {
      toast.error('Please connect your wallet first');
      return;
    }
    
    if (!username || !email) {
      setError('Please fill in all fields');
      return;
    }
    
    if (!validateEmail(email)) {
      setError('Please enter a valid email address');
      return;
    }
    
    try {
      setIsRegistering(true);
      setError('');
      
      await registerUser(username, email);
      
      toast.success('Registration successful!');
      navigate('/');
    } catch (error) {
      console.error('Error registering user:', error);
      setError('Failed to register. Please try again.');
    } finally {
      setIsRegistering(false);
    }
  };
  
  const handleAgentRegistration = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!account) {
      toast.error('Please connect your wallet first');
      return;
    }
    
    try {
      setIsRegistering(true);
      setError('');
      
      await registerAgent();
      
      toast.success('Agent registration successful!');
      navigate('/agent-dashboard');
    } catch (error) {
      console.error('Error registering agent:', error);
      setError('Failed to register as agent. Please try again.');
    } finally {
      setIsRegistering(false);
    }
  };
  
  return (
    <div className="min-h-screen flex flex-col">
      <div className="flex-grow container mx-auto px-4 py-8">
        <div className="max-w-md mx-auto">
          <h1 className="text-3xl font-bold text-center mb-8 text-waste-700 dark:text-waste-300">
            Welcome to WasteVan
          </h1>
          
          <Tabs defaultValue="user" value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-2 mb-8">
              <TabsTrigger value="user" className="flex items-center gap-2">
                <UserPlus className="h-4 w-4" />
                Register as User
              </TabsTrigger>
              <TabsTrigger value="agent" className="flex items-center gap-2">
                <Users className="h-4 w-4" />
                Register as Agent
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="user">
              <Card>
                <CardHeader>
                  <CardTitle className="text-waste-700 dark:text-waste-300">User Registration</CardTitle>
                  <CardDescription>
                    Register to start reporting waste and earning tokens
                  </CardDescription>
                </CardHeader>
                <form onSubmit={handleUserRegistration}>
                  <CardContent>
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
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button 
                      type="submit" 
                      disabled={isRegistering}
                      className="w-full bg-waste-600 hover:bg-waste-700 text-white"
                    >
                      {isRegistering ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Registering...
                        </>
                      ) : (
                        <>
                          <UserPlus className="mr-2 h-4 w-4" />
                          Register as User
                        </>
                      )}
                    </Button>
                  </CardFooter>
                </form>
              </Card>
            </TabsContent>
            
            <TabsContent value="agent">
              <Card>
                <CardHeader>
                  <CardTitle className="text-waste-700 dark:text-waste-300">Agent Registration</CardTitle>
                  <CardDescription>
                    Register as an agent to collect waste and distribute tokens
                  </CardDescription>
                </CardHeader>
                <form onSubmit={handleAgentRegistration}>
                  <CardContent>
                    <div className="space-y-4">
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        As an agent, you'll be responsible for collecting waste and verifying user submissions.
                        You'll need to purchase points to distribute to users.
                      </p>
                      
                      {error && (
                        <div className="text-red-600 text-sm">{error}</div>
                      )}
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button 
                      type="submit" 
                      disabled={isRegistering}
                      className="w-full bg-waste-600 hover:bg-waste-700 text-white"
                    >
                      {isRegistering ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Registering...
                        </>
                      ) : (
                        <>
                          <Users className="mr-2 h-4 w-4" />
                          Register as Agent
                        </>
                      )}
                    </Button>
                  </CardFooter>
                </form>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Registration;
