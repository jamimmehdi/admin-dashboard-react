import React, { useContext } from 'react';
import { FiChevronsLeft, FiChevronLeft, FiChevronRight, FiChevronsRight, } from "react-icons/fi";
import { adminContext } from '../helper/adminContext'

const Paginations = () => {
    const { state, setCurrentPageData } = useContext(adminContext);
    const { page_count, current_page } = state;

    // Generate pagination buttons
    const Buttons = () => {
        let buttons = [];
        for (let index = 1; index <= page_count; index++) {
            buttons.push(
                <button
                    key={index}
                    className={`pagination-btn ${current_page === index && 'active-btn'}`}
                    onClick={() => setCurrentPageData(index)}
                >
                    {index}
                </button>
            )
        }
        return buttons;
    }

    return (
        <div className='paginations'>
            <button
                className='pagination-btn'
                disabled={current_page > 1 ? false : true} onClick={() => setCurrentPageData(1)}
            >
                {<FiChevronsLeft />}
            </button>
            <button
                className='pagination-btn next'
                disabled={current_page > 1 ? false : true} onClick={() => setCurrentPageData(current_page - 1)}
            >
                {<FiChevronLeft />}
            </button>

            {<Buttons />}

            <button
                className='pagination-btn'
                disabled={current_page === page_count ? true : false} onClick={() => setCurrentPageData(current_page + 1)}
            >
                {<FiChevronRight />}
            </button>
            <button
                className='pagination-btn'
                disabled={current_page === page_count ? true : false}
                onClick={() => setCurrentPageData(page_count)}
            >
                {<FiChevronsRight />}
            </button>
        </div>
    )
}

export default Paginations