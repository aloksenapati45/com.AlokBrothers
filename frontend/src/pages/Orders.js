import React, { useState, useEffect } from 'react';
import './pages.css';

const initOrders = [
  { id:'ORD-001', customer:'Ravi Seafoods',     phone:'9876543210', fish:'Rohu (Roho)', qty:120, rate:52, amount:6240,  status:'Delivered',  payStatus:'Paid',    date:'2026-07-14', delivery:'Wholesale', note:'' },
  { id:'ORD-002', customer:'Delhi Fish Mart',   phone:'9123456780', fish:'Katla',       qty:80,  rate:58, amount:4640,  status:'Processing', payStatus:'Paid',    date:'2026-07-14', delivery:'Retail',    note:'Urgent' },
  { id:'ORD-003', customer:'Sharma Traders',    phone:'9988776655', fish:'Tilapia',     qty:200, rate:36, amount:7200,  status:'Pending',    payStatus:'Pending', date:'2026-07-15', delivery:'Wholesale', note:'' },
  { id:'ORD-004', customer:'Mumbai Exports',    phone:'9001122334', fish:'Salmon',      qty:50,  rate:260,amount:13000, status:'Shipped',    payStatus:'Paid',    date:'2026-07-15', delivery:'Export',    note:'Cold chain required' },
  { id:'ORD-005', customer:'Kolkata Fish Hub',  phone:'9334455667', fish:'Hilsa',       qty:30,  rate:320,amount:9600,  status:'Delivered',  payStatus:'Paid',    date:'2026-07-13', delivery:'Retail',    note:'' },
  { id:'ORD-006', customer:'Chennai Sea Food',  phone:'9445566778', fish:'Mackerel',    qty:150, rate:66, amount:9900,  status:'Cancelled',  payStatus:'Refunded',date:'2026-07-12', delivery:'Wholesale', note:'Customer cancelled' },
  { id:'ORD-007', customer:'Hyderabad Catch',   phone:'9556677889', fish:'Catfish',     qty:90,  rate:46, amount:4140,  status:'Pending',    payStatus:'Pending', date:'2026-07-15', delivery:'Retail',    note:'' },
  { id:'ORD-008', customer:'Pune Fresh Fish',   phone:'9667788990', fish:'Carp',        qty:300, rate:43, amount:12900, status:'Processing', payStatus:'Partial', date:'2026-07-14', delivery:'Wholesale', note:'50% advance paid' },
];

const statusMap  = { Delivered:'badge-green', Processing:'badge-blue', Pending:'badge-yellow', Shipped:'badge-purple', Cancelled:'badge-red' };
const payMap     = { Paid:'badge-green', Pending:'badge-yellow', Partial:'badge-orange', Refunded:'badge-gray' };
const allStatus  = ['All','Pending','Processing','Shipped','Delivered','Cancelled'];
const allPay     = ['All','Paid','Pending','Partial','Refunded'];
const allDeliv   = ['All','Wholesale','Retail','Export'];

const emptyOrder = { customer:'', phone:'', fish:'', qty:'', rate:'', status:'Pending', payStatus:'Pending', delivery:'Retail', date:'', note:'' };

export default function Orders() {
  const [orders, setOrders]     = useState(initOrders);
  const [customersList, setCustomersList] = useState([]);
  const [fishList, setFishList] = useState([]);
  const [search, setSearch]     = useState('');
  const [stFilter, setStFilter] = useState('All');
  const [payFilter, setPay]     = useState('All');
  const [modal, setModal]       = useState(false);
  const [editing, setEditing]   = useState(null);
  const [form, setForm]         = useState(emptyOrder);
  const [detail, setDetail]     = useState(null);

  const filtered = orders.filter(o =>
    (stFilter==='All' || o.status===stFilter) &&
    (payFilter==='All' || o.payStatus===payFilter) &&
    (o.customer.toLowerCase().includes(search.toLowerCase()) || o.fish.toLowerCase().includes(search.toLowerCase()) || o.id.includes(search))
  );

  useEffect(() => {
    fetch('http://localhost:8080/api/orders')
      .then(res => res.json())
      .then(data => setOrders(data))
      .catch(err => console.error(err));

    fetch('http://localhost:8080/api/customers')
      .then(res => res.json())
      .then(data => setCustomersList(data))
      .catch(err => console.error(err));

    fetch('http://localhost:8080/api/fish')
      .then(res => res.json())
      .then(data => setFishList(data))
      .catch(err => console.error(err));
  }, []);

  const openAdd  = () => { setEditing(null); setForm({...emptyOrder, date:new Date().toISOString().slice(0,10)}); setModal(true); };
  const openEdit = o  => { setEditing(o.id); setForm({...o}); setModal(true); };
  const save = () => {
    const amt = Number(form.qty)*Number(form.rate);
    const payload = { ...form, amount: amt };
    if (!editing) delete payload.id;

    fetch(`http://localhost:8080/api/orders${editing ? `/${editing}` : ''}`, {
      method: editing ? 'PUT' : 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    })
    .then(res => res.json())
    .then(saved => {
      if(editing) setOrders(orders.map(o=>o.id===editing?saved:o));
      else setOrders([...orders, saved]);
      setModal(false);
    })
    .catch(err => console.error(err));
  };

  const del = id => {
    fetch(`http://localhost:8080/api/orders/${id}`, { method: 'DELETE' })
      .then(() => setOrders(orders.filter(o=>o.id!==id)))
      .catch(err => console.error(err));
  };
  const updateStatus = (id, status) => {
    const order = orders.find(o => o.id === id);
    if(order) {
      fetch(`http://localhost:8080/api/orders/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({...order, status})
      })
      .then(res => res.json())
      .then(saved => setOrders(orders.map(o=>o.id===id?saved:o)))
      .catch(err => console.error(err));
    }
  };

  const totalRev   = orders.filter(o=>o.payStatus==='Paid').reduce((a,o)=>a+o.amount,0);
  const pending    = orders.filter(o=>o.status==='Pending').length;
  const processing = orders.filter(o=>o.status==='Processing').length;
  const delivered  = orders.filter(o=>o.status==='Delivered').length;

  return (
    <div className="page-wrapper">
      <div className="page-header">
        <div>
          <h1 className="page-title">🛒 Orders Management</h1>
          <p className="page-subtitle">Track, manage and update all fish orders</p>
        </div>
        <button className="btn-primary" onClick={openAdd}>+ New Order</button>
      </div>

      {/* Stats */}
      <div className="stats-grid">
        {[
          {icon:'📋',label:'Total Orders',  value:orders.length,              bg:'#dbeafe'},
          {icon:'⏳',label:'Pending',        value:pending,                    bg:'#fef9c3'},
          {icon:'⚙️',label:'Processing',    value:processing,                  bg:'#e0f2fe'},
          {icon:'✅',label:'Delivered',      value:delivered,                   bg:'#dcfce7'},
          {icon:'💰',label:'Revenue (Paid)', value:`₹${totalRev.toLocaleString()}`, bg:'#f3e8ff'},
        ].map(s=>(
          <div className="stat-card" key={s.label}>
            <div className="stat-card-icon" style={{background:s.bg}}>{s.icon}</div>
            <div className="stat-card-label">{s.label}</div>
            <div className="stat-card-value" style={{fontSize:'1.4rem'}}>{s.value}</div>
          </div>
        ))}
      </div>

      <div className="glass-card">
        <div className="filter-bar">
          <input className="search-input" placeholder="🔍 Search order, customer, fish…" value={search} onChange={e=>setSearch(e.target.value)} />
          <select className="filter-select" value={stFilter} onChange={e=>setStFilter(e.target.value)}>
            {allStatus.map(s=><option key={s}>{s}</option>)}
          </select>
          <select className="filter-select" value={payFilter} onChange={e=>setPay(e.target.value)}>
            {allPay.map(s=><option key={s}>{s}</option>)}
          </select>
        </div>

        <div className="data-table-wrapper">
          <table className="data-table">
            <thead>
              <tr>
                <th>Order ID</th><th>Customer</th><th>Fish</th><th>Qty</th>
                <th>Rate</th><th>Amount</th><th>Order Status</th><th>Payment</th>
                <th>Delivery</th><th>Date</th><th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(o=>(
                <tr key={o.id}>
                  <td><strong style={{color:'#00246b',cursor:'pointer'}} onClick={()=>setDetail(o)}>ORD-{String(o.id).padStart(3,'0')}</strong></td>
                  <td>{o.customer}</td>
                  <td>🐟 {o.fish}</td>
                  <td>{o.qty} kg</td>
                  <td>₹{o.rate}</td>
                  <td><strong>₹{o.amount.toLocaleString()}</strong></td>
                  <td>
                    <select value={o.status} className="filter-select" style={{padding:'4px 8px',fontSize:'0.78rem'}}
                      onChange={e=>updateStatus(o.id,e.target.value)}>
                      {['Pending','Processing','Shipped','Delivered','Cancelled'].map(s=><option key={s}>{s}</option>)}
                    </select>
                  </td>
                  <td><span className={`badge ${payMap[o.payStatus]}`}>{o.payStatus}</span></td>
                  <td><span className="badge badge-blue">{o.delivery}</span></td>
                  <td style={{fontSize:'0.8rem',color:'#64748b'}}>{o.date}</td>
                  <td style={{display:'flex',gap:6}}>
                    <button className="btn-edit" onClick={()=>openEdit(o)}>Edit</button>
                    <button className="btn-danger" onClick={()=>del(o.id)}>Del</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add/Edit Modal */}
      {modal && (
        <div className="modal-overlay" onClick={()=>setModal(false)}>
          <div className="modal-box" onClick={e=>e.stopPropagation()}>
            <div className="modal-header">
              <h2 className="modal-title">{editing?'Edit Order':'New Order'}</h2>
              <button className="modal-close" onClick={()=>setModal(false)}>×</button>
            </div>
            <div className="form-grid">
              <div className="form-group">
                <label>Customer Name</label>
                <select value={form.customer||''} onChange={e => {
                  const selectedName = e.target.value;
                  const selectedCust = customersList.find(c => c.fullName === selectedName);
                  setForm({...form, customer: selectedName, phone: selectedCust ? selectedCust.mobileNumber : form.phone});
                }}>
                  <option value="">Select a Customer</option>
                  {customersList.map(c => <option key={c.id} value={c.fullName}>{c.fullName} ({c.businessName})</option>)}
                </select>
              </div>
              <div className="form-group">
                <label>Fish Species</label>
                <select value={form.fish||''} onChange={e => {
                  const selectedFishName = e.target.value;
                  const selectedFish = fishList.find(f => f.name === selectedFishName);
                  setForm({...form, fish: selectedFishName, rate: selectedFish ? selectedFish.sellPrice : form.rate});
                }}>
                  <option value="">Select a Fish Species</option>
                  {fishList.map(f => <option key={f.id} value={f.name}>{f.name} (Available: {f.qty} {f.unit})</option>)}
                </select>
              </div>
              {[['phone','Phone','text'],
                ['qty','Quantity (kg)','number'],['rate','Rate ₹/kg','number'],['date','Order Date','date']].map(([k,lbl,type])=>(
                <div className="form-group" key={k}>
                  <label>{lbl}</label>
                  <input type={type} value={form[k]||''} onChange={e=>setForm({...form,[k]:e.target.value})} />
                </div>
              ))}
              {[['status','Order Status',['Pending','Processing','Shipped','Delivered','Cancelled']],
                ['payStatus','Payment',['Paid','Pending','Partial','Refunded']],
                ['delivery','Delivery Type',['Wholesale','Retail','Export']]].map(([k,lbl,opts])=>(
                <div className="form-group" key={k}>
                  <label>{lbl}</label>
                  <select value={form[k]||''} onChange={e=>setForm({...form,[k]:e.target.value})}>
                    {opts.map(o=><option key={o}>{o}</option>)}
                  </select>
                </div>
              ))}
              <div className="form-group full">
                <label>Notes</label>
                <textarea rows={2} value={form.note||''} onChange={e=>setForm({...form,note:e.target.value})} />
              </div>
            </div>
            <div className="modal-actions">
              <button className="btn-secondary" onClick={()=>setModal(false)}>Cancel</button>
              <button className="btn-primary" onClick={save}>{editing?'Update Order':'Create Order'}</button>
            </div>
          </div>
        </div>
      )}

      {/* Detail Modal */}
      {detail && (
        <div className="modal-overlay" onClick={()=>setDetail(null)}>
          <div className="modal-box" onClick={e=>e.stopPropagation()}>
            <div className="modal-header">
              <h2 className="modal-title">Order Detail — ORD-{String(detail.id).padStart(3,'0')}</h2>
              <button className="modal-close" onClick={()=>setDetail(null)}>×</button>
            </div>
            <div style={{display:'flex',flexDirection:'column',gap:12}}>
              {[['Customer',detail.customer],['Phone',detail.phone],['Fish',`🐟 ${detail.fish}`],
                ['Quantity',`${detail.qty} kg`],['Rate',`₹${detail.rate}/kg`],['Total',`₹${detail.amount.toLocaleString()}`],
                ['Order Status',<span className={`badge ${statusMap[detail.status]}`}>{detail.status}</span>],
                ['Payment',<span className={`badge ${payMap[detail.payStatus]}`}>{detail.payStatus}</span>],
                ['Delivery',detail.delivery],['Date',detail.date],
                ...(detail.note?[['Notes',detail.note]]:[])
              ].map(([k,v])=>(
                <div key={k} style={{display:'flex',justifyContent:'space-between',borderBottom:'1px solid #f1f5f9',paddingBottom:8}}>
                  <span style={{fontWeight:700,color:'#64748b',fontSize:'0.85rem'}}>{k}</span>
                  <span style={{fontWeight:600,color:'#0a1628',fontSize:'0.9rem'}}>{v}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
