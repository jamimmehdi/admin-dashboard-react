import { LOAD__INITIAL__DATA, LOAD__CURRENT__PAGE__DATA } from "./actions.type";


const adminReducer = (state, actions) => {
    switch (state, actions.type) {
        case LOAD__INITIAL__DATA:
            return {
                ...state,
                data: [...actions.payload.data],
                page_count: actions.payload.page_count,
                last_page_data_count: actions.payload.last_page_data_count,
                current_page_data: actions.payload.current_page_data
            }

        case LOAD__CURRENT__PAGE__DATA:
            return {
                ...state,
                current_page_data: [...actions.payload.current_page_new_data],
                current_page: actions.payload.current_page
            }

        default:
            return state;
    }
}

export default adminReducer;