import { useEffect, useReducer } from 'react';
import './App.css';
import SearchBar from './components/SearchBar';
import Table from './components/Table';
import { adminContext } from './Helper/adminContext';
import { LOAD__INITIAL_DATA, LOAD__DATA, LOAD__CURRENT__PAGE__DATA } from './Reducer/actions.type';
import adminReducer from './Reducer/adminReducer';
import {URL} from './api.config';


function App() {

  const [state, dispatch] = useReducer(adminReducer, {
    data: [],
    current_working_data: [],
    page_count: 1,
    last_page_data_count: 0,
    current_page: 1,
    current_page_data: [],
  });

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
    const { page_count, data } = state;
    const starting_index = getStartingIndex(new_page);
    const ending_index = getEndingIndex(new_page);
    if (new_page < page_count) {
      const current_page_new_data = data.slice(starting_index, ending_index);
      dispatch({
        type: LOAD__CURRENT__PAGE__DATA,
        payload: {
          current_page_new_data, current_page: new_page
        }
      });
    } else {
      const current_page_new_data = data.slice(starting_index, data.length);
      dispatch({
        type: LOAD__CURRENT__PAGE__DATA,
        payload: { current_page_new_data, current_page: new_page }
      });
    }
  }

  // Handle search in current page
  const handleSearchInCurrentPage = (event) => {
    const { data } = state;
    const input_value = event.target.value;
    const searched_data = data.filter((employee_details) => {
      const { id, name, email, role } = employee_details;
      if (id.toLowerCase().includes(input_value)
        || name.toLowerCase().includes(input_value)
        || email.toLowerCase().includes(input_value)
        || role.toLowerCase().includes(input_value)) {
        return employee_details;
      }
    });
    loadData(searched_data);
  }

  // Load initial data from API
  const loadData = (data) => {
    const current_working_data = [...data];
    const data_length = current_working_data.length;
    const page_count = Math.floor(data_length / 10);
    const last_page_data_count = ((data_length / 10) - page_count).toFixed(1) * 10;
    const { current_page } = state;
    const starting_index = getStartingIndex(current_page);
    const ending_index = getEndingIndex(current_page);
    if (current_page < page_count) {
      const current_page_new_data = current_working_data.slice(starting_index, ending_index);
      dispatch({
        type: LOAD__DATA,
        payload: { page_count: (page_count + 1), last_page_data_count: last_page_data_count, current_page_data: current_page_new_data, current_working_data }
      });
    } else {
      const current_page_new_data = current_working_data.slice(starting_index, current_working_data.length);
      dispatch({
        type: LOAD__DATA,
        payload: { page_count: (page_count + 1), last_page_data_count: last_page_data_count, current_page_data: current_page_new_data, current_working_data }
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
        handleSearchInCurrentPage
      }}>
        <SearchBar />
        <Table />
      </adminContext.Provider>
    </div>
  );
}

export default App;
