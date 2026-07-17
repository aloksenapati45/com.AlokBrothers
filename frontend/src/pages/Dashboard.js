import React, { useState, useEffect } from 'react';
import './pages.css';

/* ── Mock Data ── */
const initRecentOrders = [];

const topFish = [
  { name:'Rohu (Roho)',  sold:1240, revenue:62000, color:'#3b82f6' },
  { name:'Katla',        sold:980,  revenue:53900, color:'#06b6d4' },
  { name:'Tilapia',      sold:860,  revenue:30100, color:'#10b981' },
  { name:'Salmon',       sold:320,  revenue:80000, color:'#f59e0b' },
  { name:'Hilsa',        sold:210,  revenue:63000, color:'#8b5cf6' },
];

const monthlyRevenue = [38,45,52,48,61,73,67,82,78,90,85,96];
const months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
const maxRev = Math.max(...monthlyRevenue);

const lowStock = [
  { name:'Hilsa',   qty:12,  threshold:20, unit:'kg' },
  { name:'Salmon',  qty:8,   threshold:25, unit:'kg' },
  { name:'Pomfret', qty:5,   threshold:15, unit:'kg' },
];

const statusBadge = s => {
  const map = { Delivered:'badge-green', Processing:'badge-blue', Pending:'badge-yellow', Shipped:'badge-purple', Cancelled:'badge-red' };
  return <span className={`badge ${map[s]||'badge-gray'}`}>{s}</span>;
};

export default function Dashboard() {
  const [period, setPeriod] = useState('This Month');
  const [stats, setStats] = useState({ totalSales: 0, totalOrders: 0, activeCustomers: 0, activeSuppliers: 0 });
  const [recentOrders, setRecentOrders] = useState([]);

  useEffect(() => {
    fetch('http://localhost:8080/api/reports/summary')
      .then(res => res.json())
      .then(data => setStats(data))
      .catch(err => console.error(err));

    fetch('http://localhost:8080/api/orders')
      .then(res => res.json())
      .then(data => setRecentOrders(data.slice(-5).reverse()))
      .catch(err => console.error(err));
  }, []);

  return (
    <div className="page-wrapper">
      {/* Header */}
      <div className="page-header">
        <div>
          <h1 className="page-title">🐟 Fish Business Dashboard</h1>
          <p className="page-subtitle">Welcome back! Here's your business at a glance.</p>
        </div>
        <select className="filter-select" value={period} onChange={e=>setPeriod(e.target.value)}>
          {['Today','This Week','This Month','This Year'].map(p=><option key={p}>{p}</option>)}
        </select>
      </div>

      {/* Stat Cards */}
      <div className="stats-grid">
        {[
          { icon:'💰', label:'Total Revenue',    value:`₹${stats.totalSales.toLocaleString()}`,  delta:'+12.4%', up:true,  bg:'#dbeafe' },
          { icon:'📦', label:'Orders Today',     value:stats.totalOrders,         delta:'+5 new', up:true,  bg:'#dcfce7' },
          { icon:'🐠', label:'Fish Sold (kg)',   value:'3,820',      delta:'+8.1%',  up:true,  bg:'#f3e8ff' },
          { icon:'🏪', label:'Active Customers', value:stats.activeCustomers,        delta:'+3 new', up:true,  bg:'#fef9c3' },
          { icon:'🚚', label:'Pending Shipments',value:'7',          delta:'-2',     up:false, bg:'#ffedd5' },
          { icon:'⚠️',  label:'Low Stock Items', value:'3',          delta:'Alert',  up:false, bg:'#fee2e2' },
          { icon:'🤝', label:'Suppliers',        value:stats.activeSuppliers,         delta:'Active', up:true,  bg:'#d1fae5' },
          { icon:'📈', label:'Avg Order Value',  value:`₹${(stats.totalSales/(stats.totalOrders||1)).toLocaleString(undefined,{maximumFractionDigits:0})}`,    delta:'+6.3%',  up:true,  bg:'#e0f2fe' },
        ].map(s=>(
          <div className="stat-card" key={s.label}>
            <div className="stat-card-icon" style={{background:s.bg}}>{s.icon}</div>
            <div className="stat-card-label">{s.label}</div>
            <div className="stat-card-value">{s.value}</div>
            <div className={`stat-card-delta ${s.up?'delta-up':'delta-down'}`}>{s.up?'▲':'▼'} {s.delta}</div>
          </div>
        ))}
      </div>

      {/* Low Stock Alerts */}
      {lowStock.map(l=>(
        <div className="alert alert-warning" key={l.name}>
          ⚠️ <strong>{l.name}</strong> is running low — only {l.qty}{l.unit} left (threshold: {l.threshold}{l.unit}).
          <button className="btn-primary" style={{marginLeft:'auto',padding:'6px 14px',fontSize:'0.8rem'}}>Reorder</button>
        </div>
      ))}

      {/* Charts Row */}
      <div className="two-col" style={{marginBottom:20}}>
        {/* Revenue Chart */}
        <div className="glass-card">
          <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:16}}>
            <h3 style={{margin:0,fontWeight:800,color:'#0a1628',fontSize:'1rem'}}>📊 Monthly Revenue (₹K)</h3>
          </div>
          <div className="chart-area">
            {monthlyRevenue.map((v,i)=>(
              <div key={i} className="chart-bar" title={`₹${v}K`}
                style={{height:`${(v/maxRev)*100}%`, background:`linear-gradient(180deg,#0369a1,#00246b)`}} />
            ))}
          </div>
          <div className="chart-labels">{months.map(m=><span className="chart-label" key={m}>{m}</span>)}</div>
        </div>

        {/* Top Selling Fish */}
        <div className="glass-card">
          <h3 style={{margin:'0 0 16px',fontWeight:800,color:'#0a1628',fontSize:'1rem'}}>🏆 Top Selling Fish</h3>
          <div style={{display:'flex',flexDirection:'column',gap:14}}>
            {topFish.map((f,i)=>(
              <div key={f.name}>
                <div style={{display:'flex',justifyContent:'space-between',marginBottom:5}}>
                  <span style={{fontWeight:700,fontSize:'0.88rem',color:'#1e293b'}}>#{i+1} {f.name}</span>
                  <span style={{fontSize:'0.82rem',color:'#64748b',fontWeight:600}}>{f.sold} kg · ₹{f.revenue.toLocaleString()}</span>
                </div>
                <div className="progress-bar-bg">
                  <div className="progress-bar-fill" style={{width:`${(f.sold/topFish[0].sold)*100}%`,background:f.color}} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recent Orders */}
      <div className="glass-card">
        <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:16}}>
          <h3 style={{margin:0,fontWeight:800,color:'#0a1628',fontSize:'1rem'}}>🛒 Recent Orders</h3>
          <button className="btn-secondary" onClick={()=>window.location.href='/orders'}>View All</button>
        </div>
        <div className="data-table-wrapper">
          <table className="data-table">
            <thead>
              <tr>
                <th>Order ID</th><th>Customer</th><th>Fish Type</th>
                <th>Qty (kg)</th><th>Amount</th><th>Status</th><th>Date</th>
              </tr>
            </thead>
            <tbody>
              {recentOrders.map(o=>(
                <tr key={o.id}>
                  <td><strong>ORD-{String(o.id).padStart(3,'0')}</strong></td>
                  <td>{o.customer}</td>
                  <td>🐟 {o.fish}</td>
                  <td>{o.qty} kg</td>
                  <td><strong>₹{o.amount.toLocaleString()}</strong></td>
                  <td>{statusBadge(o.status)}</td>
                  <td>{o.date}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
