// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "./WasteVanToken.sol";

contract WasteVan is Ownable, ReentrancyGuard {
    WasteVanToken public wasteVanToken;

    struct User {
        string username;
        string email;
        bool isRegistered;
        uint256 totalWasteReported;
        uint256 totalTokensEarned;
    }

    struct Agent {
        bool isVerified;
        uint256 points;
        uint256 totalCollections;
        uint256 totalPointsDistributed;
    }

    struct WasteReport {
        uint256 reportId;
        address reporter;
        string ipfsHash; // For storing waste images
        uint256 quantity;
        string wasteType;
        string location; // GPS coordinates or location description
        uint256 timestamp;
        bool isCollected;
        address collectedBy;
        uint256 tokenReward;
    }

    mapping(address => User) public users;
    mapping(address => Agent) public agents;
    mapping(uint256 => WasteReport) public wasteReports;
    mapping(string => bool) public usedQRCodes;

    uint256 public reportCounter;
    uint256 public constant POINTS_PER_COLLECTION = 100;
    uint256 public constant TOKENS_PER_POINT = 1;

    event UserRegistered(address indexed user, string username, string email);
    event AgentRegistered(address indexed agent);
    event WasteReported(uint256 indexed reportId, address indexed reporter, string ipfsHash);
    event WasteCollected(uint256 indexed reportId, address indexed agent);
    event TokensDistributed(address indexed user, uint256 amount);
    event PointsPurchased(address indexed agent, uint256 amount);

    constructor(address _tokenAddress) Ownable() {
        wasteVanToken = WasteVanToken(_tokenAddress);
    }

    function registerUser(string memory _username, string memory _email) external {
        require(!users[msg.sender].isRegistered, "User already registered");
        users[msg.sender] = User({
            username: _username,
            email: _email,
            isRegistered: true,
            totalWasteReported: 0,
            totalTokensEarned: 0
        });
        emit UserRegistered(msg.sender, _username, _email);
    }

    function registerAgent() external {
        require(!agents[msg.sender].isVerified, "Agent already registered");
        agents[msg.sender] = Agent({
            isVerified: true,
            points: 0,
            totalCollections: 0,
            totalPointsDistributed: 0
        });

        // Try to mint 1000 tokens to the agent as a starting bonus
        // This will only work if this contract is authorized as a minter
        try wasteVanToken.mint(msg.sender, 1000 * 10 ** 18) {
            emit TokensDistributed(msg.sender, 1000 * 10 ** 18);
        } catch {
            // If minting fails, just continue with registration
            // The agent can still function without the initial tokens
        }

        emit AgentRegistered(msg.sender);
    }

    function reportWaste(
        string memory _ipfsHash,
        uint256 _quantity,
        string memory _wasteType,
        string memory _location
    ) external {
        require(users[msg.sender].isRegistered, "User not registered");

        reportCounter++;
        wasteReports[reportCounter] = WasteReport({
            reportId: reportCounter,
            reporter: msg.sender,
            ipfsHash: _ipfsHash,
            quantity: _quantity,
            wasteType: _wasteType,
            location: _location,
            timestamp: block.timestamp,
            isCollected: false,
            collectedBy: address(0),
            tokenReward: _quantity * TOKENS_PER_POINT
        });

        users[msg.sender].totalWasteReported += _quantity;
        emit WasteReported(reportCounter, msg.sender, _ipfsHash);
    }

    function collectWaste(uint256 _reportId) external {
        require(agents[msg.sender].isVerified, "Not a verified agent");
        WasteReport storage report = wasteReports[_reportId];
        require(!report.isCollected, "Waste already collected");
        require(report.reporter != address(0), "Invalid report");

        report.isCollected = true;
        report.collectedBy = msg.sender;

        // Update agent stats
        agents[msg.sender].totalCollections++;
        agents[msg.sender].points += POINTS_PER_COLLECTION;

        // Try to distribute tokens to user
        // This will only work if this contract is authorized as a minter
        try wasteVanToken.mint(report.reporter, report.tokenReward) {
            users[report.reporter].totalTokensEarned += report.tokenReward;
        } catch {
            // If minting fails, just continue without distributing tokens
            // The owner can manually distribute tokens later
        }

        emit WasteCollected(_reportId, msg.sender);
        emit TokensDistributed(report.reporter, report.tokenReward);
    }

    function purchasePoints() external payable {
        require(agents[msg.sender].isVerified, "Not a verified agent");
        uint256 pointsToAdd = msg.value / 1 ether; // 1 ETH = 1 point
        agents[msg.sender].points += pointsToAdd;
        emit PointsPurchased(msg.sender, pointsToAdd);
    }

    function getUserStats(address _user) external view returns (
        string memory username,
        uint256 totalWasteReported,
        uint256 totalTokensEarned
    ) {
        User memory user = users[_user];
        return (user.username, user.totalWasteReported, user.totalTokensEarned);
    }

    function getAgentStats(address _agent) external view returns (
        bool isVerified,
        uint256 points,
        uint256 totalCollections,
        uint256 totalPointsDistributed
    ) {
        Agent memory agent = agents[_agent];
        return (agent.isVerified, agent.points, agent.totalCollections, agent.totalPointsDistributed);
    }

    function getWasteReport(uint256 _reportId) external view returns (
        address reporter,
        string memory ipfsHash,
        uint256 quantity,
        string memory wasteType,
        string memory location,
        bool isCollected,
        address collectedBy
    ) {
        WasteReport memory report = wasteReports[_reportId];
        return (
            report.reporter,
            report.ipfsHash,
            report.quantity,
            report.wasteType,
            report.location,
            report.isCollected,
            report.collectedBy
        );
    }

    // Function to manually distribute tokens to agents (only owner)
    function distributeAgentTokens(address _agent, uint256 _amount) external onlyOwner {
        require(agents[_agent].isVerified, "Not a verified agent");
        wasteVanToken.mint(_agent, _amount);
        emit TokensDistributed(_agent, _amount);
    }

    // Function to withdraw contract balance (only owner)
    function withdraw() external onlyOwner {
        payable(owner()).transfer(address(this).balance);
    }
}