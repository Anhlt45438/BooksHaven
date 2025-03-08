import { Request, Response } from 'express';
import { ObjectId } from 'mongodb';
import databaseServices from '~/services/database.services';
import TheLoai from '~/models/schemas/TheLoai.schemas';
import ChiTietTheLoai from '~/models/schemas/ChiTietTheLoai.schemas';

// Create new category
export const createCategory = async (req: Request, res: Response) => {
    try {
        const { ten_the_loai } = req.body;

        // Check if category already exists
        const existingCategory = await databaseServices.categories.findOne({ ten_the_loai });
        if (existingCategory) {
            return res.status(400).json({
                message: 'Category already exists'
            });
        }

        const newCategory = new TheLoai({
            ten_the_loai
        });

        const result = await databaseServices.categories.insertOne(newCategory);

        return res.status(201).json({
            message: 'Category created successfully',
            data: {
                id_the_loai: result.insertedId,
                ten_the_loai
            }
        });
    } catch (error) {
        console.error('Create category error:', error);
        return res.status(500).json({
            message: 'Error creating category'
        });
    }
};

// Get all categories
export const getAllCategories = async (req: Request, res: Response) => {
    try {
        const categories = await databaseServices.categories.find().toArray();
        return res.status(200).json({ data: categories });
    } catch (error) {
        console.error('Get categories error:', error);
        return res.status(500).json({
            message: 'Error getting categories'
        });
    }
};

// Get category by ID
export const getCategoryById = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const category = await databaseServices.categories.findOne({
            _id: new ObjectId(id)
        });

        if (!category) {
            return res.status(404).json({
                message: 'Category not found'
            });
        }

        return res.status(200).json({ data: category });
    } catch (error) {
        console.error('Get category error:', error);
        return res.status(500).json({
            message: 'Error getting category'
        });
    }
};

// Update category
export const updateCategory = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const { ten_the_loai } = req.body;

        // Check if category exists
        const category = await databaseServices.categories.findOne({
            _id: new ObjectId(id)
        });

        if (!category) {
            return res.status(404).json({
                message: 'Category not found'
            });
        }

        // Check if new name already exists
        const existingCategory = await databaseServices.categories.findOne({
            ten_the_loai,
            _id: { $ne: new ObjectId(id) }
        });

        if (existingCategory) {
            return res.status(400).json({
                message: 'Category name already exists'
            });
        }

        await databaseServices.categories.updateOne(
            { _id: new ObjectId(id) },
            { $set: { ten_the_loai } }
        );

        return res.status(200).json({
            message: 'Category updated successfully'
        });
    } catch (error) {
        console.error('Update category error:', error);
        return res.status(500).json({
            message: 'Error updating category'
        });
    }
};

// Delete category
export const deleteCategory = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;

        // Check if category exists
        const category = await databaseServices.categories.findOne({
            _id: new ObjectId(id)
        });

        if (!category) {
            return res.status(404).json({
                message: 'Category not found'
            });
        }

        // Check if category is used in any books
        const categoryInUse = await databaseServices.detailCategories.findOne({
            id_the_loai: new ObjectId(id)
        });

        if (categoryInUse) {
            return res.status(400).json({
                message: 'Cannot delete category that is assigned to books'
            });
        }

        await databaseServices.categories.deleteOne({
            _id: new ObjectId(id)
        });

        return res.status(200).json({
            message: 'Category deleted successfully'
        });
    } catch (error) {
        console.error('Delete category error:', error);
        return res.status(500).json({
            message: 'Error deleting category'
        });
    }
};

// Add category to book
export const addCategoryToBook = async (req: Request, res: Response) => {
    try {
        const { id_sach, id_the_loai } = req.body;

        // Check if association already exists
        const existingAssociation = await databaseServices.detailCategories.findOne({
            id_sach: new ObjectId(id_sach),
            id_the_loai: new ObjectId(id_the_loai)
        });

        if (existingAssociation) {
            return res.status(400).json({
                message: 'Book already has this category'
            });
        }

        const newAssociation = new ChiTietTheLoai({
            id_sach: new ObjectId(id_sach),
            id_the_loai: new ObjectId(id_the_loai)
        });

        await databaseServices.detailCategories.insertOne(newAssociation);

        return res.status(201).json({
            message: 'Category added to book successfully'
        });
    } catch (error) {
        console.error('Add category to book error:', error);
        return res.status(500).json({
            message: 'Error adding category to book'
        });
    }
};

// Remove category from book
export const removeCategoryFromBook = async (req: Request, res: Response) => {
    try {
        const { id_sach, id_the_loai } = req.params;

        const result = await databaseServices.detailCategories.deleteOne({
            id_sach: new ObjectId(id_sach),
            id_the_loai: new ObjectId(id_the_loai)
        });

        if (result.deletedCount === 0) {
            return res.status(404).json({
                message: 'Category association not found'
            });
        }

        return res.status(200).json({
            message: 'Category removed from book successfully'
        });
    } catch (error) {
        console.error('Remove category from book error:', error);
        return res.status(500).json({
            message: 'Error removing category from book'
        });
    }
};