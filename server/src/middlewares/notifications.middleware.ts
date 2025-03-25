import { Request, Response, NextFunction } from 'express';
import { checkSchema, validationResult } from 'express-validator';

export const validateNotificationToUser = checkSchema({
  id_user: {
    notEmpty: {
      errorMessage: 'User ID is required'
    },
    isMongoId: {
      errorMessage: 'Invalid user ID format'
    }
  },
  noi_dung_thong_bao: {
    notEmpty: {
      errorMessage: 'Notification content is required'
    },
    isString: {
      errorMessage: 'Content must be text'
    },
    isLength: {
      options: { min: 1, max: 500 },
      errorMessage: 'Content must be between 1 and 500 characters'
    }
  },
  tieu_de: {
    notEmpty: {
      errorMessage: 'Title is required'
    },
    isString: {
      errorMessage: 'Title must be text'
    },
    isLength: {
      options: { min: 1, max: 100 },
      errorMessage: 'Title must be between 1 and 100 characters'
    }
  }
});

export const validateNotificationByRole = checkSchema({
  role: {
    notEmpty: {
      errorMessage: 'Role is required'
    },
    isString: {
      errorMessage: 'Role must be text'
    }
  },
  noi_dung_thong_bao: {
    notEmpty: {
      errorMessage: 'Notification content is required'
    },
    isString: {
      errorMessage: 'Content must be text'
    },
    isLength: {
      options: { min: 1, max: 500 },
      errorMessage: 'Content must be between 1 and 500 characters'
    }
  },
  tieu_de: {
    notEmpty: {
      errorMessage: 'Title is required'
    },
    isString: {
      errorMessage: 'Title must be text'
    },
    isLength: {
      options: { min: 1, max: 100 },
      errorMessage: 'Title must be between 1 and 100 characters'
    }
  }
});

export const validateFeedback = checkSchema({
  noi_dung_thong_bao: {
    notEmpty: {
      errorMessage: 'Feedback content is required'
    },
    isString: {
      errorMessage: 'Content must be text'
    },
    isLength: {
      options: { min: 1, max: 1000 },
      errorMessage: 'Content must be between 1 and 1000 characters'
    }
  },
  tieu_de: {
    notEmpty: {
      errorMessage: 'Title is required'
    },
    isString: {
      errorMessage: 'Title must be text'
    },
    isLength: {
      options: { min: 1, max: 100 },
      errorMessage: 'Title must be between 1 and 100 characters'
    }
  }
});

export const handleValidationErrors = (req: Request, res: Response, next: NextFunction) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
};