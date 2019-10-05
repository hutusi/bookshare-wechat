import {ReduceStore} from 'flux/utils';
import Immutable from 'immutable';

import BookshareDispatcher from '../actions/Dispatcher';
import BookActionTypes from '../actions/BookActionTypes';

class BookStore extends ReduceStore {
  constructor() {
    super(BookshareDispatcher);
  }

  getInitialState() {
    return Immutable.OrderedMap();
  }

  reduce(state, action) {
    switch (action.type) {
      case BookActionTypes.FETCH_BOOKS:
        if (!action.result) {
          return state;
        }
        return state.set('books', action.result.data);

      default:
        return state;
    }
  }
}

export default new BookStore();
