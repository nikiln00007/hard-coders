// ============================================================
// Expenses Page — Full CRUD + CSV + SMS Import
// ============================================================
import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Plus, Search, Upload, MessageSquare, Trash2, Edit3, X,
} from 'lucide-react';
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid,
} from 'recharts';
import { useAppState } from '../app/providers';
import { formatINR } from '../lib/finance/calculations';
import { amountToLifeHours } from '../lib/finance/life-hours';
import { categorizeTransaction } from '../lib/categorization';
import type { Transaction, ExpenseCategory } from '../types';
import { EXPENSE_CATEGORIES } from '../types';

function genId() {
  return `tx_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
}

export default function Expenses() {
  const { state, dispatch, lifeHoursConfig } = useAppState();
  const { transactions } = state;

  const [showAddModal, setShowAddModal] = useState(false);
  const [showCsvModal, setShowCsvModal] = useState(false);
  const [showSmsModal, setShowSmsModal] = useState(false);
  const [editingTx, setEditingTx] = useState<Transaction | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterCategory, setFilterCategory] = useState<string>('all');
  const [filterType, setFilterType] = useState<string>('all');

  // Form state
  const [formAmount, setFormAmount] = useState('');
  const [formDesc, setFormDesc] = useState('');
  const [formDate, setFormDate] = useState(new Date().toISOString().split('T')[0]);
  const [formCategory, setFormCategory] = useState<ExpenseCategory>('Other');
  const [formMethod, setFormMethod] = useState<'upi' | 'cash' | 'card'>('upi');
  const [formType, setFormType] = useState<'debit' | 'credit'>('debit');
  const [formNotes, setFormNotes] = useState('');

  // SMS Import
  const [smsText, setSmsText] = useState('');
  const [parsedSms, setParsedSms] = useState<Partial<Transaction>[]>([]);

  // CSV Import
  const [csvData, setCsvData] = useState<string[][]>([]);
  const [csvHeaders, setCsvHeaders] = useState<string[]>([]);

  const filteredTx = useMemo(() => {
    return transactions.filter(t => {
      if (searchQuery && !t.description.toLowerCase().includes(searchQuery.toLowerCase())) return false;
      if (filterCategory !== 'all' && t.category !== filterCategory) return false;
      if (filterType !== 'all' && t.type !== filterType) return false;
      return true;
    });
  }, [transactions, searchQuery, filterCategory, filterType]);

  const categoryStats = useMemo(() => {
    const map = new Map<string, number>();
    transactions.filter(t => t.type === 'debit').forEach(t => {
      map.set(t.category, (map.get(t.category) || 0) + t.amount);
    });
    return Array.from(map.entries())
      .map(([name, amount]) => ({ name: name.length > 12 ? name.slice(0, 12) + '…' : name, amount, fullName: name }))
      .sort((a, b) => b.amount - a.amount)
      .slice(0, 8);
  }, [transactions]);

  const totalExpenses = useMemo(() =>
    transactions.filter(t => t.type === 'debit').reduce((s, t) => s + t.amount, 0),
    [transactions]
  );

  const resetForm = () => {
    setFormAmount(''); setFormDesc(''); setFormDate(new Date().toISOString().split('T')[0]);
    setFormCategory('Other'); setFormMethod('upi'); setFormType('debit'); setFormNotes('');
  };

  const handleSave = () => {
    const amount = parseFloat(formAmount);
    if (!amount || amount <= 0 || !formDesc.trim()) return;

    const autoCategory = formCategory === 'Other' ? categorizeTransaction(formDesc) : formCategory;

    if (editingTx) {
      dispatch({
        type: 'UPDATE_TRANSACTION',
        payload: {
          id: editingTx.id,
          updates: {
            amount, description: formDesc.trim(), date: formDate,
            category: autoCategory, paymentMethod: formMethod, type: formType, notes: formNotes,
          },
        },
      });
      setEditingTx(null);
    } else {
      const tx: Transaction = {
        id: genId(), amount, description: formDesc.trim(), date: formDate,
        category: autoCategory, paymentMethod: formMethod, type: formType,
        notes: formNotes, source: 'manual', createdAt: new Date().toISOString(),
      };
      dispatch({ type: 'ADD_TRANSACTION', payload: tx });
    }
    resetForm();
    setShowAddModal(false);
  };

  const handleEdit = (tx: Transaction) => {
    setEditingTx(tx);
    setFormAmount(tx.amount.toString());
    setFormDesc(tx.description);
    setFormDate(tx.date);
    setFormCategory(tx.category);
    setFormMethod(tx.paymentMethod as 'upi' | 'cash' | 'card');
    setFormType(tx.type);
    setFormNotes(tx.notes || '');
    setShowAddModal(true);
  };

  const handleDelete = (id: string) => {
    dispatch({ type: 'DELETE_TRANSACTION', payload: id });
  };

  // SMS Parsing
  const parseSms = () => {
    if (!smsText.trim()) return;
    const lines = smsText.split('\n').filter(l => l.trim());
    const parsed: Partial<Transaction>[] = [];

    for (const line of lines) {
      const amountMatch = line.match(/(?:INR|Rs\.?|₹)\s*([\d,]+\.?\d*)/i) ||
        line.match(/([\d,]+\.?\d*)\s*(?:debited|credited|paid|received)/i);

      if (amountMatch) {
        const amount = parseFloat(amountMatch[1].replace(/,/g, ''));
        const isCredit = /credited|received|refund/i.test(line);
        const merchantMatch = line.match(/(?:at|to|from)\s+([A-Z][A-Za-z0-9\s]+?)(?:\s+on|\s+ref|\.|$)/);
        const dateMatch = line.match(/(\d{2}[-/]\d{2}[-/]\d{2,4})/);

        parsed.push({
          amount,
          type: isCredit ? 'credit' : 'debit',
          description: merchantMatch ? merchantMatch[1].trim() : 'Parsed transaction',
          date: dateMatch ? dateMatch[1] : new Date().toISOString().split('T')[0],
          category: merchantMatch ? categorizeTransaction(merchantMatch[1]) : 'Other',
        });
      }
    }

    setParsedSms(parsed);
  };

  const importParsedSms = () => {
    const txs: Transaction[] = parsedSms.map(p => ({
      id: genId(),
      amount: p.amount || 0,
      description: p.description || 'SMS Import',
      type: p.type || 'debit',
      date: p.date || new Date().toISOString().split('T')[0],
      category: (p.category as ExpenseCategory) || 'Other',
      paymentMethod: 'upi' as const,
      source: 'sms' as const,
      createdAt: new Date().toISOString(),
    }));
    dispatch({ type: 'IMPORT_TRANSACTIONS', payload: txs });
    setParsedSms([]);
    setSmsText('');
    setShowSmsModal(false);
  };

  // CSV handling
  const handleCsvFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (ev) => {
      const text = ev.target?.result as string;
      const rows = text.split('\n').map(r => r.split(',').map(c => c.trim().replace(/^"|"$/g, '')));
      if (rows.length > 1) {
        setCsvHeaders(rows[0]);
        setCsvData(rows.slice(1).filter(r => r.some(c => c)));
      }
    };
    reader.readAsText(file);
  };

  const importCsv = () => {
    const dateIdx = csvHeaders.findIndex(h => /date/i.test(h));
    const descIdx = csvHeaders.findIndex(h => /desc|narr|detail|merchant/i.test(h));
    const amountIdx = csvHeaders.findIndex(h => /amount|value|sum/i.test(h));
    const catIdx = csvHeaders.findIndex(h => /cat/i.test(h));

    const txs: Transaction[] = csvData.map(row => {
      const amount = Math.abs(parseFloat((row[amountIdx] || '0').replace(/[₹,]/g, '')));
      const desc = row[descIdx] || 'CSV Import';
      return {
        id: genId(),
        amount,
        description: desc,
        type: 'debit' as const,
        date: row[dateIdx] || new Date().toISOString().split('T')[0],
        category: (row[catIdx] as ExpenseCategory) || categorizeTransaction(desc),
        paymentMethod: 'other' as const,
        source: 'csv' as const,
        createdAt: new Date().toISOString(),
      };
    }).filter(t => t.amount > 0);

    dispatch({ type: 'IMPORT_TRANSACTIONS', payload: txs });
    setCsvData([]);
    setCsvHeaders([]);
    setShowCsvModal(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Expenses</h1>
          <p className="text-muted text-sm mt-1">Track, categorize, and analyze your spending.</p>
        </div>
        <div className="flex gap-2">
          <button onClick={() => setShowSmsModal(true)} className="btn btn-secondary btn-sm">
            <MessageSquare size={14} /> Paste SMS
          </button>
          <button onClick={() => setShowCsvModal(true)} className="btn btn-secondary btn-sm">
            <Upload size={14} /> Import CSV
          </button>
          <button onClick={() => { resetForm(); setEditingTx(null); setShowAddModal(true); }} className="btn btn-primary btn-sm">
            <Plus size={14} /> Add
          </button>
        </div>
      </div>

      {/* Category Chart */}
      {categoryStats.length > 0 && (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="card">
          <h3 className="font-semibold mb-4">Spending by Category</h3>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={categoryStats} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(168,160,186,0.1)" />
              <XAxis type="number" tick={{ fontSize: 11 }} tickFormatter={v => `₹${(v / 1000).toFixed(0)}K`} />
              <YAxis type="category" dataKey="name" tick={{ fontSize: 11 }} width={100} />
              <Tooltip formatter={(v: any) => formatINR(Number(v) || 0)} contentStyle={{ background: 'var(--color-surface-2)', border: '1px solid var(--color-border)', borderRadius: '8px', fontSize: '12px' }} />
              <Bar dataKey="amount" fill="#8B5CF6" radius={[0, 6, 6, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </motion.div>
      )}

      {/* Filters */}
      <div className="flex flex-wrap gap-3">
        <div className="flex-1 min-w-[200px] relative">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted" />
          <input
            className="input pl-9"
            placeholder="Search transactions..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <select className="select w-auto min-w-[150px]" value={filterCategory} onChange={(e) => setFilterCategory(e.target.value)}>
          <option value="all">All Categories</option>
          {EXPENSE_CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
        </select>
        <select className="select w-auto" value={filterType} onChange={(e) => setFilterType(e.target.value)}>
          <option value="all">All Types</option>
          <option value="debit">Expenses</option>
          <option value="credit">Income</option>
        </select>
      </div>

      {/* Transaction List */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="card">
        <div className="flex justify-between items-center mb-4">
          <h3 className="font-semibold">Transactions ({filteredTx.length})</h3>
          <p className="text-sm text-muted">Total expenses: <span className="font-bold text-error">{formatINR(totalExpenses)}</span></p>
        </div>

        {filteredTx.length > 0 ? (
          <div className="space-y-1">
            {filteredTx.map((tx) => {
              const lh = tx.type === 'debit' ? amountToLifeHours(tx.amount, lifeHoursConfig) : null;
              return (
                <div key={tx.id} className="flex items-center gap-3 p-3 rounded-xl hover:bg-surface-2/50 transition-colors group">
                  <div className={`w-2 h-2 rounded-full flex-shrink-0 ${tx.type === 'credit' ? 'bg-positive' : 'bg-error'}`} />
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-sm truncate">{tx.description}</p>
                    <div className="flex items-center gap-2 mt-0.5">
                      <span className="badge badge-muted text-[10px]">{tx.category}</span>
                      <span className="text-[10px] text-muted">{new Date(tx.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}</span>
                      {lh && lh.totalHours > 0 && (
                        <span className="text-[10px] text-violet-bright">⏱ {lh.formattedShort}</span>
                      )}
                    </div>
                  </div>
                  <p className={`font-semibold tabular-nums text-sm ${tx.type === 'credit' ? 'text-positive' : 'text-error'}`}>
                    {tx.type === 'credit' ? '+' : '-'}{formatINR(tx.amount)}
                  </p>
                  <div className="opacity-0 group-hover:opacity-100 flex gap-1 transition-opacity">
                    <button onClick={() => handleEdit(tx)} className="btn btn-ghost btn-icon btn-sm"><Edit3 size={14} /></button>
                    <button onClick={() => handleDelete(tx.id)} className="btn btn-ghost btn-icon btn-sm text-error"><Trash2 size={14} /></button>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="empty-state py-8">
            <p className="text-sm">No transactions found.</p>
            <button onClick={() => { resetForm(); setShowAddModal(true); }} className="btn btn-primary btn-sm mt-3">
              <Plus size={14} /> Add your first expense
            </button>
          </div>
        )}
      </motion.div>

      {/* Add/Edit Modal */}
      <AnimatePresence>
        {showAddModal && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="modal-overlay" onClick={() => setShowAddModal(false)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }}
              className="modal-content" onClick={(e) => e.stopPropagation()}
            >
              <div className="flex justify-between items-center mb-4">
                <h3 className="font-semibold text-lg">{editingTx ? 'Edit Transaction' : 'Add Transaction'}</h3>
                <button onClick={() => setShowAddModal(false)} className="btn btn-ghost btn-icon"><X size={18} /></button>
              </div>

              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-3">
                  <div className="col-span-2">
                    <label className="label">Description</label>
                    <input className="input" placeholder="e.g. Swiggy order" value={formDesc} onChange={(e) => {
                      setFormDesc(e.target.value);
                      if (formCategory === 'Other') setFormCategory(categorizeTransaction(e.target.value));
                    }} />
                  </div>
                  <div>
                    <label className="label">Amount (₹)</label>
                    <input type="number" className="input" placeholder="0" value={formAmount} onChange={(e) => setFormAmount(e.target.value)} min="0" />
                  </div>
                  <div>
                    <label className="label">Type</label>
                    <select className="select" value={formType} onChange={(e) => setFormType(e.target.value as 'debit' | 'credit')}>
                      <option value="debit">Expense</option>
                      <option value="credit">Income</option>
                    </select>
                  </div>
                  <div>
                    <label className="label">Date</label>
                    <input type="date" className="input" value={formDate} onChange={(e) => setFormDate(e.target.value)} />
                  </div>
                  <div>
                    <label className="label">Category</label>
                    <select className="select" value={formCategory} onChange={(e) => setFormCategory(e.target.value as ExpenseCategory)}>
                      {EXPENSE_CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="label">Payment Method</label>
                    <select className="select" value={formMethod} onChange={(e) => setFormMethod(e.target.value as 'upi' | 'cash' | 'card')}>
                      <option value="upi">UPI</option>
                      <option value="cash">Cash</option>
                      <option value="card">Card</option>
                    </select>
                  </div>
                  <div>
                    <label className="label">Notes (optional)</label>
                    <input className="input" placeholder="Any notes..." value={formNotes} onChange={(e) => setFormNotes(e.target.value)} />
                  </div>
                </div>

                {formAmount && parseFloat(formAmount) > 0 && formType === 'debit' && (
                  <div className="p-3 rounded-xl bg-violet/10 border border-violet/20 text-sm">
                    ⏱ This costs <span className="font-bold text-violet-bright">
                      {amountToLifeHours(parseFloat(formAmount), lifeHoursConfig).formatted}
                    </span> of work
                  </div>
                )}

                <button onClick={handleSave} className="btn btn-primary w-full">
                  {editingTx ? 'Save Changes' : 'Add Transaction'}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* SMS Import Modal */}
      <AnimatePresence>
        {showSmsModal && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="modal-overlay" onClick={() => setShowSmsModal(false)}>
            <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }} className="modal-content" onClick={(e) => e.stopPropagation()}>
              <div className="flex justify-between items-center mb-4">
                <h3 className="font-semibold text-lg">Import from SMS</h3>
                <button onClick={() => setShowSmsModal(false)} className="btn btn-ghost btn-icon"><X size={18} /></button>
              </div>
              <p className="text-sm text-muted mb-3">Paste bank/UPI transaction messages below. Each message on a new line.</p>
              <textarea
                className="textarea"
                rows={5}
                placeholder="INR 450.00 debited from A/c XXXX1234 at SWIGGY on 25-10-2026..."
                value={smsText}
                onChange={(e) => setSmsText(e.target.value)}
              />
              <button onClick={parseSms} className="btn btn-secondary w-full mt-3">Parse Messages</button>

              {parsedSms.length > 0 && (
                <div className="mt-4 space-y-2">
                  <p className="text-sm font-medium">Found {parsedSms.length} transaction(s):</p>
                  {parsedSms.map((p, i) => (
                    <div key={i} className="p-2 rounded-lg border border-border text-sm flex justify-between">
                      <span className="truncate">{p.description}</span>
                      <span className={`font-medium ${p.type === 'credit' ? 'text-positive' : 'text-error'}`}>
                        {p.type === 'credit' ? '+' : '-'}₹{p.amount}
                      </span>
                    </div>
                  ))}
                  <button onClick={importParsedSms} className="btn btn-primary w-full mt-2">Import All</button>
                </div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* CSV Import Modal */}
      <AnimatePresence>
        {showCsvModal && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="modal-overlay" onClick={() => setShowCsvModal(false)}>
            <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }} className="modal-content" onClick={(e) => e.stopPropagation()}>
              <div className="flex justify-between items-center mb-4">
                <h3 className="font-semibold text-lg">Import CSV</h3>
                <button onClick={() => setShowCsvModal(false)} className="btn btn-ghost btn-icon"><X size={18} /></button>
              </div>
              <p className="text-sm text-muted mb-3">Upload a CSV file with columns: Date, Description, Amount.</p>
              <input type="file" accept=".csv" onChange={handleCsvFile} className="input" />

              {csvData.length > 0 && (
                <div className="mt-4">
                  <p className="text-sm font-medium mb-2">Preview ({csvData.length} rows):</p>
                  <div className="max-h-48 overflow-y-auto border border-border rounded-lg">
                    <table className="w-full text-xs">
                      <thead>
                        <tr className="border-b border-border">
                          {csvHeaders.map((h, i) => <th key={i} className="p-2 text-left text-muted">{h}</th>)}
                        </tr>
                      </thead>
                      <tbody>
                        {csvData.slice(0, 10).map((row, i) => (
                          <tr key={i} className="border-b border-border/50">
                            {row.map((cell, j) => <td key={j} className="p-2 truncate max-w-[120px]">{cell}</td>)}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                  <button onClick={importCsv} className="btn btn-primary w-full mt-3">Import {csvData.length} Transactions</button>
                </div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
