"use client";
export const dynamic = 'force-dynamic';

import { useEffect, useState } from "react";
import { Plus, Layers } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { db } from "@/lib/firebase";
import { collection, getDocs, query, where } from "firebase/firestore";

import { fetchFloors, createFloor, updateFloor, deleteFloor } from "@/lib/floors";

import { PageHeader }    from "@/components/admin/PageHeader";
import { AdminCard }     from "@/components/admin/AdminCard";
import { AdminButton }   from "@/components/admin/AdminButton";
import { StatusBadge }   from "@/components/admin/StatusBadge";
import { SkeletonLoader } from "@/components/admin/SkeletonLoader";
import { EmptyState }    from "@/components/admin/EmptyState";
import { AdminModal }    from "@/components/admin/AdminModal";
import { AdminInput, AdminTextarea, SearchInput } from "@/components/admin/AdminInputs";
import { AdminTable, AdminTableRow, AdminTableCell } from "@/components/admin/AdminTable";

const EMPTY_FORM = { name: "", displayOrder: "", active: true, notes: "" };

export default function FloorsManager() {
  const [floors,      setFloors]      = useState([]);
  const [loading,     setLoading]     = useState(true);
  const [saving,      setSaving]      = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  // Add / Edit modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId,   setEditingId]   = useState(null);
  const [formData,    setFormData]    = useState(EMPTY_FORM);
  const [formErrors,  setFormErrors]  = useState({});

  // Delete confirmation modal
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [floorToDelete,   setFloorToDelete]   = useState(null);

  // Floor delete protection modal
  const [protectedModalOpen, setProtectedModalOpen] = useState(false);
  const [protectedFloorName, setProtectedFloorName] = useState("");
  const [protectedRoomCount, setProtectedRoomCount] = useState(0);

  // ─── Data ────────────────────────────────────────────────────────────────
  const loadFloors = async () => {
    try {
      const data = await fetchFloors();
      setFloors(data);
    } catch (err) {
      console.warn("FloorsManager: failed to load floors:", err?.message || err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadFloors(); }, []);

  // ─── Client-side search ──────────────────────────────────────────────────
  const filteredFloors = floors.filter((f) =>
    (f.name || "").toLowerCase().includes(searchQuery.toLowerCase())
  );

  // ─── Modal helpers ────────────────────────────────────────────────────────
  const openAddModal = () => {
    setFormData(EMPTY_FORM);
    setFormErrors({});
    setEditingId(null);
    setIsModalOpen(true);
  };

  const openEditModal = (floor) => {
    setFormData({
      name:         floor.name         || "",
      displayOrder: floor.displayOrder ?? "",
      active:       floor.active       !== false,
      notes:        floor.notes        || "",
    });
    setFormErrors({});
    setEditingId(floor.id);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    if (saving) return;
    setIsModalOpen(false);
    setEditingId(null);
    setFormErrors({});
  };

  // ─── Validation ───────────────────────────────────────────────────────────
  const validate = () => {
    const errors = {};
    const trimmedName = (formData.name || "").trim();

    if (!trimmedName) {
      errors.name = "Floor name is required.";
    } else if (trimmedName.length < 2) {
      errors.name = "Floor name must be at least 2 characters.";
    } else {
      // Duplicate check — case-insensitive, excludes self when editing
      const duplicate = floors.find(
        (f) =>
          f.name.trim().toLowerCase() === trimmedName.toLowerCase() &&
          f.id !== editingId
      );
      if (duplicate) errors.name = "A floor with this name already exists.";
    }

    const orderVal = formData.displayOrder;
    if (orderVal === "" || orderVal === null || orderVal === undefined) {
      errors.displayOrder = "Display order is required.";
    } else {
      const parsed = Number(orderVal);
      if (!Number.isInteger(parsed) || parsed < 1) {
        errors.displayOrder = "Display order must be a positive whole number (1, 2, 3…).";
      }
    }

    return errors;
  };

  // ─── Save (Add / Edit) ────────────────────────────────────────────────────
  const handleSave = async (e) => {
    e?.preventDefault();
    const errors = validate();
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }

    setSaving(true);
    try {
      const payload = {
        name:         formData.name.trim(),
        displayOrder: Number(formData.displayOrder),
        active:       formData.active,
        notes:        (formData.notes || "").trim(),
      };

      if (editingId) {
        await updateFloor(editingId, payload);
      } else {
        await createFloor(payload);
      }

      setIsModalOpen(false);
      setEditingId(null);
      await loadFloors();
    } catch (err) {
      console.error("FloorsManager: failed to save:", err);
      alert("Failed to save floor. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  // ─── Delete ───────────────────────────────────────────────────────────────
  const confirmDelete = (floor) => {
    setFloorToDelete(floor);
    setDeleteModalOpen(true);
  };

  const executeDelete = async () => {
    if (!floorToDelete) return;
    setSaving(true);
    try {
      // Check if any rooms belong to this floor
      const roomsQuery = query(
        collection(db, "rooms"),
        where("floorId", "==", floorToDelete.id)
      );
      const roomsSnapshot = await getDocs(roomsQuery);

      if (!roomsSnapshot.empty) {
        // Floor has rooms — block deletion
        setProtectedFloorName(floorToDelete.name);
        setProtectedRoomCount(roomsSnapshot.size);
        setDeleteModalOpen(false);
        setFloorToDelete(null);
        setSaving(false);
        setProtectedModalOpen(true);
        return;
      }

      await deleteFloor(floorToDelete.id);
      setFloors((prev) => prev.filter((f) => f.id !== floorToDelete.id));
      setDeleteModalOpen(false);
      setFloorToDelete(null);
    } catch (err) {
      console.error("FloorsManager: failed to delete:", err);
      alert("Failed to delete floor. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  // ─── Toggle Active ────────────────────────────────────────────────────────
  const toggleActive = async (id, currentVal) => {
    // Optimistic update
    setFloors((prev) =>
      prev.map((f) => (f.id === id ? { ...f, active: !currentVal } : f))
    );
    try {
      await updateFloor(id, { active: !currentVal });
    } catch (err) {
      console.error("FloorsManager: failed to toggle active:", err);
      // Revert on error
      setFloors((prev) =>
        prev.map((f) => (f.id === id ? { ...f, active: currentVal } : f))
      );
    }
  };

  // ─── Render ───────────────────────────────────────────────────────────────
  return (
    <div className="flex flex-col gap-8">

      {/* Page Header with inline search */}
      <PageHeader
        title="Floor Management"
        subtitle="Define hotel floors, set their display order, and manage operational status."
        action={
          <AdminButton icon={Plus} onClick={openAddModal}>
            Add Floor
          </AdminButton>
        }
      >
        <SearchInput
          placeholder="Search floors…"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-64"
        />
      </PageHeader>

      {/* Content */}
      {loading ? (
        <SkeletonLoader type="table" count={4} />
      ) : floors.length === 0 ? (
        <EmptyState
          icon={Layers}
          title="No Floors Configured"
          description="You haven't added any floors yet. Add your first floor to begin organising your property."
          action={
            <AdminButton onClick={openAddModal} icon={Plus}>
              Add First Floor
            </AdminButton>
          }
        />
      ) : filteredFloors.length === 0 ? (
        <EmptyState
          icon={Layers}
          title="No Floors Match Your Search"
          description={`No floors found for "${searchQuery}". Try a different search term.`}
        />
      ) : (
        <div className="flex flex-col gap-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredFloors.map((floor) => {
              const isActive = floor.active !== false;
              return (
                <div 
                  key={floor.id} 
                  className="group flex flex-col bg-white rounded-xl border border-slate-200 shadow-sm hover:shadow-md hover:border-[#c99a2c]/40 hover:-translate-y-0.5 transition-all duration-300 overflow-hidden"
                >
                  {/* Card Header */}
                  <div className="flex items-start justify-between p-10 border-b border-slate-100 bg-slate-50/50">
                    <div className="flex flex-col gap-8">
                      <h3 className="text-[32px] font-bold text-slate-900 tracking-tight">{floor.name}</h3>
                      <div className="flex items-center gap-8">
                        <span className="inline-flex items-center justify-center px-2 py-0.5 rounded text-[18px] font-bold px-4 py-2 bg-[#c99a2c]/10 text-[#c99a2c] border border-[#c99a2c]/20">
                          Order: {floor.displayOrder}
                        </span>
                        <StatusBadge status={isActive ? "Active" : "Inactive"} />
                      </div>
                    </div>
                    <Switch
                      checked={isActive}
                      onCheckedChange={() => toggleActive(floor.id, isActive)}
                      aria-label={`Toggle ${floor.name} active state`}
                    />
                  </div>

                  {/* Card Body */}
                  <div className="p-10 flex-1 flex flex-col justify-between gap-8">
                    <div>
                      <h4 className="text-[18px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">Notes</h4>
                      {floor.notes ? (
                        <p className="text-[22px] text-slate-600 line-clamp-3 leading-relaxed">{floor.notes}</p>
                      ) : (
                        <p className="text-sm text-slate-400 italic">No notes provided.</p>
                      )}
                    </div>
                    
                    {/* Actions (always visible but subtle, highlight on hover) */}
                    <div className="flex items-center gap-8 pt-6 mt-auto border-t border-slate-100">
                      <AdminButton 
                        variant="secondary" 
                        size="md" 
                        onClick={() => openEditModal(floor)} 
                        className="flex-1 bg-slate-50 hover:bg-slate-100 text-slate-600 hover:text-slate-900 border border-slate-200 py-6"
                      >
                        Edit Floor
                      </AdminButton>
                      <AdminButton 
                        variant="danger" 
                        size="md" 
                        onClick={() => confirmDelete(floor)}
                        className="py-6 px-8"
                      >
                        Delete
                      </AdminButton>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Footer — count */}
          <div className="bg-slate-50/80 border border-slate-200 rounded-xl px-5 py-3.5 flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              {filteredFloors.length} {filteredFloors.length === 1 ? "Floor" : "Floors"}
              {searchQuery && ` matching "${searchQuery}"`}
            </span>
            <span className="text-xs font-medium text-slate-400">
              Sorted by display order
            </span>
          </div>
        </div>
      )}

      {/* ── Add / Edit Modal ────────────────────────────────────────────────── */}
      <AdminModal
        isOpen={isModalOpen}
        onClose={closeModal}
        title={editingId ? "Edit Floor" : "Add New Floor"}
        description={
          editingId
            ? "Update the details for this floor."
            : "Add a new floor to your property. Floors are sorted by display order."
        }
        maxWidth="max-w-lg"
        footer={
          <>
            <AdminButton variant="ghost" onClick={closeModal} disabled={saving}>
              Cancel
            </AdminButton>
            <AdminButton onClick={handleSave} loading={saving}>
              {editingId ? "Save Changes" : "Add Floor"}
            </AdminButton>
          </>
        }
      >
        <form onSubmit={handleSave} className="flex flex-col gap-10">

          <AdminInput
            label="Floor Name"
            placeholder="e.g. Ground Floor, First Floor, Rooftop"
            required
            value={formData.name}
            onChange={(e) => {
              setFormData({ ...formData, name: e.target.value });
              if (formErrors.name) setFormErrors({ ...formErrors, name: undefined });
            }}
            error={formErrors.name}
            autoFocus
          />

          <AdminInput
            label="Display Order"
            type="number"
            min="1"
            step="1"
            placeholder="1"
            required
            value={formData.displayOrder}
            onChange={(e) => {
              setFormData({ ...formData, displayOrder: e.target.value });
              if (formErrors.displayOrder) setFormErrors({ ...formErrors, displayOrder: undefined });
            }}
            error={formErrors.displayOrder}
            hint="Lower numbers appear first in the table (1 = top)."
          />

          <div className="flex flex-col gap-1.5">
            <label className="block text-sm font-medium text-slate-700">
              Active Status
            </label>
            <div className="flex items-center gap-3 bg-slate-50 px-4 py-3 rounded-lg border border-slate-200">
              <Switch
                checked={formData.active}
                onCheckedChange={(val) => setFormData({ ...formData, active: val })}
                aria-label="Floor active status"
              />
              <span className="text-sm text-slate-700 font-medium">
                {formData.active
                  ? "Floor is active and operational"
                  : "Floor is inactive / under configuration"}
              </span>
            </div>
          </div>

          <AdminTextarea
            label="Notes"
            placeholder="Optional internal notes visible only to staff…"
            rows={3}
            value={formData.notes}
            onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
            hint="Not shown to guests."
          />

        </form>
      </AdminModal>

      {/* ── Delete Confirmation Modal ──────────────────────────────────────── */}
      <AdminModal
        isOpen={deleteModalOpen}
        onClose={() => !saving && setDeleteModalOpen(false)}
        title="Delete Floor"
        description="This action is permanent and cannot be undone."
        footer={
          <>
            <AdminButton
              variant="ghost"
              onClick={() => setDeleteModalOpen(false)}
              disabled={saving}
            >
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
            Are you sure you want to permanently delete{" "}
            <strong className="text-slate-900">{floorToDelete?.name}</strong>?
          </p>
        </div>
      </AdminModal>

      {/* ── Floor Delete Protection Modal ─────────────────────────────────── */}
      <AdminModal
        isOpen={protectedModalOpen}
        onClose={() => setProtectedModalOpen(false)}
        title="Cannot Delete Floor"
        footer={
          <AdminButton variant="secondary" onClick={() => setProtectedModalOpen(false)}>
            OK
          </AdminButton>
        }
      >
        <div className="py-2">
          <p className="text-slate-600">
            <strong className="text-slate-900">{protectedFloorName}</strong> contains{" "}
            <strong className="text-slate-900">{protectedRoomCount}</strong>{" "}
            {protectedRoomCount === 1 ? "room" : "rooms"}.
          </p>
          <p className="text-slate-500 mt-2">
            Please move or delete the rooms before deleting this floor.
          </p>
        </div>
      </AdminModal>

    </div>
  );
}
