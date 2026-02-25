'use client'
import { useMemo, useState } from 'react';
import { Container, Row, Col, Card, Form, ListGroup, Badge, Button, InputGroup, Modal, Table } from 'react-bootstrap';
import { Users, Plus, Edit, Trash2 } from 'react-feather';
import CrmPageHeader from '@/components/crm/CrmPageHeader';
import AlertAuto from '@/components/crm/AlertAuto';
import ConfirmDeleteModal from '@/components/crm/ConfirmDeleteModal';
import { customers } from '@/data/crm/master';

const emptyForm = { name: '', email: '', phone: '' };

const PelangganPage = ({ q, setQ, view, activeTab, setActiveTab, onAdd, onEdit, onDelete, deleteTarget, setDeleteTarget }) => {
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [editItem, setEditItem] = useState(null);

  const openAdd = () => {
    setEditItem(null);
    setForm(emptyForm);
    setShowForm(true);
  };
  const openEdit = (c) => {
    setEditItem(c);
    setForm({ name: c.name, email: c.email, phone: c.phone || '' });
    setShowForm(true);
  };
  const handleSubmit = (e) => {
    e.preventDefault();
    if (editItem) {
      onEdit({ ...editItem, ...form });
    } else {
      onAdd(form);
    }
    setShowForm(false);
    setEditItem(null);
    setForm(emptyForm);
  };
  const handleConfirmDelete = () => {
    if (deleteTarget) onDelete(deleteTarget);
    setDeleteTarget(null);
  };

  return (
    <Container fluid="xxl">
      <CrmPageHeader
        title="Pelanggan"
        subtitle="Kelola daftar pelanggan. Data hanya di session (hilang saat refresh)."
        icon={Users}
        accent
        tabs={[
          { label: 'Semua', active: true },
          { label: 'Aktif' },
          { label: 'Prospek' },
        ]}
        activeIndex={activeTab}
        onTabClick={setActiveTab}
        actionRight={
          <Button variant="primary" size="sm" onClick={openAdd}>
            <Plus size={16} className="me-1" />
            Tambah Pelanggan
          </Button>
        }
      />
      <div className="hk-pg-body">
        <Row className="mb-3">
          <Col md={6}>
            <InputGroup>
              <InputGroup.Text>Search</InputGroup.Text>
              <Form.Control placeholder="Cari nama / email / telepon" value={q} onChange={(e) => setQ(e.target.value)} />
            </InputGroup>
          </Col>
        </Row>
        <Row>
          <Col md={12}>
            <Card className="card-border crm-card-accent-info">
              <Card.Header><h6 className="mb-0">Daftar Pelanggan</h6></Card.Header>
              <Card.Body>
                <div className="d-none d-md-block">
                  <Table responsive className="mb-0">
                    <thead>
                      <tr>
                        <th>ID</th>
                        <th>Nama</th>
                        <th>Email</th>
                        <th>Telepon</th>
                        <th>Aksi</th>
                      </tr>
                    </thead>
                    <tbody>
                      {view.map(c => (
                        <tr key={c.id}>
                          <td>{c.id}</td>
                          <td>{c.name}</td>
                          <td>{c.email}</td>
                          <td>{c.phone || '-'}</td>
                          <td>
                            <Button size="sm" variant="outline-secondary" className="me-1" onClick={() => openEdit(c)}><Edit size={14} /> Edit</Button>
                            <Button size="sm" variant="outline-danger" onClick={() => setDeleteTarget(c)}><Trash2 size={14} /> Hapus</Button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </Table>
                </div>
                <div className="d-md-none">
                  <ListGroup variant="flush">
                    {view.map(c => (
                      <ListGroup.Item key={c.id} className="d-flex justify-content-between align-items-center">
                        <div>
                          <div className="fw-medium">{c.name}</div>
                          <div className="fs-7">{c.email} • {c.phone || '-'}</div>
                          <Badge bg="success" className="mt-1">Aktif</Badge>
                        </div>
                        <div className="d-flex gap-1">
                          <Button size="sm" variant="outline-secondary" onClick={() => openEdit(c)}><Edit size={14} /></Button>
                          <Button size="sm" variant="outline-danger" onClick={() => setDeleteTarget(c)}><Trash2 size={14} /></Button>
                        </div>
                      </ListGroup.Item>
                    ))}
                  </ListGroup>
                </div>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </div>

      <Modal show={showForm} onHide={() => { setShowForm(false); setEditItem(null); setForm(emptyForm); }} centered>
        <Modal.Header closeButton>
          <Modal.Title>{editItem ? 'Edit Pelanggan' : 'Tambah Pelanggan'}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3">
              <Form.Label>Nama</Form.Label>
              <Form.Control value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required placeholder="Nama lengkap" />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Email</Form.Label>
              <Form.Control type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} required placeholder="email@contoh.com" />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Telepon</Form.Label>
              <Form.Control value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} placeholder="021-xxx atau 08xx" />
            </Form.Group>
            <div className="d-flex justify-content-end gap-2">
              <Button type="button" variant="light" onClick={() => setShowForm(false)}>Batal</Button>
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
        title="Hapus Pelanggan"
      />
    </Container>
  );
};

const PelangganPageWrapper = () => {
  const [q, setQ] = useState('');
  const [activeTab, setActiveTab] = useState(0);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [alert, setAlert] = useState({ show: false, text: '' });
  const initialData = useMemo(() => [...customers], []);
  const [data, setData] = useState(initialData);
  const filtered = useMemo(() => data.filter(c =>
    [c.name, c.email, c.phone].join(' ').toLowerCase().includes(q.toLowerCase())
  ), [data, q]);
  const view = useMemo(() => {
    if (activeTab === 1) return filtered;
    if (activeTab === 2) return filtered;
    return filtered;
  }, [filtered, activeTab]);

  const onAdd = (payload) => {
    const id = `CUST-${String(data.length + 1).padStart(3, '0')}`;
    setData([{ id, ...payload }, ...data]);
    setAlert({ show: true, text: 'Pelanggan berhasil ditambahkan.' });
  };
  const onEdit = (payload) => {
    setData(data.map(c => c.id === payload.id ? { ...c, ...payload } : c));
    setAlert({ show: true, text: 'Pelanggan berhasil diupdate.' });
  };
  const onDelete = (item) => {
    setData(data.filter(c => c.id !== item.id));
    setAlert({ show: true, text: 'Pelanggan berhasil dihapus.' });
  };

  return (
    <>
      {alert.show && (
        <AlertAuto show={alert.show} toast onClose={() => setAlert({ ...alert, show: false })}>
          {alert.text}
        </AlertAuto>
      )}
      <PelangganPage
        q={q}
        setQ={setQ}
        view={view}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onAdd={onAdd}
        onEdit={onEdit}
        onDelete={onDelete}
        deleteTarget={deleteTarget}
        setDeleteTarget={setDeleteTarget}
      />
    </>
  );
};

export default PelangganPageWrapper;
