import React, { useState } from 'react';
import { Row, Col, Form, Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { bookSlot, continuePay } from '../api';
import styles from './styles.module.scss';

const SlotBooking = () => {

    const initialFormDataValue = {
        entryPoint: '',
        fullName: '',
        phoneNumber: '',
        licensePlate: '',
        vType: '',
        pType: '',
        entryTime: '',
        slots: ''
    }

    const intialErrorValue = {
        fullName: false,
        phoneNumber: false,
        licensePlate: false,
    }

    const [formData, setFormData] = useState(initialFormDataValue);
    const [isError, setIsError] = useState(intialErrorValue);
    const [isConfirmed, setIsConfirmed] = useState(false);
    const [parkingType, setParkingType] = useState([]);

    const navigate = useNavigate();

    const validateNumberPlate = '^[A-Z]{2}[0-9]{2}[A-HJ-NP-Z]{1,2}[0-9]{4}$';
    // eslint-disable-next-line no-useless-escape
    const validFullName = `^([a-zA-Z]{2,}\s[a-zA-Z]{1,}'?-?[a-zA-Z]{2,}\s?([a-zA-Z]{1,})?)`;

    const isTenChars = (value) => {
        const isValid = value.trim().length === 10;
        setIsError({ ...isError, phoneNumber: !isValid })
    };
    const isNumberPlate = (value) => {
        const pattern = new RegExp(validateNumberPlate);
        setIsError({ ...isError, licensePlate: !pattern.test(value) })
    };
    const isValidName = (value) => {
        const pattern = new RegExp(validFullName);
        console.log(pattern);
        console.log(pattern.test(value));

    }

    const availableSlotsFromA = [
        {
            sp: [{ name: 'A1S', status: 'OC', dist: 4 }, { name: 'A2S', status: 'UOC', dist: 1 }, { name: 'A3S', status: 'UOC', dist: 2 }],
            mp: [{ name: 'A1M', status: 'UOC', dist: 1 }, { name: 'A2M', status: 'OC', dist: 2 }, { name: 'A3M', status: 'OC', dist: 3 }],
            lp: [{ name: 'A1L', status: 'UOC', dist: 1 }, { name: 'A2L', status: 'OC', dist: 8 }, { name: 'A3L', status: 'UOC', dist: 5 }],
        }
    ]

    const availableSlotsFromB = [
        {
            sp: [{ name: 'B1S', status: 'OC', dist: 2 }, { name: 'B2S', status: 'UOC', dist: 5 }, { name: 'B3S', status: 'UOC', dist: 3 }],
            mp: [{ name: 'B1M', status: 'UOC', dist: 4 }, { name: 'B2M', status: 'OC', dist: 2 }, { name: 'B3M', status: 'UOC', dist: 3 }],
            lp: [{ name: 'B1L', status: 'UOC', dist: 7 }, { name: 'B2L', status: 'OC', dist: 6 }, { name: 'B3L', status: 'UOC', dist: 5 }],
        }
    ]
    const availableSlotsFromC = [
        {
            sp: [{ name: 'C1S', status: 'UOC', dist: 3 }, { name: 'C2S', status: 'OC', dist: 4 }, { name: 'C3S', status: 'UOC', dist: 2 }],
            mp: [{ name: 'C1M', status: 'OC', dist: 7 }, { name: 'C2M', status: 'UOC', dist: 1 }, { name: 'C3M', status: 'OC', dist: 3 }],
            lp: [{ name: 'C1L', status: 'UOC', dist: 2 }, { name: 'C2L', status: 'OC', dist: 3 }, { name: 'C3L', status: 'UOC', dist: 5 }],
        }
    ]

    const assignSlot = () => {
        // const parkingAvailable = Object.keys(availableSlotsFromA);
        // const slotsAvailable = Object.values(availableSlotsFromA);
        // console.log(parkingAvailable);

        // const pType = formData.pType;
        // const slotsAvailable = availableSlotsFromA[0].lp.filter(el => el.status === 'UOC');

        const pType = formData.pType
        var data;
        if (formData.entryPoint === 'a') {
            data = availableSlotsFromA;
        }
        else if (formData.entryPoint === 'b') {
            data = availableSlotsFromB;
        }
        else if (formData.entryPoint === 'c') {
            data = availableSlotsFromC;
        }

        const slotsAvailable = data[0][pType].filter(el => el.status === 'UOC');
        // const slotAssigned = slotsAvailable.find(elem => elem < 3 && elem.status === 'UOC');
        // const slotAssigned = Math.min(slotsAvailable);
        // console.log(slotAssigned);

        var min = Math.min(...slotsAvailable.map(item => item.dist));

        const availableSlot = data[0][pType].filter(el => el.dist === min);
        setFormData({ ...formData, slots: availableSlot[0].name });
        setIsConfirmed(true)
    }


    const handleParkingChange = (e) => {
        setParkingType([])
        setFormData({ ...formData, vType: e.target.value });
        if (e.target.value === 's') {
            setParkingType([{ value: 'sp', text: 'Small Parking($20/hr)' }, { value: 'mp', text: 'Medium Parking($60/hr)' }, { value: 'lp', text: 'Large Parking($100/hr)' }]);
        }
        else if (e.target.value === 'm') {
            setParkingType([{ value: 'mp', text: 'Medium Parking($60/hr)' }, { value: 'lp', text: 'Large Parking($100/hr)' }]);
        }
        else if (e.target.value === 'l') {
            setParkingType([{ value: 'lp', text: 'Large Parking($100/hr)' }]);
        }
    }

    const handleChange = (e) => {
        setIsConfirmed(false)
        if (e.target.name === 'phoneNumber') {
            isTenChars(e.target.value);
        }
        else if (e.target.name === 'licensePlate') {
            isNumberPlate(e.target.value);
        }
        else if (e.target.name === 'fullName') {
            isValidName(e.target.value);
        }
        setFormData({ ...formData, [e.target.name]: e.target.value })
    }

    const timeDiff = (t2, t1) => {

        const date1 = new Date(t1)
        const date2 = new Date(t2)
        console.log(date1)
        console.log(date2);
        const ms = date2.getTime() - date1.getTime();
        const minutes = ms / (1000 * 60);
        const hours = Math.round(minutes / 60);
        console.log(hours)
        return (hours);
    }

    const continuePayment = async (data) => {
        try {
            const exitTime = data.exitTime;
            const currentTime = formData.entryTime;
            const hours = timeDiff(currentTime, exitTime);
            console.log(hours);
            const userId = data._id;
            if (hours < 1) {
                const response = await continuePay(userId, formData);
                console.log(response);
            }
        } catch (error) {
            console.log(error);
        }
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            console.log(formData);
            const { data } = await bookSlot(formData);
            console.log(data);
            if (data.exitTime) {
                console.log('exit')
                continuePayment(data, formData);
            }
            localStorage.setItem("Profile", JSON.stringify(data));
            navigate("/slots");
        } catch (error) {
            console.log(error);
        }
    }
    return (
        <>

            <Row className={styles.booking__container}>
                <Col className='d-flex flex-column justify-content-center' md={{ span: 4, offset: 4 }}>
                    <Form onSubmit={handleSubmit}>
                        <h1 className='text-center mb-4'>Parking Lot System Booking</h1>
                        <Form.Group as={Row} className='d-flex justify-content-between mb-2' >
                            <Col>
                                <Form.Label>Entry Point</Form.Label>
                                <Form.Select aria-label="Default select example" name="entryPoint" required onChange={handleChange}>
                                    <option>Entry Point</option>
                                    <option value="a">A</option>
                                    <option value="b">B</option>
                                    <option value="c">C</option>
                                </Form.Select>
                            </Col>
                            <Col>
                                <Form.Label>Full Name</Form.Label>
                                <Form.Control type='text' placeholder='Full Name' name="fullName" required onChange={handleChange} />
                                {isError.fullName && <p className={`fs-6 mt-1 ${styles.booking__error}`}>Enter Valid Name</p>}
                            </Col>
                        </Form.Group>
                        <Form.Group as={Row} className='d-flex justify-content-between mb-2'>
                            <Col>
                                <Form.Label>Phone Number</Form.Label>
                                <Form.Control type='text' placeholder='1234567890' name="phoneNumber" required onChange={handleChange} />
                                {isError.phoneNumber && <p className={`fs-6 mt-1 ${styles.booking__error}`} disabled={!isTenChars}>Maximum 10 digits allowed.</p>}
                            </Col>
                            <Col>
                                <Form.Label>License Plate</Form.Label>
                                <Form.Control type='text' placeholder='XX01YY1234' name="licensePlate" required onChange={handleChange} />
                                {isError.licensePlate && <p className={`fs-6 mt-1 ${styles.booking__error}`} disabled={!isNumberPlate}>Enter Valid Number Plate</p>}
                            </Col>
                        </Form.Group>
                        <Form.Group as={Row} className='d-flex justify-content-between align-items-center mb-3'>
                            <Col>
                                <Form.Label>Vehicle Type</Form.Label>
                                <Form.Select aria-label="Default select example" name="vType" onChange={handleParkingChange}>
                                    <option>Vehicle Type</option>
                                    <option value="s">Small</option>
                                    <option value="m">Medium</option>
                                    <option value="l">Large</option>
                                </Form.Select>
                            </Col>
                            <Col>
                                <Form.Label>Parking Type</Form.Label>
                                <Form.Select aria-label="Default select example" name="pType" onChange={handleChange}>
                                    <option>Parking Type</option>
                                    {parkingType && parkingType.map((type, index) => {
                                        return (
                                            <option key={index} value={type.value}>{type.text}</option>
                                        )
                                    })}
                                </Form.Select>
                            </Col>
                        </Form.Group>
                        <Form.Group as={Row} className='d-flex justify-content-between align-items-center'>
                            <Col>
                                <Form.Label>Entry Time</Form.Label>
                                <Form.Control className='mb-3' type='datetime-local' placeholder='Entry Time' name="entryTime" required onChange={handleChange} />
                            </Col>
                        </Form.Group>

                        <Form.Group className={styles.booking__btnContainer}>
                            {!isConfirmed && <Button className={`fw-bold ${styles.booking__btn}`} variant='warning' type='text' onClick={assignSlot}>
                                Confirm
                            </Button>}
                            {isConfirmed && <Button className={`fw-bold ${styles.booking__btn}`} variant="primary" type="submit">
                                Submit
                            </Button>}

                        </Form.Group>
                    </Form>
                </Col>
            </Row>
        </>
    )
}

export default SlotBooking