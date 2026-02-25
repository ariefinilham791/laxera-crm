 'use client'
 import { useState } from 'react';
 import Link from 'next/link';
 import { Container, Row, Col, Card, Form, Button, Table, Alert } from 'react-bootstrap';
 import { Check, Plus, Trash2 } from 'react-feather';
 
 const CreatePOPage = () => {
   const [items, setItems] = useState([{ name: '', qty: 1, price: 0 }]);
   const [submitted, setSubmitted] = useState(false);
 
   const addItem = () => setItems([...items, { name: '', qty: 1, price: 0 }]);
   const removeItem = (idx) => setItems(items.filter((_, i) => i !== idx));
   const updateItem = (idx, field, value) => {
     const next = [...items];
     next[idx][field] = field === 'qty' || field === 'price' ? Number(value) : value;
     setItems(next);
   };
 
   const total = items.reduce((sum, it) => sum + (it.qty || 0) * (it.price || 0), 0);
 
   const onSubmit = (e) => {
     e.preventDefault();
     setSubmitted(true);
   };
 
   return (
     <Container fluid="xxl">
       <div className="hk-pg-header pt-7">
         <div className="d-flex flex-wrap justify-content-between flex-1">
           <div className="mb-lg-0 mb-2 me-8">
             <h1 className="pg-title">Buat Purchase Order</h1>
             <p>Isi detail pelanggan, tanggal, dan item PO.</p>
           </div>
           <div className="pg-header-action-wrap">
             <Button as={Link} href="/crm/po" variant="outline-light">Kembali ke PO</Button>
           </div>
         </div>
       </div>
       <div className="hk-pg-body">
         {submitted && (
           <Row className="mb-3">
             <Col md={12}>
               <Alert variant="success" className="d-flex align-items-center">
                 <span className="feather-icon me-2"><Check /></span>
                 <span>PO berhasil dibuat (simulasi). Integrasi API bisa ditambahkan sesuai kebutuhan.</span>
               </Alert>
             </Col>
           </Row>
         )}
         <Form onSubmit={onSubmit}>
           <Row>
             <Col md={6} className="mb-3">
               <Card className="card-border h-100">
                 <Card.Header><h6>Informasi Pelanggan</h6></Card.Header>
                 <Card.Body>
                   <Form.Group className="mb-3">
                     <Form.Label>Nama Pelanggan</Form.Label>
                     <Form.Control placeholder="Contoh: PT Maju" required />
                   </Form.Group>
                   <Form.Group className="mb-3">
                     <Form.Label>Email</Form.Label>
                     <Form.Control type="email" placeholder="email@domain.com" />
                   </Form.Group>
                   <Form.Group className="mb-0">
                     <Form.Label>Telepon</Form.Label>
                     <Form.Control placeholder="0812xxxxxxx" />
                   </Form.Group>
                 </Card.Body>
               </Card>
             </Col>
             <Col md={6} className="mb-3">
               <Card className="card-border h-100">
                 <Card.Header><h6>Informasi PO</h6></Card.Header>
                 <Card.Body>
                   <Form.Group className="mb-3">
                     <Form.Label>Nomor PO</Form.Label>
                     <Form.Control placeholder="PO-1003" required />
                   </Form.Group>
                   <Form.Group className="mb-3">
                     <Form.Label>Tanggal</Form.Label>
                     <Form.Control type="date" required />
                   </Form.Group>
                   <Form.Group className="mb-0">
                     <Form.Label>Status</Form.Label>
                     <Form.Select defaultValue="Open">
                       <option>Open</option>
                       <option>Approved</option>
                       <option>Closed</option>
                     </Form.Select>
                   </Form.Group>
                 </Card.Body>
               </Card>
             </Col>
           </Row>
           <Row>
             <Col md={12} className="mb-3">
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
                   <div className="d-none d-md-block">
                     <Table responsive className="mb-0">
                       <thead>
                         <tr>
                           <th>Nama Item</th>
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
                               <Form.Control value={it.name} onChange={(e) => updateItem(idx, 'name', e.target.value)} placeholder="Nama item" />
                             </td>
                             <td style={{maxWidth: 120}}>
                               <Form.Control type="number" min={1} value={it.qty} onChange={(e) => updateItem(idx, 'qty', e.target.value)} />
                             </td>
                             <td style={{maxWidth: 160}}>
                               <Form.Control type="number" min={0} value={it.price} onChange={(e) => updateItem(idx, 'price', e.target.value)} />
                             </td>
                             <td>{(it.qty || 0) * (it.price || 0)}</td>
                             <td>
                               <Button variant="flush-dark" className="btn-icon btn-rounded flush-soft-hover" onClick={() => removeItem(idx)}>
                                 <span className="icon"><span className="feather-icon"><Trash2 /></span></span>
                               </Button>
                             </td>
                           </tr>
                         ))}
                       </tbody>
                     </Table>
                   </div>
                   <div className="d-md-none">
                     {items.map((it, idx) => (
                       <Card key={idx} className="card-border mb-2">
                         <Card.Body>
                           <Form.Group className="mb-2">
                             <Form.Label>Nama Item</Form.Label>
                             <Form.Control value={it.name} onChange={(e) => updateItem(idx, 'name', e.target.value)} placeholder="Nama item" />
                           </Form.Group>
                           <div className="d-flex gap-2">
                             <Form.Control type="number" min={1} value={it.qty} onChange={(e) => updateItem(idx, 'qty', e.target.value)} placeholder="Qty" />
                             <Form.Control type="number" min={0} value={it.price} onChange={(e) => updateItem(idx, 'price', e.target.value)} placeholder="Harga" />
                           </div>
                           <div className="d-flex justify-content-between align-items-center mt-2">
                             <div className="fw-medium">Subtotal: {(it.qty || 0) * (it.price || 0)}</div>
                             <Button variant="outline-light" size="sm" onClick={() => removeItem(idx)}>Hapus</Button>
                           </div>
                         </Card.Body>
                       </Card>
                     ))}
                     <Button variant="outline-light" size="sm" onClick={addItem}>Tambah Item</Button>
                   </div>
                 </Card.Body>
               </Card>
             </Col>
           </Row>
           <Row>
             <Col md={12}>
               <Card className="card-border">
                 <Card.Body className="d-flex justify-content-between align-items-center">
                   <div className="fw-medium">Total</div>
                   <div className="display-6">{total}</div>
                 </Card.Body>
               </Card>
             </Col>
           </Row>
           <div className="d-flex justify-content-end mt-3">
             <Button type="submit" variant="primary">Simpan PO</Button>
           </div>
         </Form>
       </div>
     </Container>
   )
 }
 
 export default CreatePOPage
