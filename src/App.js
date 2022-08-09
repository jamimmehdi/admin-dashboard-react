import { useEffect, useReducer } from 'react';
import './App.css';
import SearchBar from './components/SearchBar';
import Table from './components/Table';
import { adminContext } from './Helper/adminContext';
import { LOAD__INITIAL__DATA, LOAD__CURRENT__PAGE__DATA } from './Reducer/actions.type';
import adminReducer from './Reducer/adminReducer';

const URL = 'https://geektrust.s3-ap-southeast-1.amazonaws.com/adminui-problem/members.json';

function App() {

  const [state, dispatch] = useReducer(adminReducer, {
    data: [],
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
          current_page_new_data,
          current_page: new_page
        }
      });
    } else {
      const current_page_new_data = data.slice(starting_index, data.length);
      dispatch({
        type: LOAD__CURRENT__PAGE__DATA,
        payload: {
          current_page_new_data,
          current_page: new_page
        }
      });
    }
  }

  // Load initial data from API
  const loadDataFromAPI = (data) => {
    const data_length = data.length;
    const page_count = Math.floor(data_length / 10);
    const last_page_data_count = ((data_length / 10) - page_count).toFixed(1) * 10;
    const { current_page } = state;
    const starting_index = getStartingIndex(current_page);
    const ending_index = getEndingIndex(current_page);
    if (current_page < page_count) {
      const current_page_new_data = data.slice(starting_index, ending_index);
      dispatch({
        type: LOAD__INITIAL__DATA,
        payload: {
          data, page_count: (page_count + 1),
          last_page_data_count: last_page_data_count,
          current_page_data: current_page_new_data
        }
      });
    } else {
      const current_page_new_data = data.slice(starting_index, data.length);
      dispatch({
        type: LOAD__INITIAL__DATA,
        payload: {
          data, page_count: (page_count + 1),
          last_page_data_count: last_page_data_count,
          current_page_data: current_page_new_data
        }
      });
    }
  }

  useEffect(() => {
    const fetchAPI = async () => {
      await fetch(URL)
        .then((response) => response.json())
        .then((data) => loadDataFromAPI(data))
    }
    fetchAPI();
  }, []);

  return (
    <div className="App">
      <adminContext.Provider value={{
        state,
        dispatch,
        setCurrentPageData
      }}>
        <SearchBar />
        <Table />
      </adminContext.Provider>
    </div>
  );
}

export default App;
