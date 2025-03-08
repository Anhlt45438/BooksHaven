import { Request, Response, NextFunction } from 'express';
import { ObjectId } from 'mongodb';
import { checkSchema, validationResult } from 'express-validator';

export const validateBookId = (req: Request, res: Response, next: NextFunction) => {
  const { id } = req.params;
  if (!ObjectId.isValid(id)) {
    return res.status(400).json({
      message: 'Invalid book ID format'
    });
  }
  next();
};

export const validateCreateBook = checkSchema({
  ten_sach: {
    notEmpty: {
      errorMessage: 'Book title is required'
    },
    isString: {
      errorMessage: 'Book title must be a string'
    },
    trim: true
  },
  tac_gia: {
    notEmpty: {
      errorMessage: 'Author is required'
    },
    isString: {
      errorMessage: 'Author must be a string'
    },
    trim: true
  },
  mo_ta: {
    optional: true,
    isString: {
      errorMessage: 'Description must be a string'
    },
    trim: true
  },
  gia: {
    notEmpty: {
      errorMessage: 'Price is required'
    },
    isNumeric: {
      errorMessage: 'Price must be a number'
    },
    custom: {
      options: (value) => value >= 0,
      errorMessage: 'Price must be greater than or equal to 0'
    }
  },
  so_luong: {
    notEmpty: {
      errorMessage: 'Quantity is required'
    },
    isInt: {
      errorMessage: 'Quantity must be an integer'
    },
    custom: {
      options: (value) => value >= 0,
      errorMessage: 'Quantity must be greater than or equal to 0'
    }
  },
  anh: {
    notEmpty: {
      errorMessage: 'Image URL is required'
    },
    isString: {
      errorMessage: 'Image URL must be a string'
    },
    trim: true
  },
  so_trang: {
    notEmpty: {
      errorMessage: 'Number of pages is required'
    },
    isInt: {
      errorMessage: 'Number of pages must be an integer'
    },
    custom: {
      options: (value) => value > 0,
      errorMessage: 'Number of pages must be greater than 0'
    }
  },
  kich_thuoc: {
    notEmpty: {
      errorMessage: 'Book size is required'
    },
    isString: {
      errorMessage: 'Book size must be a string'
    },
    trim: true
  },
  id_shop: {
    notEmpty: {
      errorMessage: 'Shop ID is required'
    },
    custom: {
      options: (value) => ObjectId.isValid(value),
      errorMessage: 'Invalid shop ID format'
    },
    
  },
  the_loai: {
    notEmpty: {
      errorMessage: 'Categories are required'
    },
    isArray: {
      errorMessage: 'Categories must be an array'
    },
    custom: {
      options: (value) => {
        if (!Array.isArray(value) || value.length === 0) {
          throw new Error('At least one category is required');
        }
        return value.every(category => 
          category.id_the_loai && 
          ObjectId.isValid(category.id_the_loai)
        );
      },
      errorMessage: 'Invalid category format or ID'
    }
  }
});

export const validateUpdateBook = checkSchema({
  ten_sach: {
    optional: true,
    isString: {
      errorMessage: 'Book title must be a string'
    },
    trim: true
  },
  tac_gia: {
    optional: true,
    isString: {
      errorMessage: 'Author must be a string'
    },
    trim: true
  },
  mo_ta: {
    optional: true,
    isString: {
      errorMessage: 'Description must be a string'
    },
    trim: true
  },
  gia: {
    optional: true,
    isNumeric: {
      errorMessage: 'Price must be a number'
    },
    custom: {
      options: (value) => value >= 0,
      errorMessage: 'Price must be greater than or equal to 0'
    }
  },
  so_luong: {
    optional: true,
    isInt: {
      errorMessage: 'Quantity must be an integer'
    },
    custom: {
      options: (value) => value >= 0,
      errorMessage: 'Quantity must be greater than or equal to 0'
    }
  },
  anh: {
    optional: true,
    isString: {
      errorMessage: 'Image URL must be a string'
    },
    trim: true
  },
  so_trang: {
    optional: true,
    isInt: {
      errorMessage: 'Number of pages must be an integer'
    },
    custom: {
      options: (value) => value > 0,
      errorMessage: 'Number of pages must be greater than 0'
    }
  },
  kich_thuoc: {
    optional: true,
    isString: {
      errorMessage: 'Book size must be a string'
    },
    trim: true
  },
  the_loai: {
    optional: true,
    isArray: {
      errorMessage: 'Categories must be an array'
    },
    custom: {
      options: (value) => {
        if (!value) return true; // Skip if not provided
        if (!Array.isArray(value) || value.length === 0) {
          throw new Error('At least one category is required when updating categories');
        }
        return value.every(category => 
          category.id_the_loai && 
          ObjectId.isValid(category.id_the_loai)
        );
      },
      errorMessage: 'Invalid category format or ID'
    }
  }
});

export const validatePagination = checkSchema({
  page: {
    optional: true,
    isInt: {
      options: { min: 1 },
      errorMessage: 'Page must be a positive integer'
    },
    toInt: true
  },
  limit: {
    optional: true,
    isInt: {
      options: { min: 1, max: 100 },
      errorMessage: 'Limit must be between 1 and 100'
    },
    toInt: true
  }
});

export const validateSearchKeyword = checkSchema({
  keyword: {
    notEmpty: {
      errorMessage: 'Search keyword is required'
    },
    isString: {
      errorMessage: 'Search keyword must be a string'
    },
    trim: true,
    isLength: {
      options: { min: 1 },
      errorMessage: 'Search keyword cannot be empty'
    }
  }
});

export const handleValidationErrors = (req: Request, res: Response, next: NextFunction) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      errors: errors.array()
    });
  }
  next();
};