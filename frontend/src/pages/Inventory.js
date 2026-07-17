import React, { useState } from 'react';
import './pages.css';

const initStock = [
  { id:1, name:'Rohu (Roho)',  category:'Freshwater', qty:850,  unit:'kg', buyPrice:45,  sellPrice:52,  supplier:'Ganga Fish Farm',   status:'In Stock',   lastUpdated:'2026-07-14' },
  { id:2, name:'Katla',        category:'Freshwater', qty:620,  unit:'kg', buyPrice:50,  sellPrice:58,  supplier:'Bihar Fish Co.',     status:'In Stock',   lastUpdated:'2026-07-14' },
  { id:3, name:'Tilapia',      category:'Freshwater', qty:1100, unit:'kg', buyPrice:30,  sellPrice:36,  supplier:'AP Aqua Farms',      status:'In Stock',   lastUpdated:'2026-07-13' },
  { id:4, name:'Salmon',       category:'Marine',     qty:8,    unit:'kg', buyPrice:220, sellPrice:260, supplier:'Nordic Fish Exports', status:'Low Stock',  lastUpdated:'2026-07-15' },
  { id:5, name:'Hilsa',        category:'Estuarine',  qty:12,   unit:'kg', buyPrice:280, sellPrice:320, supplier:'Bengal Hilsa Co.',   status:'Low Stock',  lastUpdated:'2026-07-15' },
  { id:6, name:'Pomfret',      category:'Marine',     qty:5,    unit:'kg', buyPrice:260, sellPrice:300, supplier:'Goa Sea Catch',      status:'Low Stock',  lastUpdated:'2026-07-15' },
  { id:7, name:'Catfish',      category:'Freshwater', qty:430,  unit:'kg', buyPrice:38,  sellPrice:46,  supplier:'MP Fish Farms',      status:'In Stock',   lastUpdated:'2026-07-12' },
  { id:8, name:'Sardine',      category:'Marine',     qty:0,    unit:'kg', buyPrice:25,  sellPrice:32,  supplier:'Kerala Catch Co.',   status:'Out of Stock',lastUpdated:'2026-07-10' },
  { id:9, name:'Mackerel',     category:'Marine',     qty:280,  unit:'kg', buyPrice:55,  sellPrice:66,  supplier:'Kerala Catch Co.',   status:'In Stock',   lastUpdated:'2026-07-13' },
  { id:10,name:'Carp',         category:'Freshwater', qty:760,  unit:'kg', buyPrice:35,  sellPrice:43,  supplier:'UP Fish Corp',       status:'In Stock',   lastUpdated:'2026-07-14' },
];

const fishSpeciesList = [
  'Anchovy', 'Betta', 'Barracuda', 'Bass (Striped)', 'Bass (black)', 
  'Buffalo Fish', 'Bombay Duck', 'Boga', 'Blue Tang', 'Clownfish', 
  'Calamari', 'Catfish', 'Clam', 'Cod', 'Crayfish', 'Carp', 
  'Dartfish', 'Deepwater Flathead', 'Electric Eel', 'Eel Cod', 
  'Eurasian Minnow', 'Flagfish', 'Flatfish', 'Ganges Shark', 
  'Ghost Pipefish', 'Gold Fish', 'Golden Mahseer', 'Hagfish', 
  'Handfish', 'Half Moon', 'Hilsa', 'Inanga'
].sort();

const empty = { name: fishSpeciesList[0], category:'Freshwater', qty:0, unit:'kg', buyPrice:0, sellPrice:0, supplier:'', status:'In Stock' };
const categories = ['All','Freshwater','Marine','Estuarine'];
const statusMap = { 'In Stock':'badge-green','Low Stock':'badge-yellow','Out of Stock':'badge-red' };

export default function Inventory() {
  const [stock, setStock]       = useState([]);
  const [search, setSearch]     = useState('');
  const [catFilter, setCat]     = useState('All');
  const [statusFilter, setStat] = useState('All');
  const [modal, setModal]       = useState(false);
  const [editing, setEditing]   = useState(null);
  const [form, setForm]         = useState(empty);

  const filtered = stock.filter(s =>
    (catFilter==='All' || s.category===catFilter) &&
    (statusFilter==='All' || s.status===statusFilter) &&
    (s.name.toLowerCase().includes(search.toLowerCase()) || s.supplier.toLowerCase().includes(search.toLowerCase()))
  );

  const openAdd  = () => { setEditing(null); setForm(empty); setModal(true); };
  const openEdit = r  => { setEditing(r.id); setForm({...r}); setModal(true); };
  const closeModal = () => setModal(false);

  React.useEffect(() => {
    fetchStock();
  }, []);

  const fetchStock = async () => {
    try {
      const res = await fetch('http://localhost:8080/api/fish');
      const data = await res.json();
      setStock(data);
    } catch (e) {
      console.error(e);
    }
  };

  const save = async () => {
    if (!form.name) return;
    const fishData = {
      ...form,
      qty: Number(form.qty) || 0,
      buyPrice: Number(form.buyPrice) || 0,
      sellPrice: Number(form.sellPrice) || 0,
      lastUpdated: new Date().toISOString().slice(0, 10)
    };
    if (editing) {
      fishData.id = editing;
    } else {
      delete fishData.id;
    }
    try {
      await fetch('http://localhost:8080/api/fish', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(fishData)
      });
      fetchStock();
      closeModal();
    } catch (e) {
      console.error(e);
    }
  };

  const del = async (id) => {
    try {
      await fetch(`http://localhost:8080/api/fish/${id}`, { method: 'DELETE' });
      setStock(stock.filter(s => s.id !== id));
    } catch (e) {
      console.error(e);
    }
  };

  const totalValue = stock.reduce((a,s)=>a+s.qty*s.sellPrice,0);
  const lowCount   = stock.filter(s=>s.status==='Low Stock').length;
  const outCount   = stock.filter(s=>s.status==='Out of Stock').length;

  return (
    <div className="page-wrapper">
      <div className="page-header">
        <div>
          <h1 className="page-title">📦 Fish Inventory</h1>
          <p className="page-subtitle">Manage your fish stock, prices and suppliers</p>
        </div>
        <button className="btn-primary" onClick={openAdd}>+ Add Fish Stock</button>
      </div>

      {/* Summary */}
      <div className="stats-grid" style={{gridTemplateColumns:'repeat(auto-fill,minmax(160px,1fr))'}}>
        {[
          {icon:'🐟', label:'Total Species',   value:stock.length,         bg:'#dbeafe'},
          {icon:'📦', label:'Total Stock (kg)',value:stock.reduce((a,s)=>a+s.qty,0).toLocaleString(), bg:'#dcfce7'},
          {icon:'💰', label:'Stock Value',     value:`₹${totalValue.toLocaleString()}`, bg:'#f3e8ff'},
          {icon:'⚠️', label:'Low Stock',       value:lowCount,             bg:'#fef9c3'},
          {icon:'❌', label:'Out of Stock',    value:outCount,             bg:'#fee2e2'},
        ].map(s=>(
          <div className="stat-card" key={s.label}>
            <div className="stat-card-icon" style={{background:s.bg}}>{s.icon}</div>
            <div className="stat-card-label">{s.label}</div>
            <div className="stat-card-value" style={{fontSize:'1.4rem'}}>{s.value}</div>
          </div>
        ))}
      </div>

      {outCount>0 && <div className="alert alert-danger">❌ {outCount} fish species are out of stock! Please reorder immediately.</div>}
      {lowCount>0 && <div className="alert alert-warning">⚠️ {lowCount} fish species are running low. Review and reorder soon.</div>}

      {/* Filter Bar */}
      <div className="glass-card">
        <div className="filter-bar">
          <input className="search-input" placeholder="🔍 Search fish or supplier…" value={search} onChange={e=>setSearch(e.target.value)} />
          <select className="filter-select" value={catFilter} onChange={e=>setCat(e.target.value)}>
            {categories.map(c=><option key={c}>{c}</option>)}
          </select>
          <select className="filter-select" value={statusFilter} onChange={e=>setStat(e.target.value)}>
            {['All','In Stock','Low Stock','Out of Stock'].map(s=><option key={s}>{s}</option>)}
          </select>
        </div>

        <div className="data-table-wrapper">
          <table className="data-table">
            <thead>
              <tr>
                <th>#</th><th>Fish Species</th><th>Category</th><th>Qty (kg)</th>
                <th>Buy ₹/kg</th><th>Sell ₹/kg</th><th>Margin</th>
                <th>Supplier</th><th>Status</th><th>Last Updated</th><th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0
                ? <tr><td colSpan={11} style={{textAlign:'center',padding:40,color:'#94a3b8'}}>No fish found</td></tr>
                : filtered.map((s,i)=>(
                  <tr key={s.id}>
                    <td style={{color:'#94a3b8'}}>{i+1}</td>
                    <td><strong>🐟 {s.name}</strong></td>
                    <td><span className="badge badge-blue">{s.category}</span></td>
                    <td><strong style={{color: s.qty===0?'#dc2626':s.qty<20?'#d97706':'#15803d'}}>{s.qty} kg</strong></td>
                    <td>₹{s.buyPrice}</td>
                    <td>₹{s.sellPrice}</td>
                    <td><span style={{color:'#15803d',fontWeight:700}}>+₹{s.sellPrice-s.buyPrice}</span></td>
                    <td>{s.supplier}</td>
                    <td><span className={`badge ${statusMap[s.status]}`}>{s.status}</span></td>
                    <td style={{color:'#94a3b8',fontSize:'0.8rem'}}>{s.lastUpdated}</td>
                    <td style={{display:'flex',gap:6}}>
                      <button className="btn-edit" onClick={()=>openEdit(s)}>Edit</button>
                      <button className="btn-danger" onClick={()=>del(s.id)}>Del</button>
                    </td>
                  </tr>
                ))
              }
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal */}
      {modal && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal-box" onClick={e=>e.stopPropagation()}>
            <div className="modal-header">
              <h2 className="modal-title">{editing?'Edit Fish Stock':'Add Fish Stock'}</h2>
              <button className="modal-close" onClick={closeModal}>×</button>
            </div>
            <div className="form-grid">
              {[['name','Fish Species','select'],['category','Category','select'],['qty','Quantity (kg)','number'],
                ['unit','Unit','text'],['buyPrice','Buy Price ₹/kg','number'],['sellPrice','Sell Price ₹/kg','number'],
                ['supplier','Supplier Name','text'],['status','Status','select']].map(([k,lbl,type])=>(
                <div className="form-group" key={k}>
                  <label>{lbl}</label>
                  {type==='select' && k==='name'
                    ? <select value={form[k]||''} onChange={e=>setForm({...form,[k]:e.target.value})}>
                        {fishSpeciesList.map(o=><option key={o}>{o}</option>)}
                      </select>
                    : type==='select' && k==='category'
                    ? <select value={form[k]||''} onChange={e=>setForm({...form,[k]:e.target.value})}>
                        {['Freshwater','Marine','Estuarine','Brackish'].map(o=><option key={o}>{o}</option>)}
                      </select>
                    : type==='select' && k==='status'
                    ? <select value={form[k]||''} onChange={e=>setForm({...form,[k]:e.target.value})}>
                        {['In Stock','Low Stock','Out of Stock'].map(o=><option key={o}>{o}</option>)}
                      </select>
                    : <input type={type} value={form[k]||''} onChange={e=>setForm({...form,[k]:e.target.value})} />
                  }
                </div>
              ))}
            </div>
            <div className="modal-actions">
              <button className="btn-secondary" onClick={closeModal}>Cancel</button>
              <button className="btn-primary" onClick={save}>{editing?'Update':'Add Stock'}</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
