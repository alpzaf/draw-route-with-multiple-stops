import { Modal, Button } from "flowbite-react";

interface IValidationModalProps {
  modalClose: () => void;
  isOpen: boolean;
}

export const ValidationModal: React.FC<IValidationModalProps> = ({
  modalClose,
  isOpen,
}) => {
  return (
    <>
      <Modal show={isOpen} onClose={modalClose}>
        <Modal.Header>Uyarı</Modal.Header>
        <Modal.Body>
          <div className="space-y-6">
            <p className="text-base leading-relaxed text-gray-500 dark:text-gray-400">
              Yolcu Sayısı 9 kişiden fazla olmamalıdır.
            </p>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button onClick={modalClose}>Anladım</Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};
