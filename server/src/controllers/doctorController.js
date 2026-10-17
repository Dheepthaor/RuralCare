import { Doctor } from '../models/Doctor.js';
import { Appointment } from '../models/Appointment.js';

export const getDoctors = async (req, res, next) => {
  try {
    const { search, speciality, facilityId, language, page = 1, limit = 50 } = req.query;

    const query = { active: true };

    if (speciality && speciality !== 'ALL') {
      query.speciality = { $regex: new RegExp(`^${speciality}$`, 'i') };
    }

    if (facilityId) {
      query.facility = facilityId;
    }

    if (language) {
      query.languages = { $in: [new RegExp(language, 'i')] };
    }

    if (search && search.trim()) {
      const searchRegex = new RegExp(search.trim(), 'i');
      query.$or = [{ name: searchRegex }, { speciality: searchRegex }, { bio: searchRegex }];
    }

    const doctors = await Doctor.find(query)
      .populate('facility', 'name type locality district address contactNumber')
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(Number(limit));

    const total = await Doctor.countDocuments(query);

    return res.status(200).json({
      success: true,
      count: doctors.length,
      total,
      doctors,
    });
  } catch (error) {
    next(error);
  }
};

export const getDoctorById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const doctor = await Doctor.findById(id).populate('facility');

    if (!doctor) {
      return res.status(404).json({
        success: false,
        message: 'Doctor profile not found.',
      });
    }

    return res.status(200).json({
      success: true,
      doctor,
    });
  } catch (error) {
    next(error);
  }
};

export const getDoctorAvailability = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { date } = req.query; // Expected YYYY-MM-DD

    if (!date) {
      return res.status(400).json({
        success: false,
        message: 'Please specify an appointment date in YYYY-MM-DD format.',
      });
    }

    const doctor = await Doctor.findById(id).populate('facility', 'name locality');
    if (!doctor || !doctor.active) {
      return res.status(404).json({
        success: false,
        message: 'Doctor not found or inactive.',
      });
    }

    // Determine the day of week for the requested date
    const dateObj = new Date(`${date}T00:00:00Z`);
    if (isNaN(dateObj.getTime())) {
      return res.status(400).json({
        success: false,
        message: 'Invalid date format.',
      });
    }

    const daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const dayName = daysOfWeek[dateObj.getUTCDay()];

    // Check if doctor works on this day
    const isWorkingDay = doctor.availableDays.includes(dayName);

    // Fetch active bookings for this doctor on this date
    const activeAppointments = await Appointment.find({
      doctor: doctor._id,
      appointmentDate: date,
      isActiveSlot: true,
    }).select('timeSlot');

    const bookedSlotSet = new Set(activeAppointments.map((a) => a.timeSlot));

    const slots = (doctor.timeSlots || []).map((slot) => ({
      timeSlot: slot,
      isAvailable: isWorkingDay && !bookedSlotSet.has(slot),
      reason: !isWorkingDay ? `Doctor not scheduled on ${dayName}` : bookedSlotSet.has(slot) ? 'Booked' : 'Available',
    }));

    return res.status(200).json({
      success: true,
      doctor: {
        id: doctor._id,
        name: doctor.name,
        speciality: doctor.speciality,
        facility: doctor.facility,
      },
      date,
      dayOfWeek: dayName,
      isWorkingDay,
      slots,
    });
  } catch (error) {
    next(error);
  }
};

export const createDoctor = async (req, res, next) => {
  try {
    const doctor = await Doctor.create(req.body);
    const populated = await Doctor.findById(doctor._id).populate('facility');
    return res.status(201).json({
      success: true,
      message: 'Doctor profile created successfully.',
      doctor: populated,
    });
  } catch (error) {
    next(error);
  }
};

export const updateDoctor = async (req, res, next) => {
  try {
    const { id } = req.params;
    const doctor = await Doctor.findByIdAndUpdate(id, req.body, {
      new: true,
      runValidators: true,
    }).populate('facility');

    if (!doctor) {
      return res.status(404).json({
        success: false,
        message: 'Doctor not found.',
      });
    }

    return res.status(200).json({
      success: true,
      message: 'Doctor profile updated successfully.',
      doctor,
    });
  } catch (error) {
    next(error);
  }
};

export const toggleDoctorStatus = async (req, res, next) => {
  try {
    const { id } = req.params;
    const doctor = await Doctor.findById(id);

    if (!doctor) {
      return res.status(404).json({
        success: false,
        message: 'Doctor not found.',
      });
    }

    doctor.active = !doctor.active;
    await doctor.save();

    return res.status(200).json({
      success: true,
      message: `Doctor ${doctor.active ? 'activated' : 'deactivated'} successfully.`,
      doctor,
    });
  } catch (error) {
    next(error);
  }
};
