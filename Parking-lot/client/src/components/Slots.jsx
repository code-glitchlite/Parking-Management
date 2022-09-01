import React, { useState, useEffect } from 'react'
import { Container, Row, Col, Card, Button, Modal } from 'react-bootstrap';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import { chargeUser, getSlots } from '../api';
import styles from './styles.module.scss';

const Slots = () => {

    const [show, setShow] = useState(false);
    const [price, setPrice] = useState(0);
    const [slots, setSlots] = useState([]);


    const getAllSlots = async () => {
        try {
            const { data } = await getSlots();
            console.log(data);
            setSlots(data);
        } catch (error) {
            console.log(error);
        }
    }

    useEffect(() => {
        getAllSlots()
    }, [])

    const filteredSlots = slots.filter(ele => ele.exit === false);

    const timeDiff = (t1, t2) => {
        const ms = t2.getTime() - t1.getTime();
        const minutes = ms / (1000 * 60);
        const hours = Math.ceil(minutes / 60);
        console.log(hours)
        return (hours)
    }

    const under24hrs = (hours, slot) => {
        const extraHrs = hours - 3;
        let basePrice = 40;

        if (hours === 1 && slot.continuePark === true) {
            console.log('second')
            basePrice = 0;
            if (slot.pType === 'sp') {
                setPrice(hours * 20);
            }
            else if (slot.pType === 'mp') {
                setPrice(hours * 60);
            }
            else if (slot.pType === 'lp') {
                setPrice(hours * 100);
            }
        }

        else {
            if (hours < 3 && slot.continuePark === false) {
                console.log('first');
                setPrice(basePrice);
            }
            else if (slot.pType === 'sp' && hours > 3) {
                setPrice(extraHrs * 20 + basePrice)
            }
            else if (slot.pType === 'mp' && hours > 3) {
                setPrice(extraHrs * 60 + basePrice)
            }
            else if (slot.pType === 'lp' && hours > 3) {
                setPrice(extraHrs * 100 + basePrice)
            }
        }
    }

    const moreThan24hrs = (hours, slot) => {

        const finalHours = hours - 24;

        if (slot.pType === 'sp') {
            setPrice(5000 + (finalHours * 20))
        }
        else if (slot.pType === 'mp') {
            setPrice(5000 + (finalHours * 60))
        }
        else if (slot.pType === 'lp') {
            setPrice(5000 + (finalHours * 100))
        }
    }



    const calcPrice = (slot) => {
        handleModal();
        localStorage.setItem("user", JSON.stringify(slot));
        const currentDate = new Date();
        const EntryTime = new Date(slot.entryTime);
        const hours = timeDiff(EntryTime, currentDate)
        if (hours < 24) {
            under24hrs(hours, slot)
        }
        else if (hours > 24) {
            moreThan24hrs(hours, slot)
        }
        else if (hours === 24) {
            setPrice(5000)
        }
    }

    const handleModal = () => {
        setShow(!show)
    }

    const handlePayment = async () => {
        handleModal();
        const user = JSON.parse(localStorage.getItem("user"));
        try {
            const userId = user._id;
            const exitTime = new Date();
            const response = await chargeUser(userId, price, exitTime);
            console.log(response.data);
            toast.success(response.data.message);
            getAllSlots();
        } catch (error) {
            console.log(error);
        }
    }

    return (
        <>

            <Row className='mt-3'>
                <Col>
                    <h1 className='text-center'>Booked Slots</h1>
                </Col>
            </Row>

            <Container>
                <Row className='mt-4 gy-5 pb-5'>
                    {filteredSlots && filteredSlots.map((slot, index) => {
                        return (
                            <Col key={index} md={3}>
                                <Card className={`p-2 ${styles.slot__card}`}>
                                    <Card.Img variant="top" src="/hero.jpg" />
                                    <Card.Body>
                                        <Card.Title>{slot.fullName} ({slot.phoneNumber})</Card.Title>
                                        <Card.Body className='p-2'>
                                            <div className='d-flex align-items-center'>
                                                <h5>Entry Point:</h5>
                                                <p className={`ms-2 mb-1 ${styles.slot__input}`}>{slot.entryPoint.toUpperCase()}</p>
                                            </div>
                                            <div>
                                                <h5>Vehicle Details</h5>
                                                <div className='d-flex justify-content-between align-items-center'>
                                                    <p>{slot.vType.toUpperCase()}</p>
                                                    <p className=''>{slot.licensePlate}</p>
                                                </div>
                                            </div>
                                            <div>
                                                <h5>Parking Details</h5>
                                                <p className='mb-1'>{slot.pType.toUpperCase()}</p>
                                                <p className='mb-1'>{slot.entryTime}</p>
                                            </div>
                                            <div className='mt-2'>
                                                <h5>Alloted Space</h5>
                                                <p className='mb-1'>{slot.slots}</p>
                                            </div>
                                        </Card.Body>
                                        <Button variant="danger" onClick={() => calcPrice(slot)}>Exit</Button>
                                    </Card.Body>
                                </Card>
                            </Col>
                        )
                    })}
                </Row>

                <Modal show={show} onHide={handleModal}>
                    <Modal.Header closeButton>
                        <Modal.Title>Parking Charged</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <span>{`Parking Charges: $${price}`}</span>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="outline-secondary" onClick={handlePayment}>
                            Pay
                        </Button>
                    </Modal.Footer>
                </Modal>
                <ToastContainer />
            </Container>
        </>
    )
}

export default Slots