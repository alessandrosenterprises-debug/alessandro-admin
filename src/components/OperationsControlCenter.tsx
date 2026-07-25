import { useEffect, useMemo, useState } from 'react';
import { supabase } from '../supabaseClient';

type Notice = { id:string; category:string; title:string; body:string|null; read_at:string|null; completed_at:string|null; archived_at:string|null; created_at:string };
type RoleRecord = { user_id:string; role:'super_admin'|'admin'|'manager'|'staff'; enabled:boolean };
type Setting = { key:string; value: Record<string, unknown> };
type Tab = 'users'|'reports'|'notifications'|'settings';

const periodMs:Record<string,number> = { daily:86400000, weekly:604800000, monthly:2592000000, yearly:31536000000 };

export function OperationsControlCenter(){
  const [tab,setTab] = useState<Tab>('users');
  const [notices,setNotices] = useState<Notice[]>([]);
  const [roles,setRoles] = useState<RoleRecord[]>([]);
  const [settings,setSettings] = useState<Setting[]>([]);
  const [message,setMessage] = useState<string|null>(null);
  const [dateRange,setDateRange] = useState('monthly');
  const [roleForm,setRoleForm] = useState({userId:'',role:'staff'});

  async function load(){
    const [n,r,s] = await Promise.all([
      supabase.from('admin_notifications').select('*').order('created_at',{ascending:false}),
      supabase.from('user_roles').select('user_id,role,enabled').order('created_at'),
      supabase.from('app_settings').select('key,value'),
    ]);
    setNotices((n.data??[]) as Notice[]);
    setRoles((r.data??[]) as RoleRecord[]);
    setSettings((s.data??[]) as Setting[]);
    if(n.error||r.error||s.error) setMessage(n.error?.message??r.error?.message??s.error?.message??'Could not load control-centre data.');
  }

  useEffect(()=>{void load();const channel=supabase.channel('operations-control').on('postgres_changes',{event:'*',schema:'public',table:'admin_notifications'},()=>void load()).subscribe();return()=>{void supabase.removeChannel(channel)};},[]);

  const activeNotices = notices.filter(item=>!item.completed_at&&!item.archived_at);
  const unread = activeNotices.filter(item=>!item.read_at).length;
  const reportRows = useMemo(()=>notices.filter(item=>Date.now()-new Date(item.created_at).getTime()<periodMs[dateRange]),[notices,dateRange]);

  async function changeNotice(id:string,updates:Partial<Notice>){const {error}=await supabase.from('admin_notifications').update(updates).eq('id',id);setMessage(error?error.message:'Notification updated.');await load();}
  async function saveRole(){if(!roleForm.userId.trim())return;const {error}=await supabase.from('user_roles').upsert({user_id:roleForm.userId.trim(),role:roleForm.role,enabled:true});setMessage(error?error.message:'Role saved.');if(!error){setRoleForm({userId:'',role:'staff'});await load();}}
  async function saveSetting(setting:Setting){const {error}=await supabase.from('app_settings').update({value:setting.value}).eq('key',setting.key);setMessage(error?error.message:`${setting.key} settings saved.`);}
  function exportReport(kind:'csv'|'excel'){const csv=['Created,Category,Title,Status',...reportRows.map(item=>`${new Date(item.created_at).toLocaleString()},${item.category},"${item.title.replace(/"/g,'""')}",${item.completed_at?'Completed':item.archived_at?'Archived':item.read_at?'Read':'New'}`)].join('\n');const blob=new Blob([csv],{type:kind==='excel'?'application/vnd.ms-excel':'text/csv'});const url=URL.createObjectURL(blob);const link=document.createElement('a');link.href=url;link.download=`operations-report.${kind==='excel'?'xls':'csv'}`;link.click();URL.revokeObjectURL(url);}

  return <section className="operations-center">
    <div className="operations-tabs"><button className={tab==='users'?'active':''} onClick={()=>setTab('users')}>Users</button><button className={tab==='reports'?'active':''} onClick={()=>setTab('reports')}>Reports</button><button className={tab==='notifications'?'active':''} onClick={()=>setTab('notifications')}>Notifications {unread>0&&<i>{unread}</i>}</button><button className={tab==='settings'?'active':''} onClick={()=>setTab('settings')}>System settings</button></div>
    {message&&<p className="notice">{message}</p>}
    {tab==='users'&&<div className="control-content"><div><h2>User administration</h2><p>Assign roles after a user has been invited through Supabase Auth. Only a Super Admin should change roles.</p><div className="role-form"><input placeholder="Supabase Auth user ID" value={roleForm.userId} onChange={event=>setRoleForm({...roleForm,userId:event.target.value})}/><select value={roleForm.role} onChange={event=>setRoleForm({...roleForm,role:event.target.value})}><option value="staff">Staff</option><option value="manager">Manager</option><option value="admin">Admin</option><option value="super_admin">Super Admin</option></select><button onClick={()=>void saveRole()}>Save role</button></div></div><div className="role-list">{roles.map(role=><article key={role.user_id}><div><b>{role.role.replace('_',' ')}</b><small>{role.user_id}</small></div><button onClick={()=>void supabase.from('user_roles').update({enabled:!role.enabled}).eq('user_id',role.user_id).then(()=>load())}>{role.enabled?'Disable':'Enable'}</button></article>)}{roles.length===0&&<p className="empty">No role records yet.</p>}</div></div>}
    {tab==='reports'&&<div className="control-content"><div className="report-toolbar"><div><h2>Operations reports</h2><p>All notification activity for the selected period, including completed records.</p></div><select value={dateRange} onChange={event=>setDateRange(event.target.value)}><option value="daily">Daily</option><option value="weekly">Weekly</option><option value="monthly">Monthly</option><option value="yearly">Yearly</option></select><button onClick={()=>exportReport('csv')}>CSV</button><button onClick={()=>exportReport('excel')}>Excel</button><button onClick={()=>window.print()}>Print / PDF</button></div><div className="report-summary"><b>{reportRows.length}<small>Activity records</small></b><b>{reportRows.filter(item=>item.category==='pending'&&!item.completed_at).length}<small>Pending</small></b><b>{reportRows.filter(item=>!!item.completed_at).length}<small>Completed</small></b><b>—<small>Website traffic: connect analytics</small></b></div></div>}
    {tab==='notifications'&&<div className="control-content"><div className="report-toolbar"><div><h2>Notification centre</h2><p>{activeNotices.length} active notification(s). Completing or archiving them removes their badge.</p></div><button onClick={()=>void Promise.all(activeNotices.filter(item=>!item.read_at).map(item=>changeNotice(item.id,{read_at:new Date().toISOString()})))}>Mark all read</button></div><div className="notice-list">{activeNotices.map(item=><article key={item.id}><span className={`notice-type ${item.category}`}>{item.category}</span><div><b>{item.title}</b><p>{item.body}</p><small>{new Date(item.created_at).toLocaleString()}</small></div><div className="row-actions"><button onClick={()=>void changeNotice(item.id,{read_at:item.read_at?null:new Date().toISOString()})}>{item.read_at?'Unread':'Read'}</button><button onClick={()=>void changeNotice(item.id,{completed_at:new Date().toISOString(),read_at:new Date().toISOString()})}>Complete</button><button className="danger" onClick={()=>void changeNotice(item.id,{archived_at:new Date().toISOString()})}>Archive</button></div></article>)}{activeNotices.length===0&&<p className="empty">You are all caught up.</p>}</div></div>}
    {tab==='settings'&&<div className="control-content"><h2>Safe dashboard settings</h2><p>Company, portal, visual, and notification preferences are stored here. Secrets, backups, restore operations, and Supabase keys remain outside the browser for security.</p><div className="settings-list">{settings.map(setting=><article key={setting.key}><b>{setting.key.replace('_',' ')}</b><textarea value={JSON.stringify(setting.value,null,2)} onChange={event=>{try{setSettings(all=>all.map(item=>item.key===setting.key?{...item,value:JSON.parse(event.target.value)}:item));}catch{/* wait for valid JSON */}}}/><button onClick={()=>void saveSetting(setting)}>Save</button></article>)}</div></div>}
  </section>;
}
