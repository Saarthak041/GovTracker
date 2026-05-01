const API_URL = 'http://localhost:3000/api';

class App {
    constructor() {
        this.projects = [];
        this.init();
    }

    init() {
        this.setupNavigation();
        this.setupForms();
        this.fetchProjects();
    }

    // --- Navigation & UI ---
    setupNavigation() {
        const links = document.querySelectorAll('.nav-links li');
        links.forEach(link => {
            link.addEventListener('click', (e) => {
                // Update active state
                links.forEach(l => l.classList.remove('active'));
                e.currentTarget.classList.add('active');
                
                // Switch view
                const viewName = e.currentTarget.getAttribute('data-view');
                this.switchView(viewName);
            });
        });
    }

    switchView(viewName) {
        document.querySelectorAll('.view').forEach(view => {
            view.classList.remove('active');
        });
        document.getElementById(`view-${viewName}`).classList.add('active');

        if (viewName === 'dashboard') {
            this.fetchProjects();
        } else if (viewName === 'work-packages') {
            this.populateProjectSelects();
        } else if (viewName === 'payments') {
            this.populateProjectSelects();
        } else if (viewName === 'submit-work-package' || viewName === 'approve-payment') {
            this.populateProjectSelects();
        }
        
        // Update sidebar active state if triggered from a button
        document.querySelectorAll('.nav-links li').forEach(l => l.classList.remove('active'));
        const sidebarLink = document.querySelector(`.nav-links li[data-view="${viewName}"]`);
        if (sidebarLink) sidebarLink.classList.add('active');
    }

    showToast(message, type = 'info') {
        const container = document.getElementById('toast-container');
        const toast = document.createElement('div');
        toast.className = `toast ${type}`;
        
        let icon = 'ℹ️';
        if (type === 'success') icon = '✅';
        if (type === 'error') icon = '❌';

        toast.innerHTML = `
            <div class="toast-icon">${icon}</div>
            <div class="toast-message">${message}</div>
        `;

        container.appendChild(toast);

        // Remove after 4 seconds
        setTimeout(() => {
            toast.style.animation = 'slideOut 0.3s ease forwards';
            setTimeout(() => toast.remove(), 300);
        }, 4000);
    }

    formatCurrency(amount) {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
            maximumFractionDigits: 0
        }).format(amount);
    }

    // --- API Interactions ---
    async fetchProjects() {
        const grid = document.getElementById('projects-grid');
        grid.innerHTML = '<div class="loading-spinner"></div>';

        try {
            const response = await fetch(`${API_URL}/projects`);
            if (!response.ok) throw new Error('Failed to fetch projects');
            
            const result = await response.json();
            this.projects = result.data.projects || [];
            
            this.renderDashboard();
            this.populateProjectSelects();
            
            // Check network status
            document.querySelector('.status-indicator').classList.add('online');
            document.querySelector('.network-status span').textContent = 'Fabric Network: Online';
        } catch (error) {
            console.error(error);
            this.showToast('Could not connect to Blockchain API. Is the server running?', 'error');
            grid.innerHTML = `
                <div class="glass-panel" style="padding: 30px; text-align: center; grid-column: 1 / -1;">
                    <h3 style="color: var(--danger)">Connection Error</h3>
                    <p style="color: var(--text-muted); margin-top: 10px;">Failed to load ledger data. Please ensure the backend API is running on port 3000.</p>
                </div>
            `;
            
            document.querySelector('.status-indicator').classList.remove('online');
            document.querySelector('.status-indicator').style.background = 'var(--danger)';
            document.querySelector('.network-status span').textContent = 'Fabric Network: Offline';
        }
    }

    renderDashboard() {
        // Update Stats
        document.getElementById('stat-total-projects').textContent = this.projects.length;
        
        let totalValue = 0;
        this.projects.forEach(p => {
            if (p.Record && p.Record.totalValue) {
                totalValue += parseInt(p.Record.totalValue);
            }
        });
        document.getElementById('stat-total-value').textContent = this.formatCurrency(totalValue);

        // Update Grid
        const grid = document.getElementById('projects-grid');
        grid.innerHTML = '';

        if (this.projects.length === 0) {
            grid.innerHTML = `
                <div class="glass-panel" style="padding: 30px; text-align: center; grid-column: 1 / -1;">
                    <p style="color: var(--text-muted);">No infrastructure projects found on the ledger.</p>
                </div>
            `;
            return;
        }

        this.projects.forEach(project => {
            const data = project.Record;
            const date = new Date(data.createdAt).toLocaleDateString('en-US', { 
                year: 'numeric', month: 'short', day: 'numeric' 
            });

            const card = document.createElement('div');
            card.className = 'project-card glass-panel';
            card.innerHTML = `
                <div class="project-header">
                    <div>
                        <div class="project-id">${data.projectId}</div>
                        <h3 class="project-name">${data.name}</h3>
                    </div>
                    <span class="badge">${data.status}</span>
                </div>
                
                <p class="project-desc">${data.description}</p>
                
                <div class="project-meta">
                    <div class="meta-item">
                        <span class="meta-label">Total Budget</span>
                        <span class="meta-value">${this.formatCurrency(data.totalValue)}</span>
                    </div>
                    <div class="meta-item" style="text-align: right;">
                        <span class="meta-label">Initialized</span>
                        <span class="meta-value" style="font-size: 0.95rem;">${date}</span>
                    </div>
                </div>
            `;
            grid.appendChild(card);
        });
    }

    setupForms() {
        const form = document.getElementById('create-project-form');
        const btn = document.getElementById('btn-submit-project');

        form.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            const data = {
                projectId: document.getElementById('proj-id').value,
                name: document.getElementById('proj-name').value,
                description: document.getElementById('proj-desc').value,
                totalValue: parseInt(document.getElementById('proj-value').value)
            };

            btn.disabled = true;
            btn.innerHTML = 'Deploying... <div class="loading-spinner" style="width: 15px; height: 15px; border-width: 2px; display: inline-block; margin: 0 0 0 10px; vertical-align: middle;"></div>';

            try {
                this.showToast('Submitting transaction to Fabric orderer...', 'info');
                
                const response = await fetch(`${API_URL}/projects`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(data)
                });

                const result = await response.json();

                if (response.ok) {
                    this.showToast('✅ Transaction committed! Project initialized.', 'success');
                    form.reset();
                    setTimeout(() => this.switchView('dashboard'), 1500);
                } else {
                    throw new Error(result.error || 'Failed to create project');
                }
            } catch (error) {
                console.error(error);
                this.showToast(error.message, 'error');
            } finally {
                btn.disabled = false;
                btn.textContent = 'Deploy to Blockchain';
            }
        });

        // Submit Work Package Form
        const wpForm = document.getElementById('submit-wp-form');
        const wpBtn = document.getElementById('btn-submit-wp');

        wpForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const projectId = document.getElementById('submit-wp-project').value;
            if (!projectId) return this.showToast('Please select a project', 'error');

            const data = {
                workPackageId: document.getElementById('wp-id').value,
                description: document.getElementById('wp-desc').value,
                ipfsHash: document.getElementById('wp-ipfs').value,
                quantity: parseInt(document.getElementById('wp-qty').value),
                value: parseInt(document.getElementById('wp-value').value)
            };

            wpBtn.disabled = true;
            wpBtn.innerHTML = 'Submitting... <div class="loading-spinner" style="width: 15px; height: 15px; border-width: 2px; display: inline-block; margin: 0 0 0 10px; vertical-align: middle;"></div>';

            try {
                const response = await fetch(`${API_URL}/projects/${projectId}/workpackages`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(data)
                });

                if (response.ok) {
                    this.showToast('✅ Work Package submitted to ledger.', 'success');
                    wpForm.reset();
                    setTimeout(() => {
                        this.switchView('work-packages');
                        document.getElementById('wp-project-select').value = projectId;
                        this.fetchWorkPackages();
                    }, 1000);
                } else {
                    const result = await response.json();
                    throw new Error(result.error || 'Failed to submit work package');
                }
            } catch (error) {
                this.showToast(error.message, 'error');
            } finally {
                wpBtn.disabled = false;
                wpBtn.textContent = 'Submit to Ledger';
            }
        });

        // Approve Payment Form
        const payForm = document.getElementById('approve-pay-form');
        const payBtn = document.getElementById('btn-submit-pay');

        payForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const projectId = document.getElementById('approve-pay-project').value;
            if (!projectId) return this.showToast('Please select a project', 'error');

            const data = {
                workPackageId: document.getElementById('pay-wp-id').value,
                approvedAmount: parseInt(document.getElementById('pay-amount').value),
                remarks: document.getElementById('pay-remarks').value
            };

            payBtn.disabled = true;
            payBtn.innerHTML = 'Approving... <div class="loading-spinner" style="width: 15px; height: 15px; border-width: 2px; display: inline-block; margin: 0 0 0 10px; vertical-align: middle;"></div>';

            try {
                const response = await fetch(`${API_URL}/projects/${projectId}/payments`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(data)
                });

                if (response.ok) {
                    this.showToast('✅ Payment approved and recorded.', 'success');
                    payForm.reset();
                    setTimeout(() => {
                        this.switchView('payments');
                        document.getElementById('pay-project-select').value = projectId;
                        this.fetchPayments();
                    }, 1000);
                } else {
                    const result = await response.json();
                    throw new Error(result.error || 'Failed to approve payment');
                }
            } catch (error) {
                this.showToast(error.message, 'error');
            } finally {
                payBtn.disabled = false;
                payBtn.textContent = 'Approve & Record';
            }
        });
    }

    populateProjectSelects() {
        const selects = ['wp-project-select', 'pay-project-select', 'submit-wp-project', 'approve-pay-project'];
        const options = '<option value="">-- Choose a Project --</option>' + 
            this.projects.map(p => `<option value="${p.Record.projectId}">${p.Record.projectId} - ${p.Record.name}</option>`).join('');
            
        selects.forEach(id => {
            const el = document.getElementById(id);
            const currentVal = el.value;
            el.innerHTML = options;
            if (currentVal) el.value = currentVal;
        });
    }

    async fetchWorkPackages() {
        const projectId = document.getElementById('wp-project-select').value;
        const container = document.getElementById('work-packages-container');
        
        if (!projectId) {
            container.innerHTML = `<div class="glass-panel" style="padding: 30px; text-align: center; grid-column: 1 / -1;"><p style="color: var(--text-muted);">Select a project to view its work packages.</p></div>`;
            return;
        }

        container.innerHTML = '<div class="loading-spinner" style="grid-column: 1 / -1;"></div>';

        try {
            const response = await fetch(`${API_URL}/projects/${projectId}/workpackages`);
            if (!response.ok) throw new Error('Failed to fetch work packages');
            
            const result = await response.json();
            const packages = result.data || [];

            if (packages.length === 0) {
                container.innerHTML = `<div class="glass-panel" style="padding: 30px; text-align: center; grid-column: 1 / -1;"><p style="color: var(--text-muted);">No work packages found for this project.</p></div>`;
                return;
            }

            container.innerHTML = packages.map(wp => `
                <div class="project-card glass-panel">
                    <div class="project-header">
                        <div>
                            <div class="project-id">${wp.workPackageId}</div>
                            <h3 class="project-name">Value: ${this.formatCurrency(wp.value)}</h3>
                        </div>
                        <span class="badge" style="background: rgba(79,70,229,0.15); color: var(--primary); border-color: var(--primary);">${wp.status || 'SUBMITTED'}</span>
                    </div>
                    <p class="project-desc">${wp.description}</p>
                    <div class="project-meta">
                        <div class="meta-item">
                            <span class="meta-label">Contractor</span>
                            <span class="meta-value" style="font-size: 0.95rem;">${wp.submittedBy || 'ContractorMSP'}</span>
                        </div>
                        <div class="meta-item" style="text-align: right;">
                            <span class="meta-label">Date</span>
                            <span class="meta-value" style="font-size: 0.95rem;">${new Date(wp.submittedAt).toLocaleDateString()}</span>
                        </div>
                    </div>
                </div>
            `).join('');

        } catch (error) {
            this.showToast(error.message, 'error');
            container.innerHTML = '';
        }
    }

    async fetchPayments() {
        const projectId = document.getElementById('pay-project-select').value;
        const container = document.getElementById('payments-container');
        
        if (!projectId) {
            container.innerHTML = `<div class="glass-panel" style="padding: 30px; text-align: center; grid-column: 1 / -1;"><p style="color: var(--text-muted);">Select a project to view its payments.</p></div>`;
            return;
        }

        container.innerHTML = '<div class="loading-spinner" style="grid-column: 1 / -1;"></div>';

        try {
            const response = await fetch(`${API_URL}/projects/${projectId}/payments`);
            if (!response.ok) throw new Error('Failed to fetch payments');
            
            const result = await response.json();
            const payments = result.data || [];

            if (payments.length === 0) {
                container.innerHTML = `<div class="glass-panel" style="padding: 30px; text-align: center; grid-column: 1 / -1;"><p style="color: var(--text-muted);">No payments found for this project.</p></div>`;
                return;
            }

            container.innerHTML = payments.map(pay => `
                <div class="project-card glass-panel" style="border-left: 4px solid var(--success);">
                    <div class="project-header">
                        <div>
                            <div class="project-id">For ${pay.workPackageId}</div>
                            <h3 class="project-name">Approved: ${this.formatCurrency(pay.approvedAmount)}</h3>
                        </div>
                        <span class="badge">PAID</span>
                    </div>
                    <p class="project-desc"><strong>Remarks:</strong> ${pay.remarks}</p>
                    <div class="project-meta">
                        <div class="meta-item">
                            <span class="meta-label">Approved By</span>
                            <span class="meta-value" style="font-size: 0.95rem;">${pay.approvedBy || 'EmployerMSP'}</span>
                        </div>
                        <div class="meta-item" style="text-align: right;">
                            <span class="meta-label">Date</span>
                            <span class="meta-value" style="font-size: 0.95rem;">${new Date(pay.approvedAt).toLocaleDateString()}</span>
                        </div>
                    </div>
                </div>
            `).join('');

        } catch (error) {
            this.showToast(error.message, 'error');
            container.innerHTML = '';
        }
    }
}

// Initialize App
window.onload = () => {
    window.app = new App();
};
