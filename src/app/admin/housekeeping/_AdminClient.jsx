"use client";
export const dynamic = 'force-dynamic';

import { useEffect, useState } from "react";
import { Sparkles, CheckCircle2, AlertTriangle, Clock, Wrench, UserCheck, Edit3, Search, Trash2, ShieldAlert } from "lucide-react";
import { fetchHousekeeping, createHousekeepingTask, updateHousekeepingTask, deleteHousekeepingTask } from "@/lib/housekeeping";
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

export default function HousekeepingManager() {
  const [housekeeping, setHousekeeping] = useState([]);
  const [rooms, setRooms] = useState([]);
  const [floors, setFloors] = useState([]);
  const [loading, setLoading] = useState(true);

  // Filters & Search
  const [searchQuery, setSearchQuery] = useState("");
  const [filterFloor, setFilterFloor] = useState("");
  const [filterStatus, setFilterStatus] = useState("");
  const [filterStaff, setFilterStaff] = useState("");

  // Edit / Assign Modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [saving, setSaving] = useState(false);

  // Delete Modal
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [taskToDelete, setTaskToDelete] = useState(null);

  const [formData, setFormData] = useState({
    status: "Clean",
    priority: "Medium",
    assignedTo: "",
    notes: "",
  });

  // ─── Load Data ────────────────────────────────────────────────────────────
  const loadData = async () => {
    setLoading(true);
    try {
      const [hkData, roomData, floorData] = await Promise.all([
        fetchHousekeeping(),
        getRooms(),
        fetchFloors()
      ]);
      setHousekeeping(hkData);
      setRooms(roomData);
      setFloors(floorData);
    } catch (err) {
      console.warn("HousekeepingManager: failed to load data:", err?.message || err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  // ─── Combine Rooms & Housekeeping Data ───────────────────────────────────
  const combinedRoomTasks = rooms.map(room => {
    const hkTask = housekeeping.find(h => h.roomId === room.id);
    return {
      room,
      taskId: hkTask?.id || null,
      status: hkTask?.status || "Clean",
      priority: hkTask?.priority || "Low",
      assignedTo: hkTask?.assignedTo || "",
      notes: hkTask?.notes || "",
      lastCleaned: hkTask?.lastCleaned || null,
      updatedBy: hkTask?.updatedBy || "",
      updatedAt: hkTask?.updatedAt || null,
    };
  });

  // ─── Filter Options ──────────────────────────────────────────────────────
  const filterFloorOptions = [
    { value: "", label: "All Floors" },
    ...floors.map(f => ({ value: f.id, label: f.name }))
  ];

  const statusOptions = [
    { value: "Clean", label: "Clean" },
    { value: "Dirty", label: "Dirty" },
    { value: "Cleaning", label: "Cleaning" },
    { value: "Inspection", label: "Inspection" },
    { value: "Out of Service", label: "Out of Service" }
  ];

  const filterStatusOptions = [
    { value: "", label: "All Statuses" },
    ...statusOptions
  ];

  const priorityOptions = [
    { value: "Low", label: "Low" },
    { value: "Medium", label: "Medium" },
    { value: "High", label: "High" },
  ];

  // Unique staff list for filter dropdown
  const uniqueStaff = [...new Set(combinedRoomTasks.map(t => t.assignedTo).filter(Boolean))];
  const filterStaffOptions = [
    { value: "", label: "All Staff" },
    ...uniqueStaff.map(s => ({ value: s, label: s }))
  ];

  // ─── Filters & Search ────────────────────────────────────────────────────
  const filteredTasks = combinedRoomTasks.filter(item => {
    const rNumber = item.room.roomNumber || "";
    const rName = item.room.name || "";
    const staff = item.assignedTo || "";
    const q = searchQuery.toLowerCase().trim();

    const matchesSearch = !q || 
      rNumber.toLowerCase().includes(q) || 
      rName.toLowerCase().includes(q) || 
      staff.toLowerCase().includes(q);

    const matchesFloor = !filterFloor || item.room.floorId === filterFloor;
    const matchesStatus = !filterStatus || item.status === filterStatus;
    const matchesStaff = !filterStaff || item.assignedTo === filterStaff;

    return matchesSearch && matchesFloor && matchesStatus && matchesStaff;
  });

  // Sort: Dirty & Cleaning first, then by priority, then room number
  const sortedTasks = [...filteredTasks].sort((a, b) => {
    const statusPrio = { "Dirty": 1, "Cleaning": 2, "Inspection": 3, "Out of Service": 4, "Clean": 5 };
    const sA = statusPrio[a.status] || 9;
    const sB = statusPrio[b.status] || 9;
    if (sA !== sB) return sA - sB;

    const prioPrio = { "High": 1, "Medium": 2, "Low": 3 };
    const pA = prioPrio[a.priority] || 9;
    const pB = prioPrio[b.priority] || 9;
    if (pA !== pB) return pA - pB;

    return (a.room.roomNumber || "").localeCompare(b.room.roomNumber || "", undefined, { numeric: true });
  });

  // Summary counts
  const cleanCount = combinedRoomTasks.filter(t => t.status === "Clean").length;
  const dirtyCount = combinedRoomTasks.filter(t => t.status === "Dirty").length;
  const cleaningCount = combinedRoomTasks.filter(t => t.status === "Cleaning").length;
  const inspectionCount = combinedRoomTasks.filter(t => t.status === "Inspection").length;
  const oosCount = combinedRoomTasks.filter(t => t.status === "Out of Service").length;

  // ─── Priority Badge Helper ───────────────────────────────────────────────
  const PriorityBadge = ({ priority }) => {
    const styles = {
      High: "bg-red-100 text-red-700 border-red-200",
      Medium: "bg-amber-100 text-amber-700 border-amber-200",
      Low: "bg-slate-100 text-slate-600 border-slate-200",
    };
    return (
      <span className={`inline-flex items-center px-2.5 py-1 rounded-md text-xs font-bold border ${styles[priority] || styles.Low}`}>
        {priority || "Low"}
      </span>
    );
  };

  // ─── Format Last Cleaned ─────────────────────────────────────────────────
  const formatLastCleaned = (ts) => {
    if (!ts) return "Never";
    try {
      const date = ts.toDate ? ts.toDate() : new Date(ts);
      const now = new Date();
      const diffMs = now - date;
      const diffHrs = Math.floor(diffMs / (1000 * 60 * 60));
      const diffMins = Math.floor(diffMs / (1000 * 60));

      if (diffMins < 60) return `${diffMins}m ago`;
      if (diffHrs < 24) return `${diffHrs}h ago`;
      return date.toLocaleDateString("en-IN", { day: "numeric", month: "short" });
    } catch {
      return "—";
    }
  };

  // ─── Actions ─────────────────────────────────────────────────────────────
  const updateStatusDirectly = async (taskItem, newStatus) => {
    const { room, taskId } = taskItem;
    try {
      if (taskId) {
        await updateHousekeepingTask(taskId, { status: newStatus });
      } else {
        await createHousekeepingTask({
          roomId: room.id,
          roomNumber: room.roomNumber,
          roomName: room.name,
          floorId: room.floorId,
          floorName: room.floorName,
          status: newStatus,
          priority: "Medium",
        });
      }
      await loadData();
    } catch (err) {
      console.warn("HousekeepingManager: failed to update status:", err?.message || err);
      alert("Failed to update housekeeping status.");
    }
  };

  const openAssignModal = (taskItem) => {
    setSelectedTask(taskItem.taskId);
    setSelectedRoom(taskItem.room);
    setFormData({
      status: taskItem.status,
      priority: taskItem.priority || "Medium",
      assignedTo: taskItem.assignedTo,
      notes: taskItem.notes,
    });
    setIsModalOpen(true);
  };

  const handleSaveModal = async (e) => {
    e?.preventDefault();
    if (!selectedRoom) return;

    setSaving(true);
    try {
      if (selectedTask) {
        await updateHousekeepingTask(selectedTask, {
          status: formData.status,
          priority: formData.priority,
          assignedTo: formData.assignedTo,
          notes: formData.notes,
        });
      } else {
        await createHousekeepingTask({
          roomId: selectedRoom.id,
          roomNumber: selectedRoom.roomNumber,
          roomName: selectedRoom.name,
          floorId: selectedRoom.floorId,
          floorName: selectedRoom.floorName,
          status: formData.status,
          priority: formData.priority,
          assignedTo: formData.assignedTo,
          notes: formData.notes,
        });
      }
      setIsModalOpen(false);
      await loadData();
    } catch (err) {
      console.warn("HousekeepingManager: modal save failed:", err?.message || err);
      alert("Failed to save housekeeping details.");
    } finally {
      setSaving(false);
    }
  };

  // ─── Delete ──────────────────────────────────────────────────────────────
  const confirmDelete = (taskItem) => {
    setTaskToDelete(taskItem);
    setDeleteModalOpen(true);
  };

  const executeDelete = async () => {
    if (!taskToDelete?.taskId) return;
    setSaving(true);
    try {
      await deleteHousekeepingTask(taskToDelete.taskId);
      setDeleteModalOpen(false);
      setTaskToDelete(null);
      await loadData();
    } catch (err) {
      console.warn("HousekeepingManager: delete failed:", err?.message || err);
      alert("Failed to delete housekeeping record.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="flex flex-col gap-8">
      {/* Page Header */}
      <PageHeader
        title="Housekeeping & Room Cleaning"
        subtitle="Track live room cleanliness statuses, assign staff, manage priorities, and oversee room turnover workflow."
      >
        <div className="flex flex-wrap items-center gap-3 w-full">
          <SearchInput
            placeholder="Search by room #, name, staff…"
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
            options={filterStatusOptions}
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="w-64"
          />
          <AdminSelect
            options={filterStaffOptions}
            value={filterStaff}
            onChange={(e) => setFilterStaff(e.target.value)}
            className="w-64"
          />
        </div>
      </PageHeader>

      {/* Summary Statistic Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
        <AdminCard padding="p-6" className="border border-emerald-200 bg-emerald-50/40 rounded-xl">
          <div className="flex justify-between items-start mb-2">
            <span className="text-lg font-bold text-emerald-800 uppercase tracking-wider block">Clean</span>
            <div className="p-2 bg-emerald-100 rounded-lg"><CheckCircle2 className="w-6 h-6 text-emerald-700" /></div>
          </div>
          <div className="text-[48px] font-bold text-emerald-700 tracking-tight">{cleanCount}</div>
        </AdminCard>

        <AdminCard padding="p-6" className="border border-red-200 bg-red-50/40 rounded-xl">
          <div className="flex justify-between items-start mb-2">
            <span className="text-lg font-bold text-red-800 uppercase tracking-wider block">Dirty</span>
            <div className="p-2 bg-red-100 rounded-lg"><AlertTriangle className="w-6 h-6 text-red-700" /></div>
          </div>
          <div className="text-[48px] font-bold text-red-700 tracking-tight">{dirtyCount}</div>
        </AdminCard>

        <AdminCard padding="p-6" className="border border-amber-200 bg-amber-50/40 rounded-xl">
          <div className="flex justify-between items-start mb-2">
            <span className="text-lg font-bold text-amber-800 uppercase tracking-wider block">Cleaning</span>
            <div className="p-2 bg-amber-100 rounded-lg"><Clock className="w-6 h-6 text-amber-700" /></div>
          </div>
          <div className="text-[48px] font-bold text-amber-700 tracking-tight">{cleaningCount}</div>
        </AdminCard>

        <AdminCard padding="p-6" className="border border-blue-200 bg-blue-50/40 rounded-xl">
          <div className="flex justify-between items-start mb-2">
            <span className="text-lg font-bold text-blue-800 uppercase tracking-wider block">Inspection</span>
            <div className="p-2 bg-blue-100 rounded-lg"><Search className="w-6 h-6 text-blue-700" /></div>
          </div>
          <div className="text-[48px] font-bold text-blue-700 tracking-tight">{inspectionCount}</div>
        </AdminCard>

        <AdminCard padding="p-6" className="border border-slate-200 bg-slate-100/50 rounded-xl">
          <div className="flex justify-between items-start mb-2">
            <span className="text-lg font-bold text-slate-600 uppercase tracking-wider block">Out of Service</span>
            <div className="p-2 bg-slate-200 rounded-lg"><Wrench className="w-6 h-6 text-slate-600" /></div>
          </div>
          <div className="text-[48px] font-bold text-slate-700 tracking-tight">{oosCount}</div>
        </AdminCard>
      </div>

      {/* Main Table Card */}
      {loading ? (
        <SkeletonLoader type="table" count={4} />
      ) : combinedRoomTasks.length === 0 ? (
        <EmptyState
          icon={Sparkles}
          title="No Rooms Available"
          description="Add rooms in Rooms Manager to start tracking housekeeping."
        />
      ) : sortedTasks.length === 0 ? (
        <EmptyState
          icon={Sparkles}
          title="No Matching Cleaning Tasks"
          description="No rooms match your current search or filters. Try adjusting them."
        />
      ) : (
        <AdminCard padding="p-0" className="overflow-hidden border border-slate-200 bg-white shadow-sm rounded-xl">
          <AdminTable
            headers={["Room", "Floor", "Status", "Priority", "Assigned Staff", "Last Cleaned", "Notes", "Actions"]}
          >
            {sortedTasks.map((t) => {
              const { room, status, priority, assignedTo, notes, lastCleaned } = t;

              return (
                <AdminTableRow key={room.id}>
                  {/* Room Number & Name */}
                  <AdminTableCell>
                    <div className="flex items-center gap-3">
                      <span className="inline-flex items-center justify-center w-12 h-10 rounded-lg bg-blue-50 text-blue-700 font-bold text-lg">
                        {room.roomNumber || "—"}
                      </span>
                      <div>
                        <span className="font-semibold text-slate-900 block">{room.name || "Unnamed Room"}</span>
                        <span className="text-xs text-slate-400 block">₹{room.price || room.basePrice || 0}/night</span>
                      </div>
                    </div>
                  </AdminTableCell>

                  {/* Floor */}
                  <AdminTableCell>
                    <span className="text-slate-600 font-medium">{room.floorName || "Unassigned"}</span>
                  </AdminTableCell>

                  {/* Status */}
                  <AdminTableCell>
                    <StatusBadge status={status} />
                  </AdminTableCell>

                  {/* Priority */}
                  <AdminTableCell>
                    <PriorityBadge priority={priority} />
                  </AdminTableCell>

                  {/* Assigned Staff */}
                  <AdminTableCell>
                    {assignedTo ? (
                      <span className="text-slate-800 font-medium text-sm flex items-center gap-1.5">
                        <UserCheck className="w-4 h-4 text-blue-600 shrink-0" />
                        {assignedTo}
                      </span>
                    ) : (
                      <span className="text-slate-400 italic text-sm">Unassigned</span>
                    )}
                  </AdminTableCell>

                  {/* Last Cleaned */}
                  <AdminTableCell>
                    <span className="text-sm text-slate-500 font-mono">
                      {formatLastCleaned(lastCleaned)}
                    </span>
                  </AdminTableCell>

                  {/* Notes */}
                  <AdminTableCell>
                    <span className="text-sm text-slate-600 max-w-[200px] truncate block" title={notes}>
                      {notes || "—"}
                    </span>
                  </AdminTableCell>

                  {/* Actions */}
                  <AdminTableCell>
                    <div className="flex items-center gap-2">
                      {status !== "Clean" && (
                        <AdminButton
                          variant="secondary"
                          size="xs"
                          onClick={() => updateStatusDirectly(t, "Clean")}
                        >
                          Mark Clean
                        </AdminButton>
                      )}

                      {status === "Dirty" && (
                        <AdminButton
                          variant="outline"
                          size="xs"
                          onClick={() => updateStatusDirectly(t, "Cleaning")}
                        >
                          Start Cleaning
                        </AdminButton>
                      )}

                      {status === "Cleaning" && (
                        <AdminButton
                          variant="outline"
                          size="xs"
                          onClick={() => updateStatusDirectly(t, "Inspection")}
                        >
                          Send to Inspection
                        </AdminButton>
                      )}

                      <AdminButton
                        variant="ghost"
                        size="xs"
                        icon={Edit3}
                        onClick={() => openAssignModal(t)}
                      >
                        Assign / Edit
                      </AdminButton>

                      {t.taskId && (
                        <AdminButton
                          variant="danger"
                          size="xs"
                          onClick={() => confirmDelete(t)}
                        >
                          Reset
                        </AdminButton>
                      )}
                    </div>
                  </AdminTableCell>
                </AdminTableRow>
              );
            })}
          </AdminTable>

          {/* Footer */}
          <div className="bg-slate-50/80 border-t border-slate-100 px-5 py-3.5 flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
              {sortedTasks.length} {sortedTasks.length === 1 ? "Room" : "Rooms"} Tracked
            </span>
            <span className="text-xs text-slate-400">
              Automatic &apos;Dirty&apos; status triggered upon occupant check-out
            </span>
          </div>
        </AdminCard>
      )}

      {/* ── Assign Staff & Notes Modal ────────────────────────────────────── */}
      <AdminModal
        isOpen={isModalOpen}
        onClose={() => !saving && setIsModalOpen(false)}
        title={`Housekeeping Details — Room ${selectedRoom?.roomNumber || ""}`}
        footer={
          <>
            <AdminButton variant="ghost" onClick={() => setIsModalOpen(false)} disabled={saving}>
              Cancel
            </AdminButton>
            <AdminButton onClick={handleSaveModal} loading={saving}>
              Save Details
            </AdminButton>
          </>
        }
      >
        <form onSubmit={handleSaveModal} className="flex flex-col gap-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <AdminSelect
              label="Cleaning Status"
              required
              options={statusOptions}
              value={formData.status}
              onChange={(e) => setFormData({ ...formData, status: e.target.value })}
            />
            <AdminSelect
              label="Priority"
              required
              options={priorityOptions}
              value={formData.priority}
              onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
            />
          </div>

          <AdminInput
            label="Assigned Cleaning Staff"
            placeholder="e.g. Ramesh Kumar, Sunita Devi"
            value={formData.assignedTo}
            onChange={(e) => setFormData({ ...formData, assignedTo: e.target.value })}
          />

          <AdminTextarea
            label="Cleaning & Maintenance Notes"
            placeholder="e.g. Linen changed, bathroom disinfected, deep clean completed…"
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
        title="Reset Housekeeping Record"
        footer={
          <>
            <AdminButton variant="ghost" onClick={() => setDeleteModalOpen(false)} disabled={saving}>
              Cancel
            </AdminButton>
            <AdminButton variant="danger" onClick={executeDelete} loading={saving}>
              Reset Record
            </AdminButton>
          </>
        }
      >
        <div className="py-2">
          <p className="text-slate-600">
            Are you sure you want to reset the housekeeping record for{" "}
            <strong className="text-slate-900">Room {taskToDelete?.room?.roomNumber || "—"}</strong>?
          </p>
          <div className="flex items-center gap-2 p-3 mt-4 rounded-lg bg-amber-50 border border-amber-200 text-amber-800 text-sm">
            <ShieldAlert className="w-5 h-5 shrink-0 text-amber-600" />
            <span>This will remove the cleaning assignment, notes, and status. The room will default back to &quot;Clean&quot;.</span>
          </div>
        </div>
      </AdminModal>
    </div>
  );
}
