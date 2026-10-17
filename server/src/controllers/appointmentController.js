import { Appointment } from '../models/Appointment.js';
import { Doctor } from '../models/Doctor.js';
import { generateAppointmentReference } from '../utils/generateReference.js';

export const bookAppointment = async (req, res, next) => {
  try {
    const { doctorId, appointmentDate, timeSlot, symptoms } = req.body;

    if (!doctorId || !appointmentDate || !timeSlot) {
      return res.status(400).json({
        success: false,
        message: 'Doctor, appointment date, and time slot are required.',
      });
    }

    // Validate date format (YYYY-MM-DD)
    const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
    if (!dateRegex.test(appointmentDate)) {
      return res.status(400).json({
        success: false,
        message: 'Appointment date must be formatted as YYYY-MM-DD.',
      });
    }

    // Check date is not in past (allow today and future)
    const todayStr = new Date().toISOString().split('T')[0];
    if (appointmentDate < todayStr) {
      return res.status(400).json({
        success: false,
        message: 'Cannot schedule appointments for past dates.',
      });
    }

    // Verify doctor and facility
    const doctor = await Doctor.findById(doctorId).populate('facility');
    if (!doctor || !doctor.active) {
      return res.status(404).json({
        success: false,
        message: 'Selected doctor is not available.',
      });
    }

    if (!doctor.timeSlots.includes(timeSlot)) {
      return res.status(400).json({
        success: false,
        message: 'The selected time slot is not within the doctor’s schedule.',
      });
    }

    // Check if slot is already actively booked (pre-check, with DB unique index as safety net against race conditions)
    const existingActiveBooking = await Appointment.findOne({
      doctor: doctor._id,
      appointmentDate,
      timeSlot,
      isActiveSlot: true,
    });

    if (existingActiveBooking) {
      return res.status(409).json({
        success: false,
        message: 'This time slot is already booked. Please choose another time or date.',
        code: 'SLOT_ALREADY_BOOKED',
      });
    }

    // Generate unique reference
    let appointmentRef = generateAppointmentReference();
    let collisionCheck = await Appointment.findOne({ appointmentRef });
    while (collisionCheck) {
      appointmentRef = generateAppointmentReference();
      collisionCheck = await Appointment.findOne({ appointmentRef });
    }

    // Create appointment
    const appointment = await Appointment.create({
      appointmentRef,
      patient: req.user._id,
      doctor: doctor._id,
      facility: doctor.facility._id,
      appointmentDate,
      timeSlot,
      status: 'BOOKED',
      isActiveSlot: true,
      symptoms: symptoms ? symptoms.trim() : '',
    });

    const populatedAppointment = await Appointment.findById(appointment._id)
      .populate('doctor', 'name speciality profileImage consultationFee')
      .populate('facility', 'name type locality district address contactNumber')
      .populate('patient', 'name email phone');

    return res.status(201).json({
      success: true,
      message: 'Appointment booked successfully.',
      appointment: populatedAppointment,
    });
  } catch (error) {
    next(error);
  }
};

export const getMyAppointments = async (req, res, next) => {
  try {
    const appointments = await Appointment.find({ patient: req.user._id })
      .populate('doctor', 'name speciality profileImage consultationFee')
      .populate('facility', 'name type locality district address contactNumber')
      .sort({ appointmentDate: -1, createdAt: -1 });

    return res.status(200).json({
      success: true,
      count: appointments.length,
      appointments,
    });
  } catch (error) {
    next(error);
  }
};

export const cancelAppointment = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { reason } = req.body;

    const appointment = await Appointment.findById(id);

    if (!appointment) {
      return res.status(404).json({
        success: false,
        message: 'Appointment not found.',
      });
    }

    // Verify ownership: must be the booking patient or an admin
    const isOwner = appointment.patient.toString() === req.user._id.toString();
    const isAdmin = req.user.role === 'ADMIN';

    if (!isOwner && !isAdmin) {
      return res.status(403).json({
        success: false,
        message: 'You are not authorized to cancel this appointment.',
      });
    }

    if (appointment.status === 'CANCELLED') {
      return res.status(400).json({
        success: false,
        message: 'This appointment has already been cancelled.',
      });
    }

    // Mark as cancelled and release slot for rebooking
    appointment.status = 'CANCELLED';
    appointment.isActiveSlot = false; // Frees slot in compound index
    appointment.cancellationReason = reason || 'Cancelled by patient';
    appointment.cancelledAt = new Date();

    await appointment.save();

    const updated = await Appointment.findById(appointment._id)
      .populate('doctor', 'name speciality')
      .populate('facility', 'name locality');

    return res.status(200).json({
      success: true,
      message: 'Appointment cancelled successfully. The time slot is now available for other patients.',
      appointment: updated,
    });
  } catch (error) {
    next(error);
  }
};

export const adminGetAppointments = async (req, res, next) => {
  try {
    const { status, date, doctorId, page = 1, limit = 50 } = req.query;

    const query = {};
    if (status && status !== 'ALL') {
      query.status = status.toUpperCase();
    }
    if (date) {
      query.appointmentDate = date;
    }
    if (doctorId) {
      query.doctor = doctorId;
    }

    const appointments = await Appointment.find(query)
      .populate('doctor', 'name speciality')
      .populate('facility', 'name locality district')
      .populate('patient', 'name email phone')
      .sort({ appointmentDate: -1, createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(Number(limit));

    const total = await Appointment.countDocuments(query);

    return res.status(200).json({
      success: true,
      count: appointments.length,
      total,
      appointments,
    });
  } catch (error) {
    next(error);
  }
};

export const adminUpdateAppointment = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { status, cancellationReason } = req.body;

    const appointment = await Appointment.findById(id);
    if (!appointment) {
      return res.status(404).json({
        success: false,
        message: 'Appointment not found.',
      });
    }

    if (status) {
      appointment.status = status;
      if (status === 'CANCELLED') {
        appointment.isActiveSlot = false;
        appointment.cancellationReason = cancellationReason || 'Cancelled by administrator';
        appointment.cancelledAt = new Date();
      } else if (status === 'COMPLETED') {
        appointment.isActiveSlot = false;
      } else if (status === 'BOOKED') {
        appointment.isActiveSlot = true;
      }
    }

    await appointment.save();

    return res.status(200).json({
      success: true,
      message: 'Appointment updated successfully.',
      appointment,
    });
  } catch (error) {
    next(error);
  }
};
