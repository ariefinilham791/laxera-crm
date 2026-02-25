 'use client'
 import { useMemo, useState } from 'react';
 import { Card, Table, Button, Badge, Dropdown, Row, Col, InputGroup, Form } from 'react-bootstrap';
 import { Edit, Eye, MoreVertical, Trash2, Plus } from 'react-feather';
 import Pager from './Pagination';
 import AlertAuto from './AlertAuto';
 import ConfirmDeleteModal from './ConfirmDeleteModal';
 import CustomerFormModal from './CustomerFormModal';
 import CustomerDetailModal from './CustomerDetailModal';
 import { customersData } from '@/data/crm/customers';
 import { companies } from '@/data/crm/customers';
 
 const PAGE_SIZE = 10;
 
 const CustomerTable = () => {
   const [data, setData] = useState(customersData);
   const [q, setQ] = useState('');
   const [page, setPage] = useState(1);
   const [sort, setSort] = useState({ key: 'name', dir: 'asc' }); // 'name' | 'createdAt'
   const [showForm, setShowForm] = useState(false);
   const [editItem, setEditItem] = useState(null);
   const [detailItem, setDetailItem] = useState(null);
   const [deleteTarget, setDeleteTarget] = useState(null);
   const [alert, setAlert] = useState({ show: false, variant: 'success', text: '' });
 
   const filtered = useMemo(() => data.filter(c =>
     [c.name, c.email].join(' ').toLowerCase().includes(q.toLowerCase())
   ), [data, q]);
 
   const sorted = useMemo(() => {
     const arr = [...filtered];
     arr.sort((a, b) => {
       const k = sort.key;
       const va = a[k], vb = b[k];
       const cmp = va < vb ? -1 : va > vb ? 1 : 0;
       return sort.dir === 'asc' ? cmp : -cmp;
     });
     return arr;
   }, [filtered, sort]);
 
   const pages = Math.ceil(sorted.length / PAGE_SIZE);
   const view = sorted.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);
 
   const companyName = (id) => companies.find(c => c.id === id)?.name || '-';
 
   const addCustomer = (c) => {
     const id = `CUST-${String(data.length + 1).padStart(3, '0')}`;
     const createdAt = new Date().toISOString().slice(0, 10);
     setData([{ ...c, id, createdAt }, ...data]);
     setAlert({ show: true, variant: 'success', text: 'Customer berhasil ditambahkan' });
   };
 
   const updateCustomer = (c) => {
     setData(data.map(x => x.id === editItem.id ? { ...editItem, ...c } : x));
     setAlert({ show: true, variant: 'success', text: 'Customer berhasil diupdate' });
     setEditItem(null);
   };
 
   const handleConfirmDelete = () => {
     if (deleteTarget) {
       setData(data.filter(x => x.id !== deleteTarget.id));
       setAlert({ show: true, variant: 'success', text: 'Customer berhasil dihapus.' });
     }
     setDeleteTarget(null);
   };
 
   return (
     <>
       {alert.show && (
         <AlertAuto show={alert.show} variant={alert.variant} toast onClose={() => setAlert({ ...alert, show: false })}>
           {alert.text}
         </AlertAuto>
       )}
       <Row className="mb-3">
         <Col md={6}>
           <InputGroup>
             <InputGroup.Text>Search</InputGroup.Text>
             <Form.Control placeholder="Cari nama/email" value={q} onChange={(e) => setQ(e.target.value)} />
           </InputGroup>
         </Col>
         <Col md={6} className="text-end">
           <Button variant="primary" onClick={() => { setEditItem(null); setShowForm(true); }}>
         
             <span className="btn-text ms-1"><Plus /> Add Customer</span>
           </Button>
         </Col>
       </Row>
       <Card className="card-border crm-card-accent-info">
         <Card.Header className="card-header-action">
           <h6 className="mb-0">Customers</h6>
           <div className="card-action-wrap">
             <Button variant="outline-light" size="sm" onClick={() => setSort({ key: 'name', dir: sort.dir === 'asc' ? 'desc' : 'asc' })}>Sort Name</Button>
             <Button variant="outline-light" size="sm" className="ms-2" onClick={() => setSort({ key: 'createdAt', dir: sort.dir === 'asc' ? 'desc' : 'asc' })}>Sort Created At</Button>
           </div>
         </Card.Header>
         <Card.Body>
           <Table responsive className="mb-0">
             <thead>
               <tr>
                 <th>ID</th>
                 <th>Name</th>
                 <th>Email</th>
                 <th>Phone</th>
                 <th>Company</th>
                 <th>Status</th>
                 <th>Created At</th>
                 <th>Actions</th>
               </tr>
             </thead>
             <tbody>
               {view.map(c => (
                 <tr key={c.id}>
                   <td>{c.id}</td>
                   <td>{c.name}</td>
                   <td>{c.email}</td>
                   <td>{c.phone}</td>
                   <td>{companyName(c.companyId)}</td>
                   <td><Badge bg={c.status === 'Active' ? 'success' : 'secondary'}>{c.status}</Badge></td>
                   <td>{c.createdAt}</td>
                   <td>
                     <Dropdown>
                       <Dropdown.Toggle variant="flush-dark" className="btn-icon btn-rounded flush-soft-hover no-caret">
                         <span className="icon"><span className="feather-icon"><MoreVertical /></span></span>
                       </Dropdown.Toggle>
                       <Dropdown.Menu align="end">
                         <Dropdown.Item onClick={() => setDetailItem(c)}><span className="feather-icon me-2"><Eye /></span>Detail</Dropdown.Item>
                         <Dropdown.Item onClick={() => { setEditItem(c); setShowForm(true); }}><span className="feather-icon me-2"><Edit /></span>Edit</Dropdown.Item>
                         <Dropdown.Item onClick={() => setDeleteTarget(c)}><span className="feather-icon me-2"><Trash2 /></span>Delete</Dropdown.Item>
                       </Dropdown.Menu>
                     </Dropdown>
                   </td>
                 </tr>
               ))}
             </tbody>
           </Table>
           <div className="d-flex justify-content-end mt-3">
             <Pager page={page} pages={pages} onChange={setPage} />
           </div>
         </Card.Body>
       </Card>
 
       <CustomerFormModal
         show={showForm}
         onHide={() => setShowForm(false)}
         initial={editItem}
         onSubmit={(payload) => (editItem ? updateCustomer(payload) : addCustomer(payload))}
       />
 
      <CustomerDetailModal
        show={!!detailItem}
        onHide={() => setDetailItem(null)}
        data={detailItem}
      />

      <ConfirmDeleteModal
        show={!!deleteTarget}
        onHide={() => setDeleteTarget(null)}
        onConfirm={handleConfirmDelete}
        itemName={deleteTarget?.name}
        title="Hapus Customer"
      />
    </>
  )
}
 
 export default CustomerTable
