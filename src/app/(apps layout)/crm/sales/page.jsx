'use client'
import { useMemo, useState } from 'react';
import { Container, Row, Col, Card, Badge, Button, InputGroup, Form, Table, Modal } from 'react-bootstrap';
import { UserCheck, Plus, TrendingUp, Target } from 'react-feather';
import CrmPageHeader from '@/components/crm/CrmPageHeader';
import ConfirmDeleteModal from '@/components/crm/ConfirmDeleteModal';
import AlertAuto from '@/components/crm/AlertAuto';
import { salesReps, formatIDR } from '@/data/crm/master';

const SalesPage = ({ q, setQ, view, activeTab, setActiveTab, onDetail, onAdd, onUpdate, onDelete, deleteTarget, setDeleteTarget }) => {
  const [showAdd, setShowAdd] = useState(false);
  const [addForm, setAddForm] = useState({ name: '', department: 'Enterprise', status: 'Aktif', quotaAchieved: 0 });
  const [showEdit, setShowEdit] = useState(false);
  const [editItem, setEditItem] = useState(null);
  const [editForm, setEditForm] = useState({ name: '', department: 'Enterprise', status: 'Aktif', quotaAchieved: 0 });
  const totalTarget = useMemo(() => view.reduce((sum, s) => sum + s.quotaTarget, 0), [view]);
  const totalAchieved = useMemo(() => view.reduce((sum, s) => sum + s.quotaAchieved, 0), [view]);
  const activeCount = useMemo(() => view.filter(s => s.status === 'Aktif').length, [view]);
  const progress = Math.round((totalAchieved / Math.max(1, totalTarget)) * 100);
  const handleConfirmDelete = () => {
    if (deleteTarget) onDelete(deleteTarget);
    setDeleteTarget(null);
  };
  return (
    <Container fluid="xxl">
      <CrmPageHeader
        title="Sales"
        subtitle="Kelola tim sales, target, dan performa."
        icon={UserCheck}
        accent
        tabs={[
          { label: 'Semua' },
          { label: 'Aktif' },
          { label: 'Cuti' },
        ]}
        activeIndex={activeTab}
        onTabClick={setActiveTab}
        actionRight={
          <Button variant="primary" size="sm" onClick={() => setShowAdd(true)}>
            <Plus size={16} className="me-1" />
            Tambah Sales
          </Button>
        }
      />
      <div className="hk-pg-body">
        <Row className="mb-3">
          <Col md={6}>
            <InputGroup>
              <InputGroup.Text>Search</InputGroup.Text>
              <Form.Control placeholder="Cari nama/bagian/region" value={q} onChange={(e) => setQ(e.target.value)} />
            </InputGroup>
          </Col>
        </Row>
        <Row className="mb-4">
          <Col lg={4} md={6} className="mb-md-4 mb-3">
            <Card className="card-border h-100 crm-card-accent-success">
              <Card.Header><h6 className="mb-0">Total Sales</h6></Card.Header>
              <Card.Body><div className="display-6 text-success">{formatIDR(totalAchieved)}</div></Card.Body>
            </Card>
          </Col>
          <Col lg={4} md={6} className="mb-md-4 mb-3">
            <Card className="card-border h-100 crm-card-accent-info">
              <Card.Header><h6 className="mb-0">Total Bagian</h6></Card.Header>
              <Card.Body><div className="display-6">{new Set(view.map(s => s.department)).size}</div></Card.Body>
            </Card>
          </Col>
          <Col lg={4} md={12} className="mb-md-4 mb-3">
            <Card className="card-border h-100 crm-card-accent-primary">
              <Card.Header><h6 className="mb-0">Jumlah Sales</h6></Card.Header>
              <Card.Body><div className="display-6">{view.length}</div></Card.Body>
            </Card>
          </Col>
        </Row>
        <Row>
          <Col md={12}>
            <Card className="card-border crm-card-accent-primary">
              <Card.Header><h6 className="mb-0">Daftar Sales</h6></Card.Header>
              <Card.Body>
                <Table responsive className="mb-0">
                  <thead>
                    <tr>
                      <th>Nama</th>
                      <th>Bagian</th>
                      <th>Status</th>
                      <th>Total Sales</th>
                      <th>Aksi</th>
                    </tr>
                  </thead>
                  <tbody>
                    {view.map(s => (
                      <tr key={s.id}>
                        <td>{s.name}</td>
                        <td>{s.department}</td>
                        <td><Badge bg={s.status === 'Aktif' ? 'success' : 'secondary'}>{s.status}</Badge></td>
                        <td>{formatIDR(s.quotaAchieved)}</td>
                        <td className="d-flex gap-2 flex-wrap">
                          <Button size="sm" variant="outline-primary" onClick={() => onDetail(s)}>Detail</Button>
                          <Button size="sm" variant="outline-secondary" onClick={() => { setEditItem(s); setEditForm({ name: s.name, department: s.department, status: s.status, quotaAchieved: s.quotaAchieved }); setShowEdit(true); }}>Edit</Button>
                          <Button size="sm" variant="outline-danger" onClick={() => setDeleteTarget(s)}>Hapus</Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </div>
      <ConfirmDeleteModal
        show={!!deleteTarget}
        onHide={() => setDeleteTarget(null)}
        onConfirm={handleConfirmDelete}
        itemName={deleteTarget?.name}
        title="Hapus Sales"
      />
      <Modal show={showAdd} onHide={() => setShowAdd(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Tambah Sales</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={(e) => { e.preventDefault(); onAdd(addForm); setShowAdd(false); setAddForm({ name: '', department: 'Enterprise', status: 'Aktif', quotaAchieved: 0 }); }}>
            <Form.Group className="mb-3">
              <Form.Label>Nama</Form.Label>
              <Form.Control value={addForm.name} onChange={(e) => setAddForm({ ...addForm, name: e.target.value })} />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Bagian</Form.Label>
              <Form.Select value={addForm.department} onChange={(e) => setAddForm({ ...addForm, department: e.target.value })}>
                {['Enterprise','SMB','Channel'].map(d => <option key={d} value={d}>{d}</option>)}
              </Form.Select>
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Status</Form.Label>
              <Form.Select value={addForm.status} onChange={(e) => setAddForm({ ...addForm, status: e.target.value })}>
                {['Aktif','Cuti'].map(st => <option key={st} value={st}>{st}</option>)}
              </Form.Select>
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Total Sales (Rp)</Form.Label>
              <Form.Control type="number" value={addForm.quotaAchieved} onChange={(e) => setAddForm({ ...addForm, quotaAchieved: Number(e.target.value) })} />
            </Form.Group>
            <div className="d-flex justify-content-end">
              <Button type="submit" variant="primary">Simpan</Button>
            </div>
          </Form>
        </Modal.Body>
      </Modal>
      <Modal show={showEdit} onHide={() => setShowEdit(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Edit Sales</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={(e) => { e.preventDefault(); onUpdate({ id: editItem.id, ...editForm }); setShowEdit(false); setEditItem(null); }}>
            <Form.Group className="mb-3">
              <Form.Label>Nama</Form.Label>
              <Form.Control value={editForm.name} onChange={(e) => setEditForm({ ...editForm, name: e.target.value })} />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Bagian</Form.Label>
              <Form.Select value={editForm.department} onChange={(e) => setEditForm({ ...editForm, department: e.target.value })}>
                {['Enterprise','SMB','Channel'].map(d => <option key={d} value={d}>{d}</option>)}
              </Form.Select>
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Status</Form.Label>
              <Form.Select value={editForm.status} onChange={(e) => setEditForm({ ...editForm, status: e.target.value })}>
                {['Aktif','Cuti'].map(st => <option key={st} value={st}>{st}</option>)}
              </Form.Select>
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Total Sales (Rp)</Form.Label>
              <Form.Control type="number" value={editForm.quotaAchieved} onChange={(e) => setEditForm({ ...editForm, quotaAchieved: Number(e.target.value) })} />
            </Form.Group>
            <div className="d-flex justify-content-end">
              <Button type="submit" variant="primary">Simpan</Button>
            </div>
          </Form>
        </Modal.Body>
      </Modal>
    </Container>
  )
}

const SalesPageWrapper = () => {
  const [q, setQ] = useState('');
  const [activeTab, setActiveTab] = useState(0);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [alert, setAlert] = useState({ show: false, text: '' });
  const initialBase = useMemo(() => salesReps.map((s, i) => ({
    ...s,
    department: ['Enterprise', 'SMB', 'Channel'][i % 3],
    role: 'Account Executive',
    email: `${s.name.toLowerCase()}@company.co`.replace(/\s+/g, ''),
    phone: `0812${String(100000 + i)}`,
    region: ['Jakarta', 'Bandung', 'Surabaya'][i % 3],
    status: i % 4 === 0 ? 'Cuti' : 'Aktif',
    quotaTarget: 50000000 + (i % 5) * 10000000,
    quotaAchieved: 20000000 + (i % 5) * 8000000,
    deals: 5 + (i % 4),
    pipelineValue: 15000000 + (i % 6) * 5000000,
  })), []);
  const [data, setData] = useState(initialBase);
  const filtered = useMemo(() => data.filter(s =>
    [s.name, s.department, s.region, s.email].join(' ').toLowerCase().includes(q.toLowerCase())
  ), [data, q]);
  const view = useMemo(() => {
    if (activeTab === 1) return filtered.filter(s => s.status === 'Aktif');
    if (activeTab === 2) return filtered.filter(s => s.status === 'Cuti');
    return filtered;
  }, [filtered, activeTab]);
  const [detail, setDetail] = useState(null);
  const onAdd = (payload) => {
    const id = `SLS-${String(data.length + 1).padStart(3, '0')}`;
    setData([{ id, name: payload.name, department: payload.department, status: payload.status, quotaAchieved: payload.quotaAchieved, quotaTarget: 0, role: 'Account Executive', email: `${payload.name.toLowerCase()}@company.co`.replace(/\s+/g, ''), phone: `0812${String(100000 + data.length)}`, region: 'Jakarta', deals: 0, pipelineValue: 0 }, ...data]);
    setActiveTab(0);
    setAlert({ show: true, text: 'Sales berhasil ditambahkan.' });
  };
  const onUpdate = (payload) => {
    setData(data.map(s => s.id === payload.id ? { ...s, ...payload } : s));
    setAlert({ show: true, text: 'Sales berhasil diupdate.' });
  };
  const onDelete = (item) => {
    setData(data.filter(s => s.id !== item.id));
    setAlert({ show: true, text: 'Sales berhasil dihapus.' });
  };
  return (
    <>
      {alert.show && (
        <AlertAuto show={alert.show} toast onClose={() => setAlert({ ...alert, show: false })}>
          {alert.text}
        </AlertAuto>
      )}
      <SalesPage
        q={q}
        setQ={setQ}
        view={view}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onDetail={setDetail}
        onAdd={onAdd}
        onUpdate={onUpdate}
        onDelete={onDelete}
        deleteTarget={deleteTarget}
        setDeleteTarget={setDeleteTarget}
      />
      <Modal show={!!detail} onHide={() => setDetail(null)} centered size="lg">
        <Modal.Header closeButton>
          <Modal.Title>Detail Karyawan</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {detail && (
            <Row>
              <Col md={6} className="mb-2">
                <div className="fw-medium">Nama</div>
                <div className="text-muted">{detail.name}</div>
              </Col>
              <Col md={6} className="mb-2">
                <div className="fw-medium">Bagian</div>
                <div className="text-muted">{detail.department}</div>
              </Col>
              <Col md={6} className="mb-2">
                <div className="fw-medium">Role</div>
                <div className="text-muted">{detail.role}</div>
              </Col>
              <Col md={6} className="mb-2">
                <div className="fw-medium">Email</div>
                <div className="text-muted">{detail.email}</div>
              </Col>
              <Col md={6} className="mb-2">
                <div className="fw-medium">Phone</div>
                <div className="text-muted">{detail.phone}</div>
              </Col>
              <Col md={6} className="mb-2">
                <div className="fw-medium">Region</div>
                <div className="text-muted">{detail.region}</div>
              </Col>
              <Col md={6} className="mb-2">
                <div className="fw-medium">Status</div>
                <Badge bg={detail.status === 'Aktif' ? 'success' : 'secondary'}>{detail.status}</Badge>
              </Col>
              <Col md={6} className="mb-2">
                <div className="fw-medium">Deals</div>
                <div className="text-muted">{detail.deals}</div>
              </Col>
              <Col md={6} className="mb-2">
                <div className="fw-medium">Target</div>
                <div className="text-muted">{formatIDR(detail.quotaTarget)}</div>
              </Col>
              <Col md={6} className="mb-2">
                <div className="fw-medium">Pencapaian</div>
                <div className="text-muted">{formatIDR(detail.quotaAchieved)}</div>
              </Col>
              <Col md={6} className="mb-2">
                <div className="fw-medium">Pipeline</div>
                <div className="text-muted">{formatIDR(detail.pipelineValue)}</div>
              </Col>
            </Row>
          )}
        </Modal.Body>
      </Modal>
    </>
  )
}

export default SalesPageWrapper
