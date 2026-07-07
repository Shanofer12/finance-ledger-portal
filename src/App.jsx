import React, { useState, useEffect } from 'react';
import { 
  LayoutDashboard, 
  BookOpen, 
  FileSpreadsheet, 
  FileText, 
  LogOut, 
  Plus, 
  Trash2, 
  Check, 
  X, 
  ChevronDown, 
  ChevronUp, 
  TrendingUp, 
  TrendingDown, 
  Layers, 
  Lock, 
  UserCheck,
  AlertCircle
} from 'lucide-react';

const DEMO_STORAGE_KEY = 'finance_ledger_frontend_demo';

const DEMO_ACCOUNTS = [
  { id: 1, account_code: '1000', name: 'Cash', type: 'Asset', description: 'Operating cash', balance: 103000 },
  { id: 2, account_code: '1100', name: 'Accounts Receivable', type: 'Asset', description: 'Customer receivables', balance: 24000 },
  { id: 3, account_code: '1200', name: 'Office Equipment', type: 'Asset', description: 'Furniture and equipment', balance: 66000 },
  { id: 4, account_code: '2000', name: 'Accounts Payable', type: 'Liability', description: 'Vendor obligations', balance: 15000 },
  { id: 5, account_code: '3000', name: 'Owner Capital', type: 'Equity', description: 'Owner capital contributions', balance: 178000 },
  { id: 6, account_code: '4000', name: 'Service Revenue', type: 'Revenue', description: 'Consulting revenue', balance: 18000 },
  { id: 7, account_code: '5000', name: 'Rent Expense', type: 'Expense', description: 'Office rent', balance: 9000 },
  { id: 8, account_code: '5100', name: 'Utilities Expense', type: 'Expense', description: 'Internet and utilities', balance: 2400 }
];

const DEMO_JOURNAL_ENTRIES = [
  {
    id: 101,
    entry_date: '2026-06-01',
    description: 'Consulting fee received',
    status: 'Posted',
    creator_name: 'Ava Patel',
    approver_name: 'Ravi Sharma',
    items: [
      { id: 1001, account_id: 1, account_code: '1000', account_name: 'Cash', debit: 18000, credit: 0 },
      { id: 1002, account_id: 6, account_code: '4000', account_name: 'Service Revenue', debit: 0, credit: 18000 }
    ]
  },
  {
    id: 102,
    entry_date: '2026-06-03',
    description: 'Office rent payment',
    status: 'Posted',
    creator_name: 'Ava Patel',
    approver_name: 'Ravi Sharma',
    items: [
      { id: 1003, account_id: 7, account_code: '5000', account_name: 'Rent Expense', debit: 9000, credit: 0 },
      { id: 1004, account_id: 1, account_code: '1000', account_name: 'Cash', debit: 0, credit: 9000 }
    ]
  },
  {
    id: 103,
    entry_date: '2026-06-05',
    description: 'Internet utility invoice',
    status: 'Draft',
    creator_name: 'Ava Patel',
    items: [
      { id: 1005, account_id: 8, account_code: '5100', account_name: 'Utilities Expense', debit: 2400, credit: 0 },
      { id: 1006, account_id: 4, account_code: '2000', account_name: 'Accounts Payable', debit: 0, credit: 2400 }
    ]
  }
];

const formatCurrency = (val) => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(val);
};

const readStoredDemoData = () => {
  if (typeof window === 'undefined') {
    return { accounts: DEMO_ACCOUNTS.map((acc) => ({ ...acc })), journalEntries: DEMO_JOURNAL_ENTRIES.map((entry) => ({ ...entry, items: entry.items.map((item) => ({ ...item })) })) };
  }

  try {
    const stored = localStorage.getItem(DEMO_STORAGE_KEY);
    if (stored) {
      const parsed = JSON.parse(stored);
      return {
        accounts: parsed.accounts || DEMO_ACCOUNTS.map((acc) => ({ ...acc })),
        journalEntries: parsed.journalEntries || DEMO_JOURNAL_ENTRIES.map((entry) => ({ ...entry, items: entry.items.map((item) => ({ ...item })) }))
      };
    }
  } catch (err) {
    console.warn('Could not read demo storage:', err);
  }

  return { accounts: DEMO_ACCOUNTS.map((acc) => ({ ...acc })), journalEntries: DEMO_JOURNAL_ENTRIES.map((entry) => ({ ...entry, items: entry.items.map((item) => ({ ...item })) })) };
};

const persistDemoData = (accounts, journalEntries) => {
  if (typeof window === 'undefined') return;
  localStorage.setItem(DEMO_STORAGE_KEY, JSON.stringify({ accounts, journalEntries }));
};

const buildReportsFromAccounts = (accountList = []) => {
  const revenues = accountList.filter((acc) => acc.type === 'Revenue').map((acc) => ({ ...acc, balance: Number(acc.balance) || 0 }));
  const expenses = accountList.filter((acc) => acc.type === 'Expense').map((acc) => ({ ...acc, balance: Number(acc.balance) || 0 }));
  const assets = accountList.filter((acc) => acc.type === 'Asset').map((acc) => ({ ...acc, balance: Number(acc.balance) || 0 }));
  const liabilities = accountList.filter((acc) => acc.type === 'Liability').map((acc) => ({ ...acc, balance: Number(acc.balance) || 0 }));
  const equities = accountList.filter((acc) => acc.type === 'Equity').map((acc) => ({ ...acc, balance: Number(acc.balance) || 0 }));

  const totalRevenue = revenues.reduce((sum, acc) => sum + (Number(acc.balance) || 0), 0);
  const totalExpenses = expenses.reduce((sum, acc) => sum + (Number(acc.balance) || 0), 0);
  const netIncome = totalRevenue - totalExpenses;

  const totalAssets = assets.reduce((sum, acc) => sum + (Number(acc.balance) || 0), 0);
  const totalLiabilities = liabilities.reduce((sum, acc) => sum + (Number(acc.balance) || 0), 0);
  const totalEquity = equities.reduce((sum, acc) => sum + (Number(acc.balance) || 0), 0);
  const totalLiabilitiesAndEquity = totalLiabilities + totalEquity;

  const trialBalance = accountList.map((acc) => {
    const balance = Number(acc.balance) || 0;
    const isDebitNormal = acc.type === 'Asset' || acc.type === 'Expense';
    return {
      ...acc,
      debit_total: isDebitNormal ? Math.max(balance, 0) : Math.max(-balance, 0),
      credit_total: isDebitNormal ? Math.max(-balance, 0) : Math.max(balance, 0)
    };
  });

  return {
    trialBalance,
    pl: {
      revenues,
      expenses,
      totalRevenue,
      totalExpenses,
      netIncome
    },
    balanceSheet: {
      assets,
      liabilities,
      equities,
      totalAssets,
      totalLiabilities,
      totalEquity,
      totalLiabilitiesAndEquity
    }
  };
};

const applyEntryToAccounts = (accountList = [], entry) => {
  if (!entry || !entry.items) return accountList;

  return accountList.map((acc) => {
    const matchingItem = entry.items.find((item) => item.account_id === acc.id);
    if (!matchingItem) return acc;

    const debit = Number(matchingItem.debit) || 0;
    const credit = Number(matchingItem.credit) || 0;
    const currentBalance = Number(acc.balance) || 0;
    const nextBalance = (acc.type === 'Asset' || acc.type === 'Expense')
      ? currentBalance + debit - credit
      : currentBalance - debit + credit;

    return { ...acc, balance: nextBalance };
  });
};

function App() {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('accountant_user');
    return saved ? JSON.parse(saved) : null;
  });

  const [currentTab, setCurrentTab] = useState('dashboard');

  // Login State
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState('');

  // Data States
  const [accounts, setAccounts] = useState(() => {
    const persisted = readStoredDemoData();
    return persisted.accounts;
  });
  const [journalEntries, setJournalEntries] = useState(() => {
    const persisted = readStoredDemoData();
    return persisted.journalEntries;
  });
  const [reports, setReports] = useState(() => {
    const persisted = readStoredDemoData();
    return buildReportsFromAccounts(persisted.accounts);
  });
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  // New Journal Entry State
  const [entryDate, setEntryDate] = useState(new Date().toISOString().split('T')[0]);
  const [entryDesc, setEntryDesc] = useState('');
  const [entryItems, setEntryItems] = useState([
    { account_id: '', debit: '', credit: '' },
    { account_id: '', debit: '', credit: '' }
  ]);
  const [entrySuccess, setEntrySuccess] = useState('');

  // UI States
  const [expandedEntry, setExpandedEntry] = useState(null);
  const [reportSubTab, setReportSubTab] = useState('pl'); // pl, bs, tb

  useEffect(() => {
    persistDemoData(accounts, journalEntries);
  }, [accounts, journalEntries]);

  useEffect(() => {
    setReports(buildReportsFromAccounts(accounts));
  }, [accounts]);

  // Fetch Core Data
  const fetchData = () => {
    if (!user) return;
    setLoading(true);
    try {
      setReports(buildReportsFromAccounts(accounts));
      setErrorMessage('');
    } catch (err) {
      console.error('Error preparing frontend data:', err);
      setErrorMessage('Could not refresh the demo ledger view.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [user, accounts]);

  // Actions
  const handleLogin = (e) => {
    e.preventDefault();
    setLoginError('');

    if (username === 'accountant' && password === 'accountant123') {
      const demoUser = { id: 1, name: 'Ava Patel', role: 'accountant' };
      setUser(demoUser);
      localStorage.setItem('accountant_user', JSON.stringify(demoUser));
      setCurrentTab('dashboard');
    } else if (username === 'manager' && password === 'manager123') {
      const demoUser = { id: 2, name: 'Ravi Sharma', role: 'manager' };
      setUser(demoUser);
      localStorage.setItem('accountant_user', JSON.stringify(demoUser));
      setCurrentTab('dashboard');
    } else {
      setLoginError('Invalid credentials. Use accountant/accountant123 or manager/manager123.');
    }
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('accountant_user');
    setCurrentTab('dashboard');
  };

  // Journal Entry Posting Validation
  const getJournalTotals = () => {
    const totalDebit = entryItems.reduce((sum, item) => sum + Number(item.debit || 0), 0);
    const totalCredit = entryItems.reduce((sum, item) => sum + Number(item.credit || 0), 0);
    const diff = Math.abs(totalDebit - totalCredit);
    const isBalanced = diff < 0.001 && totalDebit > 0;
    return { totalDebit, totalCredit, diff, isBalanced };
  };

  const handleAddEntryRow = () => {
    setEntryItems([...entryItems, { account_id: '', debit: '', credit: '' }]);
  };

  const handleRemoveEntryRow = (index) => {
    if (entryItems.length <= 2) return;
    setEntryItems(entryItems.filter((_, i) => i !== index));
  };

  const handleEntryRowChange = (index, field, value) => {
    const updated = [...entryItems];
    if (field === 'debit') {
      updated[index].debit = value;
      if (value !== '') updated[index].credit = '';
    } else if (field === 'credit') {
      updated[index].credit = value;
      if (value !== '') updated[index].debit = '';
    } else {
      updated[index][field] = value;
    }
    setEntryItems(updated);
  };

  const handleSubmitJournalEntry = (e) => {
    e.preventDefault();
    setErrorMessage('');
    setEntrySuccess('');

    const { isBalanced } = getJournalTotals();
    if (!isBalanced) {
      setErrorMessage('Journal entries must be balanced (Debits = Credits) and contain at least one row.');
      return;
    }

    const itemsToSubmit = entryItems
      .filter((item) => item.account_id && (Number(item.debit) > 0 || Number(item.credit) > 0))
      .map((item) => {
        const account = accounts.find((acc) => acc.id === Number(item.account_id));
        return {
          id: Date.now() + Math.random(),
          account_id: Number(item.account_id),
          account_code: account?.account_code || '',
          account_name: account?.name || '',
          debit: Number(item.debit || 0),
          credit: Number(item.credit || 0)
        };
      });

    const newEntry = {
      id: Date.now(),
      entry_date: entryDate,
      description: entryDesc,
      status: 'Draft',
      creator_name: user.name,
      items: itemsToSubmit
    };

    setJournalEntries((prev) => [newEntry, ...prev]);
    setEntrySuccess('Journal Entry submitted as Draft. Awaiting Manager Approval.');
    setEntryDesc('');
    setEntryItems([
      { account_id: '', debit: '', credit: '' },
      { account_id: '', debit: '', credit: '' }
    ]);
    setCurrentTab('journal-history');
  };

  const handleApproveEntry = (id) => {
    const targetEntry = journalEntries.find((entry) => entry.id === id);
    if (!targetEntry) return;

    setJournalEntries((prev) => prev.map((entry) => entry.id === id ? { ...entry, status: 'Posted', approver_name: user.name } : entry));
    setAccounts((prev) => applyEntryToAccounts(prev, targetEntry));
    setErrorMessage('');
  };

  const handleRejectEntry = (id) => {
    setJournalEntries((prev) => prev.map((entry) => entry.id === id ? { ...entry, status: 'Rejected', approver_name: user.name } : entry));
  };

  const handleDeleteEntry = (id) => {
    if (!window.confirm('Are you sure you want to delete this draft entry?')) return;
    setJournalEntries((prev) => prev.filter((entry) => entry.id !== id));
  };

  // Render Functions
  if (!user) {
    return (
      <div style={{ display: 'flex', minHeight: '100vh', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
        <div className="glass animate-fade-in" style={{ width: '100%', maxWidth: '420px', padding: '36px', position: 'relative' }}>
          <div style={{ position: 'absolute', top: '-3px', left: '0', right: '0', height: '3px', background: 'linear-gradient(90deg, var(--primary), #818cf8)', borderRadius: 'var(--radius-md) var(--radius-md) 0 0' }} />
          
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px', marginBottom: '24px' }}>
            <div style={{ background: 'var(--primary-glow)', border: '1px solid var(--primary)', borderRadius: '8px', padding: '8px' }}>
              <Layers style={{ color: 'var(--primary)', width: '24px', height: '24px' }} />
            </div>
            <h1 style={{ fontSize: '24px', fontWeight: '700', fontFamily: 'var(--font-title)' }}>
              <span style={{ color: 'var(--primary)' }}>Ledger</span>
            </h1>
          </div>

          <p style={{ color: 'var(--text-secondary)', textAlign: 'center', fontSize: '13px', marginBottom: '32px' }}>
            Internal Accounting &amp; General Ledger Portal
          </p>

          {loginError && (
            <div className="badge badge-danger" style={{ width: '100%', padding: '10px 14px', borderRadius: 'var(--radius-sm)', marginBottom: '20px', display: 'flex', gap: '8px', alignItems: 'center' }}>
              <AlertCircle size={16} />
              <span style={{ textTransform: 'none', fontWeight: 'normal', fontSize: '13px' }}>{loginError}</span>
            </div>
          )}

          <form onSubmit={handleLogin}>
            <div className="form-group">
              <label>Username</label>
              <input 
                type="text" 
                className="form-control" 
                placeholder="e.g. accountant" 
                value={username} 
                onChange={(e) => setUsername(e.target.value)}
                required
              />
            </div>
            <div className="form-group" style={{ marginBottom: '28px' }}>
              <label>Password</label>
              <input 
                type="password" 
                className="form-control" 
                placeholder="••••••••" 
                value={password} 
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <button type="submit" className="btn btn-primary" style={{ width: '100%', gap: '8px' }}>
              <Lock size={16} />
              Authenticate Portal
            </button>
          </form>

          <div style={{ marginTop: '24px', borderTop: '1px solid var(--border-color)', paddingTop: '16px', fontSize: '12px', color: 'var(--text-muted)', textAlign: 'center' }}>
            <p>Demo Accounts: <strong>accountant</strong> (pwd: <em>accountant123</em>)</p>
            <p style={{ marginTop: '4px' }}>Approver Account: <strong>manager</strong> (pwd: <em>manager123</em>)</p>
          </div>
        </div>
      </div>
    );
  }

  // Calculate dashboard visual data
  const totalAssets = reports.balanceSheet.totalAssets || 0;
  const totalLiabilities = reports.balanceSheet.totalLiabilities || 0;
  const totalEquity = reports.balanceSheet.totalEquity || 0;
  const netIncome = reports.pl.netIncome || 0;

  return (
    <div className="app-container">
      {/* Sidebar */}
      <aside className="sidebar animate-slide-in">
        <div className="sidebar-logo">
          <Layers style={{ color: 'var(--primary)', width: '22px', height: '22px' }} />
          <span>Ledger</span>
        </div>

        <nav>
          <ul className="menu-list">
            <li>
              <div 
                className={`menu-item ${currentTab === 'dashboard' ? 'active' : ''}`}
                onClick={() => setCurrentTab('dashboard')}
              >
                <LayoutDashboard size={18} />
                Dashboard
              </div>
            </li>
            <li>
              <div 
                className={`menu-item ${currentTab === 'accounts' ? 'active' : ''}`}
                onClick={() => setCurrentTab('accounts')}
              >
                <BookOpen size={18} />
                Chart of Accounts
              </div>
            </li>
            <li>
              <div 
                className={`menu-item ${currentTab === 'journal-entry' ? 'active' : ''}`}
                onClick={() => setCurrentTab('journal-entry')}
              >
                <Plus size={18} />
                New Journal Entry
              </div>
            </li>
            <li>
              <div 
                className={`menu-item ${currentTab === 'journal-history' ? 'active' : ''}`}
                onClick={() => setCurrentTab('journal-history')}
              >
                <FileText size={18} />
                Journal History
              </div>
            </li>
            <li>
              <div 
                className={`menu-item ${currentTab === 'reports' ? 'active' : ''}`}
                onClick={() => setCurrentTab('reports')}
              >
                <FileSpreadsheet size={18} />
                Financial Reports
              </div>
            </li>
          </ul>
        </nav>

        <div className="sidebar-footer">
          <div className="user-profile-badge" style={{ marginBottom: '14px' }}>
            <div className="user-avatar">
              {user.name.charAt(0)}
            </div>
            <div className="user-info">
              <span className="user-name">{user.name}</span>
              <span className="user-role">{user.role}</span>
            </div>
          </div>
          <button 
            className="btn btn-secondary btn-sm" 
            onClick={handleLogout}
            style={{ width: '100%', gap: '8px', color: 'var(--danger)', borderColor: 'rgba(220, 38, 38, 0.15)' }}
          >
            <LogOut size={14} />
            Exit Portal
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="main-content">
        {errorMessage && (
          <div className="badge badge-danger animate-fade-in" style={{ width: '100%', padding: '14px', borderRadius: 'var(--radius-md)', marginBottom: '24px', display: 'flex', gap: '8px', alignItems: 'center' }}>
            <AlertCircle size={18} />
            <span style={{ textTransform: 'none', fontWeight: '500', fontSize: '14px' }}>{errorMessage}</span>
          </div>
        )}

        {/* LOADING SHIMMER */}
        {loading && accounts.length === 0 ? (
          <div style={{ padding: '40px', textAlign: 'center', color: 'var(--text-secondary)' }}>
            Loading ledger database data...
          </div>
        ) : (
          <div className="animate-fade-in">
            {/* 1. DASHBOARD TAB */}
            {currentTab === 'dashboard' && (
              <div>
                <header style={{ marginBottom: '32px' }}>
                  <h1 style={{ fontSize: '28px', fontWeight: '700', color: 'var(--text-primary)' }}>Accountant Control Dashboard</h1>
                  <p style={{ color: 'var(--text-secondary)', fontSize: '14px', marginTop: '4px' }}>Double-entry ledger balances and performance tracking</p>
                </header>

                {/* KPIs */}
                <div className="kpi-grid">
                  <div className={`glass kpi-card ${netIncome >= 0 ? 'success' : 'danger'}`}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-secondary)', fontSize: '13px', fontWeight: '500' }}>
                      Net Income (YTD)
                      {netIncome >= 0 ? <TrendingUp size={16} style={{ color: 'var(--success)' }} /> : <TrendingDown size={16} style={{ color: 'var(--danger)' }} />}
                    </div>
                    <div className="kpi-value" style={{ color: netIncome >= 0 ? 'var(--success)' : 'var(--danger)' }}>
                      {formatCurrency(netIncome)}
                    </div>
                    <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Revenue vs Expenses</span>
                  </div>

                  <div className="glass kpi-card">
                    <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-secondary)', fontSize: '13px', fontWeight: '500' }}>
                      Total Assets
                      <TrendingUp size={16} style={{ color: 'var(--primary)' }} />
                    </div>
                    <div className="kpi-value">
                      {formatCurrency(totalAssets)}
                    </div>
                    <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Cash, Receivables & Equipment</span>
                  </div>

                  <div className="glass kpi-card warning">
                    <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-secondary)', fontSize: '13px', fontWeight: '500' }}>
                      Total Liabilities
                      <Layers size={16} style={{ color: 'var(--warning)' }} />
                    </div>
                    <div className="kpi-value" style={{ color: 'var(--warning)' }}>
                      {formatCurrency(totalLiabilities)}
                    </div>
                    <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Payables & Short-term Loans</span>
                  </div>

                  <div className="glass kpi-card success">
                    <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-secondary)', fontSize: '13px', fontWeight: '500' }}>
                      Total Owner's Equity
                      <UserCheck size={16} style={{ color: 'var(--success)' }} />
                    </div>
                    <div className="kpi-value">
                      {formatCurrency(totalEquity)}
                    </div>
                    <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Capital & Retained Earnings</span>
                  </div>
                </div>

                {/* GRAPH & ACTION ROW */}
                <div style={{ display: 'grid', gridTemplateColumns: '1.6fr 1fr', gap: '30px', marginBottom: '30px' }}>
                  {/* Ledger Balance Sheet Distribution */}
                  <div className="glass" style={{ padding: '28px' }}>
                    <h3 style={{ fontSize: '16px', fontWeight: '600', marginBottom: '20px', fontFamily: 'var(--font-title)' }}>Ledger Balance Health Check</h3>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                      {/* Asset bar */}
                      <div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', marginBottom: '6px' }}>
                          <span>Assets</span>
                          <strong>{formatCurrency(totalAssets)}</strong>
                        </div>
                        <div style={{ width: '100%', height: '12px', background: 'rgba(0,0,0,0.05)', borderRadius: '6px', overflow: 'hidden' }}>
                          <div style={{ width: `${totalAssets > 0 ? (totalAssets / (totalAssets + totalLiabilities + totalEquity)) * 100 : 0}%`, height: '100%', background: 'var(--primary)', borderRadius: '6px' }} />
                        </div>
                      </div>

                      {/* Liabilities + Equity bar */}
                      <div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', marginBottom: '6px' }}>
                          <span>Liabilities & Equity</span>
                          <strong>{formatCurrency(totalLiabilities + totalEquity)}</strong>
                        </div>
                        <div style={{ width: '100%', height: '12px', background: 'rgba(0,0,0,0.05)', borderRadius: '6px', overflow: 'hidden' }}>
                          <div style={{ width: `${(totalLiabilities + totalEquity) > 0 ? ((totalLiabilities + totalEquity) / (totalAssets + totalLiabilities + totalEquity)) * 100 : 0}%`, height: '100%', background: 'var(--success)', borderRadius: '6px' }} />
                        </div>
                      </div>

                      {/* Double entry rule check alert */}
                      <div style={{ marginTop: '12px', padding: '14px', borderRadius: 'var(--radius-sm)', background: Math.abs(totalAssets - (totalLiabilities + totalEquity)) < 0.1 ? 'rgba(5, 150, 105, 0.05)' : 'rgba(220, 38, 38, 0.05)', border: `1px solid ${Math.abs(totalAssets - (totalLiabilities + totalEquity)) < 0.1 ? 'rgba(5, 150, 105, 0.15)' : 'rgba(220, 38, 38, 0.15)'}`, display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: Math.abs(totalAssets - (totalLiabilities + totalEquity)) < 0.1 ? 'var(--success)' : 'var(--danger)' }} />
                        <span style={{ fontSize: '12px', color: Math.abs(totalAssets - (totalLiabilities + totalEquity)) < 0.1 ? 'var(--success)' : 'var(--danger)', fontWeight: '500' }}>
                          {Math.abs(totalAssets - (totalLiabilities + totalEquity)) < 0.1 
                            ? 'Ledger Equation is Balanced (Assets = Liabilities + Equity)' 
                            : 'Ledger Equation Out of Balance! Please check journal postings.'
                          }
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Actions & Alerts */}
                  <div className="glass" style={{ padding: '28px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                    <div>
                      <h3 style={{ fontSize: '16px', fontWeight: '600', marginBottom: '16px', fontFamily: 'var(--font-title)' }}>Ledger Approvals Needed</h3>
                      {journalEntries.filter(e => e.status === 'Draft').length === 0 ? (
                        <p style={{ color: 'var(--text-secondary)', fontSize: '13px' }}>All transactions have been verified and posted.</p>
                      ) : (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                          {journalEntries.filter(e => e.status === 'Draft').slice(0, 3).map(entry => (
                            <div key={entry.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 12px', background: 'rgba(0,0,0,0.01)', borderRadius: '6px', border: '1px solid var(--border-color)' }}>
                              <div style={{ display: 'flex', flexDirection: 'column' }}>
                                <span style={{ fontSize: '13px', fontWeight: '500' }}>{entry.description.substring(0, 22)}...</span>
                                <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Created by {entry.creator_name}</span>
                              </div>
                              <button 
                                className="btn btn-secondary btn-sm" 
                                onClick={() => {
                                  setCurrentTab('journal-history');
                                  setExpandedEntry(entry.id);
                                }}
                                style={{ padding: '4px 8px', fontSize: '11px' }}
                              >
                                View Entry
                              </button>
                            </div>
                          ))}
                          {journalEntries.filter(e => e.status === 'Draft').length > 3 && (
                            <span style={{ fontSize: '11px', color: 'var(--primary)', cursor: 'pointer', alignSelf: 'flex-end' }} onClick={() => setCurrentTab('journal-history')}>
                              + {journalEntries.filter(e => e.status === 'Draft').length - 3} more drafts pending
                            </span>
                          )}
                        </div>
                      )}
                    </div>
                    
                    <button 
                      className="btn btn-primary" 
                      onClick={() => setCurrentTab('journal-entry')}
                      style={{ marginTop: '20px', width: '100%' }}
                    >
                      <Plus size={16} />
                      Post New Journal Entry
                    </button>
                  </div>
                </div>

                {/* RECENT ENTRIES TABLE SUMMARY */}
                <div className="glass" style={{ padding: '28px' }}>
                  <h3 style={{ fontSize: '16px', fontWeight: '600', marginBottom: '16px', fontFamily: 'var(--font-title)' }}>Recent Ledger Postings</h3>
                  <div className="table-container">
                    <table className="custom-table">
                      <thead>
                        <tr>
                          <th>Date</th>
                          <th>Description</th>
                          <th>Created By</th>
                          <th>Status</th>
                          <th className="numeric" style={{ paddingRight: '24px' }}>Action</th>
                        </tr>
                      </thead>
                      <tbody>
                        {journalEntries.slice(0, 5).map(entry => (
                          <tr key={entry.id}>
                            <td>{entry.entry_date}</td>
                            <td>{entry.description}</td>
                            <td>{entry.creator_name}</td>
                            <td>
                              <span className={`badge ${
                                entry.status === 'Posted' ? 'badge-success' : 
                                entry.status === 'Draft' ? 'badge-warning' : 'badge-danger'
                              }`}>
                                {entry.status}
                              </span>
                            </td>
                            <td className="numeric">
                              <button 
                                className="btn btn-secondary btn-sm" 
                                onClick={() => {
                                  setCurrentTab('journal-history');
                                  setExpandedEntry(entry.id);
                                }}
                                style={{ padding: '4px 8px' }}
                              >
                                Details
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}

            {/* 2. CHART OF ACCOUNTS TAB */}
            {currentTab === 'accounts' && (
              <div>
                <header style={{ marginBottom: '32px' }}>
                  <h1 style={{ fontSize: '28px', fontWeight: '700', color: 'var(--text-primary)' }}>Chart of Accounts (COA)</h1>
                  <p style={{ color: 'var(--text-secondary)', fontSize: '14px', marginTop: '4px' }}>Overview of all General Ledger ledger-normal balance accounts</p>
                </header>

                <div className="glass" style={{ padding: '28px' }}>
                  <div className="table-container">
                    <table className="custom-table">
                      <thead>
                        <tr>
                          <th>Code</th>
                          <th>Account Name</th>
                          <th>Account Type</th>
                          <th>Description</th>
                          <th className="numeric" style={{ paddingRight: '24px' }}>Current Balance</th>
                        </tr>
                      </thead>
                      <tbody>
                        {accounts.map(acc => (
                          <tr key={acc.id}>
                            <td style={{ fontFamily: 'monospace', fontWeight: '600', color: 'var(--primary)' }}>{acc.account_code}</td>
                            <td style={{ fontWeight: '500' }}>{acc.name}</td>
                            <td>
                              <span className={`badge ${
                                acc.type === 'Asset' ? 'badge-info' :
                                acc.type === 'Liability' ? 'badge-warning' :
                                acc.type === 'Equity' ? 'badge-success' : 'badge-success'
                              }`} style={{ textTransform: 'capitalize' }}>
                                {acc.type}
                              </span>
                            </td>
                            <td style={{ color: 'var(--text-secondary)', fontSize: '13px' }}>{acc.description}</td>
                            <td className="numeric" style={{ paddingRight: '24px', fontWeight: '600', fontVariantNumeric: 'tabular-nums' }}>
                              {formatCurrency(acc.balance)}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}

            {/* 3. NEW JOURNAL ENTRY TAB */}
            {currentTab === 'journal-entry' && (
              <div>
                <header style={{ marginBottom: '32px' }}>
                  <h1 style={{ fontSize: '28px', fontWeight: '700', color: 'var(--text-primary)' }}>New Journal Entry</h1>
                  <p style={{ color: 'var(--text-secondary)', fontSize: '14px', marginTop: '4px' }}>Draft a balanced ledger posting to affect account balances</p>
                </header>

                <div className="glass" style={{ padding: '32px', maxWidth: '900px' }}>
                  {entrySuccess && (
                    <div className="badge badge-success" style={{ width: '100%', padding: '14px', borderRadius: 'var(--radius-sm)', marginBottom: '24px', display: 'flex', gap: '8px', alignItems: 'center' }}>
                      <Check size={18} />
                      <span style={{ textTransform: 'none', fontWeight: '500', fontSize: '14px' }}>{entrySuccess}</span>
                    </div>
                  )}

                  <form onSubmit={handleSubmitJournalEntry}>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '20px', marginBottom: '24px' }}>
                      <div className="form-group">
                        <label>Entry Date</label>
                        <input 
                          type="date" 
                          className="form-control" 
                          value={entryDate} 
                          onChange={(e) => setEntryDate(e.target.value)} 
                          required 
                        />
                      </div>
                      <div className="form-group">
                        <label>Entry Description / Explanation</label>
                        <input 
                          type="text" 
                          className="form-control" 
                          placeholder="e.g. Paid office internet invoice" 
                          value={entryDesc} 
                          onChange={(e) => setEntryDesc(e.target.value)} 
                          required 
                        />
                      </div>
                    </div>

                    <h4 style={{ fontSize: '14px', color: 'var(--text-secondary)', marginBottom: '12px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Transaction Ledger Lines</h4>
                    
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '20px' }}>
                      {entryItems.map((item, idx) => (
                        <div key={idx} style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
                          <div style={{ flex: 3 }}>
                            <select 
                              className="form-control"
                              value={item.account_id}
                              onChange={(e) => handleEntryRowChange(idx, 'account_id', e.target.value)}
                              required
                            >
                              <option value="">-- Choose Account --</option>
                              {accounts.map(acc => (
                                <option key={acc.id} value={acc.id}>
                                  {acc.account_code} - {acc.name} ({acc.type})
                                </option>
                              ))}
                            </select>
                          </div>
                          
                          <div style={{ flex: 1.2 }}>
                            <input 
                              type="number" 
                              step="0.01" 
                              className="form-control numeric" 
                              placeholder="Debit (₹)" 
                              value={item.debit}
                              disabled={item.credit !== ''}
                              onChange={(e) => handleEntryRowChange(idx, 'debit', e.target.value)}
                            />
                          </div>

                          <div style={{ flex: 1.2 }}>
                            <input 
                              type="number" 
                              step="0.01" 
                              className="form-control numeric" 
                              placeholder="Credit (₹)" 
                              value={item.credit}
                              disabled={item.debit !== ''}
                              onChange={(e) => handleEntryRowChange(idx, 'credit', e.target.value)}
                            />
                          </div>

                          <button 
                            type="button" 
                            className="btn btn-secondary btn-sm"
                            style={{ padding: '10px', color: 'var(--danger)', display: 'flex', alignItems: 'center', justifycontent: 'center' }}
                            disabled={entryItems.length <= 2}
                            onClick={() => handleRemoveEntryRow(idx)}
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      ))}
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid var(--border-color)', paddingTop: '20px' }}>
                      <button type="button" className="btn btn-secondary" onClick={handleAddEntryRow}>
                        <Plus size={16} /> Add Debit/Credit Line
                      </button>

                      {/* Display live balance status */}
                      {(() => {
                        const { totalDebit, totalCredit, diff, isBalanced } = getJournalTotals();
                        return (
                          <div style={{ textAlign: 'right' }}>
                            <div style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>
                              Debits: <strong>{formatCurrency(totalDebit)}</strong> | Credits: <strong>{formatCurrency(totalCredit)}</strong>
                            </div>
                            <div style={{ fontSize: '14px', fontWeight: '600', marginTop: '4px', color: isBalanced ? 'var(--success)' : 'var(--danger)' }}>
                              {isBalanced 
                                ? 'Balanced' 
                                : `Out of Balance by ${formatCurrency(diff)}`
                              }
                            </div>
                          </div>
                        );
                      })()}
                    </div>

                    <button 
                      type="submit" 
                      className="btn btn-primary" 
                      style={{ marginTop: '28px', width: '100%', gap: '8px' }}
                      disabled={!getJournalTotals().isBalanced}
                    >
                      <Check size={16} /> Create Draft Journal Entry
                    </button>
                  </form>
                </div>
              </div>
            )}

            {/* 4. JOURNAL HISTORY TAB */}
            {currentTab === 'journal-history' && (
              <div>
                <header style={{ marginBottom: '32px' }}>
                  <h1 style={{ fontSize: '28px', fontWeight: '700', color: 'var(--text-primary)' }}>Journal Postings Log</h1>
                  <p style={{ color: 'var(--text-secondary)', fontSize: '14px', marginTop: '4px' }}>Review, verify, and approve transaction records</p>
                </header>

                <div className="glass" style={{ padding: '28px' }}>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                    {journalEntries.map(entry => {
                      const isExpanded = expandedEntry === entry.id;
                      const entryTotal = entry.items.reduce((sum, item) => sum + item.debit, 0);

                      return (
                        <div 
                          key={entry.id} 
                          style={{ 
                            border: '1px solid var(--border-color)', 
                            borderRadius: 'var(--radius-md)', 
                            background: '#ffffff',
                            overflow: 'hidden'
                          }}
                        >
                          {/* Header click */}
                          <div 
                            style={{ 
                              padding: '16px 20px', 
                              display: 'flex', 
                              justifyContent: 'space-between', 
                              alignItems: 'center', 
                              cursor: 'pointer',
                              background: isExpanded ? '#f8fafc' : 'transparent'
                            }}
                            onClick={() => setExpandedEntry(isExpanded ? null : entry.id)}
                          >
                            <div style={{ display: 'flex', gap: '24px', alignItems: 'center' }}>
                              <span style={{ fontSize: '14px', fontWeight: '600', color: 'var(--primary)', fontFamily: 'monospace' }}>
                                #{entry.id.toString().padStart(4, '0')}
                              </span>
                              <span style={{ fontSize: '13px', color: 'var(--text-muted)' }}>{entry.entry_date}</span>
                              <span style={{ fontSize: '14px', fontWeight: '500' }}>{entry.description}</span>
                            </div>

                            <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
                              <span style={{ fontSize: '13px', fontWeight: '600', fontVariantNumeric: 'tabular-nums' }}>
                                {formatCurrency(entryTotal)}
                              </span>

                              <span className={`badge ${
                                entry.status === 'Posted' ? 'badge-success' : 
                                entry.status === 'Draft' ? 'badge-warning' : 'badge-danger'
                              }`}>
                                {entry.status}
                              </span>

                              {isExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                            </div>
                          </div>

                          {/* Expanded Table */}
                          {isExpanded && (
                            <div style={{ padding: '20px', borderTop: '1px solid var(--border-color)', background: '#f8fafc' }}>
                              <table className="custom-table" style={{ width: '100%', marginBottom: '20px' }}>
                                <thead>
                                  <tr>
                                    <th>Account Code</th>
                                    <th>Account Name</th>
                                    <th className="numeric">Debit</th>
                                    <th className="numeric" style={{ paddingRight: '24px' }}>Credit</th>
                                  </tr>
                                </thead>
                                <tbody>
                                  {entry.items.map(item => (
                                    <tr key={item.id}>
                                      <td style={{ fontFamily: 'monospace' }}>{item.account_code}</td>
                                      <td>{item.account_name}</td>
                                      <td className="numeric">
                                        {item.debit > 0 ? formatCurrency(item.debit) : '-'}
                                      </td>
                                      <td className="numeric" style={{ paddingRight: '24px' }}>
                                        {item.credit > 0 ? formatCurrency(item.credit) : '-'}
                                      </td>
                                    </tr>
                                  ))}
                                </tbody>
                              </table>

                              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '12px', color: 'var(--text-secondary)' }}>
                                <div>
                                  Created by: <strong>{entry.creator_name}</strong>
                                  {entry.approver_name && (
                                    <span style={{ marginLeft: '16px' }}>
                                      {entry.status === 'Posted' ? 'Approved' : 'Rejected'} by: <strong>{entry.approver_name}</strong>
                                    </span>
                                  )}
                                </div>

                                <div style={{ display: 'flex', gap: '10px' }}>
                                  {entry.status === 'Draft' && (user.role === 'manager' || user.role === 'admin') && (
                                    <>
                                      <button 
                                        className="btn btn-success btn-sm"
                                        onClick={() => handleApproveEntry(entry.id)}
                                      >
                                        <Check size={14} /> Approve & Post
                                      </button>
                                      <button 
                                        className="btn btn-danger btn-sm"
                                        style={{ background: '#b91c1c' }}
                                        onClick={() => handleRejectEntry(entry.id)}
                                      >
                                        <X size={14} /> Reject
                                      </button>
                                    </>
                                  )}

                                  {entry.status !== 'Posted' && (
                                    <button 
                                      className="btn btn-secondary btn-sm"
                                      style={{ color: 'var(--danger)', borderColor: 'rgba(220, 38, 38, 0.15)' }}
                                      onClick={() => handleDeleteEntry(entry.id)}
                                    >
                                      <Trash2 size={14} /> Delete
                                    </button>
                                  )}
                                </div>
                              </div>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            )}

            {/* 5. FINANCIAL REPORTS TAB */}
            {currentTab === 'reports' && (
              <div>
                <header style={{ marginBottom: '32px' }}>
                  <h1 style={{ fontSize: '28px', fontWeight: '700', color: 'var(--text-primary)' }}>GAAP Financial Statements</h1>
                  <p style={{ color: 'var(--text-secondary)', fontSize: '14px', marginTop: '4px' }}>Real-time accounting reports automatically generated from posted items</p>
                </header>

                {/* Sub Tab Buttons */}
                <div style={{ display: 'flex', gap: '12px', marginBottom: '24px' }}>
                  <button 
                    className={`btn ${reportSubTab === 'pl' ? 'btn-primary' : 'btn-secondary'}`}
                    onClick={() => setReportSubTab('pl')}
                  >
                    Profit & Loss (P&L)
                  </button>
                  <button 
                    className={`btn ${reportSubTab === 'bs' ? 'btn-primary' : 'btn-secondary'}`}
                    onClick={() => setReportSubTab('bs')}
                  >
                    Balance Sheet
                  </button>
                  <button 
                    className={`btn ${reportSubTab === 'tb' ? 'btn-primary' : 'btn-secondary'}`}
                    onClick={() => setReportSubTab('tb')}
                  >
                    Trial Balance
                  </button>
                </div>

                <div className="glass" style={{ padding: '36px' }}>
                  {/* P & L */}
                  {reportSubTab === 'pl' && (
                    <div className="animate-fade-in">
                      <div className="report-header">
                        <div>
                          <h2 style={{ fontSize: '20px', fontFamily: 'var(--font-title)' }}>Income Statement (Profit & Loss)</h2>
                          <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>For Period ending {new Date().toLocaleDateString(undefined, {month:'long', year:'numeric'})}</span>
                        </div>
                        <span className="badge badge-info">Posted Entries Only</span>
                      </div>

                      <div className="table-container">
                        <table className="custom-table">
                          <thead>
                            <tr>
                              <th>Account</th>
                              <th className="numeric" style={{ paddingRight: '24px' }}>Balance</th>
                            </tr>
                          </thead>
                          <tbody>
                            {/* Revenues Section */}
                            <tr>
                              <td colSpan="2" className="report-section-title">Revenue</td>
                            </tr>
                            {reports.pl.revenues.map(rev => (
                              <tr key={rev.code}>
                                <td style={{ paddingLeft: '32px' }}>{rev.code} - {rev.name}</td>
                                <td className="numeric" style={{ paddingRight: '24px' }}>
                                  {formatCurrency(rev.balance)}
                                </td>
                              </tr>
                            ))}
                            <tr className="report-row-total">
                              <td>Total Revenues</td>
                              <td className="numeric" style={{ paddingRight: '24px' }}>
                                {formatCurrency(reports.pl.totalRevenue)}
                              </td>
                            </tr>

                            {/* Expenses Section */}
                            <tr>
                              <td colSpan="2" className="report-section-title">Expenses</td>
                            </tr>
                            {reports.pl.expenses.map(exp => (
                              <tr key={exp.code}>
                                <td style={{ paddingLeft: '32px' }}>{exp.code} - {exp.name}</td>
                                <td className="numeric" style={{ paddingRight: '24px' }}>
                                  {formatCurrency(exp.balance)}
                                </td>
                              </tr>
                            ))}
                            <tr className="report-row-total">
                              <td>Total Expenses</td>
                              <td className="numeric" style={{ paddingRight: '24px' }}>
                                {formatCurrency(reports.pl.totalExpenses)}
                              </td>
                            </tr>

                            {/* Net Income Summary */}
                            <tr className={reports.pl.netIncome >= 0 ? 'report-net-income' : 'report-net-loss'}>
                              <td style={{ fontSize: '15px' }}>Net Income / (Loss)</td>
                              <td className="numeric" style={{ paddingRight: '24px', fontSize: '15px' }}>
                                {formatCurrency(reports.pl.netIncome)}
                              </td>
                            </tr>
                          </tbody>
                        </table>
                      </div>
                    </div>
                  )}

                  {/* BALANCE SHEET */}
                  {reportSubTab === 'bs' && (
                    <div className="animate-fade-in">
                      <div className="report-header">
                        <div>
                          <h2 style={{ fontSize: '20px', fontFamily: 'var(--font-title)' }}>Balance Sheet</h2>
                          <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>As of {new Date().toLocaleDateString(undefined, {month:'long', day:'numeric', year:'numeric'})}</span>
                        </div>
                        <span className="badge badge-info">Posted Entries Only</span>
                      </div>

                      <div className="table-container">
                        <table className="custom-table">
                          <thead>
                            <tr>
                              <th>Account</th>
                              <th className="numeric" style={{ paddingRight: '24px' }}>Balance</th>
                            </tr>
                          </thead>
                          <tbody>
                            {/* Assets */}
                            <tr>
                              <td colSpan="2" className="report-section-title">Assets</td>
                            </tr>
                            {reports.balanceSheet.assets.map(asset => (
                              <tr key={asset.code}>
                                <td style={{ paddingLeft: '32px' }}>{asset.code} - {asset.name}</td>
                                <td className="numeric" style={{ paddingRight: '24px' }}>
                                  {formatCurrency(asset.balance)}
                                </td>
                              </tr>
                            ))}
                            <tr className="report-row-total" style={{ borderBottom: '2px solid var(--text-primary)' }}>
                              <td>Total Assets</td>
                              <td className="numeric" style={{ paddingRight: '24px' }}>
                                {formatCurrency(reports.balanceSheet.totalAssets)}
                              </td>
                            </tr>

                            {/* Liabilities */}
                            <tr>
                              <td colSpan="2" className="report-section-title">Liabilities</td>
                            </tr>
                            {reports.balanceSheet.liabilities.map(liab => (
                              <tr key={liab.code}>
                                <td style={{ paddingLeft: '32px' }}>{liab.code} - {liab.name}</td>
                                <td className="numeric" style={{ paddingRight: '24px' }}>
                                  {formatCurrency(liab.balance)}
                                </td>
                              </tr>
                            ))}
                            <tr className="report-row-total">
                              <td>Total Liabilities</td>
                              <td className="numeric" style={{ paddingRight: '24px' }}>
                                {formatCurrency(reports.balanceSheet.totalLiabilities)}
                              </td>
                            </tr>

                            {/* Equity */}
                            <tr>
                              <td colSpan="2" className="report-section-title">Owner's Equity</td>
                            </tr>
                            {reports.balanceSheet.equities.map(eq => (
                              <tr key={eq.code}>
                                <td style={{ paddingLeft: '32px' }}>{eq.code} - {eq.name}</td>
                                <td className="numeric" style={{ paddingRight: '24px' }}>
                                  {formatCurrency(eq.balance)}
                                </td>
                              </tr>
                            ))}
                            <tr className="report-row-total">
                              <td>Total Equity</td>
                              <td className="numeric" style={{ paddingRight: '24px' }}>
                                {formatCurrency(reports.balanceSheet.totalEquity)}
                              </td>
                            </tr>

                            {/* Total Liabilities & Equity */}
                            <tr className="report-net-income">
                              <td style={{ fontSize: '15px' }}>Total Liabilities & Equity</td>
                              <td className="numeric" style={{ paddingRight: '24px', fontSize: '15px' }}>
                                {formatCurrency(reports.balanceSheet.totalLiabilitiesAndEquity)}
                              </td>
                            </tr>
                          </tbody>
                        </table>
                      </div>
                    </div>
                  )}

                  {/* TRIAL BALANCE */}
                  {reportSubTab === 'tb' && (
                    <div className="animate-fade-in">
                      <div className="report-header">
                        <div>
                          <h2 style={{ fontSize: '20px', fontFamily: 'var(--font-title)' }}>Trial Balance</h2>
                          <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>As of {new Date().toLocaleDateString()}</span>
                        </div>
                        <span className="badge badge-info">Posted Entries Only</span>
                      </div>

                      <div className="table-container">
                        <table className="custom-table">
                          <thead>
                            <tr>
                              <th>Account Code</th>
                              <th>Account Name</th>
                              <th className="numeric">Debit Balance</th>
                              <th className="numeric" style={{ paddingRight: '24px' }}>Credit Balance</th>
                            </tr>
                          </thead>
                          <tbody>
                            {reports.trialBalance.map(acc => {
                              // Assets and Expenses are normally debits. Liabilities, Equity, Revenues are credits.
                              const isDebitNormal = acc.type === 'Asset' || acc.type === 'Expense';
                              const netBalance = isDebitNormal ? (acc.debit_total - acc.credit_total) : (acc.credit_total - acc.debit_total);

                              return (
                                <tr key={acc.account_code}>
                                  <td style={{ fontFamily: 'monospace' }}>{acc.account_code}</td>
                                  <td>{acc.name}</td>
                                  <td className="numeric">
                                    {isDebitNormal && netBalance > 0 ? formatCurrency(netBalance) : '-'}
                                  </td>
                                  <td className="numeric" style={{ paddingRight: '24px' }}>
                                    {!isDebitNormal && netBalance > 0 ? formatCurrency(netBalance) : '-'}
                                  </td>
                                </tr>
                              );
                            })}
                            {/* Totals row */}
                            {(() => {
                              let totalDebits = 0;
                              let totalCredits = 0;
                              reports.trialBalance.forEach(acc => {
                                const isDebitNormal = acc.type === 'Asset' || acc.type === 'Expense';
                                const netBalance = isDebitNormal ? (acc.debit_total - acc.credit_total) : (acc.credit_total - acc.debit_total);
                                if (isDebitNormal && netBalance > 0) totalDebits += netBalance;
                                if (!isDebitNormal && netBalance > 0) totalCredits += netBalance;
                              });

                              return (
                                <tr className="report-row-total" style={{ borderTop: '2px solid var(--text-primary)' }}>
                                  <td colSpan="2">Report Totals</td>
                                  <td className="numeric">{formatCurrency(totalDebits)}</td>
                                  <td className="numeric" style={{ paddingRight: '24px' }}>{formatCurrency(totalCredits)}</td>
                                </tr>
                              );
                            })()}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
}

export default App;
