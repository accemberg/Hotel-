"use client";
export const dynamic = 'force-dynamic';

import { useEffect, useState } from "react";
import { Plus, Users, ShieldAlert, User, FileText, BedDouble } from "lucide-react";
import { db } from "@/lib/firebase";
import { collection, getDocs } from "firebase/firestore";
import { fetchOccupants, createOccupant, updateOccupant, deleteOccupant } from "@/lib/occupants";
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
  name: "",
  phone: "",
  email: "",
  idType: "Aadhar",
  idNumber: "",
  address: "",
  nationality: "Indian",
  gender: "Male",
  adults: 1,
  children: 0,
  checkIn: "",
  checkOut: "",
  notes: "",
  roomId: "",
  roomNumber: "",
  roomName: "",
  floorId: "",
  floorName: "",
  status: "Checked In",
};

export default function OccupantsManager() {
  const [occupants, setOccupants] = useState([]);
  const [rooms, setRooms] = useState([]);
  const [floors, setFloors] = useState([]);
  const [loading, setLoading] = useState(true);

  // Search & Filter state
  const [searchQuery, setSearchQuery] = useState("");
  const [filterFloor, setFilterFloor] = useState("");
  const [filterRoom, setFilterRoom] = useState("");
  const [filterStatus, setFilterStatus] = useState("");

  // Add / Edit Form Modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState(EMPTY_FORM);
  const [formErrors, setFormErrors] = useState({});

  // Delete Modal
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [occupantToDelete, setOccupantToDelete] = useState(null);

  // ─── Data Loading ────────────────────────────────────────────────────────
  const loadData = async () => {
    setLoading(true);
    try {
      const [occData, roomData, floorData] = await Promise.all([
        fetchOccupants(),
        getRooms(),
        fetchFloors()
      ]);
      setOccupants(occData);
      setRooms(roomData);
      setFloors(floorData);
    } catch (err) {
      console.warn("OccupantsManager: failed to load occupants data:", err?.message || err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  // ─── Derivation & Select Options ─────────────────────────────────────────
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
    { value: "Checked In", label: "Checked In" },
    { value: "Reserved", label: "Reserved" },
    { value: "Checked Out", label: "Checked Out" },
    { value: "Cancelled", label: "Cancelled" }
  ];

  const filterStatusOptions = [
    { value: "", label: "All Statuses" },
    ...statusOptions
  ];

  const idTypeOptions = [
    { value: "Aadhar", label: "Aadhar Card" },
    { value: "Passport", label: "Passport" },
    { value: "Driving License", label: "Driving License" },
    { value: "Voter ID", label: "Voter ID" },
    { value: "Other", label: "Other" }
  ];

  const genderOptions = [
    { value: "Male", label: "Male" },
    { value: "Female", label: "Female" },
    { value: "Other", label: "Other" }
  ];

  // ─── Client-side Search, Filtering, Sorting ──────────────────────────────
  const filteredOccupants = occupants.filter((o) => {
    // 1. Search Query Match
    const matchesQuery = searchQuery.trim() === "" ||
      (o.name || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
      (o.phone || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
      (o.email || "").toLowerCase().includes(searchQuery.toLowerCase());

    // 2. Filters Match
    const matchesFloor = !filterFloor || o.floorId === filterFloor;
    const matchesRoom = !filterRoom || o.roomId === filterRoom;
    const matchesStatus = !filterStatus || o.status === filterStatus;

    return matchesQuery && matchesFloor && matchesRoom && matchesStatus;
  });

  // Default Sort: Checked In first, then Check-in Date descending
  const sortedOccupants = [...filteredOccupants].sort((a, b) => {
    const statusValA = a.status === "Checked In" ? 1 : 0;
    const statusValB = b.status === "Checked In" ? 1 : 0;
    if (statusValA !== statusValB) {
      return statusValB - statusValA; // 1 (Checked In) first
    }
    const checkInA = a.checkIn || "";
    const checkInB = b.checkIn || "";
    return checkInB.localeCompare(checkInA);
  });

  // ─── Modal Helpers ────────────────────────────────────────────────────────
  const openAddModal = () => {
    setFormData(EMPTY_FORM);
    setFormErrors({});
    setEditingId(null);
    setIsModalOpen(true);
  };

  const openEditModal = (occ) => {
    setFormData({
      name: occ.name || "",
      phone: occ.phone || "",
      email: occ.email || "",
      idType: occ.idType || "Aadhar",
      idNumber: occ.idNumber || "",
      address: occ.address || "",
      nationality: occ.nationality || "Indian",
      gender: occ.gender || "Male",
      adults: occ.adults ?? 1,
      children: occ.children ?? 0,
      checkIn: occ.checkIn || "",
      checkOut: occ.checkOut || "",
      notes: occ.notes || "",
      roomId: occ.roomId || "",
      roomNumber: occ.roomNumber || "",
      roomName: occ.roomName || "",
      floorId: occ.floorId || "",
      floorName: occ.floorName || "",
      status: occ.status || "Checked In",
    });
    setFormErrors({});
    setEditingId(occ.id);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    if (saving) return;
    setIsModalOpen(false);
    setFormErrors({});
  };

  // ─── Validation ───────────────────────────────────────────────────────────
  const validate = () => {
    const errors = {};
    if (!(formData.name || "").trim()) {
      errors.name = "Guest name is required.";
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
    if (!formData.status) {
      errors.status = "Please select a status.";
    }

    const adultsNum = Number(formData.adults);
    if (isNaN(adultsNum) || adultsNum < 1) {
      errors.adults = "Must have at least 1 adult.";
    }

    const childrenNum = Number(formData.children);
    if (isNaN(childrenNum) || childrenNum < 0) {
      errors.children = "Children count cannot be negative.";
    }

    return errors;
  };

  // ─── Save Action ──────────────────────────────────────────────────────────
  const handleSave = async (e) => {
    e?.preventDefault();
    const errors = validate();
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }

    setSaving(true);
    try {
      if (editingId) {
        await updateOccupant(editingId, formData);
      } else {
        await createOccupant(formData);
      }

      if (formData.status === "Checked Out" && formData.roomId) {
        await markRoomDirtyAfterCheckOut({
          roomId: formData.roomId,
          roomNumber: formData.roomNumber,
          roomName: formData.roomName,
          floorId: formData.floorId,
          floorName: formData.floorName
        });
      }

      setIsModalOpen(false);
      await loadData();
    } catch (err) {
      console.error("OccupantsManager: save failed:", err);
      alert("Failed to save occupant. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  // ─── Delete Actions ───────────────────────────────────────────────────────
  const confirmDelete = (occ) => {
    setOccupantToDelete(occ);
    setDeleteModalOpen(true);
  };

  const executeDelete = async () => {
    if (!occupantToDelete) return;
    setSaving(true);
    try {
      await deleteOccupant(occupantToDelete.id);
      setOccupants(prev => prev.filter(o => o.id !== occupantToDelete.id));
      setDeleteModalOpen(false);
      setOccupantToDelete(null);
    } catch (err) {
      console.error("OccupantsManager: delete failed:", err);
      alert("Failed to delete occupant.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="flex flex-col gap-8">
      {/* Page Header */}
      <PageHeader
        title="Occupants Management"
        subtitle="Track guests check-in status, room assignments, and reservation schedules."
        action={
          <AdminButton icon={Plus} onClick={openAddModal}>
            Add Occupant
          </AdminButton>
        }
      >
        <div className="flex flex-wrap items-center gap-3 w-full">
          <SearchInput
            placeholder="Search by name, phone, email…"
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
        </div>
      </PageHeader>

      {/* Main Table Card */}
      {loading ? (
        <SkeletonLoader type="table" count={4} />
      ) : occupants.length === 0 ? (
        <EmptyState
          icon={Users}
          title="No Occupants Checked In"
          description="There are currently no occupants registered in your system. Start by checking in or reserving a guest."
          action={
            <AdminButton icon={Plus} onClick={openAddModal}>
              Add Occupant
            </AdminButton>
          }
        />
      ) : sortedOccupants.length === 0 ? (
        <EmptyState
          icon={Users}
          title="No Matching Occupants"
          description="No occupants found with your current search or filters. Try adjusting them."
        />
      ) : (
        <AdminCard padding="p-0" className="overflow-hidden border border-slate-200 bg-white shadow-sm rounded-xl">
          <AdminTable
            headers={["Guest Name", "Phone", "Room Number", "Floor", "Check-in", "Check-out", "Status", "Actions"]}
          >
            {sortedOccupants.map((occ) => (
              <AdminTableRow key={occ.id}>
                {/* Guest Name */}
                <AdminTableCell>
                  <span className="font-semibold text-slate-900 block">{occ.name}</span>
                  {occ.email && <span className="text-xs text-slate-400 block mt-0.5">{occ.email}</span>}
                </AdminTableCell>

                {/* Phone */}
                <AdminTableCell>
                  <span className="text-slate-600 font-mono text-[13px]">{occ.phone || "—"}</span>
                </AdminTableCell>

                {/* Room */}
                <AdminTableCell>
                  <span className="inline-flex items-center justify-center w-9 h-8 rounded-lg bg-blue-50 text-blue-700 font-bold text-sm">
                    {occ.roomNumber || "—"}
                  </span>
                </AdminTableCell>

                {/* Floor */}
                <AdminTableCell>
                  <span className="text-slate-600 font-medium">{occ.floorName || "Unassigned"}</span>
                </AdminTableCell>

                {/* Check-in */}
                <AdminTableCell>
                  <span className="text-slate-600 font-mono text-[13px]">{occ.checkIn || "—"}</span>
                </AdminTableCell>

                {/* Check-out */}
                <AdminTableCell>
                  <span className="text-slate-600 font-mono text-[13px]">{occ.checkOut || "—"}</span>
                </AdminTableCell>

                {/* Status */}
                <AdminTableCell>
                  <StatusBadge status={occ.status} />
                </AdminTableCell>

                {/* Actions */}
                <AdminTableCell>
                  <div className="flex items-center gap-2">
                    <AdminButton
                      variant="secondary"
                      size="sm"
                      onClick={() => openEditModal(occ)}
                    >
                      Edit
                    </AdminButton>
                    <AdminButton
                      variant="danger"
                      size="sm"
                      onClick={() => confirmDelete(occ)}
                    >
                      Delete
                    </AdminButton>
                  </div>
                </AdminTableCell>
              </AdminTableRow>
            ))}
          </AdminTable>

          {/* Table Count Footer */}
          <div className="bg-slate-50/80 border-t border-slate-100 px-5 py-3.5 flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
              {sortedOccupants.length} {sortedOccupants.length === 1 ? "Occupant" : "Occupants"} Listed
            </span>
            <span className="text-xs text-slate-400">
              Ordered by status & check-in date
            </span>
          </div>
        </AdminCard>
      )}

      {/* ── Add / Edit Occupant Modal ─────────────────────────────────────── */}
      <AdminModal
        isOpen={isModalOpen}
        onClose={closeModal}
        title={editingId ? "Edit Occupant Details" : "Register Occupant"}
        maxWidth="max-w-3xl"
        footer={
          <>
            <AdminButton variant="ghost" onClick={closeModal} disabled={saving}>
              Cancel
            </AdminButton>
            <AdminButton onClick={handleSave} loading={saving}>
              {editingId ? "Save Changes" : "Register Guest"}
            </AdminButton>
          </>
        }
      >
        <form onSubmit={handleSave} className="flex flex-col gap-8">
          
          {/* Personal Information Section */}
          <div className="flex flex-col gap-5">
            <div className="flex items-center gap-2 border-b border-slate-100 pb-2">
              <User className="w-5 h-5 text-[#c99a2c]" />
              <h4 className="text-sm font-bold text-[#c99a2c] uppercase tracking-wider">Personal Information</h4>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <AdminInput
                label="Guest Name"
                required
                placeholder="e.g. Anurag Sharma"
                value={formData.name}
                onChange={(e) => {
                  setFormData({ ...formData, name: e.target.value });
                  if (formErrors.name) setFormErrors({ ...formErrors, name: undefined });
                }}
                error={formErrors.name}
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
              <AdminSelect
                label="Gender"
                options={genderOptions}
                value={formData.gender}
                onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
              />
              <AdminInput
                label="Nationality"
                placeholder="e.g. Indian"
                value={formData.nationality}
                onChange={(e) => setFormData({ ...formData, nationality: e.target.value })}
              />
            </div>
          </div>

          {/* Identification Section */}
          <div className="flex flex-col gap-5">
            <div className="flex items-center gap-2 border-b border-slate-100 pb-2">
              <FileText className="w-5 h-5 text-[#c99a2c]" />
              <h4 className="text-sm font-bold text-[#c99a2c] uppercase tracking-wider">Identification</h4>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <AdminSelect
                label="Identity Document Type"
                options={idTypeOptions}
                value={formData.idType}
                onChange={(e) => setFormData({ ...formData, idType: e.target.value })}
              />
              <AdminInput
                label="Identity Document Number"
                placeholder="e.g. 12-digit Aadhar or Passport #"
                value={formData.idNumber}
                onChange={(e) => setFormData({ ...formData, idNumber: e.target.value })}
              />
            </div>
            <AdminInput
              label="Address"
              placeholder="Guest residential address"
              value={formData.address}
              onChange={(e) => setFormData({ ...formData, address: e.target.value })}
            />
          </div>

          {/* Stay Details Section */}
          <div className="flex flex-col gap-5">
            <div className="flex items-center gap-2 border-b border-slate-100 pb-2">
              <BedDouble className="w-5 h-5 text-[#c99a2c]" />
              <h4 className="text-sm font-bold text-[#c99a2c] uppercase tracking-wider">Stay Details</h4>
            </div>
            
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
                <label className="block text-sm font-medium text-slate-700 mb-1.5">
                  Derived Floor
                </label>
                <div className="w-full rounded-lg border border-slate-200 bg-slate-100 px-3.5 py-2.5 text-sm text-slate-500 font-semibold select-none">
                  {formData.floorName || "Floor automatically derived from room selection"}
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <AdminSelect
                label="Booking Status"
                required
                options={statusOptions}
                value={formData.status}
                onChange={(e) => {
                  setFormData({ ...formData, status: e.target.value });
                  if (formErrors.status) setFormErrors({ ...formErrors, status: undefined });
                }}
                error={formErrors.status}
              />
              <AdminInput
                label="Adults Count"
                type="number"
                min="1"
                required
                value={formData.adults}
                onChange={(e) => {
                  setFormData({ ...formData, adults: e.target.value });
                  if (formErrors.adults) setFormErrors({ ...formErrors, adults: undefined });
                }}
                error={formErrors.adults}
              />
              <AdminInput
                label="Children Count"
                type="number"
                min="0"
                required
                value={formData.children}
                onChange={(e) => {
                  setFormData({ ...formData, children: e.target.value });
                  if (formErrors.children) setFormErrors({ ...formErrors, children: undefined });
                }}
                error={formErrors.children}
              />
            </div>

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
                label="Check-out Date (Optional)"
                type="date"
                value={formData.checkOut}
                onChange={(e) => setFormData({ ...formData, checkOut: e.target.value })}
              />
            </div>

            <AdminTextarea
              label="Internal Notes"
              placeholder="Special instructions, preferences, diet requirements, check-out status notes etc…"
              rows={3}
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
            />
          </div>
        </form>
      </AdminModal>

      {/* ── Delete Confirmation Modal ─────────────────────────────────────── */}
      <AdminModal
        isOpen={deleteModalOpen}
        onClose={() => !saving && setDeleteModalOpen(false)}
        title="Delete Occupant Record"
        footer={
          <>
            <AdminButton variant="ghost" onClick={() => setDeleteModalOpen(false)} disabled={saving}>
              Cancel
            </AdminButton>
            <AdminButton variant="danger" onClick={executeDelete} loading={saving}>
              Delete Record
            </AdminButton>
          </>
        }
      >
        <div className="py-2">
          <p className="text-slate-600">
            Are you sure you want to permanently delete the occupant record for{" "}
            <strong className="text-slate-900">{occupantToDelete?.name}</strong>?
          </p>
          <div className="flex items-center gap-2 p-3 mt-4 rounded-lg bg-amber-50 border border-amber-200 text-amber-800 text-sm">
            <ShieldAlert className="w-5 h-5 shrink-0 text-amber-600" />
            <span>This action is permanent. The room and floor themselves will not be modified or deleted.</span>
          </div>
        </div>
      </AdminModal>
    </div>
  );
}
