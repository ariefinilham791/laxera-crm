'use client'
import { useMemo, useState } from 'react';
import { Container, Row, Col, Card, Table, Button, Form, InputGroup } from 'react-bootstrap';
import { ShoppingCart, Plus, Trash2 } from 'react-feather';
import CrmPageHeader from '@/components/crm/CrmPageHeader';
import CreatePOModal from '@/components/crm/CreatePOModal';
import AlertAuto from '@/components/crm/AlertAuto';
import ConfirmDeleteModal from '@/components/crm/ConfirmDeleteModal';
import { formatIDR } from '@/data/crm/master';

const initialData = [
  { number: 'PO-1001', customer: 'PT Maju', date: '2026-02-23', status: 'Open', total: 20000000 },
  { number: 'PO-1002', customer: 'CV Sentosa', date: '2026-02-24', status: 'Open', total: 15750000 },
];

const POPage = () => {
  const [data, setData] = useState(initialData);
  const [showModal, setShowModal] = useState(false);
  const [q, setQ] = useState('');
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [alert, setAlert] = useState({ show: false, text: '' });

  const view = useMemo(() => data.filter(d =>
    [d.number, d.customer, d.status, d.date].join(' ').toLowerCase().includes(q.toLowerCase())
  ), [data, q]);

  const onSuccess = (payload) => {
    setData([payload, ...data]);
    setAlert({ show: true, text: 'Purchase Order berhasil ditambahkan.' });
  };

  const handleDelete = () => {
    if (deleteTarget) setData(data.filter(d => d.number !== deleteTarget.number));
    setDeleteTarget(null);
    setAlert({ show: true, text: 'PO berhasil dihapus.' });
  };

  return (
    <Container fluid="xxl">
      {alert.show && (
        <AlertAuto show={alert.show} toast onClose={() => setAlert({ ...alert, show: false })}>
          {alert.text}
        </AlertAuto>
      )}
      <CrmPageHeader
        title="Purchase Order"
        subtitle="Kelola pesanan pembelian dari pelanggan. Data hanya di session (hilang saat refresh)."
        icon={ShoppingCart}
        accent
        actionRight={
          <Button variant="primary" size="sm" onClick={() => setShowModal(true)}>
            <Plus size={16} className="me-1" />
            Buat Purchase Order
          </Button>
        }
      />
      <div className="hk-pg-body">
        <Row className="mb-3">
          <Col md={6}>
            <InputGroup>
              <InputGroup.Text>Search</InputGroup.Text>
              <Form.Control placeholder="Cari nomor, pelanggan, status..." value={q} onChange={(e) => setQ(e.target.value)} />
            </InputGroup>
          </Col>
        </Row>
        <Row>
          <Col md={12}>
            <div className="d-none d-md-block">
              <Card className="card-border crm-card-accent-success">
                <Card.Header><h6 className="mb-0">Daftar Purchase Order</h6></Card.Header>
                <Card.Body>
                  <Table responsive className="mb-0">
                    <thead>
                      <tr>
                        <th>Nomor</th>
                        <th>Pelanggan</th>
                        <th>Tanggal</th>
                        <th>Status</th>
                        <th>Total</th>
                        <th>Aksi</th>
                      </tr>
                    </thead>
                    <tbody>
                      {view.map(row => (
                        <tr key={row.number}>
                          <td>{row.number}</td>
                          <td>{row.customer}</td>
                          <td>{row.date}</td>
                          <td><span className={`badge bg-${row.status === 'Open' ? 'success' : row.status === 'Approved' ? 'info' : 'secondary'}`}>{row.status}</span></td>
                          <td>{formatIDR(row.total)}</td>
                          <td>
                            <Button size="sm" variant="outline-danger" onClick={() => setDeleteTarget(row)}><Trash2 size={14} /> Hapus</Button>
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
                {view.map(row => (
                  <Col key={row.number} xs={12} className="mb-3">
                    <Card className="card-border crm-card-accent-success">
                      <Card.Body className="d-flex justify-content-between align-items-center">
                        <div>
                          <div className="fw-medium">{row.number}</div>
                          <div className="fs-7">{row.customer} • {row.date}</div>
                          <span className={`badge bg-${row.status === 'Open' ? 'success' : 'secondary'} mt-1`}>{row.status}</span>
                        </div>
                        <div className="text-end">
                          <div className="fw-medium">{formatIDR(row.total)}</div>
                          <Button size="sm" variant="outline-danger" className="mt-2" onClick={() => setDeleteTarget(row)}><Trash2 size={14} /> Hapus</Button>
                        </div>
                      </Card.Body>
                    </Card>
                  </Col>
                ))}
              </Row>
            </div>
          </Col>
        </Row>
      </div>
      <CreatePOModal show={showModal} onHide={() => setShowModal(false)} onSuccess={onSuccess} />
      <ConfirmDeleteModal
        show={!!deleteTarget}
        onHide={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
        itemName={deleteTarget ? `${deleteTarget.number} - ${deleteTarget.customer}` : ''}
        title="Hapus Purchase Order"
      />
    </Container>
  );
};

export default POPage;
