import React, { useContext } from 'react'
import { adminContext } from '../helper/adminContext'

const EditDetails = () => {
    const { state, cancelEditData, handleEditChange, saveEditChnages } = useContext(adminContext);
    const { user_role, edit_field_data } = state;
    const { id, name, email, role } = edit_field_data;
    return (
        <div className='edit-wrapper'>
            <button className='close-btn' onClick={cancelEditData}>x</button>
            <div className='edit-container'>
                <input
                    className={`user-edit ${!name.length && 'invalid'}`}
                    type={'text'}
                    placeholder='Edit user name'
                    value={name}
                    onChange={(e) => handleEditChange(e.target.value, 'name')}
                />
                <input
                    className={`user-edit ${!email.length && 'invalid'}`}
                    type={'text'}
                    placeholder='Edit user email'
                    value={email}
                    onChange={(e) => handleEditChange(e.target.value, 'email')}
                />
                <select
                    className='role-select'
                    defaultValue={role === 'admin' ? 'admin' : 'member'}
                    onChange={(e) => handleEditChange(e.target.value, 'role')}
                >
                    {
                        user_role.map((role, index) => {
                            return (
                                <option value={role} key={index}>{role[0].toUpperCase() + role.substring(1)}</option>
                            )
                        })
                    }
                </select>
                <button className='save-btn' onClick={() => saveEditChnages(id)}>Save</button>
            </div>
        </div>
    )
}

export default EditDetails