import {
    LOAD__INITIAL_DATA,
    LOAD__DATA,
    LOAD__CURRENT__PAGE__DATA,
    ADD__TO__SELEDTED__DATA,
    CLEAR__SELECTED,
    SELECT__ALL__DATA,
    SET__EDIT__FIELD__DATA,
    UPDATE__NEW__DATA
} from "./actions.type";


const adminReducer = (state, actions) => {
    const { selected_data, current_page_data } = state;

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
                current_page_data: [...actions.payload.current_page_data],
            }

        case LOAD__CURRENT__PAGE__DATA:
            return {
                ...state,
                current_page_data: [...actions.payload.current_page_new_data],
                current_page: actions.payload.current_page,
            }

        case ADD__TO__SELEDTED__DATA:
            if (state.selected_data.includes(actions.payload.selected_id)) {
                const index = state.selected_data.indexOf(actions.payload.selected_id);
                const new_selected_data = [...state.selected_data]
                new_selected_data.splice(index, 1);
                return {
                    ...state,
                    selected_data: [...new_selected_data],
                }
            } else {
                const new_selected_data = [...state.selected_data];
                new_selected_data.push(actions.payload.selected_id);
                return {
                    ...state,
                    selected_data: [...new_selected_data],
                }
            }

        case CLEAR__SELECTED:
            return {
                ...state,
                selected_data: []
            }

        case SELECT__ALL__DATA:
            const selected_data = state.current_page_data.map((data) => data.id);
            return {
                ...state,
                selected_data,
            }

        case SET__EDIT__FIELD__DATA:
            return {
                ...state,
                edit_field_data: {
                    id: actions.payload.id,
                    name: actions.payload.name,
                    email: actions.payload.email,
                    role: actions.payload.role
                }
            }

        case UPDATE__NEW__DATA:
            return {
                ...state,

            }

        default:
            return state;
    }
}

export default adminReducer;