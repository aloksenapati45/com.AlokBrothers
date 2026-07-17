import React, { useState, useEffect } from 'react';
import './pages.css';

const initSuppliers = [
  { id:1, name:'Ganga Fish Farm',     contact:'Ramesh Yadav',  phone:'9800011122', email:'ramesh@gangafarm.in',  city:'Patna',    state:'Bihar',       fishTypes:['Rohu','Catla'],       pricePer:'₹40–52/kg',  minOrder:100, reliability:95, payTerms:'Net 15', status:'Active',  lastPurchase:'2026-07-14', totalPurchased:520000 },
  { id:2, name:'Bihar Fish Co.',      contact:'Vinod Singh',   phone:'9811122233', email:'vinod@biharfish.com',  city:'Bhagalpur',state:'Bihar',       fishTypes:['Katla','Rohu'],        pricePer:'₹45–58/kg',  minOrder:80,  reliability:90, payTerms:'Net 7',  status:'Active',  lastPurchase:'2026-07-14', totalPurchased:380000 },
  { id:3, name:'AP Aqua Farms',       contact:'Subbaiah Reddy',phone:'9822233344', email:'reddy@apaqua.in',      city:'Vijayawada',state:'Andhra Pradesh',fishTypes:['Tilapia','Carp'],   pricePer:'₹28–38/kg',  minOrder:200, reliability:88, payTerms:'Advance',status:'Active',  lastPurchase:'2026-07-13', totalPurchased:245000 },
  { id:4, name:'Nordic Fish Exports', contact:'Erik Hansen',   phone:'9833344455', email:'erik@nordic.fish',     city:'Mumbai',   state:'Maharashtra', fishTypes:['Salmon','Trout'],      pricePer:'₹210–260/kg',minOrder:25,  reliability:98, payTerms:'Net 30', status:'Active',  lastPurchase:'2026-07-15', totalPurchased:960000 },
  { id:5, name:'Bengal Hilsa Co.',    contact:'Tapas Ghosh',   phone:'9844455566', email:'tapas@bengalhilsa.in', city:'Kolkata',  state:'West Bengal', fishTypes:['Hilsa'],               pricePer:'₹260–330/kg',minOrder:20,  reliability:92, payTerms:'Net 15', status:'Active',  lastPurchase:'2026-07-15', totalPurchased:720000 },
  { id:6, name:'Goa Sea Catch',       contact:'Francis Dsouza',phone:'9855566677', email:'francis@goasea.in',    city:'Panaji',   state:'Goa',         fishTypes:['Pomfret','Mackerel'],  pricePer:'₹250–300/kg',minOrder:30,  reliability:85, payTerms:'Net 15', status:'Active',  lastPurchase:'2026-07-12', totalPurchased:180000 },
  { id:7, name:'MP Fish Farms',       contact:'Harish Mishra', phone:'9866677788', email:'harish@mpfish.in',     city:'Bhopal',   state:'Madhya Pradesh',fishTypes:['Catfish','Carp'],   pricePer:'₹32–46/kg',  minOrder:150, reliability:80, payTerms:'Advance',status:'Inactive',lastPurchase:'2026-06-20', totalPurchased:95000  },
  { id:8, name:'Kerala Catch Co.',    contact:'Thomas Nair',   phone:'9877788899', email:'thomas@keralacatch.in',city:'Kochi',    state:'Kerala',      fishTypes:['Sardine','Mackerel','Pomfret'],pricePer:'₹22–66/kg',minOrder:100,reliability:93,payTerms:'Net 7', status:'Active',  lastPurchase:'2026-07-10', totalPurchased:310000 },
  { id:9, name:'UP Fish Corp',        contact:'Akhilesh Gupta',phone:'9888899000', email:'akhil@upfish.in',      city:'Lucknow',  state:'Uttar Pradesh',fishTypes:['Carp','Rohu','Catla'],pricePer:'₹33–50/kg',  minOrder:120, reliability:87, payTerms:'Net 7',  status:'Active',  lastPurchase:'2026-07-14', totalPurchased:430000 },
];

const emptyS = {name:'',contact:'',phone:'',email:'',city:'',state:'',fishTypes:'',pricePer:'',minOrder:'',payTerms:'Net 15',status:'Active'};

export default function Suppliers() {
  const [suppliers, setSuppliers] = useState(initSuppliers);
  const [search, setSearch]     = useState('');
  const [stateF, setStateF]     = useState('All');
  const [statusF, setStatusF]   = useState('All');
  const [modal, setModal]       = useState(false);
  const [editing, setEditing]   = useState(null);
  const [form, setForm]         = useState(emptyS);
  const [detail, setDetail]     = useState(null);

  const states = ['All', ...new Set(suppliers.map(s=>s.state))];
  const filtered = suppliers.filter(s=>
    (stateF==='All'||s.state===stateF) &&
    (statusF==='All'||s.status===statusF) &&
    (s.name.toLowerCase().includes(search.toLowerCase())||s.city.toLowerCase().includes(search.toLowerCase())||s.contact.toLowerCase().includes(search.toLowerCase()))
  );

  useEffect(() => {
    fetch('http://localhost:8080/api/suppliers')
      .then(res => res.json())
      .then(data => setSuppliers(data))
      .catch(err => console.error(err));
  }, []);

  const openAdd  = () => { setEditing(null); setForm(emptyS); setModal(true); };
  const openEdit = s  => { setEditing(s.id); setForm({...s, fishTypes: Array.isArray(s.fishTypes)?s.fishTypes.join(', '):s.fishTypes}); setModal(true); };
  const save = () => {
    if(!form.name)return;
    const payload = editing ? { ...form, fishTypes: String(form.fishTypes).split(',').map(f=>f.trim()).join(', ') } : {
      ...form,
      fishTypes: String(form.fishTypes).split(',').map(f=>f.trim()).join(', '),
      reliability: 85,
      totalPurchased: 0,
      lastPurchase: '-'
    };
    if (!editing) delete payload.id;
    
    fetch(`http://localhost:8080/api/suppliers${editing ? `/${editing}` : ''}`, {
      method: editing ? 'PUT' : 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    })
    .then(res => res.json())
    .then(saved => {
      if(editing) setSuppliers(suppliers.map(s=>s.id===editing?saved:s));
      else setSuppliers([...suppliers, saved]);
      setModal(false);
    })
    .catch(err => console.error(err));
  };

  const del = id => {
    fetch(`http://localhost:8080/api/suppliers/${id}`, { method: 'DELETE' })
      .then(() => setSuppliers(suppliers.filter(s=>s.id!==id)))
      .catch(err => console.error(err));
  };

  const totalSpend  = suppliers.reduce((a,s)=>a+s.totalPurchased,0);
  const activeCount = suppliers.filter(s=>s.status==='Active').length;
  const avgRel      = Math.round(suppliers.reduce((a,s)=>a+s.reliability,0)/suppliers.length);

  return (
    <div className="page-wrapper">
      <div className="page-header">
        <div>
          <h1 className="page-title">🤝 Suppliers</h1>
          <p className="page-subtitle">Manage fish suppliers, purchase terms and reliability</p>
        </div>
        <button className="btn-primary" onClick={openAdd}>+ Add Supplier</button>
      </div>

      <div className="stats-grid">
        {[
          {icon:'🤝',label:'Total Suppliers', value:suppliers.length,           bg:'#dbeafe'},
          {icon:'✅',label:'Active',           value:activeCount,                bg:'#dcfce7'},
          {icon:'💰',label:'Total Purchased', value:`₹${(totalSpend/100000).toFixed(1)}L`, bg:'#f3e8ff'},
          {icon:'⭐',label:'Avg Reliability', value:`${avgRel}%`,               bg:'#fef9c3'},
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
          <input className="search-input" placeholder="🔍 Search supplier, city…" value={search} onChange={e=>setSearch(e.target.value)} />
          <select className="filter-select" value={stateF} onChange={e=>setStateF(e.target.value)}>
            {states.map(s=><option key={s}>{s}</option>)}
          </select>
          <select className="filter-select" value={statusF} onChange={e=>setStatusF(e.target.value)}>
            {['All','Active','Inactive'].map(s=><option key={s}>{s}</option>)}
          </select>
        </div>
        <div className="data-table-wrapper">
          <table className="data-table">
            <thead>
              <tr>
                <th>Supplier</th><th>Contact</th><th>Location</th><th>Fish Types</th>
                <th>Price Range</th><th>Min Order</th><th>Reliability</th><th>Pay Terms</th>
                <th>Total Purchased</th><th>Status</th><th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(s=>(
                <tr key={s.id}>
                  <td><strong style={{color:'#00246b',cursor:'pointer'}} onClick={()=>setDetail(s)}>🤝 {s.name}</strong></td>
                  <td>
                    <div>{s.contact}</div>
                    <div style={{fontSize:'0.78rem',color:'#64748b'}}>{s.phone}</div>
                  </td>
                  <td>{s.city}, {s.state}</td>
                  <td>{(Array.isArray(s.fishTypes)?s.fishTypes:s.fishTypes.split(',')).map(f=>(
                    <span key={f} className="badge badge-blue" style={{marginRight:3,marginBottom:2}}>🐟{f.trim()}</span>
                  ))}</td>
                  <td style={{fontSize:'0.85rem',fontWeight:600}}>{s.pricePer}</td>
                  <td>{s.minOrder} kg</td>
                  <td>
                    <div style={{display:'flex',alignItems:'center',gap:8}}>
                      <div className="progress-bar-bg" style={{width:60}}>
                        <div className="progress-bar-fill" style={{width:`${s.reliability}%`,background:s.reliability>=90?'#16a34a':s.reliability>=80?'#ca8a04':'#dc2626'}} />
                      </div>
                      <span style={{fontSize:'0.8rem',fontWeight:700}}>{s.reliability}%</span>
                    </div>
                  </td>
                  <td><span className="badge badge-purple">{s.payTerms}</span></td>
                  <td><strong style={{color:'#15803d'}}>₹{s.totalPurchased.toLocaleString()}</strong></td>
                  <td><span className={`badge ${s.status==='Active'?'badge-green':'badge-red'}`}>{s.status}</span></td>
                  <td style={{display:'flex',gap:6}}>
                    <button className="btn-edit" onClick={()=>openEdit(s)}>Edit</button>
                    <button className="btn-danger" onClick={()=>del(s.id)}>Del</button>
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
              <h2 className="modal-title">{editing?'Edit Supplier':'Add Supplier'}</h2>
              <button className="modal-close" onClick={()=>setModal(false)}>×</button>
            </div>
            <div className="form-grid">
              {[['name','Supplier Name','text'],['contact','Contact Person','text'],['phone','Phone','text'],
                ['email','Email','email'],['city','City','text'],['state','State','text'],
                ['fishTypes','Fish Types (comma sep.)','text'],['pricePer','Price Range','text'],
                ['minOrder','Min Order (kg)','number']].map(([k,lbl,type])=>(
                <div className="form-group" key={k}>
                  <label>{lbl}</label>
                  <input type={type} value={form[k]||''} onChange={e=>setForm({...form,[k]:e.target.value})} />
                </div>
              ))}
              {[['payTerms','Payment Terms',['Net 7','Net 15','Net 30','Advance']],
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
              <h2 className="modal-title">🤝 {detail.name}</h2>
              <button className="modal-close" onClick={()=>setDetail(null)}>×</button>
            </div>
            <div style={{display:'flex',flexDirection:'column',gap:12}}>
              {[['Contact',detail.contact],['Phone',detail.phone],['Email',detail.email],
                ['Location',`${detail.city}, ${detail.state}`],
                ['Fish Supplied',(Array.isArray(detail.fishTypes)?detail.fishTypes:[detail.fishTypes]).map(f=><span key={f} className="badge badge-blue" style={{marginRight:4}}>🐟{f}</span>)],
                ['Price Range',detail.pricePer],['Min Order',`${detail.minOrder} kg`],
                ['Reliability',`${detail.reliability}%`],['Payment Terms',detail.payTerms],
                ['Total Purchased',`₹${detail.totalPurchased.toLocaleString()}`],
                ['Last Purchase',detail.lastPurchase],
                ['Status',<span className={`badge ${detail.status==='Active'?'badge-green':'badge-red'}`}>{detail.status}</span>],
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
