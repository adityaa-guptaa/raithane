/**
 * Pagination Helper
 * Creates pagination metadata and calculates skip/limit
 */
export const paginate = (req) => {
  const page = parseInt(req.query.page, 10) || 1;
  const limit = parseInt(req.query.limit, 10) || parseInt(process.env.PRODUCTS_PER_PAGE, 10) || 12;
  const skip = (page - 1) * limit;

  return { page, limit, skip };
};

/**
 * Create Pagination Response
 */
export const createPaginationResponse = (data, total, page, limit) => {
  const totalPages = Math.ceil(total / limit);
  
  return {
    success: true,
    data,
    pagination: {
      currentPage: page,
      totalPages,
      totalItems: total,
      itemsPerPage: limit,
      hasNextPage: page < totalPages,
      hasPrevPage: page > 1,
    },
  };
};
