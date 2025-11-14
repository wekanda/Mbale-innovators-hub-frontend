import React from 'react';

const Pagination = ({ pagination = {}, onPageChange }) => {
  const handlePrev = () => {
    if (pagination.prev) {
      onPageChange(pagination.prev.page);
    }
  };

  const handleNext = () => {
    if (pagination.next) {
      onPageChange(pagination.next.page);
    }
  };

  return (
    <div className="pagination-controls">
      <button onClick={handlePrev} disabled={!pagination.prev} className="btn">
        &laquo; Previous
      </button>
      <button onClick={handleNext} disabled={!pagination.next} className="btn">
        Next &raquo;
      </button>
    </div>
  );
};

export default Pagination;
