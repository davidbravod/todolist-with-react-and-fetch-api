import React, { useState, useEffect, useContext } from "react";
import { Link } from "react-router-dom";
import { Context } from "../store/appContext";

//include images into your bundle
import rigoImage from "../../img/rigo-baby.jpg";

import "../../styles/index.css"

//create your first component
const ToDoList = () => {
    const { store, actions } = useContext(Context);

    const [arrTemp, setArrTemp] = useState([
        { label: "Pasear al perro", done: false },
        { label: "Ir al cine", done: false }
    ])

    const [singleOne, setSingleOne] = useState(false)

    useEffect(() => {
        let funcionCarga = async () => {
            let { respuestaJson, response } = await actions.useFetch("/apis/fake/todos/user/davidtesting")
            console.log(respuestaJson)
            setArrTemp(respuestaJson)
        }
        funcionCarga()

    }, [])

    useEffect(() => {
        document.getElementById("todo-input").value = "";
    }, [arrTemp])

    const handleDeleteAll = async () => {
        let { respuestaJson, response } = await actions.useFetch(
            "/apis/fake/todos/user/davidtesting",
            null,
            "DELETE"
        );

        if (response.ok) {
            ({ respuestaJson, response } = await actions.useFetch(
                "/apis/fake/todos/user/davidtesting",
                [],
                "POST"
            ));
            if (response.ok) {
                setArrTemp([{ label: "Add New ToDos", done: false }]);
                setSingleOne(true);
            } else {
                alert("There was an error, try again");
            }
        } else {
            alert("There was an error, try again");
        }

        console.log(respuestaJson);
    };

    return (
        <>
            <div className="container bg-light" style={{ width: '700px', height: '100%', paddingBottom: '50px' }}>
                <h1 className="text-center mt-3 pt-3">To Dos</h1>
                <div className="container bg-white border" style={{ width: '500px' }}>
                    <ul className="list-group list-group-flush">
                        <input
                            id="todo-input"
                            className="list-group-item"
                            placeholder="What needs to be done?"
                            onKeyDown={async (e) => {
                                if (e.keyCode == "13" && singleOne == false) {
                                    e.persist();
                                    let newList = arrTemp.slice()
                                    newList.push({ label: e.target.value, done: false })
                                    let { respuestaJson, response } = await actions.useFetch("/apis/fake/todos/user/davidtesting", newList, "PUT")

                                    response.ok ? setArrTemp(newList) : alert("There was an error, try again")
                                    console.log(respuestaJson);
                                    e.target.value = "";
                                } else if (e.keyCode == "13" && singleOne == true) {
                                    e.persist();
                                    let singleToDo = [{ label: e.target.value, done: false }]

                                    let { respuestaJson, response } = await actions.useFetch("/apis/fake/todos/user/davidtesting", singleToDo, "PUT")
                                    if (response.ok) {
                                        setArrTemp(singleToDo);
                                        setSingleOne(false);
                                    } else {
                                        alert("There was an error, try again")
                                    }
                                    console.log(respuestaJson);
                                    console.log(singleOne)
                                    e.target.value = "";
                                }
                            }}
                        />

                        {arrTemp && arrTemp.length > 0 ?
                            <>{arrTemp.map((item, index) => {
                                return <li key={index} className="list-group-item d-flex justify-content-between">
                                    {item.label}
                                    <i className="ocultar pt-1 fa-solid fa-xmark" onClick={async () => {
                                        if (arrTemp.length == 1 && singleOne == false) {
                                            handleDeleteAll()
                                        } else {
                                            let deleteList = arrTemp.filter((_, i) => i !== index)
                                            let { respuestaJson, response } = await actions.useFetch("/apis/fake/todos/user/davidtesting", deleteList, "PUT")

                                            response.ok ? setArrTemp(deleteList) : alert("There was an error, try again")
                                            console.log(respuestaJson);
                                        }
                                    }}></i>

                                </li>
                            })}

                                <span className="font-weight-light m-2">{arrTemp.length} items left</span>
                            </>
                            :
                            <li className="list-group-item text-center fs-4">
                                "No tasks, add a task"
                            </li>

                        }

                    </ul>
                </div>
                <div className="d-flex justify-content-center mt-3">
                    <button
                        type="button"
                        className="btn btn-danger"
                        onClick={handleDeleteAll}
                    >
                        Delete All
                    </button>

                </div>
            </div>
        </>
    );
};

export default ToDoList;