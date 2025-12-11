// Lightweight AfyaLink Offline SDK
// Usage:
// const sdk = new AfyaOffline({ apiBase: '/api', storeName:'AfyaLinkOffline' });
// sdk.saveEvent({ connectorId, payload, sig });
// sdk.syncAll();
import localforage from 'localforage';

export default class AfyaOffline {
  constructor(opts={}) {
    this.apiBase = opts.apiBase || '/api';
    this.store = localforage.createInstance({ name: opts.storeName || 'AfyaLinkOffline' });
  }

  async saveEvent(item){
    const id = 'evt_' + Date.now() + '_' + Math.random().toString(36).slice(2,8);
    await this.store.setItem(id, item);
    return id;
  }

  async listEvents(){
    const keys = await this.store.keys();
    const out = [];
    for(const k of keys){ out.push(await this.store.getItem(k)); }
    return out;
  }

  async removeEventByKey(key){ await this.store.removeItem(key); }

  async syncAll(){ 
    const keys = await this.store.keys();
    const items = [];
    for(const k of keys){ items.push(await this.store.getItem(k)); }
    if(items.length===0) return { ok:true, queued:0 };
    const res = await fetch(this.apiBase + '/offline/upload', { method:'POST', credentials:'include', headers:{'Content-Type':'application/json'}, body: JSON.stringify({ items })});
    if(res.ok){
      for(const k of keys) await this.store.removeItem(k);
      return { ok:true, queued: items.length };
    } else {
      const text = await res.text();
      return { ok:false, error: text };
    }
  }
}
