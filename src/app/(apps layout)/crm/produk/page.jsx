'use client'
import { useMemo, useState } from 'react';
import { Container, Row, Col, Card, Table, Badge, Button, InputGroup, Form, Modal } from 'react-bootstrap';
import { Package, Plus, Trash2 } from 'react-feather';
import CrmPageHeader from '@/components/crm/CrmPageHeader';
import AlertAuto from '@/components/crm/AlertAuto';
import ConfirmDeleteModal from '@/components/crm/ConfirmDeleteModal';
import { products, formatIDR } from '@/data/crm/master';

const ProdukPage = ({ q, setQ, view, activeTab, setActiveTab, onAdd, onDelete, setAlert }) => {
  const [showAdd, setShowAdd] = useState(false);
  const [form, setForm] = useState({ name: '', price: 0, status: 'Aktif' });
  const [deleteTarget, setDeleteTarget] = useState(null);
  const handleAdd = (e) => {
    e.preventDefault();
    onAdd(form);
    setShowAdd(false);
    setForm({ name: '', price: 0, status: 'Aktif' });
    setAlert?.({ show: true, text: 'Produk berhasil ditambahkan.' });
  };
  const handleConfirmDelete = () => {
    if (deleteTarget) onDelete(deleteTarget);
    setDeleteTarget(null);
    setAlert?.({ show: true, text: 'Produk berhasil dihapus.' });
  };
  return (
     <Container fluid="xxl">
       <CrmPageHeader
         title="Produk"
         subtitle="Kelola katalog produk."
         icon={Package}
         accent
         tabs={[
           { label: 'Semua', active: true },
           { label: 'Aktif' },
           { label: 'Arsip' },
         ]}
        activeIndex={activeTab}
        onTabClick={setActiveTab}
        actionRight={
          <Button variant="primary" size="sm" onClick={() => setShowAdd(true)}>
            <Plus size={16} className="me-1" />
            Tambah Produk
          </Button>
        }
       />
       <div className="hk-pg-body">
         <Row className="mb-3">
           <Col md={6}>
             <InputGroup>
               <InputGroup.Text>Search</InputGroup.Text>
               <Form.Control placeholder="Cari kode/nama produk" value={q} onChange={(e) => setQ(e.target.value)} />
             </InputGroup>
           </Col>
         </Row>
         <Row>
           <Col md={12}>
             <div className="d-none d-md-block">
               <Card className="card-border crm-card-accent-primary">
                 <Card.Header><h6 className="mb-0">Daftar Produk</h6></Card.Header>
                 <Card.Body>
                   <Table responsive className="mb-0">
                     <thead>
                       <tr>
                         <th>Kode</th>
                         <th>Nama</th>
                         <th>Harga</th>
                         <th>Status</th>
                         <th>Aksi</th>
                       </tr>
                     </thead>
                     <tbody>
                       {view.map(p => (
                         <tr key={p.id}>
                           <td>{p.id}</td>
                           <td>{p.name}</td>
                           <td>{formatIDR(p.price)}</td>
                           <td><Badge bg={p.status === 'Aktif' ? 'success' : 'secondary'}>{p.status}</Badge></td>
                           <td>
                             <Button size="sm" variant="outline-danger" onClick={() => setDeleteTarget(p)}>
                               <Trash2 size={14} className="me-1" /> Hapus
                             </Button>
                           </td>
                         </tr>
                       ))}
                     </tbody>
                   </Table>
                 </Card.Body>
               </Card>
             </div>
             <div className="d-md-none">
               <Row>
                {view.map(p => (
                  <Col key={p.id} xs={12} className="mb-3">
                    <Card className="card-border crm-card-accent-primary">
                      <Card.Body className="d-flex justify-content-between align-items-center">
                        <div>
                          <div className="fw-medium">{p.name}</div>
                          <div className="fs-7">{p.id} • {formatIDR(p.price)}</div>
                          <Badge bg={p.status === 'Aktif' ? 'success' : 'secondary'} className="mt-2">{p.status}</Badge>
                        </div>
                        <Button size="sm" variant="outline-danger" onClick={() => setDeleteTarget(p)}><Trash2 size={14} /></Button>
                      </Card.Body>
                    </Card>
                  </Col>
                ))}
               </Row>
             </div>
           </Col>
         </Row>
       </div>
      <Modal show={showAdd} onHide={() => setShowAdd(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Tambah Produk</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleAdd}>
            <Form.Group className="mb-3">
              <Form.Label>Nama Produk</Form.Label>
              <Form.Control value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="Nama produk" />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Harga (Rp)</Form.Label>
              <Form.Control type="number" min={0} value={form.price} onChange={(e) => setForm({ ...form, price: Number(e.target.value) })} />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Status</Form.Label>
              <Form.Select value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })}>
                <option value="Aktif">Aktif</option>
                <option value="Arsip">Arsip</option>
              </Form.Select>
            </Form.Group>
            <div className="d-flex justify-content-end gap-2">
              <Button type="button" variant="light" onClick={() => setShowAdd(false)}>Batal</Button>
              <Button type="submit" variant="primary">Simpan</Button>
            </div>
          </Form>
        </Modal.Body>
      </Modal>
      <ConfirmDeleteModal
        show={!!deleteTarget}
        onHide={() => setDeleteTarget(null)}
        onConfirm={handleConfirmDelete}
        itemName={deleteTarget?.name}
        title="Hapus Produk"
      />
     </Container>
   )
 }
 
const ProdukPageWrapper = () => {
  const [q, setQ] = useState('');
  const [activeTab, setActiveTab] = useState(0);
  const [alert, setAlert] = useState({ show: false, text: '' });
  const initialBase = useMemo(() => products.map((p, idx) => ({ ...p, status: idx % 2 === 0 ? 'Aktif' : 'Arsip' })), []);
  const [data, setData] = useState(initialBase);
  const filtered = useMemo(() => data.filter(p =>
    [p.id, p.name].join(' ').toLowerCase().includes(q.toLowerCase())
  ), [data, q]);
  const view = useMemo(() => {
    if (activeTab === 1) return filtered.filter(p => p.status === 'Aktif');
    if (activeTab === 2) return filtered.filter(p => p.status === 'Arsip');
    return filtered;
  }, [filtered, activeTab]);
  const onAdd = (payload) => {
    const id = `PRD-${String(data.length + 1).padStart(3, '0')}`;
    setData([{ id, name: payload.name, price: payload.price, status: payload.status }, ...data]);
    setActiveTab(0);
  };
  const onDelete = (p) => setData(data.filter(x => x.id !== p.id));
  return (
    <>
      {alert.show && (
        <AlertAuto show={alert.show} toast onClose={() => setAlert({ ...alert, show: false })}>
          {alert.text}
        </AlertAuto>
      )}
      <ProdukPage q={q} setQ={setQ} view={view} activeTab={activeTab} setActiveTab={setActiveTab} onAdd={onAdd} onDelete={onDelete} setAlert={setAlert} />
    </>
  );
}
 
 export default ProdukPageWrapper
