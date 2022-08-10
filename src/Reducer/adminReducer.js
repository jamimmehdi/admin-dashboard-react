import { LOAD__INITIAL_DATA,LOAD__DATA, LOAD__CURRENT__PAGE__DATA } from "./actions.type";


const adminReducer = (state, actions) => {
    switch (actions.type) {
        case LOAD__INITIAL_DATA:
            return {
                ...state,
                data: [...actions.payload]
            }

        case LOAD__DATA:
            return {
                ...state,
                current_page: actions.payload.current_page,
                current_working_data: [...actions.payload.current_working_data],
                page_count: actions.payload.page_count,
                last_page_data_count: actions.payload.last_page_data_count,
                current_page_data: actions.payload.current_page_data,
            }

        case LOAD__CURRENT__PAGE__DATA:
            return {
                ...state,
                current_page_data: [...actions.payload.current_page_new_data],
                current_page: actions.payload.current_page,
            }

        default:
            return state;
    }
}

export default adminReducer;