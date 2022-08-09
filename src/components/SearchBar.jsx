import React from 'react';

const SearchBar = () => {
    return (
        <div className='search-bar'>
            <input className='search-input' type={'text'} placeholder={'Search by name, email or role'} />
        </div>
    )
}

export default SearchBar