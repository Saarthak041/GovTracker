'use strict';

const { Gateway, Wallets } = require('fabric-network');
const path = require('path');
const fs = require('fs');

// Helper function to get contract
async function getContract(orgName, username) {
    const ccpPath = path.resolve(__dirname, '..', '..', 'config', `connection-${orgName.toLowerCase()}.json`);
    const ccp = JSON.parse(fs.readFileSync(ccpPath, 'utf8'));

    // Resolve all relative TLS cert paths to absolute.
    // Connection profiles use paths like "../network/...".
    // Those should resolve to: Main/blockchain-contracting-system/network/...
    // So we resolve relative to the blockchain-contracting-system folder.
    const bcsRootDir = path.resolve(__dirname, '..', '..', '..');

    const resolvePaths = (obj) => {
        for (const key of Object.keys(obj)) {
            if (key === 'path' && typeof obj[key] === 'string' && !path.isAbsolute(obj[key])) {
                // Connection profiles were authored with paths like "../network/...".
                // When resolving from the blockchain-contracting-system folder, that would
                // incorrectly step out into "Main/network". Normalize to "network/...".
                const normalized = obj[key].startsWith('../../network/')
                    ? obj[key].replace(/^\.\.\/\.\.\/network\//, 'network/')
                    : obj[key].startsWith('../network/')
                        ? obj[key].replace(/^\.\.\/network\//, 'network/')
                        : obj[key];
                obj[key] = path.resolve(bcsRootDir, normalized);
            } else if (typeof obj[key] === 'object' && obj[key] !== null) {
                resolvePaths(obj[key]);
            }
        }
    };
    resolvePaths(ccp);

    const walletPath = path.join(__dirname, '..', '..', 'wallet');
    const wallet = await Wallets.newFileSystemWallet(walletPath);

    const gateway = new Gateway();
    await gateway.connect(ccp, {
        wallet,
        identity: username,
        discovery: { enabled: true, asLocalhost: true }
    });

    const network = await gateway.getNetwork('channel1');
    const contract = network.getContract('project-management');

    // Get all endorsing peers from the channel
    const channel = network.getChannel();
    const endorsers = channel.getEndorsers();

    return { contract, gateway, network, endorsers };
}

// Helper: submit transaction to ALL endorsing peers (required by majority policy)
async function submitToAll(contract, endorsers, fcn, ...args) {
    const tx = contract.createTransaction(fcn);
    tx.setEndorsingPeers(endorsers);
    return tx.submit(...args);
}

// Helper to extract identity from request headers
function getIdentityFromReq(req, defaultRole = 'Employer') {
    const role = req.headers['x-user-role'] || defaultRole;
    const userId = req.headers['x-user-id'] || `admin-${role.toLowerCase()}`;
    return { role, userId };
}

// Create new project
exports.createProject = async (req, res) => {
    try {
        const { projectId, name, description, totalValue } = req.body;
        const { role, userId } = getIdentityFromReq(req, 'Employer');
        const { contract, gateway, endorsers } = await getContract(role, userId);

        await submitToAll(contract, endorsers,
            'createProject',
            projectId,
            name,
            description,
            totalValue.toString()
        );

        gateway.disconnect();
        res.status(201).json({
            success: true,
            message: 'Project created successfully',
            projectId
        });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};

// Get all projects
exports.getAllProjects = async (req, res) => {
    try {
        const { role, userId } = getIdentityFromReq(req, 'Employer');
        const { contract, gateway } = await getContract(role, userId);

        const result = await contract.evaluateTransaction('queryAllProjects', '', '', '100');
        const projects = JSON.parse(result.toString());

        gateway.disconnect();
        res.json({ success: true, data: projects });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};

// Get single project
exports.getProject = async (req, res) => {
    try {
        const { role, userId } = getIdentityFromReq(req, 'Employer');
        const { contract, gateway } = await getContract(role, userId);

        const result = await contract.evaluateTransaction('queryProject', req.params.id);
        const project = JSON.parse(result.toString());

        gateway.disconnect();
        res.json({ success: true, data: project });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};

// Submit work package
exports.submitWorkPackage = async (req, res) => {
    try {
        const { workPackageId, description, ipfsHash, quantity, value } = req.body;
        const { role, userId } = getIdentityFromReq(req, 'Contractor');
        const { contract, gateway, endorsers } = await getContract(role, userId);

        await submitToAll(contract, endorsers,
            'submitWorkPackage',
            req.params.id,
            workPackageId,
            description,
            ipfsHash,
            quantity.toString(),
            value.toString()
        );

        gateway.disconnect();
        res.status(201).json({
            success: true,
            message: 'Work package submitted successfully'
        });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};

// Get work packages
exports.getWorkPackages = async (req, res) => {
    try {
        const { role, userId } = getIdentityFromReq(req, 'Employer');
        const { contract, gateway } = await getContract(role, userId);

        const result = await contract.evaluateTransaction('queryWorkPackages', req.params.id);
        const workPackages = JSON.parse(result.toString());

        gateway.disconnect();
        res.json({ success: true, data: workPackages });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};

// Approve payment
exports.approvePayment = async (req, res) => {
    try {
        const { workPackageId, approvedAmount, amount, paymentId, remarks } = req.body;
        const { role, userId } = getIdentityFromReq(req, 'Employer');
        const { contract, gateway, endorsers } = await getContract(role, userId);

        const finalAmount = (approvedAmount ?? amount);
        if (finalAmount === undefined || finalAmount === null) {
            return res.status(400).json({
                success: false,
                error: 'Missing required field: approvedAmount (or amount)'
            });
        }

        await submitToAll(
            contract,
            endorsers,
            'approvePayment',
            req.params.id,
            workPackageId,
            finalAmount.toString(),
            // Optional: if chaincode supports a paymentId argument, it should be added there;
            // for now keep remarks compatible.
            remarks || paymentId || ''
        );

        gateway.disconnect();
        res.status(201).json({
            success: true,
            message: 'Payment approved successfully'
        });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};

// Get payments
exports.getPayments = async (req, res) => {
    try {
        const { role, userId } = getIdentityFromReq(req, 'Employer');
        const { contract, gateway } = await getContract(role, userId);

        const result = await contract.evaluateTransaction('queryPayments', req.params.id);
        const payments = JSON.parse(result.toString());

        gateway.disconnect();
        res.json({ success: true, data: payments });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};

// Certify work (Engineer/Auditor)
exports.certifyWork = async (req, res) => {
    try {
        const { workPackageId, certificationNotes, certificationLevel } = req.body;
        const { role, userId } = getIdentityFromReq(req, 'Engineer'); // Make sure it uses Engineer
        const { contract, gateway, endorsers } = await getContract(role, userId);

        await submitToAll(contract, endorsers,
            'certifyWork',
            req.params.id,
            workPackageId,
            certificationLevel || 'APPROVED', // pass certification level to contract
            certificationNotes || 'Certified by auditor'
        );

        gateway.disconnect();
        res.status(200).json({
            success: true,
            message: 'Work certified successfully'
        });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};

// Get project history (audit trail)
exports.getProjectHistory = async (req, res) => {
    try {
        const { role, userId } = getIdentityFromReq(req, 'Employer');
        const { contract, gateway } = await getContract(role, userId);

        const result = await contract.evaluateTransaction('getProjectHistory', req.params.id);
        const history = JSON.parse(result.toString());

        gateway.disconnect();
        res.json({ success: true, data: history });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};
