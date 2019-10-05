import Immutable from 'immutable';

const Book = Immutable.Record({
  id: '',
  title: '',
  subtitle: '',
  author: '',
  publisher: '',
  intro: '',
  isbn: '',
  cover_url: '',
  douban_id: '',
  creator: null
});

export default Book;