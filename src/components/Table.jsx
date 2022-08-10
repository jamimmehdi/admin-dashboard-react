import React, { useContext } from 'react';
import { FiTrash2, FiEdit } from "react-icons/fi";
import { adminContext } from '../helper/adminContext';
import Paginations from './Paginations';

const Table = () => {
    const { state, dispatch, setCurrentPageData } = useContext(adminContext);
    const { current_page_data, current_page, page_count } = state;
    return (
        <div className='table'>
            <table className='table'>
                <thead>
                    <tr className='header'>
                        <th className='xl-cell'><input type={'checkbox'} /></th>
                        <th>Name</th>
                        <th>Email</th>
                        <th>Role</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {
                        Object.entries(current_page_data).map((data) => {
                            const { id, name, email, role } = data[1];
                            return (
                                <tr key={id}>
                                    <td className='xl-cell'><input type={'checkbox'} /></td>
                                    <td>{name}</td>
                                    <td>{email}</td>
                                    <td>{role[0].toUpperCase() + role.substring(1)}</td>
                                    <td>
                                        <div className='action-icons'>
                                            <FiEdit className='blue' />
                                            <FiTrash2 className='red' />
                                        </div>
                                    </td>
                                </tr>
                            )
                        })
                    }
                </tbody>
            </table>
            <div className='buttons-container'>
                <button className='delete-selected-button'>Delete Selected</button>
                <Paginations />
            </div>

            {
                /* Page count and current page */
                // <p>Current Page:{state.current_page} - Page Count:{state.page_count}</p>
            }
        </div>
    )
}

export default Table