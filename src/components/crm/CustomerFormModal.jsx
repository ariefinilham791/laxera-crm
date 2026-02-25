 'use client'
 import { useEffect, useState } from 'react';
 import { Modal, Button, Form, Row, Col } from 'react-bootstrap';
 import { companies } from '@/data/crm/customers';
 
 const empty = { name: '', email: '', phone: '', companyId: '', status: 'Active' };
 
 const CustomerFormModal = ({ show, onHide, onSubmit, initial }) => {
   const [data, setData] = useState(empty);
   const [errors, setErrors] = useState({});
 
   useEffect(() => {
     setData(initial || empty);
     setErrors({});
   }, [initial, show]);
 
   const validate = () => {
     const e = {};
     if (!data.name) e.name = 'Name wajib';
     if (!data.email) e.email = 'Email wajib';
     else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) e.email = 'Email tidak valid';
     setErrors(e);
     return Object.keys(e).length === 0;
   };
 
   const submit = (ev) => {
     ev.preventDefault();
     if (!validate()) return;
     onSubmit?.(data);
     onHide?.();
   };
 
   return (
     <Modal show={show} onHide={onHide} size="lg" centered>
       <Modal.Header closeButton>
         <Modal.Title>{initial ? 'Edit Customer' : 'Add Customer'}</Modal.Title>
       </Modal.Header>
       <Modal.Body>
         <Form onSubmit={submit}>
           <Row>
             <Col md={6}>
               <Form.Group className="mb-3">
                 <Form.Label>Name</Form.Label>
                 <Form.Control value={data.name} onChange={(e) => setData({ ...data, name: e.target.value })} isInvalid={!!errors.name} />
                 <Form.Control.Feedback type="invalid">{errors.name}</Form.Control.Feedback>
               </Form.Group>
             </Col>
             <Col md={6}>
               <Form.Group className="mb-3">
                 <Form.Label>Email</Form.Label>
                 <Form.Control value={data.email} onChange={(e) => setData({ ...data, email: e.target.value })} isInvalid={!!errors.email} />
                 <Form.Control.Feedback type="invalid">{errors.email}</Form.Control.Feedback>
               </Form.Group>
             </Col>
           </Row>
           <Row>
             <Col md={6}>
               <Form.Group className="mb-3">
                 <Form.Label>Phone</Form.Label>
                 <Form.Control value={data.phone} onChange={(e) => setData({ ...data, phone: e.target.value })} />
               </Form.Group>
             </Col>
             <Col md={6}>
               <Form.Group className="mb-3">
                 <Form.Label>Company</Form.Label>
                 <Form.Select value={data.companyId} onChange={(e) => setData({ ...data, companyId: e.target.value })}>
                   <option value="">-- Select Company --</option>
                   {companies.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                 </Form.Select>
               </Form.Group>
             </Col>
           </Row>
           <Row>
             <Col md={6}>
               <Form.Group className="mb-3">
                 <Form.Label>Status</Form.Label>
                 <Form.Select value={data.status} onChange={(e) => setData({ ...data, status: e.target.value })}>
                   <option value="Active">Active</option>
                   <option value="Inactive">Inactive</option>
                 </Form.Select>
               </Form.Group>
             </Col>
           </Row>
           <div className="d-flex justify-content-end">
             <Button type="submit" variant="primary">{initial ? 'Save Changes' : 'Add Customer'}</Button>
           </div>
         </Form>
       </Modal.Body>
     </Modal>
   )
 }
 
 export default CustomerFormModal
