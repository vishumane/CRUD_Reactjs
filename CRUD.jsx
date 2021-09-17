import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './DeleteTable.css';

//mock api
const URL = 'https://jsonplaceholder.typicode.com/users';

const textInput = {
    width: '70%',
    padding: '10px',
    border: '1px solid #dfdfdf',
}

const CRUD = () => {
    const [emp, setEmp] = useState([]);
    const [edit, setEdit] = useState(false);
    const [state, setState] = useState({
        id: "",
        name: "",
        email: "",
        phone: ""
    })
    const [show, setShow] = useState(false);

    useEffect(() => {
        getData()
    }, [])

    const getData = async () => {
        const response = await axios.get(URL)
        setEmp(response.data)
    }

    //delete row by id
    const DeleteData = (id) => {
        axios.delete(`${URL}/${id}`).then(res => {
            const del = emp.filter(employee => id !== employee.id)
            setEmp(del)
        })
    }

    //update the table data
    const handleEditing = () => {
        this.setState({
            editing: true,
        })
    }

    let viewMode = {}
    let editMode = {}

    if (edit) {
        viewMode.display = "none"
    } else {
        editMode.display = "none"
    }

    const setUpdate = (updatedTitle, id) => {
        setEmp(
            emp.map(todo => {
                if (todo.id === id) {
                    todo.name = updatedTitle
                }
                return todo
            }),
        )
    }

    const handleUpdatedDone = event => {
        if (event.key === "Enter") {
            setEdit(false);
        }
    }

    //mapping to table header

    const TableHeader = () => {
        let headerElement = ['id', 'name', 'email', 'phone', 'operation', 'edit', 'insert']
        return headerElement.map((key, index) => {
            return <th key={index}>{key.toUpperCase()}</th>
        })
    }

    //send data into api

    const handleChange = (evt) => {
        const value = evt.target.value;
        setState({
            ...state,
            [evt.target.name]: value
        });

        axios.post(URL, { state })
            .then(res => {
                console.log(res);
                console.log(res.data);
            })

    }

    //html form 
    const showForm = () => {
        return (
            <div>
                <form id='add-app'>
                    id:<input type="text" name='id' value={state.id} onChange={handleChange}></input><br></br>
                    name:<input type="text" name='name' value={state.name} onChange={handleChange}></input><br></br>
                    email:<input type="text" name='email' value={state.email} onChange={handleChange}></input><br></br>
                    phone:<input type="text" name='phone' value={state.phone} onChange={handleChange}></input><br></br>
                    <button onClick={handleChange}>add</button>
                </form>
            </div>
        );
    }


    //render body of react table

    const renderBody = () => {
        return emp && emp.map(({ id, name, email, phone }) => {
            return (
                <tr key={id}>
                    <td>{id}</td>
                    <td>{name}</td>
                    <td>{email}</td>
                    <td>{phone}</td>
                    <td className='opration'>
                        <button className='button' onClick={() => DeleteData(id)}>Delete</button>
                    </td>
                    <td>
                        <div onDoubleClick={handleEditing} style={viewMode}></div>
                        <input style={textInput}
                            value={name}
                            onChange={e => {
                                setUpdate(e.target.value, id)
                            }}
                            onKeyDown={handleUpdatedDone}
                        />
                    </td>
                    <td>
                        <button onClick={() => setShow(true)}>Add New</button>
                        {show ? showForm() : null}
                    </td>
                </tr>
            )
        })
    }

    return (
        <>
            <h1 id='title'>React Table</h1>
            <table id='employee'>
                <thead>
                    <tr>{TableHeader()}</tr>
                </thead>
                <tbody>
                    {renderBody()}
                </tbody>
            </table>
        </>
    )
}
export default CRUD;