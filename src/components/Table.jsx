import React, { useContext } from 'react';
import { FiTrash2, FiEdit } from "react-icons/fi";
import { adminContext } from '../helper/adminContext';
import Paginations from './Paginations';
import { ADD__TO__SELEDTED__DATA } from '../reducer/actions.type';

const Table = () => {
    const {
        state,
        dispatch,
        selectAllCheckboxRef,
        selectAllData,
        addDataToRef,
        editData,
        deleteData,
        deleteSelectedData
    } = useContext(adminContext);
    const { current_page_data, selected_data } = state;

    return (
        <div className='table'>
            <table className='table'>
                <thead>
                    <tr className='header'>
                        <th className='xl-cell'>
                            <input
                                type={'checkbox'}
                                checked={current_page_data.length && selected_data.length === current_page_data.length ? true : false}
                                ref={selectAllCheckboxRef}
                                onChange={selectAllData}
                            />
                        </th>
                        <th>Name</th>
                        <th>Email</th>
                        <th>Role</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {
                        Object.entries(current_page_data).map((data, index) => {
                            const { id, name, email, role } = data[1];
                            return (
                                <tr key={id} className={`fade-in ${selected_data.includes(id) ? 'row-selected' : ''}`}>
                                    <td className='xl-cell'>
                                        <input
                                            type={'checkbox'}
                                            onChange={() => dispatch({ type: ADD__TO__SELEDTED__DATA, payload: { selected_id: id } })}
                                            ref={addDataToRef}
                                        />
                                    </td>
                                    <td>{name}</td>
                                    <td>{email}</td>
                                    <td>{role[0].toUpperCase() + role.substring(1)}</td>
                                    <td>
                                        <div className='action-icons'>
                                            <FiEdit className='blue' onClick={() => editData(id, name, email, role)} />
                                            <FiTrash2 className='red' onClick={() => deleteData(id, name, email, role)} />
                                        </div>
                                    </td>
                                </tr>
                            )
                        })
                    }
                </tbody>
            </table>
            <div className='buttons-container'>
                <button className='delete-selected-button' onClick={deleteSelectedData}>Delete Selected</button>
                <Paginations />
            </div>

            {
                /* Page count and current page */
                // <p>Current Page:{state.current_page} - Page Count:{state.page_count}</p>

                // Selected data
                <p>Selected Data: {state.selected_data.map((i) => <span key={i} style={{ marginLeft: '10px', }}>{i}</span>)}</p>
            }
        </div>
    )
}

export default Table