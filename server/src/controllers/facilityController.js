import { Facility } from '../models/Facility.js';
import { Doctor } from '../models/Doctor.js';

export const getFacilities = async (req, res, next) => {
  try {
    const { search, type, district, service, page = 1, limit = 50 } = req.query;

    const query = { active: true };

    if (type && type !== 'ALL') {
      query.type = type.toUpperCase();
    }

    if (district && district !== 'ALL') {
      query.district = { $regex: new RegExp(`^${district}$`, 'i') };
    }

    if (service) {
      query.services = { $in: [new RegExp(service, 'i')] };
    }

    if (search && search.trim()) {
      const searchRegex = new RegExp(search.trim(), 'i');
      query.$or = [
        { name: searchRegex },
        { locality: searchRegex },
        { district: searchRegex },
        { services: searchRegex },
      ];
    }

    const facilities = await Facility.find(query)
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(Number(limit));

    const total = await Facility.countDocuments(query);

    return res.status(200).json({
      success: true,
      count: facilities.length,
      total,
      facilities,
    });
  } catch (error) {
    next(error);
  }
};

export const getFacilityById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const facility = await Facility.findById(id);

    if (!facility) {
      return res.status(404).json({
        success: false,
        message: 'Healthcare facility not found.',
      });
    }

    // Also fetch active doctors stationed at this facility
    const doctors = await Doctor.find({ facility: facility._id, active: true });

    return res.status(200).json({
      success: true,
      facility,
      doctors,
    });
  } catch (error) {
    next(error);
  }
};

export const createFacility = async (req, res, next) => {
  try {
    const facility = await Facility.create(req.body);
    return res.status(201).json({
      success: true,
      message: 'Facility created successfully.',
      facility,
    });
  } catch (error) {
    next(error);
  }
};

export const updateFacility = async (req, res, next) => {
  try {
    const { id } = req.params;
    const facility = await Facility.findByIdAndUpdate(id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!facility) {
      return res.status(404).json({
        success: false,
        message: 'Facility not found.',
      });
    }

    return res.status(200).json({
      success: true,
      message: 'Facility updated successfully.',
      facility,
    });
  } catch (error) {
    next(error);
  }
};

export const toggleFacilityStatus = async (req, res, next) => {
  try {
    const { id } = req.params;
    const facility = await Facility.findById(id);

    if (!facility) {
      return res.status(404).json({
        success: false,
        message: 'Facility not found.',
      });
    }

    facility.active = !facility.active;
    await facility.save();

    return res.status(200).json({
      success: true,
      message: `Facility ${facility.active ? 'activated' : 'deactivated'} successfully.`,
      facility,
    });
  } catch (error) {
    next(error);
  }
};
