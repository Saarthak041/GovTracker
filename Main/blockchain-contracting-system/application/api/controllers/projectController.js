'use strict';

const { Gateway, Wallets } = require('fabric-network');
const path = require('path');
const fs = require('fs');

// Helper function to get contract
async function getContract(orgName, username) {
    const ccpPath = path.resolve(__dirname, '..', '..', 'config', `connection-${orgName.toLowerCase()}.json`);
    const ccp = JSON.parse(fs.readFileSync(ccpPath, 'utf8'));

    const walletPath = path.join(__dirname, '..', '..', 'wallet');
    const wallet = await Wallets.newFileSystemWallet(walletPath);

    const gateway = new Gateway();
    await gateway.connect(ccp, {
        wallet,
        identity: username,
        discovery: { enabled: false }
    });

    const network = await gateway.getNetwork('directchannel');
    const contract = network.getContract('project-management');

    return { contract, gateway };
}

// Create new project
exports.createProject = async (req, res) => {
    try {
        const { projectId, name, description, totalValue } = req.body;
        const { contract, gateway } = await getContract('Employer', 'admin-employer');

        await contract.submitTransaction(
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
        const { contract, gateway } = await getContract('Employer', 'admin-employer');

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
        const { contract, gateway } = await getContract('Employer', 'admin-employer');

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
        const { contract, gateway } = await getContract('Contractor', 'admin-contractor');

        await contract.submitTransaction(
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
        const { contract, gateway } = await getContract('Contractor', 'admin-contractor');

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
        const { workPackageId, approvedAmount, remarks } = req.body;
        const { contract, gateway } = await getContract('Employer', 'admin-employer');

        await contract.submitTransaction(
            'approvePayment',
            req.params.id,
            workPackageId,
            approvedAmount.toString(),
            remarks || ''
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
        const { contract, gateway } = await getContract('Employer', 'admin-employer');

        const result = await contract.evaluateTransaction('queryPayments', req.params.id);
        const payments = JSON.parse(result.toString());

        gateway.disconnect();
        res.json({ success: true, data: payments });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};
