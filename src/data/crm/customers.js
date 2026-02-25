 export const companies = [
   { id: 'COMP-001', name: 'PT Maju', industry: 'Manufacturing' },
   { id: 'COMP-002', name: 'CV Sentosa', industry: 'Distribution' },
   { id: 'COMP-003', name: 'Acme Group', industry: 'Technology' },
   { id: 'COMP-004', name: 'Klarna', industry: 'Finance' },
 ];
 
 const make = (i) => ({
   id: `CUST-${String(i).padStart(3, '0')}`,
   name: `Customer ${i}`,
   email: `customer${i}@mail.com`,
   phone: `0812${String(100000 + i)}`,
   companyId: companies[i % companies.length].id,
   status: i % 3 === 0 ? 'Inactive' : 'Active',
   createdAt: new Date(2025, (i % 12), (i % 28) + 1).toISOString().slice(0, 10),
 });
 
 export const customersData = Array.from({ length: 30 }, (_, i) => make(i + 1));
