import BookActionTypes from './BookActionTypes';
import Dispatcher from './Dispatcher';
import API from '../services/api'

const BookActions = {
  async fetchBooks(query_params) {
    let result = await API.get("/books", query_params);
    Dispatcher.dispatch({
      type: BookActionTypes.FETCH_BOOKS,
      result: result,
    });
  },
};

export default BookActions;