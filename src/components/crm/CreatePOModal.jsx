 'use client'
 import { useMemo, useState } from 'react';
 import { Modal, Button, Card, Form, Table, Alert } from 'react-bootstrap';
 import { Check, Plus, Trash2 } from 'react-feather';
 import { customers, salesReps, products, formatIDR } from '@/data/crm/master';
 
 const CreatePOModal = ({ show, onHide, onSuccess }) => {
   const [items, setItems] = useState([{ productId: '', qty: 1, price: 0 }]);
   const [submitted, setSubmitted] = useState(false);
   const [customerId, setCustomerId] = useState('');
   const [salesId, setSalesId] = useState('');
   const [poNumber, setPoNumber] = useState('');
   const [poDate, setPoDate] = useState(new Date().toISOString().slice(0, 10));
   const [status, setStatus] = useState('Open');
 
   const addItem = () => setItems([...items, { productId: '', qty: 1, price: 0 }]);
   const removeItem = (idx) => setItems(items.filter((_, i) => i !== idx));
   const updateItem = (idx, field, value) => {
     const next = [...items];
     next[idx][field] = field === 'qty' || field === 'price' ? Number(value) : value;
     if (field === 'productId') {
       const pr = products.find(p => p.id === value);
       next[idx].price = pr ? pr.price : 0;
     }
     setItems(next);
   };
 
   const total = items.reduce((sum, it) => sum + (it.qty || 0) * (it.price || 0), 0);
   const selectedCustomer = useMemo(() => customers.find(c => c.id === customerId), [customerId]);
   const selectedSales = useMemo(() => salesReps.find(s => s.id === salesId), [salesId]);
 
   const onSubmit = (e) => {
     e.preventDefault();
     const number = poNumber || `PO-${String(Date.now()).slice(-6)}`;
     const payload = {
       number,
       customer: selectedCustomer?.name || '-',
       date: poDate,
       status,
       total,
     };
     setSubmitted(true);
     onSuccess?.(payload);
     setTimeout(() => {
       setSubmitted(false);
       onHide();
       setPoNumber('');
       setPoDate(new Date().toISOString().slice(0, 10));
       setStatus('Open');
       setCustomerId('');
       setSalesId('');
       setItems([{ productId: '', qty: 1, price: 0 }]);
     }, 800);
   };
 
   return (
     <Modal show={show} onHide={onHide} size="lg" centered>
       <Modal.Header closeButton>
         <Modal.Title>Buat Purchase Order</Modal.Title>
       </Modal.Header>
       <Modal.Body>
         {submitted && (
           <Alert variant="success" className="d-flex align-items-center">
             <span className="feather-icon me-2"><Check /></span>
             <span>PO berhasil dibuat (simulasi).</span>
           </Alert>
         )}
         <Form onSubmit={onSubmit}>
           <div className="mb-3">
             <Card className="card-border">
               <Card.Header><h6>Informasi Pelanggan</h6></Card.Header>
               <Card.Body>
                 <Form.Group className="mb-2">
                   <Form.Label>Pilih Pelanggan</Form.Label>
                   <Form.Select value={customerId} onChange={(e) => setCustomerId(e.target.value)} required>
                     <option value="">-- Pilih --</option>
                     {customers.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                   </Form.Select>
                 </Form.Group>
                 {selectedCustomer && (
                   <>
                     <div className="fs-7 text-muted">Email: {selectedCustomer.email}</div>
                     <div className="fs-7 text-muted">Telepon: {selectedCustomer.phone}</div>
                   </>
                 )}
               </Card.Body>
             </Card>
           </div>
           <div className="mb-3">
             <Card className="card-border">
               <Card.Header><h6>Informasi PO</h6></Card.Header>
               <Card.Body className="row">
                 <div className="col-md-4 mb-2">
                   <Form.Label>Nomor PO</Form.Label>
                   <Form.Control placeholder="PO-1003" value={poNumber} onChange={(e) => setPoNumber(e.target.value)} />
                 </div>
                 <div className="col-md-4 mb-2">
                   <Form.Label>Tanggal</Form.Label>
                   <Form.Control type="date" value={poDate} onChange={(e) => setPoDate(e.target.value)} required />
                 </div>
                 <div className="col-md-4 mb-2">
                   <Form.Label>Status</Form.Label>
                   <Form.Select value={status} onChange={(e) => setStatus(e.target.value)}>
                     <option>Open</option>
                     <option>Approved</option>
                     <option>Closed</option>
                   </Form.Select>
                 </div>
                 <div className="col-md-4 mb-2">
                   <Form.Label>Sales</Form.Label>
                   <Form.Select value={salesId} onChange={(e) => setSalesId(e.target.value)} required>
                     <option value="">-- Pilih --</option>
                     {salesReps.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                   </Form.Select>
                 </div>
               </Card.Body>
             </Card>
           </div>
           <div className="mb-3">
             <Card className="card-border">
               <Card.Header className="card-header-action">
                 <h6>Item PO</h6>
                 <div className="card-action-wrap">
                   <Button variant="outline-light" size="sm" onClick={addItem}>
                     <span className="icon"><span className="feather-icon"><Plus /></span></span>
                     <span className="btn-text">Tambah Item</span>
                   </Button>
                 </div>
               </Card.Header>
               <Card.Body>
                 <Table responsive className="mb-0">
                   <thead>
                     <tr>
                       <th>Produk</th>
                       <th>Qty</th>
                       <th>Harga</th>
                       <th>Subtotal</th>
                       <th>Aksi</th>
                     </tr>
                   </thead>
                   <tbody>
                     {items.map((it, idx) => (
                       <tr key={idx}>
                         <td>
                           <Form.Select value={it.productId} onChange={(e) => updateItem(idx, 'productId', e.target.value)}>
                             <option value="">-- Pilih Produk --</option>
                             {products.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
                           </Form.Select>
                         </td>
                         <td style={{maxWidth: 120}}>
                           <Form.Control type="number" min={1} value={it.qty} onChange={(e) => updateItem(idx, 'qty', e.target.value)} />
                         </td>
                         <td style={{maxWidth: 160}}>
                           <Form.Control type="number" min={0} value={it.price} onChange={(e) => updateItem(idx, 'price', e.target.value)} />
                         </td>
                         <td>{formatIDR((it.qty || 0) * (it.price || 0))}</td>
                         <td>
                           <Button variant="flush-dark" className="btn-icon btn-rounded flush-soft-hover" onClick={() => removeItem(idx)}>
                             <span className="icon"><span className="feather-icon"><Trash2 /></span></span>
                           </Button>
                         </td>
                       </tr>
                     ))}
                   </tbody>
                 </Table>
               </Card.Body>
             </Card>
           </div>
           <Card className="card-border">
             <Card.Body className="d-flex justify-content-between align-items-center">
               <div className="fw-medium">Total</div>
               <div className="display-6">{formatIDR(total)}</div>
             </Card.Body>
           </Card>
           <div className="d-flex justify-content-end mt-3">
             <Button type="submit" variant="primary">Simpan PO</Button>
           </div>
         </Form>
       </Modal.Body>
     </Modal>
   )
 }
 
 export default CreatePOModal
