import { useEffect, useReducer, useRef, useState } from 'react';
import './App.css';
import SearchBar from './components/SearchBar';
import Table from './components/Table';
import { adminContext } from './helper/adminContext';
import {
  LOAD__INITIAL_DATA,
  LOAD__DATA,
  LOAD__CURRENT__PAGE__DATA,
  CLEAR__SELECTED,
  SELECT__ALL__DATA,
  SET__EDIT__FIELD__DATA,
  SET__DELETE__DATA,
} from './reducer/actions.type';
import adminReducer from './reducer/adminReducer';
import { URL } from './api.config';
import EditDetails from './components/EditDetails';
import DeleteConfirmation from './components/DeleteConfirmation';


function App() {
  const [intervalId, setIntervalId] = useState();
  const [dataEditMode, setDataEditMode] = useState(false);
  const [dataDeleteMode, setDataDeleteMode] = useState(false);
  const [state, dispatch] = useReducer(adminReducer, {
    data: [],
    data_map: new Map(),
    user_role: ['admin', 'member'],
    current_working_data: [],
    page_count: 1,
    last_page_data_count: 0,
    current_page: 1,
    current_page_data: [],
    selected_data: [],
    single_delete_data: { id: '', name: '', email: '', role: '' },
    edit_field_data: { id: '', name: '', email: '', role: '' },
  });

  const selectAllCheckboxRef = useRef();
  const dataCheckboxRef = useRef([]);

  // Delete all selected data
  const deleteSelectedData = () => {
    if (!state.selected_data.length) return;

    const deleted_data = state.data.filter((data) => {
      const { id } = data;
      return !state.selected_data.includes(id);
    });
    dispatch({ type: CLEAR__SELECTED });
    loadInititalData(deleted_data);
  }

  // Delete single data
  const deleteData = (id, name, email, role) => {
    dispatch({ type: SET__DELETE__DATA, payload: { id, name, email, role } });
    setDataDeleteMode(prevMode => !prevMode);
  }

  // Confirm delete
  const confirmDelete = (delete_id) => {
    const deleted_data = [...state.data].filter((data) => {
      const { id } = data;
      if (delete_id !== id) return data;
    });
    loadInititalData(deleted_data);
    setDataDeleteMode(prevMode => !prevMode);
  }

  // Cancel deletetion
  const cancelDeletion = () => {
    dispatch({ type: SET__DELETE__DATA, payload: { id: '', name: '', email: '', role: '' } });
    setDataDeleteMode(prevMode => !prevMode);
  }

  const saveEditChnages = (editId) => {
    const { name, email, role } = state.edit_field_data;
    if (name === '' || email === '') return;
    const edited_data = [...state.data];
    edited_data.forEach((data, index) => {
      const { id } = data;
      if (id === editId) {
        edited_data[index].name = name;
        edited_data[index].email = email;
        edited_data[index].role = role;
      }
    });
    loadInititalData(edited_data);
    cancelEditData();
  }

  // Edit data
  const editData = (id, name, email, role) => {
    dispatch({ type: SET__EDIT__FIELD__DATA, payload: { id, name, email, role } });
    setDataEditMode(prevMode => !prevMode);
  }

  // Handle edit change
  const handleEditChange = (input_value, type) => {
    const { id, name, email, role } = state.edit_field_data;
    switch (type) {
      case 'name':
        dispatch({ type: SET__EDIT__FIELD__DATA, payload: { id, name: input_value, email, role } });
        break;
      case 'email':
        dispatch({ type: SET__EDIT__FIELD__DATA, payload: { id, name, email: input_value, role } });
        break;
      case 'role':
        dispatch({ type: SET__EDIT__FIELD__DATA, payload: { id, name, email, role: input_value } });
        break;
      default:
        return;
    }
  }

  // Close edit data
  const cancelEditData = () => {
    dispatch({ type: SET__EDIT__FIELD__DATA, payload: { id: '', name: '', email: '', role: '' } });
    setDataEditMode(prevMode => !prevMode);
  }

  const selectAllData = () => {
    if (selectAllCheckboxRef.current.checked) {
      dataCheckboxRef.current.map((item) => {
        if (item) item.checked = true;
      })
      dispatch({ type: SELECT__ALL__DATA });
    } else {
      dataCheckboxRef.current.map((item) => {
        if (item) item.checked = false;
      })
      dispatch({ type: CLEAR__SELECTED });
    }
  }

  const addDataToRef = (element) => {
    if (!dataCheckboxRef.current.includes(element)) {
      dataCheckboxRef.current.push(element)
    }
  }

  const getStartingIndex = (index) => {
    if (index === 1) return 0;
    else return (10 * (index - 1));
  }

  const getEndingIndex = (index) => {
    if (index === 1) return 10;
    else return (10 * (index - 1) + 10);
  }

  // Set current page data
  const setCurrentPageData = (new_page) => {
    dataCheckboxRef.current = [];
    selectAllCheckboxRef.current.checked = false;
    dispatch({ type: CLEAR__SELECTED });
    const { page_count, current_working_data } = state;
    const starting_index = getStartingIndex(new_page);
    const ending_index = getEndingIndex(new_page);
    if (new_page < page_count) {
      const current_page_new_data = current_working_data.slice(starting_index, ending_index);
      dispatch({
        type: LOAD__CURRENT__PAGE__DATA,
        payload: { current_page_new_data, current_page: new_page }
      });
    } else {
      const current_page_new_data = current_working_data.slice(starting_index, current_working_data.length);
      dispatch({
        type: LOAD__CURRENT__PAGE__DATA,
        payload: { current_page_new_data, current_page: new_page }
      });
    }
  }

  // Debouncing
  const searchDebounce = (event) => {
    if (intervalId) clearInterval(intervalId);
    const newIntervalId = setTimeout(() => {
      handleSearchChange(event);
    }, 700);
    setIntervalId(newIntervalId);
  }

  // Handle search in current page
  const handleSearchChange = (event) => {
    dispatch({ type: CLEAR__SELECTED });
    const { data } = state;
    const input_value = event.target.value.toLowerCase();
    const searched_data = data.filter((employee_details) => {
      const { id, name, email, role } = employee_details;
      if (id.toLowerCase().includes(input_value)
        || name.toLowerCase().includes(input_value)
        || email.toLowerCase().includes(input_value)
        || role.toLowerCase().includes(input_value)) {
        return employee_details;
      }
    });
    loadData(searched_data, true);
  }

  // Load initial data from API
  const loadData = (data, search = false) => {
    const current_working_data = [...data];
    const data_length = current_working_data.length;
    const page_count = Math.floor(data_length / 10);
    const last_page_data_count = ((data_length / 10) - page_count).toFixed(1) * 10;
    const current_page = search ? 1 : state.current_page;
    const starting_index = getStartingIndex(current_page);
    const ending_index = getEndingIndex(current_page);
    if (current_page < page_count) {
      const current_page_new_data = current_working_data.slice(starting_index, ending_index);
      dispatch({
        type: LOAD__DATA,
        payload: {
          current_page, page_count: (page_count + 1), last_page_data_count: last_page_data_count,
          current_page_data: current_page_new_data, current_working_data
        }
      });
    } else {
      const current_page_new_data = current_working_data.slice(starting_index, current_working_data.length);
      dispatch({
        type: LOAD__DATA,
        payload: {
          current_page, page_count: (page_count + 1), last_page_data_count: last_page_data_count,
          current_page_data: current_page_new_data, current_working_data
        }
      });
    }
  }



  // Load initial data
  const loadInititalData = (data) => {
    dispatch({ type: LOAD__INITIAL_DATA, payload: data });
    loadData(data);
  }

  useEffect(() => {
    const fetchAPI = async () => {
      await fetch(URL)
        .then((response) => response.json())
        .then((data) => loadInititalData(data))
    }
    fetchAPI();
  }, []);

  return (
    <div className="App">
      <adminContext.Provider value={{
        state,
        dispatch,
        setCurrentPageData,
        handleSearchChange,
        selectAllCheckboxRef,
        dataCheckboxRef,
        selectAllData,
        addDataToRef,
        searchDebounce,
        dataEditMode,
        setDataEditMode,
        editData,
        cancelEditData,
        handleEditChange,
        saveEditChnages,
        deleteData,
        confirmDelete,
        cancelDeletion,
        deleteSelectedData
      }}>
        <SearchBar />
        <Table />
        {dataEditMode && <EditDetails />}
        {dataDeleteMode && <DeleteConfirmation />}
      </adminContext.Provider>
    </div>
  );
}

export default App;
