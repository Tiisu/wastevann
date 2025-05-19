
import React from 'react';
import { Separator } from '@/components/ui/separator';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Download, BookOpen, Bookmark } from 'lucide-react';
import WhitepaperSection from '@/components/WhitepaperSection';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';

const Whitepaper: React.FC = () => {
  const [isOpen, setIsOpen] = React.useState(false);

  return (
    <div className="container mx-auto px-4 py-10 max-w-5xl">
      <div className="flex flex-col-reverse md:flex-row md:justify-between md:items-center mb-8">
        <div>
          <h1 className="text-3xl md:text-4xl font-bold text-waste-800 dark:text-waste-200 mb-2">
            WasteVan Whitepaper
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-300">
            A Blockchain Solution for Sustainable Waste Management
          </p>
          <div className="flex flex-wrap gap-2 mt-4">
            <Badge className="bg-waste-100 text-waste-800 dark:bg-waste-900 dark:text-waste-200">Version 1.0</Badge>
            <Badge className="bg-waste-100 text-waste-800 dark:bg-waste-900 dark:text-waste-200">May 2025</Badge>
          </div>
        </div>
        <div className="flex gap-2 mb-6 md:mb-0">
          <Button variant="outline" className="border-waste-500 text-waste-700 hover:bg-waste-50" size="sm">
            <BookOpen className="h-4 w-4 mr-2" />
            Save for Later
          </Button>
          <Button variant="default" className="bg-waste-600 hover:bg-waste-700" size="sm">
            <Download className="h-4 w-4 mr-2" />
            Download PDF
          </Button>
        </div>
      </div>

      <Separator className="my-6 bg-waste-200 dark:bg-waste-700" />

      <div className="flex flex-col md:flex-row gap-8">
        {/* Table of Contents - Visible on larger screens */}
        <div className="md:w-1/4 hidden md:block sticky top-24 self-start">
          <div className="bg-white dark:bg-gray-900 p-4 rounded-lg border border-waste-100 dark:border-waste-800">
            <h3 className="font-medium mb-3 text-waste-700 dark:text-waste-300">Table of Contents</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <a href="#abstract" className="text-waste-600 hover:text-waste-800 dark:text-waste-400 dark:hover:text-waste-200">
                  Abstract
                </a>
              </li>
              <li>
                <a href="#introduction" className="text-waste-600 hover:text-waste-800 dark:text-waste-400 dark:hover:text-waste-200">
                  Introduction
                </a>
              </li>
              <li>
                <a href="#problem" className="text-waste-600 hover:text-waste-800 dark:text-waste-400 dark:hover:text-waste-200">
                  Problem Statement
                </a>
              </li>
              <li>
                <a href="#solution" className="text-waste-600 hover:text-waste-800 dark:text-waste-400 dark:hover:text-waste-200">
                  Solution
                </a>
              </li>
              <li>
                <a href="#token" className="text-waste-600 hover:text-waste-800 dark:text-waste-400 dark:hover:text-waste-200">
                  Token Economy
                </a>
              </li>
              <li>
                <a href="#architecture" className="text-waste-600 hover:text-waste-800 dark:text-waste-400 dark:hover:text-waste-200">
                  Technical Architecture
                </a>
              </li>
              <li>
                <a href="#roadmap" className="text-waste-600 hover:text-waste-800 dark:text-waste-400 dark:hover:text-waste-200">
                  Roadmap
                </a>
              </li>
              <li>
                <a href="#conclusion" className="text-waste-600 hover:text-waste-800 dark:text-waste-400 dark:hover:text-waste-200">
                  Conclusion
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Mobile Table of Contents */}
        <div className="mb-6 md:hidden">
          <Collapsible open={isOpen} onOpenChange={setIsOpen} className="w-full">
            <CollapsibleTrigger asChild>
              <Button 
                variant="outline" 
                className="flex w-full justify-between border-waste-300 dark:border-waste-700"
              >
                <span>Table of Contents</span>
                <span className={`transform transition-transform ${isOpen ? 'rotate-180' : ''}`}>
                  ↓
                </span>
              </Button>
            </CollapsibleTrigger>
            <CollapsibleContent className="bg-white dark:bg-gray-900 p-4 rounded-b-lg border-x border-b border-waste-300 dark:border-waste-700 mt-[-1px]">
              <ul className="space-y-2 text-sm">
                <li>
                  <a href="#abstract" onClick={() => setIsOpen(false)} className="text-waste-600 hover:text-waste-800 dark:text-waste-400 dark:hover:text-waste-200 block py-1">
                    Abstract
                  </a>
                </li>
                <li>
                  <a href="#introduction" onClick={() => setIsOpen(false)} className="text-waste-600 hover:text-waste-800 dark:text-waste-400 dark:hover:text-waste-200 block py-1">
                    Introduction
                  </a>
                </li>
                <li>
                  <a href="#problem" onClick={() => setIsOpen(false)} className="text-waste-600 hover:text-waste-800 dark:text-waste-400 dark:hover:text-waste-200 block py-1">
                    Problem Statement
                  </a>
                </li>
                <li>
                  <a href="#solution" onClick={() => setIsOpen(false)} className="text-waste-600 hover:text-waste-800 dark:text-waste-400 dark:hover:text-waste-200 block py-1">
                    Solution
                  </a>
                </li>
                <li>
                  <a href="#token" onClick={() => setIsOpen(false)} className="text-waste-600 hover:text-waste-800 dark:text-waste-400 dark:hover:text-waste-200 block py-1">
                    Token Economy
                  </a>
                </li>
                <li>
                  <a href="#architecture" onClick={() => setIsOpen(false)} className="text-waste-600 hover:text-waste-800 dark:text-waste-400 dark:hover:text-waste-200 block py-1">
                    Technical Architecture
                  </a>
                </li>
                <li>
                  <a href="#roadmap" onClick={() => setIsOpen(false)} className="text-waste-600 hover:text-waste-800 dark:text-waste-400 dark:hover:text-waste-200 block py-1">
                    Roadmap
                  </a>
                </li>
                <li>
                  <a href="#conclusion" onClick={() => setIsOpen(false)} className="text-waste-600 hover:text-waste-800 dark:text-waste-400 dark:hover:text-waste-200 block py-1">
                    Conclusion
                  </a>
                </li>
              </ul>
            </CollapsibleContent>
          </Collapsible>
        </div>

        {/* Main content */}
        <div className="md:w-3/4">
          <WhitepaperSection title="Abstract" id="abstract">
            <p className="mb-4">
              WasteVan introduces a revolutionary blockchain-based platform designed to address the global plastic waste crisis. By leveraging distributed ledger technology and tokenized incentives, we create a transparent, efficient ecosystem that connects waste generators, collectors, and recyclers in a sustainable value chain.
            </p>
            <p>
              This whitepaper outlines our vision, technological framework, token economy, and implementation roadmap for transforming waste management into a circular economy model powered by blockchain technology.
            </p>
          </WhitepaperSection>

          <WhitepaperSection title="Introduction" id="introduction">
            <p className="mb-4">
              The proliferation of plastic waste represents one of the most pressing environmental challenges of our time. Every year, over 380 million tons of plastic are produced worldwide, with less than 10% being effectively recycled. The remaining waste pollutes our oceans, damages ecosystems, and contributes to long-term environmental degradation.
            </p>
            <p className="mb-4">
              Traditional waste management systems face numerous challenges, including:
            </p>
            <ul className="list-disc pl-5 mb-4 space-y-2">
              <li>Lack of transparency in collection and processing</li>
              <li>Insufficient incentives for proper waste disposal</li>
              <li>Fragmented stakeholder coordination</li>
              <li>Limited traceability in recycling supply chains</li>
              <li>Inadequate data on environmental impact</li>
            </ul>
            <p>
              WasteVan aims to tackle these challenges by creating a decentralized platform that incentivizes sustainable waste management practices while providing complete transparency throughout the waste lifecycle.
            </p>
          </WhitepaperSection>

          <WhitepaperSection title="Problem Statement" id="problem">
            <div className="space-y-4">
              <p>
                The current waste management ecosystem suffers from significant inefficiencies and lack of accountability. Key problems include:
              </p>
              
              <h3 className="font-semibold text-lg text-waste-700 dark:text-waste-300">Misaligned Incentives</h3>
              <p>
                There's little financial motivation for individuals and communities to properly sort and dispose of recyclable waste, leading to contamination of recyclable streams and reduced recycling rates.
              </p>
              
              <h3 className="font-semibold text-lg text-waste-700 dark:text-waste-300">Lack of Transparency</h3>
              <p>
                The journey of waste from collection to processing remains opaque, making it difficult to verify proper handling and preventing stakeholders from making informed decisions.
              </p>
              
              <h3 className="font-semibold text-lg text-waste-700 dark:text-waste-300">Inefficient Collection</h3>
              <p>
                Current collection routes are often suboptimal, leading to increased carbon footprints and operational costs. There's limited coordination between waste generators and collectors.
              </p>
              
              <h3 className="font-semibold text-lg text-waste-700 dark:text-waste-300">Data Fragmentation</h3>
              <p>
                Waste management data remains siloed across different stakeholders, preventing a holistic understanding of waste flows and recycling effectiveness.
              </p>
            </div>
          </WhitepaperSection>

          <WhitepaperSection title="Solution: The WasteVan Platform" id="solution">
            <p className="mb-4">
              WasteVan provides a comprehensive blockchain-based solution that transforms how plastic waste is reported, collected, processed, and incentivized.
            </p>

            <h3 className="font-semibold text-lg text-waste-700 dark:text-waste-300 mb-2">Core Components:</h3>
            
            <div className="space-y-4 mb-4">
              <div className="bg-waste-50 dark:bg-waste-900/30 p-4 rounded-lg">
                <h4 className="font-medium text-waste-700 dark:text-waste-300">Waste Reporting System</h4>
                <p className="text-sm">
                  Enables users to easily document plastic waste through our mobile application, including type, quantity, and location data. Each submission generates a unique QR code for verification.
                </p>
              </div>

              <div className="bg-waste-50 dark:bg-waste-900/30 p-4 rounded-lg">
                <h4 className="font-medium text-waste-700 dark:text-waste-300">Agent Network</h4>
                <p className="text-sm">
                  Verified waste collectors (agents) receive notifications about nearby waste reports and can claim collection assignments. The platform optimizes routing and ensures efficient pickup.
                </p>
              </div>

              <div className="bg-waste-50 dark:bg-waste-900/30 p-4 rounded-lg">
                <h4 className="font-medium text-waste-700 dark:text-waste-300">Verification Protocol</h4>
                <p className="text-sm">
                  Multi-step verification ensures waste is properly collected, sorted, and processed. QR code scanning, photo evidence, and weight verification create an immutable record on the blockchain.
                </p>
              </div>

              <div className="bg-waste-50 dark:bg-waste-900/30 p-4 rounded-lg">
                <h4 className="font-medium text-waste-700 dark:text-waste-300">Tokenized Incentives</h4>
                <p className="text-sm">
                  WVAN tokens are automatically distributed to waste reporters and collectors upon successful verification, creating a direct financial incentive for sustainable waste management.
                </p>
              </div>
            </div>

            <p>
              By connecting these components through smart contracts, WasteVan creates a transparent, efficient ecosystem that rewards sustainable behavior while capturing valuable data on waste flows.
            </p>
          </WhitepaperSection>

          <WhitepaperSection title="Token Economy" id="token">
            <p className="mb-4">
              The WVAN token serves as the backbone of our ecosystem, facilitating value exchange and incentivizing participation across the platform.
            </p>

            <h3 className="font-semibold text-lg text-waste-700 dark:text-waste-300 mb-2">Token Utility:</h3>
            
            <ul className="list-disc pl-5 mb-4 space-y-2">
              <li>
                <span className="font-medium">Reward Distribution:</span> WVAN tokens are awarded to users who report waste and agents who collect and process it.
              </li>
              <li>
                <span className="font-medium">Governance:</span> Token holders can participate in platform governance, voting on proposals and protocol upgrades.
              </li>
              <li>
                <span className="font-medium">Access to Services:</span> Tokens can be used to access premium features within the platform.
              </li>
              <li>
                <span className="font-medium">Staking:</span> Agents must stake WVAN tokens as collateral to ensure quality service.
              </li>
            </ul>

            <h3 className="font-semibold text-lg text-waste-700 dark:text-waste-300 mb-2">Token Distribution:</h3>
            
            <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-waste-200 dark:border-waste-700 mb-4">
              <ul className="space-y-2">
                <li className="flex justify-between">
                  <span>Ecosystem Rewards</span>
                  <span className="font-medium">40%</span>
                </li>
                <li className="flex justify-between">
                  <span>Foundation Reserve</span>
                  <span className="font-medium">20%</span>
                </li>
                <li className="flex justify-between">
                  <span>Team and Advisors</span>
                  <span className="font-medium">15%</span>
                </li>
                <li className="flex justify-between">
                  <span>Private Sale</span>
                  <span className="font-medium">10%</span>
                </li>
                <li className="flex justify-between">
                  <span>Public Sale</span>
                  <span className="font-medium">10%</span>
                </li>
                <li className="flex justify-between">
                  <span>Community and Marketing</span>
                  <span className="font-medium">5%</span>
                </li>
              </ul>
            </div>

            <h3 className="font-semibold text-lg text-waste-700 dark:text-waste-300 mb-2">Reward Mechanism:</h3>
            
            <p>
              Tokens are distributed based on waste type, weight, and quality. Smart contracts automatically calculate rewards using a dynamic formula that accounts for market conditions and recycling value of different plastic types.
            </p>
          </WhitepaperSection>

          <WhitepaperSection title="Technical Architecture" id="architecture">
            <p className="mb-6">
              WasteVan's technical infrastructure combines blockchain technology, mobile applications, and IoT devices to create a seamless waste management ecosystem.
            </p>

            <h3 className="font-semibold text-lg text-waste-700 dark:text-waste-300 mb-3">Blockchain Layer</h3>
            
            <p className="mb-4">
              Our solution is built on the Ethereum blockchain, utilizing ERC-20 tokens and smart contracts to facilitate transparent transactions and immutable record-keeping.
            </p>

            <div className="bg-white dark:bg-gray-800 border border-waste-200 dark:border-waste-700 rounded-lg p-4 mb-6">
              <h4 className="font-medium mb-2 text-waste-700 dark:text-waste-300">Key Smart Contracts:</h4>
              <ul className="space-y-2 text-sm">
                <li>
                  <span className="font-medium">WasteRegistry.sol:</span> Manages waste reports and their validation status
                </li>
                <li>
                  <span className="font-medium">AgentVerification.sol:</span> Handles agent registration, reputation, and stake management
                </li>
                <li>
                  <span className="font-medium">RewardDistribution.sol:</span> Calculates and distributes token rewards based on waste type and amount
                </li>
                <li>
                  <span className="font-medium">Governance.sol:</span> Facilitates community voting on platform parameters and upgrades
                </li>
              </ul>
            </div>

            <h3 className="font-semibold text-lg text-waste-700 dark:text-waste-300 mb-3">Application Layer</h3>
            
            <p className="mb-4">
              Our platform includes mobile and web applications for different user types, all connected to the blockchain infrastructure:
            </p>

            <ul className="list-disc pl-5 mb-6 space-y-2">
              <li><span className="font-medium">User App:</span> For waste reporting, token management, and impact tracking</li>
              <li><span className="font-medium">Agent App:</span> For waste collection management, verification, and rewards</li>
              <li><span className="font-medium">Admin Dashboard:</span> For oversight, data analytics, and platform management</li>
            </ul>

            <h3 className="font-semibold text-lg text-waste-700 dark:text-waste-300 mb-3">Data Layer</h3>
            
            <p>
              We employ IPFS (InterPlanetary File System) for decentralized storage of images and large data files, with cryptographic hashes stored on the blockchain to ensure data integrity. This approach balances on-chain verification with cost-efficient data management.
            </p>
          </WhitepaperSection>

          <WhitepaperSection title="Roadmap" id="roadmap" className="relative overflow-hidden">
            <div className="absolute left-0 top-0 h-full w-1 bg-waste-100 dark:bg-waste-800 rounded-full ml-4 md:ml-6"></div>
            
            <div className="relative pl-12 md:pl-16 pb-8">
              <div className="absolute left-0 top-0 w-8 h-8 rounded-full bg-waste-500 dark:bg-waste-400 flex items-center justify-center text-white z-10 ml-0.5 md:ml-2.5">
                <span className="text-sm font-bold">1</span>
              </div>
              <h3 className="font-semibold text-lg text-waste-700 dark:text-waste-300">Q2 2025: Platform Development</h3>
              <ul className="mt-2 space-y-1 text-sm">
                <li>• Smart contract development and auditing</li>
                <li>• Mobile app beta testing</li>
                <li>• Agent onboarding system development</li>
              </ul>
            </div>
            
            <div className="relative pl-12 md:pl-16 pb-8">
              <div className="absolute left-0 top-0 w-8 h-8 rounded-full bg-waste-500 dark:bg-waste-400 flex items-center justify-center text-white z-10 ml-0.5 md:ml-2.5">
                <span className="text-sm font-bold">2</span>
              </div>
              <h3 className="font-semibold text-lg text-waste-700 dark:text-waste-300">Q3 2025: Pilot Launch</h3>
              <ul className="mt-2 space-y-1 text-sm">
                <li>• Launch in 3 pilot cities</li>
                <li>• Initial agent network establishment</li>
                <li>• Token generation event</li>
              </ul>
            </div>
            
            <div className="relative pl-12 md:pl-16 pb-8">
              <div className="absolute left-0 top-0 w-8 h-8 rounded-full bg-waste-400/50 dark:bg-waste-600/50 flex items-center justify-center text-white z-10 ml-0.5 md:ml-2.5">
                <span className="text-sm font-bold">3</span>
              </div>
              <h3 className="font-semibold text-lg text-waste-700 dark:text-waste-300">Q1 2026: Expansion</h3>
              <ul className="mt-2 space-y-1 text-sm">
                <li>• Expansion to 10 additional cities</li>
                <li>• Partnership with major recycling facilities</li>
                <li>• Launch of governance features</li>
              </ul>
            </div>
            
            <div className="relative pl-12 md:pl-16">
              <div className="absolute left-0 top-0 w-8 h-8 rounded-full bg-waste-300/50 dark:bg-waste-700/50 flex items-center justify-center text-white z-10 ml-0.5 md:ml-2.5">
                <span className="text-sm font-bold">4</span>
              </div>
              <h3 className="font-semibold text-lg text-waste-700 dark:text-waste-300">Q4 2026: Global Scale</h3>
              <ul className="mt-2 space-y-1 text-sm">
                <li>• International expansion</li>
                <li>• Integration with existing waste management systems</li>
                <li>• Advanced analytics and impact measurement tools</li>
              </ul>
            </div>
          </WhitepaperSection>

          <WhitepaperSection title="Conclusion" id="conclusion">
            <p className="mb-4">
              WasteVan represents a paradigm shift in waste management, using blockchain technology to create transparency, accountability, and incentives across the entire value chain. By connecting waste generators with collectors through a tokenized platform, we create economic opportunities while addressing a critical environmental challenge.
            </p>
            
            <p className="mb-4">
              Our vision extends beyond simple waste collection—we aim to build a global ecosystem that transforms plastic waste from an environmental liability into a valuable resource within a circular economy. Through the power of distributed ledger technology, smart contracts, and community engagement, WasteVan will help create a more sustainable future.
            </p>
            
            <div className="bg-waste-50 dark:bg-waste-900/30 p-4 rounded-lg border border-waste-100 dark:border-waste-800 mt-6">
              <p className="text-center font-medium text-waste-700 dark:text-waste-300">
                Join us in revolutionizing waste management and creating a cleaner world for future generations.
              </p>
            </div>
          </WhitepaperSection>

          <div className="mt-10 flex justify-center">
            <Button variant="outline" className="mr-2 border-waste-500 text-waste-700 hover:bg-waste-50">
              <Bookmark className="h-4 w-4 mr-2" />
              Share Whitepaper
            </Button>
            <Button className="bg-waste-600 hover:bg-waste-700">
              <Download className="h-4 w-4 mr-2" />
              Download PDF
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Whitepaper;
