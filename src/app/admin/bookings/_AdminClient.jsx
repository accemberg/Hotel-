"use client";
export const dynamic = 'force-dynamic';

import { useEffect, useState } from "react";
import { Plus, Calendar, ShieldAlert, LogIn, LogOut, CheckCircle } from "lucide-react";
import { fetchBookings, createBooking, updateBooking, deleteBooking, checkRoomBookingOverlap } from "@/lib/bookings";
import { fetchOccupants, createOccupant, updateOccupant } from "@/lib/occupants";
import { markRoomDirtyAfterCheckOut } from "@/lib/housekeeping";
import { getRooms } from "@/lib/rooms";
import { fetchFloors } from "@/lib/floors";

import { PageHeader } from "@/components/admin/PageHeader";
import { AdminCard } from "@/components/admin/AdminCard";
import { AdminButton } from "@/components/admin/AdminButton";
import { StatusBadge } from "@/components/admin/StatusBadge";
import { SkeletonLoader } from "@/components/admin/SkeletonLoader";
import { EmptyState } from "@/components/admin/EmptyState";
import { AdminModal } from "@/components/admin/AdminModal";
import { AdminInput, AdminSelect, AdminTextarea, SearchInput } from "@/components/admin/AdminInputs";
import { AdminTable, AdminTableRow, AdminTableCell } from "@/components/admin/AdminTable";

const EMPTY_FORM = {
  guestName: "",
  phone: "",
  email: "",
  adults: 1,
  children: 0,
  checkIn: "",
  checkOut: "",
  roomId: "",
  roomNumber: "",
  roomName: "",
  floorId: "",
  floorName: "",
  status: "Reserved",
  bookingSource: "Direct",
  specialRequest: "",
  notes: "",
  advanceAmount: 0,
  totalAmount: 0,
  paymentStatus: "Pending",
};

export default function BookingsManager() {
  const [bookings, setBookings] = useState([]);
  const [occupants, setOccupants] = useState([]);
  const [rooms, setRooms] = useState([]);
  const [floors, setFloors] = useState([]);
  const [loading, setLoading] = useState(true);

  // Search & Filters
  const [searchQuery, setSearchQuery] = useState("");
  const [filterFloor, setFilterFloor] = useState("");
  const [filterRoom, setFilterRoom] = useState("");
  const [filterStatus, setFilterStatus] = useState("");
  const [filterSource, setFilterSource] = useState("");
  const [filterPayment, setFilterPayment] = useState("");

  // Modals
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState(EMPTY_FORM);
  const [formErrors, setFormErrors] = useState({});

  // Delete Modal
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [bookingToDelete, setBookingToDelete] = useState(null);

  // Check In/Out Processing State
  const [actionProcessingId, setActionProcessingId] = useState(null);

  // ─── Data Loading ────────────────────────────────────────────────────────
  const loadData = async () => {
    setLoading(true);
    try {
      const [bookData, occData, roomData, floorData] = await Promise.all([
        fetchBookings(),
        fetchOccupants(),
        getRooms(),
        fetchFloors()
      ]);
      setBookings(bookData);
      setOccupants(occData);
      setRooms(roomData);
      setFloors(floorData);
    } catch (err) {
      console.warn("BookingsManager: failed to load bookings data:", err?.message || err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  // ─── Options ─────────────────────────────────────────────────────────────
  const activeRooms = rooms.filter(r => r.isAvailable !== false);
  
  const roomDropdownOptions = [
    { value: "", label: "Select a room…" },
    ...activeRooms.map(r => ({
      value: r.id,
      label: `Room ${r.roomNumber || "—"} (${r.name || "Unnamed"})`
    }))
  ];

  const filterFloorOptions = [
    { value: "", label: "All Floors" },
    ...floors.map(f => ({ value: f.id, label: f.name }))
  ];

  const filterRoomOptions = [
    { value: "", label: "All Rooms" },
    ...rooms.map(r => ({ value: r.id, label: `Room ${r.roomNumber || "—"}` }))
  ];

  const statusOptions = [
    { value: "Reserved", label: "Reserved" },
    { value: "Confirmed", label: "Confirmed" },
    { value: "Checked In", label: "Checked In" },
    { value: "Completed", label: "Completed" },
    { value: "Cancelled", label: "Cancelled" }
  ];

  const filterStatusOptions = [
    { value: "", label: "All Statuses" },
    ...statusOptions
  ];

  const bookingSourceOptions = [
    { value: "Direct", label: "Direct" },
    { value: "Walk-in", label: "Walk-in" },
    { value: "WhatsApp", label: "WhatsApp" },
    { value: "Phone", label: "Phone Call" },
    { value: "MakeMyTrip", label: "MakeMyTrip" },
    { value: "Booking.com", label: "Booking.com" },
    { value: "Agoda", label: "Agoda" },
    { value: "Goibibo", label: "Goibibo" },
    { value: "Other", label: "Other" }
  ];

  const filterSourceOptions = [
    { value: "", label: "All Sources" },
    ...bookingSourceOptions
  ];

  const paymentStatusOptions = [
    { value: "Pending", label: "Pending" },
    { value: "Partial", label: "Partial" },
    { value: "Paid", label: "Paid" },
  ];

  const filterPaymentOptions = [
    { value: "", label: "All Payments" },
    ...paymentStatusOptions
  ];

  // ─── Filter & Sort ───────────────────────────────────────────────────────
  const filteredBookings = bookings.filter((b) => {
    const matchesQuery = searchQuery.trim() === "" ||
      (b.guestName || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
      (b.phone || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
      (b.email || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
      (b.roomNumber || "").toLowerCase().includes(searchQuery.toLowerCase());

    const matchesFloor = !filterFloor || b.floorId === filterFloor;
    const matchesRoom = !filterRoom || b.roomId === filterRoom;
    const matchesStatus = !filterStatus || b.status === filterStatus;
    const matchesSource = !filterSource || b.bookingSource === filterSource;
    const matchesPayment = !filterPayment || b.paymentStatus === filterPayment;

    return matchesQuery && matchesFloor && matchesRoom && matchesStatus && matchesSource && matchesPayment;
  });

  const sortedBookings = [...filteredBookings].sort((a, b) => {
    const statusPriority = { "Reserved": 1, "Confirmed": 2, "Checked In": 3, "Completed": 4, "Cancelled": 5 };
    const pA = statusPriority[a.status] || 9;
    const pB = statusPriority[b.status] || 9;
    if (pA !== pB) return pA - pB;
    return (a.checkIn || "").localeCompare(b.checkIn || "");
  });

  // ─── Modal Helpers ────────────────────────────────────────────────────────
  const openAddModal = () => {
    setFormData(EMPTY_FORM);
    setFormErrors({});
    setEditingId(null);
    setIsModalOpen(true);
  };

  const openEditModal = (booking) => {
    setFormData({
      guestName: booking.guestName || "",
      phone: booking.phone || "",
      email: booking.email || "",
      adults: booking.adults ?? 1,
      children: booking.children ?? 0,
      checkIn: booking.checkIn || "",
      checkOut: booking.checkOut || "",
      roomId: booking.roomId || "",
      roomNumber: booking.roomNumber || "",
      roomName: booking.roomName || "",
      floorId: booking.floorId || "",
      floorName: booking.floorName || "",
      status: booking.status || "Reserved",
      bookingSource: booking.bookingSource || "Direct",
      specialRequest: booking.specialRequest || "",
      notes: booking.notes || "",
      advanceAmount: booking.advanceAmount ?? 0,
      totalAmount: booking.totalAmount ?? 0,
      paymentStatus: booking.paymentStatus || "Pending",
    });
    setFormErrors({});
    setEditingId(booking.id);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    if (saving) return;
    setIsModalOpen(false);
    setFormErrors({});
  };

  // ─── Validation ───────────────────────────────────────────────────────────
  const validateBasic = () => {
    const errors = {};
    if (!(formData.guestName || "").trim()) {
      errors.guestName = "Guest name is required.";
    }
    if (!(formData.phone || "").trim()) {
      errors.phone = "Phone number is required.";
    }
    if (!formData.roomId) {
      errors.roomId = "Please select a room.";
    }
    if (!formData.checkIn) {
      errors.checkIn = "Check-in date is required.";
    }
    if (!formData.checkOut) {
      errors.checkOut = "Check-out date is required.";
    }
    if (formData.checkIn && formData.checkOut && formData.checkOut <= formData.checkIn) {
      errors.checkOut = "Check-out date must be after check-in date.";
    }
    return errors;
  };

  // ─── Save Action with Overlap Validation ─────────────────────────────────
  const handleSave = async (e) => {
    e?.preventDefault();
    const errors = validateBasic();
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }

    setSaving(true);
    try {
      // Step 5: Overlap Validation
      const { hasOverlap, conflictingBooking } = await checkRoomBookingOverlap({
        roomId: formData.roomId,
        checkIn: formData.checkIn,
        checkOut: formData.checkOut,
        excludeBookingId: editingId
      });

      if (hasOverlap && conflictingBooking) {
        setFormErrors({
          roomId: `Room ${formData.roomNumber || ""} is already booked by ${conflictingBooking.guestName || "another guest"} from ${conflictingBooking.checkIn} to ${conflictingBooking.checkOut}.`
        });
        setSaving(false);
        return;
      }

      if (editingId) {
        await updateBooking(editingId, formData);
      } else {
        await createBooking(formData);
      }

      setIsModalOpen(false);
      await loadData();
    } catch (err) {
      console.warn("BookingsManager: save failed:", err?.message || err);
      alert("Failed to save booking. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  // ─── Check-In Workflow (Step 6) ──────────────────────────────────────────
  const handleCheckIn = async (booking) => {
    if (!confirm(`Check in ${booking.guestName} into Room ${booking.roomNumber || ""}?`)) return;

    setActionProcessingId(booking.id);
    try {
      // 1. Check if occupant record already exists for this booking/guest
      const existingOcc = occupants.find(
        o => o.roomId === booking.roomId && 
             o.status === "Checked In" && 
             (o.name || "").toLowerCase() === (booking.guestName || "").toLowerCase()
      );

      if (!existingOcc) {
        // Create Occupant record automatically
        await createOccupant({
          name: booking.guestName,
          phone: booking.phone,
          email: booking.email,
          adults: booking.adults || 1,
          children: booking.children || 0,
          checkIn: booking.checkIn,
          checkOut: booking.checkOut,
          roomId: booking.roomId,
          roomNumber: booking.roomNumber,
          roomName: booking.roomName,
          floorId: booking.floorId,
          floorName: booking.floorName,
          bookingId: booking.id,
          notes: booking.specialRequest || booking.notes || "",
          status: "Checked In",
        });
      }

      // 2. Update Booking status to "Checked In"
      await updateBooking(booking.id, { status: "Checked In" });
      await loadData();
    } catch (err) {
      console.warn("BookingsManager: check-in failed:", err?.message || err);
      alert("Failed to check in guest.");
    } finally {
      setActionProcessingId(null);
    }
  };

  // ─── Check-Out Workflow (Step 7) ─────────────────────────────────────────
  const handleCheckOut = async (booking) => {
    if (!confirm(`Check out ${booking.guestName} from Room ${booking.roomNumber || ""}?`)) return;

    setActionProcessingId(booking.id);
    try {
      // 1. Update Booking status to "Completed" (History retained!)
      await updateBooking(booking.id, { status: "Completed" });

      // 2. Update matching active occupant status to "Checked Out"
      const matchingOcc = occupants.find(
        o => o.roomId === booking.roomId && 
             o.status === "Checked In" && 
             (o.name || "").toLowerCase() === (booking.guestName || "").toLowerCase()
      );

      if (matchingOcc) {
        await updateOccupant(matchingOcc.id, { status: "Checked Out" });
      }

      // 3. Automatically trigger Housekeeping room status to "Dirty" (Step 4)
      await markRoomDirtyAfterCheckOut({
        roomId: booking.roomId,
        roomNumber: booking.roomNumber,
        roomName: booking.roomName,
        floorId: booking.floorId,
        floorName: booking.floorName
      });

      await loadData();
    } catch (err) {
      console.warn("BookingsManager: check-out failed:", err?.message || err);
      alert("Failed to check out guest.");
    } finally {
      setActionProcessingId(null);
    }
  };

  // ─── Delete Actions ───────────────────────────────────────────────────────
  const confirmDelete = (booking) => {
    setBookingToDelete(booking);
    setDeleteModalOpen(true);
  };

  const executeDelete = async () => {
    if (!bookingToDelete) return;
    setSaving(true);
    try {
      await deleteBooking(bookingToDelete.id);
      setBookings(prev => prev.filter(b => b.id !== bookingToDelete.id));
      setDeleteModalOpen(false);
      setBookingToDelete(null);
    } catch (err) {
      console.warn("BookingsManager: delete failed:", err?.message || err);
      alert("Failed to delete booking.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="flex flex-col gap-8">
      {/* Page Header */}
      <PageHeader
        title="Reservations & Bookings"
        subtitle="Manage upcoming room reservations, booking sources, and guest check-in / check-out workflows."
        action={
          <AdminButton icon={Plus} onClick={openAddModal}>
            Add Booking
          </AdminButton>
        }
      >
        <div className="flex flex-wrap items-center gap-3 w-full">
          <SearchInput
            placeholder="Search by guest, phone, room…"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-[450px]"
          />
          <AdminSelect
            options={filterFloorOptions}
            value={filterFloor}
            onChange={(e) => setFilterFloor(e.target.value)}
            className="w-64"
          />
          <AdminSelect
            options={filterRoomOptions}
            value={filterRoom}
            onChange={(e) => setFilterRoom(e.target.value)}
            className="w-64"
          />
          <AdminSelect
            options={filterStatusOptions}
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="w-64"
          />
          <AdminSelect
            options={filterSourceOptions}
            value={filterSource}
            onChange={(e) => setFilterSource(e.target.value)}
            className="w-64"
          />
          <AdminSelect
            options={filterPaymentOptions}
            value={filterPayment}
            onChange={(e) => setFilterPayment(e.target.value)}
            className="w-64"
          />
        </div>
      </PageHeader>

      {/* Main Table Card */}
      {loading ? (
        <SkeletonLoader type="table" count={4} />
      ) : bookings.length === 0 ? (
        <EmptyState
          icon={Calendar}
          title="No Reservations Created"
          description="There are currently no bookings in your system. Start by creating your first reservation."
          action={
            <AdminButton icon={Plus} onClick={openAddModal}>
              Add First Booking
            </AdminButton>
          }
        />
      ) : sortedBookings.length === 0 ? (
        <EmptyState
          icon={Calendar}
          title="No Matching Reservations"
          description="No bookings match your current search or filters. Try adjusting them."
        />
      ) : (
        <AdminCard padding="p-0" className="overflow-hidden border border-slate-200 bg-white shadow-sm rounded-xl">
          <AdminTable
            headers={["Guest", "Phone", "Room", "Floor", "Check-in", "Check-out", "Booking Source", "Payment", "Status", "Actions"]}
          >
            {sortedBookings.map((b) => {
              const isProcessing = actionProcessingId === b.id;
              const canCheckIn = b.status === "Reserved" || b.status === "Confirmed";
              const canCheckOut = b.status === "Checked In";

              return (
                <AdminTableRow key={b.id}>
                  {/* Guest */}
                  <AdminTableCell>
                    <span className="font-semibold text-slate-900 block">{b.guestName}</span>
                    {b.email && <span className="text-xs text-slate-400 block mt-0.5">{b.email}</span>}
                  </AdminTableCell>

                  {/* Phone */}
                  <AdminTableCell>
                    <span className="text-slate-600 font-mono text-[13px]">{b.phone || "—"}</span>
                  </AdminTableCell>

                  {/* Room */}
                  <AdminTableCell>
                    <span className="inline-flex items-center justify-center w-9 h-8 rounded-lg bg-blue-50 text-blue-700 font-bold text-sm">
                      {b.roomNumber || "—"}
                    </span>
                  </AdminTableCell>

                  {/* Floor */}
                  <AdminTableCell>
                    <span className="text-slate-600 font-medium">{b.floorName || "Unassigned"}</span>
                  </AdminTableCell>

                  {/* Check-in */}
                  <AdminTableCell>
                    <span className="text-slate-600 font-mono text-[13px]">{b.checkIn || "—"}</span>
                  </AdminTableCell>

                  {/* Check-out */}
                  <AdminTableCell>
                    <span className="text-slate-600 font-mono text-[13px]">{b.checkOut || "—"}</span>
                  </AdminTableCell>

                  {/* Source */}
                  <AdminTableCell>
                    <span className="inline-flex items-center px-2.5 py-1 rounded-md bg-slate-100 text-slate-700 text-xs font-semibold">
                      {b.bookingSource || "Direct"}
                    </span>
                  </AdminTableCell>

                  {/* Payment */}
                  <AdminTableCell>
                    <div className="flex flex-col gap-1">
                      <StatusBadge status={b.paymentStatus || "Pending"} />
                      {(b.totalAmount > 0) && (
                        <span className="text-xs text-slate-500">₹{Number(b.totalAmount).toLocaleString('en-IN')}</span>
                      )}
                    </div>
                  </AdminTableCell>

                  {/* Status */}
                  <AdminTableCell>
                    <StatusBadge status={b.status} />
                  </AdminTableCell>

                  {/* Actions */}
                  <AdminTableCell>
                    <div className="flex items-center gap-2">
                      {canCheckIn && (
                        <AdminButton
                          variant="secondary"
                          size="xs"
                          icon={LogIn}
                          loading={isProcessing}
                          onClick={() => handleCheckIn(b)}
                        >
                          Check In
                        </AdminButton>
                      )}

                      {canCheckOut && (
                        <AdminButton
                          variant="outline"
                          size="xs"
                          icon={LogOut}
                          loading={isProcessing}
                          onClick={() => handleCheckOut(b)}
                        >
                          Check Out
                        </AdminButton>
                      )}

                      <AdminButton
                        variant="secondary"
                        size="xs"
                        onClick={() => openEditModal(b)}
                      >
                        Edit
                      </AdminButton>

                      <AdminButton
                        variant="danger"
                        size="xs"
                        onClick={() => confirmDelete(b)}
                      >
                        Delete
                      </AdminButton>
                    </div>
                  </AdminTableCell>
                </AdminTableRow>
              );
            })}
          </AdminTable>

          {/* Footer */}
          <div className="bg-slate-50/80 border-t border-slate-100 px-5 py-3.5 flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
              {sortedBookings.length} {sortedBookings.length === 1 ? "Reservation" : "Reservations"} Listed
            </span>
            <span className="text-xs text-slate-400">
              History is preserved permanently
            </span>
          </div>
        </AdminCard>
      )}

      {/* ── Add / Edit Booking Modal ──────────────────────────────────────── */}
      <AdminModal
        isOpen={isModalOpen}
        onClose={closeModal}
        title={editingId ? "Edit Reservation" : "Create New Reservation"}
        maxWidth="max-w-3xl"
        footer={
          <>
            <AdminButton variant="ghost" onClick={closeModal} disabled={saving}>
              Cancel
            </AdminButton>
            <AdminButton onClick={handleSave} loading={saving}>
              {editingId ? "Save Changes" : "Create Reservation"}
            </AdminButton>
          </>
        }
      >
        <form onSubmit={handleSave} className="flex flex-col gap-6">
          {/* Guest Identity Fields */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <AdminInput
              label="Guest Name"
              required
              placeholder="e.g. Rahul Sharma"
              value={formData.guestName}
              onChange={(e) => {
                setFormData({ ...formData, guestName: e.target.value });
                if (formErrors.guestName) setFormErrors({ ...formErrors, guestName: undefined });
              }}
              error={formErrors.guestName}
              autoFocus
            />
            <AdminInput
              label="Phone Number"
              required
              type="tel"
              placeholder="e.g. +91 9876543210"
              value={formData.phone}
              onChange={(e) => {
                setFormData({ ...formData, phone: e.target.value });
                if (formErrors.phone) setFormErrors({ ...formErrors, phone: undefined });
              }}
              error={formErrors.phone}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <AdminInput
              label="Email Address"
              type="email"
              placeholder="e.g. guest@example.com"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            />
            <AdminInput
              label="Adults Count"
              type="number"
              min="1"
              required
              value={formData.adults}
              onChange={(e) => setFormData({ ...formData, adults: e.target.value })}
            />
            <AdminInput
              label="Children Count"
              type="number"
              min="0"
              required
              value={formData.children}
              onChange={(e) => setFormData({ ...formData, children: e.target.value })}
            />
          </div>

          {/* Room Allocation & Derived Floor */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-4 rounded-xl border border-slate-200/80 bg-slate-50/50">
            <AdminSelect
              label="Assign Room"
              required
              options={roomDropdownOptions}
              value={formData.roomId}
              onChange={(e) => {
                const r = rooms.find(room => room.id === e.target.value);
                setFormData({
                  ...formData,
                  roomId: e.target.value,
                  roomNumber: r?.roomNumber || "",
                  roomName: r?.name || "",
                  floorId: r?.floorId || "",
                  floorName: r?.floorName || ""
                });
                if (formErrors.roomId) setFormErrors({ ...formErrors, roomId: undefined });
              }}
              error={formErrors.roomId}
            />

            <div>
              <label className="block text-sm font-medium text-slate-400 mb-1.5">
                Derived Floor
              </label>
              <div className="w-full rounded-lg border border-slate-200 bg-slate-100 px-3.5 py-2.5 text-sm text-slate-500 font-semibold select-none">
                {formData.floorName || "Floor derived from room selection"}
              </div>
            </div>
          </div>

          {/* Booking Status & Source */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <AdminSelect
              label="Reservation Status"
              required
              options={statusOptions}
              value={formData.status}
              onChange={(e) => setFormData({ ...formData, status: e.target.value })}
            />
            <AdminSelect
              label="Booking Source"
              required
              options={bookingSourceOptions}
              value={formData.bookingSource}
              onChange={(e) => setFormData({ ...formData, bookingSource: e.target.value })}
            />
          </div>

          {/* Payment Details */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <AdminInput
              label="Total Amount (₹)"
              type="number"
              min="0"
              placeholder="e.g. 5000"
              value={formData.totalAmount}
              onChange={(e) => setFormData({ ...formData, totalAmount: e.target.value })}
            />
            <AdminInput
              label="Advance Paid (₹)"
              type="number"
              min="0"
              placeholder="e.g. 2000"
              value={formData.advanceAmount}
              onChange={(e) => setFormData({ ...formData, advanceAmount: e.target.value })}
            />
            <AdminSelect
              label="Payment Status"
              options={paymentStatusOptions}
              value={formData.paymentStatus}
              onChange={(e) => setFormData({ ...formData, paymentStatus: e.target.value })}
            />
          </div>

          {/* Dates */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <AdminInput
              label="Check-in Date"
              type="date"
              required
              value={formData.checkIn}
              onChange={(e) => {
                setFormData({ ...formData, checkIn: e.target.value });
                if (formErrors.checkIn) setFormErrors({ ...formErrors, checkIn: undefined });
              }}
              error={formErrors.checkIn}
            />
            <AdminInput
              label="Check-out Date"
              type="date"
              required
              value={formData.checkOut}
              onChange={(e) => {
                setFormData({ ...formData, checkOut: e.target.value });
                if (formErrors.checkOut) setFormErrors({ ...formErrors, checkOut: undefined });
              }}
              error={formErrors.checkOut}
            />
          </div>

          <AdminInput
            label="Special Requests"
            placeholder="e.g. High floor, extra towels, early check-in"
            value={formData.specialRequest}
            onChange={(e) => setFormData({ ...formData, specialRequest: e.target.value })}
          />

          <AdminTextarea
            label="Internal Staff Notes"
            placeholder="Internal operational notes regarding payment, channel reference ID, etc…"
            rows={3}
            value={formData.notes}
            onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
          />
        </form>
      </AdminModal>

      {/* ── Delete Confirmation Modal ─────────────────────────────────────── */}
      <AdminModal
        isOpen={deleteModalOpen}
        onClose={() => !saving && setDeleteModalOpen(false)}
        title="Delete Reservation"
        footer={
          <>
            <AdminButton variant="ghost" onClick={() => setDeleteModalOpen(false)} disabled={saving}>
              Cancel
            </AdminButton>
            <AdminButton variant="danger" onClick={executeDelete} loading={saving}>
              Delete Permanently
            </AdminButton>
          </>
        }
      >
        <div className="py-2">
          <p className="text-slate-600">
            Are you sure you want to delete the reservation for{" "}
            <strong className="text-slate-900">{bookingToDelete?.guestName}</strong>?
          </p>
          <div className="flex items-center gap-2 p-3 mt-4 rounded-lg bg-amber-50 border border-amber-200 text-amber-800 text-sm">
            <ShieldAlert className="w-5 h-5 shrink-0 text-amber-600" />
            <span>Note: Completed reservations should be kept as hotel history instead of being deleted.</span>
          </div>
        </div>
      </AdminModal>
    </div>
  );
}
