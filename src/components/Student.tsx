import { Button, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader, useDisclosure } from '@nextui-org/react'

export const Student = ({name} : {name:string}) => {

  const {isOpen, onOpen, onOpenChange} = useDisclosure()

  return (
    <>
    <Button onPress={onOpen} className='font-bold' color='primary'>{name}</Button>
    <Modal isOpen={isOpen} onOpenChange={onOpenChange} className='bg-[#1b1b1f] text-white' classNames={{closeButton: "hover:bg-[#2a2a30]"}}>
      <ModalContent>
        {(onClose) => (
          <>
            <ModalHeader className="flex flex-col gap-1 font-bold">{name}</ModalHeader>
            <ModalBody>
              <div>
                <p className='font-bold'>Kurzus(ok):</p>
                <div className='flex gap-2 pl-2'>
                  <p className='bg-gradient-to-r from-orange-500 to-orange-500/75 p-1 px-2 rounded-xl'>Scratch</p>
                  <p className='bg-gradient-to-r from-red-500 to-red-500/75 p-1 px-2 rounded-xl'>Webfejleszés</p>
                  <p className='bg-gradient-to-r from-primary to-primary/75 p-1 px-2 rounded-xl'>WeDo 2.0</p>
                </div>
              </div>
              <div>
                <p className='font-bold'>Megjegyzés:</p>
                <div className='pl-2'>
                  <p>Scratch név: username</p>
                  <p>Scratch jelszó: password</p>
                  <p>
                    Lorem ipsum dolor, sit amet consectetur adipisicing elit. 
                    Debitis quisquam vero doloribus odit officia omnis, 
                    quam quaerat, magnam animi porro nam laborum 
                    perferendis possimus. Quaerat laborum vitae 
                    voluptatem voluptatibus animi.
                  </p>
                </div>
              </div>
            </ModalBody>
            <hr className='border-[#2a2a30] border-2 mx-4'/>
            <ModalFooter className='flex justify-between'>
              <div className='flex gap-2'>
                <Button color='primary' onPress={onClose} className='font-bold'>
                  Jelen volt
                </Button>
                <Button color='danger' onPress={onClose} className='font-bold'>
                  Nem volt Jelenlét
                </Button>
              </div>
              <Button color="danger" variant="light" onPress={onClose} className='font-bold'>
                Bezárás
              </Button>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  </>
  )
}
