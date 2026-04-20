import { useQuery, keepPreviousData } from '@tanstack/react-query';
import { Pagination } from '../Pagination/Pagination';
import { useState } from 'react';
import { NoteList } from '../NoteList/NoteList';
import css from './App.module.css';
import { getNotes } from '../../services/noteService';
import { Modal } from '../Modal/Modal';
import NoteForm from '../NoteForm/NoteForm';
import SearchBox from '../SearchBox/SearchBox';
import { useDebouncedCallback } from 'use-debounce';

export default function App() {
  const [currentPage, setCurrentPage] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const openModal = () => {
    setIsModalOpen(true);
  };
  
  const closeModal = () => {
    setIsModalOpen(false);
  };

  const handleSearch = useDebouncedCallback(setSearchQuery, 300);
  
  const { data, isLoading } = useQuery({
    queryKey: ['notes', searchQuery, currentPage],
    queryFn: () => getNotes(searchQuery, currentPage),
    placeholderData: keepPreviousData,
  });

  const notes = data?.notes || [];
  const totalPages = data?.totalPages || 0;

  return (
    <>
      <div className={css.app}>
        <header className={css.toolbar}>
          <SearchBox text={searchQuery} onSearch={handleSearch}/>
          {totalPages > 1 && (
            <Pagination
              totalPages={totalPages}
              currentPage={currentPage}
              onPageChange={setCurrentPage}
            />
          )}
          <button className={css.button} onClick={openModal}>Create note +</button>
          {isModalOpen && <Modal onClose={closeModal}>
            <NoteForm onClose={closeModal}/>
          </Modal>}
        </header>
        {isLoading && <p>Loading...</p>}
        {notes.length !== 0 && <NoteList notes={notes} />}
      </div>
    </>
  );
  
}

