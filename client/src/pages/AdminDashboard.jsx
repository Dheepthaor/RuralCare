import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import {
  ShieldAlert,
  Building2,
  Stethoscope,
  Calendar,
  BookOpen,
  PhoneCall,
  Plus,
  CheckCircle,
  XCircle,
  AlertCircle,
  Search,
  Filter,
  Trash2,
  Edit,
  Eye,
  RefreshCw,
} from 'lucide-react';
import { api } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { LoadingState } from '../components/LoadingState';

export const AdminDashboard = () => {
  const { user, isAuthenticated, isAdmin, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  const activeTab = searchParams.get('tab') || 'overview';

  // Data states
  const [loading, setLoading] = useState(true);
  const [facilities, setFacilities] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [articles, setArticles] = useState([]);
  const [ambulances, setAmbulances] = useState([]);

  // Modals
  const [showFacilityModal, setShowFacilityModal] = useState(false);
  const [showDoctorModal, setShowDoctorModal] = useState(false);
  const [showArticleModal, setShowArticleModal] = useState(false);
  const [showAmbulanceModal, setShowAmbulanceModal] = useState(false);

  // Facility Form State
  const [facForm, setFacForm] = useState({
    name: '',
    type: 'PHC',
    address: '',
    locality: '',
    district: 'Wayanad',
    contactNumber: '',
    openingHours: '8:00 AM - 5:00 PM',
    services: '',
    description: '',
  });

  // Doctor Form State
  const [docForm, setDocForm] = useState({
    name: '',
    speciality: 'General Medicine',
    qualifications: 'MBBS (Demo Credential)',
    facility: '',
    languages: 'Malayalam, English',
    consultationFee: 0,
    availableDays: 'Monday, Tuesday, Wednesday, Thursday, Friday, Saturday',
  });

  // Article Form State
  const [artForm, setArtForm] = useState({
    title: '',
    category: 'GENERAL',
    summary: '',
    content: '',
    malayalamTitle: '',
    malayalamSummary: '',
    malayalamContent: '',
    sourceAttribution: 'Department of Health Services, Kerala',
  });

  // Ambulance Form State
  const [ambForm, setAmbForm] = useState({
    displayName: '',
    telephoneNumber: '',
    serviceArea: '',
    district: 'Wayanad',
    contactType: 'GOVERNMENT',
    vehicleType: 'BASIC_LIFE_SUPPORT',
    verificationStatus: 'VERIFIED_ACTIVE',
    notes: '24/7 Telephone dispatch coordination.',
  });

  // Role verification check
  useEffect(() => {
    if (!authLoading) {
      if (!isAuthenticated) {
        navigate('/login?redirect=/admin');
      } else if (!isAdmin) {
        navigate('/dashboard'); // Non-admins restricted
      }
    }
  }, [authLoading, isAuthenticated, isAdmin]);

  const fetchAdminData = async () => {
    if (!isAdmin) return;
    setLoading(true);
    try {
      const [facRes, docRes, apptRes, artRes, ambRes] = await Promise.all([
        api.getFacilities({ limit: 100 }),
        api.getDoctors({ limit: 100 }),
        api.adminGetAppointments({ limit: 100 }),
        api.getArticles({ limit: 100 }),
        api.getAmbulanceContacts({ limit: 100 }),
      ]);

      if (facRes.success) setFacilities(facRes.facilities);
      if (docRes.success) setDoctors(docRes.doctors);
      if (apptRes.success) setAppointments(apptRes.appointments);
      if (artRes.success) setArticles(artRes.articles);
      if (ambRes.success) setAmbulances(ambRes.contacts);
    } catch (err) {
      console.error('Failed to load admin data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAdminData();
  }, [isAdmin]);

  // Actions
  const handleToggleFacility = async (id) => {
    try {
      await api.toggleFacilityStatus(id);
      await fetchAdminData();
    } catch (e) {
      alert(e.message);
    }
  };

  const handleToggleDoctor = async (id) => {
    try {
      await api.toggleDoctorStatus(id);
      await fetchAdminData();
    } catch (e) {
      alert(e.message);
    }
  };

  const handleToggleArticle = async (id) => {
    try {
      await api.toggleArticleStatus(id);
      await fetchAdminData();
    } catch (e) {
      alert(e.message);
    }
  };

  const handleToggleAmbulance = async (id) => {
    try {
      await api.toggleAmbulanceStatus(id);
      await fetchAdminData();
    } catch (e) {
      alert(e.message);
    }
  };

  const handleUpdateApptStatus = async (id, status) => {
    try {
      await api.adminUpdateAppointment(id, { status });
      await fetchAdminData();
    } catch (e) {
      alert(e.message);
    }
  };

  // Submit Facility
  const handleCreateFacility = async (e) => {
    e.preventDefault();
    try {
      const servicesArray = facForm.services
        .split(',')
        .map((s) => s.trim())
        .filter(Boolean);
      await api.createFacility({ ...facForm, services: servicesArray });
      setShowFacilityModal(false);
      setFacForm({
        name: '',
        type: 'PHC',
        address: '',
        locality: '',
        district: 'Wayanad',
        contactNumber: '',
        openingHours: '8:00 AM - 5:00 PM',
        services: '',
        description: '',
      });
      await fetchAdminData();
    } catch (e) {
      alert(e.message);
    }
  };

  // Submit Doctor
  const handleCreateDoctor = async (e) => {
    e.preventDefault();
    try {
      const langArray = docForm.languages
        .split(',')
        .map((l) => l.trim())
        .filter(Boolean);
      const daysArray = docForm.availableDays
        .split(',')
        .map((d) => d.trim())
        .filter(Boolean);
      await api.createDoctor({
        ...docForm,
        languages: langArray,
        availableDays: daysArray,
        consultationFee: Number(docForm.consultationFee),
      });
      setShowDoctorModal(false);
      setDocForm({
        name: '',
        speciality: 'General Medicine',
        qualifications: 'MBBS (Demo Credential)',
        facility: '',
        languages: 'Malayalam, English',
        consultationFee: 0,
        availableDays: 'Monday, Tuesday, Wednesday, Thursday, Friday, Saturday',
      });
      await fetchAdminData();
    } catch (e) {
      alert(e.message);
    }
  };

  // Submit Article
  const handleCreateArticle = async (e) => {
    e.preventDefault();
    try {
      await api.createArticle(artForm);
      setShowArticleModal(false);
      setArtForm({
        title: '',
        category: 'GENERAL',
        summary: '',
        content: '',
        malayalamTitle: '',
        malayalamSummary: '',
        malayalamContent: '',
        sourceAttribution: 'Department of Health Services, Kerala',
      });
      await fetchAdminData();
    } catch (e) {
      alert(e.message);
    }
  };

  // Submit Ambulance
  const handleCreateAmbulance = async (e) => {
    e.preventDefault();
    try {
      await api.createAmbulanceContact(ambForm);
      setShowAmbulanceModal(false);
      setAmbForm({
        displayName: '',
        telephoneNumber: '',
        serviceArea: '',
        district: 'Wayanad',
        contactType: 'GOVERNMENT',
        vehicleType: 'BASIC_LIFE_SUPPORT',
        verificationStatus: 'VERIFIED_ACTIVE',
        notes: '24/7 Telephone dispatch coordination.',
      });
      await fetchAdminData();
    } catch (e) {
      alert(e.message);
    }
  };

  if (authLoading || loading) return <LoadingState message="Connecting to secure admin portal..." />;

  const tabs = [
    { id: 'overview', label: 'Overview', icon: ShieldAlert },
    { id: 'facilities', label: 'Facilities', icon: Building2, count: facilities.length },
    { id: 'doctors', label: 'Doctors', icon: Stethoscope, count: doctors.length },
    { id: 'appointments', label: 'Appointments', icon: Calendar, count: appointments.length },
    { id: 'articles', label: 'Health Articles', icon: BookOpen, count: articles.length },
    { id: 'ambulances', label: 'Emergency Contacts', icon: PhoneCall, count: ambulances.length },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Admin Title Bar */}
      <div className="bg-slate-900 text-white p-6 sm:p-8 rounded-3xl shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 bg-amber-500/20 text-amber-300 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider mb-2">
            <ShieldAlert className="w-3.5 h-3.5" />
            <span>Administrator Control Hub</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            RuralCare Administrative Portal
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Supervise facilities, manage healthcare provider schedules, review bookings, and edit articles.
          </p>
        </div>

        <button
          onClick={fetchAdminData}
          className="inline-flex items-center gap-2 bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold px-4 py-2.5 rounded-xl border border-slate-700 transition"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span>Refresh Data</span>
        </button>
      </div>

      {/* Tabs Navigation */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 border-b border-slate-200 text-xs font-bold">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setSearchParams({ tab: tab.id })}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl transition shrink-0 ${
                isActive
                  ? 'bg-teal-800 text-white shadow-xs'
                  : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{tab.label}</span>
              {tab.count !== undefined && (
                <span
                  className={`text-[10px] px-1.5 py-0.2 rounded-full font-black ${
                    isActive ? 'bg-teal-950 text-teal-200' : 'bg-slate-100 text-slate-600'
                  }`}
                >
                  {tab.count}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* TAB 1: OVERVIEW */}
      {activeTab === 'overview' && (
        <div className="space-y-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400 block mb-1">
                Total Facilities
              </span>
              <p className="text-3xl font-black text-teal-900">{facilities.length}</p>
              <span className="text-[11px] text-slate-500 mt-2 block">
                PHCs, Taluk Hospitals & Pharmacies
              </span>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400 block mb-1">
                Active Doctors
              </span>
              <p className="text-3xl font-black text-teal-900">{doctors.length}</p>
              <span className="text-[11px] text-slate-500 mt-2 block">
                Across General & Specialty OP
              </span>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400 block mb-1">
                Patient Bookings
              </span>
              <p className="text-3xl font-black text-teal-900">{appointments.length}</p>
              <span className="text-[11px] text-slate-500 mt-2 block">
                {appointments.filter((a) => a.status === 'BOOKED').length} active slots reserved
              </span>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400 block mb-1">
                Emergency Directory
              </span>
              <p className="text-3xl font-black text-teal-900">{ambulances.length}</p>
              <span className="text-[11px] text-slate-500 mt-2 block">
                Verified lines & 4WD rescue units
              </span>
            </div>
          </div>

          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs space-y-4">
            <h3 className="text-base font-bold text-slate-900">Recent Patient Bookings</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-slate-200 text-slate-400 font-bold uppercase">
                    <th className="pb-3">Reference</th>
                    <th className="pb-3">Patient</th>
                    <th className="pb-3">Doctor</th>
                    <th className="pb-3">Date & Slot</th>
                    <th className="pb-3">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {appointments.slice(0, 5).map((appt) => (
                    <tr key={appt._id} className="py-2.5">
                      <td className="py-3 font-mono font-bold text-teal-900">
                        {appt.appointmentRef}
                      </td>
                      <td className="py-3">{appt.patient?.name}</td>
                      <td className="py-3">{appt.doctor?.name}</td>
                      <td className="py-3">
                        {appt.appointmentDate} • {appt.timeSlot}
                      </td>
                      <td className="py-3">
                        <span
                          className={`px-2 py-0.5 rounded-full font-bold text-[10px] ${
                            appt.status === 'BOOKED'
                              ? 'bg-emerald-100 text-emerald-800'
                              : 'bg-slate-100 text-slate-600'
                          }`}
                        >
                          {appt.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: FACILITIES MANAGEMENT */}
      {activeTab === 'facilities' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-slate-900">Facilities Management</h2>
            <button
              onClick={() => setShowFacilityModal(true)}
              className="inline-flex items-center gap-1.5 bg-teal-800 hover:bg-teal-900 text-white text-xs font-bold px-4 py-2.5 rounded-xl shadow-xs transition"
            >
              <Plus className="w-4 h-4" />
              <span>Add Facility</span>
            </button>
          </div>

          <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-xs">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold uppercase">
                <tr>
                  <th className="p-4">Facility Name</th>
                  <th className="p-4">Type</th>
                  <th className="p-4">District</th>
                  <th className="p-4">Phone</th>
                  <th className="p-4">Status</th>
                  <th className="p-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {facilities.map((fac) => (
                  <tr key={fac._id} className="hover:bg-slate-50/50">
                    <td className="p-4 font-bold text-slate-900">{fac.name}</td>
                    <td className="p-4">
                      <span className="font-semibold px-2 py-0.5 rounded bg-slate-100 text-slate-700">
                        {fac.type}
                      </span>
                    </td>
                    <td className="p-4 text-slate-600">{fac.district}</td>
                    <td className="p-4 text-slate-600">{fac.contactNumber}</td>
                    <td className="p-4">
                      <span
                        className={`px-2 py-0.5 rounded-full font-bold text-[10px] ${
                          fac.active
                            ? 'bg-emerald-100 text-emerald-800'
                            : 'bg-rose-100 text-rose-800'
                        }`}
                      >
                        {fac.active ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td className="p-4 text-right">
                      <button
                        onClick={() => handleToggleFacility(fac._id)}
                        className={`text-xs font-bold px-3 py-1 rounded-lg ${
                          fac.active
                            ? 'text-rose-600 hover:bg-rose-50'
                            : 'text-emerald-700 hover:bg-emerald-50'
                        }`}
                      >
                        {fac.active ? 'Deactivate' : 'Activate'}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 3: DOCTOR MANAGEMENT */}
      {activeTab === 'doctors' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-slate-900">Doctor & Schedule Management</h2>
            <button
              onClick={() => {
                if (facilities.length > 0 && !docForm.facility) {
                  setDocForm((prev) => ({ ...prev, facility: facilities[0]._id }));
                }
                setShowDoctorModal(true);
              }}
              className="inline-flex items-center gap-1.5 bg-teal-800 hover:bg-teal-900 text-white text-xs font-bold px-4 py-2.5 rounded-xl shadow-xs transition"
            >
              <Plus className="w-4 h-4" />
              <span>Add Doctor Profile</span>
            </button>
          </div>

          <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-xs">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold uppercase">
                <tr>
                  <th className="p-4">Doctor Name</th>
                  <th className="p-4">Speciality</th>
                  <th className="p-4">Facility</th>
                  <th className="p-4">Fee</th>
                  <th className="p-4">Status</th>
                  <th className="p-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {doctors.map((doc) => (
                  <tr key={doc._id} className="hover:bg-slate-50/50">
                    <td className="p-4 font-bold text-slate-900">{doc.name}</td>
                    <td className="p-4 text-teal-800 font-medium">{doc.speciality}</td>
                    <td className="p-4 text-slate-600">
                      {doc.facility?.name} ({doc.facility?.locality})
                    </td>
                    <td className="p-4 font-semibold text-slate-800">
                      {doc.consultationFee === 0 ? 'Free (Govt)' : `₹${doc.consultationFee}`}
                    </td>
                    <td className="p-4">
                      <span
                        className={`px-2 py-0.5 rounded-full font-bold text-[10px] ${
                          doc.active
                            ? 'bg-emerald-100 text-emerald-800'
                            : 'bg-rose-100 text-rose-800'
                        }`}
                      >
                        {doc.active ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td className="p-4 text-right">
                      <button
                        onClick={() => handleToggleDoctor(doc._id)}
                        className={`text-xs font-bold px-3 py-1 rounded-lg ${
                          doc.active
                            ? 'text-rose-600 hover:bg-rose-50'
                            : 'text-emerald-700 hover:bg-emerald-50'
                        }`}
                      >
                        {doc.active ? 'Deactivate' : 'Activate'}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 4: APPOINTMENTS MANAGEMENT */}
      {activeTab === 'appointments' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-slate-900">Patient Appointments & Tokens</h2>
            <span className="text-xs text-slate-500">
              Active unique slots are enforced at database level.
            </span>
          </div>

          <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-xs">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold uppercase">
                <tr>
                  <th className="p-4">Token Ref</th>
                  <th className="p-4">Patient</th>
                  <th className="p-4">Doctor</th>
                  <th className="p-4">Facility</th>
                  <th className="p-4">Date & Slot</th>
                  <th className="p-4">Status</th>
                  <th className="p-4 text-right">Update</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {appointments.map((appt) => (
                  <tr key={appt._id} className="hover:bg-slate-50/50">
                    <td className="p-4 font-mono font-bold text-teal-900">
                      {appt.appointmentRef}
                    </td>
                    <td className="p-4 font-semibold text-slate-800">
                      {appt.patient?.name}
                      <span className="text-[10px] text-slate-400 block">{appt.patient?.phone}</span>
                    </td>
                    <td className="p-4">{appt.doctor?.name}</td>
                    <td className="p-4 text-slate-600">{appt.facility?.name}</td>
                    <td className="p-4">
                      {appt.appointmentDate}
                      <span className="text-[10px] font-bold text-slate-500 block">
                        {appt.timeSlot}
                      </span>
                    </td>
                    <td className="p-4">
                      <span
                        className={`px-2 py-0.5 rounded-full font-bold text-[10px] ${
                          appt.status === 'BOOKED'
                            ? 'bg-emerald-100 text-emerald-800'
                            : appt.status === 'COMPLETED'
                            ? 'bg-blue-100 text-blue-800'
                            : 'bg-rose-100 text-rose-800'
                        }`}
                      >
                        {appt.status}
                      </span>
                    </td>
                    <td className="p-4 text-right space-x-1">
                      {appt.status === 'BOOKED' && (
                        <>
                          <button
                            onClick={() => handleUpdateApptStatus(appt._id, 'COMPLETED')}
                            className="text-[11px] font-bold text-blue-700 hover:bg-blue-50 px-2 py-1 rounded"
                          >
                            Mark Done
                          </button>
                          <button
                            onClick={() => handleUpdateApptStatus(appt._id, 'CANCELLED')}
                            className="text-[11px] font-bold text-rose-600 hover:bg-rose-50 px-2 py-1 rounded"
                          >
                            Cancel
                          </button>
                        </>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 5: ARTICLES MANAGEMENT */}
      {activeTab === 'articles' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-slate-900">Health Articles & Guides</h2>
            <button
              onClick={() => setShowArticleModal(true)}
              className="inline-flex items-center gap-1.5 bg-teal-800 hover:bg-teal-900 text-white text-xs font-bold px-4 py-2.5 rounded-xl shadow-xs transition"
            >
              <Plus className="w-4 h-4" />
              <span>Publish Article</span>
            </button>
          </div>

          <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-xs">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold uppercase">
                <tr>
                  <th className="p-4">Title</th>
                  <th className="p-4">Category</th>
                  <th className="p-4">Malayalam Content</th>
                  <th className="p-4">Status</th>
                  <th className="p-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {articles.map((art) => (
                  <tr key={art._id} className="hover:bg-slate-50/50">
                    <td className="p-4 font-bold text-slate-900">{art.title}</td>
                    <td className="p-4 font-semibold text-teal-800">{art.category}</td>
                    <td className="p-4">
                      {art.malayalamTitle ? (
                        <span className="text-emerald-700 font-bold">✓ Translated</span>
                      ) : (
                        <span className="text-slate-400">English Only</span>
                      )}
                    </td>
                    <td className="p-4">
                      <span
                        className={`px-2 py-0.5 rounded-full font-bold text-[10px] ${
                          art.active
                            ? 'bg-emerald-100 text-emerald-800'
                            : 'bg-rose-100 text-rose-800'
                        }`}
                      >
                        {art.active ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td className="p-4 text-right">
                      <button
                        onClick={() => handleToggleArticle(art._id)}
                        className={`text-xs font-bold px-3 py-1 rounded-lg ${
                          art.active
                            ? 'text-rose-600 hover:bg-rose-50'
                            : 'text-emerald-700 hover:bg-emerald-50'
                        }`}
                      >
                        {art.active ? 'Deactivate' : 'Activate'}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 6: AMBULANCE MANAGEMENT */}
      {activeTab === 'ambulances' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-slate-900">Emergency & Ambulance Contacts</h2>
            <button
              onClick={() => setShowAmbulanceModal(true)}
              className="inline-flex items-center gap-1.5 bg-teal-800 hover:bg-teal-900 text-white text-xs font-bold px-4 py-2.5 rounded-xl shadow-xs transition"
            >
              <Plus className="w-4 h-4" />
              <span>Add Contact</span>
            </button>
          </div>

          <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-xs">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold uppercase">
                <tr>
                  <th className="p-4">Display Name</th>
                  <th className="p-4">Phone Number</th>
                  <th className="p-4">Service Area</th>
                  <th className="p-4">Verification</th>
                  <th className="p-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {ambulances.map((amb) => (
                  <tr key={amb._id} className="hover:bg-slate-50/50">
                    <td className="p-4 font-bold text-slate-900">{amb.displayName}</td>
                    <td className="p-4 font-mono font-bold text-red-600">{amb.telephoneNumber}</td>
                    <td className="p-4 text-slate-600">{amb.serviceArea}</td>
                    <td className="p-4">
                      <span
                        className={`px-2 py-0.5 rounded-full font-bold text-[10px] ${
                          amb.verificationStatus === 'VERIFIED_ACTIVE'
                            ? 'bg-emerald-100 text-emerald-800'
                            : 'bg-amber-100 text-amber-800'
                        }`}
                      >
                        {amb.verificationStatus}
                      </span>
                    </td>
                    <td className="p-4 text-right">
                      <button
                        onClick={() => handleToggleAmbulance(amb._id)}
                        className={`text-xs font-bold px-3 py-1 rounded-lg ${
                          amb.active
                            ? 'text-rose-600 hover:bg-rose-50'
                            : 'text-emerald-700 hover:bg-emerald-50'
                        }`}
                      >
                        {amb.active ? 'Deactivate' : 'Activate'}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* CREATE FACILITY MODAL */}
      {showFacilityModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl max-h-[90vh] overflow-y-auto space-y-4">
            <h3 className="text-lg font-bold text-slate-900">Add Healthcare Facility</h3>
            <form onSubmit={handleCreateFacility} className="space-y-3 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Facility Name *</label>
                <input
                  type="text"
                  value={facForm.name}
                  onChange={(e) => setFacForm({ ...facForm, name: e.target.value })}
                  placeholder="e.g. Thirunelly Primary Health Centre"
                  required
                  className="w-full p-2.5 border border-slate-200 rounded-xl"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Type *</label>
                  <select
                    value={facForm.type}
                    onChange={(e) => setFacForm({ ...facForm, type: e.target.value })}
                    className="w-full p-2.5 border border-slate-200 rounded-xl"
                  >
                    <option value="PHC">PHC</option>
                    <option value="CHC">CHC</option>
                    <option value="HOSPITAL">HOSPITAL</option>
                    <option value="PHARMACY">PHARMACY</option>
                    <option value="CLINIC">CLINIC</option>
                  </select>
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">District *</label>
                  <input
                    type="text"
                    value={facForm.district}
                    onChange={(e) => setFacForm({ ...facForm, district: e.target.value })}
                    required
                    className="w-full p-2.5 border border-slate-200 rounded-xl"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Locality *</label>
                  <input
                    type="text"
                    value={facForm.locality}
                    onChange={(e) => setFacForm({ ...facForm, locality: e.target.value })}
                    required
                    className="w-full p-2.5 border border-slate-200 rounded-xl"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Contact Phone *</label>
                  <input
                    type="text"
                    value={facForm.contactNumber}
                    onChange={(e) => setFacForm({ ...facForm, contactNumber: e.target.value })}
                    required
                    className="w-full p-2.5 border border-slate-200 rounded-xl"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Full Address *</label>
                <input
                  type="text"
                  value={facForm.address}
                  onChange={(e) => setFacForm({ ...facForm, address: e.target.value })}
                  required
                  className="w-full p-2.5 border border-slate-200 rounded-xl"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Services (comma-separated)</label>
                <input
                  type="text"
                  value={facForm.services}
                  onChange={(e) => setFacForm({ ...facForm, services: e.target.value })}
                  placeholder="e.g. General OPD, Maternity Care, Pharmacy, Immunisation"
                  className="w-full p-2.5 border border-slate-200 rounded-xl"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Description</label>
                <textarea
                  value={facForm.description}
                  onChange={(e) => setFacForm({ ...facForm, description: e.target.value })}
                  rows={2}
                  className="w-full p-2.5 border border-slate-200 rounded-xl"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowFacilityModal(false)}
                  className="px-4 py-2 text-slate-600 rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-teal-800 text-white font-bold rounded-xl"
                >
                  Create Facility
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* CREATE DOCTOR MODAL */}
      {showDoctorModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl max-h-[90vh] overflow-y-auto space-y-4">
            <h3 className="text-lg font-bold text-slate-900">Add Doctor Profile</h3>
            <form onSubmit={handleCreateDoctor} className="space-y-3 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Doctor Name *</label>
                <input
                  type="text"
                  value={docForm.name}
                  onChange={(e) => setDocForm({ ...docForm, name: e.target.value })}
                  placeholder="e.g. Dr. K. Radhakrishnan"
                  required
                  className="w-full p-2.5 border border-slate-200 rounded-xl"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Speciality *</label>
                  <input
                    type="text"
                    value={docForm.speciality}
                    onChange={(e) => setDocForm({ ...docForm, speciality: e.target.value })}
                    required
                    className="w-full p-2.5 border border-slate-200 rounded-xl"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Consultation Fee (₹)</label>
                  <input
                    type="number"
                    value={docForm.consultationFee}
                    onChange={(e) => setDocForm({ ...docForm, consultationFee: e.target.value })}
                    className="w-full p-2.5 border border-slate-200 rounded-xl"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Stationed Facility *</label>
                <select
                  value={docForm.facility}
                  onChange={(e) => setDocForm({ ...docForm, facility: e.target.value })}
                  required
                  className="w-full p-2.5 border border-slate-200 rounded-xl"
                >
                  <option value="">Select Facility</option>
                  {facilities.map((f) => (
                    <option key={f._id} value={f._id}>
                      {f.name} ({f.locality})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Qualifications</label>
                <input
                  type="text"
                  value={docForm.qualifications}
                  onChange={(e) => setDocForm({ ...docForm, qualifications: e.target.value })}
                  className="w-full p-2.5 border border-slate-200 rounded-xl"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Available Days (comma-separated)</label>
                <input
                  type="text"
                  value={docForm.availableDays}
                  onChange={(e) => setDocForm({ ...docForm, availableDays: e.target.value })}
                  className="w-full p-2.5 border border-slate-200 rounded-xl"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowDoctorModal(false)}
                  className="px-4 py-2 text-slate-600 rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-teal-800 text-white font-bold rounded-xl"
                >
                  Create Doctor
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* CREATE ARTICLE MODAL */}
      {showArticleModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-xl w-full p-6 sm:p-8 shadow-2xl max-h-[90vh] overflow-y-auto space-y-4">
            <h3 className="text-lg font-bold text-slate-900">Publish Health Article</h3>
            <form onSubmit={handleCreateArticle} className="space-y-3 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">English Title *</label>
                <input
                  type="text"
                  value={artForm.title}
                  onChange={(e) => setArtForm({ ...artForm, title: e.target.value })}
                  required
                  className="w-full p-2.5 border border-slate-200 rounded-xl"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Category *</label>
                <select
                  value={artForm.category}
                  onChange={(e) => setArtForm({ ...artForm, category: e.target.value })}
                  className="w-full p-2.5 border border-slate-200 rounded-xl"
                >
                  <option value="GENERAL">GENERAL</option>
                  <option value="FIRST_AID">FIRST_AID</option>
                  <option value="MATERNAL">MATERNAL</option>
                  <option value="CHILD_HEALTH">CHILD_HEALTH</option>
                  <option value="NUTRITION">NUTRITION</option>
                  <option value="HYGIENE">HYGIENE</option>
                  <option value="PREVENTIVE">PREVENTIVE</option>
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">English Summary *</label>
                <textarea
                  value={artForm.summary}
                  onChange={(e) => setArtForm({ ...artForm, summary: e.target.value })}
                  rows={2}
                  required
                  className="w-full p-2.5 border border-slate-200 rounded-xl"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">English Content *</label>
                <textarea
                  value={artForm.content}
                  onChange={(e) => setArtForm({ ...artForm, content: e.target.value })}
                  rows={4}
                  required
                  className="w-full p-2.5 border border-slate-200 rounded-xl"
                />
              </div>

              <div className="border-t border-slate-100 pt-2">
                <span className="font-bold text-teal-800 block mb-1">Malayalam Translation (Optional)</span>
                <input
                  type="text"
                  value={artForm.malayalamTitle}
                  onChange={(e) => setArtForm({ ...artForm, malayalamTitle: e.target.value })}
                  placeholder="മലയാളം തലക്കെട്ട്"
                  className="w-full p-2.5 border border-slate-200 rounded-xl mb-2"
                />
                <textarea
                  value={artForm.malayalamContent}
                  onChange={(e) => setArtForm({ ...artForm, malayalamContent: e.target.value })}
                  placeholder="മലയാളം വിവരണം"
                  rows={3}
                  className="w-full p-2.5 border border-slate-200 rounded-xl"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowArticleModal(false)}
                  className="px-4 py-2 text-slate-600 rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-teal-800 text-white font-bold rounded-xl"
                >
                  Publish Article
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* CREATE AMBULANCE MODAL */}
      {showAmbulanceModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl space-y-4">
            <h3 className="text-lg font-bold text-slate-900">Add Ambulance Helpline</h3>
            <form onSubmit={handleCreateAmbulance} className="space-y-3 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Display Name *</label>
                <input
                  type="text"
                  value={ambForm.displayName}
                  onChange={(e) => setAmbForm({ ...ambForm, displayName: e.target.value })}
                  required
                  className="w-full p-2.5 border border-slate-200 rounded-xl"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Phone Number *</label>
                  <input
                    type="text"
                    value={ambForm.telephoneNumber}
                    onChange={(e) => setAmbForm({ ...ambForm, telephoneNumber: e.target.value })}
                    required
                    className="w-full p-2.5 border border-slate-200 rounded-xl"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">District *</label>
                  <input
                    type="text"
                    value={ambForm.district}
                    onChange={(e) => setAmbForm({ ...ambForm, district: e.target.value })}
                    required
                    className="w-full p-2.5 border border-slate-200 rounded-xl"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Service Area *</label>
                <input
                  type="text"
                  value={ambForm.serviceArea}
                  onChange={(e) => setAmbForm({ ...ambForm, serviceArea: e.target.value })}
                  required
                  className="w-full p-2.5 border border-slate-200 rounded-xl"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowAmbulanceModal(false)}
                  className="px-4 py-2 text-slate-600 rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-teal-800 text-white font-bold rounded-xl"
                >
                  Save Helpline
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
