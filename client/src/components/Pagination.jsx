/**
 * Eenvoudige paginatiecomponent.
 *
 * Toont:
 * - vorige knop
 * - huidige paginastatus
 * - volgende knop
 *
 * De component rendert niet als er maar 1 pagina is.
 */

function Pagination({ currentPage, totalPages, onPageChange }) {
  if (totalPages <= 1) {
    return null;
  }

  return (
    <div className="pagination">
      <button
        className="secondary-button"
        disabled={currentPage === 1}
        onClick={() => onPageChange(currentPage - 1)}
        type="button"
      >
        Previous
      </button>

      <span className="pagination-info">
        Page {currentPage} of {totalPages}
      </span>

      <button
        className="secondary-button"
        disabled={currentPage === totalPages}
        onClick={() => onPageChange(currentPage + 1)}
        type="button"
      >
        Next
      </button>
    </div>
  );
}

export default Pagination;