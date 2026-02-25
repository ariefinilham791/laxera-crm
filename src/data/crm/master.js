 export const customers = [
   { id: 'CUST-001', name: 'PT Maju', email: 'sales@ptmaju.co.id', phone: '021-1234567' },
   { id: 'CUST-002', name: 'CV Sentosa', email: 'info@cvsentosa.id', phone: '021-7654321' },
   { id: 'CUST-003', name: 'Acme Group', email: 'contact@acme.co', phone: '021-9988776' },
 ];
 
 export const salesReps = [
   { id: 'SLS-001', name: 'Andi' },
   { id: 'SLS-002', name: 'Budi' },
   { id: 'SLS-003', name: 'Citra' },
 ];
 
 export const products = [
   { id: 'PRD-001', name: 'Produk A', price: 2500000 },
   { id: 'PRD-002', name: 'Produk B', price: 4200000 },
   { id: 'PRD-003', name: 'Produk C', price: 1750000 },
 ];
 
 export const formatIDR = (value) => `Rp ${Intl.NumberFormat('id-ID').format(value || 0)}`;

export const salesOrders = (() => {
  const arr = [];
  const now = new Date();
  for (let i = 60; i >= 0; i--) {
    const d = new Date(now);
    d.setDate(d.getDate() - i);
    const base = 5000000 + Math.floor(Math.random() * 5000000);
    const jitter = Math.floor(Math.random() * 2000000) - 1000000;
    arr.push({ date: d.toISOString().slice(0, 10), amount: Math.max(0, base + jitter) });
  }
  return arr;
})();

export const monthlyTotals = (rows) => {
  const map = {};
  rows.forEach(r => {
    const d = new Date(r.date);
    const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
    map[key] = (map[key] || 0) + r.amount;
  });
  const entries = Object.entries(map).sort((a, b) => a[0] < b[0] ? -1 : 1);
  return entries.map(([key, total]) => ({ key, total }));
};
