import dotenv from 'dotenv';
dotenv.config();

import mongoose from 'mongoose';
import app from '../src/app.js';
import { connectDB } from '../src/config/db.js';
import { User } from '../src/models/User.js';
import { Doctor } from '../src/models/Doctor.js';
import { Facility } from '../src/models/Facility.js';
import { Appointment } from '../src/models/Appointment.js';

let passed = 0;
let failed = 0;

const assert = (condition, testName) => {
  if (condition) {
    console.log(`  ✓ PASS: ${testName}`);
    passed++;
  } else {
    console.error(`  ✗ FAIL: ${testName}`);
    failed++;
  }
};

const runTests = async () => {
  console.log('\n======================================================');
  console.log('  🧪 Running RuralCare Automated Test Suite');
  console.log('======================================================\n');

  await connectDB();
  const server = app.listen(0); // Random available port
  const port = server.address().port;
  const baseUrl = `http://127.0.0.1:${port}/api`;

  try {
    // Test 1: Health check endpoint
    console.log('[Suite 1: System Health]');
    const healthRes = await fetch(`${baseUrl}/health`);
    const healthJson = await healthRes.json();
    assert(healthRes.status === 200, 'Health check returns 200 OK');
    assert(healthJson.database === 'connected', 'Database reported as connected');

    // Test 2: Facilities search and filter
    console.log('\n[Suite 2: Facility Discovery]');
    const facRes = await fetch(`${baseUrl}/facilities?district=Wayanad`);
    const facJson = await facRes.json();
    assert(facRes.status === 200, 'Get facilities by district returns 200');
    assert(facJson.facilities.length > 0, 'Found facilities in Wayanad');

    // Test 3: Doctor directory and availability
    console.log('\n[Suite 3: Doctor Schedules]');
    const docRes = await fetch(`${baseUrl}/doctors`);
    const docJson = await docRes.json();
    assert(docRes.status === 200, 'Get doctors returns 200');
    const doctor = docJson.doctors[0];
    assert(Boolean(doctor), 'At least one active doctor found');

    const testDate = '2026-11-16'; // Monday
    const availRes = await fetch(`${baseUrl}/doctors/${doctor._id}/availability?date=${testDate}`);
    const availJson = await availRes.json();
    assert(availRes.status === 200, 'Doctor availability returned 200');
    assert(Array.isArray(availJson.slots), 'Availability includes slots array');

    // Test 4: Patient Registration
    console.log('\n[Suite 4: Authentication & Security]');
    const testEmail = `test_patient_${Date.now()}@ruralcare.test`;
    const regRes = await fetch(`${baseUrl}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: 'Test Patient QA',
        email: testEmail,
        password: 'Password123!',
        confirmPassword: 'Password123!',
      }),
    });
    const regJson = await regRes.json();
    assert(regRes.status === 201, 'Patient registration succeeded with 201');
    assert(regJson.user.role === 'PATIENT', 'Registered user strictly assigned PATIENT role');

    const patientToken = regJson.token;
    const cookieHeader = regRes.headers.get('set-cookie') || '';

    // Test 5: Role protection (Patient cannot access Admin endpoint)
    const adminEndpointRes = await fetch(`${baseUrl}/facilities`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${patientToken}`,
      },
      body: JSON.stringify({
        name: 'Unauthorized Facility Attempt',
      }),
    });
    assert(adminEndpointRes.status === 403, 'Patient forbidden from Admin facility creation (403)');

    // Test 6: Appointment Booking Flow
    console.log('\n[Suite 5: Appointment Safety & Slot Collision]');
    const testSlot = '11:00 AM';
    const bookRes = await fetch(`${baseUrl}/appointments`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${patientToken}`,
      },
      body: JSON.stringify({
        doctorId: doctor._id,
        appointmentDate: testDate,
        timeSlot: testSlot,
        symptoms: 'Mild cold symptoms for automated test',
      }),
    });
    const bookJson = await bookRes.json();
    assert(bookRes.status === 201, 'Appointment booked successfully (201)');
    assert(Boolean(bookJson.appointment?.appointmentRef), 'Unique appointment reference generated');

    const appointmentId = bookJson.appointment._id;

    // Test 7: Double Booking Prevention (Race condition / duplicate active slot test)
    const secondUserEmail = `second_user_${Date.now()}@ruralcare.test`;
    const secondUser = await User.create({
      name: 'Second User',
      email: secondUserEmail,
      passwordHash: 'hash',
      role: 'PATIENT',
    });

    const secondToken = (await import('../src/utils/jwt.js')).signToken({
      id: secondUser._id,
      role: secondUser.role,
    });

    const duplicateBookRes = await fetch(`${baseUrl}/appointments`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${secondToken}`,
      },
      body: JSON.stringify({
        doctorId: doctor._id,
        appointmentDate: testDate,
        timeSlot: testSlot,
        symptoms: 'Trying to book duplicate slot simultaneously',
      }),
    });
    assert(
      duplicateBookRes.status === 409,
      'Duplicate booking for identical slot is rejected with 409 Conflict'
    );

    // Test 8: Patient Appointment Cancellation
    console.log('\n[Suite 6: Cancellation & Slot Rebooking]');
    const cancelRes = await fetch(`${baseUrl}/appointments/${appointmentId}/cancel`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${patientToken}`,
      },
      body: JSON.stringify({ reason: 'Feeling better before consultation' }),
    });
    const cancelJson = await cancelRes.json();
    assert(cancelRes.status === 200, 'Appointment cancelled successfully (200)');
    assert(cancelJson.appointment.status === 'CANCELLED', 'Status transitioned to CANCELLED');

    // Test 9: Slot is now Re-bookable!
    const rebookRes = await fetch(`${baseUrl}/appointments`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${secondToken}`,
      },
      body: JSON.stringify({
        doctorId: doctor._id,
        appointmentDate: testDate,
        timeSlot: testSlot,
        symptoms: 'Second user booking now that slot has been freed',
      }),
    });
    assert(
      rebookRes.status === 201,
      'Freed slot was successfully re-booked by another patient (201)'
    );

    // Clean up test records
    await User.deleteMany({ email: { $in: [testEmail, secondUserEmail] } });
    await Appointment.deleteMany({ _id: { $in: [appointmentId, (await rebookRes.json()).appointment?._id] } });

    console.log('\n======================================================');
    console.log(`  Summary: ${passed} Passed, ${failed} Failed`);
    console.log('======================================================\n');

    server.close();
    await mongoose.connection.close();

    if (failed > 0) {
      process.exit(1);
    } else {
      process.exit(0);
    }
  } catch (error) {
    console.error('[Test Execution Error]:', error);
    server.close();
    await mongoose.connection.close();
    process.exit(1);
  }
};

runTests();
