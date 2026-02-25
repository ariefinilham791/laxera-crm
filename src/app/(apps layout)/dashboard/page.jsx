"use client"
import { Col, Container, Form, InputGroup, Nav, Row, Tab, Card } from 'react-bootstrap';
import DateRangePicker from 'react-bootstrap-daterangepicker';
import moment from 'moment';
import Link from 'next/link';
import { Calendar, Layout, BarChart2, Users, Package, FileText, ShoppingCart, UserCheck } from 'react-feather';
import ActiveUserCard from './ActiveUserCard';
import AudienceReviewCard from './AudienceReviewCard';
import ReturningCustomersCard from './ReturningCustomersCard';
import CustomerTable from './CustomerTable';
import ChatBotInterface from '../apps/chat-popup/chat-bot/ChatBotInterface';

const quickLinks = [
  { to: '/crm', label: 'CRM Dashboard', icon: BarChart2, color: 'primary' },
  { to: '/crm/pelanggan', label: 'Pelanggan', icon: Users, color: 'info' },
  { to: '/crm/produk', label: 'Produk', icon: Package, color: 'success' },
  { to: '/crm/penawaran', label: 'Penawaran', icon: FileText, color: 'warning' },
  { to: '/crm/po', label: 'Purchase Order', icon: ShoppingCart, color: 'secondary' },
  { to: '/crm/sales', label: 'Sales', icon: UserCheck, color: 'danger' },
];

const Dashboard = () => {
    return (
        <>
            <ChatBotInterface show={false} />
            <Container fluid="xxl" >
                <Tab.Container activeKey="overview">
                    {/* Page Header */}
                    <div className="hk-pg-header pg-header-wth-tab pt-7 crm-header-accent">
                        <div className="d-flex">
                            <div className="d-flex flex-wrap justify-content-between flex-1">
                                <div className="mb-lg-0 mb-2 me-8 d-flex align-items-start gap-2">
                                    <span className="text-primary mt-1">
                                        <Layout size={28} strokeWidth={1.5} />
                                    </span>
                                    <div>
                                        <h1 className="pg-title mb-1">Welcome back</h1>
                                        <p className="text-muted mb-0">Ringkasan aplikasi dan akses cepat ke modul CRM</p>
                                    </div>
                                </div>
                                <div className="pg-header-action-wrap">
                                    <InputGroup className="w-300p">
                                        <span className="input-affix-wrapper">
                                            <span className="input-prefix">
                                                <span className="feather-icon">
                                                    <Calendar />
                                                </span>
                                            </span>
                                            <DateRangePicker
                                                initialSettings={{
                                                    timePicker: true,
                                                    startDate: moment().startOf('hour').toDate(),
                                                    endDate: moment().startOf('hour').add(32, 'hour').toDate(),
                                                    locale: {
                                                        format: 'M/DD hh:mm A',
                                                    },
                                                }}
                                            >
                                                <Form.Control type="text" name="datetimes" />
                                            </DateRangePicker>
                                        </span>
                                    </InputGroup>
                                </div>
                            </div>
                        </div>
                        <Nav variant="tabs" className="nav-light nav-line">
                            <Nav.Item>
                                <Nav.Link eventKey="overview" >
                                    <span className="nav-link-text">Overview</span>
                                </Nav.Link>
                            </Nav.Item>
                            <Nav.Item>
                                <Nav.Link eventKey="demo_nav_1">
                                    <span className="nav-link-text">Analytics</span>
                                </Nav.Link>
                            </Nav.Item>
                            <Nav.Item>
                                <Nav.Link eventKey="demo_nav_2">
                                    <span className="nav-link-text">Operations</span>
                                </Nav.Link>
                            </Nav.Item>
                        </Nav>
                    </div>
                    {/* /Page Header */}
                    {/* Page Body */}
                    <div className="hk-pg-body">
                        <Tab.Content>
                            <Tab.Pane eventKey="overview" >
                                {/* Quick links & summary cards */}
                                <Row className="mb-4">
                                    <Col md={12} className="mb-3">
                                        <Card className="card-border crm-card-accent-primary">
                                            <Card.Header><h6 className="mb-0">Akses Cepat</h6></Card.Header>
                                            <Card.Body>
                                                <Row className="g-3">
                                                    {quickLinks.map(({ to, label, icon: Icon, color }) => (
                                                        <Col key={to} xs={6} sm={4} md={2}>
                                                            <Link href={to} className="text-decoration-none">
                                                                <Card className={`card-border crm-card-accent-${color} h-100 mb-0 border-start border-3 border-${color}`}>
                                                                    <Card.Body className="py-3 px-3 text-center">
                                                                        <span className={`text-${color}`}><Icon size={24} className="mb-1" /></span>
                                                                        <div className="fs-8 fw-medium">{label}</div>
                                                                    </Card.Body>
                                                                </Card>
                                                            </Link>
                                                        </Col>
                                                    ))}
                                                </Row>
                                            </Card.Body>
                                        </Card>
                                    </Col>
                                </Row>
                                <Row>
                                    <Col xxl={9} lg={8} md={7} className="mb-md-4 mb-3">
                                        <AudienceReviewCard />
                                    </Col>
                                    <Col xxl={3} lg={4} md={5} className="mb-md-4 mb-3">
                                        <ReturningCustomersCard />
                                    </Col>
                                </Row>
                                <Row>
                                    <Col md={12} className="mb-md-4 mb-3">
                                        <ActiveUserCard />
                                    </Col>
                                </Row>
                                <Row>
                                    <Col md={12} className="mb-md-4 mb-3">
                                        <CustomerTable />
                                    </Col>
                                </Row>
                            </Tab.Pane>
                            <Tab.Pane eventKey="demo_nav_1" />
                            <Tab.Pane eventKey="demo_nav_2" />
                        </Tab.Content>
                    </div>
                    {/* /Page Body */}
                </Tab.Container>
            </Container>
        </>
    )
}

export default Dashboard
