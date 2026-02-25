'use client'
import { useMemo, useState } from 'react';
import { Container, Row, Col, Card, Table, Form, InputGroup, Modal, Button, Badge } from 'react-bootstrap';
import { FileText, Plus, Trash2 } from 'react-feather';
import CrmPageHeader from '@/components/crm/CrmPageHeader';
import AlertAuto from '@/components/crm/AlertAuto';
import ConfirmDeleteModal from '@/components/crm/ConfirmDeleteModal';
import { customers } from '@/data/crm/master';
import { formatIDR } from '@/data/crm/master';

const initialData = [
  { code: 'PEN-001', customer: 'PT Maju', date: '2026-02-20', status: 'Draft', total: 12500000 },
  { code: 'PEN-002', customer: 'CV Sentosa', date: '2026-02-22', status: 'Sent', total: 8200000 },
  { code: 'PEN-003', customer: 'Acme Group', date: '2026-02-24', status: 'Approved', total: 15400000 },
];

const PenawaranPage = () => {
  const [data, setData] = useState(initialData);
  const [q, setQ] = useState('');
  const [activeTab, setActiveTab] = useState(0);
  const [showAdd, setShowAdd] = useState(false);
  const [form, setForm] = useState({ customer: '', date: '', status: 'Draft', total: 0 });
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [alert, setAlert] = useState({ show: false, text: '' });

  const searchFiltered = useMemo(() => data.filter(it =>
    [it.code, it.customer, it.status, it.date].join(' ').toLowerCase().includes(q.toLowerCase())
  ), [data, q]);

  const inCurrentQuarter = (iso) => {
    const d = new Date(iso);
    const now = new Date();
    const qNow = Math.floor(now.getMonth() / 3);
    const qD = Math.floor(d.getMonth() / 3);
    return d.getFullYear() === now.getFullYear() && qD === qNow;
  };

  const view = useMemo(() => {
    if (activeTab === 1) return searchFiltered.filter(it => it.status === 'Approved');
    if (activeTab === 2) return searchFiltered.filter(it => inCurrentQuarter(it.date));
    return searchFiltered;
  }, [activeTab, searchFiltered]);

  const tabs = [
    { label: 'Semua Penawaran' },
    { label: 'Best Case' },
    { label: 'Kuartal Ini' },
  ];

  const addPenawaran = (ev) => {
    ev.preventDefault();
    const code = `PEN-${String(data.length + 1).padStart(3, '0')}`;
    const customerName = customers.find(c => String(c.id) === String(form.customer))?.name || form.customer;
    setData([{ code, customer: customerName, date: form.date, status: form.status, total: Number(form.total) }, ...data]);
    setShowAdd(false);
    setForm({ customer: '', date: '', status: 'Draft', total: 0 });
    setActiveTab(0);
    setAlert({ show: true, text: 'Penawaran berhasil ditambahkan.' });
  };

  const handleDelete = () => {
    if (deleteTarget) setData(data.filter(it => it.code !== deleteTarget.code));
    setDeleteTarget(null);
    setAlert({ show: true, text: 'Penawaran berhasil dihapus.' });
  };

  return (
    <Container fluid="xxl">
      {alert.show && (
        <AlertAuto show={alert.show} toast onClose={() => setAlert({ ...alert, show: false })}>
          {alert.text}
        </AlertAuto>
      )}
      <CrmPageHeader
        title="Penawaran"
        subtitle="Kelola penawaran untuk prospek pelanggan. Data hanya di session (hilang saat refresh)."
        icon={FileText}
        accent
        tabs={tabs}
        activeIndex={activeTab}
        onTabClick={setActiveTab}
        actionRight={
          <Button variant="primary" size="sm" onClick={() => setShowAdd(true)}>
            <Plus size={16} className="me-1" />
            Tambah Penawaran
          </Button>
        }
      />
      <div className="hk-pg-body">
        <Row className="mb-3">
          <Col md={6}>
            <InputGroup>
              <InputGroup.Text>Search</InputGroup.Text>
              <Form.Control placeholder="Cari kode, pelanggan, status..." value={q} onChange={(e) => setQ(e.target.value)} />
            </InputGroup>
          </Col>
        </Row>
        <Row>
          <Col md={12}>
            <Card className="card-border crm-card-accent-warning">
              <Card.Header><h6 className="mb-0">Daftar Penawaran {activeTab === 1 && <Badge bg="success" className="ms-2">Best Case</Badge>} {activeTab === 2 && <Badge bg="info" className="ms-2">Kuartal Ini</Badge>}</h6></Card.Header>
              <Card.Body>
                <Table responsive className="mb-0">
                  <thead>
                    <tr>
                      <th>Kode</th>
                      <th>Pelanggan</th>
                      <th>Tanggal</th>
                      <th>Status</th>
                      <th>Total</th>
                      <th>Aksi</th>
                    </tr>
                  </thead>
                  <tbody>
                    {view.map(it => (
                      <tr key={it.code}>
                        <td>{it.code}</td>
                        <td>{it.customer}</td>
                        <td>{it.date}</td>
                        <td><Badge bg={it.status === 'Approved' ? 'success' : it.status === 'Sent' ? 'info' : 'secondary'}>{it.status}</Badge></td>
                        <td>{formatIDR(it.total)}</td>
                        <td>
                          <Button size="sm" variant="outline-danger" onClick={() => setDeleteTarget(it)}><Trash2 size={14} /> Hapus</Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              </Card.Body>
            </Card>
          </Col>
        </Row>

        <Modal show={showAdd} onHide={() => setShowAdd(false)} centered>
          <Modal.Header closeButton>
            <Modal.Title>Tambah Penawaran</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form onSubmit={addPenawaran}>
              <Form.Group className="mb-3">
                <Form.Label>Pelanggan</Form.Label>
                <Form.Select value={form.customer} onChange={(e) => setForm({ ...form, customer: e.target.value })}>
                  <option value="">-- Pilih Pelanggan --</option>
                  {customers.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                </Form.Select>
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Tanggal</Form.Label>
                <Form.Control type="date" value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })} />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Status</Form.Label>
                <Form.Select value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })}>
                  {['Draft','Sent','Approved'].map(s => <option key={s} value={s}>{s}</option>)}
                </Form.Select>
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Total (Rp)</Form.Label>
                <Form.Control type="number" min={0} value={form.total} onChange={(e) => setForm({ ...form, total: e.target.value })} />
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
          onConfirm={handleDelete}
          itemName={deleteTarget ? `${deleteTarget.code} - ${deleteTarget.customer}` : ''}
          title="Hapus Penawaran"
        />
      </div>
    </Container>
  );
};
 
export default PenawaranPage
