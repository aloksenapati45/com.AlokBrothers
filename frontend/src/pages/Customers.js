import React, { useState, useEffect } from 'react';
import './pages.css';

const initCustomers = [
  { id:1, name:'Ravi Seafoods',    contact:'Ravi Kumar',  phone:'9876543210', email:'ravi@seafoods.in',    city:'Delhi',     type:'Wholesaler',  totalOrders:24, totalSpent:148000, outstanding:0,     joinDate:'2025-01-10', status:'Active' },
  { id:2, name:'Delhi Fish Mart',  contact:'Anil Gupta',  phone:'9123456780', email:'anil@dfmart.in',      city:'Delhi',     type:'Retailer',    totalOrders:18, totalSpent:72000,  outstanding:4640,  joinDate:'2025-03-15', status:'Active' },
  { id:3, name:'Sharma Traders',   contact:'Suresh Sharma',phone:'9988776655',email:'suresh@sharma.com',   city:'Jaipur',    type:'Wholesaler',  totalOrders:31, totalSpent:215000, outstanding:7200,  joinDate:'2024-11-05', status:'Active' },
  { id:4, name:'Mumbai Exports',   contact:'Priya Mehta', phone:'9001122334', email:'priya@mumbaiexp.com', city:'Mumbai',    type:'Exporter',    totalOrders:12, totalSpent:320000, outstanding:0,     joinDate:'2025-05-20', status:'Active' },
  { id:5, name:'Kolkata Fish Hub', contact:'Dev Bose',    phone:'9334455667', email:'dev@kfhub.in',        city:'Kolkata',   type:'Retailer',    totalOrders:9,  totalSpent:48000,  outstanding:0,     joinDate:'2026-01-08', status:'Active' },
  { id:6, name:'Chennai Sea Food', contact:'Ramesh Raja', phone:'9445566778', email:'ramesh@csf.in',       city:'Chennai',   type:'Wholesaler',  totalOrders:7,  totalSpent:28000,  outstanding:9900,  joinDate:'2026-02-14', status:'Inactive' },
  { id:7, name:'Hyderabad Catch',  contact:'Fatima Bi',   phone:'9556677889', email:'fatima@hydcatch.in',  city:'Hyderabad', type:'Retailer',    totalOrders:15, totalSpent:62000,  outstanding:4140,  joinDate:'2025-08-22', status:'Active' },
  { id:8, name:'Pune Fresh Fish',  contact:'Raj Patil',   phone:'9667788990', email:'raj@punefresh.com',   city:'Pune',      type:'Wholesaler',  totalOrders:20, totalSpent:125000, outstanding:12900, joinDate:'2025-06-01', status:'Active' },
];

const emptyC = { businessName:'', fullName:'', mobileNumber:'', email:'', homeAddress:'', customerType:'Retailer', outstanding:'0', status:'Active' };
const types  = ['All','Wholesaler','Retailer','Exporter'];

export default function Customers() {
  const [customers, setCustomers] = useState(initCustomers);
  const [search, setSearch]   = useState('');
  const [typeF, setTypeF]     = useState('All');
  const [statusF, setStatusF] = useState('All');
  const [modal, setModal]     = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm]       = useState(emptyC);
  const [detail, setDetail]   = useState(null);

  const filtered = customers.filter(c=>
    (typeF==='All'||c.customerType===typeF) &&
    (statusF==='All'||c.status===statusF) &&
    (c.businessName?.toLowerCase().includes(search.toLowerCase())||c.homeAddress?.toLowerCase().includes(search.toLowerCase())||c.fullName?.toLowerCase().includes(search.toLowerCase()))
  );

  useEffect(() => {
    fetch('http://localhost:8080/api/customers')
      .then(res => res.json())
      .then(data => setCustomers(data))
      .catch(err => console.error(err));
  }, []);

  const openAdd  = () => { setEditing(null); setForm(emptyC); setModal(true); };
  const openEdit = c  => { setEditing(c.id); setForm({...c}); setModal(true); };
  const save = () => {
    if(!form.businessName)return;
    const payload = editing ? { ...form } : {
      ...form,
      totalOrders: 0,
      totalSpent: 0,
      outstanding: Number(form.outstanding||0),
      joinDate: new Date().toISOString().slice(0,10)
    };
    if (!editing) delete payload.id;
    
    fetch(`http://localhost:8080/api/customers${editing ? `/${editing}` : ''}`, {
      method: editing ? 'PUT' : 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    })
    .then(res => res.json())
    .then(saved => {
      if(editing) setCustomers(customers.map(c=>c.id===editing?saved:c));
      else setCustomers([...customers, saved]);
      setModal(false);
    })
    .catch(err => console.error(err));
  };

  const del = id => {
    fetch(`http://localhost:8080/api/customers/${id}`, { method: 'DELETE' })
      .then(() => setCustomers(customers.filter(c=>c.id!==id)))
      .catch(err => console.error(err));
  };

  const totalSpent = customers.reduce((a,c)=>a+(c.totalSpent||0),0);
  const totalOutstanding = customers.reduce((a,c)=>a+(c.outstanding||0),0);
  const activeCount = customers.filter(c=>c.status==='Active').length;

  return (
    <div className="page-wrapper">
      <div className="page-header">
        <div>
          <h1 className="page-title">👥 Customers</h1>
          <p className="page-subtitle">Manage your fish buyers and client relationships</p>
        </div>
        <button className="btn-primary" onClick={openAdd}>+ Add Customer</button>
      </div>

      <div className="stats-grid">
        {[
          {icon:'👥',label:'Total Customers',  value:customers.length,             bg:'#dbeafe'},
          {icon:'✅',label:'Active',           value:activeCount,                  bg:'#dcfce7'},
          {icon:'💰',label:'Total Revenue',    value:`₹${totalSpent.toLocaleString()}`, bg:'#f3e8ff'},
          {icon:'⚠️',label:'Outstanding',      value:`₹${totalOutstanding.toLocaleString()}`, bg:'#fef9c3'},
        ].map(s=>(
          <div className="stat-card" key={s.label}>
            <div className="stat-card-icon" style={{background:s.bg}}>{s.icon}</div>
            <div className="stat-card-label">{s.label}</div>
            <div className="stat-card-value" style={{fontSize:'1.4rem'}}>{s.value}</div>
          </div>
        ))}
      </div>

      {totalOutstanding>0 && <div className="alert alert-warning">⚠️ Total outstanding balance: <strong>₹{totalOutstanding.toLocaleString()}</strong> — follow up with customers</div>}

      <div className="glass-card">
        <div className="filter-bar">
          <input className="search-input" placeholder="🔍 Search customer, city…" value={search} onChange={e=>setSearch(e.target.value)} />
          <select className="filter-select" value={typeF} onChange={e=>setTypeF(e.target.value)}>
            {types.map(t=><option key={t}>{t}</option>)}
          </select>
          <select className="filter-select" value={statusF} onChange={e=>setStatusF(e.target.value)}>
            {['All','Active','Inactive'].map(s=><option key={s}>{s}</option>)}
          </select>
        </div>
        <div className="data-table-wrapper">
          <table className="data-table">
            <thead>
              <tr>
                <th>Business Name</th><th>Contact Person</th><th>Phone</th><th>City</th>
                <th>Type</th><th>Orders</th><th>Total Spent</th><th>Outstanding</th><th>Status</th><th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(c=>(
                <tr key={c.id}>
                  <td><strong style={{color:'#00246b',cursor:'pointer'}} onClick={()=>setDetail(c)}>🏪 {c.businessName}</strong></td>
                  <td>{c.fullName}</td>
                  <td>{c.mobileNumber}</td>
                  <td>{c.homeAddress}</td>
                  <td><span className="badge badge-blue">{c.customerType}</span></td>
                  <td><strong>{c.totalOrders || 0}</strong></td>
                  <td><strong style={{color:'#15803d'}}>₹{(c.totalSpent||0).toLocaleString()}</strong></td>
                  <td><strong style={{color:(c.outstanding||0)>0?'#dc2626':'#15803d'}}>₹{(c.outstanding||0).toLocaleString()}</strong></td>
                  <td><span className={`badge ${c.status==='Active'?'badge-green':'badge-red'}`}>{c.status}</span></td>
                  <td style={{display:'flex',gap:6}}>
                    <button className="btn-edit" onClick={()=>openEdit(c)}>Edit</button>
                    <button className="btn-danger" onClick={()=>del(c.id)}>Del</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {modal && (
        <div className="modal-overlay" onClick={()=>setModal(false)}>
          <div className="modal-box" onClick={e=>e.stopPropagation()}>
            <div className="modal-header">
              <h2 className="modal-title">{editing?'Edit Customer':'Add Customer'}</h2>
              <button className="modal-close" onClick={()=>setModal(false)}>×</button>
            </div>
            <div className="form-grid">
              {[['businessName','Business Name','text'],['fullName','Contact Person','text'],['mobileNumber','Phone','text'],
                ['email','Email','email'],['homeAddress','City','text'],['outstanding','Outstanding ₹','number']].map(([k,lbl,type])=>(
                <div className="form-group" key={k}>
                  <label>{lbl}</label>
                  <input type={type} value={form[k]||''} onChange={e=>setForm({...form,[k]:e.target.value})} />
                </div>
              ))}
              {[['customerType','Customer Type',['Wholesaler','Retailer','Exporter']],
                ['status','Status',['Active','Inactive']]].map(([k,lbl,opts])=>(
                <div className="form-group" key={k}>
                  <label>{lbl}</label>
                  <select value={form[k]||''} onChange={e=>setForm({...form,[k]:e.target.value})}>
                    {opts.map(o=><option key={o}>{o}</option>)}
                  </select>
                </div>
              ))}
            </div>
            <div className="modal-actions">
              <button className="btn-secondary" onClick={()=>setModal(false)}>Cancel</button>
              <button className="btn-primary" onClick={save}>{editing?'Update':'Save'}</button>
            </div>
          </div>
        </div>
      )}

      {detail && (
        <div className="modal-overlay" onClick={()=>setDetail(null)}>
          <div className="modal-box" onClick={e=>e.stopPropagation()}>
            <div className="modal-header">
              <h2 className="modal-title">🏪 {detail.businessName}</h2>
              <button className="modal-close" onClick={()=>setDetail(null)}>×</button>
            </div>
            <div style={{display:'flex',flexDirection:'column',gap:12}}>
              {[['Contact',detail.fullName],['Phone',detail.mobileNumber],['Email',detail.email],
                ['City',detail.homeAddress],['Type',<span className="badge badge-blue">{detail.customerType}</span>],
                ['Total Orders',detail.totalOrders||0],['Total Spent',`₹${(detail.totalSpent||0).toLocaleString()}`],
                ['Outstanding',<strong style={{color:(detail.outstanding||0)>0?'#dc2626':'#15803d'}}>₹{(detail.outstanding||0).toLocaleString()}</strong>],
                ['Status',<span className={`badge ${detail.status==='Active'?'badge-green':'badge-red'}`}>{detail.status}</span>],
                ['Member Since',detail.joinDate]
              ].map(([k,v])=>(
                <div key={k} style={{display:'flex',justifyContent:'space-between',borderBottom:'1px solid #f1f5f9',paddingBottom:8}}>
                  <span style={{fontWeight:700,color:'#64748b',fontSize:'0.85rem'}}>{k}</span>
                  <span style={{fontWeight:600,color:'#0a1628'}}>{v}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
