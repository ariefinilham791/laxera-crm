'use client'
import { Button, Container, Nav } from 'react-bootstrap';

const CrmPageHeader = ({ title, subtitle, tabs = [], actionRight, activeIndex, onTabClick, icon: Icon, accent }) => {
  return (
    <div className={`hk-pg-header pt-7 ${accent ? 'crm-header-accent' : ''}`}>
      <div className="d-flex flex-wrap justify-content-between flex-1">
        <div className="mb-lg-0 mb-2 me-8 d-flex align-items-start gap-2">
          {Icon && (
            <span className="text-primary mt-1">
              <Icon size={28} strokeWidth={1.5} />
            </span>
          )}
          <div>
            <h1 className="pg-title mb-1">{title}</h1>
            {subtitle && <p className="text-muted mb-0">{subtitle}</p>}
          </div>
        </div>
        {actionRight && <div className="pg-header-action-wrap">{actionRight}</div>}
      </div>
      {tabs.length > 0 && (
        <Nav variant="tabs" className="nav-light nav-line mt-3">
          {tabs.map((t, i) => (
            <Nav.Item key={i}>
             <Nav.Link active={typeof activeIndex === 'number' ? activeIndex === i : !!t.active} onClick={() => onTabClick?.(i, t)}>
                <span className="nav-link-text">{t.label}</span>
              </Nav.Link>
            </Nav.Item>
          ))}
        </Nav>
      )}
    </div>
  )
}

export default CrmPageHeader
