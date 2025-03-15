import { Request, Response } from 'express';
import { ObjectId } from 'mongodb';
import databaseServices from '~/services/database.services';
import VaiTro from '~/models/schemas/VaiTro.schemas';
import ChiTietVaiTro from '~/models/schemas/ChiTietVaiTro.schemas';

export async function getUserRolesHelper(userId: string) {
  const roles = await databaseServices.chiTietVaiTro
  .aggregate([
    {
      $match: {
        id_user: new ObjectId(userId)
      }
    },
    {
      $lookup: {
        from: process.env.DB_ROLES_VAI_TRO_COLLECTION || '',
        localField: "id_role",
        foreignField: "id_role",
        as: "role_info"
      }
    },
    {
      $unwind: "$role_info"
    },
    {
      $project: {
        _id: "$role_info.id_role",
        id_role: "$role_info.id_role",
        ten_role: "$role_info.ten_role"
      }
    }
  ]).toArray();
  return roles;
}
// Get all roles of a user
export const getUserRoles = async (req: Request, res: Response) => {
  try {
    const { user_id } = req.params;

    const userRoles = await getUserRolesHelper(user_id);

    return res.status(200).json({
      data: userRoles
    });
  } catch (error) {
    console.error('Get user roles error:', error);
    return res.status(500).json({
      message: 'Error getting user roles'
    });
  }
};

// Assign multiple roles to user
export const assignRolesToUser = async (req: Request, res: Response) => {
  try {
    const { user_id, role_ids } = req.body;

    if (!Array.isArray(role_ids)) {
      return res.status(400).json({
        message: 'role_ids must be an array'
      });
    }

    // Check if roles exist
    const roles = await databaseServices.VaiTro
      .find({
        _id: { $in: role_ids.map(id => new ObjectId(id)) }
      })
      .toArray();

    if (roles.length !== role_ids.length) {
      return res.status(400).json({
        message: 'One or more roles do not exist'
      });
    }

    // Get existing roles
    const existingRoles = await databaseServices.chiTietVaiTro
      .find({
        id_user: new ObjectId(user_id)
      })
      .toArray();

    // Filter out roles that user already has
    const existingRoleIds = existingRoles.map(r => r.id_role.toString());
    const newRoleIds = role_ids.filter(id => !existingRoleIds.includes(id));

    if (newRoleIds.length === 0) {
      return res.status(400).json({
        message: 'User already has all specified roles'
      });
    }

    // Create new role assignments
    const roleAssignments = newRoleIds.map(role_id => new ChiTietVaiTro({
      id_user: new ObjectId(user_id),
      id_role: new ObjectId(role_id),
      id_ctvt: new ObjectId()
    }));

    const result = await databaseServices.chiTietVaiTro.insertMany(roleAssignments);

    return res.status(201).json({
      message: 'Roles assigned successfully',
      data: {
        assigned_roles: newRoleIds,
        total_roles: [...existingRoleIds, ...newRoleIds]
      }
    });
  } catch (error) {
    console.error('Assign roles error:', error);
    return res.status(500).json({
      message: 'Error assigning roles'
    });
  }
};

// Remove multiple roles from user
export const removeRolesFromUser = async (req: Request, res: Response) => {
  try {
    const { user_id } = req.params;
    const { role_ids } = req.body;

    if (!Array.isArray(role_ids)) {
      return res.status(400).json({
        message: 'role_ids must be an array'
      });
    }

    const result = await databaseServices.chiTietVaiTro.deleteMany({
      id_user: new ObjectId(user_id),
      id_role: { $in: role_ids.map(id => new ObjectId(id)) }
    });

    if (result.deletedCount === 0) {
      return res.status(404).json({
        message: 'No role assignments found to remove'
      });
    }

    return res.status(200).json({
      message: `Successfully removed ${result.deletedCount} role(s)`
    });
  } catch (error) {
    console.error('Remove roles error:', error);
    return res.status(500).json({
      message: 'Error removing roles'
    });
  }
};

export const createRole = async (req: Request, res: Response) => {
    try {
      const { ten_role } = req.body;
  
      // Check if role already exists
      const existingRole = await databaseServices.VaiTro.findOne({ ten_role });
      if (existingRole) {
        return res.status(400).json({
          message: 'Role already exists'
        });
      }
  
      // Generate new ObjectId for id_role
      const roleId = new ObjectId();
  
      // Create new role with specified id_role
      const newRole = new VaiTro({
        id_role: roleId,
        ten_role
      });
  
      const result = await databaseServices.VaiTro.insertOne(newRole);
  
      return res.status(201).json({
        message: 'Role created successfully',
        data: {
          id_role: roleId,
          ten_role
        }
      });
    } catch (error) {
      console.error('Create role error:', error);
      return res.status(500).json({
        message: 'Error creating role'
      });
    }
};
  export const deleteRole = async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
  
      // Check if role exists
      const role = await databaseServices.VaiTro.findOne({
        _id: new ObjectId(id)
      });
  
      if (!role) {
        return res.status(404).json({
          message: 'Role not found'
        });
      }
  
      // Check if role is assigned to any users
      const usersWithRole = await databaseServices.chiTietVaiTro.findOne({
        id_role: new ObjectId(id)
      });
  
      if (usersWithRole) {
        return res.status(400).json({
          message: 'Cannot delete role that is assigned to users'
        });
      }
  
      // Delete role
      const result = await databaseServices.VaiTro.deleteMany({
        _id: new ObjectId(id)
      });
      
      return res.status(200).json({
        message: 'Role deleted ${result.deletedCount} successfully'
      });
    } catch (error) {
      console.error('Delete role error:', error);
      return res.status(500).json({
        message: 'Error deleting role'
      });
    }
  };


export const getAllRoles = async (req: Request, res: Response) => {
  try {
    const roles = await databaseServices.VaiTro
      .find({})
      .toArray();

    return res.status(200).json({
      data: roles
    });
  } catch (error) {
    console.error('Get all roles error:', error);
    return res.status(500).json({
      message: 'Error getting roles'
    });
  }
};
  