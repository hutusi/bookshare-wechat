'use strict';

import {Container} from 'flux/utils';
import BookActions from '../stores/BookActions';
import BookStore from '../stores/BookStore';

function getStores() {
  return [
    BookStore,
  ];
}

function getState() {
  return {
    book: BookStore.getState(),

    onFetchBooks: BookActions.fetchBooks,
  };
}

export default Container.createFunctional(AppView, getStores, getState);