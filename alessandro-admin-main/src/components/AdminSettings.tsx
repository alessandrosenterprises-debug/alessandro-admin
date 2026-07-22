import { useEffect, useState } from 'react';
import { supabase } from '../supabaseClient';

type BusinessProfile = {
  id: string;
  name: string;
  tagline: string | null;
  logo_path: string | null;
  accent_color: string;
  active: boolean;
};

export function AdminSettings() {
  const [profiles, setProfiles] = useState<BusinessProfile[]>([]);
  const [message, setMessage] = useState<string | null>(null);

  useEffect(() => {
    supabase.from('business_profiles').select('*').order('sort_order')
      .then(({ data, error }) => {
        if (error) setMessage(error.message);
        else setProfiles((data ?? []) as BusinessProfile[]);
      });
  }, []);

  function change(id: string, updates: Partial<BusinessProfile>) {
    setProfiles((current) => current.map((profile) => profile.id === id ? { ...profile, ...updates } : profile));
  }

  async function save(profile: BusinessProfile) {
    const { error } = await supabase.from('business_profiles').update({
      name: profile.name,
      tagline: profile.tagline,
      logo_path: profile.logo_path,
      accent_color: profile.accent_color,
      active: profile.active,
    }).eq('id', profile.id);
    setMessage(error ? error.message : `${profile.name} settings saved.`);
  }

  return <section className="admin-settings"><h2>Business Settings</h2><p>Manage customer-facing business names, colours, logos, taglines, and availability.</p>{message && <p className="notice">{message}</p>}<div className="business-settings-grid">{profiles.map((profile) => <article key={profile.id} className="business-setting" style={{ borderTopColor: profile.accent_color }}><img src={profile.logo_path ?? '/logos/alessandroenterprises.png'} alt="" /><label>Name<input value={profile.name} onChange={(e) => change(profile.id, { name: e.target.value })} /></label><label>Tagline<input value={profile.tagline ?? ''} onChange={(e) => change(profile.id, { tagline: e.target.value })} /></label><label>Logo path<input value={profile.logo_path ?? ''} onChange={(e) => change(profile.id, { logo_path: e.target.value })} /></label><label>Accent colour<input type="color" value={profile.accent_color} onChange={(e) => change(profile.id, { accent_color: e.target.value })} /></label><label className="check"><input type="checkbox" checked={profile.active} onChange={(e) => change(profile.id, { active: e.target.checked })} /> Available to customers</label><button onClick={() => void save(profile)}>Save business</button></article>)}</div></section>;
}
