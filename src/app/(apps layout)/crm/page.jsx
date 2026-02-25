'use client'
import { useEffect, useMemo, useState } from 'react';
import { Container, Row, Col, Card, Alert, Button } from 'react-bootstrap';
import { BarChart2, Bell } from 'react-feather';
import { salesOrders, monthlyTotals, formatIDR } from '@/data/crm/master';
 
const CrmDashboard = () => {
  const thisMonthTotal = useMemo(() => {
    const now = new Date();
    const ym = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
    return salesOrders.filter(s => s.date.startsWith(ym)).reduce((sum, s) => sum + s.amount, 0);
  }, []);
  const todayTotal = useMemo(() => {
    const today = new Date().toISOString().slice(0, 10);
    return salesOrders.filter(s => s.date === today).reduce((sum, s) => sum + s.amount, 0);
  }, []);
  const weekAvg = useMemo(() => {
    const now = new Date();
    const start = new Date(now); start.setDate(now.getDate() - 6);
    const range = salesOrders.filter(s => {
      const d = new Date(s.date);
      return d >= start && d <= now;
    });
    const total = range.reduce((sum, s) => sum + s.amount, 0);
    return Math.round(total / Math.max(1, range.length));
  }, []);

  const [live, setLive] = useState(() => {
    const tail = salesOrders.slice(-20).map(s => s.amount);
    return tail;
  });
  useEffect(() => {
    const t = setInterval(() => {
      setLive(prev => {
        const last = prev[prev.length - 1] || 5000000;
        const next = Math.max(0, last + Math.floor(Math.random() * 400000) - 200000);
        const arr = [...prev, next];
        return arr.slice(arr.length - 20);
      });
    }, 2000);
    return () => clearInterval(t);
  }, []);

  const linePoints = useMemo(() => {
    const max = Math.max(...live, 1);
    const min = Math.min(...live);
    const range = Math.max(1, max - min);
    const w = 340, h = 120;
    return live.map((v, i) => {
      const x = (i / (live.length - 1)) * w;
      const y = h - ((v - min) / range) * h;
      return `${x},${y}`;
    }).join(' ');
  }, [live]);

  const monthly = useMemo(() => monthlyTotals(salesOrders).slice(-6), []);
  const maxMonthly = useMemo(() => Math.max(...monthly.map(m => m.total), 1), [monthly]);

  return (
    <Container fluid="xxl">
      <div className="hk-pg-header pt-7 crm-header-accent">
        <div className="d-flex flex-wrap justify-content-between flex-1">
          <div className="mb-lg-0 mb-2 me-8 d-flex align-items-start gap-2">
            <span className="text-primary mt-1">
              <BarChart2 size={28} strokeWidth={1.5} />
            </span>
            <div>
              <h1 className="pg-title mb-1">CRM Dashboard</h1>
              <p className="text-muted mb-0">Ringkasan aktivitas penjualan, pipeline, dan pelanggan.</p>
            </div>
          </div>
          <div className="pg-header-action-wrap">
            <Button variant="primary">
              <span className="icon">
                <span className="feather-icon">
                  <BarChart2 />
                </span>
              </span>
              <span className="btn-text">Lihat Laporan</span>
            </Button>
          </div>
        </div>
      </div>
      <div className="hk-pg-body">
        <Row className="mb-4">
          <Col md={12}>
            <Alert variant="info" className="d-flex align-items-center mb-0">
              <span className="feather-icon me-2">
                <Bell />
              </span>
              <span>Grafik dan metrik di bawah menggunakan data mock lokal dan update real-time simulasi. Data tidak disimpan permanen.</span>
            </Alert>
          </Col>
        </Row>
        <Row className="mb-4">
          <Col lg={4} md={6} className="mb-md-4 mb-3">
            <Card className="card-border h-100 crm-card-accent-success">
              <Card.Header><h6 className="mb-0">Total Penjualan Bulan Ini</h6></Card.Header>
              <Card.Body><div className="display-6 text-success">{formatIDR(thisMonthTotal)}</div></Card.Body>
            </Card>
          </Col>
          <Col lg={4} md={6} className="mb-md-4 mb-3">
            <Card className="card-border h-100 crm-card-accent-primary">
              <Card.Header><h6 className="mb-0">Penjualan Hari Ini</h6></Card.Header>
              <Card.Body><div className="display-6 text-primary">{formatIDR(todayTotal)}</div></Card.Body>
            </Card>
          </Col>
          <Col lg={4} md={12} className="mb-md-4 mb-3">
            <Card className="card-border h-100 crm-card-accent-info">
              <Card.Header><h6 className="mb-0">Rata-rata Harian (7 Hari)</h6></Card.Header>
              <Card.Body><div className="display-6 text-info">{formatIDR(weekAvg)}</div></Card.Body>
            </Card>
          </Col>
        </Row>

        <Row>
          <Col lg={6} className="mb-md-4 mb-3">
            <Card className="card-border h-100 crm-card-accent-primary">
              <Card.Header><h6 className="mb-0">Realtime Sales</h6></Card.Header>
              <Card.Body>
                <svg width="360" height="140">
                  <polyline
                    fill="none"
                    stroke="var(--bs-primary)"
                    strokeWidth="2"
                    points={linePoints}
                  />
                </svg>
                <div className="fs-7 text-muted">Update setiap 2 detik (simulasi)</div>
              </Card.Body>
            </Card>
          </Col>
          <Col lg={6} className="mb-md-4 mb-3">
            <Card className="card-border h-100 crm-card-accent-info">
              <Card.Header><h6 className="mb-0">Penjualan per Bulan (6 Bulan)</h6></Card.Header>
              <Card.Body>
                <div className="d-flex align-items-end" style={{ gap: 12, height: 140 }}>
                  {monthly.map((m, i) => (
                    <div key={m.key} className="text-center flex-grow-1">
                      <div
                        className="rounded-top"
                        style={{
                          width: '100%',
                          maxWidth: 40,
                          height: Math.max(6, Math.round((m.total / maxMonthly) * 120)),
                          backgroundColor: ['var(--bs-primary)', 'var(--bs-info)', 'var(--bs-success)', 'var(--bs-warning)', 'var(--bs-secondary)', 'var(--bs-danger)'][i % 6],
                          margin: '0 auto',
                        }}
                        title={formatIDR(m.total)}
                      />
                      <div className="fs-8 mt-1">{m.key.slice(5,7)}/{m.key.slice(2,4)}</div>
                    </div>
                  ))}
                </div>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </div>
    </Container>
  )
}
 
export default CrmDashboard
