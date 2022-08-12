import React, { useContext } from 'react';
import { adminContext } from '../helper/adminContext';

const SearchBar = () => {
    const { handleSearchChange, searchDebounce } = useContext(adminContext);
    return (
        <div className='search-bar'>
            <input className='search-input' type={'text'} placeholder={'Search by name, email or role'} onChange={searchDebounce} />
        </div>
    )
}

export default SearchBar