 'use client'
 import { Modal, Row, Col, Badge } from 'react-bootstrap';
 import { companies } from '@/data/crm/customers';
 
 const CustomerDetailModal = ({ show, onHide, data }) => {
   if (!data) return null;
   const company = companies.find(c => c.id === data.companyId);
   return (
     <Modal show={show} onHide={onHide} size="lg" centered>
       <Modal.Header closeButton>
         <Modal.Title>Customer Detail</Modal.Title>
       </Modal.Header>
       <Modal.Body>
         <Row>
           <Col md={6} className="mb-2">
             <div className="fw-medium">ID</div>
             <div className="text-muted">{data.id}</div>
           </Col>
           <Col md={6} className="mb-2">
             <div className="fw-medium">Created At</div>
             <div className="text-muted">{data.createdAt}</div>
           </Col>
           <Col md={6} className="mb-2">
             <div className="fw-medium">Name</div>
             <div className="text-muted">{data.name}</div>
           </Col>
           <Col md={6} className="mb-2">
             <div className="fw-medium">Email</div>
             <div className="text-muted">{data.email}</div>
           </Col>
           <Col md={6} className="mb-2">
             <div className="fw-medium">Phone</div>
             <div className="text-muted">{data.phone}</div>
           </Col>
           <Col md={6} className="mb-2">
             <div className="fw-medium">Company</div>
             <div className="text-muted">{company ? company.name : '-'}</div>
           </Col>
           <Col md={6} className="mb-2">
             <div className="fw-medium">Status</div>
             <Badge bg={data.status === 'Active' ? 'success' : 'secondary'}>{data.status}</Badge>
           </Col>
         </Row>
       </Modal.Body>
     </Modal>
   )
 }
 
 export default CustomerDetailModal
