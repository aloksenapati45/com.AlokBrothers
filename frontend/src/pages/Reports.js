import React, { useState, useEffect } from 'react';
import './pages.css';

const monthlyData = [
  { month:'Jan', revenue:38000,  orders:18, kgSold:820,  customers:12 },
  { month:'Feb', revenue:45000,  orders:22, kgSold:1020, customers:14 },
  { month:'Mar', revenue:52000,  orders:28, kgSold:1180, customers:17 },
  { month:'Apr', revenue:48000,  orders:24, kgSold:1080, customers:15 },
  { month:'May', revenue:61000,  orders:31, kgSold:1340, customers:19 },
  { month:'Jun', revenue:73000,  orders:37, kgSold:1620, customers:23 },
  { month:'Jul', revenue:82000,  orders:42, kgSold:1820, customers:26 },
  { month:'Aug', revenue:78000,  orders:39, kgSold:1740, customers:24 },
  { month:'Sep', revenue:90000,  orders:46, kgSold:2020, customers:28 },
  { month:'Oct', revenue:85000,  orders:43, kgSold:1900, customers:26 },
  { month:'Nov', revenue:96000,  orders:50, kgSold:2140, customers:31 },
  { month:'Dec', revenue:110000, orders:58, kgSold:2480, customers:36 },
];

const fishSales = [
  { name:'Rohu (Roho)', kgSold:3820, revenue:198640,  avgPrice:52,  growth:'+14%',  color:'#3b82f6' },
  { name:'Katla',       kgSold:3100, revenue:179800,  avgPrice:58,  growth:'+8%',   color:'#06b6d4' },
  { name:'Tilapia',     kgSold:4200, revenue:151200,  avgPrice:36,  growth:'+22%',  color:'#10b981' },
  { name:'Salmon',      kgSold:480,  revenue:124800,  avgPrice:260, growth:'+5%',   color:'#f59e0b' },
  { name:'Hilsa',       kgSold:310,  revenue:99200,   avgPrice:320, growth:'-3%',   color:'#8b5cf6' },
  { name:'Pomfret',     kgSold:240,  revenue:72000,   avgPrice:300, growth:'+11%',  color:'#ec4899' },
  { name:'Mackerel',    kgSold:1100, revenue:72600,   avgPrice:66,  growth:'+18%',  color:'#14b8a6' },
  { name:'Carp',        kgSold:2600, revenue:111800,  avgPrice:43,  growth:'+9%',   color:'#f97316' },
  { name:'Catfish',     kgSold:1800, revenue:82800,   avgPrice:46,  growth:'+7%',   color:'#84cc16' },
];

const topCustomers = [
  { name:'Mumbai Exports',   revenue:320000, orders:12 },
  { name:'Sharma Traders',   revenue:215000, orders:31 },
  { name:'Ravi Seafoods',    revenue:148000, orders:24 },
  { name:'Pune Fresh Fish',  revenue:125000, orders:20 },
  { name:'Hyderabad Catch',  revenue:62000,  orders:15 },
];

const maxRev = Math.max(...monthlyData.map(m=>m.revenue));
const maxKg  = Math.max(...fishSales.map(f=>f.kgSold));

export default function Reports() {
  const [metric, setMetric] = useState('revenue');
  const [period, setPeriod] = useState('This Year');
  const [stats, setStats] = useState({ totalSales: 0, totalOrders: 0, activeCustomers: 0, activeSuppliers: 0 });

  useEffect(() => {
    fetch('http://localhost:8080/api/reports/summary')
      .then(res => res.json())
      .then(data => setStats(data))
      .catch(err => console.error(err));
  }, []);

  const totalRevenue  = monthlyData.reduce((a,m)=>a+m.revenue,0);
  const totalOrders   = monthlyData.reduce((a,m)=>a+m.orders,0);
  const totalKg       = monthlyData.reduce((a,m)=>a+m.kgSold,0);
  const avgOrderVal   = Math.round(totalRevenue/totalOrders);

  const barData = metric==='revenue' ? monthlyData.map(m=>m.revenue) :
                  metric==='orders'  ? monthlyData.map(m=>m.orders*1000) :
                  monthlyData.map(m=>m.kgSold*40);
  const barMax = Math.max(...barData);

  return (
    <div className="page-wrapper">
      <div className="page-header">
        <div>
          <h1 className="page-title">📈 Business Reports</h1>
          <p className="page-subtitle">Sales analytics, fish performance and customer insights</p>
        </div>
        <div style={{display:'flex',gap:10}}>
          <select className="filter-select" value={period} onChange={e=>setPeriod(e.target.value)}>
            {['This Month','This Quarter','This Year'].map(p=><option key={p}>{p}</option>)}
          </select>
          <button className="btn-secondary">⬇ Export</button>
        </div>
      </div>

      {/* KPI Summary */}
      <div className="stats-grid">
        {[
          {icon:'💰',label:'Total Revenue',    value:`₹${(stats.totalSales/100000).toFixed(1)}L`, delta:'+18%', bg:'#dbeafe'},
          {icon:'📦',label:'Total Orders',     value:stats.totalOrders,          delta:'+24%',  bg:'#dcfce7'},
          {icon:'🐟',label:'Fish Sold (kg)',   value:totalKg.toLocaleString(), delta:'+21%',bg:'#f3e8ff'},
          {icon:'💎',label:'Avg Order Value',  value:`₹${Math.round(stats.totalSales/(stats.totalOrders||1)).toLocaleString()}`, delta:'+6%', bg:'#fef9c3'},
          {icon:'👥',label:'Total Customers',  value:stats.activeCustomers,                   delta:'+12 new',bg:'#e0f2fe'},
          {icon:'📊',label:'Best Month',       value:'December',           delta:'₹1.1L',  bg:'#ffedd5'},
        ].map(s=>(
          <div className="stat-card" key={s.label}>
            <div className="stat-card-icon" style={{background:s.bg}}>{s.icon}</div>
            <div className="stat-card-label">{s.label}</div>
            <div className="stat-card-value" style={{fontSize:'1.35rem'}}>{s.value}</div>
            <div className="stat-card-delta delta-up">▲ {s.delta}</div>
          </div>
        ))}
      </div>

      {/* Main Chart */}
      <div className="glass-card" style={{marginBottom:20}}>
        <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:20}}>
          <h3 style={{margin:0,fontWeight:800,color:'#0a1628',fontSize:'1rem'}}>📊 Monthly Performance</h3>
          <div style={{display:'flex',gap:8}}>
            {[['revenue','💰 Revenue'],['orders','📦 Orders'],['kgSold','🐟 Kg Sold']].map(([k,lbl])=>(
              <button key={k} onClick={()=>setMetric(k)}
                style={{padding:'6px 14px',borderRadius:8,border:'1.5px solid',fontSize:'0.8rem',fontWeight:700,cursor:'pointer',
                  background:metric===k?'#00246b':'transparent',color:metric===k?'#fff':'#00246b',borderColor:'#00246b'}}>
                {lbl}
              </button>
            ))}
          </div>
        </div>
        <div className="chart-area" style={{height:240}}>
          {monthlyData.map((m,i)=>(
            <div key={m.month} style={{flex:1,display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'flex-end',height:'100%'}}>
              <div title={metric==='revenue'?`₹${m.revenue.toLocaleString()}`:metric==='orders'?`${m.orders} orders`:`${m.kgSold} kg`}
                style={{width:'100%',borderRadius:'6px 6px 0 0',background:`linear-gradient(180deg,#0369a1,#00246b)`,
                  height:`${(barData[i]/barMax)*100}%`,cursor:'pointer',transition:'opacity 0.2s'}}
                className="chart-bar" />
            </div>
          ))}
        </div>
        <div className="chart-labels">
          {monthlyData.map(m=><span className="chart-label" key={m.month}>{m.month}</span>)}
        </div>
      </div>

      <div className="two-col" style={{marginBottom:20}}>
        {/* Fish Species Performance */}
        <div className="glass-card">
          <h3 style={{margin:'0 0 18px',fontWeight:800,color:'#0a1628',fontSize:'1rem'}}>🐟 Fish Species Performance</h3>
          <div style={{display:'flex',flexDirection:'column',gap:14}}>
            {fishSales.map(f=>(
              <div key={f.name}>
                <div style={{display:'flex',justifyContent:'space-between',marginBottom:5}}>
                  <span style={{fontWeight:700,fontSize:'0.86rem',color:'#1e293b'}}>{f.name}</span>
                  <span style={{display:'flex',gap:10,fontSize:'0.8rem'}}>
                    <span style={{color:'#64748b'}}>{f.kgSold} kg</span>
                    <span style={{fontWeight:700,color:'#15803d'}}>₹{f.revenue.toLocaleString()}</span>
                    <span style={{color:f.growth.startsWith('+')?'#16a34a':'#dc2626',fontWeight:700}}>{f.growth}</span>
                  </span>
                </div>
                <div className="progress-bar-bg">
                  <div className="progress-bar-fill" style={{width:`${(f.kgSold/maxKg)*100}%`,background:f.color}} />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Top Customers */}
        <div className="glass-card">
          <h3 style={{margin:'0 0 18px',fontWeight:800,color:'#0a1628',fontSize:'1rem'}}>🏆 Top Customers by Revenue</h3>
          <div style={{display:'flex',flexDirection:'column',gap:14}}>
            {topCustomers.map((c,i)=>(
              <div key={c.name} style={{display:'flex',alignItems:'center',gap:14}}>
                <div style={{width:30,height:30,borderRadius:'50%',background:['#3b82f6','#06b6d4','#10b981','#f59e0b','#8b5cf6'][i],
                  display:'flex',alignItems:'center',justifyContent:'center',color:'#fff',fontWeight:800,fontSize:'0.85rem',flexShrink:0}}>
                  {i+1}
                </div>
                <div style={{flex:1}}>
                  <div style={{display:'flex',justifyContent:'space-between',marginBottom:4}}>
                    <span style={{fontWeight:700,fontSize:'0.86rem',color:'#1e293b'}}>{c.name}</span>
                    <span style={{fontSize:'0.82rem',color:'#15803d',fontWeight:700}}>₹{c.revenue.toLocaleString()}</span>
                  </div>
                  <div className="progress-bar-bg">
                    <div className="progress-bar-fill" style={{width:`${(c.revenue/topCustomers[0].revenue)*100}%`,background:['#3b82f6','#06b6d4','#10b981','#f59e0b','#8b5cf6'][i]}} />
                  </div>
                  <div style={{fontSize:'0.76rem',color:'#94a3b8',marginTop:3}}>{c.orders} orders</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Detailed monthly table */}
      <div className="glass-card">
        <h3 style={{margin:'0 0 16px',fontWeight:800,color:'#0a1628',fontSize:'1rem'}}>📋 Monthly Breakdown</h3>
        <div className="data-table-wrapper">
          <table className="data-table">
            <thead>
              <tr>
                <th>Month</th><th>Revenue</th><th>Orders</th><th>Kg Sold</th>
                <th>New Customers</th><th>Avg Order ₹</th><th>Growth</th>
              </tr>
            </thead>
            <tbody>
              {monthlyData.map((m,i)=>{
                const prev = monthlyData[i-1];
                const growth = prev ? (((m.revenue-prev.revenue)/prev.revenue)*100).toFixed(1) : null;
                return (
                  <tr key={m.month}>
                    <td><strong>{m.month}</strong></td>
                    <td><strong style={{color:'#15803d'}}>₹{m.revenue.toLocaleString()}</strong></td>
                    <td>{m.orders}</td>
                    <td>{m.kgSold.toLocaleString()} kg</td>
                    <td>{m.customers}</td>
                    <td>₹{Math.round(m.revenue/m.orders).toLocaleString()}</td>
                    <td>
                      {growth !== null
                        ? <span style={{color:Number(growth)>=0?'#16a34a':'#dc2626',fontWeight:700}}>
                            {Number(growth)>=0?'▲':'▼'} {Math.abs(growth)}%
                          </span>
                        : <span style={{color:'#94a3b8'}}>—</span>
                      }
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
