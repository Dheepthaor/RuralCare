import { AmbulanceContact } from '../models/AmbulanceContact.js';

export const getAmbulanceContacts = async (req, res, next) => {
  try {
    const { district, type } = req.query;

    const query = { active: true };

    if (district && district !== 'ALL') {
      query.$or = [{ district: { $regex: new RegExp(`^${district}$`, 'i') } }, { district: 'Statewide' }];
    }

    if (type && type !== 'ALL') {
      query.contactType = type.toUpperCase();
    }

    const contacts = await AmbulanceContact.find(query).sort({ verificationStatus: 1, createdAt: -1 });

    return res.status(200).json({
      success: true,
      count: contacts.length,
      disclaimer:
        'Notice: This directory provides direct telephone assistance numbers. Clicking a number initiates a regular phone call via your device; it does not automatically dispatch a vehicle or track ambulances.',
      contacts,
    });
  } catch (error) {
    next(error);
  }
};

export const createAmbulanceContact = async (req, res, next) => {
  try {
    const contact = await AmbulanceContact.create(req.body);
    return res.status(201).json({
      success: true,
      message: 'Ambulance contact added successfully.',
      contact,
    });
  } catch (error) {
    next(error);
  }
};

export const updateAmbulanceContact = async (req, res, next) => {
  try {
    const { id } = req.params;
    const contact = await AmbulanceContact.findByIdAndUpdate(
      id,
      { ...req.body, lastVerifiedDate: new Date() },
      { new: true, runValidators: true }
    );

    if (!contact) {
      return res.status(404).json({
        success: false,
        message: 'Ambulance contact not found.',
      });
    }

    return res.status(200).json({
      success: true,
      message: 'Ambulance contact updated successfully.',
      contact,
    });
  } catch (error) {
    next(error);
  }
};

export const toggleAmbulanceStatus = async (req, res, next) => {
  try {
    const { id } = req.params;
    const contact = await AmbulanceContact.findById(id);

    if (!contact) {
      return res.status(404).json({
        success: false,
        message: 'Ambulance contact not found.',
      });
    }

    contact.active = !contact.active;
    await contact.save();

    return res.status(200).json({
      success: true,
      message: `Ambulance contact ${contact.active ? 'activated' : 'deactivated'} successfully.`,
      contact,
    });
  } catch (error) {
    next(error);
  }
};
