'use strict';

const { Gateway, Wallets } = require('fabric-network');
const fs = require('fs');
const path = require('path');

async function testConnection() {
    try {
        // Load connection profile
        const ccpPath = path.resolve(__dirname, '..', 'config', 'connection-employer.json');
        const ccp = JSON.parse(fs.readFileSync(ccpPath, 'utf8'));

        // Load wallet
        const walletPath = path.join(__dirname, '..', 'wallet');
        const wallet = await Wallets.newFileSystemWallet(walletPath);

        // Check identity exists
        const identity = await wallet.get('admin-employer');
        if (!identity) {
            console.log('❌ Admin identity not found. Run enrollAdmin.js first.');
            return;
        }

        // Create gateway
        const gateway = new Gateway();
        await gateway.connect(ccp, {
            wallet,
            identity: 'admin-employer',
            discovery: { enabled: true, asLocalhost: true }
        });

        console.log('✅ Connected to gateway successfully!');

        // Get network
        const network = await gateway.getNetwork('directchannel');
        console.log('✅ Connected to channel: directchannel');

        // Get contract
        const contract = network.getContract('project-management');
        console.log('✅ Got contract: project-management');

        // Query all projects
        console.log('\n📊 Querying all projects...');
        const result = await contract.evaluateTransaction('queryAllProjects', '', '', '10');
        const projects = JSON.parse(result.toString());
        console.log(`Found ${projects.projects.length} project(s)`);
        console.log(JSON.stringify(projects, null, 2));

        // Disconnect
        gateway.disconnect();
        console.log('\n✅ Test completed successfully!');

    } catch (error) {
        console.error(`❌ Test failed: ${error}`);
        console.error(error.stack);
    }
}

testConnection();
