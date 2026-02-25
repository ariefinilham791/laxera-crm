'use client'
import { Modal, Button } from 'react-bootstrap';
import { AlertTriangle } from 'react-feather';

const ConfirmDeleteModal = ({ show, onHide, onConfirm, title = 'Konfirmasi Hapus', message, itemName }) => {
  const handleConfirm = () => {
    onConfirm?.();
    onHide?.();
  };
  return (
    <Modal show={show} onHide={onHide} centered>
      <Modal.Header closeButton>
        <Modal.Title className="d-flex align-items-center text-danger">
          <span className="feather-icon me-2"><AlertTriangle size={20} /></span>
          {title}
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <p className="mb-0">
          {message || (itemName ? `Apakah Anda yakin ingin menghapus "${itemName}"? Data yang dihapus tidak dapat dikembalikan.` : 'Apakah Anda yakin? Data yang dihapus tidak dapat dikembalikan.')}
        </p>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="light" onClick={onHide}>Batal</Button>
        <Button variant="danger" onClick={handleConfirm}>Ya, Hapus</Button>
      </Modal.Footer>
    </Modal>
  );
};

export default ConfirmDeleteModal;
