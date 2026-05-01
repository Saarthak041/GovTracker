'use strict';

const { Wallets } = require('fabric-network');
const FabricCAServices = require('fabric-ca-client');
const fs = require('fs');
const path = require('path');

async function registerUser(orgName, mspId, username, role = 'client') {
    try {
        // Load connection profile
        const ccpPath = path.resolve(__dirname, '..', 'config', `connection-${orgName.toLowerCase()}.json`);
        const ccp = JSON.parse(fs.readFileSync(ccpPath, 'utf8'));

        // Create CA client
        const caInfo = ccp.certificateAuthorities[`ca.${orgName.toLowerCase()}.example.com`];
        const caTLSCACerts = fs.readFileSync(path.resolve(__dirname, '..', caInfo.tlsCACerts.path), 'utf8');
        const ca = new FabricCAServices(
            caInfo.url,
            { trustedRoots: caTLSCACerts, verify: false },
            caInfo.caName
        );

        // Load wallet
        const walletPath = path.join(__dirname, '..', 'wallet');
        const wallet = await Wallets.newFileSystemWallet(walletPath);

        // Check if user already exists
        const userIdentity = await wallet.get(username);
        if (userIdentity) {
            console.log(`✅ User ${username} already exists in wallet`);
            return;
        }

        // Get admin identity from wallet
        const adminIdentity = await wallet.get(`admin-${orgName.toLowerCase()}`);
        if (!adminIdentity) {
            console.log(`❌ Admin identity for ${orgName} does not exist. Run enrollAdmin.js first.`);
            return;
        }

        // Build a user object for authenticating with the CA
        const provider = wallet.getProviderRegistry().getProvider(adminIdentity.type);
        const adminUser = await provider.getUserContext(adminIdentity, `admin-${orgName.toLowerCase()}`);

        // Register the user
        console.log(`📝 Registering user ${username} for ${orgName}...`);
        const secret = await ca.register(
            {
                affiliation: `${orgName.toLowerCase()}.department1`,
                enrollmentID: username,
                role: role,
                attrs: [
                    { name: 'role', value: role, ecert: true },
                    { name: 'org', value: orgName, ecert: true }
                ]
            },
            adminUser
        );

        // Enroll the user
        const enrollment = await ca.enroll({
            enrollmentID: username,
            enrollmentSecret: secret
        });

        // Create X.509 identity
        const x509Identity = {
            credentials: {
                certificate: enrollment.certificate,
                privateKey: enrollment.key.toBytes(),
            },
            mspId: mspId,
            type: 'X.509',
        };

        // Store in wallet
        await wallet.put(username, x509Identity);
        console.log(`✅ Successfully registered and enrolled user ${username} and imported into wallet`);

    } catch (error) {
        console.error(`❌ Failed to register user ${username}: ${error}`);
    }
}

async function main() {
    // Register users for different organizations
    await registerUser('Employer', 'EmployerMSP', 'employerUser1', 'client');
    await registerUser('Engineer', 'EngineerMSP', 'engineerUser1', 'client');
    await registerUser('Contractor', 'ContractorMSP', 'contractorUser1', 'client');
    
    console.log('\n🎉 All users registered successfully!');
}

main();
