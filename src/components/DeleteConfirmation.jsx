import React, { useContext } from 'react'
import { adminContext } from '../helper/adminContext'

const DeleteConfirmation = () => {
    const { state, confirmDelete, cancelDeletion } = useContext(adminContext);
    const { id, name, email, role } = state.single_delete_data;
    return (
        <div className='delete-wrapper'>
            <div className='delete-container'>
                <p className='delete-header'>You're about to delete the user from database</p>
                <div className='detele-body'>
                    <p ><span className='margin-right'>Id:</span> {<input className='disabled-input' type={'text'} value={id} disabled />}</p>
                    <p ><span className='margin-right'>Name:</span> {<input className='disabled-input' type={'text'} value={name} disabled />}</p>
                    <p ><span className='margin-right'>Email:</span> {<input className='disabled-input' type={'text'} value={email} disabled />}</p>
                    <p ><span className='margin-right'>Role:</span> {<input className='disabled-input' type={'text'} value={role} disabled />}</p>
                </div>
            </div>
            <div className='delete-footer'>
                <button className='cancel-btn' onClick={cancelDeletion}>Cancel</button>
                <button className='delete-btn' onClick={() => confirmDelete(id)}>Delete</button>
            </div>
        </div>
    )
}

export default DeleteConfirmation